import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import StarMark from "@/components/StarMark";
import { PARTNER } from "@/content/partner";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Partner Project",
  description: PARTNER.definition,
};

export default function PartnerProjectPage() {
  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl">{PARTNER.title}</h1>
        <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
          {PARTNER.definition}
        </p>
      </header>

      {/* Success metrics */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Reveal>
          <Kicker>{PARTNER.metrics.kicker}</Kicker>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PARTNER.metrics.items.map((m) => (
            <Reveal key={m.title}>
              <div className="h-full border border-dust/20 bg-soot/40 p-8">
                <h2 className="meta-label text-ember">{m.title}</h2>
                <p className="mt-4 font-display text-xl leading-snug">
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The process */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{PARTNER.process.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            {PARTNER.process.heading}
          </h2>
        </Reveal>
        <ol className="mt-14 max-w-3xl">
          {PARTNER.process.steps.map((step, i) => (
            <Reveal as="li" key={step}>
              <div className="flex gap-8 border-t border-dust/15 py-7">
                <span className="meta-label pt-1 text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg text-starlight/85">{step}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="border-y border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <Kicker>{PARTNER.faq.kicker}</Kicker>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            {PARTNER.faq.items.map((item) => (
              <details
                key={item.question}
                className="group border-t border-dust/20 last:border-b"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 font-display text-xl marker:content-none [&::-webkit-details-marker]:hidden">
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

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <StarMark className="mx-auto h-4 w-4 text-ember" />
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl sm:text-5xl">
            {PARTNER.closing.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-starlight/75">
            {PARTNER.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Cta href={CONTACT.bookingUrl}>{PARTNER.closing.bookCta}</Cta>
            <Cta href={`mailto:${CONTACT.primaryEmail}`} variant="ghost">
              {PARTNER.closing.emailCta}
            </Cta>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
