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

type Trail = {
  y0: number;
  tilt: number;
  w: number;
  speed: number;
  phase: number;
  alpha: number;
  glow: string;
  core: string;
};

const TRAIL_GLOWS = ["139, 92, 246", "109, 40, 217", "167, 139, 250"];
const TRAIL_CORES = ["243, 236, 255", "224, 211, 255", "255, 250, 255"];

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
    let trails: Trail[] = [];

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
      // the light trail band starts exactly where the hero copy ends
      let bandTop = 0.55;
      const marks = canvas.parentElement!.querySelectorAll("h1, p");
      let copyBottom = 0;
      const heroTop = rect.top;
      marks.forEach((m) => {
        copyBottom = Math.max(copyBottom, m.getBoundingClientRect().bottom - heroTop);
      });
      if (copyBottom > 0) {
        bandTop = Math.min(0.85, Math.max(0.25, (copyBottom + 26) / H));
      }
      trails = Array.from({ length: W < 768 ? 12 : 16 }, () => {
        const thick = Math.random() < 0.35;
        return {
          y0: H * (bandTop + Math.random() * (0.97 - bandTop)),
          tilt: (Math.random() - 0.5) * H * 0.04,
          w: thick ? 5 + Math.random() * 8 : 1 + Math.random() * 1.6,
          speed: 0.00012 + Math.random() * 0.00022,
          phase: Math.random(),
          alpha: 0.45 + Math.random() * 0.5,
          glow: TRAIL_GLOWS[Math.floor(Math.random() * TRAIL_GLOWS.length)],
          core: TRAIL_CORES[Math.floor(Math.random() * TRAIL_CORES.length)],
        };
      });
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

      // long exposure light trails, purple, pulling left to right:
      // full width bands that converge gently toward the right, thick
      // soft ones and hairline crisp ones layered, each with a hot
      // pulse of light racing along it
      if (!reduced) {
        ctx.lineCap = "butt";
        for (const tr of trails) {
          const y1 = tr.y0 + tr.tilt;
          const seg = (a: number, b: number) => ({
            ax: -60 + (W + 120) * a,
            ay: tr.y0 + (y1 - tr.y0) * a,
            bx: -60 + (W + 120) * b,
            by: tr.y0 + (y1 - tr.y0) * b,
          });
          // the standing trail: wide glow, tighter mid, thin core
          const full = seg(0, 1);
          ctx.strokeStyle = `rgba(${tr.glow}, ${(0.16 * tr.alpha).toFixed(3)})`;
          ctx.lineWidth = tr.w * 3.4;
          ctx.beginPath();
          ctx.moveTo(full.ax, full.ay);
          ctx.lineTo(full.bx, full.by);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${tr.glow}, ${(0.34 * tr.alpha).toFixed(3)})`;
          ctx.lineWidth = tr.w * 1.7;
          ctx.beginPath();
          ctx.moveTo(full.ax, full.ay);
          ctx.lineTo(full.bx, full.by);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${tr.core}, ${(0.55 * tr.alpha).toFixed(3)})`;
          ctx.lineWidth = Math.max(1, tr.w * 0.55);
          ctx.beginPath();
          ctx.moveTo(full.ax, full.ay);
          ctx.lineTo(full.bx, full.by);
          ctx.stroke();

          // the light racing down the trail, left to right
          const u = ((t * tr.speed + tr.phase) % 1.25) - 0.125;
          const p = seg(Math.max(0, u - 0.16), Math.min(1, u + 0.02));
          if (u > -0.05 && u < 1.05) {
            const g = ctx.createLinearGradient(p.ax, p.ay, p.bx, p.by);
            g.addColorStop(0, `rgba(${tr.glow}, 0)`);
            g.addColorStop(0.6, `rgba(${tr.core}, ${(0.6 * tr.alpha).toFixed(3)})`);
            g.addColorStop(0.92, `rgba(255, 255, 255, ${(0.95 * tr.alpha).toFixed(3)})`);
            g.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.strokeStyle = g;
            ctx.lineWidth = tr.w * 1.1;
            ctx.beginPath();
            ctx.moveTo(p.ax, p.ay);
            ctx.lineTo(p.bx, p.by);
            ctx.stroke();
          }
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
