"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT } from "@/content/site";

// Speaking inquiry form. Sends through the API when mail is configured;
// otherwise opens a prefilled email so no inquiry is lost.

const field =
  "w-full rounded-md border border-dust/30 bg-soot/60 px-4 py-3 text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none";
const label = "meta-label mb-2 block";

const FORMATS = ["Talk", "Workshop", "Panel or Q&A", "Other"];

export default function SpeakingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    event: "",
    date: "",
    location: "",
    audience: "",
    format: "",
    message: "",
    website: "", // honeypot
  });

  const set = (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit =
    form.name.trim().length > 1 &&
    form.email.includes("@") &&
    form.event.trim().length > 1;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/speak", {
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
      track("speaking_inquiry");
      if (!data.sent) {
        window.location.href = `mailto:${CONTACT.speakingEmail}?subject=${encodeURIComponent(
          `Speaking inquiry: ${form.event}`,
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
        <p className="font-display text-2xl font-bold">Inquiry received.</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-starlight/75">
          We will get back to you soon to talk through your event.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-2xl rounded-lg border border-dust/25 bg-night/50 p-6 text-left sm:p-8"
    >
      <p className="meta-label text-ember">Speaking Inquiry</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-name" className={label}>
            Your name
          </label>
          <input
            id="sp-name"
            type="text"
            required
            autoComplete="name"
            className={field}
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div>
          <label htmlFor="sp-email" className={label}>
            Email
          </label>
          <input
            id="sp-email"
            type="email"
            required
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <label htmlFor="sp-event" className={label}>
            Church or event
          </label>
          <input
            id="sp-event"
            type="text"
            required
            placeholder="Name of the church, conference, or event"
            className={field}
            value={form.event}
            onChange={set("event")}
          />
        </div>
        <div>
          <label htmlFor="sp-date" className={label}>
            Date or timeframe
          </label>
          <input
            id="sp-date"
            type="text"
            placeholder="October 2026, flexible…"
            className={field}
            value={form.date}
            onChange={set("date")}
          />
        </div>
        <div>
          <label htmlFor="sp-location" className={label}>
            Location
          </label>
          <input
            id="sp-location"
            type="text"
            placeholder="City, state, or online"
            className={field}
            value={form.location}
            onChange={set("location")}
          />
        </div>
        <div>
          <label htmlFor="sp-audience" className={label}>
            Audience
          </label>
          <input
            id="sp-audience"
            type="text"
            placeholder="Who and roughly how many"
            className={field}
            value={form.audience}
            onChange={set("audience")}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="sp-format" className={label}>
            Format
          </label>
          <select
            id="sp-format"
            className={field}
            value={form.format}
            onChange={set("format")}
          >
            <option value="">Choose one…</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="sp-message" className={label}>
            Anything else
          </label>
          <textarea
            id="sp-message"
            rows={4}
            placeholder="What is the moment you are hoping we help create?"
            className={field}
            value={form.message}
            onChange={set("message")}
          />
        </div>
        {/* Honeypot, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="sp-website">Website</label>
          <input
            id="sp-website"
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
        disabled={!canSubmit || status === "sending"}
        className="mt-7 w-full bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send the Inquiry"}
      </button>
    </form>
  );
}
