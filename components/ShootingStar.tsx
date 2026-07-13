"use client";

import { useEffect, useRef } from "react";

// A rare meteor: every 20 to 40 seconds a single streak crosses the page
// background, behind the content. Skipped entirely under reduced motion.
export default function ShootingStar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    let anim: Animation | undefined;

    const shoot = () => {
      const el = ref.current;
      if (!el) return;
      const fromTop = 5 + Math.random() * 55; // vh
      const angle = 12 + Math.random() * 22; // degrees downward
      const travel = window.innerWidth * 1.3;
      const rad = (angle * Math.PI) / 180;
      el.style.top = `${fromTop}vh`;
      el.style.left = "-240px";
      el.style.transform = `rotate(${angle}deg)`;
      el.style.opacity = "1";
      anim = el.animate(
        [
          { transform: `translate(0, 0) rotate(${angle}deg)`, opacity: 0 },
          { opacity: 0.7, offset: 0.15 },
          { opacity: 0.7, offset: 0.75 },
          {
            transform: `translate(${travel * Math.cos(rad)}px, ${travel * Math.sin(rad)}px) rotate(${angle}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1600 + Math.random() * 700, easing: "linear" },
      );
      schedule();
    };

    const schedule = () => {
      timer = setTimeout(shoot, 20000 + Math.random() * 20000);
    };
    schedule();
    return () => {
      clearTimeout(timer);
      anim?.cancel();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed h-px w-60 opacity-0"
      style={{
        zIndex: -1,
        background:
          "linear-gradient(90deg, transparent, rgb(239 236 247 / 0.9))",
        boxShadow: "0 0 6px rgb(167 139 250 / 0.6)",
      }}
    />
  );
}
