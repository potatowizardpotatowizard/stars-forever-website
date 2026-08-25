"use client";

import { useEffect, useRef } from "react";

const STAR_PATH =
  "M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z";

// The proof cards rise one by one as the section scrolls in, while a
// thin ember thread draws itself from card to card behind them, a
// small star igniting at each junction and a bigger one landing on
// the last: three dreams, one constellation.
export default function ProofConstellation({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const starRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const path = pathRef.current;
      const svg = svgRef.current;
      if (!wrap || !path || !svg) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduced
        ? 1
        : clamp01((vh * 0.92 - rect.top) / (vh * 0.75));

      const cards = [...wrap.querySelectorAll<HTMLElement>("a")];
      if (cards.length < 2) return;

      // each card rises into place on its own beat
      cards.forEach((card, i) => {
        const sub = smooth(clamp01((p - i * 0.16) / 0.4));
        card.style.transform = `translateY(${((1 - sub) * 26).toFixed(1)}px)`;
        card.style.opacity = (0.25 + 0.75 * sub).toFixed(3);
      });

      // thread the images' centers
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      const vb = `0 0 ${W} ${H}`;
      if (svg.getAttribute("viewBox") !== vb) {
        svg.setAttribute("viewBox", vb);
      }
      const pts = cards.map((card) => {
        const img = (card.firstElementChild ?? card) as HTMLElement;
        const r = img.getBoundingClientRect();
        return {
          x: r.left - rect.left + r.width / 2,
          y: r.bottom - rect.top + 14,
        };
      });
      path.setAttribute(
        "d",
        pts
          .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
          .join(" "),
      );
      const L = path.getTotalLength();
      const lineP = smooth(clamp01((p - 0.12) / 0.82));
      path.style.strokeDasharray = `${L}`;
      path.style.strokeDashoffset = `${L * (1 - lineP)}`;

      // junction stars ignite as the thread arrives
      const dists: number[] = [0];
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        dists.push(dists[i - 1] + Math.hypot(dx, dy));
      }
      pts.forEach((pt, i) => {
        const g = starRefs.current[i];
        if (!g) return;
        const frac = L > 0 ? dists[i] / L : 0;
        const on = lineP >= frac - 0.02 && lineP > 0.02;
        const last = i === pts.length - 1;
        const size = last ? 1.05 : 0.62;
        g.setAttribute(
          "transform",
          `translate(${pt.x - 12 * size} ${pt.y - 12 * size}) scale(${size})`,
        );
        g.style.opacity = on ? "1" : "0";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth="1.5"
          strokeDasharray="0"
          style={{ filter: "drop-shadow(0 0 6px rgb(109 40 217 / 0.9))" }}
        />
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            ref={(el) => {
              starRefs.current[i] = el;
            }}
            style={{ opacity: 0, transition: "opacity 0.5s ease" }}
          >
            <path
              d={STAR_PATH}
              fill="var(--color-starlight)"
              style={{
                filter: "drop-shadow(0 0 6px rgb(230 225 255 / 0.95))",
              }}
            />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}
