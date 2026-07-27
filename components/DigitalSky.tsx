"use client";

import { useEffect, useRef } from "react";
import { SKY_NODES as NODES } from "@/content/niches";

// The dream, drawn: the digital world as a night sky where every
// niche is a dark point of space. One by one they ignite into
// four point stars as creators who love Jesus reach them, lines
// joining the lit ones into a constellation, until the whole sky
// shines. It holds, breathes, then begins again. Reduced motion
// sees the finished sky, fully lit and still.

const STAR =
  "M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z";

export default function DigitalSky({
  variant = "full",
  className,
}: {
  variant?: "full" | "teaser";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const teaser = variant === "teaser";
    const IGNITE = teaser ? 1500 : 620; // ms between ignitions
    const HOLD = teaser ? 9000 : 6500; // fully lit, twinkling
    const FADE = teaser ? 2600 : 1400; // dissolve before the cycle restarts
    const dim = teaser ? 0.55 : 1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    // Ignition ranks: Art sits at the heart of the sky, so the light
    // starts there and spreads outward ring by ring.
    let rank: number[] = [];
    // The web, precomputed: each star, on igniting, ties itself to up
    // to three stars that lit before it. Once made, a line holds
    // until the whole sky breathes out at the cycle's end.
    let edges: { a: number; b: number; at: number }[] = [];
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
      const art = NODES.find((n) => n.label === "Art") ?? NODES[0];
      const ax = art.x * width;
      const ay = art.y * height;
      const byDist = NODES.map((n, i) => ({
        i,
        d: Math.hypot(n.x * width - ax, n.y * height - ay),
      })).sort((a, b) => a.d - b.d);
      rank = [];
      byDist.forEach((e, r) => {
        rank[e.i] = r;
      });
      edges = [];
      NODES.forEach((n, i) => {
        if (rank[i] === 0) return;
        const elders = NODES.map((m, j) => ({ j, m }))
          .filter(({ j }) => rank[j] < rank[i])
          .map(({ j, m }) => ({
            j,
            d: Math.hypot((m.x - n.x) * width, (m.y - n.y) * height),
          }))
          .sort((x, y) => x.d - y.d)
          .slice(0, 3);
        for (const { j } of elders) {
          edges.push({ a: i, b: j, at: rank[i] * IGNITE });
        }
      });
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

    const TOTAL = NODES.length * IGNITE + HOLD + FADE;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const ct = reduced ? NODES.length * IGNITE + 1000 : t % TOTAL;
      const fadeAge = ct - (NODES.length * IGNITE + HOLD);
      const global =
        (fadeAge > 0 ? Math.max(0, 1 - fadeAge / FADE) : 1) * dim;

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

      // the web: every line born stays until the sky breathes out
      ctx.lineWidth = 1.4;
      for (const e of edges) {
        if (ct <= e.at) continue;
        const born = Math.min(1, (ct - e.at) / 500);
        const A = pos(NODES[e.a]);
        const B = pos(NODES[e.b]);
        ctx.strokeStyle = `rgba(196, 181, 253, ${0.45 * born * global})`;
        ctx.beginPath();
        ctx.moveTo(A.px, A.py);
        ctx.lineTo(B.px, B.py);
        ctx.stroke();
      }

      // the niches themselves
      ctx.textAlign = "center";
      NODES.forEach((n, i) => {
        const { px, py } = pos(n);
        const at = (rank[i] ?? 0) * IGNITE;
        const age = ct - at;
        const isLit = age > 0;

        if (!isLit) {
          // waiting in the dark
          ctx.fillStyle = `rgba(151, 139, 173, ${0.4 * dim})`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          if (!teaser) {
            ctx.font = "10px ui-monospace, monospace";
            ctx.fillStyle = "rgba(151, 139, 173, 0.45)";
            ctx.fillText(n.label.toUpperCase(), px, py + 20);
          }
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
        if (!teaser) {
          ctx.font = "bold 10px ui-monospace, monospace";
          ctx.fillStyle = `rgba(239, 236, 247, ${0.85 * global})`;
          ctx.fillText(n.label.toUpperCase(), px, py + 22);
        }
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="The digital world as a night sky: every niche lighting up with creators who love Jesus"
      className={className ?? "h-[62vh] min-h-[420px] w-full"}
    />
  );
}
