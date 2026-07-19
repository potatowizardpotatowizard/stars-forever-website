"use client";

import { useRef } from "react";
import Image from "next/image";

// The hero wordmark star. One click makes it flare; seven clicks within
// six seconds collapse the whole StarField into a supernova (handled by
// StarField via the "sf-supernova" event). Kept deliberately unlabeled:
// it is an easter egg, not a control.
export default function HeroStarLogo() {
  const ref = useRef<HTMLButtonElement>(null);
  const clicks = useRef<number[]>([]);

  const onClick = () => {
    const el = ref.current;
    if (el) {
      el.classList.remove("logo-flare");
      // restart the flare animation
      void el.offsetWidth;
      el.classList.add("logo-flare");
    }
    const now = performance.now();
    clicks.current = clicks.current.filter((t) => now - t < 6000);
    clicks.current.push(now);
    if (clicks.current.length >= 7) {
      clicks.current = [];
      window.dispatchEvent(new Event("sf-supernova"));
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Stars Forever"
      onClick={onClick}
      className="mx-auto mb-8 block cursor-pointer border-0 bg-transparent p-0"
    >
      <Image
        src="/brand/star-smeared.png"
        alt=""
        width={64}
        height={64}
        className="vhs-glow"
      />
    </button>
  );
}
