import type { Metadata } from "next";
import { linkCategory3 } from "@/components/Category3Link";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { MISSIONS } from "@/content/missions";
import { resolveSlot } from "@/lib/media";

// Pull a YouTube video id out of an href so linked videos can show
// their real thumbnails in Go Deeper.
function youtubeId(href: string): string | null {
  const m = href.match(
    /(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{6,})/,
  );
  return m ? m[1] : null;
}

// Brand art colorway per project, shown until its hero photo arrives.
const HERO_ART: Record<string, string> = {
  "real-treasure": "/brand/bg-blue.jpg",
  "tokyo-drift": "/brand/bg-orange-comet.jpg",
  "revolutionary-cohort": "/brand/bg-greenpurple.jpg",
  "beast-games": "/brand/bg-green.jpg",
};

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mission = MISSIONS.find((m) => m.slug === slug);
  if (!mission) return {};
  return { title: mission.name, description: mission.summary };
}

export default async function MissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mission = MISSIONS.find((m) => m.slug === slug);
  if (!mission) notFound();
  const heroPhoto = resolveSlot(mission.heroSlot);

  return (
    <article>
      {/* Full bleed hero: ambient video when provided, else photo or art */}
      <header className="relative flex min-h-[70svh] items-end overflow-hidden">
        {mission.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPhoto.src ?? undefined}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          >
            <source src={mission.heroVideo} type="video/mp4" />
          </video>
        ) : heroPhoto.src ? (
          <MediaSlot name={mission.heroSlot} fill priority />
        ) : (
          <Image
            src={HERO_ART[mission.slug] ?? "/brand/bg-purple-meteor.jpg"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/45 via-transparent to-night/90"
        />
        <Grain />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-44 sm:px-8">
          <h1 className="font-display text-5xl sm:text-7xl">{mission.name}</h1>
        </div>
      </header>

      {/* Consistent metadata header */}
      <div className="border-y border-dust/15">
        <dl className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {(
            [
              ["Mission", mission.name],
              ["Location", mission.location],
              ["Partner", mission.partner],
              ["Date", mission.date],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="meta-label">{label}</dt>
              <dd className="mt-2 text-sm text-starlight/85">
                {label === "Partner" && mission.partnerHref ? (
                  <>
                    <a
                      href={mission.partnerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember underline decoration-ember/40 underline-offset-4 transition-colors hover:text-starlight"
                    >
                      {value.split(",")[0]}
                    </a>
                    {value.includes(",")
                      ? `,${value.split(",").slice(1).join(",")}`
                      : null}
                  </>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {mission.burningQuestion ? (
        <div className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Kicker>The burning question</Kicker>
            <p className="mt-8 font-display text-3xl leading-snug sm:text-4xl">
              {mission.burningQuestion}
            </p>
          </Reveal>
        </div>
      ) : null}

      {mission.roster ? (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
          <Reveal>
            <Kicker>Who came</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={mission.roster.heading} />
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {mission.roster.people.map((person) => {
                const platform = person.href.includes("instagram")
                  ? "Instagram"
                  : person.href.includes("youtube")
                    ? "YouTube"
                    : "Website";
                return (
                  <li key={person.name} className="h-full">
                    <a
                      href={person.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col rounded-lg border border-dust/20 bg-night/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ember/70 hover:shadow-[0_0_24px_rgb(109_40_217/0.35)]"
                    >
                      <Image
                        src="/brand/star-sharp.png"
                        alt=""
                        width={22}
                        height={22}
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                      />
                      <span className="mt-4 font-display text-lg font-bold leading-snug transition-colors group-hover:text-ember">
                        {person.name}
                      </span>
                      {person.niche ? (
                        <span className="meta-label mt-1.5">{person.niche}</span>
                      ) : null}
                      <span className="meta-label mt-5 flex-1 content-end text-ember">
                        {platform} ↗
                      </span>
                    </a>
                  </li>
                );
              })}
              {mission.testimonies ? (
                <li className="flex items-center">
                  <a
                    href="#testimonies"
                    className="group w-full rounded-lg border border-ember/40 bg-soot/40 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-ember hover:shadow-[0_0_24px_rgb(109_40_217/0.45)]"
                  >
                    <span className="block font-display text-lg font-bold leading-snug text-ember transition-colors group-hover:text-starlight">
                      And what came after…
                    </span>
                    <span className="meta-label mt-2 block">
                      Creator testimonies ↓
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </section>
      ) : null}

      {mission.videoEmbed ? (
        <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <YouTubeEmbed
              youtubeId={mission.videoEmbed.youtubeId}
              title={mission.name}
              caption={mission.videoEmbed.caption}
            />
          </Reveal>
        </div>
      ) : null}

      {mission.videoLink ? (
        <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
          <Reveal className="mx-auto max-w-sm md:flex md:max-w-4xl md:items-center md:justify-center md:gap-20">
            <figure className="md:w-80 md:flex-none">
              <a
                href={mission.videoLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-soot">
                  <Image
                    src={mission.videoLink.thumbnail}
                    alt={mission.name}
                    width={720}
                    height={1280}
                    sizes="24rem"
                    className="block aspect-[9/16] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-night/70 pl-1 text-2xl text-starlight backdrop-blur-sm transition-colors group-hover:bg-ember group-hover:text-night">
                      ▶
                    </span>
                  </span>
                  <span className="meta-label absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 to-transparent px-5 pb-4 pt-10 text-center text-ember">
                    {mission.videoLink.label} ↗
                  </span>
                </div>
              </a>
              <figcaption className="meta-label mt-3">
                {mission.videoLink.caption}
              </figcaption>
            </figure>
            {mission.stats ? (
              <dl className="hidden text-center md:block md:space-y-12">
                {mission.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="vhs-glow font-display text-6xl font-bold text-ember">
                      {stat.value}
                    </dd>
                    <dt className="meta-label mt-3">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </Reveal>
        </div>
      ) : null}

      {/* Photo essay sections */}
      <div className="mx-auto max-w-7xl space-y-24 px-5 py-24 sm:px-8 sm:space-y-32 sm:py-32">
        {mission.sections.map((section, si) => (
          <Reveal as="section" key={section.paragraphs[0]}>
            {/* desktop: text beside the photos, sides alternating by
                section; mobile keeps text above the photos */}
            <div
              className={
                section.imageSlots?.length
                  ? `md:grid md:items-center md:gap-14 ${
                      si % 2 === 1
                        ? "md:grid-cols-[5fr_4fr]"
                        : "md:grid-cols-[4fr_5fr]"
                    }`
                  : undefined
              }
            >
            <div className={si % 2 === 1 ? "md:order-2" : undefined}>
            {section.kicker ? <Kicker>{section.kicker}</Kicker> : null}
            <div className="mt-8 max-w-2xl space-y-6">
              {section.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85 md:text-xl md:leading-relaxed">
                  {linkCategory3(p)}
                </p>
              ))}
              {section.link ? (
                <Link
                  href={section.link.href}
                  className="mono-link inline-block text-sm font-bold text-ember"
                >
                  {section.link.label} →
                </Link>
              ) : null}
            </div>
            </div>
            {section.imageSlots?.length ? (
              <div
                className={`mt-14 grid gap-8 md:mt-0 ${
                  section.imageSlots.length === 1 ? "" : "sm:grid-cols-2"
                } ${si % 2 === 1 ? "md:order-1" : ""}`}
              >
                {section.imageSlots.map((slot) => {
                  const slotLink = mission.slotLinks?.[slot];
                  const hiddenMd = mission.desktopHiddenSlots?.includes(slot);
                  const media = (
                    <MediaSlot
                      key={slotLink ? undefined : slot}
                      name={slot}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className={hiddenMd ? "md:hidden" : ""}
                    />
                  );
                  if (!slotLink) return media;
                  return (
                    <a
                      key={slot}
                      href={slotLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative block ${hiddenMd ? "md:hidden" : ""}`}
                    >
                      {media}
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-night/60 px-6 text-center opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <span className="mono-link text-sm font-bold">
                          {slotLink.label}
                        </span>
                      </span>
                      <span className="meta-label mt-2 inline-block text-ember sm:hidden">
                        {slotLink.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : null}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Comment wall: real comments from the posted video as quote cards */}
      {mission.commentWall ? (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <Reveal>
            <Kicker>{mission.commentWall.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={mission.commentWall.heading} />
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-starlight/80">
              {mission.commentWall.intro}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mission.commentWall.comments.map((comment) => (
              <Reveal key={comment.text}>
                <figure className="flex h-full flex-col justify-between rounded-lg border border-dust/20 bg-night/50 p-6">
                  <blockquote className="font-display text-lg font-bold leading-snug">
                    “{comment.text}”
                  </blockquote>
                  <figcaption className="meta-label mt-5 text-ember">
                    {comment.handle}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          {mission.stats ? (
            <Reveal className="md:hidden">
              <dl className="mt-12 grid gap-10 rounded-lg border border-dust/15 bg-soot/40 px-5 py-12 text-center sm:grid-cols-3 sm:px-8">
                {mission.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="vhs-glow font-display text-5xl font-bold text-ember sm:text-6xl">
                      {stat.value}
                    </dd>
                    <dt className="meta-label mt-3">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </section>
      ) : null}

      {/* Creator testimonies: collapsed rows that open into the story
          and the receipts. YouTube receipts show their thumbnails;
          everything else becomes a link pill. */}
      {mission.testimonies ? (
        <section
          id="testimonies"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
        >
          <Reveal>
            <Kicker>{mission.testimonies.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={mission.testimonies.heading} />
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-starlight/80">
              {mission.testimonies.intro}
            </p>
            <div className="mt-12 max-w-3xl">
              {mission.testimonies.creators.map((creator) => (
                <details
                  key={creator.name}
                  className="group border-t border-dust/20 last:border-b"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-col">
                      <span className="font-display text-xl font-bold transition-colors group-hover:text-ember">
                        {creator.name}
                      </span>
                      <span className="meta-label mt-1.5 text-dust">
                        {creator.tag}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-ember transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pb-9">
                    <p className="max-w-2xl leading-relaxed text-starlight/80">
                      {creator.line}
                    </p>
                    <div className="mt-6 flex flex-wrap items-start gap-3">
                      {creator.links.map((link) => {
                        const yt = youtubeId(link.href);
                        if (yt) {
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/yt block w-full max-w-sm"
                            >
                              <div className="relative overflow-hidden rounded-lg border border-dust/20">
                                <Image
                                  src={`https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`}
                                  alt=""
                                  width={1280}
                                  height={720}
                                  sizes="24rem"
                                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover/yt:scale-[1.03]"
                                />
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-night/70 pl-1 text-lg text-starlight backdrop-blur-sm transition-colors group-hover/yt:bg-ember group-hover/yt:text-night">
                                    ▶
                                  </span>
                                </span>
                              </div>
                              <span className="meta-label mt-2 inline-block text-ember">
                                {link.label}
                              </span>
                            </a>
                          );
                        }
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meta-label rounded-full border border-dust/30 px-4 py-2.5 text-starlight/85 transition-colors hover:border-ember hover:text-ember"
                          >
                            {link.label} ↗
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Linked media: YouTube links show their real thumbnails */}
      <section className="border-t border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Kicker>Go deeper</Kicker>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mission.links.map((link) => {
              const yt = youtubeId(link.href);
              if (yt) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-dust/20">
                      <Image
                        src={`https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`}
                        alt=""
                        width={1280}
                        height={720}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-night/70 pl-1 text-xl text-starlight backdrop-blur-sm transition-colors group-hover:bg-ember group-hover:text-night">
                          ▶
                        </span>
                      </span>
                    </div>
                    <p className="mt-4 font-display text-lg font-bold leading-snug transition-colors group-hover:text-ember">
                      {link.label}
                    </p>
                  </a>
                );
              }
              const cardClass =
                "flex min-h-24 items-center rounded-xl border border-dust/20 bg-night/40 p-6 font-display text-lg font-bold leading-snug transition-colors hover:border-ember hover:text-ember";
              if (link.href.startsWith("/")) {
                return (
                  <Link key={link.href} href={link.href} className={cardClass}>
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
