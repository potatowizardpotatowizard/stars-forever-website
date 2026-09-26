"use client";

import { useEffect, useRef } from "react";

// The mission statement opens the site alone: centered on screen and
// glowing while the rest of the hero waits in the dark, then it glides
// home to its corner as everything else fades in. Once per session;
// return visits and reduced motion see the hero as normal.
export default function MissionIntro({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("sf-mission")) return;
    sessionStorage.setItem("sf-mission", "1");

    const root = document.documentElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty(
      "--mx",
      `${window.innerWidth / 2 - (r.left + r.width / 2)}px`,
    );
    el.style.setProperty(
      "--my",
      `${window.innerHeight / 2 - (r.top + r.height / 2)}px`,
    );
    el.classList.add("mission-intro");
    // The flag lives on <html>: React re-renders would strip it from
    // elements it owns inside the page
    root.setAttribute("data-mission-intro", "1");

    // Release the rest of the hero as the statement starts its flight
    // home. Deliberately not cleaned up: the effect can re-run during
    // hydration, and a cleanup would cancel the release and freeze the
    // hero dark. The timer is harmless if the page is left early.
    window.setTimeout(() => {
      root.removeAttribute("data-mission-intro");
    }, 3100);
  }, []);

  // Hand-set line breaks: three lines on phones (that / and leading
  // their lines), two on desktop.
  void text;
  return (
    <p
      ref={ref}
      className="mx-auto max-w-md text-center font-meta text-[13px] uppercase leading-relaxed tracking-[0.1em] text-starlight/75 sm:text-sm md:max-w-xl md:tracking-[0.14em]"
    >
      Stars Forever is a ministry
      <br className="md:hidden" /> that helps creators
      <br className="hidden md:inline" /> use their lives
      <br className="md:hidden" /> and platforms for Jesus.
    </p>
  );
}
