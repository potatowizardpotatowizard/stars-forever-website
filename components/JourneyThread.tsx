"use client";

import { useEffect, useRef } from "react";

// Mobile only: a thin glowing thread that draws itself downward
// from the video toward THE JOURNEY as you scroll, leading the eye
// into the flight.
export default function JourneyThread() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const root = rootRef.current;
      const line = lineRef.current;
      const tip = tipRef.current;
      if (!root || !line || !tip) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        line.style.transform = "scaleY(1)";
        tip.style.opacity = "0";
        return;
      }
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = smooth(clamp01((vh * 0.92 - rect.top) / (vh * 0.8)));
      line.style.transform = `scaleY(${p.toFixed(4)})`;
      tip.style.transform = `translate(-50%, ${(p * rect.height).toFixed(1)}px)`;
      tip.style.opacity = p > 0.02 && p < 0.99 ? "1" : "0";
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
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative mx-auto mt-16 h-40 w-px md:hidden"
    >
      <div
        ref={lineRef}
        className="h-full w-full origin-top bg-gradient-to-b from-transparent via-[#b48cff] to-ember shadow-[0_0_12px_rgb(167_139_250/0.9)]"
        style={{ transform: "scaleY(0)" }}
      />
      <div
        ref={tipRef}
        className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_3px_rgb(180_140_255/0.9)]"
        style={{ opacity: 0, transform: "translate(-50%, 0)" }}
      />
    </div>
  );
}
