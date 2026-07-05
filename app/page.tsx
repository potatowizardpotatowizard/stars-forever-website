import Link from "next/link";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import StarField from "@/components/StarField";
import StarMark from "@/components/StarMark";
import { HOME } from "@/content/home";
import { ANCHOR_VERSE, CONTACT } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero: full bleed photo, star field resolving above it, anchor verse */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <MediaSlot name={HOME.hero.imageSlot} fill priority />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night"
        />
        <StarField />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-40 sm:px-8">
          <div className="max-w-3xl">
            <blockquote className="hero-rise">
              <p className="font-display text-2xl leading-snug text-starlight sm:text-4xl sm:leading-snug">
                {ANCHOR_VERSE.text}
              </p>
              <cite className="meta-label mt-5 block not-italic">
                {ANCHOR_VERSE.reference}
              </cite>
            </blockquote>
            <p
              className="hero-rise mt-10 max-w-xl text-lg text-starlight/85"
              style={{ animationDelay: "0.35s" }}
            >
              {HOME.hero.missionLine}
            </p>
          </div>
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
                    ? "font-display text-3xl text-ember sm:text-4xl"
                    : "font-display text-3xl text-starlight sm:text-4xl"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Two doors */}
      <section aria-label={HOME.doors.heading} className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-10 md:grid-cols-2">
          {HOME.doors.items.map((door) => (
            <Reveal key={door.title}>
              <Link href={door.href} className="group block">
                <MediaSlot
                  name={door.imageSlot}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  showCaption={false}
                />
                <h2 className="mt-7 font-display text-3xl transition-colors group-hover:text-ember sm:text-4xl">
                  {door.title}
                </h2>
                <p className="mt-4 max-w-md text-starlight/75">{door.body}</p>
                <span className="meta-label mt-6 inline-block text-ember">
                  {door.cta}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-y border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <Kicker>{HOME.proof.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl">
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
                  />
                  <p className="meta-label mt-6">{card.meta}</p>
                  <h3 className="mt-2 font-display text-2xl transition-colors group-hover:text-ember">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                    {card.body}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Category 3 teaser */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <Kicker>{HOME.category3.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            {HOME.category3.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-starlight/80">
            {HOME.category3.body}
          </p>
          <div className="mt-9">
            <Cta href={HOME.category3.href} variant="ghost">
              {HOME.category3.cta}
            </Cta>
          </div>
        </Reveal>
      </section>

      {/* Closing call to action */}
      <section className="relative overflow-hidden border-t border-dust/15">
        <StarField />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <StarMark className="mx-auto h-4 w-4 text-ember" />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
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
