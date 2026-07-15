"use client";

import { useEffect, useRef } from "react";

// Hero backgrounds drift slower than the page, deepening the space feel.
// Off under reduced motion; the layer is slightly oversized to cover the
// displacement.
export default function ParallaxLayer({
  children,
  speed = 0.22,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`scale-110 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
