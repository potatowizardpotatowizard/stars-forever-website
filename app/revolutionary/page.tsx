import type { Metadata } from "next";
import ConstellationWhisper from "@/components/ConstellationWhisper";
import { linkCategory3 } from "@/components/Category3Link";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import FocusMonologue from "@/components/FocusMonologue";
import GrowVideo from "@/components/GrowVideo";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import VideoBlock from "@/components/VideoBlock";
import WaitlistForm from "@/components/WaitlistForm";
import { REVOLUTIONARY } from "@/content/revolutionary";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Revolutionary Cohort",
  description: REVOLUTIONARY.definition,
  openGraph: { images: [{ url: "/brand/og-revolutionary.jpg", width: 1200, height: 630 }] },
};

export default function RevolutionaryPage() {
  return (
    <article>
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-green.jpg"
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
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-44 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl">
          {REVOLUTIONARY.title}
        </h1>
        <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
          {REVOLUTIONARY.definition}
        </p>
        {/* Attribution, near the top as required. Steiger is the link
            itself. */}
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-dust">
          {(() => {
            const name = "Steiger";
            const body = REVOLUTIONARY.attribution.body;
            const idx = body.indexOf(name);
            if (idx === -1) return body;
            return (
              <>
                {body.slice(0, idx)}
                <a
                  href={REVOLUTIONARY.attribution.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember transition-colors hover:text-starlight"
                >
                  {name}
                </a>
                {body.slice(idx + name.length)}
              </>
            );
          })()}
        </p>
        {/* Featured: the most recent cohort, closing out the hero */}
        <Reveal className="mt-16">
          <Link
            href={REVOLUTIONARY.featured.href}
            className="star-border group grid items-center gap-8 rounded-xl border border-dust/20 bg-night/60 p-6 backdrop-blur-sm transition-colors hover:border-ember/60 sm:p-8 md:grid-cols-[2fr_3fr]"
          >
            <MediaSlot
              name={REVOLUTIONARY.featured.imageSlot}
              sizes="(min-width: 768px) 40vw, 100vw"
              showCaption={false}
              className="overflow-hidden rounded-lg"
            />
            <div>
              <Kicker>{REVOLUTIONARY.featured.kicker}</Kicker>
              <p className="mt-5 font-display text-lg font-bold leading-snug sm:text-xl">
                {REVOLUTIONARY.featured.body}
              </p>
              <p className="mono-link mt-7 text-sm font-bold text-ember">
                {REVOLUTIONARY.featured.cta} →
              </p>
            </div>
          </Link>
        </Reveal>
        </div>
      </header>

      {/* Two minute explainer, under the hero's green afterglow */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[45vh] bg-[linear-gradient(to_bottom,rgb(22_101_52/0.35),rgb(22_101_52/0.12)_45%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        <Reveal className="max-w-3xl md:hidden">
          <Kicker>Press play</Kicker>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            <GlitchText text="Revolutionary Cohort" />
          </h2>
        </Reveal>
        <GrowVideo
          src="/brand/video/revolutionary-cohort-explainer.mp4"
          poster="/brand/poster-revolutionary-cohort-explainer.jpg"
          title="explained in two minutes"
          className="mt-10"
        />
        </div>
      </section>

      {/* Ben Pierce intro block */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Reveal className="grid max-w-4xl gap-8 border border-dust/20 bg-soot/40 p-8 sm:grid-cols-[14rem_1fr] sm:p-10">
          <MediaSlot
            name={REVOLUTIONARY.benPierce.imageSlot}
            sizes="14rem"
            showCaption={false}
          />
          <div>
            <h2 className="font-display text-3xl">
              {REVOLUTIONARY.benPierce.name}
            </h2>
            <p className="mt-4 leading-relaxed text-starlight/75">
              {REVOLUTIONARY.benPierce.body}
            </p>
          </div>
        </Reveal>
      </section>

      {/* The monologue: narrative spine of the page */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="hidden md:block">
          <FocusMonologue
            kicker={REVOLUTIONARY.monologue.kicker}
            lines={REVOLUTIONARY.monologue.linesShort}
          />
        </div>
        <Reveal className="mx-auto max-w-2xl md:hidden">
          <Kicker>{REVOLUTIONARY.monologue.kicker}</Kicker>
          <div className="mt-10 space-y-8">
            {REVOLUTIONARY.monologue.lines.map((line, i) => (
              <p
                key={line}
                className={
                  i >= REVOLUTIONARY.monologue.lines.length - 3
                    ? "font-display text-2xl leading-snug text-ember sm:text-3xl"
                    : "font-display text-2xl leading-snug text-starlight/90 sm:text-3xl"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What to expect */}
      <section className="border-y border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <Kicker>{REVOLUTIONARY.expect.kicker}</Kicker>
          </Reveal>
          <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
            {REVOLUTIONARY.expect.items.map((item) => (
              <Reveal key={item.title}>
                <div className="border-t border-dust/20 pt-6">
                  <h2 className="font-display text-xl">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                    {linkCategory3(item.body)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photo essay strip from Joshua Tree */}
      <section
        aria-label="Photos from Joshua Tree"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REVOLUTIONARY.strip.map((slot) => (
            <Reveal key={slot}>
              <MediaSlot name={slot} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Cta href="/partner-projects/revolutionary-cohort" variant="ghost">
            Check Out Past Cohorts
          </Cta>
        </Reveal>
      </section>

      {/* How to attend + CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-32 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker>{REVOLUTIONARY.attend.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl">
            <GlitchText text={REVOLUTIONARY.attend.heading} />
          </h2>
          <p className="mt-6 leading-relaxed text-starlight/75">
            {REVOLUTIONARY.attend.body}
          </p>
          <div className="mt-10">
            <Cta href={CONTACT.bookingUrl}>{REVOLUTIONARY.cta.label}</Cta>
          </div>
          <div className="mt-14">
            <WaitlistForm />
          </div>
          <Link
            href="/story"
            className="meta-label mt-12 inline-block text-dust transition-colors hover:text-ember"
          >
            The story behind Stars Forever →
          </Link>
          <ConstellationWhisper className="mt-16" />
        </Reveal>
      </section>
    </article>
  );
}
