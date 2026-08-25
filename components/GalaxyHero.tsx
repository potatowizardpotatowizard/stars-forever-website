"use client";

import { useEffect, useRef } from "react";

// A living purple galaxy behind the apply hero: hundreds of stars in
// spiral arms with differential rotation (inner stars orbit faster),
// soft nebula clouds breathing around a white-hot core, all drawn
// additively so the light stacks and blooms. Reduced motion gets a
// single still frame.
type Star = {
  r: number;
  theta: number;
  size: number;
  tint: string;
  alpha: number;
  twinkle: number;
};

const TINTS = [
  "255, 255, 255",
  "216, 180, 254",
  "167, 139, 250",
  "196, 181, 253",
  "233, 213, 255",
  "139, 92, 246",
];

export default function GalaxyHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let W = 0;
    let H = 0;
    let stars: Star[] = [];

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = W < 768 ? 420 : 850;
      const maxR = Math.max(W, H) * 0.72;
      stars = Array.from({ length: count }, (_, i) => {
        const arm = i % 3;
        const t = Math.pow(Math.random(), 0.75);
        const r = 14 + t * maxR;
        const spread = 0.38 * (0.4 + t);
        return {
          r,
          theta:
            arm * ((Math.PI * 2) / 3) +
            r * 0.0042 +
            (Math.random() - 0.5) * spread * Math.PI,
          size: 0.6 + Math.random() * 2.0,
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          alpha: 0.35 + Math.random() * 0.65,
          twinkle: Math.random() * Math.PI * 2,
        };
      });
    };

    // galaxy center sits right of middle, up high, behind the copy's
    // empty side
    const draw = (t: number) => {
      const cx = W * 0.7;
      const cy = H * 0.48;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // breathing nebula clouds
      for (let i = 0; i < 4; i++) {
        const ang = t * 0.00004 * (i % 2 ? 1 : -1) + i * 1.7;
        const nx = cx + Math.cos(ang) * (60 + i * 46);
        const ny = cy + Math.sin(ang) * (34 + i * 26);
        const nr = 210 + i * 120 + Math.sin(t * 0.00035 + i) * 34;
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.16 + 0.05 * Math.sin(t * 0.0005 + i * 2)})`);
        g.addColorStop(0.55, "rgba(109, 40, 217, 0.08)");
        g.addColorStop(1, "rgba(109, 40, 217, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fill();
      }

      // the spiral: inner stars sweep faster than the rim
      for (const s of stars) {
        const speed = 0.00034 / (0.25 + s.r * 0.0021);
        const th = s.theta + t * speed;
        const x = cx + Math.cos(th) * s.r;
        const y = cy + Math.sin(th) * s.r * 0.62;
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
        const tw = 0.72 + 0.28 * Math.sin(t * 0.0016 + s.twinkle);
        ctx.fillStyle = `rgba(${s.tint}, ${(s.alpha * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (s.size > 1.6) {
          ctx.fillStyle = `rgba(${s.tint}, ${(0.1 * tw).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // white-hot core wrapped in violet
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 190);
      core.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      core.addColorStop(0.12, "rgba(233, 213, 255, 0.5)");
      core.addColorStop(0.4, "rgba(167, 139, 250, 0.22)");
      core.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    };

    build();
    if (reduced) {
      draw(40000);
    } else {
      const loop = (t: number) => {
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onResize = () => {
      build();
      if (reduced) draw(40000);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
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
