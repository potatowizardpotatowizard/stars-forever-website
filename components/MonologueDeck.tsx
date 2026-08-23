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
  const meteorRef = useRef<HTMLDivElement>(null);
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

    // the meteorite behind the box charges with the story
    const max = el.scrollWidth - el.clientWidth;
    const t = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    const meteor = meteorRef.current;
    if (meteor) {
      // one continuous line anchored at the head: growing reveals more
      // of the burning trail out the left side
      meteor.style.width = `${Math.round(1250 + 250 * t)}px`;
      meteor.style.opacity = (0.8 + 0.2 * t).toFixed(3);
    }
    const sparks = sparksRef.current;
    if (sparks) sparks.style.opacity = Math.min(1, Math.max(0, (t - 0.3) * 1.7)).toFixed(3);
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
        {/* one continuous burning meteorite passing behind the box,
            cut from the brand's Orange 4 art: the starburst head out
            the right, the wispy fire trail out the left, more of it
            revealed as the story advances */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-[44rem] -right-[20rem]"
        >
          <div
            ref={meteorRef}
            className="absolute right-0 top-1/2 h-[36rem] -translate-y-1/2 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_140px)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_140px)]"
            style={{ width: "1250px", opacity: 0.8 }}
          >
            <div className="absolute inset-0 [animation:meteorite-jiggle_1.15s_ease-in-out_infinite]">
              {/* the meteor itself, and a breathing burn above it */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/meteorite-orange.webp"
                alt=""
                className="absolute right-0 top-1/2 w-[1500px] max-w-none translate-y-[calc(-50%+20px)]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/meteorite-orange.webp"
                alt=""
                className="absolute right-0 top-1/2 w-[1500px] max-w-none translate-y-[calc(-50%+20px)] opacity-60 blur-md [animation:meteorite-flicker-soft_1.9s_ease-in-out_infinite]"
              />

              {/* embers shaken loose, drifting back down the trail */}
              <span className="absolute right-64 top-[calc(50%+58px)] h-1.5 w-1.5 rounded-full bg-orange-400 [animation:ember-drift_1.3s_linear_infinite]" />
              <span className="absolute right-56 top-[calc(50%+92px)] h-1 w-1 rounded-full bg-yellow-200 [animation:ember-drift_1.8s_linear_0.5s_infinite]" />
              <span className="absolute right-72 top-[calc(50%+44px)] h-1.5 w-1.5 rounded-full bg-orange-500/90 [animation:ember-drift_1.1s_linear_0.8s_infinite]" />
              <span className="absolute right-60 top-[calc(50%+72px)] h-1 w-1 rounded-full bg-amber-300 [animation:ember-drift_2s_linear_0.2s_infinite]" />

              {/* the head answers each swipe */}
              <span
                key={active}
                className="absolute right-[190px] top-[calc(50%+40px)] h-20 w-20 animate-ping rounded-full bg-orange-400/25"
              />
              <div
                ref={sparksRef}
                className="absolute right-[166px] top-[calc(50%+80px)] h-32 w-32 -translate-y-1/2 animate-pulse"
                style={{ opacity: 0 }}
              >
                <span className="absolute left-2 top-4 h-2 w-2 rotate-45 bg-yellow-200" />
                <span className="absolute right-3 top-9 h-2.5 w-2.5 rotate-45 bg-orange-400" />
                <span className="absolute bottom-5 left-8 h-1.5 w-1.5 rotate-45 bg-amber-300" />
                <span className="absolute bottom-11 right-2 h-1 w-1 rotate-45 bg-orange-300" />
                <span className="absolute left-11 top-1 h-1 w-1 rotate-45 bg-yellow-100" />
              </div>
            </div>
          </div>
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
