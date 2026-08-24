"use client";

import { useEffect, useRef } from "react";

// Mobile only: as the Category 3 card scrolls toward center screen it
// charges, swelling slightly and blooming a purple glow while its
// title fills in ember from left to right like it is being written,
// and the spotlight shifts: Categories 1 and 2 dim and desaturate as
// Category 3 takes the light. Scrubbing back reverses everything.
export default function Category3Ignite({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const siblings = () => {
      const li = wrapRef.current?.closest("li");
      const ol = li?.parentElement;
      if (!li || !ol) return [] as HTMLElement[];
      return [...ol.children].filter((c) => c !== li) as HTMLElement[];
    };
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const glow = glowRef.current;
      if (!wrap || !glow) return;
      const title = wrap.querySelector<HTMLElement>("h2");
      const active =
        window.matchMedia("(max-width: 767px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!active) {
        wrap.style.transform = "none";
        glow.style.opacity = "0";
        for (const sib of siblings()) {
          sib.style.opacity = "";
          sib.style.filter = "";
        }
        if (title) {
          title.style.color = "";
          title.style.backgroundImage = "";
        }
        return;
      }
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      const p = clamp01(1 - Math.abs(center - vh * 0.52) / (vh * 0.6));
      const s = smooth(p);

      // the charge
      wrap.style.transform = `scale(${(1 + 0.04 * s).toFixed(4)})`;
      glow.style.opacity = s.toFixed(3);

      // the spotlight steal
      for (const sib of siblings()) {
        sib.style.opacity = (1 - 0.45 * s).toFixed(3);
        sib.style.filter = `saturate(${(1 - 0.5 * s).toFixed(3)})`;
      }

      // the title writes itself in ember
      if (title) {
        const f = (clamp01(p * 1.15) * 100).toFixed(1);
        title.style.color = "transparent";
        title.style.webkitBackgroundClip = "text";
        title.style.backgroundClip = "text";
        title.style.backgroundImage = `linear-gradient(90deg, var(--color-ember) ${f}%, color-mix(in srgb, var(--color-starlight) 35%, transparent) ${f}%)`;
      }

      // the label re-locks with a flicker at full charge
      const label = wrap.querySelector<HTMLElement>(".meta-label");
      if (label) {
        if (s > 0.95 && !lockedRef.current) {
          lockedRef.current = true;
          label.style.animation = "none";
          void label.offsetWidth;
          label.style.animation = "cat3-lock 0.45s steps(2, jump-none) 3";
        } else if (s < 0.5) {
          lockedRef.current = false;
        }
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
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full will-change-transform">
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1"
        style={{
          opacity: 0,
          boxShadow:
            "0 0 42px rgb(109 40 217 / 0.5), 0 0 14px rgb(109 40 217 / 0.65)",
        }}
      />
      {children}
    </div>
  );
}
