"use client";

import { useEffect } from "react";

// Shake-to-shooting-star, phones only: one shake fires a meteor
// ("sf-shoot"), a second shake within three seconds calls a shower
// ("sf-shower"), both handled by ShootingStar. Detection counts two
// acceleration spikes inside 600ms so a real shake registers but a
// bump or a set-down does not. iOS requires a user-gesture permission
// request for motion data; we ask once on the first touch and stay
// quiet if declined.
export default function MotionMagic() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let spikes: number[] = [];
    let lastTrigger = 0;
    let prevTrigger = 0;

    const onMotion = (e: DeviceMotionEvent) => {
      // Prefer gravity-free acceleration; fall back to the deviation
      // of the gravity-inclusive magnitude from rest.
      let mag: number;
      const a = e.acceleration;
      if (a && a.x != null && a.y != null && a.z != null) {
        mag = Math.hypot(a.x, a.y, a.z);
      } else {
        const g = e.accelerationIncludingGravity;
        if (!g || g.x == null || g.y == null || g.z == null) return;
        mag = Math.abs(Math.hypot(g.x, g.y, g.z) - 9.81);
      }
      if (mag < 11) return;
      const now = performance.now();
      spikes.push(now);
      spikes = spikes.filter((t) => now - t < 600);
      if (spikes.length >= 2 && now - lastTrigger > 1200) {
        spikes = [];
        prevTrigger = lastTrigger;
        lastTrigger = now;
        window.dispatchEvent(
          new Event(now - prevTrigger < 3000 ? "sf-shower" : "sf-shoot"),
        );
      }
    };

    const attach = () => window.addEventListener("devicemotion", onMotion);

    // iOS 13+: the sensor is locked behind a user-gesture permission.
    type Permissive = { requestPermission?: () => Promise<string> };
    const perm = (DeviceMotionEvent as unknown as Permissive)
      .requestPermission;
    const askOnce = () => {
      window.removeEventListener("touchend", askOnce);
      perm!
        .call(DeviceMotionEvent)
        .then((r) => {
          if (r === "granted") attach();
        })
        .catch(() => {});
    };

    if (typeof perm === "function") {
      window.addEventListener("touchend", askOnce, { once: true });
    } else {
      attach();
    }

    return () => {
      window.removeEventListener("touchend", askOnce);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, []);

  return null;
}
