"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FOOTER_NAV, NAV } from "@/content/site";

// Explore as an orbit ring: the ten pages stand in a circle around
// the viewer. Swiping spins the ring with momentum and it snaps so
// one page always faces you, filled with light and showing its one
// line summary. Tapping a side page swings it to the front; tapping
// the front page lands (the warp takes it from there). Left alone,
// the ring drifts slowly so the footer is always alive.
//
// Pure CSS 3D driven by pointer events. No three.js, no scroll jack.
const LINKS = [...NAV, ...FOOTER_NAV];

const SUMMARIES: Record<string, string> = {
  "/vision": "Why we exist and where all of this is going.",
  "/partner-projects": "Every mission we have filmed with partner creators.",
  "/category-3": "Find out how God wired you to create.",
  "/revolutionary": "Our cohort that trains creators for mission.",
  "/get-involved": "Ways to give, partner, or build with us.",
  "/story": "How Stars Forever began.",
  "/constellation": "A global map of creators serious about Jesus.",
  "/speaking": "Book us to speak at your event or church.",
  "/podcast": "Our conversations about faith and creating.",
  "/strategy": "The framework we use to reach millions.",
};

const STEP = 360 / LINKS.length;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// shortest signed distance from angle a to angle b, in degrees
const shortest = (a: number, b: number) => {
  let d = (b - a) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
};

export default function ExploreOrbit() {
  const active = usePathname();
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  const angle = useRef(0);
  const vel = useRef(0);
  const dragging = useRef(false);
  const dragMoved = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const lastTouch = useRef(0); // timestamp of last interaction
  const radius = useRef(700);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const scene = sceneRef.current;
    const ring = ringRef.current;
    if (!scene || !ring) return;
    let raf = 0;
    let inView = false;

    const measure = () => {
      const cw = scene.clientWidth;
      radius.current = Math.max(520, Math.min(940, cw * 0.62));
      scene.style.perspective = `${Math.round(radius.current * 2.1)}px`;
      for (let i = 0; i < LINKS.length; i++) {
        const el = itemRefs.current[i];
        if (el) {
          el.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radius.current}px)`;
        }
      }
    };

    const frame = () => {
      const a = angle.current;
      if (!dragging.current) {
        const idleFor = performance.now() - lastTouch.current;
        if (Math.abs(vel.current) > 0.02) {
          angle.current += vel.current;
          vel.current *= 0.94;
        } else {
          // settle onto the nearest gate; once idle, breathe gently
          // around it instead of wandering off center
          const snap = Math.round(a / STEP) * STEP;
          const sway =
            idleFor > 4500 ? Math.sin(performance.now() / 1600) * 2.6 : 0;
          angle.current += shortest(0, snap + sway - a) * 0.09;
        }
      }
      ring.style.transform = `translate(-50%, -50%) translateZ(${-radius.current}px) rotateY(${angle.current.toFixed(3)}deg)`;

      // light the page facing the viewer, dim the ones curving away
      for (let i = 0; i < LINKS.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const diff = Math.abs(shortest(0, i * STEP + angle.current));
        const facing = Math.cos((Math.min(diff, 120) * Math.PI) / 180);
        el.style.opacity = (0.12 + 0.88 * clamp01(facing)).toFixed(3);
        if (diff < STEP / 2) el.dataset.focus = "1";
        else delete el.dataset.focus;
      }
      if (inView) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !inView) {
          inView = true;
          raf = requestAnimationFrame(frame);
        } else if (!on) {
          inView = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.15 },
    );

    const down = (e: PointerEvent) => {
      dragging.current = true;
      dragMoved.current = 0;
      lastX.current = e.clientX;
      lastT.current = performance.now();
      lastTouch.current = performance.now();
      vel.current = 0;
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const now = performance.now();
      const da = dx * 0.22;
      angle.current += da;
      dragMoved.current += Math.abs(dx);
      const dt = Math.max(now - lastT.current, 1);
      vel.current = (da / dt) * 16.7; // per-frame velocity
      lastX.current = e.clientX;
      lastT.current = now;
      lastTouch.current = now;
    };
    const up = () => {
      dragging.current = false;
      lastTouch.current = performance.now();
    };

    measure();
    io.observe(scene);
    scene.addEventListener("pointerdown", down);
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerup", up);
    scene.addEventListener("pointercancel", up);
    scene.addEventListener("pointerleave", up);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      scene.removeEventListener("pointerdown", down);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerup", up);
      scene.removeEventListener("pointercancel", up);
      scene.removeEventListener("pointerleave", up);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  // front tap lands; side tap swings that page to the front instead
  const handleClick = (i: number) => (e: React.MouseEvent) => {
    if (dragMoved.current > 10) {
      e.preventDefault();
      return;
    }
    const diff = Math.abs(shortest(0, i * STEP + angle.current));
    if (diff > STEP / 2) {
      e.preventDefault();
      lastTouch.current = performance.now();
      vel.current = 0;
      const target = angle.current + shortest(0, -i * STEP - angle.current);
      const start = angle.current;
      const t0 = performance.now();
      const glide = (now: number) => {
        const t = clamp01((now - t0) / 650);
        const ease = 1 - Math.pow(1 - t, 3);
        angle.current = start + (target - start) * ease;
        lastTouch.current = performance.now();
        if (t < 1) requestAnimationFrame(glide);
      };
      requestAnimationFrame(glide);
    }
  };

  // Reduced motion: a calm stacked list with summaries, no orbit
  if (reduced) {
    return (
      <nav aria-label="Explore">
        <h2 className="meta-label">Explore</h2>
        <ul className="mt-6 space-y-6">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                className={`font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl ${
                  active === item.href
                    ? "text-ember"
                    : "text-starlight/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
              <p className="mt-1 text-sm text-starlight/70">
                {SUMMARIES[item.href]}
              </p>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Explore">
      <h2 className="meta-label">Explore</h2>
      <div
        ref={sceneRef}
        className="relative mt-2 h-[19rem] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing sm:h-[26rem]"
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
        >
          {LINKS.map((item, i) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={item.href}
                onClick={handleClick(i)}
                aria-current={isActive ? "page" : undefined}
                className="group absolute left-1/2 top-1/2 py-2 text-center [backface-visibility:hidden]"
                draggable={false}
              >
                <span
                  className={`block whitespace-nowrap font-display text-[clamp(24px,6.6vw,40px)] font-extrabold uppercase leading-none tracking-tight transition-colors duration-200 sm:text-[clamp(34px,3.6vw,52px)] ${
                    isActive
                      ? "text-ember [text-shadow:0_0_16px_rgb(167_139_250/0.45)]"
                      : "text-transparent [-webkit-text-stroke:1px_rgb(237_233_254/0.55)] group-data-[focus]:text-white group-data-[focus]:[text-shadow:0_0_14px_rgb(255_255_255/0.35),0_0_44px_rgb(167_139_250/0.4)]"
                  }`}
                >
                  {item.label}
                </span>
                <span className="mx-auto mt-3 block w-[70vw] max-w-xs whitespace-normal text-sm leading-relaxed text-starlight/75 opacity-0 transition-opacity duration-300 group-data-[focus]:opacity-100 sm:w-auto sm:max-w-sm sm:text-base">
                  {SUMMARIES[item.href]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex justify-center" aria-hidden="true">
        <svg
          viewBox="0 0 120 14"
          fill="none"
          className="orbit-arrow h-3.5 w-28"
        >
          <path
            d="M12 7h96M12 7l9-5M12 7l9 5M108 7l-9-5M108 7l-9 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="sr-only">Swipe left or right to browse pages</p>
    </nav>
  );
}
