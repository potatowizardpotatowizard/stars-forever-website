import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import { SPEAKING } from "@/content/speaking";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "We are not pastors, but we have shared Jesus creatively across the world: on MrBeast's island, with Red Bull across Europe, at a college in Tokyo.",
};

export default function SpeakingPage() {
  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pb-24 pt-44 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl">
          {SPEAKING.opening.heading}
        </h1>
        <div className="mt-8 max-w-2xl space-y-3">
          {SPEAKING.opening.lines.map((line) => (
            <p
              key={line}
              className="font-display text-2xl leading-snug text-starlight/85"
            >
              {line}
            </p>
          ))}
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

      {/* Speaker bios */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="space-y-24">
          {SPEAKING.speakers.map((speaker, i) => (
            <Reveal key={speaker.name}>
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-5xl">
              {SPEAKING.closing.heading}
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Cta href={CONTACT.bookingUrl}>{SPEAKING.closing.bookCta}</Cta>
              <Cta href={`mailto:${CONTACT.speakingEmail}`} variant="ghost">
                {SPEAKING.closing.emailCta}
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
