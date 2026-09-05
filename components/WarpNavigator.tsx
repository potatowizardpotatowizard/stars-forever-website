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

      // Only the surface the viewer is looking at fades into the jump.
      // Menu open: the menu alone dissolves (Header fades it out), and
      // the stale page behind it hides instantly so it can never ghost
      // through the fade. Menu closed: the page itself fades out.
      const menuOpen = !!document.getElementById("mobile-nav");
      const main = document.getElementById("main");
      if (main) {
        if (menuOpen) {
          main.style.transition = "none";
          main.style.opacity = "0";
        } else {
          main.style.transition = "opacity 420ms cubic-bezier(0.4,0,0.8,1)";
          main.style.opacity = "0";
        }
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
  // Every jump lands at the top of the destination.
  useEffect(() => {
    if (jump.current && !jump.current.done) {
      jump.current.arrived = true;
      window.scrollTo(0, 0);
    }
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

    const scale = Math.min(w, h) * 0.5;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: 0.08 + Math.random() * 0.92,
    }));
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

      const speed = (0.02 + 5.5 * up * up) * (1 - inT * 0.85);
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      for (const s of stars) {
        s.z -= speed * 0.016 * s.z + 0.002;
        if (s.z <= 0.02) s.z = 1;
        const px = w / 2 + (s.x / s.z) * scale;
        const py = h / 2 + (s.y / s.z) * scale;
        const stretch = Math.min(1, s.z + 0.03 + 0.42 * up * (1 - inT));
        // tails grow from nothing: a resting star is a dot, not a line
        const tail = Math.min(1, up * 1.5);
        const bx = px + (w / 2 + (s.x / stretch) * scale - px) * tail;
        const by = py + (h / 2 + (s.y / stretch) * scale - py) * tail;
        const depth = 1 - s.z;
        const a = (0.2 + 0.7 * depth) * (0.35 + 0.65 * up) * aIn * (1 - inT);
        // the brand's long exposure purple trails: violet glow body
        // with a bright near-white core riding it
        ctx.strokeStyle = `rgba(180,140,255,${(a * 0.8).toFixed(3)})`;
        ctx.lineWidth = 1.5 + 2.8 * depth;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.strokeStyle = `rgba(244,240,255,${a.toFixed(3)})`;
        ctx.lineWidth = 0.5 + 1.1 * depth;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
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
