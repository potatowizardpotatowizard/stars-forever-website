"use client";

import { useEffect, useRef, useState } from "react";
import GlitchText from "@/components/GlitchText";
import Kicker from "@/components/Kicker";
import StarField from "@/components/StarField";
import { linkCategory3 } from "@/components/Category3Link";

export type JourneyItem =
  | { kind: "title"; title: string; sub: string; glitch?: boolean }
  | {
      kind: "beat";
      kicker?: string;
      paragraphs: string[];
      link?: { label: string; href: string };
    }
  | { kind: "photo"; src: string; alt: string; tall?: boolean }
  | { kind: "route"; from: string; via?: string; to: string };

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        setNear(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let zCur = 0;
    let lastApplied = -1;
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
      if (rect.bottom < 40 || rect.top > vh * 1.6) return;
      const total = Math.max(rect.height - vh, 1);
      const p = clamp01(-rect.top / total);
      const scene = sceneRef.current;
      if (scene) {
        const fade = 1 - clamp01((p - 0.93) / 0.055);
        scene.style.opacity = fade.toFixed(3);
      }
      const zTarget = clamp01(p / 0.94) * maxZ;
      zCur += (zTarget - zCur) * 0.16;
      if (Math.abs(zTarget - zCur) < 0.08) zCur = zTarget;
      // once settled and applied, stop touching styles; but always
      // apply at least once so first paint never shows stale ghosts
      if (zCur === zTarget && lastApplied === zCur) {
        const hint0 = hintRef.current;
        if (hint0) hint0.style.opacity = p < 0.03 ? "1" : "0";
        return;
      }
      lastApplied = zCur === zTarget ? zCur : -1;
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
        // route planes draw their ember line as the camera approaches,
        // the traveling star riding the tip
        if (items[i]?.kind === "route" && op > 0) {
          const path = el.querySelector<SVGPathElement>("[data-route-path]");
          if (path) {
            const lp = clamp01((600 - d) / 550);
            path.style.strokeDashoffset = (1 - lp).toFixed(4);
            const star = el.querySelector<SVGGElement>("[data-route-star]");
            if (star) {
              const len = path.getTotalLength();
              const pt = path.getPointAtLength(len * lp);
              star.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
              star.style.opacity = lp > 0.01 ? "1" : "0";
            }
            el.querySelectorAll<SVGGElement>("[data-route-node]").forEach((node) => {
              node.style.opacity = lp >= Number(node.dataset.at ?? 0) ? "1" : "0";
            });
          }
        }
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
          ) : item.kind === "route" ? (
            <p key={i} className="meta-label text-dust">
              {[item.from, item.via, item.to].filter(Boolean).join(" → ")}
            </p>
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
      style={{ height: `${items.length * 54 + 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={sceneRef} className="absolute inset-0">
        {/* deep space behind the flight, asleep once you have flown
            past so it never competes with the rest of the page */}
        {near ? <StarField /> : null}

        {/* the world the camera flies through */}
        <div className="absolute inset-0 [perspective:1100px]">
          <div
            ref={worldRef}
            className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
          >
            {items.map((item, i) => {
              const [ox, oy] =
                item.kind === "photo" && !item.tall
                  ? OFFSETS[i % OFFSETS.length]
                  : [0, 0];
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
                        {item.glitch === false ? (
                          item.title
                        ) : (
                          <GlitchText text={item.title} />
                        )}
                      </h2>
                      {item.sub ? (
                        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-starlight/85 sm:text-lg">
                          {item.sub}
                        </p>
                      ) : null}
                    </div>
                  ) : item.kind === "route" ? (
                    <div className="w-[88vw] max-w-2xl">
                      <svg
                        viewBox="0 0 600 400"
                        fill="none"
                        className="w-full overflow-visible"
                        aria-label={`Route from ${item.from} to ${item.to}`}
                      >
                        {/* the flight line, drawn by scroll */}
                        <path
                          data-route-path
                          d="M60 330 C 170 312, 238 244, 308 188 C 378 132, 468 96, 540 74"
                          pathLength={1}
                          strokeDasharray="1"
                          strokeDashoffset="1"
                          stroke="rgba(237,233,254,0.9)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          style={{ filter: "drop-shadow(0 0 6px rgba(180,140,255,0.8))" }}
                        />
                        {/* waypoints ignite as the line reaches them */}
                        <g data-route-node data-at="0.02" className="transition-opacity duration-500" opacity="0">
                          <circle cx="60" cy="330" r="3.5" fill="#efecf7" style={{ filter: "drop-shadow(0 0 8px rgba(180,140,255,0.9))" }} />
                          <text x="60" y="360" textAnchor="start" fill="#b7aecb" fontSize="13" letterSpacing="0.22em" style={{ fontFamily: "var(--font-fragment)" }}>
                            {item.from.toUpperCase()}
                          </text>
                        </g>
                        {item.via ? (
                          <g data-route-node data-at="0.5" className="transition-opacity duration-500" opacity="0">
                            <circle cx="308" cy="188" r="2.8" fill="#efecf7" style={{ filter: "drop-shadow(0 0 7px rgba(180,140,255,0.85))" }} />
                            <text x="308" y="222" textAnchor="middle" fill="#b7aecb" fontSize="13" letterSpacing="0.22em" style={{ fontFamily: "var(--font-fragment)" }}>
                              {item.via.toUpperCase()}
                            </text>
                          </g>
                        ) : null}
                        <g data-route-node data-at="0.96" className="transition-opacity duration-500" opacity="0">
                          <circle cx="540" cy="74" r="4" fill="#ffffff" style={{ filter: "drop-shadow(0 0 10px rgba(180,140,255,1))" }} />
                          <text x="540" y="46" textAnchor="end" fill="#efecf7" fontSize="13" letterSpacing="0.22em" style={{ fontFamily: "var(--font-fragment)" }}>
                            {item.to.toUpperCase()}
                          </text>
                        </g>
                        {/* the traveling star riding the line */}
                        <g data-route-star opacity="0">
                          <circle r="7" fill="rgba(180,140,255,0.45)" style={{ filter: "blur(3px)" }} />
                          <circle r="2.6" fill="#ffffff" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.95))" }} />
                        </g>
                      </svg>
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
                        {item.link ? (
                          <a
                            href={item.link.href}
                            className="mono-link inline-block text-sm font-bold text-ember"
                          >
                            {item.link.label} →
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="eager"
                      decoding="async"
                      className={
                        item.tall
                          ? "h-[60svh] w-auto max-w-[86vw] rounded-lg border border-dust/25 shadow-[0_10px_50px_rgb(0_0_0/0.6)] md:h-[76svh]"
                          : "w-[74vw] max-w-none rounded-lg border border-dust/25 shadow-[0_10px_50px_rgb(0_0_0/0.6)] md:w-[min(44vw,620px)]"
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
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
