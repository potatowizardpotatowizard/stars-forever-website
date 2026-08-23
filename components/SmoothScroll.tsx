"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Buttery smooth wheel scrolling, desktop only. Touch devices keep
// their native scroll, and reduced motion opts out entirely. Lenis
// drives window scroll, so every scroll linked effect on the site
// keeps working exactly as before, just smoother.
export default function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!desktop || reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });
    let raf = 0;
    const frame = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
