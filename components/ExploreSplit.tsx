"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Explore as a split index: the page names run down one side while a
// single viewfinder window holds the highlighted page's photo, slowly
// drifting, crossfading as the highlight moves. Desktop highlights on
// hover; phones highlight whichever row rides nearest the middle of
// the screen as you scroll, so the window is always alive. Tapping a
// row lands on the page and the warp takes it from there.
type Page = {
  href: string;
  label: string;
  summary: string;
  img: string;
  /** object-position focal point for the viewfinder crop */
  pos?: string;
};

const PAGES: Page[] = [
  {
    href: "/vision",
    label: "The Vision",
    summary: "Why we exist and where all of this is going.",
    img: "/images/joshua-desert.jpg",
  },
  {
    href: "/partner-projects",
    label: "Partner Projects",
    summary: "Every mission we have filmed with partner creators.",
    img: "/images/real-treasure-card.jpg",
  },
  {
    href: "/category-3",
    label: "Find Your Creator Type",
    summary: "Find out how God wired you to create.",
    img: "/images/home-proof-tokyo.jpg",
  },
  {
    href: "/revolutionary",
    label: "Revolutionary Cohort",
    summary: "Our cohort that trains creators for mission.",
    img: "/images/rev-strip-4.jpg",
  },
  {
    href: "/get-involved",
    label: "Get Involved",
    summary: "Ways to give, partner, or build with us.",
    img: "/images/give-discipleship.jpg",
  },
  {
    href: "/story",
    label: "The Story",
    summary: "How Stars Forever began.",
    img: "/images/story-prayer.jpg",
  },
  {
    href: "/constellation",
    label: "The Constellation",
    summary: "A global map of creators serious about Jesus.",
    img: "/images/joshua-stargazing.jpg",
  },
  {
    href: "/speaking",
    label: "Speaking",
    summary: "Book us to speak at your event or church.",
    img: "/images/speak-auzi.jpg",
    pos: "50% 18%",
  },
  {
    href: "/podcast",
    label: "Podcast",
    summary: "Our conversations about faith and creating.",
    img: "/images/beast-podcast-jeremy.jpg",
  },
  {
    href: "/strategy",
    label: "YouTube Strategy",
    summary: "The framework we use to reach millions.",
    img: "/images/tokyo-planning.jpg",
  },
];

export default function ExploreSplit() {
  const active = usePathname();
  const [focus, setFocus] = useState(() => {
    const i = PAGES.findIndex((p) => p.href === active);
    return i >= 0 ? i : 0;
  });
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoverAt = useRef(0);

  // phones: the row nearest the middle of the screen owns the window
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.innerHeight * 0.58;
        let best = -1;
        let bestD = Infinity;
        rowRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const d = Math.abs((r.top + r.bottom) / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        if (best >= 0 && bestD < window.innerHeight * 0.5) setFocus(best);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const focused = PAGES[focus];

  return (
    <nav aria-label="Explore">
      <h2 className="meta-label">Explore</h2>
      <div className="mt-8 md:grid md:grid-cols-2 md:items-center md:gap-14">
        {/* the viewfinder window: pinned on phones so it never scrolls
            out of frame while the list is still being browsed */}
        <div className="sticky top-4 z-10 md:static md:order-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-dust/40 md:aspect-[4/3]">
            {PAGES.map((p, i) => (
              <Image
                key={p.href}
                src={p.img}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 40rem, 100vw"
                className={`object-cover transition-opacity duration-700 ${
                  i === focus ? "explore-drift opacity-100" : "opacity-0"
                }`}
                style={p.pos ? { objectPosition: p.pos } : undefined}
              />
            ))}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="meta-label text-starlight/70">{focused.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-starlight/90 sm:text-base">
                {focused.summary}
              </p>
            </div>
          </div>
        </div>

        {/* the index */}
        <ul className="mt-8 md:order-1 md:mt-0">
          {PAGES.map((p, i) => {
            const isActive = active === p.href;
            const isFocus = i === focus;
            return (
              <li key={p.href}>
                <Link
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  href={p.href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => {
                    hoverAt.current = performance.now();
                    setFocus(i);
                  }}
                  onFocus={() => setFocus(i)}
                  className="group flex items-baseline gap-4 py-1.5"
                >
                  <span className="meta-label w-6 flex-none text-dust/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-[clamp(22px,5.6vw,30px)] font-extrabold uppercase leading-tight tracking-tight transition-all duration-300 sm:text-3xl md:text-[30px] lg:text-4xl ${
                      isActive
                        ? "text-ember"
                        : isFocus
                          ? "text-white [text-shadow:0_0_16px_rgb(167_139_250/0.35)]"
                          : "text-starlight/40"
                    }`}
                  >
                    {p.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
