"use client";

import { useEffect, useState } from "react";

// The ten year dream, tied to the reader's own scroll: a mono year in
// the corner climbs 2026 to 2036 as the page descends, arriving at
// 2036 exactly as the Digital Sky fills the screen, then slipping
// away once the dream has been seen.
export default function YearTicker() {
  const [year, setYear] = useState(2026);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const sky = document.getElementById("digital-sky");
      if (!sky) return;
      const rect = sky.getBoundingClientRect();
      const target =
        rect.top + window.scrollY - window.innerHeight * 0.55;
      const p =
        target <= 0
          ? 1
          : Math.min(1, Math.max(0, window.scrollY / target));
      setYear(2026 + Math.round(10 * p));
      setGone(rect.bottom < window.innerHeight * 0.25);
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
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 right-5 z-40 text-right transition-opacity duration-700 sm:right-8 ${
        gone ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="meta-label text-dust/80">The ten year dream</p>
      <p
        key={year}
        className={`year-tick mt-1 font-meta text-3xl font-bold tracking-[0.24em] ${
          year >= 2036 ? "text-ember" : "text-starlight/75"
        }`}
      >
        {year}
      </p>
    </div>
  );
}
