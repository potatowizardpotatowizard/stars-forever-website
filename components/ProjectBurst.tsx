"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";

export type BurstPhoto = { src: string; alt: string };

// The six outer photos start packed against the center video as one
// connected collage, then push out along their own radial lines.
// Offsets are in vw for both axes so the cluster keeps its shape at
// every screen size. Speeds vary so the burst feels organic.
const OUTER = [
  { ox: -18, oy: -23, rot: -4, speed: 1.0 },
  { ox: 18, oy: -23, rot: 3, speed: 1.25 },
  { ox: -35, oy: 0, rot: -6, speed: 1.1 },
  { ox: 35, oy: 0, rot: 6, speed: 0.9 },
  { ox: -18, oy: 23, rot: 5, speed: 1.35 },
  { ox: 18, oy: 23, rot: -3, speed: 1.15 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Pinned collage: six photos packed around a looping video clip.
// Scrolling bursts the photos off the screen while the video grows
// exactly until it reaches the screen edges, then the section
// releases into the project list. Transform only.
export default function ProjectBurst({
  photos,
  videoSrc,
  videoPoster,
  kicker,
  heading,
  intro,
}: {
  photos: BurstPhoto[];
  videoSrc: string;
  videoPoster: string;
  kicker: string;
  heading: string;
  intro: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);
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

      // outer photos: accelerate outward and leave the screen
      const push = smooth(clamp01(p / 0.55));
      for (let i = 0; i < OUTER.length; i++) {
        const el = outerRefs.current[i];
        if (!el) continue;
        const c = OUTER[i];
        const dx = (c.ox / 100) * vw * push * 4.2 * c.speed;
        const dy = (c.oy / 100) * vw * push * 4.2 * c.speed + (c.oy === 0 ? 0 : 0);
        const rot = c.rot + push * c.rot * 2.5;
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // heading: lifts away as the collage bursts
      const head = headRef.current;
      if (head) {
        const fade = smooth(clamp01((p - 0.1) / 0.3));
        head.style.opacity = (1 - fade).toFixed(3);
        head.style.transform = `translate3d(0, ${(-fade * 0.1 * vh).toFixed(1)}px, 0)`;
      }

      // center video: grows until its width reaches the screen edges,
      // and no further
      const centerEl = centerRef.current;
      const centerBox = centerBoxRef.current;
      if (centerEl && centerBox) {
        const w0 = centerBox.clientWidth || 1;
        const edgeScale = vw / w0;
        // finishes exactly at the release so the list follows instantly
        const grow = smooth(clamp01((p - 0.22) / 0.78));
        const s = 1 + (edgeScale - 1) * grow;
        // drift from its collage spot up to true center as it grows
        const drift = 0.04 * vh * grow;
        centerEl.style.transform = `translate(-50%, -50%) translate3d(0, ${(-drift).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
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

  // Reduced motion: just the heading; the list below carries the rest.
  if (reduced) {
    return (
      <section className="mx-auto max-w-7xl px-5 pt-24 text-center sm:px-8 sm:pt-32">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          {heading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80">
          {intro}
        </p>
      </section>
    );
  }

  // one shared size for the six photos; the video sits slightly wider.
  // Offsets are pixel capped so the cluster never climbs into the
  // heading on wide screens.
  const photoSize = "clamp(170px, 38vw, 420px)";
  const xOff = (v: number) =>
    `calc(50% ${v < 0 ? "-" : "+"} clamp(${Math.abs(v) < 30 ? 62 : 125}px, ${Math.abs(v)}vw, ${Math.abs(v) < 30 ? 250 : 470}px))`;
  const yOff = (v: number) =>
    v === 0
      ? "60%"
      : `calc(60% ${v < 0 ? "-" : "+"} clamp(80px, ${Math.abs(v)}vw, 150px))`;

  return (
    <div ref={wrapRef} className="relative" style={{ height: "170vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <Grain />

        {/* the heading, above the collage on the same screen */}
        <div
          ref={headRef}
          className="absolute inset-x-0 top-0 z-30 px-5 pt-20 text-center will-change-transform sm:pt-24"
        >
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-starlight/80 sm:max-w-xl sm:text-lg">
            {intro}
          </p>
        </div>

        {/* six photos packed into a collage, bursting outward */}
        {photos.slice(0, OUTER.length).map((photo, i) => {
          const c = OUTER[i];
          return (
            <div
              key={photo.src}
              ref={(el) => {
                outerRefs.current[i] = el;
              }}
              className="absolute z-10 will-change-transform"
              style={{
                left: xOff(c.ox),
                top: yOff(c.oy),
                width: photoSize,
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

        {/* the video, growing until it touches the edges */}
        <div
          ref={centerRef}
          className="absolute left-1/2 top-[60%] z-20 will-change-transform"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div
            ref={centerBoxRef}
            className="overflow-hidden rounded-lg border border-dust/30 shadow-[0_0_60px_rgb(109_40_217/0.3)]"
            style={{ width: "clamp(190px, 44vw, 540px)" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={videoPoster}
              className="block aspect-video w-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
