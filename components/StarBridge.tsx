"use client";

import { useEffect, useRef } from "react";

// A star of light rides the scroll from the end of the reframe line
// (#star-anchor) along a curved arc into the Tokyo Drift header
// (#tokyo-anchor), then goes supernova: impact flash, expanding shockwave
// rings, radial light streaks, and twinkling embers, as the header
// ignites. Canvas rendered, motion eased independently of scroll events
// so it stays smooth on phones. Reduced motion sees nothing.

type Streak = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
};

type Ember = Streak & { size: number; phase: number; white: boolean };

type Ring = { r: number; v: number; alpha: number };

export default function StarBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let dp = 0; // displayed progress, eased toward the scroll target
    let arrived = false;
    let flash = 0; // impact flash intensity
    let flashAt = { x: 0, y: 0 };
    let streaks: Streak[] = [];
    let embers: Ember[] = [];
    let rings: Ring[] = [];
    let sparks: Ember[] = []; // shed while flying
    let dpr = 1;

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const bezier = (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
    ) => {
      const u = 1 - t;
      return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
      };
    };

    const supernova = (x: number, y: number) => {
      flash = 1;
      flashAt = { x, y };
      rings = [
        { r: 6, v: 7.5, alpha: 0.85 },
        { r: 2, v: 5.2, alpha: 0.6 },
      ];
      streaks = [];
      const spokes = 12;
      for (let i = 0; i < spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = 5 + Math.random() * 5;
        streaks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.032 + Math.random() * 0.02,
        });
      }
      embers = [];
      for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.6;
        embers.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          life: 1,
          decay: 0.006 + Math.random() * 0.01,
          size: 1.2 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          white: Math.random() > 0.4,
        });
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vw = window.innerWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const startEl = document.getElementById("star-anchor");
      const endEl = document.getElementById("tokyo-anchor");
      if (!startEl || !endEl || !vh) return;

      const sr = startEl.getBoundingClientRect();
      const er = endEl.getBoundingClientRect();

      const idle =
        flash <= 0 &&
        rings.length === 0 &&
        streaks.length === 0 &&
        embers.length === 0 &&
        sparks.length === 0 &&
        dp < 0.01;
      if ((sr.top > vh * 1.6 || er.bottom < -vh * 0.6) && idle) {
        ctx.clearRect(0, 0, vw, vh);
        return;
      }

      const p0 = { x: sr.right + 6, y: sr.top + sr.height / 2 };
      const p2 = {
        x: er.left + Math.min(er.width * 0.55, 112),
        y: er.top + er.height * 0.45,
      };
      const p1 = {
        x: Math.min(vw - 18, Math.max(p0.x, p2.x) + vw * 0.22),
        y: (p0.y + p2.y) / 2,
      };

      const gap = p2.y - p0.y;
      const target =
        gap <= 0 ? 0 : Math.max(0, Math.min(1, (vh * 0.6 - p0.y) / gap));

      dp += (target - dp) * 0.085;
      if (Math.abs(target - dp) < 0.001) dp = target;

      ctx.clearRect(0, 0, vw, vh);
      const now = performance.now();

      const active = dp > 0.01 && !arrived;
      if (active) {
        ctx.globalCompositeOperation = "lighter";
        const tailStart = Math.max(0, dp - 0.34);
        const steps = 40;
        for (let i = 0; i < steps; i++) {
          const t1 = tailStart + ((dp - tailStart) * i) / steps;
          const t2 = tailStart + ((dp - tailStart) * (i + 1)) / steps;
          const a = bezier(t1, p0, p1, p2);
          const b = bezier(t2, p0, p1, p2);
          const k = i / steps;
          ctx.strokeStyle = `rgba(109, 40, 217, ${0.28 * k})`;
          ctx.lineWidth = 7 * k + 0.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.strokeStyle = `rgba(239, 236, 247, ${0.75 * k})`;
          ctx.lineWidth = 2.6 * k + 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";

        // The head: a four point star of light, twinkling as it flies
        const h = bezier(dp, p0, p1, p2);
        const pulse = 1 + 0.09 * Math.sin(now / 260);
        const rot = Math.sin(now / 850) * 0.18;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(rot);
        ctx.scale(pulse, pulse);
        ctx.globalCompositeOperation = "lighter";

        const R = 29;
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        halo.addColorStop(0, "rgba(255,255,255,0.9)");
        halo.addColorStop(0.3, "rgba(196,181,253,0.5)");
        halo.addColorStop(1, "rgba(167,139,250,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();

        const flare = (len: number, w: number, alpha: number) => {
          const g = ctx.createLinearGradient(0, -len, 0, len);
          g.addColorStop(0, "rgba(255,255,255,0)");
          g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(0, -len);
          ctx.quadraticCurveTo(w, 0, 0, len);
          ctx.quadraticCurveTo(-w, 0, 0, -len);
          ctx.fill();
        };
        flare(R * 1.5, 4.5, 0.95);
        ctx.rotate(Math.PI / 2);
        flare(R * 1.5, 4.5, 0.95);
        ctx.rotate(Math.PI / 4);
        flare(R * 0.75, 3, 0.7);
        ctx.rotate(Math.PI / 2);
        flare(R * 0.75, 3, 0.7);

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Sparks shed behind the head while moving
        if (Math.random() < 0.5 && dp > 0.03 && dp < 0.97) {
          sparks.push({
            x: h.x + (Math.random() - 0.5) * 4,
            y: h.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7 + 0.3,
            life: 0.7,
            decay: 0.03,
            size: 0.8 + Math.random() * 1.2,
            phase: Math.random() * Math.PI * 2,
            white: Math.random() > 0.5,
          });
        }
      }

      // Arrival: supernova and ignite the header
      if (dp >= 0.975 && !arrived) {
        arrived = true;
        supernova(p2.x, p2.y);
        endEl.classList.add("tokyo-ignite");
      } else if (target < 0.5 && arrived) {
        arrived = false;
        endEl.classList.remove("tokyo-ignite");
      }

      ctx.globalCompositeOperation = "lighter";

      // Impact flash: a burst of light that swells and dies fast
      if (flash > 0) {
        const fr = 90 * (1 - flash) + 30;
        const g = ctx.createRadialGradient(
          flashAt.x,
          flashAt.y,
          0,
          flashAt.x,
          flashAt.y,
          fr,
        );
        g.addColorStop(0, `rgba(255,255,255,${0.9 * flash})`);
        g.addColorStop(0.4, `rgba(196,181,253,${0.5 * flash})`);
        g.addColorStop(1, "rgba(167,139,250,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(flashAt.x, flashAt.y, fr, 0, Math.PI * 2);
        ctx.fill();
        flash -= 0.07;
      }

      // Shockwave rings expanding outward
      rings = rings.filter((r) => r.alpha > 0.02);
      for (const r of rings) {
        r.r += r.v;
        r.v *= 0.965;
        r.alpha *= 0.93;
        ctx.strokeStyle = `rgba(196, 181, 253, ${r.alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(flashAt.x, flashAt.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radial light streaks, like a firework starburst
      streaks = streaks.filter((s) => s.life > 0);
      for (const s of streaks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life -= s.decay;
        const a = Math.max(0, s.life);
        const g = ctx.createLinearGradient(
          s.x - s.vx * 4,
          s.y - s.vy * 4,
          s.x,
          s.y,
        );
        g.addColorStop(0, "rgba(167,139,250,0)");
        g.addColorStop(1, `rgba(239,236,247,${a})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 4, s.y - s.vy * 4);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      // Twinkling embers drifting down after the burst, plus flight sparks
      const drawEmber = (s: Ember) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy = s.vy * 0.96 + 0.02;
        s.life -= s.decay;
        const tw = 0.55 + 0.45 * Math.sin(now / 90 + s.phase);
        const a = Math.max(0, s.life) * tw;
        ctx.strokeStyle = s.white
          ? `rgba(239, 236, 247, ${a})`
          : `rgba(167, 139, 250, ${a})`;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        const r = s.size * (0.6 + s.life * 0.6);
        ctx.beginPath();
        ctx.moveTo(s.x - r, s.y);
        ctx.lineTo(s.x + r, s.y);
        ctx.moveTo(s.x, s.y - r);
        ctx.lineTo(s.x, s.y + r);
        ctx.stroke();
      };
      embers = embers.filter((s) => s.life > 0);
      sparks = sparks.filter((s) => s.life > 0);
      embers.forEach(drawEmber);
      sparks.forEach(drawEmber);

      ctx.globalCompositeOperation = "source-over";
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
