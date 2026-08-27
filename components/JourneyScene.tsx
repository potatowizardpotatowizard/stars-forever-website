"use client";

import { useEffect, useRef, useState } from "react";
import GlitchText from "@/components/GlitchText";
import Kicker from "@/components/Kicker";
import StarField from "@/components/StarField";
import { linkCategory3 } from "@/components/Category3Link";

export type JourneyItem =
  | { kind: "title"; title: string; sub: string }
  | { kind: "beat"; kicker?: string; paragraphs: string[] }
  | { kind: "photo"; src: string; alt: string };

// Tier one of the journey pages: every photo and story beat floats as
// a plane in deep space, and scrolling flies the camera forward
// through them, the site's starfield streaming past. One transform
// moves the whole world each frame; items only change opacity.
const SPACING = 900;
const LEAD = 0;

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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let zCur = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const maxZ = (items.length - 1) * SPACING + 100;
    // a continuous loop with easing: iOS only delivers sparse scroll
    // events during momentum, so the camera chases the scroll position
    // every frame instead of waiting for events
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      const world = worldRef.current;
      if (!wrap || !world) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const total = Math.max(rect.height - vh, 1);
      const p = clamp01(-rect.top / total);
      const zTarget = p * maxZ;
      zCur += (zTarget - zCur) * 0.16;
      if (Math.abs(zTarget - zCur) < 0.08) zCur = zTarget;
      world.style.transform = `translateZ(${zCur.toFixed(2)}px)`;
      const titleHolds = zCur < 450;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        if (titleHolds && i > 0) {
          el.style.opacity = "0";
          return;
        }
        const d = i * SPACING + LEAD - zCur;
        // heavy fog: the focused plane owns the screen. photos may
        // ghost in the distance; text goes fully dark so words never
        // stack over words.
        const isBeat = items[i]?.kind !== "photo";
        let op: number;
        if (d < -380) op = 0;
        else if (d < 0) op = 1 + d / 380;
        else if (isBeat) {
          if (d <= 350) op = 1;
          else if (d < 700) op = (700 - d) / 350;
          else op = 0;
        } else if (d < 260) op = 1;
        else if (d < 1300) op = 1 - ((d - 260) / 1040) * 0.94;
        else op = 0.06;
        el.style.opacity = op.toFixed(3);
      });
      const hint = hintRef.current;
      if (hint) hint.style.opacity = p < 0.03 ? "1" : "0";
    };
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, items]);

  // reduced motion reads the story as a quiet stacked essay instead
  if (reduced) {
    return (
      <div className="mx-auto max-w-7xl space-y-16 px-5 py-24 sm:px-8">
        {items.map((item, i) =>
          item.kind === "title" ? (
            <div key={i} className="max-w-2xl">
              <h2 className="font-display text-4xl font-bold">{item.title}</h2>
              <p className="mt-4 text-lg text-starlight/80">{item.sub}</p>
            </div>
          ) : item.kind === "beat" ? (
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
      id="journey-scene"
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
                item.kind === "photo" ? OFFSETS[i % OFFSETS.length] : [0, 0];
              const zi = i * SPACING + LEAD;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2 [backface-visibility:hidden]"
                  style={{
                    transform: `translate3d(calc(-50% + ${ox}vw), calc(-50% + ${oy}vh), ${-zi}px)`,
                    opacity: i === 0 ? 1 : 0.1,
                  }}
                >
                  {item.kind === "title" ? (
                    <div className="w-[88vw] max-w-2xl text-center">
                      <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white [text-shadow:0_0_14px_rgb(255_255_255/0.85),0_0_36px_rgb(167_139_250/0.7)] sm:text-6xl">
                        <GlitchText text={item.title} />
                      </h2>
                      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-starlight/85 sm:text-lg">
                        {item.sub}
                      </p>
                    </div>
                  ) : item.kind === "beat" ? (
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
                      loading="eager"
                      decoding="async"
                      className="w-[74vw] max-w-none rounded-lg border border-dust/25 shadow-[0_10px_50px_rgb(0_0_0/0.6)] md:w-[min(44vw,620px)]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* the invitation */}
        <p
          ref={hintRef}
          aria-hidden="true"
          className="meta-label absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-white transition-opacity duration-700 [text-shadow:0_0_10px_rgb(255_255_255/0.85),0_0_26px_rgb(167_139_250/0.7)]"
        >
          scroll to fly through the story
        </p>
      </div>
    </div>
  );
}
