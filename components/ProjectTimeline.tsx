"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";

export type TimelineProject = {
  slug: string;
  name: string;
  location: string;
  date: string;
  summary: string;
  src: string | null;
  alt: string;
  year: string;
};

// Pinned horizontal scroll through the past projects: the section holds
// the screen while vertical scrolling slides the project cards sideways,
// newest to oldest. Transform only: no filters, no layout thrash.
export default function ProjectTimeline({
  projects,
}: {
  projects: TimelineProject[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [wrapH, setWrapH] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // The wrapper must be tall enough that scrolling it end to end equals
  // the track's horizontal overflow, so the strip moves 1:1 with scroll.
  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      // svh sized sticky keeps the mobile toolbar from causing jitter;
      // measure it rather than window.innerHeight for the same reason
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      setWrapH(sticky.clientHeight + overflow);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [reduced, projects.length]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const rect = wrap.getBoundingClientRect();
      const vh = stickyRef.current?.clientHeight ?? window.innerHeight;
      const total = rect.height - vh;
      const t = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${(-t * overflow).toFixed(1)}px,0,0)`;

      const current = Math.min(
        projects.length - 1,
        Math.round(t * (projects.length - 1)),
      );
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
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
  }, [reduced, projects.length]);

  // Reduced motion: a calm grid, no journey.
  if (reduced) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 md:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/partner-projects/${p.slug}`}
            className="group block"
          >
            {p.src ? (
              <Image
                src={p.src}
                alt={p.alt}
                width={1500}
                height={1000}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[3/2] w-full rounded-lg border border-dust/20 object-cover"
              />
            ) : null}
            <p className="meta-label mt-6">
              {p.location} · {p.date}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember">
              {p.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-starlight/70">
              {p.summary}
            </p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: wrapH ? `${wrapH}px` : "200vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-svh items-center overflow-hidden"
      >
        <Grain />

        {/* mission counter */}
        <p className="meta-label absolute left-6 top-24 z-30 text-dust sm:left-10">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </p>

        {/* scroll hint, fades once the strip starts moving */}
        <p
          aria-hidden="true"
          className={`meta-label absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-dust transition-opacity duration-500 ${
            active === 0 ? "opacity-70" : "opacity-0"
          }`}
        >
          Keep scrolling into the past ↓
        </p>

        <div
          ref={trackRef}
          className="flex items-center gap-[4vw] pl-[8vw] pr-[10vw] will-change-transform"
        >
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/partner-projects/${p.slug}`}
              className="group relative block w-[82vw] max-w-[860px] flex-none md:w-[52vw]"
            >
              <div className="relative overflow-hidden rounded-xl border border-dust/25">
                {p.src ? (
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={1500}
                    height={1000}
                    sizes="52vw"
                    priority={i === 0}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="slot-placeholder aspect-[16/10] w-full" />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
                />
                {/* label, lower left like a field report */}
                <div className="absolute bottom-0 left-0 p-5 text-left sm:p-9">
                  <p className="meta-label text-starlight/70">
                    Previous project · {p.year}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember sm:text-5xl">
                    {p.name}
                  </h3>
                  <p className="meta-label mt-3 hidden text-dust sm:block">
                    {p.location} · {p.date}
                  </p>
                </div>
                {/* arrow, lower right */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-starlight/40 text-base text-starlight backdrop-blur-sm transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-night sm:bottom-9 sm:right-9 sm:h-12 sm:w-12 sm:text-lg"
                >
                  →
                </span>
              </div>
            </Link>
          ))}

          {/* the far end of the past: an invitation to write the next one */}
          <div className="w-[70vw] max-w-[420px] flex-none md:w-[26vw]">
            <p className="font-display text-3xl font-bold leading-snug text-starlight/85">
              The next project is unwritten.
            </p>
            <Link
              href="/apply"
              className="mono-link mt-6 inline-block text-sm font-bold text-ember"
            >
              Bring us your God dream →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
