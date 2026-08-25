"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT } from "@/content/site";

// The Partner Project application: all three sections on one page, each
// with real space to answer. Sends through the API when mail is
// configured; otherwise opens a prefilled email so nothing is ever lost.

const STAR_PATH =
  "M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z";

// a section's star: dust outline while empty, igniting white once the
// section is filled in
function SectionStar({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-all duration-500"
      style={on ? { filter: "drop-shadow(0 0 6px rgb(230 225 255 / 0.9))" } : undefined}
    >
      <path
        d={STAR_PATH}
        fill={on ? "#ffffff" : "none"}
        stroke={on ? "#ffffff" : "var(--color-dust)"}
        strokeWidth="1.4"
        opacity={on ? 1 : 0.6}
      />
    </svg>
  );
}

const field =
  "w-full rounded-md border border-dust/30 bg-soot/60 px-4 py-3 text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none";
const label = "meta-label mb-2 block";
const section = "meta-label text-ember";

export default function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    audience: "",
    dream: "",
    website: "", // honeypot
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const done1 = form.name.trim().length > 1 && form.email.includes("@");
  const done2 = form.platform.trim().length > 1;
  const done3 = form.dream.trim().length > 10;
  const canSubmit = done1 && done2 && done3;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/apply", {
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
      track("apply_submitted");
      if (!data.sent) {
        // Mail is not configured yet: hand off to the visitor's mail app,
        // fully prefilled, so the application still arrives.
        const mailto = `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(
          `Partner Project application: ${form.name}`,
        )}&body=${encodeURIComponent(data.body)}`;
        window.location.href = mailto;
      }
      setStatus("done");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-lg border border-ember/40 bg-soot/50 p-10 text-center">
        <p className="font-display text-3xl font-bold">Application received.</p>
        <p className="mx-auto mt-4 max-w-md text-starlight/75">
          We read every one. If it looks like a fit, we will reach out to set
          up a call. Bring the audacious version of the dream.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="apply-glow rounded-lg border bg-night/60 p-7 sm:p-10"
    >
      {/* 01 Who you are */}
      <p className={`${section} flex items-center gap-2.5`}>
        <SectionStar on={done1} />
        01 Who You Are
      </p>
      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="apply-name" className={label}>
            Your name
          </label>
          <input
            id="apply-name"
            type="text"
            required
            autoComplete="name"
            className={field}
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div>
          <label htmlFor="apply-email" className={label}>
            Email
          </label>
          <input
            id="apply-email"
            type="email"
            required
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={set("email")}
          />
        </div>
        {/* Honeypot, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="apply-website">Website</label>
          <input
            id="apply-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set("website")}
          />
        </div>
      </div>

      {/* 02 Your platform */}
      <p className={`${section} mt-12 flex items-center gap-2.5`}>
        <SectionStar on={done2} />
        02 Your Platform
      </p>
      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="apply-platform" className={label}>
            Where do you create? Links to your channels
          </label>
          <input
            id="apply-platform"
            type="text"
            required
            placeholder="youtube.com/@you, instagram.com/you"
            className={field}
            value={form.platform}
            onChange={set("platform")}
          />
        </div>
        <div>
          <label htmlFor="apply-audience" className={label}>
            Who watches you? Optional
          </label>
          <textarea
            id="apply-audience"
            rows={3}
            placeholder="Size and kind of audience, in your own words"
            className={field}
            value={form.audience}
            onChange={set("audience")}
          />
        </div>
      </div>

      {/* 03 Your God dream */}
      <p className={`${section} mt-12 flex items-center gap-2.5`}>
        <SectionStar on={done3} />
        03 Your God Dream
      </p>
      <div className="mt-6">
        <label htmlFor="apply-dream" className={label}>
          Your most audacious God dream
        </label>
        <textarea
          id="apply-dream"
          rows={8}
          required
          placeholder="The project you would make if money and fear were not factors."
          className={field}
          value={form.dream}
          onChange={set("dream")}
        />
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-10">
        <button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className={`w-full bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${canSubmit && status !== "sending" ? "apply-charged" : ""}`}
        >
          {status === "sending" ? "Sending…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
