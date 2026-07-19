"use client";

import { useEffect } from "react";

// When the supernova detonates ("sf-detonate"), every letter on the
// hero loses its grip and rains to the bottom of the screen, piling
// up, then fades as the originals return. Non-destructive: the real
// elements are only hidden while positioned clones do the falling.
export default function LetterFall() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let busy = false;

    const boom = () => {
      if (busy) return;
      const hero = document.getElementById("hero");
      if (!hero) return;
      busy = true;

      const overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden;";
      document.body.appendChild(overlay);

      const targets = Array.from(
        hero.querySelectorAll<HTMLElement>("a, p:not(.sr-only)"),
      ).filter((el) => el.offsetParent !== null);
      const hidden: HTMLElement[] = [];
      let longest = 0;

      for (const el of targets) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (n.textContent?.trim()) nodes.push(n as Text);
        }
        if (!nodes.length) continue;
        hidden.push(el);

        for (const node of nodes) {
          const parent = node.parentElement;
          if (!parent) continue;
          const cs = getComputedStyle(parent);
          const text = node.textContent ?? "";
          for (let i = 0; i < text.length; i++) {
            if (!text[i].trim()) continue;
            const range = document.createRange();
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getBoundingClientRect();
            if (!rect.width || rect.bottom < 0 || rect.top > innerHeight) {
              continue;
            }
            const span = document.createElement("span");
            span.textContent = text[i];
            span.style.cssText =
              `position:fixed;left:${rect.left}px;top:${rect.top}px;` +
              `font-family:${cs.fontFamily};font-size:${cs.fontSize};` +
              `font-weight:${cs.fontWeight};font-style:${cs.fontStyle};` +
              `letter-spacing:${cs.letterSpacing};color:${cs.color};` +
              `text-transform:${cs.textTransform};line-height:1;will-change:transform;`;
            overlay.appendChild(span);

            const drop = innerHeight - rect.bottom - 4 - Math.random() * 30;
            const dx = (Math.random() - 0.5) * 140;
            const rot = (Math.random() - 0.5) * 260;
            const dur = 1000 + Math.random() * 700;
            const delay = Math.random() * 350;
            longest = Math.max(longest, delay + dur);
            span.animate(
              [
                { transform: "translate(0,0) rotate(0deg)", offset: 0 },
                {
                  transform: `translate(${dx}px, ${drop}px) rotate(${rot}deg)`,
                  offset: 0.62,
                  easing: "cubic-bezier(.34,1.35,.64,1)",
                },
                {
                  transform: `translate(${dx * 1.06}px, ${drop}px) rotate(${rot * 1.12}deg)`,
                  offset: 1,
                },
              ],
              {
                duration: dur,
                delay,
                easing: "cubic-bezier(.55,0,1,.45)",
                fill: "forwards",
              },
            );
          }
        }
        el.style.visibility = "hidden";
      }

      // Let the pile sit for a moment, then dissolve it and bring the
      // real words back like nothing ever happened.
      setTimeout(() => {
        overlay
          .animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 600,
            fill: "forwards",
          })
          .onfinish = () => overlay.remove();
        for (const el of hidden) {
          el.style.visibility = "";
          el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
        }
        busy = false;
      }, longest + 1400);
    };

    window.addEventListener("sf-detonate", boom);
    return () => window.removeEventListener("sf-detonate", boom);
  }, []);

  return null;
}
