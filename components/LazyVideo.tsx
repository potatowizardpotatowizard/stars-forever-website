"use client";

import { useEffect, useRef } from "react";

// A below-the-fold ambient video that costs nothing until it is nearly
// on screen: the source attaches only when the video approaches the
// viewport, then it plays as before. The poster holds the frame until
// then, so nothing shifts.
export default function LazyVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!el.src) {
            el.src = src;
            el.load();
            el.play().catch(() => undefined);
          }
          io.disconnect();
        }
      },
      { rootMargin: "80% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      className={className}
    />
  );
}
