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
  | { kind: "route"; stops: string[] };

// Tier one of the journey pages: every photo and story beat floats as
// a plane in deep space, and scrolling flies the camera forward
// through them, the site's starfield streaming past. One transform
// moves the whole world each frame; items only change opacity.
const SPACING = 900;
const LEAD = 0;

// Tiny outline drawings for route waypoints, keyed by stop name.
// Single-stroke constellation style, each within a ~24px box.
const ROUTE_ICONS: Record<string, React.ReactNode> = {
  tokyo: (
    // torii gate
    <>
      <path d="M-10 -7 Q0 -10 10 -7" />
      <path d="M-8 -6.5 L-8 -4 M8 -6.5 L8 -4" />
      <path d="M-7 -4 L7 -4" />
      <path d="M-5.5 -4 L-6.5 8 M5.5 -4 L6.5 8" />
    </>
  ),
  "rural japan": (
    // mountains
    <>
      <path d="M-10 8 L-3 -6 L1 0 L5 -4 L10 8" />
      <path d="M-5.5 -1 L-3 -6 L-0.5 -1" />
    </>
  ),
  "ebisu circuit": (
    // drift car
    <>
      <path d="M-9 3 Q-9 -1 -4 -2 L-2 -5 L4 -5 L6 -2 Q9 -1 9 3 Z" />
      <circle cx="-5" cy="4" r="2" />
      <circle cx="5" cy="4" r="2" />
    </>
  ),
  california: (
    // palm tree
    <>
      <path d="M0 8 Q1 1 0 -3" />
      <path d="M0 -3 Q-5 -7 -9 -4" />
      <path d="M0 -3 Q5 -7 9 -4" />
      <path d="M0 -3 Q-2 -9 -6 -9" />
      <path d="M0 -3 Q2 -9 6 -9" />
    </>
  ),
  iceland: (
    // glacier peaks
    <>
      <path d="M-10 8 L-4 -5 L0 -1 L4 -7 L10 8" />
      <path d="M-5.5 -2 L-4 -5 L-2.5 -2 M2.7 -4.5 L4 -7 L5.3 -4.5" />
    </>
  ),
  "the shared house": (
    // house
    <>
      <path d="M-9 8 L-9 -2 L0 -9 L9 -2 L9 8 Z" />
      <path d="M-2 8 L-2 2 L2 2 L2 8" />
    </>
  ),
  "the desert": (
    // saguaro
    <>
      <path d="M0 8 L0 -8" />
      <path d="M0 -1 Q-6 -1 -6 -7" />
      <path d="M0 1 Q6 1 6 -4" />
    </>
  ),
  "joshua tree": (
    // joshua tree
    <>
      <path d="M0 8 L0 -1" />
      <path d="M0 -1 L-6 -6 M-6 -6 L-9 -4 M-6 -6 L-7 -9" />
      <path d="M0 -1 L5 -5 M5 -5 L8 -3 M5 -5 L5 -9" />
    </>
  ),
  "las vegas": (
    // dice
    <>
      <rect x="-8" y="-8" width="16" height="16" rx="3" />
      <circle cx="-3.5" cy="-3.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="0" cy="0" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="3.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  toronto: (
    // cn tower
    <>
      <path d="M0 -10 L0 -6 M-1.5 -6 L1.5 -6" />
      <path d="M-4 -3.5 Q0 -6 4 -3.5 Q0 -1 -4 -3.5" />
      <path d="M-1.5 -2 L-3 8 M1.5 -2 L3 8" />
      <path d="M-3 8 L3 8" />
    </>
  ),
  panama: (
    // palm island
    <>
      <path d="M-10 8 Q0 4 10 8" />
      <path d="M0 6 Q1 1 0 -3" />
      <path d="M0 -3 Q-5 -6 -8 -3" />
      <path d="M0 -3 Q5 -6 8 -3" />
      <path d="M0 -3 Q-1 -9 -5 -9" />
    </>
  ),
  "beast games": (
    // trophy
    <>
      <path d="M-5 -8 L5 -8 L4.4 -1 Q4 3 0 3 Q-4 3 -4.4 -1 Z" />
      <path d="M-5 -7 Q-9 -6 -4.6 -2 M5 -7 Q9 -6 4.6 -2" />
      <path d="M0 3 L0 6 M-4 8 L4 8 M-4 8 Q0 6 4 8" />
    </>
  ),
  "the island": (
    // island with palm
    <>
      <path d="M-10 8 Q0 4 10 8" />
      <path d="M0 6 Q1 1 0 -3" />
      <path d="M0 -3 Q-5 -6 -8 -3" />
      <path d="M0 -3 Q5 -6 8 -3" />
      <path d="M0 -3 Q1 -9 5 -9" />
    </>
  ),
  "stars forever": (
    // the brand's four point star
    <path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" />
  ),
};

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
            const len = path.getTotalLength();
            const star = el.querySelector<SVGGElement>("[data-route-star]");
            if (star) {
              const pt = path.getPointAtLength(len * lp);
              star.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
              star.style.opacity = lp > 0.01 ? "1" : "0";
            }
            el.querySelectorAll<SVGGElement>("[data-route-node]").forEach((node) => {
              if (!node.dataset.placed) {
                const pt = path.getPointAtLength(len * Number(node.dataset.frac ?? 0));
                node.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
                node.dataset.placed = "1";
              }
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
              {item.stops.join(" → ")}
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
                        aria-label={`Route: ${item.stops.join(" to ")}`}
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
                        {/* waypoints ignite as the line reaches them, spaced
                            evenly along the path and placed by the loop */}
                        {item.stops.map((stop, si) => {
                          const n = item.stops.length;
                          const frac = n === 1 ? 0 : si / (n - 1);
                          const first = si === 0;
                          const last = si === n - 1;
                          const labelY = first ? 30 : last ? -28 : si % 2 === 1 ? 34 : -24;
                          const icon = ROUTE_ICONS[stop.toLowerCase()];
                          const iconY = labelY > 0 ? labelY + 22 : labelY - 26;
                          return (
                            <g
                              key={stop}
                              data-route-node
                              data-frac={frac}
                              data-at={first ? 0.02 : Math.min(0.97, frac * 0.97)}
                              className="transition-opacity duration-500"
                              opacity="0"
                            >
                              <circle
                                r={first || last ? 3.5 : 2.8}
                                fill={last ? "#ffffff" : "#efecf7"}
                                style={{ filter: `drop-shadow(0 0 ${last ? 10 : 8}px rgba(180,140,255,${last ? 1 : 0.9}))` }}
                              />
                              <text
                                y={labelY}
                                textAnchor={first ? "start" : last ? "end" : "middle"}
                                fill={last ? "#efecf7" : "#b7aecb"}
                                fontSize="13"
                                letterSpacing="0.22em"
                                style={{ fontFamily: "var(--font-fragment)" }}
                              >
                                {stop.toUpperCase()}
                              </text>
                              {icon ? (
                                <g
                                  transform={`translate(0 ${iconY})`}
                                  stroke="rgba(199,191,222,0.85)"
                                  strokeWidth="1.1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                  color="rgba(199,191,222,0.85)"
                                  style={{ filter: "drop-shadow(0 0 4px rgba(180,140,255,0.5))" }}
                                >
                                  {icon}
                                </g>
                              ) : null}
                            </g>
                          );
                        })}
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
