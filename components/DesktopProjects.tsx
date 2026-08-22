"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";

export type DesktopPhoto = { src: string; alt: string };
export type DesktopProject = {
  name: string;
  year: string;
  meta: string;
  href: string;
  video: string;
  poster: string | null;
};

// Scattered wide like the reference site's photo cloud: positions in
// viewport units around the centered headline, each with a tilt and a
// push speed for the drift out.
const SCATTER = [
  { ox: -38, oy: -26, rot: -6, speed: 1.1, w: 13 },
  { ox: -32, oy: 22, rot: 5, speed: 0.9, w: 11 },
  { ox: -12, oy: -34, rot: 3, speed: 1.3, w: 10 },
  { ox: 14, oy: 30, rot: -4, speed: 1.2, w: 12 },
  { ox: 33, oy: -28, rot: 7, speed: 1.0, w: 12 },
  { ox: 40, oy: 10, rot: -8, speed: 1.35, w: 11 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

// Desktop only: the omeduo pattern in Stars Forever language. A meteor
// filled sky orbits the headline while photos scatter out, then the
// past projects slide by sideways under the scroll.
export default function DesktopProjects({
  photos,
  projects,
  kicker,
  heading,
  intro,
}: {
  photos: DesktopPhoto[];
  projects: DesktopProject[];
  kicker: string;
  heading: string;
  intro: string;
}) {
  const skyWrapRef = useRef<HTMLDivElement>(null);
  const skyStickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stripWrapRef = useRef<HTMLDivElement>(null);
  const stripStickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [stripH, setStripH] = useState<number | null>(null);
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

  // the sky: twinkling stars, a slow orbit ring, and passing meteors
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const sticky = skyStickyRef.current;
    if (!canvas || !sticky) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = sticky.clientWidth;
      h = sticky.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });

    const stars = Array.from({ length: 90 }, (_, i) => ({
      x: ((i * 137.5) % 100) / 100,
      y: ((i * 73.3) % 100) / 100,
      r: 0.6 + ((i * 29) % 10) / 8,
      ph: (i * 0.7) % (Math.PI * 2),
    }));
    let meteors: Meteor[] = [];
    let last = 0;
    let sinceMeteor = 0;
    let raf = 0;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(50, t - last) : 16;
      last = t;
      ctx.clearRect(0, 0, w, h);

      // twinkling stars
      for (const s of stars) {
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t / 900 + s.ph));
        ctx.fillStyle = `rgba(237, 233, 254, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // the orbit ring, slowly turning behind the headline
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-0.28);
      ctx.strokeStyle = "rgba(109, 40, 217, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([7, 9]);
      ctx.lineDashOffset = -t / 40;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(w * 0.34, 560), Math.min(h * 0.22, 240), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // meteors streaking through
      sinceMeteor += dt;
      if (sinceMeteor > 1400 && meteors.length < 3) {
        sinceMeteor = 0;
        const fromLeft = Math.random() > 0.5;
        meteors.push({
          x: fromLeft ? -80 : w * (0.3 + Math.random() * 0.6),
          y: fromLeft ? h * Math.random() * 0.5 : -60,
          vx: 0.55 + Math.random() * 0.35,
          vy: 0.3 + Math.random() * 0.25,
          life: 0,
        });
      }
      meteors = meteors.filter((m) => m.life < 2600 && m.x < w + 150 && m.y < h + 150);
      for (const m of meteors) {
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const tailX = m.x - m.vx * 260;
        const tailY = m.y - m.vy * 260;
        const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        g.addColorStop(0, "rgba(237, 233, 254, 0.95)");
        g.addColorStop(0.35, "rgba(139, 92, 246, 0.5)");
        g.addColorStop(1, "rgba(109, 40, 217, 0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [reduced]);

  // scroll: photos drift out, headline holds then hands off to the strip
  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const measure = () => {
      const track = trackRef.current;
      const sticky = stripStickyRef.current;
      if (!track || !sticky) return;
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      setStripH(sticky.clientHeight + overflow);
    };

    const tick = () => {
      raf = 0;
      const skyWrap = skyWrapRef.current;
      const skySticky = skyStickyRef.current;
      if (skyWrap && skySticky) {
        const rect = skyWrap.getBoundingClientRect();
        const vh = skySticky.clientHeight;
        const vw = skySticky.clientWidth;
        const total = rect.height - vh;
        const p = total > 0 ? clamp01(-rect.top / total) : 0;

        const push = smooth(clamp01(p / 0.7));
        for (let i = 0; i < SCATTER.length; i++) {
          const el = photoRefs.current[i];
          if (!el) continue;
          const c = SCATTER[i];
          const dx = (c.ox / 100) * vw * push * 2.6 * c.speed;
          const dy = (c.oy / 100) * vh * push * 2.6 * c.speed;
          const rot = c.rot + push * c.rot * 2;
          el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        }

        const head = headRef.current;
        if (head) {
          const out = smooth(clamp01((p - 0.72) / 0.26));
          head.style.opacity = (1 - out).toFixed(3);
          head.style.transform = `translate3d(0, ${(-out * 0.12 * vh).toFixed(1)}px, 0)`;
        }
        const canvas = canvasRef.current;
        if (canvas) {
          const out = smooth(clamp01((p - 0.72) / 0.26));
          canvas.style.opacity = (1 - out * 0.85).toFixed(3);
        }
      }

      const stripWrap = stripWrapRef.current;
      const track = trackRef.current;
      const stripSticky = stripStickyRef.current;
      if (stripWrap && track && stripSticky) {
        const rect = stripWrap.getBoundingClientRect();
        const vh = stripSticky.clientHeight;
        const total = rect.height - vh;
        const t = total > 0 ? clamp01(-rect.top / total) : 0;
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
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, projects.length]);

  // Reduced motion: heading plus a calm grid of the projects.
  if (reduced) {
    return (
      <>
        <section className="mx-auto max-w-7xl px-5 pt-24 text-center sm:px-8 sm:pt-32">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-5xl font-bold">{heading}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80">
            {intro}
          </p>
        </section>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.href} href={p.href} className="group block">
              {p.poster ? (
                <Image
                  src={p.poster}
                  alt={p.name}
                  width={1500}
                  height={1000}
                  sizes="33vw"
                  className="aspect-[16/10] w-full rounded-lg border border-dust/20 object-cover"
                />
              ) : null}
              <p className="meta-label mt-5">Previous project · {p.year}</p>
              <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember">
                {p.name}
              </h3>
            </Link>
          ))}
        </section>
      </>
    );
  }

  return (
    <>
      {/* the sky: headline, orbit ring, meteors, scattering photos */}
      <div ref={skyWrapRef} className="relative" style={{ height: "160vh" }}>
        <div ref={skyStickyRef} className="sticky top-0 h-svh overflow-hidden">
          <Grain />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full"
          />

          {photos.slice(0, SCATTER.length).map((photo, i) => {
            const c = SCATTER[i];
            return (
              <div
                key={photo.src}
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                className="absolute z-10 will-change-transform"
                style={{
                  left: `calc(50% + ${c.ox}vw)`,
                  top: `calc(50% + ${c.oy}svh)`,
                  width: `${c.w}vw`,
                  transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
                }}
              >
                <Image
                  src={photo.src}
                  alt=""
                  aria-hidden="true"
                  width={600}
                  height={400}
                  sizes="14vw"
                  className="aspect-[3/2] w-full rounded-lg border border-dust/25 object-cover shadow-[0_10px_40px_rgb(0_0_0/0.55)]"
                />
              </div>
            );
          })}

          <div
            ref={headRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center will-change-transform"
          >
            <Kicker>{kicker}</Kicker>
            <h2 className="mt-8 max-w-4xl font-display text-6xl font-bold uppercase leading-[1.05] tracking-tight [text-shadow:0_2px_40px_rgb(4_4_8/0.8)] lg:text-7xl">
              {heading}
            </h2>
            <p className="mt-8 max-w-xl text-lg text-starlight/85 [text-shadow:0_1px_16px_rgb(4_4_8/0.9)]">
              {intro}
            </p>
          </div>
        </div>
      </div>

      {/* the past projects, sliding by sideways */}
      <div
        ref={stripWrapRef}
        className="relative"
        style={{ height: stripH ? `${stripH}px` : "220vh" }}
      >
        <div
          ref={stripStickyRef}
          className="sticky top-0 flex h-svh items-center overflow-hidden"
        >
          <Grain />
          <p className="meta-label absolute left-10 top-24 z-30 text-dust">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>

          <div
            ref={trackRef}
            className="flex items-center gap-[4vw] pl-[10vw] pr-[10vw] will-change-transform"
          >
            {projects.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className="group relative block w-[52vw] max-w-[900px] flex-none"
              >
                <div className="relative overflow-hidden rounded-xl border border-dust/25">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={p.poster ?? undefined}
                    aria-label={p.name}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  >
                    <source src={p.video} type="video/mp4" />
                  </video>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
                  />
                  <div className="absolute bottom-0 left-0 p-9 text-left">
                    <p className="meta-label text-starlight/70">
                      Previous project · {p.year}
                    </p>
                    <h3 className="mt-2 font-display text-5xl font-bold transition-colors group-hover:text-ember">
                      {p.name}
                    </h3>
                    <p className="meta-label mt-3 text-dust">{p.meta}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-9 right-9 flex h-12 w-12 items-center justify-center rounded-full border border-starlight/40 text-lg text-starlight backdrop-blur-sm transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-night"
                  >
                    →
                  </span>
                </div>
                {i === 0 ? (
                  <p
                    aria-hidden="true"
                    className={`meta-label absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-dust transition-opacity duration-500 ${
                      active === 0 ? "opacity-70" : "opacity-0"
                    }`}
                  >
                    Keep scrolling through the past →
                  </p>
                ) : null}
              </Link>
            ))}

            {/* the far end of the past */}
            <div className="w-[26vw] max-w-[420px] flex-none">
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
    </>
  );
}
