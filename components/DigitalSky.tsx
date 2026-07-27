"use client";

import { useEffect, useRef } from "react";
import { SKY_NODES as NODES } from "@/content/niches";

// The dream, drawn: the digital world as a night sky where every
// niche burns as a lit four point star, always. There are no fixed
// lines: the visitor's cursor is the connector. Wherever it roams,
// constellation threads reach from it to the nearby niche stars,
// brightening them, and dissolve as it moves on. On touch screens a
// finger drag does the same. Reduced motion sees the lit sky, still.
//
// On touch screens (no cursor to roam) the sky instead performs the
// spreading dawn: ignition begins at Art in the heart of the chart
// and radiates outward, every thread holding once born, then the
// whole sky breathes out and begins again.
const GLOW_REACH = 160; // px within which the web glows around the cursor
const IGNITE = 620; // ms between ignitions (touch mode)
const HOLD = 6500; // fully lit, twinkling (touch mode)
const FADE = 1400; // dissolve before the cycle restarts (touch mode)

// The chart, hand authored: one fixed constellation on every
// screen, art directed line by line.
const EDGE_NAMES: [string, string][] = [
  ["Art", "Comedy"],
  ["Art", "Family"],
  ["Art", "Finance"],
  ["Art", "Fitness"],
  ["Art", "Music"],
  ["Beauty", "Cars"],
  ["Beauty", "Family"],
  ["Beauty", "Finance"],
  ["Beauty", "Travel"],
  ["Cars", "Science"],
  ["Cars", "Travel"],
  ["Comedy", "Film"],
  ["Comedy", "Music"],
  ["Comedy", "Outdoors"],
  ["Comedy", "Tech"],
  ["Education", "Family"],
  ["Education", "Fitness"],
  ["Education", "Fashion"],
  ["Education", "Science"],
  ["Family", "Finance"],
  ["Fashion", "Science"],
  ["Fashion", "Travel"],
  ["Film", "Finance"],
  ["Film", "Outdoors"],
  ["Food", "Gaming"],
  ["Food", "Sports"],
  ["Food", "Tech"],
  ["Gaming", "Music"],
  ["Gaming", "Tech"],
  ["Outdoors", "Sports"],
  ["Sports", "Tech"],
];
const LABEL_INDEX = new Map(NODES.map((n, i) => [n.label, i]));
const WEB_EDGES: [number, number][] = EDGE_NAMES.map(([a, b]) => [
  LABEL_INDEX.get(a)!,
  LABEL_INDEX.get(b)!,
]);

const STAR =
  "M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z";

