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

    // Release the rest of the hero as the statement starts its flight home
    const t = setTimeout(() => {
      root.removeAttribute("data-mission-intro");
    }, 2300);
    return () => {
      clearTimeout(t);
      root.removeAttribute("data-mission-intro");
    };
  }, []);

  return (
    <p
      ref={ref}
      className="max-w-md font-meta text-sm uppercase leading-relaxed tracking-[0.14em] text-starlight/75"
    >
      {text}
    </p>
  );
}
