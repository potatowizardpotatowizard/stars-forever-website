"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 13;

// The pointer becomes the signature four point star on fine-pointer
// devices, flying like a shooting star: a comet tail of fading
// stardust chases it while it moves and melts away when it rests.
// The tail keeps the exact chase physics, length, widths, and colors
// of the spark version, but is drawn as one smooth continuous streak.
// The native cursor is hidden sitewide (text fields keep their
// caret), and the star grows over anything clickable.
export default function StarCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        // The tail: each point chases the one ahead of it, and the
        // whole streak only lights up while the star is in flight.
        // Identical to the spark tail; the points just aren't shown.
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

        // One smooth streak through the chain. Per segment, the core
        // width equals the old spark's diameter (7px tapering to 2),
        // the color is the same white-then-violet with the same
        // opacities, and a soft violet underlay stands in for the
        // sparks' glow halo.
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        let ax = x;
        let ay = y;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const b = tail[i];
          const width = Math.max(2, 7 - i * 0.6);
          const fade = glow * (1 - i / TRAIL_COUNT) * 0.65;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgb(167 139 250 / ${0.8 * fade * 0.35})`;
          ctx.lineWidth = width + 8;
          ctx.stroke();
          ctx.strokeStyle =
            i < 3
              ? `rgb(239 236 247 / ${0.95 * fade})`
              : `rgb(167 139 250 / ${0.9 * fade})`;
          ctx.lineWidth = width;
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
  }, []);

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
