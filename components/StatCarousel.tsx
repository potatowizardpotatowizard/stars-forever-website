"use client";

import { useRef, useState } from "react";

export type Stat = {
  value: string;
  text: string;
  sourceLabel?: string;
  sourceHref?: string;
};

// One big statistic at a time, seven in the deck. Swipe the figure or
// click a diamond to move through them; every figure links its source.
export default function StatCarousel({
  stats,
  bottom,
}: {
  stats: Stat[];
  bottom?: Stat;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(Math.min(stats.length - 1, Math.max(0, i)));
  };

  const jumpTo = (i: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="md:border-l md:border-dust/15 md:pl-10">
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stats.map((stat) => (
          <li key={stat.text} className="w-full shrink-0 snap-center pr-4">
            <div className="flex min-h-[20rem] flex-col justify-center">
              <p className="vhs-glow font-display text-7xl font-bold text-ember">
                {stat.value}
              </p>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-starlight/85">
                {stat.text}
              </p>
              {stat.sourceHref ? (
                <a
                  href={stat.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-label mt-2 inline-block text-dust transition-colors hover:text-ember"
                >
                  {stat.sourceLabel} ↗
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/* seven diamonds, one per statistic */}
      <div className="mt-6 flex items-center gap-3">
        {stats.map((stat, i) => (
          <button
            key={stat.text}
            type="button"
            aria-label={`Statistic ${i + 1}`}
            onClick={() => jumpTo(i)}
            className={`h-3 w-3 rotate-45 border transition-all duration-300 ${
              i === active
                ? "scale-125 border-ember bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                : "border-dust/50 bg-transparent hover:border-ember"
            }`}
          />
        ))}
        <span className="meta-label ml-2 text-dust">
          {String(active + 1).padStart(2, "0")} / {String(stats.length).padStart(2, "0")}
        </span>
      </div>

      {/* the steady closing figure, exactly like the old layout */}
      {bottom ? (
        <div className="mt-10">
          <p className="vhs-glow font-display text-6xl font-bold text-ember">
            {bottom.value}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-starlight/80">
            {bottom.text}
          </p>
          {bottom.sourceHref ? (
            <a
              href={bottom.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-label mt-2 inline-block text-dust transition-colors hover:text-ember"
            >
              {bottom.sourceLabel} ↗
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
