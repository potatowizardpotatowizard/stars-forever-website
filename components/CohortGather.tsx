"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";

export type GatherPhoto = { src: string; alt: string };

// Final resting spots of the six photos, packed against the center
// video as one connected collage. The mirror of ProjectBurst: these
// photos START far outside the screen and gather in as the visitor
// scrolls, because the cohort is creators coming together.
const SPOTS = [
  { ox: -18, oy: -23, rot: -4, speed: 1.0 },
  { ox: 18, oy: -23, rot: 3, speed: 1.25 },
  { ox: -35, oy: 0, rot: -6, speed: 1.1 },
  { ox: 35, oy: 0, rot: 6, speed: 0.9 },
  { ox: -18, oy: 23, rot: 5, speed: 1.35 },
  { ox: 18, oy: 23, rot: -3, speed: 1.15 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function CohortGather({
  photos,
  videoSrc,
  videoPoster,
  kicker,
  heading,
  intro,
  card,
}: {
  photos: GatherPhoto[];
  videoSrc: string;
  videoPoster: string;
  kicker: string;
  heading: string;
  intro: string;
  card: { label: string; name: string; meta: string; href: string };
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLAnchorElement>(null);
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

      // photos: far outside at first, home by the end
      const gather = smooth(clamp01(p / 0.75));
      const away = 1 - gather;
      for (let i = 0; i < SPOTS.length; i++) {
        const el = photoRefs.current[i];
        if (!el) continue;
        const c = SPOTS[i];
        const dx = (c.ox / 100) * vw * away * 4.2 * c.speed;
        const dy = (c.oy / 100) * vw * away * 4.2 * c.speed;
        const rot = c.rot + away * c.rot * 2.5;
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // the card label arrives once the collage has locked together
      const label = labelRef.current;
      const centerEl = centerRef.current;
      if (label && centerEl) {
        label.style.opacity = clamp01((p - 0.72) / 0.28).toFixed(3);
        centerEl.style.pointerEvents = p > 0.6 ? "auto" : "none";
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
    <div ref={wrapRef} className="relative" style={{ height: "150vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <Grain />

        {/* the heading, above the gathering on the same screen */}
        <div className="absolute inset-x-0 top-0 z-30 px-5 pt-20 text-center sm:pt-24">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-starlight/80 sm:max-w-xl sm:text-lg">
            {intro}
          </p>
        </div>

        {/* six photos flying in from beyond the edges */}
        {photos.slice(0, SPOTS.length).map((photo, i) => {
          const c = SPOTS[i];
          const xOff = `calc(50% ${c.ox < 0 ? "-" : "+"} clamp(${Math.abs(c.ox) < 30 ? 62 : 125}px, ${Math.abs(c.ox)}vw, ${Math.abs(c.ox) < 30 ? 250 : 470}px))`;
          const yOff =
            c.oy === 0
              ? "60%"
              : `calc(60% ${c.oy < 0 ? "-" : "+"} clamp(80px, ${Math.abs(c.oy)}vw, 150px))`;
          return (
            <div
              key={photo.src}
              ref={(el) => {
                photoRefs.current[i] = el;
              }}
              className="absolute z-10 will-change-transform"
              style={{
                left: xOff,
                top: yOff,
                width: "clamp(170px, 38vw, 420px)",
                transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
              }}
            >
              <Image
                src={photo.src}
                alt=""
                aria-hidden="true"
                width={800}
                height={534}
                sizes="34vw"
                className="aspect-[3/2] w-full rounded-lg border border-dust/25 object-cover shadow-[0_10px_40px_rgb(0_0_0/0.55)]"
              />
            </div>
          );
        })}

        {/* the dusk video waiting at the middle of the gathering */}
        <Link
          ref={centerRef}
          href={card.href}
          className="group absolute left-1/2 top-[60%] z-20 block -translate-x-1/2 -translate-y-1/2"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="relative overflow-hidden rounded-xl border border-dust/30 shadow-[0_0_60px_rgb(109_40_217/0.3)]"
            style={{ width: "clamp(190px, 44vw, 540px)" }}
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
            <div ref={labelRef} style={{ opacity: 0 }}>
              {cardLabel}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
