import type { Metadata } from "next";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import JourneyScene, { type JourneyItem } from "@/components/JourneyScene";
import JourneyThread from "@/components/JourneyThread";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { STORY } from "@/content/story";
import { FOUNDERS, GIVING_URL } from "@/content/site";
import { resolveSlot } from "@/lib/media";

export const metadata: Metadata = {
  title: "The Story",
  description:
    "Seven days before Beast Games, Auzi's brother died. What happened next became Stars Forever.",
  openGraph: { images: [{ url: "/brand/og-story.jpg", width: 1200, height: 630 }] },
};

export default function StoryPage() {
  // The whole story is the flight: the old header is now the opening
  // plane of the journey, so the page begins already inside it.
  const photo = (slot: string): JourneyItem => {
    const s = resolveSlot(slot);
    return { kind: "photo", src: s.src ?? "", alt: s.alt };
  };
  const items: JourneyItem[] = [
    { kind: "title", title: STORY.intro, sub: "" },
  ];
  STORY.beats.forEach((beat) => {
    items.push(photo(beat.imageSlot));
    items.push({ kind: "beat", paragraphs: beat.paragraphs });
  });
  items.push(photo(STORY.tribute.imageSlot));
  items.push({ kind: "beat", paragraphs: STORY.tribute.lines });

  return (
    <article>
      <JourneyScene items={items} />
      <JourneyThread />


      {/* Bridge into the vision */}
      <section className="bg-gradient-to-b from-transparent via-soot/50 to-transparent">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="mx-auto max-w-2xl">
            <Kicker>{STORY.vision.kicker}</Kicker>
            <div className="mt-8 space-y-6">
              {STORY.vision.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="/podcast"
              className="meta-label mt-10 inline-block text-dust transition-colors hover:text-ember"
            >
              Respectfully Inspired Podcast →
            </Link>
          </Reveal>
          <Reveal className="mt-16">
            <Link
              href="/partner-projects/revolutionary-cohort"
              className="group relative block"
            >
              <MediaSlot
                name={STORY.vision.imageSlot}
                sizes="(min-width: 1280px) 1216px, 100vw"
                showCaption={false}
                className="overflow-hidden rounded-xl"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-night/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="mono-link text-sm font-bold">Learn More ▶</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* The two cofounders */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{STORY.founders.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            <GlitchText text={STORY.founders.heading} />
          </h2>
        </Reveal>
        <div className="mt-14 grid max-w-4xl gap-10 sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <Reveal key={f.name}>
              <MediaSlot
                name={f.imageSlot}
                sizes="(min-width: 640px) 33vw, 100vw"
                showCaption={false}
              />
              <h3 className="mt-6 font-display text-2xl">
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ember"
                  >
                    {f.name}
                  </a>
                ) : (
                  f.name
                )}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-starlight/70">
                {f.line}
              </p>
              {"instagram" in f && f.instagram ? (
                <a
                  href={f.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-label mt-3 inline-block text-ember transition-colors hover:text-starlight"
                >
                  Instagram ↗
                </a>
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Help write the next chapter */}
      <section className="bg-gradient-to-b from-transparent via-soot/50 to-transparent">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-4xl">
              {STORY.give.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-starlight/75">
              {STORY.give.body}
            </p>
            <div className="mt-9">
              <Cta href={GIVING_URL ?? "/get-involved"}>{STORY.give.cta}</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
