"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Mobile only: while the burning question holds the center of the
// screen, a half buried burning star pokes up from the bottom edge,
// hinting that the journey is waiting below. It slips back under the
// edge as you leave, and stays gone once THE JOURNEY title is in view.
export default function BurningTease() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const root = rootRef.current;
      if (!root) return;
      if (
        window.matchMedia("(min-width: 768px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        root.style.opacity = "0";
        return;
      }
      const q = document.getElementById("burning-question");
      const j = document.getElementById("journey-scene");
      if (!q) return;
      const vh = window.innerHeight;
      const qr = q.getBoundingClientRect();
      const centered = clamp01(
        1 - Math.abs(qr.top + qr.height / 2 - vh * 0.5) / (vh * 0.55),
      );
      const journeyNear = j
        ? j.getBoundingClientRect().top < vh * 0.9
        : false;
      const show = journeyNear ? 0 : smooth(centered);
      root.style.opacity = show.toFixed(3);
      root.style.transform = `translate(-50%, ${((1 - show) * 100).toFixed(1)}%)`;
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
      className="pointer-events-none fixed left-1/2 z-20 md:hidden"
      style={{ opacity: 0, bottom: "-46px", transform: "translate(-50%, 100%)" }}
    >
      {/* the screen edge buries the bottom half of the star */}
      <div className="animate-pulse">
        <Image
          src="/brand/star-sharp.png"
          alt=""
          width={92}
          height={92}
          className="[filter:drop-shadow(0_0_12px_rgb(255_150_60/0.95))_drop-shadow(0_0_30px_rgb(255_115_35/0.65))]"
        />
      </div>
    </div>
  );
}
