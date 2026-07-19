"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TRAIL_COUNT = 13;

// On the Constellation page only, the star also leaves a lingering
// ribbon along its path that fades after this many milliseconds.
const RIBBON_LIFE = 1300;

// The pointer becomes the signature four point star on fine-pointer
// devices, flying like a shooting star: a smooth comet tail chases
// it while it moves and melts back into the star when it rests. The
// tail is the same chain of chasing points as ever, but drawn as one
// continuous tapered streak instead of separate sparks. The native
// cursor is hidden sitewide (text fields keep their caret), and the
// star grows over anything clickable.
export default function StarCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ribbonHere = usePathname() === "/constellation";

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const wrap = wrapRef.current;
    const star = starRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !star || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.classList.add("star-cursor-active");

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let scale = 1;
    let targetScale = 1;
    let glow = 0;
    let pressed = false;
    let shown = false;
    const tail = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));
    const ribbon: { x: number; y: number; t: number }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        tail.forEach((p) => {
          p.x = tx;
          p.y = ty;
        });
      }
      const target = e.target as Element | null;
      const overText = !!target?.closest("input, textarea, select");
      const overLink = !!target?.closest(
        "a, button, [role='button'], label, summary",
      );
      targetScale = overLink ? 1.6 : 1;
      wrap.style.opacity = overText ? "0" : "1";
    };
    const down = () => {
      pressed = true;
    };
    const up = () => {
      pressed = false;
    };
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget) wrap.style.opacity = "0";
    };

    const tick = (now: number) => {
      const ease = reduced ? 1 : 0.3;
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      const goal = pressed ? targetScale * 0.72 : targetScale;
      scale += (goal - scale) * (reduced ? 1 : 0.25);
      const spin = reduced ? 0 : (now / 40) % 360;
      star.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${spin}deg) scale(${scale})`;

      if (!reduced) {
        // Same chasing-chain physics as the spark tail: each point
        // pursues the one ahead, and the whole streak only lights up
        // while the star is in flight.
        const speed = Math.hypot(tx - x, ty - y);
        glow += (Math.min(1, speed / 14) - glow) * 0.12;
        let px = x;
        let py = y;
        tail.forEach((p) => {
          p.x += (px - p.x) * 0.38;
          p.y += (py - p.y) * 0.38;
          px = p.x;
          py = p.y;
        });

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // The Constellation chemtrail: the traveled path lingers as a
        // fading ribbon, painted beneath the comet tail. Points are
        // only laid down on that page but always aged out, so the
        // ribbon finishes fading even after warping away.
        const last = ribbon[ribbon.length - 1];
        if (
          shown &&
          ribbonHere &&
          (!last || Math.hypot(x - last.x, y - last.y) > 1)
        ) {
          ribbon.push({ x, y, t: now });
        }
        while (ribbon.length && now - ribbon[0].t > RIBBON_LIFE) {
          ribbon.shift();
        }
        for (let i = 1; i < ribbon.length; i++) {
          const a = ribbon[i - 1];
          const b = ribbon[i];
          if (now - b.t > 250 && Math.hypot(b.x - a.x, b.y - a.y) > 80) {
            continue; // don't bridge jumps across the screen
          }
          const life = 1 - (now - b.t) / RIBBON_LIFE;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgb(109 40 217 / ${0.28 * life})`;
          ctx.lineWidth = 7 * life + 1;
          ctx.stroke();
          ctx.strokeStyle = `rgb(196 181 253 / ${0.75 * life})`;
          ctx.lineWidth = 2.2 * life + 0.4;
          ctx.stroke();
        }

        // The comet tail, drawn as one continuous tapered streak: a
        // soft violet halo under a bright core fading white to violet.
        let ax = x;
        let ay = y;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const b = tail[i];
          const k = 1 - i / TRAIL_COUNT;
          const a = glow * k;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgb(167 139 250 / ${0.35 * a})`;
          ctx.lineWidth = 8 * k + 1;
          ctx.stroke();
          ctx.strokeStyle =
            i < 3
              ? `rgb(239 236 247 / ${0.85 * a})`
              : `rgb(196 181 253 / ${0.7 * a})`;
          ctx.lineWidth = 3 * k + 0.5;
          ctx.stroke();
          ax = b.x;
          ay = b.y;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("star-cursor-active");
    };
  }, [ribbonHere]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[130] opacity-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={starRef}
        className="absolute left-0 top-0 h-5 w-5"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-full w-full text-starlight"
          fill="currentColor"
          style={{
            filter:
              "drop-shadow(0 0 5px rgb(167 139 250 / 0.9)) drop-shadow(0 0 14px rgb(109 40 217 / 0.6))",
          }}
        >
          <path d="M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z" />
        </svg>
      </div>
    </div>
  );
}
