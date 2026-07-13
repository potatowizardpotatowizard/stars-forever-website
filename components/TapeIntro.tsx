"use client";

import { useEffect, useState } from "react";

// First visit only: one second of VHS tracking that resolves into the page,
// like a tape locking in. Skipped for return visits and reduced motion.
export default function TapeIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("sf-intro")) return;
    sessionStorage.setItem("sf-intro", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="tape-intro fixed inset-0 z-[110]">
      <div className="tape-band tape-band-1" />
      <div className="tape-band tape-band-2" />
      <div className="tape-band tape-band-3" />
      <p className="tape-osd">PLAY ▶</p>
    </div>
  );
}
