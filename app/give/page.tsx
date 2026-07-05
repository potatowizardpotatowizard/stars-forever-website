import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import StarField from "@/components/StarField";
import { GIVE } from "@/content/give";
import { CONTACT, GIVING_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Giving directly fuels missions like Tokyo Drift and the Joshua Tree cohort: creators reached, gospel projects published, baptisms, discipleship.",
};

export default function GivePage() {
  const donateHref =
    GIVING_URL ??
    `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(GIVE.donate.subject)}`;

  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
        <Kicker>{GIVE.frame.kicker}</Kicker>
        <h1 className="mt-8 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
          {GIVE.frame.heading}
        </h1>
        <div className="mt-8 max-w-2xl space-y-5">
          {GIVE.frame.paragraphs.map((p) => (
            <p key={p} className="text-lg leading-relaxed text-starlight/80">
              {p}
            </p>
          ))}
        </div>
      </header>

      {/* What giving produces */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Reveal>
          <Kicker>{GIVE.produces.kicker}</Kicker>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {GIVE.produces.items.map((item) => (
            <Reveal key={item.title}>
              <MediaSlot
                name={item.imageSlot}
                sizes="(min-width: 768px) 33vw, 100vw"
                showCaption={false}
              />
              <h2 className="mt-6 font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Primary giving CTA */}
      <section className="relative mt-24 overflow-hidden border-y border-dust/15">
        <StarField />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-5xl">
              {GIVE.donate.heading}
            </h2>
            {GIVING_URL ? null : (
              <p className="mx-auto mt-6 max-w-xl text-starlight/75">
                {GIVE.donate.body}
              </p>
            )}
            <div className="mt-10">
              <Cta href={donateHref}>{GIVE.donate.cta}</Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Secondary, quieter: consulting */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <Kicker>{GIVE.consulting.kicker}</Kicker>
          <h2 className="mt-6 font-display text-3xl">
            {GIVE.consulting.heading}
          </h2>
          <p className="mt-5 leading-relaxed text-starlight/75">
            {GIVE.consulting.body}
          </p>
          <ul className="mt-8 space-y-4">
            {GIVE.consulting.offers.map((offer) => (
              <li key={offer.title} className="border-t border-dust/15 pt-4">
                <p className="font-display text-lg">{offer.title}</p>
                <p className="mt-1 text-sm text-dust">
                  {offer.person} ·{" "}
                  <a
                    href={`mailto:${offer.email}`}
                    className="text-ember transition-colors hover:text-starlight"
                  >
                    {offer.email}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </article>
  );
}
