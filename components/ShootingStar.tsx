"use client";

import { useEffect, useRef } from "react";

// A rare meteor: every 20 to 40 seconds a single streak crosses the page
// background, behind the content. Skipped entirely under reduced motion.
// Also summonable: "sf-shoot" fires one streak on demand (a phone shake),
// and "sf-shower" calls down a staggered meteor shower. Each streak is
// its own element, so a shower really is many meteors at once.
export default function ShootingStar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const showerTimers: ReturnType<typeof setTimeout>[] = [];

    // Ambient meteors drift behind the page; summoned ones (a phone
    // shake) fly above it, or they would hide behind the hero art.
    const shoot = (front = false) => {
      const host = ref.current;
      if (!host) return;
      const el = document.createElement("div");
      el.style.cssText =
        `position:fixed;height:${front ? 2 : 1}px;width:240px;pointer-events:none;` +
        `z-index:${front ? 45 : -1};` +
        "background:linear-gradient(90deg, transparent, rgb(239 236 247 / 0.9));" +
        "box-shadow:0 0 6px rgb(167 139 250 / 0.6);";
      const fromTop = 5 + Math.random() * 55; // vh
      const angle = 12 + Math.random() * 22; // degrees downward
      const travel = window.innerWidth * 1.3;
      const rad = (angle * Math.PI) / 180;
      el.style.top = `${fromTop}vh`;
      el.style.left = "-240px";
      host.appendChild(el);
      const anim = el.animate(
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
      anim.onfinish = () => el.remove();
    };

    const schedule = () => {
      timer = setTimeout(() => {
        shoot();
        schedule();
      }, 20000 + Math.random() * 20000);
    };
    schedule();

    const onShoot = () => shoot(true);
    const onShower = () => {
      for (let i = 0; i < 10; i++) {
        showerTimers.push(
          setTimeout(() => shoot(true), i * 160 + Math.random() * 120),
        );
      }
    };
    window.addEventListener("sf-shoot", onShoot);
    window.addEventListener("sf-shower", onShower);

    return () => {
      clearTimeout(timer);
      showerTimers.forEach(clearTimeout);
      window.removeEventListener("sf-shoot", onShoot);
      window.removeEventListener("sf-shower", onShower);
      ref.current?.replaceChildren();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" />;
}
