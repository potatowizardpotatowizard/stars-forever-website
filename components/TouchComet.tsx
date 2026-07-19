"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The star cursor's magic, ported to fingertips: dragging on a touch
// screen leaves the same comet streak, melting away half a second
// after it is drawn. On the Constellation page the streak lingers,
// exactly like the desktop chemtrail. Touch devices only.
const TAIL_LIFE = 500;
const CONSTELLATION_LIFE = 1300;

export default function TouchComet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lingering = usePathname() === "/constellation";

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const life = lingering ? CONSTELLATION_LIFE : TAIL_LIFE;
    let raf = 0;
    let running = false;
    const trail: { x: number; y: number; t: number }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (now: number) => {
      while (trail.length && now - trail[0].t > life) trail.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) > 120) continue; // new stroke
        const k = 1 - (now - b.t) / life;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgb(109 40 217 / ${0.3 * k})`;
        ctx.lineWidth = 8 * k + 1;
        ctx.stroke();
        ctx.strokeStyle = `rgb(196 181 253 / ${0.8 * k})`;
        ctx.lineWidth = 2.5 * k + 0.5;
        ctx.stroke();
      }
      if (trail.length) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const move = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const last = trail[trail.length - 1];
      if (last && Math.hypot(t.clientX - last.x, t.clientY - last.y) < 2) {
        return;
      }
      trail.push({ x: t.clientX, y: t.clientY, t: performance.now() });
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("touchmove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("resize", resize);
    };
  }, [lingering]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] h-full w-full"
    />
  );
}
