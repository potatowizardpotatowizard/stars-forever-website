"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import StoryConnector from "@/components/StoryConnector";

// The Story as a night sky journey: chapters sit at different points of the
// sky, a constellation path threads between them, and a single guiding star
// travels the path as the reader scrolls, arriving at the cross above the
// tribute photo. On phones and under reduced motion the journey is a quiet
// stacked essay with the path fully drawn.

export type JourneyBeat = {
  src: string;
  alt: string;
  ratio: string;
  paragraphs: string[];
};

export type JourneyTribute = {
  src: string;
  alt: string;
  lines: string[];
};

export default function StoryJourney({
  beats,
  tribute,
}: {
  beats: JourneyBeat[];
  tribute: JourneyTribute;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{
    d: string;
    dots: [number, number][];
    w: number;
    h: number;
  } | null>(null);

  // Measure chapter anchors and build the constellation path through them.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const build = () => {
      if (window.innerWidth < 768) {
        setGeo(null);
        return;
      }
      const crect = container.getBoundingClientRect();
      const anchors: [number, number][] = [];
      for (const el of anchorRefs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        anchors.push([
          r.left - crect.left + r.width / 2,
          r.top - crect.top + r.height / 2,
        ]);
      }
      const end = endRef.current;
      if (end) {
        const r = end.getBoundingClientRect();
        anchors.push([
          r.left - crect.left + r.width / 2,
          r.top - crect.top + r.height / 2,
        ]);
      }
      if (anchors.length < 2) return;

      let d = `M ${anchors[0][0]} ${anchors[0][1]}`;
      const dots: [number, number][] = [];
      for (let i = 1; i < anchors.length; i++) {
        const [x1, y1] = anchors[i - 1];
        const [x2, y2] = anchors[i];
        // one bent waypoint per hop, alternating sides, like a constellation
        const bend = (i % 2 === 0 ? -1 : 1) * Math.min(140, crect.width * 0.12);
        const mx = (x1 + x2) / 2 + bend;
        const my = (y1 + y2) / 2;
        d += ` L ${mx} ${my} L ${x2} ${y2}`;
        dots.push([mx, my]);
      }
      setGeo({ d, dots, w: crect.width, h: crect.height });
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(container);
    window.addEventListener("resize", build);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", build);
    };
  }, [beats.length]);

  // Drive the drawing and the guiding star from scroll position.
  useEffect(() => {
    if (!geo) return;
    const path = pathRef.current;
    const star = starRef.current;
    const container = containerRef.current;
    if (!path || !star || !container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    if (reduce) {
      path.style.strokeDashoffset = "0";
      star.style.display = "none";
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = container.getBoundingClientRect();
      const probe = window.innerHeight * 0.55;
      const progress = Math.min(
        1,
        Math.max(0, (probe - rect.top) / rect.height),
      );
      path.style.strokeDashoffset = `${len * (1 - progress)}`;
      const pt = path.getPointAtLength(len * progress);
      star.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
      star.style.opacity = progress > 0.005 && progress < 0.995 ? "1" : "0";
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo]);

  return (
    <div ref={containerRef} className="relative">
      {/* The path and its waypoint stars, behind everything */}
      {geo ? (
        <svg
          aria-hidden="true"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          className="pointer-events-none absolute inset-0 hidden text-ember md:block"
        >
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.55"
          />
          {geo.dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.8" />
          ))}
        </svg>
      ) : null}

      {/* The guiding star */}
      <div
        ref={starRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden opacity-0 transition-opacity duration-300 md:block"
      >
        <Image
          src="/brand/star-sharp.png"
          alt=""
          width={30}
          height={30}
          className="vhs-glow"
        />
      </div>

      {/* Chapters, scattered across the sky */}
      <div className="relative z-10 space-y-24 sm:space-y-32">
        {beats.map((beat, i) => (
          <Reveal key={beat.src} className="md:grid md:grid-cols-12 md:items-center md:gap-10">
            <div
              className={
                i % 2 === 0
                  ? "md:col-span-6 md:col-start-1"
                  : "md:col-span-6 md:col-start-7 md:row-start-1"
              }
            >
              <div
                ref={(el) => {
                  anchorRefs.current[i] = el;
                }}
                className="overflow-hidden rounded-xl"
                style={{ aspectRatio: beat.ratio }}
              >
                <Image
                  src={beat.src}
                  alt={beat.alt}
                  width={1200}
                  height={800}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={i === 0}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div
              className={`mt-8 space-y-5 md:mt-0 ${
                i % 2 === 0
                  ? "md:col-span-5 md:col-start-8"
                  : "md:col-span-5 md:col-start-1 md:row-start-1"
              }`}
            >
              {beat.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* The destination: the cross, and the photo kept closest */}
      <section
        aria-label="Tribute"
        className="relative z-10 mx-auto max-w-lg px-1 pb-10 pt-24 sm:pt-32"
      >
        {/* The cross draws itself in as it scrolls into view, on every screen */}
        <Reveal className="story-node flex">
          <div ref={endRef}>
            <StoryConnector variant="d" />
          </div>
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={20}
            height={20}
            className="story-star"
          />
        </Reveal>
        <Reveal>
          <div className="tribute-glow overflow-hidden rounded-xl">
            <Image
              src={tribute.src}
              alt={tribute.alt}
              width={1200}
              height={900}
              sizes="32rem"
              className="w-full"
            />
          </div>
          <div className="mt-12 space-y-3 text-center">
            {tribute.lines.map((line) => (
              <p key={line} className="font-display text-xl text-starlight/90">
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
