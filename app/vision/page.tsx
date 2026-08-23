import type { Metadata } from "next";
import Image from "next/image";
import { linkCategory3 } from "@/components/Category3Link";
import Cta from "@/components/Cta";
import DigitalSky from "@/components/DigitalSky";
import VisionClaimStrip from "@/components/VisionClaimStrip";
import NicheCycler from "@/components/NicheCycler";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { VISION } from "@/content/vision";
import { GIVING_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "The Vision",
  description: VISION.dream.body,
};

export default function VisionPage() {
  return (
    <article>
      {/* Analog hero */}
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-greenpurple-star.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night"
        />
        <Grain />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-44 sm:px-8">
          <Kicker>{VISION.hero.kicker}</Kicker>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold sm:text-6xl">
            {VISION.hero.heading}
          </h1>
          <NicheCycler />
        </div>
        {/* The claiming of the feed: ghost cards igniting one way,
            mission fields and fruit drifting the other */}
        <VisionClaimStrip />
      </header>

      {/* The problem: life moved online, and lostness moved with it */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[55vh]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 60% at 10% 0%, rgb(109 40 217 / 0.24), transparent 68%), radial-gradient(ellipse 80% 65% at 78% 0%, rgb(34 197 94 / 0.3), transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-16">
          <Reveal className="max-w-3xl">
            <Kicker>{VISION.problem.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={VISION.problem.heading} />
            </h2>
            <div className="mt-8 space-y-6">
              {VISION.problem.paragraphs.map((para) => (
                <p
                  key={para}
                  className="text-lg leading-relaxed text-starlight/85"
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          {/* the numbers behind the problem, desktop only */}
          <Reveal className="hidden md:block">
            <div className="space-y-10 border-l border-dust/15 pl-10">
              <div>
                <p className="vhs-glow font-display text-6xl font-bold text-ember">
                  2h 21m
                </p>
                <p className="mt-3 text-sm leading-relaxed text-starlight/80">
                  on social media every single day, the global average. Kept up
                  for life, that adds up to roughly six years inside the feed.
                </p>
                <a
                  href="https://datareportal.com/reports/digital-2026-global-overview-report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-label mt-2 inline-block text-dust transition-colors hover:text-ember"
                >
                  DataReportal ↗
                </a>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                    <span
                      key={d}
                      aria-hidden="true"
                      className={`h-3 w-3 rotate-45 ${
                        d === 6
                          ? "bg-ember shadow-[0_0_12px_rgb(109_40_217/0.9)]"
                          : "border border-dust/40"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-starlight/80">
                  18h 36m every week. More than one full waking day out of
                  every seven, spent scrolling.
                </p>
              </div>
              <div>
                <p className="vhs-glow font-display text-6xl font-bold text-ember">
                  4.8h
                </p>
                <p className="mt-3 text-sm leading-relaxed text-starlight/80">
                  a day on social media for the average US teen. For teen
                  girls it is 5.3.
                </p>
                <a
                  href="https://news.gallup.com/poll/512576/teens-spend-average-hours-social-media-per-day.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-label mt-2 inline-block text-dust transition-colors hover:text-ember"
                >
                  Gallup ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* A missionary to a niche */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-4 sm:px-8">
          <Reveal className="max-w-3xl md:grid md:max-w-none md:grid-cols-2 md:items-center md:gap-16">
            <div className="md:order-2">
            <Kicker>{VISION.missionary.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={VISION.missionary.heading} />
            </h2>
            <p className="mt-8 text-lg font-bold leading-relaxed text-starlight">
              {VISION.missionary.lead}
            </p>
            <div className="mt-6 space-y-6">
              {VISION.missionary.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85">
                  {linkCategory3(p)}
                </p>
              ))}
            </div>
            </div>
            <div className="mt-12 max-w-3xl md:order-1 md:mt-0 md:translate-y-8">
            <div className="grid grid-cols-2 gap-6 border-b border-dust/20 pb-4">
              <p className="meta-label">{VISION.parallel.thenLabel}</p>
              <p className="meta-label text-ember">{VISION.parallel.nowLabel}</p>
            </div>
            {VISION.parallel.pairs.map((pair) => (
              <Reveal
                key={pair.then}
                className="grid grid-cols-2 items-start gap-6 border-b border-dust/15 py-6"
              >
                <div>
                  <p className="text-lg text-starlight/70">{pair.then}</p>
                  <p className="meta-label mt-1.5 text-dust">Ex: {pair.thenEx}</p>
                </div>
                <div>
                  <p className="flex items-center gap-3 text-lg text-starlight">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="shrink-0 text-ember"
                    >
                      <path
                        fill="currentColor"
                        d="M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z"
                      />
                    </svg>
                    {pair.now}
                  </p>
                  <p className="meta-label mt-1.5 pl-6 text-ember/80">
                    Ex: {pair.nowEx}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* The two programs */}
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-6 sm:px-8 sm:py-24 md:grid md:grid-cols-[2fr_3fr] md:items-center md:gap-16">
        <Reveal className="max-w-3xl md:order-1">
          <Kicker>{VISION.programs.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text={VISION.programs.heading} />
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-starlight/85">
            {linkCategory3(VISION.programs.body)}
          </p>
        </Reveal>
        <div className="mt-12 grid max-w-3xl gap-6 sm:grid-cols-2 md:order-2 md:mt-0">
          {VISION.programs.items.map((item) => (
            <Reveal key={item.href}>
              <Link
                href={item.href}
                className="star-border group block h-full rounded-xl border border-dust/20 bg-night/50 p-7 transition-colors hover:border-ember/60"
              >
                <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-ember">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                  {item.line}
                </p>
                <p className="mono-link mt-6 text-sm font-bold text-ember">
                  Explore →
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The ten year dream, drawn in light */}
      <section className="relative overflow-hidden border-t border-dust/10">
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pt-24 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>{VISION.dream.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={VISION.dream.heading} />
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-starlight/85">
              {VISION.dream.body}
            </p>
          </Reveal>
        </div>
        <div id="digital-sky" className="relative mt-10">
          <DigitalSky />
          <p className="meta-label pb-10 text-center text-dust">
            {VISION.dream.skyCaption}
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-dust/10 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <Image
              src="/brand/star-sharp.png"
              alt=""
              width={44}
              height={44}
              className="vhs-glow mx-auto"
            />
            <p className="meta-label mt-8 text-ember">{VISION.closing.kicker}</p>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
              {VISION.closing.heading}
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {VISION.closing.ctas.map((cta, i) => (
                <Cta key={cta.href} href={cta.href} variant={i ? "ghost" : undefined}>
                  {cta.label}
                </Cta>
              ))}
              {GIVING_URL ? (
                <Cta href={GIVING_URL} variant="ghost">
                  {VISION.closing.giveCta}
                </Cta>
              ) : null}
            </div>
            <p className="mx-auto mt-6 max-w-xl text-sm text-starlight/60">
              {VISION.closing.giveLine}
            </p>
            <Link
              href="/story"
              className="meta-label mt-10 inline-block text-dust transition-colors hover:text-ember"
            >
              The story behind Stars Forever →
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