export default function DigitalSky({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const spreading =
      !reduced && window.matchMedia("(pointer: coarse)").matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    let mx = -1;
    let my = -1;
    let inside = false;
    let rank: number[] = [];
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
      // Touch mode ignition order: distance from Art, outward.
      const art = NODES.find((n) => n.label === "Art") ?? NODES[0];
      const byDist = NODES.map((n, i) => ({
        i,
        d: Math.hypot((n.x - art.x) * width, (n.y - art.y) * height),
      })).sort((a, b) => a.d - b.d);
      rank = [];
      byDist.forEach((e, r) => {
        rank[e.i] = r;
      });
    };
    resize();
    window.addEventListener("resize", resize);

    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      inside = mx >= 0 && my >= 0 && mx <= rect.width && my <= rect.height;
    };
    if (!reduced) {
      window.addEventListener("pointermove", move, { passive: true });
    }

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

    // Touch mode: the dawn that spreads from Art and starts over.
    const drawSpreading = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const ct = t % TOTAL;
      const fadeAge = ct - (NODES.length * IGNITE + HOLD);
      const global = fadeAge > 0 ? Math.max(0, 1 - fadeAge / FADE) : 1;

      for (const d of dust) {
        const tw = 0.5 + 0.5 * Math.sin(t / 1600 + d.p);
        ctx.globalAlpha = 0.25 * tw;
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // threads appear when their later star ignites and hold on
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      for (const [i, j] of WEB_EDGES) {
        const born = Math.max(rank[i] ?? 0, rank[j] ?? 0) * IGNITE;
        if (ct <= born) continue;
        const k = Math.min(1, (ct - born) / 500);
        const A = pos(NODES[i]);
        const B = pos(NODES[j]);
        ctx.strokeStyle = `rgba(196, 181, 253, ${0.45 * k * global})`;
        ctx.beginPath();
        ctx.moveTo(A.px, A.py);
        ctx.lineTo(B.px, B.py);
        ctx.stroke();
      }

      ctx.textAlign = "center";
      NODES.forEach((n, i) => {
        const { px, py } = pos(n);
        const at = (rank[i] ?? 0) * IGNITE;
        const age = ct - at;
        if (age <= 0) {
          ctx.fillStyle = "rgba(151, 139, 173, 0.4)";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "10px ui-monospace, monospace";
          ctx.fillStyle = "rgba(151, 139, 173, 0.45)";
          ctx.fillText(n.label.toUpperCase(), px, py + 20);
          return;
        }
        if (age < 900) {
          const k = age / 900;
          ctx.strokeStyle = `rgba(196, 181, 253, ${(1 - k) * 0.8 * global})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(px, py, 4 + k * 34, 0, Math.PI * 2);
          ctx.stroke();
        }
        const tw = 0.82 + 0.18 * Math.sin(t / 420 + i * 1.7);
        const size =
          (5.5 + (i % 3)) * tw * (age < 500 ? 0.6 + 0.4 * (age / 500) : 1);
        drawStar(px, py, size, global, t / 4000 + i);
        ctx.font = "bold 10px ui-monospace, monospace";
        ctx.fillStyle = `rgba(239, 236, 247, ${0.85 * global})`;
        ctx.fillText(n.label.toUpperCase(), px, py + 22);
      });

      raf = requestAnimationFrame(drawSpreading);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

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

      // the resting web: dull threads always joining the stars
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (const [i, j] of WEB_EDGES) {
        const A = pos(NODES[i]);
        const B = pos(NODES[j]);
        ctx.strokeStyle = "rgba(151, 139, 173, 0.18)";
        ctx.beginPath();
        ctx.moveTo(A.px, A.py);
        ctx.lineTo(B.px, B.py);
        ctx.stroke();
      }

      // the glow follows the cursor across the chart: any thread it
      // passes near wakes with light, no lines of its own
      const near: number[] = [];
      const kin: number[] = [];
      if (!reduced && inside) {
        const segDist = (
          x1: number,
          y1: number,
          x2: number,
          y2: number,
        ) => {
          const vx = x2 - x1;
          const vy = y2 - y1;
          const len2 = vx * vx + vy * vy || 1;
          const t2 = Math.max(
            0,
            Math.min(1, ((mx - x1) * vx + (my - y1) * vy) / len2),
          );
          return Math.hypot(mx - (x1 + vx * t2), my - (y1 + vy * t2));
        };
        for (const [i, j] of WEB_EDGES) {
          const A = pos(NODES[i]);
          const B = pos(NODES[j]);
          const d2 = segDist(A.px, A.py, B.px, B.py);
          if (d2 > GLOW_REACH) continue;
          const a = 1 - d2 / GLOW_REACH;
          ctx.strokeStyle = `rgba(109, 40, 217, ${0.4 * a})`;
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(A.px, A.py);
          ctx.lineTo(B.px, B.py);
          ctx.stroke();
          ctx.strokeStyle = `rgba(196, 181, 253, ${0.75 * a})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(A.px, A.py);
          ctx.lineTo(B.px, B.py);
          ctx.stroke();
          if (a > 0.35) {
            kin.push(i, j);
          }
        }
        NODES.forEach((n, i) => {
          const { px, py } = pos(n);
          if (Math.hypot(px - mx, py - my) < GLOW_REACH) near.push(i);
        });
      }

      // the niches, all of them burning
      ctx.textAlign = "center";
      NODES.forEach((n, i) => {
        const { px, py } = pos(n);
        const connected = near.includes(i);
        const woken = kin.includes(i);
        const tw = reduced ? 1 : 0.82 + 0.18 * Math.sin(t / 420 + i * 1.7);
        const size =
          (5.5 + (i % 3)) * tw * (connected ? 1.35 : woken ? 1.15 : 1);
        drawStar(px, py, size, connected ? 1 : 0.9, reduced ? 0 : t / 4000 + i);
        ctx.font = "bold 10px ui-monospace, monospace";
        ctx.fillStyle = `rgba(239, 236, 247, ${connected || woken ? 1 : 0.8})`;
        ctx.fillText(n.label.toUpperCase(), px, py + 22);
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(spreading ? drawSpreading : draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="The digital world as a night sky of lit niches; move the cursor to draw constellations between them"
      className={className ?? "h-[62vh] min-h-[420px] w-full"}
    />
  );
}
