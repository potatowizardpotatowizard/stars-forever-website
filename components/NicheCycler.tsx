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
  const [ignite, setIgnite] = useState(false);
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
          // the word locks in and ignites; the claim strip hears it
          window.dispatchEvent(new CustomEvent("sf-niche", { detail: target }));
          setIgnite(true);
          setTimeout(() => setIgnite(false), 700);
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
    <div className="-mx-5 mt-5 border-y border-ember/40 px-5 py-3.5 sm:-mx-8 sm:mt-8 sm:px-8 sm:py-5">
    <p className="min-h-[3.4rem] font-display text-2xl leading-snug text-starlight sm:min-h-0 sm:text-4xl">
      A missionary to the{" "}
      <span className="relative inline-block">
        <span
          className={`transition-all duration-500 ${
            ignite
              ? "text-white [text-shadow:0_0_12px_rgb(255_255_255/0.95),0_0_26px_rgb(167_139_250/0.85)]"
              : "text-ember"
          }`}
        >
          {reduced ? "every" : display}
        </span>
      </span>{" "}
      niche.
    </p>
    </div>
  );
}
