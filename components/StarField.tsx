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
      // Film scratch dashes, as on the brand page: short lived marks that
      // flicker in at random spots, barely move, and vanish.
      const angle = (Math.PI / 180) * (Math.random() * 60 - 30);
      const speed = 10 + Math.random() * 20;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        len: 6 + Math.random() * 14,
        angle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.4 + Math.random() * 1.0,
      };
    };

    const seed = (w: number, h: number) => {
      const count = Math.min(160, Math.floor((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.0 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1,
      }));
      const streakCount = Math.min(60, Math.floor((w * h) / 25000));
      streaks = Array.from({ length: streakCount }, spawnStreak);
      // Stagger initial lives so scratches do not pulse in unison.
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
          if (s.life > s.maxLife) {
            Object.assign(s, spawnStreak());
          }
        }
        // Quick flicker: fade in and out across the scratch's short life.
        const p = s.life / s.maxLife;
        const fade = Math.sin(Math.min(Math.PI, p * Math.PI));
        ctx.globalAlpha = 0.55 * resolve * fade;
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
