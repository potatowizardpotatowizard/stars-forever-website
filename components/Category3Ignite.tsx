"use client";

import { useEffect, useRef } from "react";

// As the Category 3 card scrolls toward center screen it charges:
// swelling slightly, its border and bloom burning white, while the
// spotlight shifts: Categories 1 and 2 dim and desaturate as
// Category 3 takes the light. The charge stays once passed.
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
      const active = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
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
        const title = wrap.querySelector<HTMLElement>("h2");
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
        card.style.boxShadow = `0 0 ${Math.round(14 * s)}px rgb(255 255 255 / ${(0.7 * s).toFixed(3)}), inset 0 0 ${Math.round(10 * s)}px rgb(255 255 255 / ${(0.3 * s).toFixed(3)})`;
        card.style.borderColor = `color-mix(in srgb, rgb(255 255 255) ${Math.round(80 * s)}%, rgb(240 238 250 / 0.6))`;
      }

      // the spotlight steal: mobile only, desktop keeps 1 and 2 lit
      const steal = window.matchMedia("(max-width: 767px)").matches;
      for (const sib of siblings()) {
        sib.style.opacity = steal ? (1 - 0.45 * s).toFixed(3) : "";
        sib.style.filter = steal
          ? `saturate(${(1 - 0.5 * s).toFixed(3)})`
          : "";
      }

      // the whole title fades into its glowing fiery look as the
      // card charges: a plain starlight veil thins out over the fire
      const title = wrap.querySelector<HTMLElement>("h2");
      if (title) {
        const veil = (1 - s).toFixed(3);
        title.style.color = "transparent";
        title.style.webkitBackgroundClip = "text";
        title.style.backgroundClip = "text";
        title.style.backgroundImage = `linear-gradient(0deg, rgb(239 236 247 / ${veil}), rgb(239 236 247 / ${veil})), linear-gradient(100deg, #f3f0ff, #ffffff, #d9d4f2, #fffdf4, #efeaff)`;
        title.style.filter = `drop-shadow(0 0 ${(10 * s).toFixed(1)}px rgb(255 255 255 / ${(0.85 * s).toFixed(3)})) drop-shadow(0 0 ${(14 * s).toFixed(1)}px rgb(235 230 255 / ${(0.5 * s).toFixed(3)}))`;
        if (!title.dataset.burn) {
          title.dataset.burn = "1";
          title.style.backgroundSize = "100% 100%, 220% 100%";
          title.style.animation = "cat3-burn 2.4s steps(29) infinite";
        }
      }

      // CATEGORY 3 and the example link keep their purple
      const example = wrap.querySelector<HTMLElement>("a");
      if (example) example.style.color = "";
      const label = wrap.querySelector<HTMLElement>(".meta-label");
      if (label) {
        label.style.color = "";
        label.style.textShadow = "";
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
            "0 0 46px rgb(255 255 255 / 0.4), 0 0 16px rgb(245 242 255 / 0.5)",
        }}
      />
      {children}
    </div>
  );
}
