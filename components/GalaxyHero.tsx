"use client";

import { useEffect, useRef } from "react";

// A living purple galaxy in the hero's bottom right: stars in spiral
// arms with differential rotation around a white-hot core, breathing
// nebula clouds, and light speed streaks racing in from the left and
// bending down into the core. Reduced motion gets a single still
// frame with no streaks.
type Star = {
  r: number;
  theta: number;
  size: number;
  tint: string;
  alpha: number;
  twinkle: number;
};

type Streak = {
  x0: number;
  y0: number;
  offset: number;
  dur: number;
  w: number;
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
    let streaks: Streak[] = [];

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = W < 768 ? 300 : 560;
      const maxR = Math.max(W, H) * 0.46;
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
          alpha: 0.28 + Math.random() * 0.55,
          twinkle: Math.random() * Math.PI * 2,
        };
      });
      streaks = Array.from({ length: W < 768 ? 12 : 24 }, () => ({
        x0: -80 + Math.random() * W * 0.22,
        y0: H * (0.34 + Math.random() * 0.55),
        offset: Math.random() * 5000,
        dur: 2400 + Math.random() * 2600,
        w: 1.4 + Math.random() * 2.1,
      }));
    };

    // the galaxy lives in the hero's bottom right on desktop; phones
    // skip it and keep only the light speed streaks
    const draw = (t: number) => {
      const mobile = W < 768;
      const cx = W * 0.82;
      const cy = H * 0.72;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // breathing nebula clouds
      for (let i = 0; i < (mobile ? 0 : 4); i++) {
        const ang = t * 0.00004 * (i % 2 ? 1 : -1) + i * 1.7;
        const nx = cx + Math.cos(ang) * (34 + i * 26);
        const ny = cy + Math.sin(ang) * (20 + i * 15);
        const nr = 120 + i * 66 + Math.sin(t * 0.00035 + i) * 20;
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        g.addColorStop(0, `rgba(139, 92, 246, ${0.12 + 0.04 * Math.sin(t * 0.0005 + i * 2)})`);
        g.addColorStop(0.55, "rgba(109, 40, 217, 0.08)");
        g.addColorStop(1, "rgba(109, 40, 217, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fill();
      }

      // the spiral: inner stars sweep faster than the rim
      for (const s of mobile ? [] : stars) {
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
      if (!mobile) {
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
        core.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        core.addColorStop(0.12, "rgba(233, 213, 255, 0.5)");
        core.addColorStop(0.4, "rgba(167, 139, 250, 0.22)");
        core.addColorStop(1, "rgba(167, 139, 250, 0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx, cy, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      // light speed: streaks tear in from the left under the copy,
      // bending into the core on desktop and racing clean off the
      // right edge on phones, tails stretched by their speed
      if (!reduced) {
        ctx.lineCap = "round";
        for (const sk of streaks) {
          const local = ((t + sk.offset) % sk.dur) / sk.dur;
          const tx = mobile ? W + 140 : cx;
          const ty = mobile ? sk.y0 - 24 : cy;
          const bez = (e: number) => {
            const u = 1 - e;
            const mx = (sk.x0 + tx) / 2;
            return {
              x: u * u * sk.x0 + 2 * u * e * mx + e * e * tx,
              y: u * u * sk.y0 + 2 * u * e * sk.y0 + e * e * ty,
            };
          };
          const head = bez(Math.pow(local, 2.1));
          const tail = bez(Math.pow(Math.max(0, local - 0.09), 2.1));
          const alpha =
            Math.min(1, local / 0.14) *
            (1 - Math.max(0, (local - 0.8) / 0.2));
          if (alpha <= 0.01) continue;
          const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          g.addColorStop(0, "rgba(139, 92, 246, 0)");
          g.addColorStop(0.6, `rgba(196, 181, 253, ${(alpha * 0.5).toFixed(3)})`);
          g.addColorStop(1, `rgba(255, 255, 255, ${alpha.toFixed(3)})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = sk.w;
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(head.x, head.y);
          ctx.stroke();
          ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.9).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(head.x, head.y, sk.w * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
