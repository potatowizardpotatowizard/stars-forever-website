"use client";

import { useEffect, useRef } from "react";

// Charge on center: whichever proof card is nearest the middle of the
// screen glows violet and swells slightly while the others rest, a
// spotlight that hands off card to card as you scroll.
export default function ProofParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const cards = [...wrap.querySelectorAll<HTMLElement>("a")];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        for (const card of cards) {
          card.style.transform = "none";
          card.style.filter = "";
        }
        return;
      }
      const vh = window.innerHeight;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const s = smooth(clamp01(1 - Math.abs(center - vh * 0.5) / (vh * 0.42)));
        card.style.transform = `scale(${(1 + 0.035 * s).toFixed(4)})`;
        card.style.filter = s > 0.02
          ? `drop-shadow(0 0 ${(16 * s).toFixed(1)}px rgb(167 139 250 / ${(0.55 * s).toFixed(3)}))`
          : "";
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
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {children}
    </div>
  );
}
