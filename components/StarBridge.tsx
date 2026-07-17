"use client";

import { useEffect, useRef } from "react";

// A shooting star that rides the scroll from the end of one sentence
// (#star-anchor) down into a target header (#tokyo-anchor), trailing a
// comet tail, then bursting the header alight on arrival. Reduced motion
// and no-JS simply see the header as normal.
export default function StarBridge() {
  const starRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGLineElement>(null);
  const arrived = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const star = starRef.current;
    const trail = trailRef.current;
    if (!star || !trail) return;

    let raf = 0;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      const start = document.getElementById("star-anchor");
      const end = document.getElementById("tokyo-anchor");
      if (!start || !end) return;
      const sr = start.getBoundingClientRect();
      const er = end.getBoundingClientRect();
      const sx = sr.right;
      const sy = sr.top + sr.height / 2;
      const ex = er.left + Math.min(er.width, 40);
      const ey = er.top + er.height / 2;

      const vh = window.innerHeight;
      const line = vh * 0.6; // the trigger line down the viewport
      const gap = ey - sy; // layout distance, scroll independent
      const p = gap <= 0 ? 0 : clamp01((line - sy) / gap);

      const x = sx + (ex - sx) * p;
      const y = sy + (ey - sy) * p;

      star.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      star.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";

      // The trail runs from the sentence to the star's current point
      trail.setAttribute("x1", `${sx}`);
      trail.setAttribute("y1", `${sy}`);
      trail.setAttribute("x2", `${x}`);
      trail.setAttribute("y2", `${y}`);
      trail.style.opacity = p > 0.02 && p < 0.98 ? "0.9" : "0";

      // Burst the header alight once, when the star lands
      if (p >= 0.985 && !arrived.current) {
        arrived.current = true;
        end.classList.add("tokyo-ignite");
      } else if (p < 0.6 && arrived.current) {
        // reset when scrolled back up, so it can play again
        arrived.current = false;
        end.classList.remove("tokyo-ignite");
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <svg className="h-full w-full">
        <defs>
          <linearGradient id="star-trail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(167 139 250 / 0)" />
            <stop offset="100%" stopColor="rgb(239 236 247 / 0.95)" />
          </linearGradient>
        </defs>
        <line
          ref={trailRef}
          stroke="url(#star-trail)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 0, filter: "drop-shadow(0 0 6px rgb(167 139 250 / 0.8))" }}
        />
      </svg>
      <div
        ref={starRef}
        className="star-bridge-head absolute left-0 top-0 opacity-0"
      />
    </div>
  );
}
