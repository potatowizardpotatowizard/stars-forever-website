"use client";

import { useEffect, useState } from "react";
import { SUMMON_VERSE } from "@/content/site";

const SUMMON = "jesus";

// Type the name anywhere on the site (outside a form field) and the
// anchor verse rises out of the dark, one phrase at a time, then
// dissolves back into stars. Desktop keyboards only, by nature.
export default function VerseSummon() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (
        t?.closest("input, textarea, select, [contenteditable='true']") ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SUMMON.length);
      if (buffer === SUMMON) {
        buffer = "";
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    // Stay up long enough to finish appearing, then breathe.
    const t = setTimeout(
      close,
      SUMMON_VERSE.text.split(" ").length * 170 + 7000,
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const words = SUMMON_VERSE.text.split(" ");
  return (
    <div
      aria-live="polite"
      onClick={() => setOpen(false)}
      className="verse-summon fixed inset-0 z-[140] flex cursor-pointer items-center justify-center bg-night/95 px-6 backdrop-blur-sm"
    >
      <div className="max-w-3xl text-center">
        <p className="font-mono-brand font-meta text-lg leading-relaxed text-starlight sm:text-2xl">
          {words.map((w, i) => (
            <span
              key={i}
              className="verse-word inline-block"
              style={{ animationDelay: `${i * 170}ms` }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <p
          className="verse-word meta-label mt-8 text-ember"
          style={{ animationDelay: `${words.length * 170 + 400}ms` }}
        >
          {SUMMON_VERSE.reference}
        </p>
      </div>
    </div>
  );
}
