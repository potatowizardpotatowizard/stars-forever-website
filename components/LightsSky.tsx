"use client";

import { useEffect, useRef, useState } from "react";

// The shared night sky: every point is a prayer someone left. Tap
// anywhere to add yours; it glows brightest for you, then joins the
// others. New lights persist through the API into Notion.
export default function LightsSky({
  points,
}: {
  points: { x: number; y: number }[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mine, setMine] = useState<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const tw = 0.5 + 0.5 * Math.sin(now / 1400 + i * 1.7);
        ctx.globalAlpha = 0.35 + 0.45 * tw;
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.1 + tw * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const m of mine) {
        const age = (now - m.t) / 1000;
        const flare = Math.max(0, 1 - age / 2.5);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (flare > 0) {
          ctx.globalAlpha = flare * 0.5;
          ctx.fillStyle = "#a78bfa";
          ctx.beginPath();
          ctx.arc(m.x * w, m.y * h, 2 + 16 * (1 - flare), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [points, mine]);

  const tap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMine((m) => [...m, { x, y, t: performance.now() }]);
    fetch("/api/lights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y }),
    }).catch(() => {});
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={tap}
      aria-label="Tap to add your light to the sky"
      className="h-[70svh] w-full cursor-crosshair"
    />
  );
}
