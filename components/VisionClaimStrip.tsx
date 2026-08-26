"use client";

import { useEffect, useState } from "react";
import { NICHES } from "@/content/niches";

// Idea three, pure: the same niches twice, passing each other along
// the hero's base. The world as it is drifts one way, dim and
// starless; the world to come drifts the other, every niche carrying
// its ember star.
function Row({
  lit,
  hidden,
  active,
}: {
  lit?: boolean;
  hidden?: boolean;
  active?: string;
}) {
  return (
    <>
      {NICHES.map((niche) => {
        const isActive = lit && niche.toLowerCase() === (active ?? "");
        return (
        <span
          key={niche}
          aria-hidden={hidden || undefined}
          className={`meta-label flex shrink-0 items-center gap-2.5 rounded-md border px-4 py-2.5 transition-all duration-500 ${
            lit
              ? isActive
                ? "scale-[1.07] border-starlight bg-soot/80 font-bold text-white shadow-[0_0_26px_rgb(167_139_250/0.8)]"
                : "border-ember bg-soot/70 font-bold text-white shadow-[0_0_20px_rgb(109_40_217/0.55)]"
              : "border-dust/30 bg-night/30 text-starlight/60"
          }`}
        >
          <span
            className={
              lit
                ? "text-[#d9c8ff] drop-shadow-[0_0_5px_rgba(215,190,255,0.8)]"
                : "text-dust/70"
            }
          >
            {lit ? "\u2726" : "\u2727"}
          </span>
          {niche}
        </span>
        );
      })}
    </>
  );
}

export default function VisionClaimStrip() {
  const [active, setActive] = useState(NICHES[0].toLowerCase());
  useEffect(() => {
    const onNiche = (e: Event) => {
      setActive(((e as CustomEvent).detail as string).toLowerCase());
    };
    window.addEventListener("sf-niche", onNiche);
    return () => window.removeEventListener("sf-niche", onNiche);
  }, []);
  return (
    <div className="mt-6 space-y-4 overflow-hidden pb-4 sm:mt-8 sm:pb-6">
      {/* the world as it is */}
      <div className="claim-marquee-left">
        <Row />
        <Row hidden />
      </div>
      {/* the world to come */}
      <div className="claim-marquee-right">
        <Row lit active={active} />
        <Row lit hidden active={active} />
      </div>
    </div>
  );
}
