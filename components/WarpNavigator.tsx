"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// The signature move: internal navigation is a hyperspace jump. Clicking a
// link accelerates a star field to light speed over ~450ms, the screen
// whites out to black, the route changes, and the destination fades in.
// Reduced motion users navigate normally.

type Phase = "idle" | "warping" | "arriving";

const WARP_MS = 480;
const ARRIVE_MS = 350;

export default function WarpNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const jumping = useRef(false);
  const raf = useRef(0);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // Draw an accelerating star field on the overlay canvas.
  const runWarp = useCallback((onDone: () => void) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDone();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scale = Math.min(w, h) * 0.5;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: 0.08 + Math.random() * 0.92,
    }));

    let start = 0;
    const frame = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / WARP_MS);
      // Speed ramps hard toward the end of the jump.
      const speed = 0.4 + 5 * p * p;

      ctx.clearRect(0, 0, w, h);
      // Darken toward black as the jump completes.
      ctx.globalAlpha = 0.25 + 0.75 * p;
      ctx.fillStyle = "#07050c";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.z -= (speed * 0.016 * s.z + 0.002);
        if (s.z <= 0.02) s.z = 1;
        const px = w / 2 + (s.x / s.z) * scale;
        const py = h / 2 + (s.y / s.z) * scale;
        const bx = w / 2 + (s.x / Math.min(1, s.z + 0.04 + 0.25 * p)) * scale;
        const by = h / 2 + (s.y / Math.min(1, s.z + 0.04 + 0.25 * p)) * scale;
        const depth = 1 - s.z;
        ctx.globalAlpha = (0.2 + 0.7 * depth) * (0.5 + 0.5 * p);
        ctx.strokeStyle = "#efecf7";
        ctx.lineWidth = 0.6 + 1.6 * depth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      if (p < 1) {
        raf.current = requestAnimationFrame(frame);
      } else {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#07050c";
        ctx.fillRect(0, 0, w, h);
        onDone();
      }
    };
    raf.current = requestAnimationFrame(frame);
  }, []);

  // Intercept internal link clicks.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (phaseRef.current !== "idle") return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const [path] = href.split("#");
      if (href.includes("#") && (path === "" || path === window.location.pathname)) {
        return; // same page anchor
      }
      if (path === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      jumping.current = true;
      setPhaseBoth("warping");
      runWarp(() => {
        router.push(href);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(raf.current);
    };
  }, [router, runWarp]);

  // When the route actually changes after a jump, fade in from black.
  useEffect(() => {
    if (!jumping.current) return;
    jumping.current = false;
    setPhaseBoth("arriving");
    const t = setTimeout(() => setPhaseBoth("idle"), ARRIVE_MS + 60);
    return () => clearTimeout(t);
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={
        phase === "arriving"
          ? {
              backgroundColor: "#07050c",
              animation: `warp-arrive ${ARRIVE_MS}ms ease-out forwards`,
            }
          : undefined
      }
    >
      {phase === "warping" ? (
        <canvas ref={canvasRef} className="h-full w-full" />
      ) : null}
    </div>
  );
}
