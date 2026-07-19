"use client";

import { useEffect, useRef, useState } from "react";

// Stars flying in from deep space toward the viewer: each star starts far
// back near the center of the sky and drifts outward, growing brighter as
// it approaches. Static under prefers reduced motion.
//
// Hidden wonders: a "sf-supernova" window event collapses the whole sky
// into the center and detonates it into a fresh burst (the hero logo
// fires it after seven clicks). And roughly one respawn in 250 is a gold
// star; catch it with a click before it drifts away and a whispered
// reward appears.
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const FAR = 1.0; // spawn depth
    const NEAR = 0.05; // recycle depth
    let width = 0;
    let height = 0;
    let scale = 0;
    let stars: {
      x: number;
      y: number;
      z: number;
      speed: number;
      gold: boolean;
    }[] = [];
    let raf = 0;
    let start = 0;
    let last = 0;
    // Supernova phases: 0 idle, 1 collapsing, 2 flash and reburst.
    let nova = 0;
    let novaT = 0;
    let burst = 1; // speed multiplier decaying back to 1 after the burst

    const spawnStar = (initial: boolean) => ({
      // Unit-square offsets from the sky's center; z gives depth.
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: initial ? NEAR + Math.random() * (FAR - NEAR) : FAR,
      speed: 0.055 + Math.random() * 0.1, // depth per second: a steady jump
      gold: !initial && Math.random() < 0.004,
    });

    const seed = (w: number, h: number, deep = false) => {
      const count = Math.min(240, Math.floor((w * h) / 4800));
      stars = Array.from({ length: count }, () => {
        const s = spawnStar(true);
        if (deep) s.z = FAR * (0.6 + Math.random() * 0.4);
        return s;
      });
    };

    const project = (s: { x: number; y: number; z: number }) => ({
      px: width / 2 + (s.x / s.z) * scale,
      py: height / 2 + (s.y / s.z) * scale,
    });

    const draw = (t: number) => {
      if (!start) {
        start = t;
        last = t;
      }
      const elapsed = (t - start) / 1000;
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      // The field resolves over the first few seconds, then holds.
      const resolve = Math.min(1, elapsed / 3.5);
      ctx.clearRect(0, 0, width, height);

      // Supernova: pull every star into the heart of the sky...
      let pull = 0;
      if (nova === 1) {
        pull = Math.min(1, (t - novaT) / 650);
        pull = pull * pull;
        if (pull >= 1) {
          nova = 2;
          novaT = t;
          seed(width, height, true);
          burst = 7;
        }
      }
      // ...one white beat of stillness, then everything is born again.
      if (nova === 2) {
        const flash = 1 - Math.min(1, (t - novaT) / 450);
        if (flash > 0) {
          const r = Math.max(width, height) * 0.5 * (1 - flash * 0.6);
          const g = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            r,
          );
          g.addColorStop(0, `rgba(255,255,255,${0.9 * flash})`);
          g.addColorStop(0.4, `rgba(196,181,253,${0.5 * flash})`);
          g.addColorStop(1, "rgba(167,139,250,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
        } else {
          nova = 0;
        }
      }
      burst += (1 - burst) * Math.min(1, dt * 2.2);

      for (const s of stars) {
        if (!reduceMotion) {
          s.z -= s.speed * burst * dt;
          if (s.z <= NEAR) Object.assign(s, spawnStar(false));
        }
        let { px, py } = project(s);
        if (px < -40 || px > width + 40 || py < -40 || py > height + 40) {
          Object.assign(s, spawnStar(false));
          continue;
        }
        if (pull > 0) {
          px = px + (width / 2 - px) * pull;
          py = py + (height / 2 - py) * pull;
        }

        // Approaching stars grow from a distant speck to a bright point.
        const depth = 1 - (s.z - NEAR) / (FAR - NEAR); // 0 far, 1 near
        const alpha = (0.12 + 0.65 * depth * depth) * resolve;
        const radius = 0.3 + 1.2 * depth;

        // Hyperspace stretch: the streak reaches back toward where the
        // star was deeper in the field, elongating as it nears the camera.
        if (!reduceMotion && depth > 0.15 && pull === 0) {
          const back = project({ x: s.x, y: s.y, z: s.z + 0.07 + 0.07 * depth });
          ctx.globalAlpha = alpha * 0.55;
          ctx.strokeStyle = s.gold ? "#fbbf24" : "#efecf7";
          ctx.lineWidth = Math.max(0.4, radius * 0.7);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(back.px, back.py);
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        if (s.gold) {
          ctx.globalAlpha = Math.min(1, alpha * 1.6);
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(px, py, radius * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha * 0.35;
          ctx.beginPath();
          ctx.arc(px, py, radius * 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "#efecf7";
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion || resolve < 1) {
        raf = requestAnimationFrame(draw);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      scale = Math.min(width, height) * 0.5;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(width, height);
    };

    const supernova = () => {
      if (reduceMotion || nova !== 0) return;
      nova = 1;
      novaT = performance.now();
    };

    // Catch the gold star: clicks anywhere over the field are hit-tested
    // against gold stars only, so normal links are never intercepted.
    const catchStar = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (cx < 0 || cy < 0 || cx > rect.width || cy > rect.height) return;
      for (const s of stars) {
        if (!s.gold) continue;
        const { px, py } = project(s);
        if (Math.hypot(px - cx, py - cy) < 18) {
          s.gold = false;
          setCaught(true);
          setTimeout(() => setCaught(false), 9000);
          return;
        }
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("sf-supernova", supernova);
    window.addEventListener("click", catchStar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("sf-supernova", supernova);
      window.removeEventListener("click", catchStar);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          transform:
            "translate3d(var(--tilt-x, 0px), var(--tilt-y, 0px), 0) scale(1.06)",
        }}
      />
      {caught ? (
        <p
          role="status"
          className="meta-label absolute inset-x-0 bottom-24 z-20 px-6 text-center text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        >
          You caught the gold star. Tell Auzi the word “tapelight” for a
          surprise.
        </p>
      ) : null}
    </>
  );
}
