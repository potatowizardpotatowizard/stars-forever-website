"use client";

import { useEffect, useRef } from "react";

// Stars flying in from deep space toward the viewer: each star starts far
// back near the center of the sky and drifts outward, growing brighter as
// it approaches. Static under prefers reduced motion.
//
// Hidden wonders: a "sf-supernova" window event collapses the whole sky
// into the center and detonates it into a fresh burst (the hero logo
// fires it after seven clicks). And roughly one respawn in 250 is THE
// gold star: a large four point star of gold, unmistakably different.
// Click it before it drifts away and the "sf-goldstar" event opens the
// code rain secret (see CodeRain).
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    // Supernova phases: 0 idle, 1 collapsing, 2 detonation.
    let nova = 0;
    let novaT = 0;
    let burst = 1; // speed multiplier decaying back to 1 after the burst
    let debris: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      color: string;
    }[] = [];
    let rings: { born: number; speed: number; width: number }[] = [];

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

      // Supernova phase one: every star spirals into the heart of the
      // sky, faster and tighter, while the world dims around them.
      let pull = 0;
      let swirl = 0;
      if (nova === 1) {
        const p = Math.min(1, (t - novaT) / 800);
        pull = p * p * p;
        swirl = p * p * 3.2;
        ctx.fillStyle = `rgba(7, 5, 12, ${0.55 * pull})`;
        ctx.fillRect(0, 0, width, height);
        if (p >= 1) {
          // DETONATION. Debris storm, shockwaves, quake, rebirth.
          nova = 2;
          novaT = t;
          seed(width, height, true);
          burst = 9;
          debris = Array.from({ length: 260 }, () => {
            const ang = Math.random() * Math.PI * 2;
            const sp = 120 + Math.random() ** 2 * 1100;
            const roll = Math.random();
            return {
              x: width / 2,
              y: height / 2,
              vx: Math.cos(ang) * sp,
              vy: Math.sin(ang) * sp,
              life: 1,
              decay: 0.35 + Math.random() * 0.6,
              size: 0.6 + Math.random() * 2.2,
              color:
                roll < 0.5
                  ? "239 236 247"
                  : roll < 0.85
                    ? "167 139 250"
                    : "251 191 36",
            };
          });
          rings = [
            { born: t, speed: 1500, width: 3 },
            { born: t + 120, speed: 1050, width: 2 },
            { born: t + 260, speed: 720, width: 1.4 },
          ];
          window.dispatchEvent(new Event("sf-detonate"));
          const hero = document.getElementById("hero");
          if (hero) {
            hero.classList.remove("hero-quake");
            void hero.offsetWidth;
            hero.classList.add("hero-quake");
            setTimeout(() => hero.classList.remove("hero-quake"), 1000);
          }
        }
      }

      // Supernova phase two: the flash, the shockwaves, and a storm of
      // glowing debris raking the whole screen while the sky is reborn.
      if (nova === 2) {
        const age = (t - novaT) / 1000;
        const flash = Math.max(0, 1 - age / 0.5);
        if (flash > 0) {
          const r = Math.max(width, height) * (0.55 + (1 - flash) * 0.6);
          const g = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            r,
          );
          g.addColorStop(0, `rgba(255,255,255,${0.95 * flash})`);
          g.addColorStop(0.35, `rgba(196,181,253,${0.6 * flash})`);
          g.addColorStop(1, "rgba(167,139,250,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
        }

        const maxR = Math.hypot(width, height) * 0.75;
        for (const ring of rings) {
          const rt = (t - ring.born) / 1000;
          if (rt <= 0) continue;
          const r = rt * ring.speed;
          if (r > maxR) continue;
          const a = Math.max(0, 1 - r / maxR);
          ctx.strokeStyle = `rgba(196, 181, 253, ${0.55 * a})`;
          ctx.lineWidth = ring.width + 10 * a;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * a})`;
          ctx.lineWidth = ring.width * 0.5;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.lineCap = "round";
        for (const d of debris) {
          if (d.life <= 0) continue;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vx *= 0.985;
          d.vy *= 0.985;
          d.life -= d.decay * dt;
          const a = Math.max(0, d.life);
          const trail = 0.045 + d.size * 0.01;
          ctx.strokeStyle = `rgb(${d.color} / ${0.9 * a})`;
          ctx.lineWidth = d.size;
          ctx.beginPath();
          ctx.moveTo(d.x - d.vx * trail, d.y - d.vy * trail);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();
        }

        if (flash <= 0 && debris.every((d) => d.life <= 0)) {
          nova = 0;
          debris = [];
          rings = [];
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
          // Spiral: rotate each star around the center as it falls in.
          const dx = px - width / 2;
          const dy = py - height / 2;
          const cos = Math.cos(swirl);
          const sin = Math.sin(swirl);
          const rx = dx * cos - dy * sin;
          const ry = dx * sin + dy * cos;
          px = width / 2 + rx * (1 - pull);
          py = height / 2 + ry * (1 - pull);
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
          // THE gold star: a large four point star, twinkling, ringed
          // in a warm halo. Nothing else in the sky looks like it.
          const R = (6 + depth * 12) * (1 + 0.16 * Math.sin(t / 170));
          const rot = t / 900;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(rot);
          const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 2.6);
          halo.addColorStop(0, `rgba(253, 224, 71, ${0.55 * resolve})`);
          halo.addColorStop(0.5, `rgba(251, 191, 36, ${0.25 * resolve})`);
          halo.addColorStop(1, "rgba(251, 191, 36, 0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(0, 0, R * 2.6, 0, Math.PI * 2);
          ctx.fill();
          const w = R * 0.16;
          ctx.fillStyle = "#fbbf24";
          ctx.globalAlpha = Math.min(1, (0.55 + 0.45 * depth) * resolve);
          ctx.beginPath();
          ctx.moveTo(0, -R);
          ctx.quadraticCurveTo(w, -w, R, 0);
          ctx.quadraticCurveTo(w, w, 0, R);
          ctx.quadraticCurveTo(-w, w, -R, 0);
          ctx.quadraticCurveTo(-w, -w, 0, -R);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 251, 235, 0.95)";
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1.2, R * 0.14), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
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
        if (Math.hypot(px - cx, py - cy) < 30) {
          s.gold = false;
          window.dispatchEvent(new Event("sf-goldstar"));
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
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        transform:
          "translate3d(var(--tilt-x, 0px), var(--tilt-y, 0px), 0) scale(1.06)",
      }}
    />
  );
}
