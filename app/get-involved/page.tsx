import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import { GET_INVOLVED } from "@/content/getInvolved";
import { CONTACT, GIVING_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Get Involved",
  description: GET_INVOLVED.intro,
  openGraph: { images: [{ url: "/brand/og-involved.jpg", width: 1200, height: 630 }] },
};

export default function GetInvolvedPage() {
  const give = GET_INVOLVED.give;
  const donateHref =
    GIVING_URL ??
    `mailto:${CONTACT.primaryEmail}?subject=${encodeURIComponent(give.donate.subject)}`;

  return (
    <article>
      {/* Analog hero band */}
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-orange-star.jpg"
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
            {GET_INVOLVED.title}
          </h1>
          <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {GET_INVOLVED.intro}
          </p>
        </div>
      </header>

      {/* For creators, under the hero's orange afterglow */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[45vh] bg-[linear-gradient(to_bottom,rgb(194_65_12/0.3),rgb(194_65_12/0.1)_45%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Reveal>
          <Kicker>{GET_INVOLVED.creators.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text={GET_INVOLVED.creators.heading} />
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {GET_INVOLVED.creators.paths.map((path) => (
            <Reveal key={path.title}>
              <div className="flex h-full flex-col rounded-lg border border-dust/20 bg-soot/40 p-8">
                <h3 className="font-display text-2xl font-bold">{path.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-starlight/75">
                  {path.body}
                </p>
                <div className="mt-7">
                  <Cta href={path.href ?? CONTACT.bookingUrl} variant="ghost">
                    {path.cta}
                  </Cta>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* For supporters: why giving matters */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal className="max-w-3xl">
          <Kicker>{give.frame.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {give.frame.heading}
          </h2>
          <div className="mt-8 space-y-5">
            {give.frame.paragraphs.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-starlight/80">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What giving produces */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <Kicker>{give.produces.kicker}</Kicker>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {give.produces.items.map((item) => (
            <Reveal key={item.title}>
              {item.href ? (
                <Link href={item.href} className="group relative block">
                  <MediaSlot
                    name={item.imageSlot}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    showCaption={false}
                    className="overflow-hidden rounded-lg"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-night/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="mono-link text-sm font-bold">
                      Learn More ▶
                    </span>
                  </span>
                </Link>
              ) : (
                <MediaSlot
                  name={item.imageSlot}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  showCaption={false}
                  className="overflow-hidden rounded-lg"
                />
              )}
              <h3 className="mt-6 font-display text-2xl font-bold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Primary giving CTA */}
      <section className="relative overflow-hidden border-y border-dust/15">
        <Image
          src="/brand/bg-orange-comet.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={give.donate.heading} />
            </h2>
            {GIVING_URL ? null : (
              <p className="mx-auto mt-6 max-w-xl text-starlight/75">
                {give.donate.body}
              </p>
            )}
            <div className="mt-10">
              <Cta href={donateHref}>{give.donate.cta}</Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Secondary, quieter: consulting, under the giving section's orange
          afterglow fading down into black */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[70vh] bg-[linear-gradient(to_bottom,rgb(194_65_12/0.3),rgb(194_65_12/0.1)_45%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <Kicker>{give.consulting.kicker}</Kicker>
          <h2 className="mt-6 font-display text-3xl font-bold">
            {give.consulting.heading}
          </h2>
          <p className="mt-5 leading-relaxed text-starlight/75">
            {give.consulting.body}
          </p>
          <ul className="mt-8 space-y-4">
            {give.consulting.offers.map((offer) => (
              <li key={offer.title} className="border-t border-dust/15 pt-4">
                <p className="font-display text-lg font-bold">{offer.title}</p>
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
        </div>
      </section>

      {/* Contact block */}
      <section
        id="contact"
        className="border-t border-dust/15 bg-soot/40"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <Kicker>Contact</Kicker>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold">
              <GlitchText text="Talk to a Human" />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-starlight/75">
              Write to us directly or grab a time below. Every message gets
              read.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Cta href={`mailto:${CONTACT.primaryEmail}`} variant="ghost">
                Email us
              </Cta>
            </div>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-dust/25 bg-starlight">
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ28jCrfJdxZsfN0ASScQH3JSRwxTrL0V0JnXDQpOC7KJK4a1k9zC-derUx5N5_mnYzFiSh1R_ZS?gv=true"
                title="Book a call with Stars Forever"
                loading="lazy"
                className="h-[600px] w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
