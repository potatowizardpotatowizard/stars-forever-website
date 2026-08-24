"use client";

import { useEffect, useRef } from "react";

// Mobile only: as the Category 3 card scrolls toward center screen, a
// bright star travels its border drawing an ember outline, while the
// card charges: swelling slightly, blooming a purple glow, and
// re-flickering its CATEGORY 3 label as it locks in. Scrubbing back
// reverses the whole thing.
export default function Category3Ignite({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const tick = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const svg = svgRef.current;
      const path = pathRef.current;
      const star = starRef.current;
      const glow = glowRef.current;
      if (!wrap || !svg || !path || !star || !glow) return;
      const active =
        window.matchMedia("(max-width: 767px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!active) {
        wrap.style.transform = "none";
        svg.style.opacity = "0";
        star.style.opacity = "0";
        glow.style.opacity = "0";
        return;
      }
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      const p = clamp01(1 - Math.abs(center - vh * 0.52) / (vh * 0.6));
      const s = smooth(p);

      // draw on the card's layout box (transform does not affect it)
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      const vb = `0 0 ${W} ${H}`;
      if (svg.getAttribute("viewBox") !== vb) {
        svg.setAttribute("viewBox", vb);
        path.setAttribute("d", `M1 1 H ${W - 1} V ${H - 1} H 1 Z`);
      }
      const L = path.getTotalLength();
      path.style.strokeDasharray = `${L}`;
      path.style.strokeDashoffset = `${L * (1 - s)}`;
      svg.style.opacity = (0.3 + 0.7 * s).toFixed(3);

      const pt = path.getPointAtLength(Math.min(L * s, L - 0.01));
      star.style.left = `${((pt.x / W) * 100).toFixed(2)}%`;
      star.style.top = `${((pt.y / H) * 100).toFixed(2)}%`;
      star.style.opacity = p > 0.02 && s < 0.985 ? "1" : "0";

      wrap.style.transform = `scale(${(1 + 0.04 * s).toFixed(4)})`;
      glow.style.opacity = s.toFixed(3);

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
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0 }}
      >
        <path ref={pathRef} fill="none" stroke="var(--color-ember)" strokeWidth="2" />
      </svg>
      <div
        ref={starRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          opacity: 0,
          boxShadow:
            "0 0 10px 3px rgb(167 139 250 / 0.95), 0 0 24px 9px rgb(109 40 217 / 0.6)",
        }}
      />
    </div>
  );
}
