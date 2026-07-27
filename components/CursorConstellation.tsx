"use client";

import { useEffect, useRef } from "react";

// A latent star field that only the visitor can light: dormant points
// scattered across the hero ignite as the cursor passes over them,
// flare into small four point stars, thread constellation lines to
// their lit neighbors, and fade back to sleep after a few seconds.
// Wherever the cursor goes, a constellation follows. On touch
// screens the sky ignites itself, slowly and at random, so the hero
// is never dead. Reduced motion sees a faint still field.
const LIFE = 6000; // ms a star stays lit after ignition
const REACH = 78; // cursor ignition radius, px
const LINK = 150; // max constellation line length, px

export default function CursorConstellation({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    let points: { x: number; y: number; lit: number; phase: number }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // A jittered grid: dense enough to paint with, sparse enough
      // to stay a night sky rather than a mesh.
      points = [];
      const gap = 92;
      for (let gx = gap / 2; gx < width; gx += gap) {
        for (let gy = gap / 2; gy < height; gy += gap) {
          points.push({
            x: gx + (Math.random() - 0.5) * 52,
            y: gy + (Math.random() - 0.5) * 52,
            lit: -Infinity,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const ignite = (px: number, py: number) => {
      const now = performance.now();
      for (const p of points) {
        if (Math.hypot(p.x - px, p.y - py) < REACH) p.lit = now;
      }
    };

    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) return;
      ignite(px, py);
    };

    let autoTimer: ReturnType<typeof setInterval> | undefined;
    if (!reduced) {
      window.addEventListener("pointermove", move, { passive: true });
      if (coarse) {
        autoTimer = setInterval(() => {
          const p = points[Math.floor(Math.random() * points.length)];
          if (p) p.lit = performance.now();
        }, 1100);
      }
    }

    const alphaOf = (p: (typeof points)[number], now: number) => {
      const age = now - p.lit;
      if (age < 0 || age > LIFE) return 0;
      const fadeIn = Math.min(1, age / 220);
      const fadeOut = Math.max(0, 1 - age / LIFE);
      return fadeIn * fadeOut;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // dormant field, barely there
      for (const p of points) {
        const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(now / 2400 + p.phase);
        ctx.fillStyle = `rgba(239, 236, 247, ${(reduced ? 0.14 : 0.08) * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      if (reduced) return;

      const lit = points
        .map((p) => ({ p, a: alphaOf(p, now) }))
        .filter(({ a }) => a > 0);

      // constellation lines between lit neighbors
      ctx.lineWidth = 1;
      for (let i = 0; i < lit.length; i++) {
        for (let j = i + 1; j < lit.length; j++) {
          const A = lit[i];
          const B = lit[j];
          const d = Math.hypot(A.p.x - B.p.x, A.p.y - B.p.y);
          if (d > LINK) continue;
          const a = Math.min(A.a, B.a) * (1 - d / LINK) * 0.6;
          ctx.strokeStyle = `rgba(196, 181, 253, ${a})`;
          ctx.beginPath();
          ctx.moveTo(A.p.x, A.p.y);
          ctx.lineTo(B.p.x, B.p.y);
          ctx.stroke();
        }
      }

      // the stars themselves: four soft spikes and a bright heart
      for (const { p, a } of lit) {
        const age = now - p.lit;
        if (age < 450) {
          const k = age / 450;
          ctx.strokeStyle = `rgba(196, 181, 253, ${(1 - k) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 + k * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
        const r = 4.5 * a + 1.5;
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        halo.addColorStop(0, `rgba(196, 181, 253, ${0.5 * a})`);
        halo.addColorStop(1, "rgba(167, 139, 250, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(239, 236, 247, ${0.9 * a})`;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y);
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x, p.y + r);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(autoTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
