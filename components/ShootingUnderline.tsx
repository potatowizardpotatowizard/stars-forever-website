"use client";

import { useEffect, useRef } from "react";

// A star streak from the brand kit that draws itself left to right
// beneath a line as it scrolls into view, the starburst landing at
// the end like a period. Decorative, desktop only.
export default function ShootingUnderline({
  className = "",
}: {
  className?: string;
}) {
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const el = maskRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.width = "760px";
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = smooth(clamp01((vh * 0.88 - rect.top) / (vh * 0.45)));
      el.style.width = `${Math.round(760 * p)}px`;
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
      aria-hidden="true"
      className={`pointer-events-none relative h-0 ${className}`}
    >
      <div
        ref={maskRef}
        className="absolute -top-24 left-[15.5rem] z-[-1] h-[22rem] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_60px)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_60px)]"
        style={{ width: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/fx-star-underline.webp"
          alt=""
          className="absolute left-0 top-1/2 w-[760px] max-w-none -translate-y-1/2"
        />
      </div>
    </div>
  );
}
