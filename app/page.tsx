import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import StarField from "@/components/StarField";
import VideoBlock from "@/components/VideoBlock";
import { HOME } from "@/content/home";
import { ANCHOR_VERSE, CONTACT, HERO_MENU, SITE_NAME } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero: the brand page. Analog black, purple nebula, typewriter menu,
          glowing wordmark. The menu IS the navigation on this page. */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-night">
        <Image
          src="/brand/bg-purple-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night/80"
        />
        <StarField />
        <Grain />

        <h1 className="sr-only">
          {SITE_NAME}: a ministry for creators, artists, and entrepreneurs
        </h1>

        {/* Centered tape menu */}
        <nav
          aria-label="Main"
          className="relative flex flex-1 items-center justify-center px-5"
        >
          <div className="hero-rise text-center">
            <Image
              src="/brand/star-smeared.png"
              alt=""
              width={64}
              height={64}
              className="vhs-glow mx-auto mb-8"
            />
            <ul className="space-y-4">
              {HERO_MENU.map((item, i) => (
                <li key={item.href}>
                  <Link href={item.href} className="hero-menu-link">
                    <GlitchText text={item.label.toUpperCase()} delay={300 + i * 140} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Lower third: mission line left, glowing wordmark right */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-5 pb-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <p className="meta-label hero-rise max-w-xs" style={{ animationDelay: "0.5s" }}>
            {HOME.hero.missionLine}
          </p>
          <Image
            src="/brand/logo-full.png"
            alt={SITE_NAME}
            width={340}
            height={191}
            priority
            className="vhs-glow vhs-flicker -mb-6 self-end sm:-mr-4"
          />
        </div>
      </section>

      {/* Anchor verse */}
      <section className="relative overflow-hidden border-t border-dust/10">
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="max-w-3xl">
            <blockquote>
              <p className="font-meta text-xl leading-relaxed text-starlight sm:text-2xl sm:leading-relaxed">
                {ANCHOR_VERSE.text}
              </p>
              <cite className="meta-label mt-5 block not-italic text-ember">
                {ANCHOR_VERSE.reference}
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* The reframe */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <Kicker>{HOME.reframe.kicker}</Kicker>
          <div className="mt-8 space-y-6">
            {HOME.reframe.lines.map((line, i) => (
              <p
                key={line}
                className={
                  i === HOME.reframe.lines.length - 1
                    ? "font-display text-3xl font-bold text-ember sm:text-4xl"
                    : "font-display text-3xl font-bold text-starlight sm:text-4xl"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Two minute explainer */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="max-w-3xl">
          <Kicker>{HOME.video.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {HOME.video.heading}
          </h2>
          <VideoBlock
            src={HOME.video.src}
            poster={HOME.video.poster}
            title={HOME.video.caption}
            className="mt-10"
          />
        </Reveal>
      </section>

      {/* The two creator programs */}
      <section
        aria-label={HOME.programs.heading}
        className="relative overflow-hidden border-y border-dust/10 bg-soot/40"
      >
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <Kicker>{HOME.programs.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              {HOME.programs.heading}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {HOME.programs.items.map((program) => (
              <Reveal key={program.title}>
                <Link
                  href={program.href}
                  className="group relative block overflow-hidden rounded-xl border border-dust/20"
                >
                  <Image
                    src={program.art}
                    alt=""
                    width={960}
                    height={540}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[16/9] w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/40 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h3 className="mono-link text-xl font-bold group-hover:text-ember sm:text-2xl">
                      <GlitchText text={program.title.toUpperCase()} />
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-starlight/80">
                      {program.body}
                    </p>
                    <span className="meta-label mt-4 inline-block text-ember">
                      {program.cta}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Learn and take part */}
          <Reveal className="mt-20">
            <Kicker>{HOME.learn.kicker}</Kicker>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {HOME.learn.items.map((item) => (
              <Reveal key={item.title}>
                <Link
                  href={item.href}
                  className="group relative block overflow-hidden rounded-xl border border-dust/20"
                >
                  <Image
                    src={item.art}
                    alt=""
                    width={960}
                    height={340}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[21/8] w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/50 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="mono-link text-lg font-bold group-hover:text-ember">
                      <GlitchText text={item.title.toUpperCase()} />
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-starlight/80">
                      {item.body}
                    </p>
                    <span className="meta-label mt-3 inline-block text-ember">
                      {item.cta}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{HOME.proof.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {HOME.proof.heading}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {HOME.proof.cards.map((card) => (
            <Reveal key={card.title}>
              <Link href={card.href} className="group block">
                <MediaSlot
                  name={card.imageSlot}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  showCaption={false}
                  className="overflow-hidden rounded-lg"
                />
                <p className="meta-label mt-6">{card.meta}</p>
                <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                  {card.body}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative overflow-hidden border-t border-dust/10">
        <Image
          src="/brand/bg-black-stars.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <Image
              src="/brand/star-sharp.png"
              alt=""
              width={44}
              height={44}
              className="vhs-glow mx-auto"
            />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              {HOME.closing.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-starlight/75">
              {HOME.closing.body}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Cta href={CONTACT.bookingUrl}>{HOME.closing.bookCta}</Cta>
              <Cta href={`mailto:${CONTACT.primaryEmail}`} variant="ghost">
                {HOME.closing.emailCta}
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
