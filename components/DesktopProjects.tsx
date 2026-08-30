"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Cta from "@/components/Cta";
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

// Five photos scattered wide around the centered headline. The sixth
// member of the cloud is the Real Treasure video itself, which starts
// at RT_START and morphs into the first card of the strip.
const SCATTER = [
  { ox: -38, oy: -26, rot: -6, speed: 1.1, w: 13 },
  { ox: -32, oy: 22, rot: 5, speed: 0.9, w: 11 },
  { ox: -12, oy: -34, rot: 3, speed: 1.3, w: 10 },
  { ox: 30, oy: -26, rot: 7, speed: 1.2, w: 12 },
  { ox: 40, oy: 8, rot: -8, speed: 1.35, w: 11 },
];
const RT_START = { ox: 14, oy: 30, rot: -4, w: 14 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

// Desktop only, after the reference the user shared: a meteor sky
// holds the headline while photos scatter out, one freeze frame of
// the Real Treasure video grows into the first previous project, and
// the past then slides by sideways. One pinned scene, no seams.
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLAnchorElement>(null);
  const firstVideoRef = useRef<HTMLVideoElement>(null);
  const firstLabelRef = useRef<HTMLDivElement>(null);
  const restRefs = useRef<(HTMLElement | null)[]>([]);
  const counterRef = useRef<HTMLParagraphElement>(null);
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

  // the sky: twinkling stars, a slow orbit ring, and passing meteors
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
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

      for (const s of stars) {
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t / 900 + s.ph));
        ctx.fillStyle = `rgba(237, 233, 254, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

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

  // one pinned scene: scatter and morph, then slide the past sideways
  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const measure = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      setWrapH(Math.round(sticky.clientHeight * 1.9 + overflow));
    };

    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      if (!wrap || !sticky || !track) return;
      const rect = wrap.getBoundingClientRect();
      const vh = sticky.clientHeight;
      const vw = sticky.clientWidth;
      const scroll = Math.max(0, -rect.top);
      const phaseApx = 0.9 * vh;
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      const pA = clamp01(scroll / phaseApx);
      const pB = overflow > 0 ? clamp01((scroll - phaseApx) / overflow) : 0;

      // five photos scatter out
      const push = smooth(clamp01(pA / 0.75));
      for (let i = 0; i < SCATTER.length; i++) {
        const el = photoRefs.current[i];
        if (!el) continue;
        const c = SCATTER[i];
        const dx = (c.ox / 100) * vw * push * 2.6 * c.speed;
        const dy = (c.oy / 100) * vh * push * 2.6 * c.speed;
        const rot = c.rot + push * c.rot * 2;
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // heading and sky bow out while the freeze frame takes the stage
      const out = smooth(clamp01((pA - 0.45) / 0.35));
      const head = headRef.current;
      if (head) {
        head.style.opacity = (1 - out).toFixed(3);
        head.style.transform = `translate3d(0, ${(-out * 0.12 * vh).toFixed(1)}px, 0)`;
      }
      const canvas = canvasRef.current;
      if (canvas) canvas.style.opacity = (1 - out * 0.85).toFixed(3);

      // the Real Treasure freeze frame: from its scatter spot into the
      // first card of the strip
      const first = firstCardRef.current;
      const firstLabel = firstLabelRef.current;
      if (first && firstLabel) {
        const cw = Math.min(0.52 * vw, 900);
        const startCx = (0.5 + RT_START.ox / 100) * vw;
        const startCy = (0.5 + RT_START.oy / 100) * vh;
        const naturalCx = 0.1 * vw + cw / 2;
        const naturalCy = vh / 2;
        const s0 = (RT_START.w / 52) * Math.min(1, (0.52 * vw) / cw);
        const m = smooth(clamp01((pA - 0.3) / 0.65));
        const dx = (startCx - naturalCx) * (1 - m);
        const dy = (startCy - naturalCy) * (1 - m);
        const s = s0 + (1 - s0) * m;
        const rot = RT_START.rot * (1 - m);
        first.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
        firstLabel.style.opacity = smooth(clamp01((m - 0.75) / 0.25)).toFixed(3);
        first.style.pointerEvents = m > 0.6 ? "auto" : "none";
        // a freeze frame in the cloud; the film starts once it lands
        const vid = firstVideoRef.current;
        if (vid) {
          if (m > 0.55 && vid.paused) vid.play().catch(() => {});
          else if (m < 0.45 && !vid.paused) vid.pause();
        }
      }

      // the rest of the past waits until the freeze frame has landed
      const restIn = smooth(clamp01((pA - 0.8) / 0.2));
      for (const el of restRefs.current) {
        if (el) el.style.opacity = restIn.toFixed(3);
      }
      const counter = counterRef.current;
      if (counter) counter.style.opacity = (restIn * 0.9).toFixed(3);

      // then the strip slides
      track.style.transform = `translate3d(${(-pB * overflow).toFixed(1)}px,0,0)`;
      const current = Math.min(
        projects.length - 1,
        Math.round(pB * (projects.length - 1)),
      );
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
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

  const [firstProject, ...restProjects] = projects;

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: wrapH ? `${wrapH}px` : "350vh" }}
    >
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <Grain />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full"
        />

        {/* five photos scattered around the headline */}
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

        {/* the headline in the meteor sky */}
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

        <p
          ref={counterRef}
          className="meta-label absolute left-10 top-24 z-40 text-dust"
          style={{ opacity: 0 }}
        >
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </p>

        {/* the strip: Real Treasure leads it, starting life as a small
            freeze frame in the photo cloud */}
        <div className="absolute inset-0 z-30 flex items-center">
          <div
            ref={trackRef}
            className="flex items-center gap-[4vw] pl-[10vw] pr-[10vw] will-change-transform"
          >
            <Link
              ref={firstCardRef}
              href={firstProject.href}
              className="group relative block w-[52vw] max-w-[900px] flex-none will-change-transform"
              style={{ pointerEvents: "none" }}
            >
              <div className="relative overflow-hidden rounded-xl border border-dust/50 shadow-[0_10px_40px_rgb(0_0_0/0.55)]">
                <video
                  ref={firstVideoRef}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={firstProject.poster ?? undefined}
                  aria-label={firstProject.name}
                  className="aspect-[16/10] w-full object-cover"
                >
                  <source src={firstProject.video} type="video/mp4" />
                </video>
                <div ref={firstLabelRef} style={{ opacity: 0 }}>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
                  />
                  <div className="absolute bottom-0 left-0 p-9 text-left">
                    <p className="meta-label text-starlight/70">
                      Previous project · {firstProject.year}
                    </p>
                    <h3 className="mt-2 font-display text-5xl font-bold transition-colors group-hover:text-ember">
                      {firstProject.name}
                    </h3>
                    <p className="meta-label mt-3 text-dust">
                      {firstProject.meta}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-9 right-9 flex h-12 w-12 items-center justify-center rounded-full border border-starlight/40 text-lg text-starlight backdrop-blur-sm transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-night"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>

            {restProjects.map((p) => (
              <Link
                key={p.href}
                ref={(el) => {
                  restRefs.current[restProjects.indexOf(p)] = el;
                }}
                href={p.href}
                className="group relative block w-[52vw] max-w-[900px] flex-none"
                style={{ opacity: 0 }}
              >
                <div className="relative overflow-hidden rounded-xl border border-dust/50">
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
              </Link>
            ))}

            <div
              ref={(el) => {
                restRefs.current[restProjects.length] = el;
              }}
              className="w-[26vw] max-w-[420px] flex-none"
              style={{ opacity: 0 }}
            >
              <p className="font-display text-3xl font-bold leading-snug text-starlight/85">
                The next project is unwritten.
              </p>
              <div className="mt-8">
                <Cta href="/apply">Bring us your God dream</Cta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
