import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import ParallaxLayer from "@/components/ParallaxLayer";
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
        <ParallaxLayer className="absolute inset-0">
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
        </ParallaxLayer>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/45 via-transparent to-night/90"
        />
        <Grain />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-44 sm:px-8">
          <h1 className="font-display text-5xl sm:text-7xl">
            <GlitchText text={mission.name} />
          </h1>
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
              <dd className="mt-2 text-sm text-starlight/85">{value}</dd>
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

      {/* Photo essay sections */}
      <div className="mx-auto max-w-7xl space-y-24 px-5 py-24 sm:px-8 sm:space-y-32 sm:py-32">
        {mission.sections.map((section) => (
          <Reveal as="section" key={section.paragraphs[0]}>
            {section.kicker ? <Kicker>{section.kicker}</Kicker> : null}
            <div className="mt-8 max-w-2xl space-y-6">
              {section.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85">
                  {p}
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
            {section.imageSlots?.length ? (
              <div
                className={`mt-14 grid gap-8 ${
                  section.imageSlots.length === 1 ? "" : "sm:grid-cols-2"
                }`}
              >
                {section.imageSlots.map((slot) => {
                  const slotLink = mission.slotLinks?.[slot];
                  const media = (
                    <MediaSlot
                      key={slotLink ? undefined : slot}
                      name={slot}
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  );
                  if (!slotLink) return media;
                  return (
                    <a
                      key={slot}
                      href={slotLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block"
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
          </Reveal>
        ))}
      </div>

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
