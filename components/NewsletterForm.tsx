"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT } from "@/content/site";

// Field notes signup: catches visitors who are moved but not ready to
// apply or give yet.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      track("newsletter_signup");
      if (!data.sent) {
        window.location.href = `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(
          "Add me to mission updates",
        )}&body=${encodeURIComponent(`Please add ${email} to the mission updates list.`)}`;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="meta-label text-ember">You are on the list. Watch the sky.</p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email for mission updates
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-dust/30 bg-soot/60 px-3.5 py-2.5 text-sm text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 bg-ember px-4 py-2.5 font-meta text-[11px] font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:opacity-50"
      >
        {status === "sending" ? "…" : "Join"}
      </button>
      {status === "error" ? (
        <span className="sr-only" role="alert">
          Signup failed, try again
        </span>
      ) : null}
    </form>
  );
}
