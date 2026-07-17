"use client";

import { useEffect, useRef } from "react";

// A comet rides the scroll from the end of the reframe line (#star-anchor)
// along a curved arc into the Tokyo Drift header (#tokyo-anchor), trailing
// a tapered tail and shedding sparks, then explodes into particles as the
// header ignites. Canvas rendered, motion eased independently of scroll
// events so it stays smooth on phones. Reduced motion sees nothing.

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  white: boolean;
};

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
    let particles: Particle[] = [];
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

    const burst = (x: number, y: number) => {
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1,
          decay: 0.016 + Math.random() * 0.02,
          size: 1 + Math.random() * 2.4,
          white: Math.random() > 0.45,
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

      // Cheap skip when the whole journey is far offscreen and idle
      if ((sr.top > vh * 1.6 || er.bottom < -vh * 0.6) && particles.length === 0 && dp < 0.01) {
        ctx.clearRect(0, 0, vw, vh);
        return;
      }

      const p0 = { x: sr.right + 6, y: sr.top + sr.height / 2 };
      const p2 = { x: er.left + Math.min(er.width * 0.4, 70), y: er.top + er.height * 0.45 };
      // Control point bows the arc out to the right, clamped to the screen
      const p1 = {
        x: Math.min(vw - 18, Math.max(p0.x, p2.x) + vw * 0.22),
        y: (p0.y + p2.y) / 2,
      };

      // Scroll target: the journey completes as the gap crosses 60% viewport
      const gap = p2.y - p0.y;
      const target =
        gap <= 0 ? 0 : Math.max(0, Math.min(1, (vh * 0.6 - p0.y) / gap));

      // Ease the displayed progress toward the target: smooth on any device
      dp += (target - dp) * 0.14;
      if (Math.abs(target - dp) < 0.001) dp = target;

      ctx.clearRect(0, 0, vw, vh);

      const active = dp > 0.01 && !arrived;
      if (active) {
        // Tapered comet tail along the arc
        const tailStart = Math.max(0, dp - 0.3);
        const steps = 26;
        for (let i = 0; i < steps; i++) {
          const t1 = tailStart + ((dp - tailStart) * i) / steps;
          const t2 = tailStart + ((dp - tailStart) * (i + 1)) / steps;
          const a = bezier(t1, p0, p1, p2);
          const b = bezier(t2, p0, p1, p2);
          const k = i / steps; // 0 at tail end, 1 at head
          // wide soft violet underlayer
          ctx.strokeStyle = `rgba(109, 40, 217, ${0.28 * k})`;
          ctx.lineWidth = 7 * k + 0.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          // bright core
          ctx.strokeStyle = `rgba(239, 236, 247, ${0.75 * k})`;
          ctx.lineWidth = 2.6 * k + 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // The comet head: layered glow
        const h = bezier(dp, p0, p1, p2);
        const glow = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 16);
        glow.addColorStop(0, "rgba(255,255,255,0.95)");
        glow.addColorStop(0.35, "rgba(239,236,247,0.7)");
        glow.addColorStop(0.7, "rgba(167,139,250,0.35)");
        glow.addColorStop(1, "rgba(167,139,250,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(h.x, h.y, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Sparks shed behind the head while moving
        if (Math.random() < 0.5 && dp > 0.03 && dp < 0.97) {
          particles.push({
            x: h.x + (Math.random() - 0.5) * 4,
            y: h.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7 + 0.3,
            life: 0.7,
            decay: 0.03,
            size: 0.8 + Math.random() * 1.2,
            white: Math.random() > 0.5,
          });
        }
      }

      // Arrival: explode and ignite the header
      if (dp >= 0.975 && !arrived) {
        arrived = true;
        burst(p2.x, p2.y);
        endEl.classList.add("tokyo-ignite");
      } else if (target < 0.5 && arrived) {
        arrived = false;
        endEl.classList.remove("tokyo-ignite");
      }

      // Particles: sparks and the explosion
      particles = particles.filter((s) => s.life > 0);
      for (const s of particles) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy = s.vy * 0.95 + 0.02;
        s.life -= s.decay;
        const alpha = Math.max(0, s.life);
        ctx.fillStyle = s.white
          ? `rgba(239, 236, 247, ${alpha})`
          : `rgba(167, 139, 250, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.5 + s.life * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
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
