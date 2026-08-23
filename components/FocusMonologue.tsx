"use client";

import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const STAR_PATH =
  "M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z";

// Desktop reading reveal for the monologue: a small Stars Forever
// star draws itself beside each beat, then the words fill in from
// left to right as the visitor scrolls, like a line being read.
export default function FocusMonologue({
  kicker,
  lines,
  emberCount = 2,
}: {
  kicker: string;
  lines: string[];
  emberCount?: number;
}) {
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const starRefs = useRef<(SVGPathElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const lit = (i: number) =>
      i >= lines.length - emberCount
        ? "var(--color-ember)"
        : "var(--color-starlight)";
    const dim = "color-mix(in srgb, var(--color-starlight) 18%, transparent)";

    if (reduced) {
      for (let i = 0; i < textRefs.current.length; i++) {
        const el = textRefs.current[i];
        if (el) el.style.backgroundImage = `linear-gradient(90deg, ${lit(i)} 100%, ${dim} 100%)`;
        const star = starRefs.current[i];
        if (star) {
          star.style.strokeDashoffset = "0";
          star.style.fillOpacity = "1";
        }
      }
      return;
    }

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (let i = 0; i < textRefs.current.length; i++) {
        const el = textRefs.current[i];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // the line reads itself as it rises through the lower screen
        const p = clamp01((vh * 0.88 - top) / (vh * 0.45));
        const f = (p * 100).toFixed(1);
        el.style.backgroundImage = `linear-gradient(90deg, ${lit(i)} ${f}%, ${dim} ${f}%)`;

        // the star draws first, then fills
        const star = starRefs.current[i];
        if (star) {
          const draw = clamp01(p * 2.2);
          star.style.strokeDashoffset = (1 - draw).toFixed(3);
          star.style.fillOpacity = clamp01((p - 0.5) * 2.4).toFixed(3);
        }
      }
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
  }, [reduced, lines.length, emberCount]);

  return (
    <div className="mx-auto max-w-3xl">
      <Kicker>{kicker}</Kicker>
      <div className="mt-14 space-y-12">
        {lines.map((line, i) => (
          <div key={line} className="flex items-start gap-5">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-2 h-6 w-6 flex-none"
            >
              <path
                ref={(el) => {
                  starRefs.current[i] = el;
                }}
                d={STAR_PATH}
                pathLength={1}
                fill={
                  i >= lines.length - emberCount
                    ? "var(--color-ember)"
                    : "var(--color-starlight)"
                }
                stroke={
                  i >= lines.length - emberCount
                    ? "var(--color-ember)"
                    : "var(--color-starlight)"
                }
                strokeWidth="0.06"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ fillOpacity: 0 }}
              />
            </svg>
            <p
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="bg-clip-text font-display text-3xl font-bold leading-snug lg:text-4xl"
              style={{
                color: "transparent",
                WebkitBackgroundClip: "text",
                backgroundImage:
                  "linear-gradient(90deg, color-mix(in srgb, var(--color-starlight) 18%, transparent) 0%, color-mix(in srgb, var(--color-starlight) 18%, transparent) 100%)",
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
