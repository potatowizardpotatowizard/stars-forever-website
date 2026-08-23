"use client";

import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";

// Desktop focus scroll for the monologue: every beat is on the page,
// but only the line crossing the middle of the screen burns at full
// brightness. The closing beats land in ember. Opacity only, no
// pinning, so it glides with the site's smooth scrolling.
export default function FocusMonologue({
  kicker,
  lines,
  emberCount = 2,
}: {
  kicker: string;
  lines: string[];
  emberCount?: number;
}) {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) {
      for (const el of lineRefs.current) {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      }
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      for (let i = 0; i < lineRefs.current.length; i++) {
        const el = lineRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const away = Math.min(1, Math.abs(center - mid) / (window.innerHeight * 0.38));
        const eased = away * away;
        // each beat arrives from its own side: evens from the left,
        // odds from the right, settling straight as it reaches center
        const dir = i % 2 === 0 ? -1 : 1;
        el.style.opacity = (1 - 0.72 * eased).toFixed(3);
        el.style.transform = `translate3d(${(dir * 130 * eased).toFixed(1)}px, 0, 0)`;
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
  }, [reduced, lines.length]);

  return (
    <div className="mx-auto max-w-3xl">
      <Kicker>{kicker}</Kicker>
      <div className="mt-14 space-y-14">
        {lines.map((line, i) => (
          <p
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            key={line}
            className={
              i >= lines.length - emberCount
                ? "font-display text-3xl font-bold leading-snug text-ember will-change-transform lg:text-4xl"
                : "font-display text-3xl font-bold leading-snug text-starlight will-change-transform lg:text-4xl"
            }
            style={{ opacity: 0.28 }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
