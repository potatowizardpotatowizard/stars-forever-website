import type { Metadata } from "next";
import ConstellationWhisper from "@/components/ConstellationWhisper";
import { linkCategory3 } from "@/components/Category3Link";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import MonologueDeck from "@/components/MonologueDeck";
import GrowVideo from "@/components/GrowVideo";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import ScrollSwell from "@/components/ScrollSwell";
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
        <p className="mt-8 hidden max-w-2xl text-sm leading-relaxed text-dust md:block">
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
        <GrowVideo
          src="/brand/video/revolutionary-cohort-explainer.mp4"
          poster="/brand/poster-revolutionary-cohort-explainer.jpg"
          title="explained in two minutes"
          className="mt-10"
        />
        </div>
      </section>

      {/* Ben Pierce intro block, with the door to Steiger beside it */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:flex md:items-stretch md:gap-8">
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
            <p className="mt-4 hidden leading-relaxed text-starlight/75 md:block">
              {REVOLUTIONARY.benPierce.body}
            </p>
            <p className="mt-4 leading-relaxed text-starlight/75 md:hidden">
              Revolutionary is a mission led by Ben Pierce of{" "}
              <a
                href="https://steiger.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ember transition-colors hover:text-starlight"
              >
                Steiger
              </a>
              , a global mission devoted to reaching the secular youth culture
              for Jesus, in collaboration with Stars Forever. He brings the
              Revolutionary teaching principles to every cohort and carries
              decades of experience calling artists into bold faith.
            </p>
          </div>
        </Reveal>

        {/* the Steiger doorway */}
        <a
          href="https://steiger.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hidden w-80 flex-none flex-col justify-end overflow-hidden rounded-xl border border-dust/20 p-8 transition-all duration-300 hover:border-ember/70 hover:shadow-[0_0_28px_rgb(109_40_217/0.35)] md:flex"
        >
          <Image
            src="/brand/bg-green.jpg"
            alt=""
            fill
            sizes="20rem"
            className="object-cover opacity-35 transition-opacity duration-500 group-hover:opacity-50"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent"
          />
          <div className="relative">
            <p className="meta-label text-starlight/70">In collaboration with</p>
            <p className="mt-2 font-display text-3xl font-bold transition-colors group-hover:text-ember md:text-4xl">
              Steiger
            </p>
            <p className="mt-3 text-sm leading-relaxed text-starlight/75">
              A global mission reaching the secular youth culture for Jesus.
            </p>
            <span className="mono-link mt-4 inline-block text-sm font-bold text-ember md:mt-6">
              Check out Steiger ↗
            </span>
          </div>
        </a>
      </section>

      {/* The monologue: narrative spine of the page */}
      <section className="mx-auto max-w-7xl px-5 py-24 max-md:overflow-x-clip sm:px-8 sm:py-32">
        <MonologueDeck
          kicker={REVOLUTIONARY.monologue.kicker}
          cards={REVOLUTIONARY.monologue.cards}
        />
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
                <ScrollSwell>
                  <div className="border-t border-dust/20 pt-6">
                    <h2 className="font-display text-xl">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                      {linkCategory3(item.body)}
                    </p>
                  </div>
                </ScrollSwell>
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

      {/* How to attend + CTA: invite only on the left, the waitlist on
          the right, an arrow bridging the two on desktop */}
      <section className="mx-auto max-w-7xl px-5 pb-32 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center md:grid md:max-w-5xl md:grid-cols-2 md:items-center md:gap-16 md:text-left">
          <div>
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
          <div className="mt-12 flex flex-col items-center gap-1 md:hidden">
            <span className="meta-label text-ember">or fill this out</span>
            <svg
              width="26"
              height="46"
              viewBox="0 0 26 46"
              aria-hidden="true"
              className="text-ember"
            >
              <path
                d="M13 2 C 21 14, 6 26, 13 40 M13 40 l-7 -9 M13 40 l8 -8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-8 hidden items-center gap-4 md:flex">
            <span className="meta-label text-ember">or fill this out</span>
            <svg
              width="150"
              height="24"
              viewBox="0 0 150 24"
              aria-hidden="true"
              className="text-ember"
            >
              <path
                d="M2 18 C 50 4, 95 4, 140 12 M140 12 l-12 -7 M140 12 l-13 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          </div>
          <div className="mt-14 md:mt-0">
            <WaitlistForm />
          </div>
          <div className="md:col-span-2 md:text-center">
          <Link
            href="/story"
            className="meta-label mt-12 inline-block text-dust transition-colors hover:text-ember"
          >
            The story behind Stars Forever →
          </Link>
          <ConstellationWhisper className="mt-16" />
          </div>
        </Reveal>
      </section>
    </article>
  );
}
