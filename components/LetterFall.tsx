"use client";

import { useEffect } from "react";

// When the supernova detonates ("sf-detonate"), every letter on the
// hero loses its grip and rains to the bottom of the screen. Then a
// glowing cross appears in the dark, and at its light the fallen
// letters rise: each one returns to its place burning brighter than
// before, the glow lingering as the cross fades. At that moment the
// anchor verse below quietly becomes John 11:25. Non-destructive:
// the real elements are only hidden while positioned clones perform
// the death and the rising.
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
      const letters: { span: HTMLElement; dx: number; drop: number; rot: number }[] =
        [];
      let longestFall = 0;

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
            longestFall = Math.max(longestFall, delay + dur);
            letters.push({ span, dx, drop, rot });
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

      // The letters lie where they fell. Then the cross appears.
      setTimeout(() => {
        const cross = document.createElement("div");
        cross.className = "nova-cross";
        cross.innerHTML =
          '<span class="nova-cross-aura"></span>' +
          '<span class="nova-cross-v"></span>' +
          '<span class="nova-cross-h"></span>';
        overlay.appendChild(cross);

        // At the cross's full light, the resurrection begins.
        setTimeout(() => {
          let longestRise = 0;
          for (const l of letters) {
            const delay = Math.random() * 450;
            const dur = 950 + Math.random() * 500;
            longestRise = Math.max(longestRise, delay + dur);
            l.span.animate(
              [
                {
                  transform: `translate(${l.dx * 1.06}px, ${l.drop}px) rotate(${l.rot * 1.12}deg)`,
                  textShadow: "0 0 0 rgb(196 181 253 / 0)",
                },
                {
                  transform: "translate(0,0) rotate(0deg)",
                  textShadow:
                    "0 0 18px rgb(255 255 255 / 0.95), 0 0 46px rgb(167 139 250 / 0.8)",
                },
              ],
              {
                duration: dur,
                delay,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards",
              },
            );
          }

          // The verse below quietly becomes the resurrection promise.
          const verseP = document.querySelector("blockquote p");
          const verseCite = document.querySelector("blockquote cite");
          if (verseP && verseCite) {
            verseP.textContent =
              "Jesus said “I am the resurrection and the life”";
            verseCite.textContent = "John 11:25";
          }

          // Every letter home again: reveal the originals glowing
          // brighter than before, let the glow linger, fade the cross.
          setTimeout(() => {
            for (const el of hidden) {
              el.style.visibility = "";
              el.classList.add("resurrected");
            }
            overlay
              .animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 900,
                fill: "forwards",
              })
              .onfinish = () => overlay.remove();
            setTimeout(() => {
              for (const el of hidden) el.classList.remove("resurrected");
              busy = false;
            }, 9000);
          }, longestRise + 150);
        }, 1300);
      }, longestFall + 1000);
    };

    window.addEventListener("sf-detonate", boom);
    return () => window.removeEventListener("sf-detonate", boom);
  }, []);

  return null;
}
