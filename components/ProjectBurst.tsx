"use client";

import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Kicker from "@/components/Kicker";

export type BurstPhoto = { src: string; alt: string };
export type BurstProject = {
  name: string;
  year: string;
  meta: string;
  href: string;
};

// The six outer photos start packed against the center video as one
// connected collage, then push out along their own radial lines.
// Offsets are in vw for both axes so the cluster keeps its shape, and
// pixel capped so the photos never climb into the heading.
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

// The width every list card gets from its max-w-5xl px-5 container.
const cardWidth = (vw: number) => Math.min(vw - 40, 984);
// The collage size of the center video, mirrored in CSS below.
const baseWidth = (vw: number) => Math.min(Math.max(190, 0.44 * vw), 540);

// Pinned collage: six photos packed around a looping video clip.
// Scrolling bursts the photos off the screen while the video grows to
// project card size and reveals its label, becoming the Real Treasure
// preview that then scrolls away as the first item of the list.
export default function ProjectBurst({
  photos,
  videoSrc,
  videoPoster,
  kicker,
  heading,
  intro,
  project,
}: {
  photos: BurstPhoto[];
  videoSrc: string;
  videoPoster: string;
  kicker: string;
  heading: string;
  intro: string;
  project: BurstProject;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerRef = useRef<HTMLAnchorElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
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
        const dy = (c.oy / 100) * vw * push * 4.2 * c.speed;
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

      // center video: widens from its collage size to project card
      // size, finishing exactly at the release
      const centerEl = centerRef.current;
      const centerBox = centerBoxRef.current;
      const label = labelRef.current;
      if (centerEl && centerBox && label) {
        const grow = smooth(clamp01((p - 0.22) / 0.78));
        const w = baseWidth(vw) + (cardWidth(vw) - baseWidth(vw)) * grow;
        centerBox.style.width = `${w.toFixed(1)}px`;
        // the card label fades in over the last stretch of the growth
        label.style.opacity = clamp01((grow - 0.65) / 0.35).toFixed(3);
        centerEl.style.pointerEvents = grow > 0.6 ? "auto" : "none";
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
        className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
      />
      <div className="absolute bottom-0 left-0 p-5 text-left sm:p-9">
        <p className="meta-label text-starlight/70">
          Previous project · {project.year}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-5xl">
          {project.name}
        </h3>
        <p className="meta-label mt-3 hidden text-dust sm:block">
          {project.meta}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-starlight/40 text-base text-starlight backdrop-blur-sm sm:bottom-9 sm:right-9 sm:h-12 sm:w-12 sm:text-lg"
      >
        →
      </span>
    </>
  );

  // Reduced motion: the heading plus a calm Real Treasure card, so the
  // project still leads the list it no longer appears in.
  if (reduced) {
    return (
      <>
        <section className="mx-auto max-w-7xl px-5 pt-24 text-center sm:px-8 sm:pt-32">
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80">
            {intro}
          </p>
        </section>
        <section className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
          <Link href={project.href} className="group relative block">
            <div className="relative overflow-hidden rounded-xl border border-dust/25">
              <Image
                src={videoPoster}
                alt={project.name}
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
    <div ref={wrapRef} className="relative" style={{ height: "170vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">

        {/* the heading, above the collage on the same screen */}
        <div
          ref={headRef}
          className="absolute inset-x-0 top-0 z-30 px-5 pt-20 text-center will-change-transform sm:pt-24"
        >
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
          const xOff = `calc(50% ${c.ox < 0 ? "-" : "+"} clamp(${Math.abs(c.ox) < 30 ? 62 : 125}px, ${Math.abs(c.ox)}vw, ${Math.abs(c.ox) < 30 ? 250 : 470}px))`;
          const yOff =
            c.oy === 0
              ? "53%"
              : `calc(53% ${c.oy < 0 ? "-" : "+"} clamp(80px, ${Math.abs(c.oy)}vw, 150px))`;
          return (
            <div
              key={photo.src}
              ref={(el) => {
                outerRefs.current[i] = el;
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

        {/* the video, growing into the Real Treasure preview card */}
        <Link
          ref={centerRef}
          href={project.href}
          className="group absolute left-1/2 top-[53%] z-20 block -translate-x-1/2 -translate-y-1/2"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={centerBoxRef}
            className="relative overflow-hidden rounded-xl border border-dust/30 shadow-[0_0_60px_rgb(109_40_217/0.3)]"
            style={{ width: "clamp(190px, 44vw, 540px)" }}
          >
            <LazyVideo
              src={videoSrc}
              poster={videoPoster}
              className="block aspect-[16/10] w-full object-cover"
            />
            <div ref={labelRef} style={{ opacity: 0 }}>
              {cardLabel}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
