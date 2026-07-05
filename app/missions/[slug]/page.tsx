import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import { MISSIONS } from "@/content/missions";

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

  return (
    <article>
      {/* Full bleed hero */}
      <header className="relative flex min-h-[70svh] items-end overflow-hidden">
        <MediaSlot name={mission.heroSlot} fill priority />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night"
        />
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
            </div>
            {section.imageSlots?.length ? (
              <div
                className={`mt-14 grid gap-8 ${
                  section.imageSlots.length === 1
                    ? ""
                    : section.imageSlots.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2"
                }`}
              >
                {section.imageSlots.map((slot) => (
                  <MediaSlot
                    key={slot}
                    name={slot}
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                ))}
              </div>
            ) : null}
          </Reveal>
        ))}
      </div>

      {/* Linked media */}
      <section className="border-t border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Kicker>Go deeper</Kicker>
          <ul className="mt-8 space-y-4">
            {mission.links.map((link) =>
              link.href.startsWith("/") ? (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display text-xl text-starlight transition-colors hover:text-ember"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-xl text-starlight transition-colors hover:text-ember"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>
    </article>
  );
}
