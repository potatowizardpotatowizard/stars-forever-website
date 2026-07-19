"use client";

import { useEffect, useRef } from "react";

// Scroll fast enough anywhere on the site and the space between the
// content briefly goes to lightspeed: star streaks rush opposite the
// scroll, then vanish the moment you slow down. Tuned so ordinary
// wheel flicks trigger it, not just violent trackpad flings.
// Skipped under reduced motion.
export default function WarpScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let running = false;
    let lastY = window.scrollY;
    let lastScrollT = performance.now();
    let lastFrameT = performance.now();
    let velocity = 0; // px per second, signed
    const streaks: {
      x: number;
      y: number;
      len: number;
      speed: number;
      alpha: number;
      width: number;
      violet: boolean;
    }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrameT) / 1000);
      lastFrameT = now;
      // Decay to ~12% per second so wheel notches chain together.
      velocity *= Math.pow(0.12, dt);

      const intensity = Math.min(
        1,
        Math.max(0, (Math.abs(velocity) - 500) / 1500),
      );
      if (intensity > 0 && streaks.length < 110) {
        const spawns =
          (Math.random() < intensity * 3.2 ? 1 : 0) +
          (Math.random() < intensity * 1.6 ? 1 : 0) +
          (intensity > 0.5 && Math.random() < 0.8 ? 1 : 0) +
          (intensity > 0.8 && Math.random() < 0.8 ? 1 : 0);
        for (let s = 0; s < spawns; s++) {
          streaks.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            len: 90 + Math.random() * 320 * Math.max(0.5, intensity),
            speed:
              (velocity > 0 ? -1 : 1) *
              (1300 + Math.random() * 2200) *
              Math.max(0.5, intensity),
            alpha: 0.3 + Math.random() * 0.35,
            width: 1.6 + Math.random() * 1.6,
            violet: Math.random() < 0.35,
          });
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.y += s.speed * dt;
        s.alpha -= dt * 0.45;
        if (
          s.alpha <= 0 ||
          s.y < -s.len - 40 ||
          s.y > window.innerHeight + s.len + 40
        ) {
          streaks.splice(i, 1);
          continue;
        }
        const dir = s.speed > 0 ? 1 : -1;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y - dir * s.len);
        const c = s.violet ? "167 139 250" : "239 236 247";
        grad.addColorStop(0, `rgb(${c} / ${s.alpha})`);
        grad.addColorStop(1, `rgb(${c} / 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y - dir * s.len);
        ctx.stroke();
      }

      if (streaks.length > 0 || Math.abs(velocity) > 400) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.min(0.3, Math.max(0.004, (now - lastScrollT) / 1000));
      const y = window.scrollY;
      // Even blend so discrete mouse-wheel notches register instead
      // of only continuous trackpad flings.
      velocity = velocity * 0.5 + ((y - lastY) / dt) * 0.5;
      lastY = y;
      lastScrollT = now;
      if (!running) {
        running = true;
        lastFrameT = now;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
    />
  );
}
