"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";

export type BurstPhoto = { src: string; alt: string };

// Positions of the six outer photos: offsets from screen center in
// viewport units, a resting tilt, and a push speed. All seven photos
// share the same size, like the scattered cloud on omeduogroningen.nl.
const OUTER = [
  { ox: -30, oy: -26, rot: -7, speed: 1.0 },
  { ox: 27, oy: -30, rot: 5, speed: 1.25 },
  { ox: 37, oy: -1, rot: 8, speed: 0.9 },
  { ox: 28, oy: 27, rot: -5, speed: 1.35 },
  { ox: -26, oy: 29, rot: 6, speed: 1.1 },
  { ox: -38, oy: 3, rot: -9, speed: 1.2 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Pinned photo cloud: seven equally sized project photos. Scrolling
// pushes the six outer ones off the screen along their own radial
// lines while the center photo grows exactly until it reaches the
// screen edges, then the section releases. Transform only.
export default function ProjectBurst({
  center,
  outer,
}: {
  center: BurstPhoto;
  outer: BurstPhoto[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);
  const centerImgRef = useRef<HTMLDivElement>(null);
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
      const push = smooth(clamp01(p / 0.62));
      for (let i = 0; i < OUTER.length; i++) {
        const el = outerRefs.current[i];
        if (!el) continue;
        const c = OUTER[i];
        const dx = (c.ox / 100) * vw * push * 3.6 * c.speed;
        const dy = (c.oy / 100) * vh * push * 3.6 * c.speed;
        const rot = c.rot + push * c.rot * 2.2;
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // center photo: grows until its width reaches the screen edges,
      // and no further
      const centerEl = centerRef.current;
      const centerImg = centerImgRef.current;
      if (centerEl && centerImg) {
        const w0 = centerImg.clientWidth || 1;
        const edgeScale = vw / w0;
        const grow = smooth(clamp01((p - 0.25) / 0.65));
        const s = 1 + (edgeScale - 1) * grow;
        centerEl.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
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

  // Reduced motion: no cloud; the heading above and list below carry it.
  if (reduced) return null;

  // one shared size for all seven photos
  const photoSize = "clamp(130px, 30vw, 360px)";

  return (
    <div ref={wrapRef} className="relative" style={{ height: "220vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
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
                width: photoSize,
                transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
              }}
            >
              <Image
                src={photo.src}
                alt=""
                aria-hidden="true"
                width={600}
                height={400}
                sizes="30vw"
                className="aspect-[3/2] w-full rounded-lg border border-dust/25 object-cover shadow-[0_10px_40px_rgb(0_0_0/0.5)]"
              />
            </div>
          );
        })}

        {/* the center photo, growing until it touches the edges */}
        <div
          ref={centerRef}
          className="absolute left-1/2 top-1/2 z-20 will-change-transform"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div
            ref={centerImgRef}
            className="overflow-hidden rounded-lg border border-dust/25"
            style={{ width: photoSize }}
          >
            {/* loads at its final grown size so the scale up stays sharp */}
            <Image
              src={center.src}
              alt={center.alt}
              width={1500}
              height={1000}
              sizes="100vw"
              priority
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
