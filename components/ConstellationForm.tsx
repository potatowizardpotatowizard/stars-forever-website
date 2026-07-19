"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT, WHATSAPP_INVITE } from "@/content/site";

// Join the Constellation. Sends through the API when mail is configured;
// otherwise opens a prefilled email so no request is lost.

const field =
  "w-full rounded-md border border-dust/30 bg-soot/60 px-4 py-3 text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none";
const label = "meta-label mb-2 block";

export default function ConstellationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    handle: "",
    city: "",
    country: "",
    note: "",
    website: "", // honeypot
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit =
    form.name.trim().length > 1 &&
    form.email.includes("@") &&
    form.city.trim().length > 1 &&
    consent;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/constellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent: consent ? "yes" : "no" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      track("constellation_request");
      // The request lands in Notion; email is a bonus. Only if BOTH
      // channels failed does the visitor's own mail app step in so no
      // request is ever lost.
      if (!data.sent && !data.stored) {
        window.location.href = `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(
          `Constellation request: ${form.name}`,
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
        <p className="font-display text-2xl font-bold">Request received.</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-starlight/75">
          Every request is personally reviewed before your star goes on the
          map. In the meantime, come say hello:
        </p>
        <a
          href={WHATSAPP_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_invite_click")}
          className="mt-6 inline-block bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight"
        >
          Join the WhatsApp Community →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-2xl rounded-lg border border-dust/25 bg-night/50 p-6 text-left sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cn-name" className={label}>
            Your name
          </label>
          <input
            id="cn-name"
            type="text"
            required
            autoComplete="name"
            className={field}
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div>
          <label htmlFor="cn-email" className={label}>
            Email
          </label>
          <input
            id="cn-email"
            type="email"
            required
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cn-handle" className={label}>
            Your main channel or handle
          </label>
          <input
            id="cn-handle"
            type="text"
            placeholder="youtube.com/@you or @instagram"
            className={field}
            value={form.handle}
            onChange={set("handle")}
          />
        </div>
        <div>
          <label htmlFor="cn-city" className={label}>
            City
          </label>
          <input
            id="cn-city"
            type="text"
            required
            placeholder="Where your star belongs"
            className={field}
            value={form.city}
            onChange={set("city")}
          />
        </div>
        <div>
          <label htmlFor="cn-country" className={label}>
            Country
          </label>
          <input
            id="cn-country"
            type="text"
            className={field}
            value={form.country}
            onChange={set("country")}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cn-note" className={label}>
            Why do you resonate with the vision?
          </label>
          <textarea
            id="cn-note"
            rows={3}
            className={field}
            value={form.note}
            onChange={set("note")}
          />
        </div>
        {/* Honeypot, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="cn-website">Website</label>
          <input
            id="cn-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set("website")}
          />
        </div>
      </div>
      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-starlight/80">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#a78bfa]"
        />
        <span>
          I consent to appearing on the public Constellation map with my name,
          my city, and a link to my public channel. Nothing else is shown, and
          I can ask to be removed at any time.
        </span>
      </label>
      {error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="mt-7 w-full bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Request to Join"}
      </button>
    </form>
  );
}
