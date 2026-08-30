import type { Metadata } from "next";
import Image from "next/image";
import { linkCategory3 } from "@/components/Category3Link";
import Cta from "@/components/Cta";
import DigitalSky from "@/components/DigitalSky";
import VisionClaimStrip from "@/components/VisionClaimStrip";
import NicheCycler from "@/components/NicheCycler";
import GlitchText from "@/components/GlitchText";
import Kicker from "@/components/Kicker";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StatCarousel from "@/components/StatCarousel";
import { VISION } from "@/content/vision";
import { GIVING_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "The Vision",
  description: VISION.dream.body,
};

export default function VisionPage() {
  return (
    <article>
      {/* Analog hero: hero and the problem share one continuous
          canvas, the photo dissolving into open night */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[78svh] md:h-[96svh]">
          <Image
            src="/brand/bg-greenpurple-star.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55 brightness-90 [mask-image:linear-gradient(to_bottom,black_55%,rgb(0_0_0/0.933)_61.5%,rgb(0_0_0/0.75)_68.0%,rgb(0_0_0/0.5)_74.5%,rgb(0_0_0/0.25)_81.0%,rgb(0_0_0/0.067)_87.5%,transparent_94.0%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night/70 [mask-image:linear-gradient(to_bottom,black_55%,rgb(0_0_0/0.933)_61.5%,rgb(0_0_0/0.75)_68.0%,rgb(0_0_0/0.5)_74.5%,rgb(0_0_0/0.25)_81.0%,rgb(0_0_0/0.067)_87.5%,transparent_94.0%)]"
          />
          {/* extra nebula breath over the hero, photo untouched */}
          <div
            aria-hidden="true"
            className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_60%,rgb(0_0_0/0.933)_65.7%,rgb(0_0_0/0.75)_71.3%,rgb(0_0_0/0.5)_77.0%,rgb(0_0_0/0.25)_82.7%,rgb(0_0_0/0.067)_88.3%,transparent_94.0%)]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 55% at 12% 28%, rgb(109 40 217 / 0.2), transparent 70%), radial-gradient(ellipse 70% 60% at 86% 22%, rgb(34 197 94 / 0.16), transparent 72%), radial-gradient(ellipse 45% 40% at 55% 70%, rgb(139 92 246 / 0.12), transparent 70%)",
            }}
          />
        </div>
        <header className="relative">
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 sm:px-8 sm:pt-44">
          <h1 className="max-w-4xl font-display text-5xl font-bold sm:text-6xl">
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
          className="pointer-events-none absolute inset-x-0 top-[-14svh] h-[70vh] [mask-image:linear-gradient(to_bottom,transparent_4.0%,rgb(0_0_0/0.067)_8.3%,rgb(0_0_0/0.25)_12.7%,rgb(0_0_0/0.5)_17.0%,rgb(0_0_0/0.75)_21.3%,rgb(0_0_0/0.933)_25.7%,rgb(0_0_0/1.0)_30.0%,black_30%,black_72%,rgb(0_0_0/0.933)_75.8%,rgb(0_0_0/0.75)_79.7%,rgb(0_0_0/0.5)_83.5%,rgb(0_0_0/0.25)_87.3%,rgb(0_0_0/0.067)_91.2%,transparent_95.0%)]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 60% at 10% 0%, rgb(109 40 217 / 0.22), transparent 68%), radial-gradient(ellipse 80% 65% at 78% 0%, rgb(34 197 94 / 0.26), transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 md:grid md:grid-cols-2 md:items-center md:gap-16 md:pt-24">
          <div className="max-w-3xl">
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
          </div>

          {/* the numbers behind the problem, a swipeable deck */}
          <div className="mt-14 md:mt-0">
            <StatCarousel
              stats={[
                {
                  value: "4.8h",
                  text: "a day on social media for the average US teen. For teen girls it is 5.3.",
                  sourceLabel: "Gallup",
                  sourceHref:
                    "https://news.gallup.com/poll/512576/teens-spend-average-hours-social-media-per-day.aspx",
                },
                {
                  value: "46%",
                  text: "of US teens say they are online almost constantly. A decade ago it was 24.",
                  sourceLabel: "Pew Research Center",
                  sourceHref:
                    "https://www.pewresearch.org/internet/2024/12/12/teens-social-media-and-technology-2024/",
                },
                {
                  value: "2h 21m",
                  text: "on social media every single day, the global average.",
                  sourceLabel: "DataReportal",
                  sourceHref:
                    "https://datareportal.com/reports/digital-2026-global-overview-report",
                },
                {
                  value: "18h 36m",
                  text: "every week. More than one full waking day out of every seven, spent scrolling.",
                  sourceLabel: "DataReportal",
                  sourceHref:
                    "https://datareportal.com/reports/digital-2026-global-overview-report",
                },
                {
                  value: "6 yrs",
                  text: "of the average life spent inside the feed, if today's pace holds.",
                  sourceLabel: "DataReportal",
                  sourceHref:
                    "https://datareportal.com/reports/digital-2026-global-overview-report",
                },
                {
                  value: "2x",
                  text: "the risk of anxiety and depression symptoms for teens spending more than three hours a day on social media.",
                  sourceLabel: "US Surgeon General",
                  sourceHref: "https://pubmed.ncbi.nlm.nih.gov/37721985/",
                },
                {
                  value: "95%",
                  text: "of young people aged 13 to 17 use social media. This is where they live. This is the mission field.",
                  sourceLabel: "US Surgeon General",
                  sourceHref: "https://pubmed.ncbi.nlm.nih.gov/37721985/",
                },
              ]}
            />
          </div>
        </div>
        </section>
      </div>

      {/* A missionary to a niche */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 md:pt-14">
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
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pt-24 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>{VISION.dream.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={VISION.dream.heading} />
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-starlight/85">
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
      <section className="bg-[linear-gradient(to_bottom,transparent_0%,rgb(19_13_29/0.048)_10.0%,rgb(19_13_29/0.173)_20.0%,rgb(19_13_29/0.327)_30.0%,rgb(19_13_29/0.452)_40.0%,rgb(19_13_29/0.5)_50%,rgb(19_13_29/0.452)_60.0%,rgb(19_13_29/0.327)_70.0%,rgb(19_13_29/0.173)_80.0%,rgb(19_13_29/0.048)_90.0%,transparent_100%)]">
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
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold sm:text-5xl md:max-w-none md:whitespace-nowrap">
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
