"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#[]<>/\\";

// Typewriter decode effect: text scrambles, then resolves left to right,
// like a tape deck locking onto a signal. Runs once when scrolled into view
// and again on hover. Reduced motion sees the plain text, always.
export default function GlitchText({
  text,
  className = "",
  delay = 0,
  speed = 42,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  const scramble = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) clearInterval(timer.current);
    let tick = 0;
    const settleTicks = 3; // scramble ticks before letters start locking in
    timer.current = setInterval(() => {
      tick += 1;
      const locked = Math.max(0, tick - settleTicks);
      if (locked >= text.length) {
        setDisplay(text);
        if (timer.current) clearInterval(timer.current);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (i < locked || ch === " ") return ch;
            return POOL[Math.floor(Math.random() * POOL.length)];
          })
          .join(""),
      );
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pending: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            pending = setTimeout(scramble, delay);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (pending) clearTimeout(pending);
      if (timer.current) clearInterval(timer.current);
    };
  }, [scramble, delay]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={scramble}
      aria-label={text}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
