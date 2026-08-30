"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";

export type CohortStar = { name: string; niche: string };

// Hand placed constellation: ten stars in a flowing line across the
// lower sky, coordinates in percent of the sticky viewport. Labels
// alternate above and below their star.
const STAR_POINTS = [
  { x: 19, y: 48 },
  { x: 24, y: 62 },
  { x: 20, y: 80 },
  { x: 37, y: 72 },
  { x: 44, y: 52 },
  { x: 57, y: 64 },
  { x: 54, y: 84 },
  { x: 70, y: 74 },
  { x: 78, y: 54 },
  { x: 84, y: 68 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Ten creators, ten stars. Scrolling ignites them one by one, lines
// join them into a constellation, and the finished figure gives way
// to the dusk desert video as the cohort's card. Transform and
// opacity only.
export default function CohortConstellation({
  stars,
  videoSrc,
  videoPoster,
  kicker,
  heading,
  intro,
  card,
}: {
  stars: CohortStar[];
  videoSrc: string;
  videoPoster: string;
  kicker: string;
  heading: string;
  intro: string;
  card: { label: string; name: string; meta: string; href: string };
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLAnchorElement>(null);
  const [reduced, setReduced] = useState(false);

  const n = Math.min(stars.length, STAR_POINTS.length);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const sticky = stickyRef.current;
      if (!wrap || !sticky) return;
      const rect = wrap.getBoundingClientRect();
      const vh = sticky.clientHeight;
      const total = rect.height - vh;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;

      // stars ignite one by one across the first two thirds
      for (let i = 0; i < n; i++) {
        const el = starRefs.current[i];
        if (!el) continue;
        const start = 0.05 + i * 0.05;
        const lit = smooth(clamp01((p - start) / 0.07));
        el.style.opacity = lit.toFixed(3);
        el.style.transform = `translate(-50%, -50%) scale(${(0.3 + 0.7 * lit).toFixed(3)})`;
      }

      // each line draws once both of its stars burn
      for (let i = 0; i < n - 1; i++) {
        const el = lineRefs.current[i];
        if (!el) continue;
        const start = 0.05 + (i + 1) * 0.05 + 0.04;
        const drawn = smooth(clamp01((p - start) / 0.06));
        el.style.opacity = drawn.toFixed(3);
      }

      // the finished constellation dims as the cohort card arrives
      const handoff = smooth(clamp01((p - 0.74) / 0.22));
      const sky = skyRef.current;
      if (sky) sky.style.opacity = (1 - handoff * 0.8).toFixed(3);
      const cardEl = cardRef.current;
      const centerEl = centerRef.current;
      if (cardEl && centerEl) {
        cardEl.style.opacity = handoff.toFixed(3);
        cardEl.style.transform = `scale(${(0.9 + 0.1 * handoff).toFixed(3)})`;
        centerEl.style.pointerEvents = handoff > 0.5 ? "auto" : "none";
      }
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
  }, [reduced, n]);

  const cardLabel = (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/15 to-transparent"
      />
      <div className="absolute bottom-0 left-0 p-4 text-left sm:p-6">
        <p className="meta-label text-starlight/70">{card.label}</p>
        <h3 className="mt-1.5 font-display text-xl font-bold sm:text-3xl">
          {card.name}
        </h3>
        <p className="meta-label mt-2 hidden text-dust sm:block">{card.meta}</p>
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-starlight/40 text-base text-starlight backdrop-blur-sm sm:bottom-6 sm:right-6 sm:h-11 sm:w-11"
      >
        →
      </span>
    </>
  );

  // Reduced motion: the heading plus a calm labeled video card.
  if (reduced) {
    return (
      <>
        <section className="mx-auto max-w-7xl px-5 pt-24 text-center sm:px-8 sm:pt-32">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80">
            {intro}
          </p>
        </section>
        <section className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
          <Link href={card.href} className="group relative block">
            <div className="relative overflow-hidden rounded-xl border border-dust/25">
              <Image
                src={videoPoster}
                alt={card.name}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 60rem, 100vw"
                className="aspect-[16/10] w-full object-cover"
              />
              {cardLabel}
            </div>
          </Link>
        </section>
      </>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: "190vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">

        {/* the heading, above the sky */}
        <div className="absolute inset-x-0 top-0 z-30 px-5 pt-20 text-center sm:pt-24">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-starlight/80 sm:max-w-xl sm:text-lg">
            {intro}
          </p>
        </div>

        {/* the constellation: ten stars and the lines that join them */}
        <div ref={skyRef} className="absolute inset-0 z-10">
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {STAR_POINTS.slice(0, n - 1).map((pt, i) => (
              <line
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                x1={pt.x}
                y1={pt.y}
                x2={STAR_POINTS[i + 1].x}
                y2={STAR_POINTS[i + 1].y}
                strokeDasharray="1 0.8"
                opacity={0}
                className="stroke-ember/70"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: "2px" }}
              />
            ))}
          </svg>

          {stars.slice(0, n).map((star, i) => {
            const pt = STAR_POINTS[i];
            const labelBelow = pt.y < 66;
            return (
              <div
                key={star.name}
                ref={(el) => {
                  starRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  opacity: 0,
                  transform: "translate(-50%, -50%) scale(0.3)",
                }}
              >
                <div className="flex flex-col items-center">
                  {!labelBelow ? (
                    <p className="mb-1.5 whitespace-nowrap text-center">
                      <span className="meta-label block text-[9px] text-starlight sm:text-[11px]">
                        {star.name}
                      </span>
                      <span className="meta-label block text-[8px] text-dust sm:text-[9px]">
                        {star.niche}
                      </span>
                    </p>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="block h-2 w-2 rotate-45 bg-starlight shadow-[0_0_14px_rgb(109_40_217/0.95),0_0_5px_rgb(237_233_254/0.9)] sm:h-2.5 sm:w-2.5"
                  />
                  {labelBelow ? (
                    <p className="mt-1.5 whitespace-nowrap text-center">
                      <span className="meta-label block text-[9px] text-starlight sm:text-[11px]">
                        {star.name}
                      </span>
                      <span className="meta-label block text-[8px] text-dust sm:text-[9px]">
                        {star.niche}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* the cohort card, arriving as the constellation completes */}
        <Link
          ref={centerRef}
          href={card.href}
          className="group absolute left-1/2 top-[62%] z-20 block -translate-x-1/2 -translate-y-1/2"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-xl border border-dust/30 shadow-[0_0_60px_rgb(109_40_217/0.35)] will-change-transform"
            style={{ opacity: 0, width: "min(88vw, 620px)" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={videoPoster}
              className="block aspect-[16/10] w-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {cardLabel}
          </div>
        </Link>
      </div>
    </div>
  );
}
