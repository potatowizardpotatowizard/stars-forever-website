"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// How long a point of the ribbon stays on screen before it has
// fully faded, in milliseconds.
const RIBBON_LIFE = 1300;

// Constellation-page chemtrail: the pointer's path lingers as a
// glowing ribbon that fades on its own, painted beneath the star
// cursor. Lives apart from StarCursor so the cursor itself stays
// exactly the original shooting star. Only active on /constellation;
// fine pointers only; reduced motion sees nothing.
export default function ConstellationTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = usePathname() === "/constellation";

  useEffect(() => {
    if (!active) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
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
      const last = ribbon[ribbon.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 1) {
        ribbon.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      }
    };

    const tick = (now: number) => {
      while (ribbon.length && now - ribbon[0].t > RIBBON_LIFE) ribbon.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
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
        // soft violet halo, then a bright core
        ctx.strokeStyle = `rgb(109 40 217 / ${0.28 * life})`;
        ctx.lineWidth = 7 * life + 1;
        ctx.stroke();
        ctx.strokeStyle = `rgb(196 181 253 / ${0.75 * life})`;
        ctx.lineWidth = 2.2 * life + 0.4;
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[129] h-full w-full"
    />
  );
}
