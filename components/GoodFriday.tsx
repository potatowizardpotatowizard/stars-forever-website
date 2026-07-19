"use client";

import { useEffect } from "react";

// Unannounced liturgical theming, computed in the visitor's own
// timezone. On Good Friday every star dims to ember red; on Easter
// Sunday the sky comes back brighter than normal. Nobody is told;
// people notice.
function easterSunday(year: number): Date {
  // Meeus/Jones/Butcher Gregorian algorithm.
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar, 4=Apr
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export default function GoodFriday() {
  useEffect(() => {
    const now = new Date();
    const easter = easterSunday(now.getFullYear());
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    const friday = new Date(easter);
    friday.setDate(easter.getDate() - 2);
    if (sameDay(now, friday)) {
      document.documentElement.classList.add("good-friday");
    } else if (sameDay(now, easter)) {
      document.documentElement.classList.add("easter-sunday");
    }
    return () => {
      document.documentElement.classList.remove("good-friday", "easter-sunday");
    };
  }, []);

  return null;
}
