"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FOOTER_NAV, NAV } from "@/content/site";

// The Explore column as an actual constellation: every page is a star,
// faint lines thread them together in nav order, and the star of the
// page you are on burns brighter. Scrolling the footer into view draws
// the lines; hovering or focusing a star ignites it.
//
// Two hand-placed layouts: a wide sky for desktop columns, a tall
// zigzag sky for phones. Links are real anchors laid over an
// aria-hidden SVG, so the map stays accessible and tappable.

type Node = {
  x: number;
  y: number;
  /** label sits to the left of the star instead of the right */
  end?: boolean;
};

const LINKS = [...NAV, ...FOOTER_NAV];

// desktop sky, viewBox 600 x 420
const SKY_WIDE: Node[] = [
  { x: 58, y: 52 }, // The Vision
  { x: 232, y: 34 }, // Partner Projects
  { x: 505, y: 84, end: true }, // Find Your Creator Type
  { x: 545, y: 138, end: true }, // Revolutionary Cohort
  { x: 428, y: 210, end: true }, // Get Involved
  { x: 242, y: 172 }, // The Story
  { x: 92, y: 226 }, // The Constellation
  { x: 66, y: 330 }, // Speaking
  { x: 235, y: 372 }, // Podcast
  { x: 440, y: 322 }, // YouTube Strategy
];

// phone sky, viewBox 380 x 300: two stars per row so the map stays
// wide and short instead of a tall column
const SKY_TALL: Node[] = [
  { x: 26, y: 22 }, // The Vision
  { x: 354, y: 38, end: true }, // Partner Projects
  { x: 22, y: 88 }, // Find Your Creator Type
  { x: 28, y: 152 }, // Revolutionary Cohort
  { x: 352, y: 162, end: true }, // Get Involved
  { x: 350, y: 96, end: true }, // The Story
  { x: 34, y: 216 }, // The Constellation
  { x: 348, y: 224, end: true }, // Speaking
  { x: 30, y: 278 }, // Podcast
  { x: 352, y: 270, end: true }, // YouTube Strategy
];

function Sky({
  nodes,
  vw,
  vh,
  active,
}: {
  nodes: Node[];
  vw: number;
  vh: number;
  active: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chain = nodes.map((n) => `${n.x},${n.y}`).join(" ");
  // a couple of faint cross threads for a woven constellation feel
  const cross: [number, number][] = [
    [0, 5],
    [2, 5],
    [6, 8],
  ];

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ aspectRatio: `${vw} / ${vh}` }}
    >
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <polyline
          points={chain}
          pathLength={1}
          stroke="rgba(196,181,253,0.32)"
          strokeWidth="1"
          strokeDasharray="1"
          strokeDashoffset={drawn ? 0 : 1}
          style={{
            transition: "stroke-dashoffset 2.4s cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 4px rgba(167,139,250,0.5))",
          }}
        />
        {cross.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            pathLength={1}
            stroke="rgba(196,181,253,0.14)"
            strokeWidth="1"
            strokeDasharray="1"
            strokeDashoffset={drawn ? 0 : 1}
            style={{
              transition:
                "stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1) 1.1s",
            }}
          />
        ))}
      </svg>
      {LINKS.map((item, i) => {
        const n = nodes[i];
        const isActive = active === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group absolute flex items-center gap-2.5 py-1.5 ${
              n.end ? "flex-row-reverse" : ""
            }`}
            style={{
              left: `${(n.x / vw) * 100}%`,
              top: `${(n.y / vh) * 100}%`,
              transform: `translate(${n.end ? "calc(-100% + 10px)" : "-10px"}, -50%)`,
              opacity: drawn ? 1 : 0,
              transition: `opacity 0.9s ease ${0.15 + i * 0.12}s`,
            }}
          >
            <span
              aria-hidden="true"
              className={`relative block h-[7px] w-[7px] flex-none rotate-45 transition-all duration-300 ${
                isActive
                  ? "bg-white shadow-[0_0_14px_4px_rgb(196_170_255/0.8)]"
                  : "bg-starlight/80 shadow-[0_0_8px_1px_rgb(196_170_255/0.35)] group-hover:bg-white group-hover:shadow-[0_0_14px_4px_rgb(196_170_255/0.8)]"
              }`}
            />
            <span
              className={`whitespace-nowrap font-meta text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                isActive
                  ? "text-white"
                  : "text-starlight/75 group-hover:text-ember"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function FooterConstellation() {
  const active = usePathname();
  return (
    <nav aria-label="Explore">
      <h2 className="meta-label">Explore</h2>
      <div className="mt-6 hidden md:block">
        <Sky nodes={SKY_WIDE} vw={600} vh={420} active={active} />
      </div>
      <div className="mt-4 md:hidden">
        <Sky nodes={SKY_TALL} vw={380} vh={300} active={active} />
      </div>
    </nav>
  );
}
