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

// Outline drawings for route waypoints, keyed by stop name. Real map
// outlines for geographic stops; symbolic line art for the rest.
// Constellation-thin strokes, each within a ~44px box.
const ROUTE_ICONS: Record<string, React.ReactNode> = {
  tokyo: (
    // torii gate
    <>
      <path d="M-20 -14 Q0 -20 20 -14" />
      <path d="M-16 -13 L-16 -8 M16 -13 L16 -8" />
      <path d="M-14 -8 L14 -8" />
      <path d="M-11 -8 L-13 16 M11 -8 L13 16" />
      <path d="M0 -8 L0 -14" />
    </>
  ),
  "rural japan": (
    // mountains
    <>
      <path d="M-20 16 L-6 -12 L2 0 L10 -8 L20 16" />
      <path d="M-11 -2 L-6 -12 L-1 -2" />
    </>
  ),
  "ebisu circuit": (
    // the circuit, drawn like a track map
    <>
      <path d="M-14 4 Q-18 -8 -8 -10 Q0 -14 10 -10 Q18 -7 15 2 Q13 9 4 7 Q0 5 -4 10 Q-11 15 -14 4 Z" />
      <path d="M-3 -11.5 L-3 -7.5" />
    </>
  ),
  california: (
    // the state on the map
    <path d="M-11 -20 L3 -18 L1 -5 L13 9 L12 16 L2 15 Q-5 7 -8 -2 Q-12 -12 -11 -20 Z" />
  ),
  iceland: (
    // the country on the map, fjords and all
    <>
      <path d="M-19 0 L-14 -3 L-17 -7 L-12 -6 L-13 -11 L-8 -7 L-3 -11 L3 -9 L9 -12 L15 -7 L19 -3 L17 3 L11 7 L3 9 L-4 7 L-11 9 L-9 4 L-16 4 Z" />
      <circle cx="-2" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  "the shared house": (
    // house
    <>
      <path d="M-16 16 L-16 -4 L0 -17 L16 -4 L16 16 Z" />
      <path d="M-4 16 L-4 4 L4 4 L4 16" />
    </>
  ),
  "the desert": (
    // saguaro
    <>
      <path d="M0 16 L0 -16" />
      <path d="M0 -2 Q-12 -2 -12 -14" />
      <path d="M0 2 Q12 2 12 -8" />
    </>
  ),
  "joshua tree": (
    // joshua tree
    <>
      <path d="M0 16 L0 -2" />
      <path d="M0 -2 L-11 -12 M-11 -12 L-17 -8 M-11 -12 L-13 -18" />
      <path d="M0 -2 L10 -10 M10 -10 L16 -6 M10 -10 L10 -18" />
    </>
  ),
  "las vegas": (
    // dice
    <>
      <rect x="-15" y="-15" width="30" height="30" rx="5" />
      <circle cx="-7" cy="-7" r="2" fill="currentColor" stroke="none" />
      <circle cx="0" cy="0" r="2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="7" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  toronto: (
    // cn tower
    <>
      <path d="M0 -20 L0 -12 M-3 -12 L3 -12" />
      <path d="M-8 -7 Q0 -12 8 -7 Q0 -2 -8 -7" />
      <path d="M-3 -4 L-6 16 M3 -4 L6 16" />
      <path d="M-6 16 L6 16" />
    </>
  ),
  panama: (
    // the island itself, palm on the sand ringed by water
    <>
      <path d="M-14 8 Q0 2 14 8 Q0 14 -14 8 Z" />
      <path d="M0 5 Q2 -3 0 -8" />
      <path d="M0 -8 Q-9 -13 -15 -8" />
      <path d="M0 -8 Q9 -13 15 -8" />
      <path d="M0 -8 Q2 -19 10 -18" />
      <path d="M-20 14 Q-14 12 -8 14 M8 14 Q14 12 20 14" />
    </>
  ),
  "beast games": (
    // the real mrbeast panther, in starlight
    <image
      href="/brand/route-beast.png"
      x="-27"
      y="-18"
      width="54"
      height="36.5"
    />
  ),
  "the island": (
    // island with palm
    <>
      <path d="M-20 16 Q0 8 20 16" />
      <path d="M0 12 Q2 2 0 -6" />
      <path d="M0 -6 Q-10 -12 -16 -6" />
      <path d="M0 -6 Q10 -12 16 -6" />
      <path d="M0 -6 Q2 -18 10 -18" />
    </>
  ),
  "stars forever": (
    // the real stars forever logo
    <image
      href="/brand/route-star.png"
      x="-22"
      y="-20"
      width="44"
      height="40"
    />
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
        // photos right after words or a route map hold in pure black
        // until the reading is done, so there is space to process
        const afterText = !isBeat && i > 0 && items[i - 1]?.kind !== "photo";
        let op: number;
        if (d < -380) op = 0;
        else if (d < 0) op = 1 + d / 380;
        else if (isBeat) {
          if (d <= 350) op = 1;
          else if (d < 700) op = (700 - d) / 350;
          else op = 0;
        } else if (afterText) {
          if (d <= 260) op = 1;
          else if (d < 480) op = (480 - d) / 220;
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
                          const first = si === 0;
                          const last = si === n - 1;
                          // middle stops huddle toward the center of the
                          // line instead of spreading edge to edge
                          let frac = n === 1 ? 0 : si / (n - 1);
                          if (!first && !last) frac = 0.5 + (frac - 0.5) * 0.75;
                          // drawings alternate above and below the line;
                          // each label takes the opposite side of its
                          // drawing, leaning AWAY from the rising line so
                          // the line never slices through the words
                          const iconAbove = si % 2 === 0;
                          // the line arrives at the final stop from the
                          // lower left, so its below-label sits deeper
                          const labelY = iconAbove ? (last ? 54 : 36) : -30;
                          const iconY = iconAbove ? -46 : 46;
                          const labelX = first || last ? 0 : iconAbove ? 8 : -8;
                          const anchor = first
                            ? "start"
                            : last
                              ? "end"
                              : iconAbove
                                ? "start"
                                : "end";
                          const icon = ROUTE_ICONS[stop.toLowerCase()];
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
                                x={labelX}
                                y={labelY}
                                textAnchor={anchor}
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
