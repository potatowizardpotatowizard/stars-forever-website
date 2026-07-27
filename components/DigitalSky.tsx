"use client";

import { useEffect, useRef } from "react";

// The dream, drawn: the digital world as a night sky where every
// niche is a dark point of space. One by one they ignite into
// four point stars as creators who love Jesus reach them, lines
// joining the lit ones into a constellation, until the whole sky
// shines. It holds, breathes, then begins again. Reduced motion
// sees the finished sky, fully lit and still.
const NODES: { label: string; x: number; y: number }[] = [
  { label: "Food", x: 0.1, y: 0.26 },
  { label: "Gaming", x: 0.24, y: 0.14 },
  { label: "Music", x: 0.4, y: 0.24 },
  { label: "Fitness", x: 0.57, y: 0.12 },
  { label: "Travel", x: 0.74, y: 0.22 },
  { label: "Fashion", x: 0.9, y: 0.14 },
  { label: "Sports", x: 0.07, y: 0.55 },
  { label: "Tech", x: 0.2, y: 0.42 },
  { label: "Comedy", x: 0.34, y: 0.52 },
  { label: "Art", x: 0.48, y: 0.4 },
  { label: "Beauty", x: 0.63, y: 0.48 },
  { label: "Cars", x: 0.78, y: 0.42 },
  { label: "Science", x: 0.9, y: 0.56 },
  { label: "Outdoors", x: 0.12, y: 0.78 },
  { label: "Film", x: 0.3, y: 0.72 },
  { label: "Finance", x: 0.48, y: 0.68 },
  { label: "Family", x: 0.66, y: 0.74 },
  { label: "Education", x: 0.84, y: 0.78 },
];
// Ignition order: scattered across the sky, not a sweep.
const ORDER = [9, 2, 14, 5, 7, 16, 0, 11, 3, 13, 6, 10, 1, 17, 4, 8, 12, 15];

const IGNITE = 620; // ms between ignitions
const HOLD = 6500; // fully lit, twinkling
const FADE = 1400; // dissolve before the cycle begins again

const STAR =
  "M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z";

export default function DigitalSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    const starPath = new Path2D(STAR);
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 0.9,
      p: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pos = (n: (typeof NODES)[number]) => ({
      px: n.x * width,
      py: n.y * height,
    });

    const drawStar = (
      px: number,
      py: number,
      size: number,
      alpha: number,
      rot: number,
    ) => {
      const halo = ctx.createRadialGradient(px, py, 0, px, py, size * 3.4);
      halo.addColorStop(0, `rgba(220, 210, 255, ${0.8 * alpha})`);
      halo.addColorStop(0.45, `rgba(167, 139, 250, ${0.35 * alpha})`);
      halo.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, size * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      const s = size / 12;
      ctx.scale(s, s);
      ctx.translate(-12, -12);
      ctx.fillStyle = `rgba(239, 236, 247, ${alpha})`;
      ctx.fill(starPath);
      ctx.restore();
    };

    const TOTAL = ORDER.length * IGNITE + HOLD + FADE;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const ct = reduced ? ORDER.length * IGNITE + 1000 : t % TOTAL;
      const fadeAge = ct - (ORDER.length * IGNITE + HOLD);
      const global = fadeAge > 0 ? Math.max(0, 1 - fadeAge / FADE) : 1;

      // background dust
      for (const d of dust) {
        const tw = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(t / 1600 + d.p);
        ctx.globalAlpha = 0.25 * tw;
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const lit: number[] = [];
      NODES.forEach((_, i) => {
        const at = ORDER.indexOf(i) * IGNITE;
        if (ct > at) lit.push(i);
      });

      // constellation lines between each lit node and its two nearest
      // lit neighbors
      ctx.lineWidth = 1.4;
      for (const i of lit) {
        const a = pos(NODES[i]);
        const near = lit
          .filter((j) => j !== i)
          .map((j) => {
            const b = pos(NODES[j]);
            return { j, d: Math.hypot(b.px - a.px, b.py - a.py) };
          })
          .sort((x, y) => x.d - y.d)
          .slice(0, 2);
        for (const { j } of near) {
          if (j < i) continue; // draw each pair once
          const b = pos(NODES[j]);
          ctx.strokeStyle = `rgba(196, 181, 253, ${0.45 * global})`;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.stroke();
        }
      }

      // the niches themselves
      ctx.textAlign = "center";
      NODES.forEach((n, i) => {
        const { px, py } = pos(n);
        const at = ORDER.indexOf(i) * IGNITE;
        const age = ct - at;
        const isLit = age > 0;

        if (!isLit) {
          // waiting in the dark
          ctx.fillStyle = "rgba(151, 139, 173, 0.4)";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "10px ui-monospace, monospace";
          ctx.fillStyle = "rgba(151, 139, 173, 0.45)";
          ctx.fillText(n.label.toUpperCase(), px, py + 20);
          return;
        }

        // ignition flare: an expanding ring of light
        if (!reduced && age < 900) {
          const k = age / 900;
          ctx.strokeStyle = `rgba(196, 181, 253, ${(1 - k) * 0.8 * global})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(px, py, 4 + k * 34, 0, Math.PI * 2);
          ctx.stroke();
        }

        const tw = reduced ? 1 : 0.82 + 0.18 * Math.sin(t / 420 + i * 1.7);
        const size = (5.5 + (i % 3)) * (age < 500 ? 0.6 + 0.4 * (age / 500) : 1);
        drawStar(px, py, size * tw, global, reduced ? 0 : t / 4000 + i);
        ctx.font = "bold 10px ui-monospace, monospace";
        ctx.fillStyle = `rgba(239, 236, 247, ${0.85 * global})`;
        ctx.fillText(n.label.toUpperCase(), px, py + 22);
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="The digital world as a night sky: every niche lighting up with creators who love Jesus"
      className="h-[62vh] min-h-[420px] w-full"
    />
  );
}
