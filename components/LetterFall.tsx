"use client";

import { useEffect } from "react";

// When the supernova detonates ("sf-detonate"), the hero logo blows
// apart and every letter on the hero rains to the bottom of the
// screen. Then a glowing cross appears alone in the dark, and at its
// light the fallen letters rise: each one returns to its place
// burning brighter than before, the glow lingering as the cross
// fades. The mission line does not rise as it was: it is reborn as
// John 11:25. Non-destructive: the real elements are only hidden
// while positioned clones perform the death and the rising.
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

      // A clone span's glyph renders a few pixels off from the
      // measured character rect (line-height metrics differ). Place,
      // measure the real rendering, and self-correct so every clone
      // sits pixel-perfect on its original.
      const place = (span: HTMLElement, left: number, top: number) => {
        span.style.left = `${left}px`;
        span.style.top = `${top}px`;
        const sr = span.getBoundingClientRect();
        span.style.left = `${left + (left - sr.left)}px`;
        span.style.top = `${top + (top - sr.top)}px`;
      };

      const targets = Array.from(
        hero.querySelectorAll<HTMLElement>("a, p:not(.sr-only)"),
      ).filter((el) => el.offsetParent !== null);
      const hidden: HTMLElement[] = [];
      const letters: {
        span: HTMLElement;
        dx: number;
        drop: number;
        rot: number;
        rises: boolean;
      }[] = [];
      let longestFall = 0;

      // The logo escapes the blast as a shooting star, streaking off
      // the top of the screen so nothing stands where the cross is
      // about to appear. It comes home the same way at the end.
      const logo = hero.querySelector<HTMLElement>("nav button");
      let flyOut: Animation | null = null;
      if (logo) {
        const ox = innerWidth * 0.62;
        const oy = -innerHeight * 0.75;
        logo.style.setProperty(
          "--trail-angle",
          `${(Math.atan2(-oy, -ox) * 180) / Math.PI}deg`,
        );
        logo.classList.add("logo-star-trail");
        flyOut = logo.animate(
          [
            { transform: "translate(0,0) scale(1)", filter: "brightness(1)" },
            {
              transform: `translate(${ox * 0.25}px, ${oy * 0.25}px) scale(0.9)`,
              filter: "brightness(2.2)",
              offset: 0.35,
            },
            {
              transform: `translate(${ox}px, ${oy}px) scale(0.45)`,
              filter: "brightness(3)",
            },
          ],
          { duration: 750, easing: "cubic-bezier(.5,0,1,.4)", fill: "forwards" },
        );
        flyOut.onfinish = () => {
          logo.style.visibility = "hidden";
          logo.classList.remove("logo-star-trail");
        };
      }

      // The mission line dies with the rest but does not rise as it
      // was: it comes back as the resurrection promise.
      const missionEl = targets.find((el) => el.matches("p"));

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
              `position:fixed;` +
              `font-family:${cs.fontFamily};font-size:${cs.fontSize};` +
              `font-weight:${cs.fontWeight};font-style:${cs.fontStyle};` +
              `letter-spacing:${cs.letterSpacing};color:${cs.color};` +
              `text-transform:${cs.textTransform};line-height:1;will-change:transform;`;
            overlay.appendChild(span);
            place(span, rect.left, rect.top);

            const drop = innerHeight - rect.bottom - 4 - Math.random() * 30;
            const dx = (Math.random() - 0.5) * 140;
            const rot = (Math.random() - 0.5) * 260;
            const dur = 1000 + Math.random() * 700;
            const delay = Math.random() * 350;
            longestFall = Math.max(longestFall, delay + dur);
            letters.push({ span, dx, drop, rot, rises: el !== missionEl });
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
          const riseGlow = [
            "0 0 0 rgb(196 181 253 / 0)",
            "0 0 18px rgb(255 255 255 / 0.95), 0 0 46px rgb(167 139 250 / 0.8)",
          ];
          for (const l of letters) {
            if (!l.rises) continue; // the mission letters rise reborn below
            const delay = Math.random() * 450;
            const dur = 950 + Math.random() * 500;
            longestRise = Math.max(longestRise, delay + dur);
            // Glow is a static style, not a keyframe: keyframing
            // text-shadow forces the whole flight onto the main
            // thread, where 150 glowing letters stutter and lag.
            // A transform-only animation stays on the GPU.
            l.span.style.textShadow = riseGlow[1];
            l.span.animate(
              [
                {
                  transform: `translate(${l.dx * 1.06}px, ${l.drop}px) rotate(${l.rot * 1.12}deg)`,
                },
                { transform: "translate(0,0) rotate(0deg)" },
              ],
              {
                duration: dur,
                delay,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "both",
              },
            );
          }

          // The mission line is not restored: it is resurrected. Its
          // fallen letters rise from the pile and reassemble as the
          // promise, each glyph transformed mid-flight.
          if (missionEl) {
            const missionLetters = letters.filter((l) => !l.rises);
            const promise =
              "Jesus said “I am the resurrection and the life” -John 11:25";
            missionEl.textContent = promise;
            const textNode = missionEl.firstChild as Text | null;
            const cs = getComputedStyle(missionEl);
            const targets: { ch: string; left: number; top: number }[] = [];
            if (textNode) {
              for (let i = 0; i < promise.length; i++) {
                if (!promise[i].trim()) continue;
                const range = document.createRange();
                range.setStart(textNode, i);
                range.setEnd(textNode, i + 1);
                const r = range.getBoundingClientRect();
                if (r.width) {
                  targets.push({ ch: promise[i], left: r.left, top: r.top });
                }
              }
            }
            // The fallen mission letters dissolve where they lie: the
            // promise is not the old sentence patched up, it is new.
            missionLetters.forEach((l) => {
              l.span.animate(
                [{ opacity: 1 }, { opacity: 0, filter: "blur(3px)" }],
                {
                  duration: 800,
                  delay: Math.random() * 300,
                  fill: "forwards",
                },
              );
            });
            // Fresh letters rise out of the same pile and assemble
            // into the promise. Fresh spans only: no reused elements,
            // no animation history, nothing to fight.
            targets.forEach((tgt) => {
              const span = document.createElement("span");
              span.style.cssText =
                `position:fixed;font-family:${cs.fontFamily};` +
                `font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
                `letter-spacing:${cs.letterSpacing};color:${cs.color};` +
                `text-transform:${cs.textTransform};line-height:1;will-change:transform;`;
              span.textContent = tgt.ch;
              overlay.appendChild(span);
              place(span, tgt.left, tgt.top);
              const fromX =
                innerWidth * (0.2 + Math.random() * 0.6) -
                parseFloat(span.style.left);
              const fromY =
                innerHeight - 20 - Math.random() * 36 -
                parseFloat(span.style.top);
              const rot = (Math.random() - 0.5) * 260;
              const delay = 250 + Math.random() * 500;
              const dur = 1050 + Math.random() * 550;
              longestRise = Math.max(longestRise, delay + dur);
              // Static glow + transform-only animation (GPU), and
              // fill "both" keeps each letter waiting in the pile
              // through its stagger delay instead of teleporting.
              span.style.textShadow = riseGlow[1];
              span.animate(
                [
                  {
                    transform: `translate(${fromX}px, ${fromY}px) rotate(${rot}deg)`,
                  },
                  { transform: "translate(0,0) rotate(0deg)" },
                ],
                {
                  duration: dur,
                  delay,
                  easing: "cubic-bezier(.22,1,.36,1)",
                  fill: "both",
                },
              );
            });
          }

          // Every letter home again: reveal the originals glowing
          // brighter than before, let the glow linger, fade the cross.
          setTimeout(() => {
            // Belt and braces: snap every letter to its final resting
            // state before the reveal, so nothing is ever caught
            // mid-flight when the real text appears beneath.
            overlay.getAnimations({ subtree: true }).forEach((a) => {
              try {
                a.finish();
              } catch {
                a.cancel();
              }
            });
            for (const el of hidden) {
              el.style.visibility = "";
              // The promise keeps its glow for good; everything else
              // burns bright and slowly lets go.
              el.classList.add(
                el === missionEl ? "resurrected-forever" : "resurrected",
              );
            }
            // The cross departs first: only once it is completely
            // gone does the star come home.
            overlay
              .animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 900,
                fill: "forwards",
              })
              .onfinish = () => {
              overlay.remove();
              if (logo) {
                // Home again as a shooting star: in from the far sky,
                // decelerating into its old place, trail dissolving.
                // The outbound animation must be cancelled first or
                // its held end-state yanks the logo back off screen.
                flyOut?.cancel();
                const ix = -innerWidth * 0.55;
                const iy = -innerHeight * 0.7;
                logo.style.visibility = "";
                logo.style.setProperty(
                  "--trail-angle",
                  `${(Math.atan2(iy, ix) * 180) / Math.PI}deg`,
                );
                logo.classList.add("logo-star-trail");
                logo.animate(
                  [
                    {
                      transform: `translate(${ix}px, ${iy}px) scale(0.45)`,
                      filter: "brightness(3)",
                    },
                    {
                      transform: "translate(0,0) scale(1)",
                      filter: "brightness(1.2)",
                    },
                  ],
                  { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" },
                ).onfinish = () => logo.classList.remove("logo-star-trail");
              }
            };
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
