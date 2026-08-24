"use client";

import { useEffect, useRef } from "react";

// Mobile only: the block swells gently while it crosses the middle of
// the screen, then settles back as it scrolls away.
export default function ScrollSwell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      if (
        window.matchMedia("(min-width: 768px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        el.style.transform = "none";
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      const bump = clamp01(1 - Math.abs(center - vh * 0.5) / (vh * 0.42));
      const s = 1 + 0.05 * (bump * bump * (3 - 2 * bump));
      el.style.transform = `scale(${s.toFixed(4)})`;
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
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
