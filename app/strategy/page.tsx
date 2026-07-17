import type { Metadata } from "next";
import Link from "next/link";
import Grain from "@/components/Grain";
import Reveal from "@/components/Reveal";
import { STRATEGY } from "@/content/strategy";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "YouTube Strategy Consulting",
  description:
    "Auzi Films helps creators find the ideas worth making and package them so they get watched. Content Strategist for Aprilynne Alter's 90 Day Breakthrough.",
};

// This page is its own product: same night sky, different signal.
// Red accent, control room energy, no constellations.
const RED = "text-[#ff4554]";
const RED_BORDER = "border-[#ff4554]/50";

function StratLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`font-meta text-[0.6875rem] font-bold uppercase tracking-[0.2em] ${RED}`}
    >
      ● {children}
    </p>
  );
}

export default function StrategyPage() {
  return (
    <article className="bg-[#0a0507]">
      {/* Hero: a strategy desk, not a night sky */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(255_69_84/0.16),transparent_55%)]"
        />
        <Grain />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-44 sm:px-8">
          <StratLabel>{STRATEGY.kicker}</StratLabel>
          <h1 className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
            {STRATEGY.heading}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-starlight/80">
            {STRATEGY.intro}
          </p>
          <ul className="mt-10 space-y-2">
            {STRATEGY.credibility.map((line) => {
              const name = "Aprilynne Alter's";
              const idx = line.indexOf(name);
              return (
                <li
                  key={line}
                  className="font-meta text-xs uppercase tracking-[0.14em] text-starlight/70"
                >
                  <span className={RED}>▸</span>{" "}
                  {idx === -1 ? (
                    line
                  ) : (
                    <>
                      {line.slice(0, idx)}
                      <a
                        href="https://www.youtube.com/@AprilynneAlter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${RED} transition-colors hover:text-starlight`}
                      >
                        {name}
                      </a>
                      {line.slice(idx + name.length)}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href={CONTACT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ff4554] px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-[#0a0507] transition-colors hover:bg-starlight"
            >
              {STRATEGY.ctas.book}
            </a>
            <a
              href={`mailto:${CONTACT.primaryEmail}`}
              className={`border ${RED_BORDER} px-7 py-3.5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-starlight transition-colors hover:bg-[#ff4554] hover:text-[#0a0507]`}
            >
              {STRATEGY.ctas.email}
            </a>
          </div>
        </div>
      </header>

      {/* Selected work */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <StratLabel>{STRATEGY.work.kicker}</StratLabel>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {STRATEGY.work.heading}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
          {STRATEGY.work.items.map((item, i) => {
            const inner = (
              <div className="flex h-full flex-col bg-[#0a0507] p-8 transition-colors hover:bg-[#140a0d]">
                <p className="font-meta text-[0.65rem] font-bold uppercase tracking-[0.2em] text-starlight/50">
                  {String(i + 1).padStart(2, "0")} ·{" "}
                  <span className={RED}>{item.role}</span>
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold">
                  {item.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-starlight/70">
                  {item.body}
                </p>
                {"links" in item && item.links ? (
                  <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                    {item.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-meta text-[0.65rem] font-bold uppercase tracking-[0.2em] ${RED} transition-colors hover:text-starlight`}
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </p>
                ) : null}
              </div>
            );
            if (!item.href) return <div key={item.name}>{inner}</div>;
            return item.href.startsWith("/") ? (
              <Link key={item.name} href={item.href} className="block">
                {inner}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      {/* The systems */}
      <section className="border-y border-white/10 bg-[#0d0709]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <StratLabel>{STRATEGY.systems.kicker}</StratLabel>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              {STRATEGY.systems.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
            {STRATEGY.systems.items.map((item) => (
              <Reveal key={item.title}>
                <div className={`border-t ${RED_BORDER} pt-6`}>
                  <h3 className="font-display text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Video testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <StratLabel>{STRATEGY.videos.kicker}</StratLabel>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {STRATEGY.videos.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STRATEGY.videos.items.map((v) => (
            <Reveal key={v.src}>
              <figure>
                <video
                  controls
                  preload="metadata"
                  playsInline
                  poster={v.poster}
                  className="block w-full rounded-lg border border-white/10"
                >
                  <source src={v.src} type="video/mp4" />
                </video>
                <figcaption className="mt-3 font-meta text-[0.65rem] font-bold uppercase tracking-[0.2em] text-starlight/50">
                  <a
                    href={v.channel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-starlight/80 transition-colors hover:text-starlight"
                  >
                    {v.name} ↗
                  </a>{" "}
                  ·{" "}
                  {"roleHref" in v && v.roleHref ? (
                    <a
                      href={v.roleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${RED} transition-colors hover:text-starlight`}
                    >
                      {v.role} ↗
                    </a>
                  ) : (
                    <span className={RED}>{v.role}</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quotes */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <StratLabel>{STRATEGY.quotes.kicker}</StratLabel>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {STRATEGY.quotes.items.map((q) => (
            <Reveal key={q.text}>
              <figure className="h-full rounded-lg border border-white/10 bg-[#0d0709] p-7">
                <blockquote className="font-display text-lg font-bold leading-snug">
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-4 font-meta text-[0.65rem] font-bold uppercase tracking-[0.2em] text-starlight/50">
                  {q.name} · <span className={RED}>{q.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="border-t border-white/10 bg-[#0d0709]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <StratLabel>{STRATEGY.offers.kicker}</StratLabel>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              {STRATEGY.offers.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {STRATEGY.offers.items.map((offer) => {
              const featured = "featured" in offer && offer.featured;
              return (
              <Reveal key={offer.title}>
                <div
                  className={`flex h-full flex-col rounded-lg border bg-[#0a0507] p-8 ${
                    featured
                      ? "border-[#f5c542]/70 shadow-[0_0_28px_rgb(245_197_66/0.25),inset_0_0_18px_rgb(245_197_66/0.06)]"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold">
                      {offer.title}
                    </h3>
                    <p
                      className={`text-right font-meta text-xs font-bold uppercase tracking-[0.14em] ${
                        featured ? "text-[#f5c542]" : RED
                      }`}
                    >
                      {offer.price}
                    </p>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-starlight/70">
                    {offer.body}
                  </p>
                  <p className="mt-6">
                    <a
                      href={
                        offer.title === "Strategy Call"
                          ? CONTACT.bookingUrl
                          : `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(
                              `YouTube Strategy: ${offer.title}`,
                            )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-meta text-xs font-bold uppercase tracking-[0.14em] ${RED} transition-colors hover:text-starlight`}
                    >
                      {offer.cta} →
                    </a>
                    {"ctaNote" in offer && offer.ctaNote ? (
                      <span className="ml-5 font-meta text-xs font-bold uppercase tracking-[0.14em] text-[#f5c542]">
                        {offer.ctaNote}
                      </span>
                    ) : null}
                  </p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

    </article>
  );
}
