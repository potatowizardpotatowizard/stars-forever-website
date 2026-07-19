"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// How long a point of the ribbon stays on screen before it has
// fully faded, in milliseconds.
const RIBBON_LIFE = 1300;

// Constellation-page chemtrail: the pointer's path lingers as a
// glowing ribbon that fades on its own, painted beneath the star
// cursor. Lives apart from StarCursor so the cursor itself stays
// exactly the original shooting star. Only active on /constellation;
// fine pointers only; reduced motion sees nothing.
export default function ConstellationTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = usePathname() === "/constellation";

  useEffect(() => {
    if (!active) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    // The ribbon's head glides with the same easing as the star
    // cursor (0.3 pursuit), so the trail pours out of the star
    // instead of racing ahead to the raw pointer.
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let shown = false;
    const ribbon: { x: number; y: number; t: number }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // The member stars on the map, for the draw-a-constellation game:
    // pass your light near two or more stars and the site connects
    // them into a named constellation for a moment.
    let dots: { el: Element; label: string }[] = [];
    const findDots = () => {
      dots = Array.from(document.querySelectorAll(".constellation-dot")).map(
        (el) => {
          const meta = el.parentElement?.querySelector(".meta-label");
          const city = (meta?.textContent ?? "").split(",")[0].trim();
          return { el, label: city || "a star" };
        },
      );
    };
    const findTimer = setTimeout(findDots, 600);

    const hits: { el: Element; label: string; t: number }[] = [];
    const HIT_LIFE = 3500;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
      }
    };

    const tick = (now: number) => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      const last = ribbon[ribbon.length - 1];
      if (shown && (!last || Math.hypot(x - last.x, y - last.y) > 1)) {
        ribbon.push({ x, y, t: now });
      }
      while (ribbon.length && now - ribbon[0].t > RIBBON_LIFE) ribbon.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < ribbon.length; i++) {
        const a = ribbon[i - 1];
        const b = ribbon[i];
        if (now - b.t > 250 && Math.hypot(b.x - a.x, b.y - a.y) > 80) {
          continue; // don't bridge jumps across the screen
        }
        const life = 1 - (now - b.t) / RIBBON_LIFE;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        // soft violet halo, then a bright core
        ctx.strokeStyle = `rgb(109 40 217 / ${0.28 * life})`;
        ctx.lineWidth = 7 * life + 1;
        ctx.stroke();
        ctx.strokeStyle = `rgb(196 181 253 / ${0.75 * life})`;
        ctx.lineWidth = 2.2 * life + 0.4;
        ctx.stroke();
      }

      // Constellation game: hit-test the ribbon's head against the
      // member stars, connect the recent ones, and name the line.
      if (shown && dots.length) {
        for (const d of dots) {
          if (hits.some((h) => h.el === d.el && now - h.t < HIT_LIFE)) {
            continue;
          }
          const r = d.el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          if (Math.hypot(x - cx, y - cy) < 30) {
            hits.push({ el: d.el, label: d.label, t: now });
          }
        }
        while (hits.length && now - hits[0].t > HIT_LIFE) hits.shift();

        if (hits.length >= 2) {
          const freshest = Math.max(...hits.map((h) => h.t));
          const fade = Math.min(1, 1.4 - (now - freshest) / HIT_LIFE);
          const pts = hits.map((h) => {
            const r = h.el.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          });
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgb(251 191 36 / ${0.55 * fade})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
          for (const p of pts) {
            ctx.fillStyle = `rgb(251 191 36 / ${0.9 * fade})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          const name = hits.map((h) => h.label).join("–");
          ctx.font = "700 11px 'Fragment Mono', monospace";
          ctx.fillStyle = `rgb(239 236 247 / ${0.85 * fade})`;
          const lastPt = pts[pts.length - 1];
          ctx.fillText(
            `You drew the ${name} line`,
            Math.min(lastPt.x + 14, window.innerWidth - 220),
            lastPt.y - 12,
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(findTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[129] h-full w-full"
    />
  );
}
