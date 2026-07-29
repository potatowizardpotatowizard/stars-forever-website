"use client";

import { useEffect, useRef, useState } from "react";
import { NICHES } from "@/content/niches";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#[]<>/\\";

// The vision's thesis, one niche at a time: "A missionary to gaming."
// scrambles and resolves into the next niche forever, in the same
// tape-decode voice as the site's headings. Reduced motion reads the
// summary instead: a missionary to every niche.
export default function NicheCycler() {
  const [display, setDisplay] = useState(NICHES[0].toLowerCase());
  const [reduced, setReduced] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    let scramble: ReturnType<typeof setInterval>;
    const cycle = setInterval(() => {
      index.current = (index.current + 1) % NICHES.length;
      const target = NICHES[index.current].toLowerCase();
      let tick = 0;
      clearInterval(scramble);
      scramble = setInterval(() => {
        tick += 1;
        const locked = Math.max(0, tick - 3);
        if (locked >= target.length) {
          setDisplay(target);
          clearInterval(scramble);
          return;
        }
        setDisplay(
          target
            .split("")
            .map((ch, i) =>
              i < locked
                ? ch
                : POOL[Math.floor(Math.random() * POOL.length)].toLowerCase(),
            )
            .join(""),
        );
      }, 42);
    }, 2400);
    return () => {
      clearInterval(cycle);
      clearInterval(scramble);
    };
  }, []);

  return (
    <p className="mt-7 min-h-[4.15rem] max-w-3xl font-display text-2xl leading-snug text-starlight/85 sm:min-h-0 sm:text-3xl">
      A missionary to the{" "}
      <span className="text-ember">{reduced ? "every" : display}</span> niche.
    </p>
  );
}
