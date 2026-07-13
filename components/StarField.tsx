"use client";

import { useEffect, useRef } from "react";

// The living sky behind the hero: faint twinkling stars plus slow drifting
// streaks, like scratches on old film stock. Static under reduced motion.
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
    let stars: {
      x: number;
      y: number;
      r: number;
      phase: number;
      speed: number;
    }[] = [];
    let streaks: {
      x: number;
      y: number;
      len: number;
      angle: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }[] = [];
    let raf = 0;
    let start = 0;
    let last = 0;

    const spawnStreak = () => {
      // Streaks drift slowly down and to the right, like the brand page.
      const angle = (Math.PI / 180) * (18 + Math.random() * 24);
      const speed = 6 + Math.random() * 10; // px per second: slow drift
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        len: 8 + Math.random() * 26,
        angle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 6 + Math.random() * 8,
      };
    };

    const seed = (w: number, h: number) => {
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1,
      }));
      const streakCount = Math.min(26, Math.floor(w / 55));
      streaks = Array.from({ length: streakCount }, spawnStreak);
      // Stagger initial lives so streaks do not pulse in unison.
      for (const s of streaks) s.life = Math.random() * s.maxLife;
    };

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
        const twinkle = reduceMotion
          ? 0.7
          : 0.55 + 0.45 * Math.sin(s.phase + elapsed * s.speed);
        ctx.globalAlpha = 0.65 * resolve * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#efecf7";
        ctx.fill();
      }

      for (const s of streaks) {
        if (!reduceMotion) {
          s.life += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.life > s.maxLife || s.x > width + 40 || s.y > height + 40) {
            Object.assign(s, spawnStreak(), { x: Math.random() * width, y: -20 });
          }
        }
        // Fade in and out across the streak's life.
        const p = s.life / s.maxLife;
        const fade = Math.sin(Math.min(Math.PI, p * Math.PI));
        ctx.globalAlpha = 0.5 * resolve * fade;
        ctx.strokeStyle = "#efecf7";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len,
        );
        ctx.stroke();
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
