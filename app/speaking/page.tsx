import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-44 sm:px-8">
          {/* The hero delivers its lines on beats: the claim, the answer,
              then the receipts landing one by one */}
          <h1
            className="hero-beat font-display text-5xl sm:text-6xl"
            style={{ animationDelay: "0.15s" }}
          >
            {SPEAKING.opening.heading}
          </h1>
          <div className="mt-8 max-w-2xl space-y-3">
            <p
              className="hero-beat font-display text-2xl leading-snug text-starlight/85"
              style={{ animationDelay: "1.1s" }}
            >
              {SPEAKING.opening.lines[0]}
            </p>
            <p className="font-display text-2xl leading-snug text-starlight/85">
              {SPEAKING.opening.lines[1]
                .split(". ")
                .map((fragment, i) => (
                  <span
                    key={fragment}
                    className="hero-beat inline-block"
                    style={{ animationDelay: `${2.2 + i * 0.7}s` }}
                  >
                    {fragment.endsWith(".") ? fragment : `${fragment}.`}
                    {" "}
                  </span>
                ))}
            </p>
            <p
              className="hero-beat font-display text-2xl leading-snug text-ember"
              style={{ animationDelay: "4.6s" }}
            >
              {SPEAKING.opening.closer}
            </p>
          </div>
        </div>
      </header>

      {/* Topics */}
      <section className="border-y border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <Kicker>{SPEAKING.topics.kicker}</Kicker>
          </Reveal>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {SPEAKING.topics.items.map((topic, i) => (
              <Reveal as="li" key={topic}>
                <div className="border-t border-dust/20 pt-6">
                  <p className="meta-label text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-display text-xl leading-snug">
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
                  className={`grid items-start gap-10 md:grid-cols-[20rem_1fr] md:gap-16 ${
                    i % 2 === 1 ? "md:grid-cols-[1fr_20rem]" : ""
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
                        className="journey-stop flex gap-3 sm:mx-3 sm:max-w-44 sm:flex-col sm:gap-0"
                        style={{ transitionDelay: `${0.15 + j * 0.35}s` }}
                      >
                        <Image
                          src="/brand/star-sharp.png"
                          alt=""
                          width={16}
                          height={16}
                          className="journey-star mt-0.5 shrink-0 sm:mt-0"
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
