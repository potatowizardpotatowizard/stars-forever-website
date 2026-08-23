"use client";

import { useEffect, useRef } from "react";

// The lone starburst from the brand kit behind a closing heading. It
// arrives dim, then swells and burns brighter as the visitor reaches
// the bottom of the page, sparking once fully lit. Desktop only.
export default function ClosingStar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.opacity = "0.9";
        el.style.transform = "scale(1)";
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = smooth(clamp01((vh * 0.92 - rect.top) / (vh * 0.55)));
      el.style.opacity = (0.2 + 0.75 * p).toFixed(3);
      el.style.transform = `scale(${(0.82 + 0.22 * p).toFixed(4)})`;
      const sparks = sparksRef.current;
      if (sparks) sparks.style.opacity = clamp01((p - 0.75) * 4).toFixed(3);
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
      className="pointer-events-none absolute inset-x-0 top-0 hidden md:block"
    >
      <div
        ref={wrapRef}
        className="relative mx-auto w-[620px] will-change-transform"
        style={{ opacity: 0.2, transform: "scale(0.82)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/fx-star-closing.webp"
          alt=""
          className="w-full [animation:meteorite-flicker-soft_2.3s_ease-in-out_infinite]"
          style={{ opacity: 0.9 }}
        />
        {/* sparks once the star is fully lit */}
        <div ref={sparksRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <span className="absolute left-[40%] top-[34%] h-1 w-1 bg-starlight [animation:spark-fly-up_1.2s_ease-out_infinite]" />
          <span className="absolute left-[46%] top-[46%] h-1.5 w-1.5 bg-starlight/90 [animation:spark-fly-down_1.5s_ease-out_0.4s_infinite]" />
          <span className="absolute left-[36%] top-[42%] h-1 w-1 bg-starlight/80 [animation:spark-fly-up_1s_ease-out_0.7s_infinite]" />
        </div>
      </div>
    </div>
  );
}
