"use client";

import { useEffect, useState } from "react";

// A headline that types itself out with a blinking cursor, like the
// hardest sentence on the site being written in real time. Reduced
// motion sees the full line immediately.
export default function TypeHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      setStarted(true);
      return;
    }
    const start = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const tick = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(tick);
      }, 42);
    }, 500);
    return () => clearTimeout(start);
  }, [text]);

  const done = count >= text.length;
  return (
    <h1 className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {started && !done ? <span className="type-cursor" /> : null}
      </span>
    </h1>
  );
}
