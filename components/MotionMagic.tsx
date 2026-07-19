"use client";

import { useEffect } from "react";

// Phone-only wonders, all driven by the motion sensors:
// - Tilt parallax: the star background layers drift with the phone's
//   angle (via the --tilt-x/--tilt-y CSS variables consumed in CSS
//   and by the hero StarField).
// - Shake: one shake fires a shooting star; a second shake within
//   three seconds calls down a whole meteor shower (events handled
//   by ShootingStar).
// iOS requires a user-gesture permission request for motion data; we
// ask once on the first touch and stay quiet if declined.
export default function MotionMagic() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let tiltX = 0;
    let tiltY = 0;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const applyTilt = () => {
      tiltX += (targetX - tiltX) * 0.08;
      tiltY += (targetY - tiltY) * 0.08;
      root.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}px`);
      root.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}px`);
      raf = requestAnimationFrame(applyTilt);
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: left/right (-90..90), beta: front/back. Small window,
      // clamped, so the sky drifts instead of lurching.
      targetX = Math.max(-14, Math.min(14, (e.gamma / 45) * 14));
      targetY = Math.max(-10, Math.min(10, ((e.beta - 40) / 45) * 10));
    };

    let lastMag = 0;
    let lastShake = 0;
    let prevShake = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null || a.y == null || a.z == null) return;
      const mag = Math.hypot(a.x, a.y, a.z);
      const delta = Math.abs(mag - lastMag);
      lastMag = mag;
      const now = performance.now();
      if (delta > 14 && now - lastShake > 900) {
        prevShake = lastShake;
        lastShake = now;
        if (now - prevShake < 3000) {
          window.dispatchEvent(new Event("sf-shower"));
        } else {
          window.dispatchEvent(new Event("sf-shoot"));
        }
      }
    };

    const attach = () => {
      window.addEventListener("deviceorientation", onOrient);
      window.addEventListener("devicemotion", onMotion);
      raf = requestAnimationFrame(applyTilt);
    };

    // iOS 13+: sensors are locked behind a user-gesture permission.
    type Permissive = { requestPermission?: () => Promise<string> };
    const motionPerm = (DeviceMotionEvent as unknown as Permissive)
      .requestPermission;
    const askOnce = () => {
      window.removeEventListener("touchend", askOnce);
      Promise.all([
        motionPerm ? motionPerm.call(DeviceMotionEvent) : "granted",
        (DeviceOrientationEvent as unknown as Permissive).requestPermission
          ? (
              DeviceOrientationEvent as unknown as Permissive
            ).requestPermission!.call(DeviceOrientationEvent)
          : "granted",
      ])
        .then((results) => {
          if (results.some((r) => r === "granted")) attach();
        })
        .catch(() => {});
    };

    if (typeof motionPerm === "function") {
      window.addEventListener("touchend", askOnce, { once: true });
    } else {
      attach();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("touchend", askOnce);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("devicemotion", onMotion);
      root.style.removeProperty("--tilt-x");
      root.style.removeProperty("--tilt-y");
    };
  }, []);

  return null;
}
