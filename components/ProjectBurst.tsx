"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";

export type BurstPhoto = { src: string; alt: string };

// Positions of the six outer photos: offsets from screen center in
// viewport units, plus a size, a resting tilt, and a push speed.
// They mirror the scattered-photo cloud on omeduogroningen.nl.
const OUTER = [
  { ox: -33, oy: -27, w: 17, rot: -7, speed: 1.0 },
  { ox: 27, oy: -31, w: 13, rot: 5, speed: 1.25 },
  { ox: 39, oy: -2, w: 15, rot: 8, speed: 0.9 },
  { ox: 29, oy: 28, w: 12, rot: -5, speed: 1.35 },
  { ox: -26, oy: 30, w: 14, rot: 6, speed: 1.1 },
  { ox: -40, oy: 4, w: 12, rot: -9, speed: 1.2 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Pinned intro: a cloud of seven project photos around the heading.
// Scrolling pushes the six outer photos off the screen along their own
// radial lines while the center photo grows to take the whole stage.
// Transform only: no filters, no layout thrash.
export default function ProjectBurst({
  center,
  outer,
  kicker,
  heading,
  intro,
}: {
  center: BurstPhoto;
  outer: BurstPhoto[];
  kicker: string;
  heading: string;
  intro: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);
  const centerImgRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

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
      const vw = sticky.clientWidth;
      const total = rect.height - vh;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;

      // outer photos: hold for a beat, then accelerate outward
      const push = smooth(clamp01((p - 0.08) / 0.6));
      for (let i = 0; i < OUTER.length; i++) {
        const el = outerRefs.current[i];
        if (!el) continue;
        const c = OUTER[i];
        const dx = (c.ox / 100) * vw * push * 3.4 * c.speed;
        const dy = (c.oy / 100) * vh * push * 3.4 * c.speed;
        const rot = c.rot + push * c.rot * 2.2;
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // heading: fades and lifts as the cloud disperses
      const head = headRef.current;
      if (head) {
        const fade = smooth(clamp01((p - 0.22) / 0.28));
        head.style.opacity = (1 - fade).toFixed(3);
        head.style.transform = `translate3d(0, ${(-fade * 0.12 * vh).toFixed(1)}px, 0)`;
      }

      // center photo: grows from a small card to nearly the whole stage
      const center = centerRef.current;
      const centerImg = centerImgRef.current;
      if (center && centerImg) {
        const w0 = centerImg.clientWidth || 1;
        const h0 = centerImg.clientHeight || 1;
        const maxScale = Math.max((0.92 * vw) / w0, (0.86 * vh) / h0);
        const grow = smooth(clamp01((p - 0.3) / 0.55));
        const s = 1 + (maxScale - 1) * grow;
        center.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
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
  }, [reduced]);

  // Reduced motion: the plain heading, no cloud.
  if (reduced) {
    return (
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          {heading}
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-starlight/80">{intro}</p>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: "260vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-svh overflow-hidden"
      >
        <Grain />

        {/* six outer photos, pushed out along their own radial lines */}
        {outer.slice(0, OUTER.length).map((photo, i) => {
          const c = OUTER[i];
          return (
            <div
              key={photo.src}
              ref={(el) => {
                outerRefs.current[i] = el;
              }}
              className="absolute z-10 will-change-transform"
              style={{
                left: `calc(50% + ${c.ox}vw)`,
                top: `calc(50% + ${c.oy}svh)`,
                width: `clamp(110px, ${c.w + 6}vw, ${c.w * 19}px)`,
                transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
              }}
            >
              <Image
                src={photo.src}
                alt=""
                aria-hidden="true"
                width={600}
                height={400}
                sizes="20vw"
                className="aspect-[3/2] w-full rounded-lg border border-dust/25 object-cover shadow-[0_10px_40px_rgb(0_0_0/0.5)]"
              />
            </div>
          );
        })}

        {/* the center photo, waiting to take the stage */}
        <div
          ref={centerRef}
          className="absolute left-1/2 top-1/2 z-20 will-change-transform"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div
            ref={centerImgRef}
            className="w-[min(74vw,340px)] overflow-hidden rounded-xl border border-dust/25 md:w-[26vw] md:max-w-[420px]"
          >
            {/* loads at its final grown size so the scale up stays sharp */}
            <Image
              src={center.src}
              alt={center.alt}
              width={1500}
              height={1000}
              sizes="92vw"
              priority
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>

        {/* the heading, floating over the cloud */}
        <div
          ref={headRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 max-w-3xl font-display text-5xl font-bold [text-shadow:0_2px_30px_rgb(4_4_8/0.9)] sm:text-7xl">
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-base text-starlight/85 [text-shadow:0_1px_16px_rgb(4_4_8/0.9)] sm:text-lg">
            {intro}
          </p>
        </div>
      </div>
    </div>
  );
}
