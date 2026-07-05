import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import { REVOLUTIONARY } from "@/content/revolutionary";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Revolutionary",
  description: REVOLUTIONARY.definition,
};

export default function RevolutionaryPage() {
  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pb-16 pt-44 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl">
          {REVOLUTIONARY.title}
        </h1>
        <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
          {REVOLUTIONARY.definition}
        </p>
        {/* Attribution, near the top as required */}
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-dust">
          {REVOLUTIONARY.attribution.body}{" "}
          <a
            href={REVOLUTIONARY.attribution.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember transition-colors hover:text-starlight"
          >
            {REVOLUTIONARY.attribution.linkLabel}
          </a>
        </p>
      </header>

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
        <Reveal className="mx-auto max-w-2xl">
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
                    {item.body}
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
      </section>

      {/* How to attend + CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-32 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker>{REVOLUTIONARY.attend.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl">
            {REVOLUTIONARY.attend.heading}
          </h2>
          <p className="mt-6 leading-relaxed text-starlight/75">
            {REVOLUTIONARY.attend.body}
          </p>
          <div className="mt-10">
            <Cta href={CONTACT.bookingUrl}>{REVOLUTIONARY.cta.label}</Cta>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
