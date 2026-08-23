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

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const tick = () => {
      raf = 0;
      const el = frameRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.width = "100%";
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = smooth(clamp01((vh * 0.92 - rect.top) / (vh * 0.72)));
      const from = window.matchMedia("(min-width: 768px)").matches ? 58 : 74;
      el.style.width = `${(from + (100 - from) * p).toFixed(2)}%`;
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
      <div ref={frameRef} className="mx-auto" style={{ width: "100%" }}>
        <VideoBlock src={src} poster={poster} title={title} />
      </div>
    </div>
  );
}
