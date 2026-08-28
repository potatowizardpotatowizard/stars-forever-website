"use client";

import { useEffect } from "react";

// Hash landings can drift when late layout settles under them; this
// re-snaps the target into view a couple of beats after arrival.
export default function AnchorSnap({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "start" });
    };
    go();
    const t1 = setTimeout(go, 450);
    const t2 = setTimeout(go, 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [id]);
  return null;
}
