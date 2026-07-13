"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONTACT } from "@/content/site";

// The Partner Project application: three short steps, then submit.
// Sends through the API when mail is configured; otherwise opens a
// prefilled email so nothing is ever lost.

const STEPS = ["Who you are", "Your platform", "Your God dream"] as const;

const field =
  "w-full rounded-md border border-dust/30 bg-soot/60 px-4 py-3 text-starlight placeholder:text-dust/60 focus:border-ember focus:outline-none";
const label = "meta-label mb-2 block";

export default function ApplyForm() {
  const [step, setStep] = useState(0);
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

  const canNext =
    step === 0
      ? form.name.trim().length > 1 && form.email.includes("@")
      : step === 1
        ? form.platform.trim().length > 1
        : form.dream.trim().length > 10;

  const submit = async () => {
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
    <div className="rounded-lg border border-dust/25 bg-night/60 p-7 sm:p-10">
      {/* Step markers */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`meta-label ${
              i === step ? "text-ember" : i < step ? "text-starlight/70" : ""
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-6">
        {step === 0 ? (
          <>
            <div>
              <label htmlFor="apply-name" className={label}>
                Your name
              </label>
              <input
                id="apply-name"
                type="text"
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
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div>
              <label htmlFor="apply-platform" className={label}>
                Where do you create? Links to your channels
              </label>
              <input
                id="apply-platform"
                type="text"
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
              <input
                id="apply-audience"
                type="text"
                placeholder="Size and kind of audience, in your own words"
                className={field}
                value={form.audience}
                onChange={set("audience")}
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <div>
            <label htmlFor="apply-dream" className={label}>
              Your most audacious God dream
            </label>
            <textarea
              id="apply-dream"
              rows={7}
              placeholder="The project you would make if money and fear were not factors."
              className={field}
              value={form.dream}
              onChange={set("dream")}
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mono-link text-xs"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext || status === "sending"}
            onClick={submit}
            className="bg-ember px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-night transition-colors hover:bg-starlight disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "sending" ? "Sending…" : "Submit application"}
          </button>
        )}
      </div>
    </div>
  );
}
