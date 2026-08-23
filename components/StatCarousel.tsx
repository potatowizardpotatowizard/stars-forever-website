"use client";

import { useRef, useState } from "react";

export type Stat = {
  /** big glowing figure; omit for the week visual card */
  value?: string;
  /** render the one waking day in seven diamond row instead of a value */
  week?: boolean;
  text: string;
  sourceLabel?: string;
  sourceHref?: string;
};

// A sideways deck of the numbers behind the problem. Swipe or click a
// diamond to move between statistics; every figure links its source.
export default function StatCarousel({ stats }: { stats: Stat[] }) {
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
    <div className="border-l border-dust/15 pl-10">
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stats.map((stat) => (
          <li key={stat.text} className="w-full shrink-0 snap-center pr-4">
            <div className="flex min-h-[13rem] flex-col justify-center">
              {stat.week ? (
                <div className="flex items-center gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                    <span
                      key={d}
                      aria-hidden="true"
                      className={`h-3 w-3 rotate-45 ${
                        d === 6
                          ? "bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                          : "border border-dust/40"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <p className="vhs-glow font-display text-6xl font-bold text-ember">
                  {stat.value}
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-starlight/80">
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

      {/* the diamond pager */}
      <div className="mt-6 flex items-center gap-3">
        {stats.map((stat, i) => (
          <button
            key={stat.text}
            type="button"
            aria-label={`Statistic ${i + 1}`}
            onClick={() => jumpTo(i)}
            className={`h-2.5 w-2.5 rotate-45 border transition-all duration-300 ${
              i === active
                ? "scale-125 border-ember bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                : "border-dust/50 bg-transparent hover:border-ember"
            }`}
          />
        ))}
        <span className="meta-label ml-2 text-dust">scroll →</span>
      </div>
    </div>
  );
}
