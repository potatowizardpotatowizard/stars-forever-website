"use client";

import { useEffect, useRef } from "react";

// A field of faint stars that slowly resolves behind the hero.
// Static under prefers reduced motion; gently twinkles otherwise.
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let stars: { x: number; y: number; r: number; phase: number; speed: number }[] =
      [];
    let raf = 0;
    let start = 0;

    const seed = (w: number, h: number) => {
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1,
      }));
    };

    const draw = (t: number) => {
      if (!start) start = t;
      const elapsed = (t - start) / 1000;
      // The field resolves over the first few seconds, then holds.
      const resolve = Math.min(1, elapsed / 3.5);
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reduceMotion
          ? 0.7
          : 0.55 + 0.45 * Math.sin(s.phase + elapsed * s.speed);
        ctx.globalAlpha = 0.65 * resolve * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#f2ecdf";
        ctx.fill();
      }
      if (!reduceMotion || resolve < 1) {
        raf = requestAnimationFrame(draw);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(width, height);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
