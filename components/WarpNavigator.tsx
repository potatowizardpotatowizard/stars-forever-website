"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

// The signature move: internal navigation is a hyperspace jump. The
// destination loads WHILE the star field accelerates, so there is never
// a frozen black hold; the page itself falls away into the jump and the
// new one decelerates in. Reduced motion users navigate normally.

const PUSH_DELAY_MS = 300; // page has faded into the field before swap
const OUT_MS = 560; // stars appear at rest, then accelerate to light speed
const MIN_JUMP_MS = 760; // shortest full jump even on instant loads
const IN_MS = 400; // deceleration + reveal
const BAIL_MS = 5000; // reveal anyway if a load hangs

// scale around the middle of what the viewer is LOOKING at, not the
// middle of the whole document; otherwise a tall page appears to slide
// down from the top instead of flying in
const viewportOrigin = (el: HTMLElement) =>
  `50% ${window.scrollY + window.innerHeight / 2 - el.offsetTop}px`;

export default function WarpNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const jump = useRef<{
    start: number;
    arrived: boolean;
    inStart: number;
    done: boolean;
  } | null>(null);
  const raf = useRef(0);

  // Intercept internal link clicks.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (jump.current && !jump.current.done) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const [path] = href.split("#");
      if (href.includes("#") && (path === "" || path === window.location.pathname)) {
        return; // same page anchor
      }
      if (path === window.location.pathname) return;

      // preventDefault stops the Link's own navigation; propagation is
      // left alone so UI like the mobile menu still hears the click and
      // can close itself while the warp plays.
      e.preventDefault();
      jump.current = {
        start: performance.now(),
        arrived: false,
        inStart: 0,
        done: false,
      };
      // flushSync so the overlay canvas exists before the first frame
      flushSync(() => setActive(true));
      startField();

      // the old page fades out INTO the star field while it accelerates;
      // no scaling on the way out, so its edges never show
      const main = document.getElementById("main");
      if (main) {
        main.style.transition = "opacity 420ms cubic-bezier(0.4,0,0.8,1)";
        main.style.opacity = "0";
      }
      router.prefetch(path);
      window.setTimeout(() => router.push(href), PUSH_DELAY_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // The route changed: the new page is mounted (still invisible).
  useEffect(() => {
    if (jump.current && !jump.current.done) jump.current.arrived = true;
  }, [pathname]);

  // Continuous star field: accelerate, flow while loading, decelerate.
  const startField = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const j = jump.current;
    if (!canvas || !ctx || !j) {
      finishNow();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.style.opacity = "1";

    // The exact same sky as StarField: identical spawn ranges, speeds,
    // projection, dot sizes, and tail lengths, so the warp IS the
    // background stars accelerating rather than a different animation.
    const FAR = 1.0;
    const NEAR = 0.05;
    const scale = Math.min(w, h) * 0.5;
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: NEAR + Math.random() * (FAR - NEAR),
      speed: 0.055 + Math.random() * 0.1,
    }));
    let lastFrame = 0;
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - (1 - t) * (2 - 2 * t) * 0.5;

    const frame = (now: number) => {
      const t = now - j.start;
      // arrival begins only once loaded AND the jump has had its moment
      if (j.arrived && t >= MIN_JUMP_MS && !j.inStart) {
        j.inStart = now;
        const main = document.getElementById("main");
        if (main) {
          // the new page emerges out of the warp: starts deep and small
          // around the viewport center, decelerates up to full size
          main.style.transition = "none";
          main.style.transformOrigin = viewportOrigin(main);
          main.style.opacity = "0";
          main.style.transform = "scale(0.88)";
          void main.offsetWidth;
          main.style.transition = `opacity ${IN_MS}ms ease-out, transform ${IN_MS}ms cubic-bezier(0.16,1,0.3,1)`;
          main.style.opacity = "1";
          main.style.transform = "scale(1)";
        }
      }
      if (!j.arrived && t > BAIL_MS) j.arrived = true;

      const inT = j.inStart ? Math.min(1, (now - j.inStart) / IN_MS) : 0;
      if (inT >= 1) {
        finishNow();
        return;
      }
      // speed: stars sit at rest first, then ease up to light speed
      const up = easeInOut(Math.min(1, t / OUT_MS));
      // stars materialize quickly; darkness waits, then eases in
      const aIn = Math.min(1, t / 140);
      const dark =
        0.85 * Math.min(1, Math.max(0, (t - 200) / (OUT_MS - 200))) * (1 - inT);

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = dark;
      ctx.fillStyle = "#07050c";
      ctx.fillRect(0, 0, w, h);

      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0.016;
      lastFrame = now;
      // acceleration multiplier over the field's natural drift
      const boost = 1 + 60 * up * up * (1 - inT * 0.85);
      // tails lean purple as the field goes to light speed
      const k = up * 0.75;
      const tailColor = `${Math.round(239 - 59 * k)},${Math.round(236 - 96 * k)},${Math.round(247 + 8 * k)}`;
      ctx.lineCap = "round";
      for (const s of stars) {
        s.z -= s.speed * boost * dt;
        if (s.z <= NEAR) {
          s.z = FAR;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
        }
        const px = w / 2 + (s.x / s.z) * scale;
        const py = h / 2 + (s.y / s.z) * scale;
        if (px < -40 || px > w + 40 || py < -40 || py > h + 40) {
          s.z = FAR;
          continue;
        }
        const depth = 1 - (s.z - NEAR) / (FAR - NEAR);
        const alpha = (0.12 + 0.65 * depth * depth) * aIn * (1 - inT);
        const radius = 0.3 + 1.2 * depth;
        // same thin tails as the background field, reaching further
        // back as the speed climbs
        const zBack = s.z + (0.07 + 0.07 * depth) * (1 + 9 * up);
        const bx = w / 2 + (s.x / zBack) * scale;
        const by = h / 2 + (s.y / zBack) * scale;
        ctx.globalAlpha = Math.min(1, alpha * (0.55 + 0.4 * up));
        ctx.strokeStyle = `rgb(${tailColor})`;
        ctx.lineWidth = Math.max(0.4, radius * 0.7);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = "#efecf7";
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  const finishNow = () => {
    cancelAnimationFrame(raf.current);
    if (jump.current) jump.current.done = true;
    const main = document.getElementById("main");
    if (main) {
      main.style.transition = "";
      main.style.opacity = "";
      main.style.transform = "";
      main.style.transformOrigin = "";
    }
    setActive(false);
  };

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
