import type { Metadata } from "next";
import ConstellationWhisper from "@/components/ConstellationWhisper";
import { linkCategory3 } from "@/components/Category3Link";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import ProcessConstellation from "@/components/ProcessConstellation";
import ProjectShowcase from "@/components/ProjectShowcase";
import Reveal from "@/components/Reveal";
import VideoBlock from "@/components/VideoBlock";
import { PARTNER } from "@/content/partner";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Partner Projects",
  description: PARTNER.definition,
  openGraph: { images: [{ url: "/brand/og-partner.jpg", width: 1200, height: 630 }] },
};

export default function PartnerProjectsPage() {
  return (
    <article>
      {/* Analog hero band */}
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-purple-meteor.jpg"
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
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Partner Projects
          </h1>
          <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {PARTNER.definition}
          </p>
          {/* Featured: the most recent project, closing out the hero */}
          <Reveal className="mt-16">
            <Link
              href={PARTNER.featured.href}
              className="star-border group grid items-center gap-8 rounded-xl border border-dust/20 bg-night/60 p-6 backdrop-blur-sm transition-colors hover:border-ember/60 sm:p-8 md:grid-cols-[2fr_3fr]"
            >
              <MediaSlot
                name={PARTNER.featured.imageSlot}
                sizes="(min-width: 768px) 40vw, 100vw"
                showCaption={false}
                className="overflow-hidden rounded-lg"
              />
              <div>
                <Kicker>{PARTNER.featured.kicker}</Kicker>
                <p className="mt-5 font-display text-lg font-bold leading-snug sm:text-xl">
                  {PARTNER.featured.body}
                </p>
                <p className="mono-link mt-7 text-sm font-bold text-ember">
                  {PARTNER.featured.cta} →
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </header>

      {/* Two minute explainer, under the hero's purple afterglow */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[45vh] bg-[linear-gradient(to_bottom,rgb(109_40_217/0.3),rgb(109_40_217/0.1)_45%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>Press play</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text="Partner Projects" />
            </h2>
            <VideoBlock
              src="/brand/video/partner-project-explainer.mp4"
              poster="/brand/poster-partner-project-explainer.jpg"
              title="explained in two minutes"
              className="mt-10"
            />
          </Reveal>
          {/* three brand stars climbing toward the top right, pulsing
              in sequence beside the explainer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[51rem] top-[26rem] hidden lg:block"
          >
            {[
              { x: 0, y: 150, size: 20, delay: "0s" },
              { x: 62, y: 76, size: 28, delay: "0.4s" },
              { x: 130, y: 0, size: 38, delay: "0.8s" },
            ].map((star) => (
              <svg
                key={star.delay}
                viewBox="0 0 24 24"
                width={star.size}
                height={star.size}
                className="absolute [animation:star-pulse_2.4s_ease-in-out_infinite] [filter:drop-shadow(0_0_10px_rgb(230_225_255/0.65))]"
                style={{ left: star.x, top: star.y, animationDelay: star.delay }}
              >
                <path
                  fill="var(--color-starlight)"
                  d="M12 0C12.9 6.8 16.2 10.1 24 12C16.2 13.9 12.9 17.2 12 24C11.1 17.2 7.8 13.9 0 12C7.8 10.1 11.1 6.8 12 0Z"
                />
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* Success metrics */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text="What Matters to Us" />
          </h2>
          <div className="mt-6">
            <Kicker>{PARTNER.metrics.kicker}</Kicker>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PARTNER.metrics.items.map((m) => (
            <Reveal key={m.title}>
              <div className="h-full rounded-lg border border-dust/20 bg-soot/40 p-8">
                <h2 className="meta-label text-ember">{m.title}</h2>
                <p className="mt-4 font-display text-xl font-bold leading-snug">
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The process */}
      <section className="relative overflow-hidden border-y border-dust/10 bg-soot/40">
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <Kicker>{PARTNER.process.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={PARTNER.process.heading} />
            </h2>
          </Reveal>
          <div className="md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-20">
            <ol className="mt-14 max-w-3xl">
              {PARTNER.process.steps.map((step, i) => (
                <Reveal as="li" key={step}>
                  <div className="flex gap-8 border-t border-dust/15 py-7">
                    <span className="meta-label pt-1 text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg text-starlight/85">{linkCategory3(step)}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <ProcessConstellation className="mt-14 hidden md:block" />
          </div>
        </div>
      </section>

      {/* Project showcase: heading, bursting photo collage, and the
          project list flow together as one continuous scene */}
      <ProjectShowcase />

      {/* FAQ */}
      <section className="relative overflow-hidden border-y border-dust/15 bg-soot/40">
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="true"
            src="/brand/fx-comet.webp"
            alt=""
            className="pointer-events-none absolute -right-8 top-4 hidden w-[460px] max-w-none opacity-50 md:block [animation:meteorite-jiggle_1.6s_ease-in-out_infinite]"
          />
          <Reveal>
            <Kicker>{PARTNER.faq.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text="FAQ" />
            </h2>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            {PARTNER.faq.items.map((item) => (
              <details
                key={item.question}
                className="group border-t border-dust/20 last:border-b"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 font-display text-xl font-bold marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="text-ember transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-8 leading-relaxed text-starlight/75">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA + wait list */}
      <section className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={44}
            height={44}
            className="vhs-glow mx-auto"
          />
          <p className="meta-label mt-8 text-ember">{PARTNER.closing.kicker}</p>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
            {PARTNER.closing.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-starlight/75">
            {PARTNER.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Cta href="/apply">Start an Application</Cta>
            <Cta href={CONTACT.bookingUrl} variant="ghost">
              {PARTNER.closing.bookCta}
            </Cta>
            <Cta href={`mailto:${CONTACT.primaryEmail}`} variant="ghost">
              {PARTNER.closing.emailCta}
            </Cta>
          </div>
          <Link
            href="/story"
            className="meta-label mt-10 inline-block text-dust transition-colors hover:text-ember"
          >
            The story behind Stars Forever →
          </Link>
          <ConstellationWhisper className="mt-16" />
        </Reveal>
      </section>
    </article>
  );
}
