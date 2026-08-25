"use client";

import { useEffect, useRef } from "react";

// A living purple galaxy tucked into the hero's top right corner:
// stars in spiral arms with differential rotation around a white-hot
// core, breathing nebula clouds, and, drifting in the space below the
// copy, the words that hold creators back (fear, anxiety,
// unworthiness...) getting pulled off their feet and swallowed into
// the galaxy one by one. Reduced motion gets a single still frame.
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

const WORDS = [
  "FEAR",
  "ANXIETY",
  "UNWORTHINESS",
  "DOUBT",
  "SHAME",
  "COMPARISON",
  "INSECURITY",
  "DISTRACTION",
];

type Word = {
  text: string;
  x0: number;
  y0: number;
  offset: number;
  dur: number;
  lastLocal: number;
};

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
    let words: Word[] = [];

    const spawnWord = (w: Word) => {
      w.x0 = W * (0.08 + Math.random() * 0.6);
      w.y0 = H * (0.78 + Math.random() * 0.17);
    };

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = W < 768 ? 300 : 560;
      const maxR = Math.max(W, H) * 0.4;
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
      words = WORDS.map((text, i) => {
        const w: Word = {
          text,
          x0: 0,
          y0: 0,
          offset: i * 1500 + Math.random() * 700,
          dur: 9500,
          lastLocal: 0,
        };
        spawnWord(w);
        return w;
      });
    };

    // the galaxy lives in the top right corner
    const draw = (t: number) => {
      const cx = W * 0.86;
      const cy = H * 0.22;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // breathing nebula clouds
      for (let i = 0; i < 4; i++) {
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
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
      core.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      core.addColorStop(0.12, "rgba(233, 213, 255, 0.5)");
      core.addColorStop(0.4, "rgba(167, 139, 250, 0.22)");
      core.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      // the words that hold you back, drifting, then dragged into the
      // galaxy along a shrinking spiral and swallowed
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const w of words) {
        const local = ((t + w.offset) % w.dur) / w.dur;
        if (local < w.lastLocal) spawnWord(w);
        w.lastLocal = local;
        let x = w.x0;
        let y = w.y0;
        let alpha = 0;
        let size = W < 768 ? 12 : 14;
        if (local < 0.5) {
          const fadeIn = Math.min(1, local / 0.1);
          alpha = 0.5 * fadeIn;
          x += Math.sin(t * 0.0006 + w.offset) * 7;
          y += Math.cos(t * 0.0005 + w.offset) * 5;
        } else {
          const v = (local - 0.5) / 0.45;
          if (v >= 1) continue;
          const e = v * v;
          const dx = w.x0 - cx;
          const dy = w.y0 - cy;
          const r0 = Math.hypot(dx, dy);
          const ang0 = Math.atan2(dy, dx);
          const r = r0 * (1 - e);
          const ang = ang0 + 2.6 * e;
          x = cx + Math.cos(ang) * r;
          y = cy + Math.sin(ang) * r * 0.85;
          alpha = 0.5 * (1 - Math.max(0, (v - 0.7) / 0.3));
          size *= 1 - 0.6 * e;
        }
        if (alpha <= 0.01) continue;
        ctx.font = `700 ${size.toFixed(1)}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(196, 181, 253, ${alpha.toFixed(3)})`;
        ctx.fillText(w.text, x, y);
      }
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
