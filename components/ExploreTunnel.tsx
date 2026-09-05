"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FOOTER_NAV, NAV } from "@/content/site";

// Explore as a star tunnel: every page is a gate hanging in deep
// space, receding toward a single bright vanishing star. Scrolling
// the footer flies the camera forward through the gates; the gate
// at the focal plane fills with light and is the one you tap to
// land. Passed gates sweep behind the camera and vanish.
//
// Pure CSS 3D on ten elements, so it costs nothing on any page.
const LINKS = [...NAV, ...FOOTER_NAV];
const SPACING = 430; // z distance between gates, px
const LEAD = 120; // first gate starts this far ahead of the camera

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// gates drift slightly off axis, alternating, so the flight weaves
const OFFSETS: [number, number][] = [
  [-7, -5],
  [7, 4],
  [-6, 5],
  [8, -4],
  [-8, -3],
  [6, 6],
  [-7, 4],
  [7, -6],
  [-6, -4],
  [6, 5],
];

export default function ExploreTunnel() {
  const active = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const starRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
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
      const total = Math.max(rect.height - vh, 1);
      const p = clamp01(-rect.top / total);
      const travel = p * (SPACING * (LINKS.length - 1) + LEAD + 140);

      let focusI = -1;
      let focusD = Infinity;
      for (let i = 0; i < LINKS.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const dz = i * SPACING + LEAD - travel;
        const [ox, oy] = OFFSETS[i % OFFSETS.length];
        // deep gates hang off axis, then drift to center as they
        // reach the camera, like lining up for the landing
        const k = clamp01(dz / 560);
        el.style.transform = `translate3d(calc(-50% + ${(ox * k).toFixed(2)}vw), calc(-50% + ${(oy * k).toFixed(2)}svh), ${-dz}px)`;
        // ahead: fade in from deep space; behind: vanish fast
        const o =
          dz >= 0
            ? clamp01(1.05 - dz / 700)
            : clamp01(1 + dz / 200);
        el.style.opacity = o.toFixed(3);
        el.style.pointerEvents = dz > -120 && dz < 520 && o > 0.4 ? "auto" : "none";
        const d = Math.abs(dz);
        if (d < focusD) {
          focusD = d;
          focusI = i;
        }
      }
      for (let i = 0; i < LINKS.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        if (i === focusI && focusD < 150) el.dataset.focus = "1";
        else delete el.dataset.focus;
      }

      const star = starRef.current;
      if (star) {
        const s = 1 + p * 1.3;
        star.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;
        star.style.opacity = (0.5 + p * 0.32).toFixed(3);
      }
      const hint = hintRef.current;
      if (hint) hint.style.opacity = p < 0.04 ? "1" : "0";
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

  // Reduced motion: a calm stacked list, no tunnel
  if (reduced) {
    return (
      <nav aria-label="Explore" className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="meta-label">Explore</h2>
        <ul className="mt-6 space-y-1">
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
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: "220svh" }}>
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <h2 className="meta-label absolute left-5 top-8 z-30 sm:left-8">
          Explore
        </h2>

        {/* the vanishing star every gate recedes toward */}
        <div
          ref={starRef}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[440px] w-[440px]"
          style={{
            background:
              "radial-gradient(circle, rgb(255 255 255 / 0.85) 0%, rgb(255 255 255 / 0.4) 1.5%, rgb(196 170 255 / 0.2) 7%, rgb(109 40 217 / 0.1) 18%, transparent 45%)",
            opacity: 0.55,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* the gates */}
        <nav aria-label="Explore">
          <div className="absolute inset-0 [perspective:1100px]">
            {LINKS.map((item, i) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`absolute left-1/2 top-1/2 whitespace-nowrap py-2 text-center font-display text-[clamp(21px,6vw,40px)] font-extrabold uppercase leading-none tracking-tight transition-colors duration-200 sm:text-[clamp(38px,4.2vw,60px)] ${
                    isActive
                      ? "text-ember [text-shadow:0_0_16px_rgb(167_139_250/0.45)]"
                      : "text-transparent [-webkit-text-stroke:1px_rgb(237_233_254/0.55)] data-[focus]:text-white data-[focus]:[text-shadow:0_0_14px_rgb(255_255_255/0.35),0_0_44px_rgb(167_139_250/0.4)]"
                  }`}
                  style={{ opacity: 0 }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <p
          ref={hintRef}
          className="meta-label absolute inset-x-0 bottom-8 text-center transition-opacity duration-500"
        >
          scroll to fly · tap a page to land
        </p>
      </div>
    </div>
  );
}
