"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// First visit to Category 3 Explained: the page flips through three VHS
// channels — church content, secular content — and lands on the star.
// The framework, taught in 2.4 seconds. Once per session; skipped
// entirely under reduced motion.
export default function Category3Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("sf-c3-intro")) return;
    sessionStorage.setItem("sf-c3-intro", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="c3-intro fixed inset-0 z-[110]">
      <div className="grain-layer !opacity-30" />
      <div className="c3-frame c3-frame-1">
        <p className="c3-ch">CH·01</p>
        <p className="c3-label">CHURCH FOCUSED</p>
      </div>
      <div className="c3-frame c3-frame-2">
        <p className="c3-ch">CH·02</p>
        <p className="c3-label">SECULAR FACING</p>
      </div>
      <div className="c3-frame c3-frame-3">
        <Image
          src="/brand/star-sharp.png"
          alt=""
          width={72}
          height={72}
          className="vhs-glow mx-auto"
        />
        <p className="c3-label mt-4">CH·03 · CULTURE SHAPING</p>
      </div>
    </div>
  );
}
