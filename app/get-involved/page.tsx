import type { Metadata } from "next";
import { linkCategory3 } from "@/components/Category3Link";
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
      {/* Analog hero band: hero and the giving frame share one
          continuous canvas, the photo dissolving into open night */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[62svh] md:h-[80svh]">
        <Image
          src="/brand/bg-orange-star.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 brightness-90 [mask-image:linear-gradient(to_bottom,black_45%,transparent_96%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night/70 [mask-image:linear-gradient(to_bottom,black_45%,transparent_96%)]"
        />
        </div>
        <Grain />
        <header className="relative">
        <span aria-hidden="true" className="hero-meteor" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-44">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            {GET_INVOLVED.title}
          </h1>
          <p className="mt-8 max-w-3xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {GET_INVOLVED.intro}
          </p>
          {/* Quick actions as glowing meteors under the shooting star */}
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-5">
            {GET_INVOLVED.quickActions.map((action) => {
              const href =
                action.href ??
                (action.label === "Give to the Mission"
                  ? donateHref
                  : CONTACT.bookingUrl);
              const external = href.startsWith("http") || href.startsWith("mailto:");
              return external ? (
                <a
                  key={action.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meteor-cta"
                >
                  {action.label}
                </a>
              ) : (
                <Link key={action.label} href={href} className="meteor-cta">
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
        </header>

        {/* For supporters: why giving matters, same sky */}
        <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-14svh] h-[60vh] bg-[linear-gradient(to_bottom,transparent,rgb(194_65_12/0.28)_32%,rgb(194_65_12/0.1)_62%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>{give.frame.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {give.frame.heading}
            </h2>
            <div className="mt-8 space-y-6">
              {give.frame.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/80">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="/story"
              className="meta-label mt-10 inline-block text-dust transition-colors hover:text-ember"
            >
              The story behind Stars Forever →
            </Link>
          </Reveal>
        </div>
        </section>
      </div>

      {/* What giving produces: stacked above the comet bleed so the
          photos stay crisp while the glow fills the sky around them */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
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
                {linkCategory3(item.body)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Primary giving CTA */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[55svh] -top-[55svh]"
        >
          <Image
            src="/brand/bg-orange-comet.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_38%,black_62%,transparent)]"
          />
        </div>
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
      <section className="relative">
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
                {"href" in offer && offer.href ? (
                  <p className="mt-2">
                    {offer.href.startsWith("http") ? (
                      <a
                        href={offer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-label inline-block text-ember transition-colors hover:text-starlight"
                      >
                        {offer.linkLabel} →
                      </a>
                    ) : (
                      <Link
                        href={offer.href}
                        className="meta-label inline-block text-ember transition-colors hover:text-starlight"
                      >
                        {offer.linkLabel} →
                      </Link>
                    )}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
        </div>
      </section>

      {/* For creators */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <Kicker>{GET_INVOLVED.creators.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text={GET_INVOLVED.creators.heading} />
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        {/* Churches and events: the speaking page lives in the footer,
            so give it a doorway here too */}
        <Reveal className="mt-10">
          <Link
            href="/speaking"
            className="group flex flex-col items-start justify-between gap-4 rounded-lg border border-dust/20 bg-soot/40 p-8 transition-colors hover:border-ember/60 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-ember">
                Invite Us to Speak
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-starlight/75">
                For churches, conferences, and events. We are not pastors, but
                we have shared Jesus in places most ministries never reach.
              </p>
            </div>
            <span className="mono-link shrink-0 text-sm font-bold text-ember">
              About Speaking →
            </span>
          </Link>
        </Reveal>
      </section>

      {/* Contact block */}
      <section
        id="contact"
        className="bg-gradient-to-b from-transparent via-soot/50 to-transparent"
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
