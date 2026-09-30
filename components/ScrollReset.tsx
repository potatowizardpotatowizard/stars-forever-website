"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Every route change lands at the top of the new page, no matter how
// the navigation happened. Two deliberate exceptions: links aimed at a
// #section scroll to their target, and the browser's back and forward
// buttons keep their remembered position.
export default function ScrollReset() {
  const pathname = usePathname();
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
