"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// The opening picture above the application: a small star arrives
// carrying "Your Dreams", a bigger star arrives carrying "God's
// Dreams", the big star swallows the small one, and the merged star
// settles massive and glowing, pointing down toward the form. Pure
// CSS choreography that waits to play until scrolled into view.
export default function DreamStars() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // hold the choreography until the stage itself has been scrolled
    // to the middle of the screen
    const check = () => {
      const el = ref.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      if (r.top + r.height / 2 <= window.innerHeight * 0.55) {
        setPlay(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const onScroll = () => {
      if (check()) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`dream-stage${play ? " dream-play" : ""}`}
    >
      <div className="dream-small">
        <Image src="/brand/star-sharp.png" alt="" width={44} height={44} />
        <span className="dream-label">Your Dreams</span>
      </div>
      <span className="dream-flash" />
      <div className="dream-big">
        <Image src="/brand/star-sharp.png" alt="" width={176} height={176} />
        <span className="dream-label dream-label-big">God&apos;s Dreams</span>
      </div>
      <span className="dream-arrow">↓</span>
    </div>
  );
}
