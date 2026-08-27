"use client";

import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";
import StarField from "@/components/StarField";
import { linkCategory3 } from "@/components/Category3Link";

export type JourneyItem =
  | { kind: "beat"; kicker?: string; paragraphs: string[] }
  | { kind: "photo"; src: string; alt: string };

// Tier one of the journey pages: every photo and story beat floats as
// a plane in deep space, and scrolling flies the camera forward
// through them, the site's starfield streaming past. One transform
// moves the whole world each frame; items only change opacity.
const SPACING = 900;
const LEAD = 500;

// deterministic scatter, gentle enough that planes never block the
// one behind them completely
const OFFSETS: [number, number][] = [
  [0, 0],
  [-15, 5],
  [14, -6],
  [-12, -8],
  [16, 7],
  [-17, -2],
  [11, 9],
  [-8, -10],
  [17, 3],
  [-14, 8],
  [10, -8],
  [-17, 4],
  [13, 6],
  [-10, -6],
  [15, -3],
  [0, 0],
];

export default function JourneyScene({ items }: { items: JourneyItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const maxZ = (items.length - 1) * SPACING + 400;
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const world = worldRef.current;
      if (!wrap || !world) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(rect.height - vh, 1);
      const p = clamp01(-rect.top / total);
      const z = p * maxZ;
      world.style.transform = `translateZ(${z.toFixed(1)}px)`;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i * SPACING + LEAD - z;
        // heavy fog: the focused plane owns the screen. photos may
        // ghost in the distance; text goes fully dark so words never
        // stack over words.
        const isBeat = items[i]?.kind === "beat";
        let op: number;
        if (d < -380) op = 0;
        else if (d < 0) op = 1 + d / 380;
        else if (isBeat) {
          if (d < 200) op = 1;
          else if (d < 750) op = 1 - ((d - 200) / 550) * 0.97;
          else op = 0.03;
        } else if (d < 260) op = 1;
        else if (d < 1300) op = 1 - ((d - 260) / 1040) * 0.94;
        else op = 0.06;
        el.style.opacity = op.toFixed(3);
      });
      const hint = hintRef.current;
      if (hint) hint.style.opacity = p < 0.03 ? "1" : "0";
      const rail = railRef.current;
      if (rail) rail.style.transform = `translateY(${(p * 100).toFixed(2)}%)`;
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
  }, [reduced, items.length]);

  // reduced motion reads the story as a quiet stacked essay instead
  if (reduced) {
    return (
      <div className="mx-auto max-w-7xl space-y-16 px-5 py-24 sm:px-8">
        {items.map((item, i) =>
          item.kind === "beat" ? (
            <div key={i} className="max-w-2xl">
              {item.kicker ? <Kicker>{item.kicker}</Kicker> : null}
              <div className="mt-6 space-y-5">
                {item.paragraphs.map((p) => (
                  <p key={p} className="text-lg leading-relaxed text-starlight/85">
                    {linkCategory3(p)}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={item.src}
              alt={item.alt}
              className="w-full max-w-2xl rounded-lg border border-dust/25"
            />
          ),
        )}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: `${items.length * 58 + 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* deep space behind the flight */}
        <StarField />

        {/* the world the camera flies through */}
        <div className="absolute inset-0 [perspective:1100px]">
          <div
            ref={worldRef}
            className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
          >
            {items.map((item, i) => {
              const [ox, oy] =
                item.kind === "beat" ? [0, 0] : OFFSETS[i % OFFSETS.length];
              const zi = i * SPACING + LEAD;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate3d(calc(-50% + ${ox}vw), calc(-50% + ${oy}vh), ${-zi}px)`,
                    opacity: i === 0 ? 1 : 0.1,
                  }}
                >
                  {item.kind === "beat" ? (
                    <div className="w-[80vw] max-w-xl">
                      {item.kicker ? <Kicker>{item.kicker}</Kicker> : null}
                      <div className="mt-6 space-y-5">
                        {item.paragraphs.map((p) => (
                          <p
                            key={p}
                            className="text-base leading-relaxed text-starlight [text-shadow:0_2px_18px_rgb(4_4_8/0.9)] sm:text-lg"
                          >
                            {linkCategory3(p)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading={i < 5 ? "eager" : "lazy"}
                      className="w-[74vw] max-w-none rounded-lg border border-dust/25 shadow-[0_10px_50px_rgb(0_0_0/0.6)] md:w-[min(44vw,620px)]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* progress rail, a star riding the route */}
        <div
          aria-hidden="true"
          className="absolute right-5 top-1/2 h-36 w-px -translate-y-1/2 bg-dust/25 sm:right-8"
        >
          <div ref={railRef} className="absolute left-0 top-0 h-full w-full">
            <span className="absolute -left-[3.5px] top-0 h-2 w-2 rotate-45 bg-ember shadow-[0_0_10px_rgb(109_40_217/0.9)]" />
          </div>
        </div>

        {/* the invitation */}
        <p
          ref={hintRef}
          aria-hidden="true"
          className="meta-label absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-starlight/80 transition-opacity duration-700"
        >
          scroll to fly through the story
        </p>
      </div>
    </div>
  );
}
