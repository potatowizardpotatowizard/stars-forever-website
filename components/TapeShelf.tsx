"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HERO_MENU, FOOTER_NAV } from "@/content/site";

const SPINE_COLORS = [
  "#6d28d9",
  "#a78bfa",
  "#f59e0b",
  "#38bdf8",
  "#f472b6",
  "#34d399",
  "#fb7185",
  "#fbbf24",
  "#818cf8",
  "#f97316",
];

// The tape shelf: a VHS spine docked at the bottom right of every
// desktop screen. Pull it and the whole site slides out as a shelf of
// labeled tapes. Navigation as a physical object.
export default function TapeShelf() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when the route changes or Escape is pressed.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tapes = [
    { label: "Home", href: "/" },
    ...HERO_MENU,
    ...FOOTER_NAV,
  ];

  return (
    <div className="hidden md:block">
      {/* The docked spine */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the tape shelf"
        className={`fixed bottom-8 right-0 z-[96] flex items-center gap-2 rounded-l-md border border-r-0 border-dust/30 bg-soot/90 py-3 pl-2.5 pr-2 backdrop-blur-sm transition-all duration-300 hover:border-ember/60 hover:pr-3 ${
          open ? "translate-x-full opacity-0" : ""
        }`}
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="meta-label rotate-180 text-starlight/80">
          ◄ REWIND
        </span>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[97] bg-night/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* The shelf */}
      <aside
        aria-label="Tape shelf navigation"
        className={`fixed bottom-0 right-0 top-0 z-[98] w-[22rem] overflow-y-auto border-l border-dust/25 bg-soot/95 px-6 py-10 backdrop-blur-md transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <p className="meta-label text-ember">The shelf</p>
        <p className="mt-2 font-display text-2xl font-bold">
          Pick a tape
        </p>
        <ul className="mt-8 space-y-3">
          {tapes.map((tape, i) => (
            <li key={tape.href}>
              <Link
                href={tape.href}
                className={`group flex items-stretch overflow-hidden rounded-sm border border-dust/25 bg-night/80 transition-all duration-200 hover:-translate-x-1.5 hover:border-ember/50 ${
                  pathname === tape.href ? "border-ember/60" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 shrink-0"
                  style={{ background: SPINE_COLORS[i % SPINE_COLORS.length] }}
                />
                <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
                  <span className="font-meta text-xs font-bold uppercase tracking-[0.14em] text-starlight/85 group-hover:text-starlight">
                    {tape.label}
                  </span>
                  <span className="meta-label text-dust/70">
                    SF-{String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="meta-label mt-10 text-dust/60">
          Be kind, rewind.
        </p>
      </aside>
    </div>
  );
}
