"use client";

import { useEffect, useRef } from "react";

// Stars flying in from deep space toward the viewer: each star starts far
// back near the center of the sky and drifts outward, growing brighter as
// it approaches. Static under prefers reduced motion.
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

    const FAR = 1.0; // spawn depth
    const NEAR = 0.05; // recycle depth
    let width = 0;
    let height = 0;
    let scale = 0;
    let stars: { x: number; y: number; z: number; speed: number }[] = [];
    let raf = 0;
    let start = 0;
    let last = 0;

    const spawnStar = (initial: boolean) => ({
      // Unit-square offsets from the sky's center; z gives depth.
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: initial ? NEAR + Math.random() * (FAR - NEAR) : FAR,
      speed: 0.02 + Math.random() * 0.05, // depth per second: a slow approach
    });

    const seed = (w: number, h: number) => {
      const count = Math.min(320, Math.floor((w * h) / 3600));
      stars = Array.from({ length: count }, () => spawnStar(true));
    };

    const project = (s: { x: number; y: number; z: number }) => ({
      px: width / 2 + (s.x / s.z) * scale,
      py: height / 2 + (s.y / s.z) * scale,
    });

    const draw = (t: number) => {
      if (!start) {
        start = t;
        last = t;
      }
      const elapsed = (t - start) / 1000;
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      // The field resolves over the first few seconds, then holds.
      const resolve = Math.min(1, elapsed / 3.5);
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const before = project(s);
        if (!reduceMotion) {
          s.z -= s.speed * dt;
          if (s.z <= NEAR) Object.assign(s, spawnStar(false));
        }
        const { px, py } = project(s);
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) {
          Object.assign(s, spawnStar(false));
          continue;
        }

        // Approaching stars grow from a distant speck to a bright point.
        const depth = 1 - (s.z - NEAR) / (FAR - NEAR); // 0 far, 1 near
        const alpha = (0.15 + 0.75 * depth * depth) * resolve;
        const radius = 0.3 + 1.3 * depth;

        // A short motion trail pointing back where the star came from.
        const trailX = before.px - px;
        const trailY = before.py - py;
        const trailLen = Math.hypot(trailX, trailY);
        if (!reduceMotion && trailLen > 0.1 && depth > 0.3) {
          ctx.globalAlpha = alpha * 0.5;
          ctx.strokeStyle = "#efecf7";
          ctx.lineWidth = radius * 0.9;
          ctx.beginPath();
          ctx.moveTo(px + (trailX / trailLen) * (4 + 26 * depth * depth), py + (trailY / trailLen) * (4 + 26 * depth * depth));
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
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
      scale = Math.min(width, height) * 0.5;
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
