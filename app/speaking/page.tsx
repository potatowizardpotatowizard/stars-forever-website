import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import SpeakingForm from "@/components/SpeakingForm";
import { SPEAKING } from "@/content/speaking";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "We are not pastors. We are creators who have shared Jesus in places most ministries never reach: on MrBeast's island, across Europe with Red Bull, in a drift car in rural Japan.",
  openGraph: { images: [{ url: "/brand/og-speaking.jpg", width: 1200, height: 630 }] },
};

export default function SpeakingPage() {
  return (
    <article>
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-blue.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/25 to-night"
        />
        <Grain />
        {/* A star broadcasting its signal into space, off to the side */}
        <div
          aria-hidden="true"
          className="broadcast right-4 top-40 scale-75 sm:scale-100 md:right-[10%] md:top-[30%]"
        >
          <span className="b-ring" />
          <span className="b-ring" />
          <span className="b-ring" />
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={54}
            height={54}
            className="broadcast-core"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-44 sm:px-8">
          {/* The hero delivers its lines on beats: the claim, the answer,
              the receipts pinging their stars alight, then the invitation */}
          <p className="hero-beat meta-label" style={{ animationDelay: "0.1s" }}>
            {SPEAKING.opening.kicker}
          </p>
          <h1
            className="hero-beat mt-6 font-display text-5xl sm:text-7xl"
            style={{ animationDelay: "0.4s" }}
          >
            {SPEAKING.opening.heading}
          </h1>
          <p
            className="hero-beat mt-8 max-w-2xl font-display text-2xl leading-snug text-starlight/85 sm:text-3xl"
            style={{ animationDelay: "1.3s" }}
          >
            {SPEAKING.opening.line}
          </p>
          <div className="mt-10 flex flex-col gap-y-3">
            {SPEAKING.opening.receipts.map((receipt, i) => (
              <span
                key={receipt.label}
                className="hero-beat font-meta text-sm font-bold uppercase tracking-[0.14em] text-starlight/90"
                style={{ animationDelay: `${2.4 + i * 0.7}s` }}
              >
                <span className="ping-star">✦</span>{" "}
                {receipt.href ? (
                  <Link
                    href={receipt.href}
                    className="underline decoration-dust/40 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember"
                  >
                    {receipt.label}
                  </Link>
                ) : (
                  receipt.label
                )}
              </span>
            ))}
          </div>
          <p
            className="hero-beat mt-10 font-display text-2xl leading-snug text-ember"
            style={{ animationDelay: "4.9s" }}
          >
            {SPEAKING.opening.closer}
          </p>
        </div>
      </header>

      {/* Topics */}
      <section className="border-y border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <Kicker>{SPEAKING.topics.kicker}</Kicker>
          </Reveal>
          <ol className="mt-10 max-w-3xl space-y-8">
            {SPEAKING.topics.items.map((topic, i) => (
              <Reveal as="li" key={topic}>
                <div className="border-t border-dust/20 pt-6">
                  <p className="meta-label text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-snug">
                    {topic}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Speaker bios with their journeys */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="space-y-28">
          {SPEAKING.speakers.map((speaker, i) => (
            <div key={speaker.name}>
              <Reveal>
                <div
                  className={`grid items-start gap-10 md:gap-16 ${
                    i % 2 === 1
                      ? "md:grid-cols-[1fr_20rem]"
                      : "md:grid-cols-[20rem_1fr]"
                  }`}
                >
                  <MediaSlot
                    name={speaker.imageSlot}
                    sizes="20rem"
                    showCaption={false}
                    className={i % 2 === 1 ? "md:order-2" : ""}
                  />
                  <div className="max-w-2xl">
                    <h2 className="font-display text-4xl">{speaker.name}</h2>
                    <div className="mt-6 space-y-5">
                      {speaker.bio.map((p) => (
                        <p key={p} className="leading-relaxed text-starlight/80">
                          {p}
                        </p>
                      ))}
                    </div>
                    <a
                      href={`mailto:${speaker.email}`}
                      className="meta-label mt-7 inline-block text-ember transition-colors hover:text-starlight"
                    >
                      {speaker.email}
                    </a>
                    {"link" in speaker && speaker.link ? (
                      <p className="mt-3">
                        <Link
                          href={speaker.link.href}
                          className="meta-label inline-block text-ember transition-colors hover:text-starlight"
                        >
                          {speaker.link.label} →
                        </Link>
                      </p>
                    ) : null}
                    {"instagram" in speaker && speaker.instagram ? (
                      <p className="mt-3">
                        <a
                          href={speaker.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meta-label inline-block text-ember transition-colors hover:text-starlight"
                        >
                          Instagram ↗
                        </a>
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
              {/* The journey: life stops as a constellation */}
              <Reveal className="mt-14">
                <p className="meta-label">{speaker.journey.kicker}</p>
                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
                  {speaker.journey.stops.map((stop, j) => (
                    <div key={stop.label} className="contents">
                      {j > 0 ? (
                        <div
                          aria-hidden="true"
                          className="journey-line hidden sm:block"
                          style={{ transitionDelay: `${j * 0.35}s` }}
                        />
                      ) : null}
                      <div
                        className="journey-stop flex items-start gap-3.5 sm:mx-3 sm:max-w-44 sm:flex-col sm:gap-0"
                        style={{ transitionDelay: `${0.15 + j * 0.35}s` }}
                      >
                        <Image
                          src="/brand/star-sharp.png"
                          alt=""
                          width={18}
                          height={18}
                          className="journey-star mt-1 h-[18px] w-[18px] shrink-0 self-start sm:mt-0"
                        />
                        <div>
                          <p className="font-display text-base font-bold sm:mt-3">
                            {stop.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-dust">
                            {stop.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + inquiry form */}
      <section className="border-t border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-5xl">
              {SPEAKING.closing.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-starlight/75">
              {SPEAKING.closing.body}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Cta href={CONTACT.bookingUrl}>{SPEAKING.closing.bookCta}</Cta>
              <Cta href={`mailto:${CONTACT.speakingEmail}`} variant="ghost">
                {SPEAKING.closing.emailCta}
              </Cta>
            </div>
            <p className="mt-8">
              <a
                href={SPEAKING.onePager.href}
                download
                className="mono-link text-sm font-bold text-ember"
              >
                {SPEAKING.onePager.label} ↓
              </a>
            </p>
            <div className="mt-14">
              <SpeakingForm />
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
