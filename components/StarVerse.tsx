"use client";

import { useEffect, useRef } from "react";

// The anchor verse, written in stars. A 2D canvas samples the key
// phrase set in the display font, then a field of drifting star
// particles converges onto the letterforms when the footer scrolls
// into view, settling into a gentle twinkle. Reduced motion renders
// the finished text immediately.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type P = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: number;
  size: number;
  ph: number;
  tint: number;
};

export default function StarVerse() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let disposed = false;
    let visible = false;
    let started = 0;
    let parts: P[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;

    // soft round star sprites, drawn once and stamped per particle:
    // most stars white, a few in the brand lavender
    const makeSprite = (r: number, g: number, b: number) => {
      const s = document.createElement("canvas");
      s.width = s.height = 32;
      const c = s.getContext("2d")!;
      const grad = c.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.55)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      c.fillStyle = grad;
      c.fillRect(0, 0, 32, 32);
      return s;
    };
    const sprite = makeSprite(255, 255, 255);
    const spriteLav = makeSprite(196, 170, 255);

    const build = async () => {
      await document.fonts.ready;
      if (disposed) return;
      const cw = wrap.clientWidth;
      const narrow = cw < 640;
      const lines = narrow
        ? ["LIKE THE STARS", "FOREVER AND EVER"]
        : ["LIKE THE STARS FOREVER AND EVER"];
      const family =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-display")
          .trim() || "sans-serif";

      // fit the longest line to ~92% of the width
      const meas = document.createElement("canvas").getContext("2d")!;
      let fs = narrow ? 44 : 72;
      meas.font = `800 ${fs}px ${family}`;
      const widest = Math.max(...lines.map((l) => meas.measureText(l).width));
      fs = Math.min(narrow ? 54 : 84, (fs * (cw * 0.92)) / widest);

      const lineH = fs * 1.22;
      W = cw;
      H = Math.round(lines.length * lineH + fs * 0.7);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      // sample the text at 1x for particle targets
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      o.fillStyle = "#fff";
      o.font = `800 ${fs}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      lines.forEach((l, i) => {
        o.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * lineH);
      });
      const data = o.getImageData(0, 0, W, H).data;
      const step = narrow ? 2 : 3;
      const pts: [number, number][] = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
        }
      }
      const MAX = 2400;
      while (pts.length > MAX) {
        pts.splice(Math.floor(Math.random() * pts.length), 1);
      }
      parts = pts.map(([tx, ty]) => ({
        sx: Math.random() * W,
        sy: Math.random() * H,
        tx,
        ty,
        // a soft left-to-right sweep with per-star scatter
        delay: (tx / W) * 900 + Math.random() * 650,
        size: Math.random() < 0.04 ? 2.6 : 0.9 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        tint: Math.random(),
      }));
      draw(reduced ? 1e9 : 0);
    };

    const ctx = () => canvas.getContext("2d")!;

    const draw = (t: number) => {
      const c = ctx();
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);
      for (const p of parts) {
        const k = clamp01((t - p.delay) / 1300);
        const e = easeOut(k);
        const x = p.sx + (p.tx - p.sx) * e;
        const y = p.sy + (p.ty - p.sy) * e;
        const settled = k >= 1;
        const tw = settled ? 0.6 + 0.4 * Math.sin(t / 640 + p.ph) : 0.55;
        c.globalAlpha = (0.28 + 0.72 * e) * tw;
        const s = p.size * (settled ? 2.6 : 2.2);
        c.drawImage(
          p.tint > 0.88 ? spriteLav : sprite,
          x - s / 2,
          y - s / 2,
          s,
          s,
        );
      }
      c.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!visible || disposed) return;
      if (!started) started = now;
      draw(now - started);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !visible) {
          visible = true;
          if (!reduced) raf = requestAnimationFrame(tick);
        } else if (!on) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);

    build();
    let rT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rT);
      rT = setTimeout(() => {
        started = 0;
        build();
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(rT);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />
      <p className="sr-only">Like the stars forever and ever</p>
    </div>
  );
}
