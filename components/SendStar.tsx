"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Kicker from "@/components/Kicker";

// Send a star: mint a personal link to the Constellation. Opening a
// sent link takes over the whole screen: the night closes in, the
// star blooms with its sender's name, and then it descends out of
// the takeover into the map itself, landing with a ripple of light.
// Growth loop disguised as a gift. The form uses no URL state, so it
// server-renders and is always visible; only the arrival reads the
// ?star= param behind Suspense. Reduced motion skips to the greeting.
function StarArrival() {
  const params = useSearchParams();
  const from = (params.get("star") ?? "")
    .replace(/[^\p{L}\p{N} .'-]/gu, "")
    .slice(0, 30)
    .trim();
  const [showOverlay, setShowOverlay] = useState(false);
  const [landed, setLanded] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!from) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLanded(true);
      return;
    }
    setShowOverlay(true);
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Beat two: bring the map into view beneath the takeover.
    timers.push(
      setTimeout(() => {
        document
          .getElementById("constellation-map")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 2600),
    );

    // Beat three: the night lifts and the star descends into the map.
    timers.push(
      setTimeout(() => {
        const bg = bgRef.current;
        const star = starRef.current;
        const label = labelRef.current;
        const map = document.getElementById("constellation-map");
        if (bg) {
          bg.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 900,
            fill: "forwards",
          });
        }
        label?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 500,
          fill: "forwards",
        });
        if (star && map) {
          const r = map.getBoundingClientRect();
          const s = star.getBoundingClientRect();
          const dx = r.left + r.width / 2 - (s.left + s.width / 2);
          const dy = r.top + r.height / 2 - (s.top + s.height / 2);
          star.animate(
            [
              { transform: "translate(0,0) scale(1)" },
              {
                transform: `translate(${dx}px, ${dy}px) scale(0.34)`,
                offset: 0.9,
              },
              { transform: `translate(${dx}px, ${dy}px) scale(0.4)` },
            ],
            {
              duration: 1500,
              easing: "cubic-bezier(.45,0,.25,1)",
              fill: "forwards",
            },
          );
          // Landing ripple on the map itself.
          timers.push(
            setTimeout(() => {
              const ring = document.createElement("span");
              ring.style.cssText =
                `position:fixed;left:${r.left + r.width / 2}px;` +
                `top:${r.top + r.height / 2}px;width:12px;height:12px;` +
                "margin:-6px 0 0 -6px;border-radius:50%;" +
                "border:2px solid rgb(196 181 253 / 0.9);" +
                "pointer-events:none;z-index:121;";
              document.body.appendChild(ring);
              ring.animate(
                [
                  { transform: "scale(1)", opacity: 1 },
                  { transform: "scale(9)", opacity: 0 },
                ],
                { duration: 900, easing: "ease-out" },
              ).onfinish = () => ring.remove();
            }, 1350),
          );
        }
      }, 3400),
    );

    // Curtain call.
    timers.push(
      setTimeout(() => {
        setShowOverlay(false);
        setLanded(true);
      }, 5200),
    );
    return () => timers.forEach(clearTimeout);
  }, [from]);

  if (!from) return null;
  return (
    <>
      {showOverlay ? (
        <div className="pointer-events-none fixed inset-0 z-[120]">
          <div ref={bgRef} className="arrival-bg absolute inset-0" />
          <div
            ref={starRef}
            className="absolute left-1/2 top-[40%]"
            style={{ margin: "-55px 0 0 -55px" }}
          >
            <Image
              src="/brand/star-sharp.png"
              alt=""
              width={110}
              height={110}
              className="arrival-star mx-auto"
            />
          </div>
          <div
            ref={labelRef}
            className="absolute inset-x-0 top-[54%] px-6 text-center"
          >
            <p className="arrival-line meta-label text-ember">
              A star has been sent to you
            </p>
            <p
              className="arrival-line mt-4 font-display text-4xl font-bold text-starlight sm:text-5xl"
              style={{ animationDelay: "0.9s" }}
            >
              From {from}
            </p>
          </div>
        </div>
      ) : null}
      {landed && typeof document !== "undefined"
        ? (() => {
            const map = document.getElementById("constellation-map");
            if (!map) return null;
            // The greeting lives on the map itself, resting along its
            // lower edge where the star came down.
            return createPortal(
              <p className="pointer-events-none absolute inset-x-0 bottom-4 z-10 px-6 text-center font-display text-lg text-starlight drop-shadow-[0_1px_8px_rgba(7,5,12,0.9)]">
                <span className="text-ember">{from}</span> sent you a star,
                fill out the form below to be on the map
              </p>,
              map,
            );
          })()
        : null}
    </>
  );
}

export default function SendStar() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const who = name.trim();
    if (!who) return;
    const url = `${window.location.origin}/constellation?star=${encodeURIComponent(who)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy your star link:", url);
    }
  };

  return (
    <div className="mt-16 text-center">
      <Suspense>
        <StarArrival />
      </Suspense>
      <div className="flex justify-center">
        <Kicker>Send a star</Kicker>
      </div>
      <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
        Send a Star to a Friend
      </h2>
      <p className="mx-auto mt-4 max-w-md text-starlight/70">
        Your link sends a secret surprise which encourages them to join the
        constellation map.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <label htmlFor="send-star-name" className="sr-only">
          Your name
        </label>
        <input
          id="send-star-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="Your name"
          className="w-56 rounded-md border border-dust/30 bg-night/70 px-4 py-2.5 text-sm text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none"
        />
        <button
          type="button"
          onClick={copy}
          disabled={!name.trim()}
          className="meta-label rounded-md border border-dust/30 px-5 py-3 text-starlight/90 transition-colors hover:border-ember hover:text-ember disabled:opacity-40"
        >
          {copied ? "Link copied ✓" : "Copy your star link"}
        </button>
      </div>
    </div>
  );
}
