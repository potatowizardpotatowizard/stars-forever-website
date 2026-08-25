"use client";

import { useEffect, useRef } from "react";

// Depth parallax for the proof cards: as the section scrolls through
// the viewport each card drifts upward at its own speed, the middle
// one hanging back, so the strip floats with depth.
const SPEEDS = [0.11, 0.055, 0.085];

export default function ProofParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const cards = [...wrap.querySelectorAll<HTMLElement>("a")];
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        for (const card of cards) card.style.transform = "none";
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const drive = rect.top + rect.height / 2 - vh * 0.55;
      cards.forEach((card, i) => {
        const k = SPEEDS[i % SPEEDS.length];
        const y = Math.max(-90, Math.min(90, drive * k));
        card.style.transform = `translateY(${y.toFixed(1)}px)`;
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
      {children}
    </div>
  );
}
