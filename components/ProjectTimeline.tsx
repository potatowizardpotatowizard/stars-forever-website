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

// Scroll length devoted to each project, in viewport heights.
const SEG_VH = 160;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Scroll journey through the past projects. The section pins and each
// project flies toward the visitor out of the dark, newest first, its
// year glowing behind it. Transform only: no filters, no layout thrash.
export default function ProjectTimeline({
  projects,
}: {
  projects: TimelineProject[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  useEffect(() => {
    if (reduced) return;
    const n = projects.length;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const t = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        const year = yearRefs.current[i];
        if (!card || !year) continue;
        const local = Math.min(1, Math.max(0, t * n - i));
        const last = i === n - 1;

        let scale: number;
        let opacity: number;
        if (local < 0.55) {
          // approaching out of the dark
          const p = easeOutCubic(local / 0.55);
          scale = 0.12 + 0.88 * p;
          opacity = Math.min(1, (local / 0.55) * 1.7);
        } else if (last || local < 0.78) {
          // arrived
          scale = 1 + (local - 0.55) * 0.12;
          opacity = 1;
        } else {
          // flying past, into deeper past
          const q = (local - 0.78) / 0.22;
          scale = 1.03 + 2.2 * q * q;
          opacity = Math.max(0, 1 - q * 1.6);
        }

        card.style.transform = `translate3d(0,0,0) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.pointerEvents =
          local > 0.2 && (last || local < 0.85) ? "auto" : "none";

        // the year drifts on a slower track behind the card
        const yp = easeOutCubic(Math.min(1, local * 1.4));
        year.style.transform = `translate3d(0,0,0) scale(${(0.6 + 0.5 * yp).toFixed(4)})`;
        year.style.opacity = (opacity * 0.1).toFixed(3);
      }

      const current = Math.min(n - 1, Math.floor(t * n + 0.35));
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

  const jumpTo = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const total = wrap.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (total * (i + 0.55)) / projects.length,
      behavior: "smooth",
    });
  };

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
      style={{ height: `${projects.length * SEG_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Grain />

        {/* progress dots, one star stop per project */}
        <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4 sm:right-10">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Scroll to ${p.name}`}
              onClick={() => jumpTo(i)}
              className={`h-2.5 w-2.5 rotate-45 border transition-all duration-300 ${
                i === active
                  ? "scale-125 border-ember bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                  : "border-dust/50 bg-transparent hover:border-ember"
              }`}
            />
          ))}
        </div>

        {/* mission counter */}
        <p className="meta-label absolute left-6 top-24 z-30 text-dust sm:left-10">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </p>

        {projects.map((p, i) => (
          <div key={p.slug} className="absolute inset-0" style={{ zIndex: projects.length - i }}>
            {/* the year, deep in the background */}
            <div
              ref={(el) => {
                yearRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
              style={{ opacity: 0 }}
            >
              <span className="font-display text-[24vw] font-bold leading-none text-starlight">
                {p.year}
              </span>
            </div>

            {/* the project, flying toward the visitor */}
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{ opacity: 0, pointerEvents: "none" }}
            >
              <Link
                href={`/partner-projects/${p.slug}`}
                className="group block w-full max-w-2xl px-6 text-center"
              >
                {p.src ? (
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={1500}
                    height={1000}
                    sizes="42rem"
                    className="mx-auto aspect-[3/2] w-full max-w-xl rounded-xl border border-dust/25 object-cover shadow-[0_0_60px_rgb(109_40_217/0.25)]"
                  />
                ) : null}
                <p className="meta-label mt-7">
                  {p.location} · {p.date}
                </p>
                <h3 className="mt-3 font-display text-4xl font-bold transition-colors group-hover:text-ember sm:text-5xl">
                  {p.name}
                </h3>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-starlight/70">
                  {p.summary}
                </p>
                <span className="mono-link mt-6 inline-block text-sm font-bold text-ember">
                  Enter the project →
                </span>
              </Link>
            </div>
          </div>
        ))}

        {/* scroll hint, only while the first project approaches */}
        <p
          aria-hidden="true"
          className={`meta-label absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-dust transition-opacity duration-500 ${
            active === 0 ? "opacity-70" : "opacity-0"
          }`}
        >
          Scroll into the past ↓
        </p>
      </div>
    </div>
  );
}
