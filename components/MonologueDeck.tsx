"use client";

import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";

export type MonologueCard = {
  lines: string[];
  list?: string[];
  ember?: boolean;
};

const STAR_PATH =
  "M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z";

// The monologue as an optional story: one card at a time, swiped or
// paged at the visitor's own speed, each carrying its own star.
export default function MonologueDeck({
  kicker,
  cards,
}: {
  kicker: string;
  cards: MonologueCard[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const trailGlowRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const starGlowRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // the deck swells gently as it rises into view
  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const el = deckRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.transform = "none";
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = smooth(clamp01((vh * 0.92 - rect.top) / (vh * 0.6)));
      el.style.transform = `scale(${(0.93 + 0.07 * p).toFixed(4)})`;
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

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(Math.min(cards.length - 1, Math.max(0, i)));

    // the shooting star behind the box charges with the story
    const max = el.scrollWidth - el.clientWidth;
    const t = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    const trail = trailRef.current;
    if (trail) {
      trail.style.transform = `scaleX(${(0.35 + 0.65 * t).toFixed(3)})`;
      trail.style.opacity = (0.5 + 0.5 * t).toFixed(3);
    }
    const trailGlow = trailGlowRef.current;
    if (trailGlow) trailGlow.style.opacity = (0.25 + 0.6 * t).toFixed(3);
    const star = starRef.current;
    if (star) {
      star.style.transform = `translateY(-50%) scale(${(1 + 0.7 * t).toFixed(3)}) rotate(${(t * 90).toFixed(1)}deg)`;
    }
    const starGlow = starGlowRef.current;
    if (starGlow) starGlow.style.opacity = (0.25 + 0.75 * t).toFixed(3);
    const sparks = sparksRef.current;
    if (sparks) sparks.style.opacity = Math.min(1, Math.max(0, (t - 0.35) * 1.8)).toFixed(3);
  };

  const jumpTo = (i: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div ref={deckRef} className="mx-auto max-w-3xl will-change-transform">
      <Kicker>{kicker}</Kicker>
      <div className="relative mt-10">
        {/* the shooting star behind the box: tail out the left,
            head out the right, charging with every swipe */}
        <div
          ref={trailGlowRef}
          aria-hidden="true"
          className="absolute -left-44 top-1/2 h-8 w-44 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgb(109_40_217/0.35))] blur-md"
          style={{ opacity: 0.25 }}
        />
        <div
          ref={trailRef}
          aria-hidden="true"
          className="absolute -left-44 top-1/2 h-[3px] w-44 -translate-y-1/2 origin-right rounded-full bg-[linear-gradient(90deg,transparent,rgb(139_92_246/0.55),rgb(237_233_254/0.95))]"
          style={{ transform: "scaleX(0.35)", opacity: 0.5 }}
        />
        <div
          ref={starGlowRef}
          aria-hidden="true"
          className="absolute -right-16 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(109_40_217/0.55),transparent_70%)] blur-sm"
          style={{ opacity: 0.25 }}
        />
        <div
          ref={starRef}
          aria-hidden="true"
          className="absolute -right-12 top-1/2 h-16 w-16 will-change-transform"
          style={{ transform: "translateY(-50%) scale(1)" }}
        >
          <span key={active} className="absolute inset-0 animate-ping rounded-full bg-ember/25" />
          <svg viewBox="0 0 24 24" className="relative h-full w-full">
            <path
              d="M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z"
              fill="var(--color-starlight)"
            />
          </svg>
        </div>
        <div
          ref={sparksRef}
          aria-hidden="true"
          className="absolute -right-20 top-1/2 h-28 w-28 -translate-y-1/2 animate-pulse"
          style={{ opacity: 0 }}
        >
          <span className="absolute left-1 top-2 h-1.5 w-1.5 rotate-45 bg-ember" />
          <span className="absolute right-2 top-6 h-2 w-2 rotate-45 bg-starlight" />
          <span className="absolute bottom-3 left-6 h-1.5 w-1.5 rotate-45 bg-ember" />
          <span className="absolute bottom-8 right-0 h-1 w-1 rotate-45 bg-starlight" />
        </div>

      <ul
        ref={listRef}
        onScroll={onScroll}
        className="relative z-10 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <li key={card.lines[0]} className="w-full shrink-0 snap-center pr-4">
            <div className="flex min-h-[22rem] flex-col justify-center rounded-xl border border-dust/20 bg-night p-10">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
              >
                <path
                  d={STAR_PATH}
                  fill={card.ember ? "var(--color-ember)" : "var(--color-starlight)"}
                  opacity={card.ember ? 1 : 0.7}
                />
              </svg>
              <div className="mt-8 space-y-6">
                {card.lines.map((line) => (
                  <p
                    key={line}
                    className={
                      card.ember
                        ? "font-display text-3xl font-bold leading-snug text-ember"
                        : "font-display text-3xl font-bold leading-snug text-starlight"
                    }
                  >
                    {line}
                  </p>
                ))}
                {card.list ? (
                  <ol className="space-y-4">
                    {card.list.map((item, n) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-4 font-display text-2xl font-bold leading-snug text-starlight/90"
                      >
                        <span className="meta-label text-ember">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>

      {/* diamond pager */}
      <div className="mt-8 flex items-center gap-3">
        {cards.map((card, i) => (
          <button
            key={card.lines[0]}
            type="button"
            aria-label={`Card ${i + 1}`}
            onClick={() => jumpTo(i)}
            className={`h-3 w-3 rotate-45 border transition-all duration-300 ${
              i === active
                ? "scale-125 border-ember bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                : "border-dust/50 bg-transparent hover:border-ember"
            }`}
          />
        ))}
        <span className="meta-label ml-2 text-dust">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(cards.length).padStart(2, "0")}
        </span>
        <span
          className={`meta-label text-ember transition-opacity duration-700 ${
            active === 0 ? "animate-pulse opacity-90" : "opacity-0"
          }`}
        >
          swipe through the story →
        </span>
      </div>
    </div>
  );
}
