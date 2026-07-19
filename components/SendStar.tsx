"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Send a star: mint a personal link to the Constellation. When a
// friend opens it, a star bearing the sender's name falls out of the
// sky into the map before the page settles, then invites them to add
// their own. Growth loop disguised as a gift.
export default function SendStar() {
  const params = useSearchParams();
  const from = (params.get("star") ?? "")
    .replace(/[^\p{L}\p{N} .'-]/gu, "")
    .slice(0, 30)
    .trim();

  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (from) setFalling(true);
  }, [from]);

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
    <>
      {/* The arriving star, when someone follows a sent link */}
      {from && falling ? (
        <div
          aria-hidden="true"
          className="sent-star pointer-events-none fixed left-1/2 top-0 z-[90]"
          onAnimationEnd={() => setFalling(false)}
        >
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={56}
            height={56}
            className="vhs-glow mx-auto"
          />
          <p className="meta-label mt-3 whitespace-nowrap text-center text-starlight">
            {from}&apos;s star
          </p>
        </div>
      ) : null}
      {from ? (
        <p className="mt-6 text-center font-display text-lg text-starlight/90">
          <span className="text-ember">{from}</span> sent you a star. Put
          yours on the map below.
        </p>
      ) : null}

      {/* Mint your own link */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
          {copied ? "Link copied ✓" : "Send a star to a friend"}
        </button>
      </div>
      <p className="meta-label mt-3 text-center text-dust/60">
        Your link drops a star with your name into their sky.
      </p>
    </>
  );
}
