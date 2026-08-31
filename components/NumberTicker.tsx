"use client";

import { useEffect, useRef } from "react";

// A stat that counts up from zero when it scrolls into view, keeping
// its suffix ("45K+" counts 0..45 then wears K+). Reduced motion shows
// the finished number immediately.
export default function NumberTicker({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^([\d.,]+)(.*)$/);
    if (!m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseFloat(m[1].replace(/,/g, ""));
    const suffix = m[2] ?? "";
    const decimals = (m[1].split(".")[1] ?? "").length;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
