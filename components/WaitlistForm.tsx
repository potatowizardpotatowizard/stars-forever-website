"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT } from "@/content/site";

// Revolutionary Cohort 2 waitlist. Sends through the API when mail is
// configured; otherwise opens a prefilled email so no signup is lost.

const field =
  "w-full rounded-md border border-dust/30 bg-soot/60 px-4 py-3 text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none";

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    handle: "",
    website: "", // honeypot
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      track("waitlist_signup");
      if (!data.sent) {
        window.location.href = `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(
          `Cohort 2 waitlist: ${form.name}`,
        )}&body=${encodeURIComponent(data.body)}`;
      }
      setStatus("done");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-lg border border-ember/40 bg-soot/50 p-8 text-center">
        <p className="font-display text-2xl font-bold">You are on the list.</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-starlight/75">
          When Cohort 2 starts forming, you will be one of the first to hear
          about it.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-md rounded-lg border border-dust/25 bg-night/50 p-6 text-left sm:p-8"
    >
      <p className="meta-label text-ember">Cohort 2 waitlist</p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="wl-name" className="meta-label mb-2 block">
            Your name
          </label>
          <input
            id="wl-name"
            type="text"
            required
            autoComplete="name"
            className={field}
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div>
          <label htmlFor="wl-email" className="meta-label mb-2 block">
            Email
          </label>
          <input
            id="wl-email"
            type="email"
            required
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <label htmlFor="wl-handle" className="meta-label mb-2 block">
            Your main channel or handle
          </label>
          <input
            id="wl-handle"
            type="text"
            placeholder="youtube.com/@you or @instagram"
            className={field}
            value={form.handle}
            onChange={set("handle")}
          />
        </div>
        {/* Honeypot, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="wl-website">Website</label>
          <input
            id="wl-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set("website")}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:opacity-50"
      >
        {status === "sending" ? "Joining…" : "Join the Cohort 2 Waitlist"}
      </button>
    </form>
  );
}
