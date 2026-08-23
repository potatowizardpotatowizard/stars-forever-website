"use client";

import { useEffect, useRef, useState } from "react";

const STAR_PATH =
  "M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z";

// The seven process steps as a seven star constellation, the Big
// Dipper. Stars light one by one as the visitor scrolls the steps,
// the connecting lines following once both ends burn. Desktop only.
const POINTS: [number, number][] = [
  [8, 20],
  [23, 31],
  [37, 42],
  [52, 49],
  [49, 73],
  [73, 79],
  [79, 51],
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 3],
];

export default function ProcessConstellation({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setLit(7);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01(
        (vh * 0.85 - rect.top) / Math.max(rect.height * 0.95, 1),
      );
      setLit(Math.round(p * 7));
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
    <div ref={ref} aria-hidden="true" className={className}>
      <svg viewBox="0 0 100 100" className="mx-auto h-auto w-full max-w-[24rem]">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={POINTS[a][0]}
            y1={POINTS[a][1]}
            x2={POINTS[b][0]}
            y2={POINTS[b][1]}
            stroke="var(--color-starlight)"
            strokeWidth="0.3"
            strokeDasharray="1.6 1.3"
            className="transition-opacity duration-700"
            opacity={lit > a && lit > b ? 0.45 : 0.07}
          />
        ))}
        {POINTS.map(([x, y], i) => {
          const on = i < lit;
          const last = i === POINTS.length - 1;
          return (
            <g key={`${x}-${y}`} transform={`translate(${x - 3.3} ${y - 3.3}) scale(0.275)`}>
              <path
                d={STAR_PATH}
                fill={
                  on && last
                    ? "var(--color-ember)"
                    : "var(--color-starlight)"
                }
                className="transition-all duration-700"
                opacity={on ? 1 : 0.18}
                style={
                  on
                    ? {
                        filter: last
                          ? "drop-shadow(0 0 4px rgb(109 40 217 / 0.95))"
                          : "drop-shadow(0 0 3px rgb(230 225 255 / 0.9))",
                      }
                    : undefined
                }
              />
            </g>
          );
        })}
      </svg>
      <p className="meta-label mt-2 text-center text-dust transition-opacity duration-700" style={{ opacity: lit >= 7 ? 1 : 0 }}>
        seven steps, one constellation
      </p>
    </div>
  );
}
