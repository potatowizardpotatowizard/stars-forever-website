"use client";

import { useEffect, useRef } from "react";

// A star of light rides the scroll from the end of the reframe line
// (#star-anchor) along a curved arc into the Tokyo Drift header
// (#tokyo-anchor). On impact the header itself ignites with a glow.
// Canvas rendered, motion eased independently of scroll events so it
// stays smooth on phones. Reduced motion sees nothing.

type Streak = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
};

type Ember = Streak & { size: number; phase: number; white: boolean };


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

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vw = window.innerWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const startEl = document.getElementById("star-anchor");
      const endEl = document.getElementById("tokyo-anchor");
      if (!startEl || !endEl || !vh) return;

      const sr = startEl.getBoundingClientRect();
      const er = endEl.getBoundingClientRect();

      const idle = sparks.length === 0 && dp < 0.01;
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

      // Arrival: the header simply ignites
      if (dp >= 0.975 && !arrived) {
        arrived = true;
        endEl.classList.add("tokyo-ignite");
      } else if (target < 0.5 && arrived) {
        arrived = false;
        endEl.classList.remove("tokyo-ignite");
      }

      ctx.globalCompositeOperation = "lighter";

      // Twinkling sparks shed in flight
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
      sparks = sparks.filter((s) => s.life > 0);
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
