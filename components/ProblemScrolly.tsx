"use client";

import { useEffect, useRef, useState } from "react";
import GlitchText from "@/components/GlitchText";
import Kicker from "@/components/Kicker";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Desktop scrollytelling for the problem: the section pins and the
// three beats of the argument swap in place as the visitor scrolls,
// a star marking each one. Transform and opacity only.
export default function ProblemScrolly({
  kicker,
  heading,
  paragraphs,
}: {
  kicker: string;
  heading: string;
  paragraphs: string[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const n = paragraphs.length;

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
      const total = rect.height - vh;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      const f = p * (n - 1);

      for (let i = 0; i < n; i++) {
        const el = paraRefs.current[i];
        if (!el) continue;
        const delta = f - i;
        const away = Math.min(1, Math.abs(delta));
        el.style.opacity = (1 - smooth(away)).toFixed(3);
        el.style.transform = `translate3d(0, ${(-delta * 48).toFixed(1)}px, 0)`;
        el.style.pointerEvents = away < 0.5 ? "auto" : "none";
      }

      const current = Math.min(n - 1, Math.round(f));
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
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
  }, [reduced, n]);

  // Reduced motion: the plain stacked section.
  if (reduced) {
    return (
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="max-w-3xl">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-6 font-display text-5xl font-bold">{heading}</h2>
          <div className="mt-8 space-y-6">
            {paragraphs.map((para) => (
              <p key={para} className="text-lg leading-relaxed text-starlight/85">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: `${100 + (n - 1) * 65}vh` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-8">
          <div>
            <Kicker>{kicker}</Kicker>
            <h2 className="mt-6 font-display text-5xl font-bold">
              <GlitchText text={heading} />
            </h2>
          </div>

          {/* the three beats, swapping in place */}
          <div className="relative mt-14 min-h-[16rem] max-w-3xl">
            {paragraphs.map((para, i) => (
              <p
                ref={(el) => {
                  paraRefs.current[i] = el;
                }}
                key={para}
                className="absolute inset-x-0 top-0 text-2xl leading-relaxed text-starlight/90 will-change-transform lg:text-3xl lg:leading-relaxed"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* one star per beat */}
          <div className="mt-10 flex items-center gap-4">
            {paragraphs.map((para, i) => (
              <span
                key={para}
                aria-hidden="true"
                className={`h-2.5 w-2.5 rotate-45 border transition-all duration-300 ${
                  i === active
                    ? "scale-125 border-ember bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                    : "border-dust/50 bg-transparent"
                }`}
              />
            ))}
            <span className="meta-label ml-2 text-dust">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
