"use client";

import { useEffect, useRef, useState } from "react";

// The hidden star's secret. When "sf-goldstar" fires, the whole
// screen cuts to black and purple code rains down it. Out of the
// rain, the message: MYSTERY MAKES HISTORY, and then the invitation
// to reach out. Click or Escape closes it once delivered.
const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$+*<>/";

export default function CodeRain() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onGold = () => setOpen(true);
    window.addEventListener("sf-goldstar", onGold);
    return () => window.removeEventListener("sf-goldstar", onGold);
  }, []);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const FS = 16;
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#16092e";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      cols = Math.ceil(window.innerWidth / FS);
      drops = Array.from(
        { length: cols },
        () => Math.random() * -(window.innerHeight / FS),
      );
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 50) return; // classic rain cadence
      last = t;
      ctx.fillStyle = "rgba(22, 9, 46, 0.08)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${FS}px "Fragment Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const y = drops[i] * FS;
        if (y > 0) {
          // bright head, dimmer body left behind by the trail fade
          ctx.fillStyle = "rgba(237, 233, 254, 0.95)";
          ctx.fillText(ch, i * FS, y);
          ctx.fillStyle = "rgba(167, 139, 250, 0.8)";
          ctx.fillText(ch, i * FS, y - FS);
        }
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        } else {
          drops[i] += 1;
        }
      }
    };
    if (!reduced) raf = requestAnimationFrame(draw);

    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const auto = setTimeout(close, 18000);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(auto);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="You found the secret"
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[150] cursor-pointer bg-[#16092e]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="code-msg code-msg-1 font-meta text-2xl font-bold uppercase tracking-[0.3em] sm:text-4xl">
          Mystery makes history
        </p>
        <p className="code-msg code-msg-2 font-meta text-sm uppercase tracking-[0.2em] sm:text-base">
          You found the secret, reach out to Auzi
        </p>
      </div>
    </div>
  );
}
