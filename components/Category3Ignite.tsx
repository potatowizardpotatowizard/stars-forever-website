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
      const card = wrap.querySelector<HTMLElement>(
        ':scope > div:not([aria-hidden="true"])',
      );
      if (!active) {
        wrap.style.transform = "none";
        glow.style.opacity = "0";
        if (card) {
          card.style.boxShadow = "";
          card.style.borderColor = "";
        }
        for (const sib of siblings()) {
          sib.style.opacity = "";
          sib.style.filter = "";
        }
        {
          const label = wrap.querySelector<HTMLElement>(".meta-label");
          if (label) {
            label.style.color = "";
            label.style.textShadow = "";
          }
          const example = wrap.querySelector<HTMLElement>("a");
          if (example) example.style.color = "";
        }
        if (title) {
          title.style.color = "";
          title.style.backgroundImage = "";
          title.style.backgroundSize = "";
          title.style.animation = "";
          title.style.filter = "";
          delete title.dataset.burn;
        }
        return;
      }
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      // once the card has passed the focus line it stays lit; the
      // charge only reverses when scrolling back up above it
      const d = center - vh * 0.52;
      const p = d <= 0 ? 1 : clamp01(1 - d / (vh * 0.6));
      const s = smooth(p);

      // the charge: fiery bloom around the box, purple glow on the line
      wrap.style.transform = `scale(${(1 + 0.04 * s).toFixed(4)})`;
      glow.style.opacity = s.toFixed(3);
      if (card) {
        card.style.boxShadow = `0 0 ${Math.round(14 * s)}px rgb(255 145 55 / ${(0.85 * s).toFixed(3)}), inset 0 0 ${Math.round(10 * s)}px rgb(255 145 55 / ${(0.35 * s).toFixed(3)})`;
        card.style.borderColor = `color-mix(in srgb, rgb(255 165 70) ${Math.round(80 * s)}%, rgb(255 140 60 / 0.65))`;
      }

      // the spotlight steal
      for (const sib of siblings()) {
        sib.style.opacity = (1 - 0.45 * s).toFixed(3);
        sib.style.filter = `saturate(${(1 - 0.5 * s).toFixed(3)})`;
      }

      // the title starts white, then writes itself in burning,
      // shimmering orange fire
      if (title) {
        const f = (clamp01(p * 1.15) * 100).toFixed(1);
        title.style.color = "transparent";
        title.style.webkitBackgroundClip = "text";
        title.style.backgroundClip = "text";
        title.style.backgroundImage = `linear-gradient(90deg, transparent ${f}%, var(--color-starlight) ${f}%), linear-gradient(100deg, #ffb25e, #ffe8bc, #ff8a3c, #ffd089, #ff9b4a)`;
        title.style.filter = `drop-shadow(0 0 ${(5 + 5 * s).toFixed(1)}px rgb(255 140 60 / 0.8)) drop-shadow(0 0 ${(14 * s).toFixed(1)}px rgb(255 120 40 / 0.45))`;
        if (!title.dataset.burn) {
          title.dataset.burn = "1";
          title.style.backgroundSize = "100% 100%, 220% 100%";
          title.style.animation = "cat3-burn 2.4s linear infinite";
        }
      }

      // the example link wears orange the whole time on mobile
      const example = wrap.querySelector<HTMLElement>("a");
      if (example) example.style.color = "rgb(255 160 75)";

      // the label glows orange with the charge, steady, no blinking
      const label = wrap.querySelector<HTMLElement>(".meta-label");
      if (label) {
        label.style.color = `color-mix(in srgb, rgb(255 160 70) ${Math.round(90 * s)}%, var(--color-ember))`;
        label.style.textShadow = `0 0 ${(10 * s).toFixed(1)}px rgb(255 140 50 / 0.85)`;
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
            "0 0 46px rgb(255 140 60 / 0.45), 0 0 16px rgb(255 160 80 / 0.55)",
        }}
      />
      {children}
    </div>
  );
}
