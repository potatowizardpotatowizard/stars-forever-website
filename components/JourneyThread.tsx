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
      tip.style.transform = `translate(-50%, ${(p * rect.height - 10).toFixed(1)}px)`;
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
      className="relative mx-auto mt-16 h-64 w-px md:hidden"
    >
      <div
        ref={lineRef}
        className="h-full w-full origin-top bg-gradient-to-b from-transparent via-[#b48cff] to-ember shadow-[0_0_12px_rgb(167_139_250/0.9)]"
        style={{ transform: "scaleY(0)" }}
      />
      <div
        ref={tipRef}
        className="absolute left-1/2 top-0 h-5 w-5 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(180,140,255,0.55)_45%,transparent_72%)] blur-[1.5px]"
        style={{ opacity: 0, transform: "translate(-50%, 0)" }}
      />
    </div>
  );
}
