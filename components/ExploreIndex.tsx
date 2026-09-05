"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FOOTER_NAV, NAV } from "@/content/site";

// The Explore nav as film credits: every page a huge hollow display
// line. Hovering or focusing a line sends a meteor streaking through
// it and fills the letters with light; the page you are on burns in
// ember. Lines stagger in as the footer scrolls into view.
const LINKS = [...NAV, ...FOOTER_NAV];

export default function ExploreIndex() {
  const active = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <nav ref={ref} aria-label="Explore">
      <h2 className="meta-label">Explore</h2>
      <ul className="mt-6">
        {LINKS.map((item, i) => {
          const isActive = active === item.href;
          return (
            <li
              key={item.href}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : "translateY(18px)",
                transition: `opacity 0.7s ease ${i * 0.07}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s`,
              }}
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`explore-line relative block py-1 font-display text-[clamp(30px,8vw,42px)] font-extrabold uppercase leading-[1.08] tracking-tight transition-colors duration-300 sm:text-[clamp(38px,4vw,58px)] ${
                  isActive
                    ? "text-ember [text-shadow:0_0_14px_rgb(167_139_250/0.4)]"
                    : "text-transparent [-webkit-text-stroke:1px_rgb(237_233_254/0.5)] hover:text-white hover:[text-shadow:0_0_12px_rgb(255_255_255/0.3),0_0_40px_rgb(167_139_250/0.35)] focus-visible:text-white"
                }`}
              >
                <span className="relative inline-block">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 overflow-hidden"
                  >
                    <span className="explore-meteor" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
