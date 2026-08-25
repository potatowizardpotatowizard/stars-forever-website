"use client";

import { useEffect, useRef } from "react";
import VideoBlock from "@/components/VideoBlock";

// The video that meets the scroll: it starts inset beneath the
// heading and widens to the full container as the visitor scrolls it
// toward center screen. Desktop only; phones keep the plain block.
export default function GrowVideo({
  src,
  poster,
  title,
  className = "",
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const hintArrowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const tick = () => {
      raf = 0;
      const el = frameRef.current;
      const dim = dimRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.width = "100%";
        if (dim) dim.style.opacity = "0";
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const p = smooth(clamp01((vh * 0.92 - rect.top) / (vh * 0.72)));
      const from = desktop ? 58 : 74;
      el.style.width = `${(from + (100 - from) * p).toFixed(2)}%`;
      // as the video takes the stage, the rest of the page falls dark
      // so all the light is on it; the room comes back once it passes.
      // phones go nearly black and get a glowing rotate hint.
      const hold = clamp01((rect.bottom - vh * 0.18) / (vh * 0.25));
      const k = p * hold;
      if (dim) {
        dim.style.opacity = ((desktop ? 0.55 : 0.92) * k).toFixed(3);
      }
      const hintText = hintTextRef.current;
      const hintArrows = hintArrowsRef.current;
      if (hintText) {
        hintText.style.opacity = desktop
          ? "0"
          : clamp01((k - 0.3) * 1.8).toFixed(3);
      }
      if (hintArrows) {
        hintArrows.style.opacity = desktop
          ? "0"
          : clamp01((k - 0.3) * 1.8).toFixed(3);
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
    <div className={className}>
      <div
        ref={dimRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 bg-night"
        style={{ opacity: 0 }}
      />
      <div ref={frameRef} className="relative z-20 mx-auto" style={{ width: "100%" }}>
        <VideoBlock src={src} poster={poster} title={title} />
        {/* directly under the video: the glowing invitation and a
            quarter turn arrow asking for the rotation */}
        <p
          ref={hintTextRef}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[3.1rem] left-1 whitespace-nowrap font-meta text-xs font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_0_12px_rgb(255_255_255/0.9),0_0_28px_rgb(167_139_250/0.8)] md:hidden"
          style={{ opacity: 0 }}
        >
          Press Play &amp; Rotate
        </p>
        <div
          ref={hintArrowsRef}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 right-1 animate-pulse md:hidden"
          style={{ opacity: 0 }}
        >
          <svg
            width="46"
            height="42"
            viewBox="0 0 46 42"
            fill="none"
            className="[filter:drop-shadow(0_0_10px_rgb(255_255_255/0.85))_drop-shadow(0_0_22px_rgb(167_139_250/0.7))]"
          >
            <path
              d="M8 8 A 26 26 0 0 1 36 32"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M36 32 l-9.5 -2.5 M36 32 l1.5 -9.5"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
