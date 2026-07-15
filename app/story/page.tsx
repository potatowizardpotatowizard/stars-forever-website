import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import StoryJourney from "@/components/StoryJourney";
import { STORY } from "@/content/story";
import { FOUNDERS } from "@/content/site";
import { resolveSlot } from "@/lib/media";

export const metadata: Metadata = {
  title: "The Story",
  description:
    "Seven days before Beast Games season one, Auzi's brother died. What happened next became Stars Forever.",
  openGraph: { images: [{ url: "/brand/og-story.jpg", width: 1200, height: 630 }] },
};

export default function StoryPage() {
  return (
    <article>
      {/* Opening: quiet, typographic, held by a dark starfield */}
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-black-stars.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/50 via-night/30 to-night"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
          <p className="meta-label">
            {STORY.meta.where} · {STORY.meta.when}
          </p>
          <h1 className="mt-8 max-w-4xl font-display text-4xl leading-tight sm:text-6xl sm:leading-tight">
            {STORY.intro}
          </h1>
        </div>
      </header>

      {/* The journey: chapters scattered across the sky, a guiding star
          traveling the constellation between them, ending at the cross */}
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <StoryJourney
          beats={STORY.beats.map((beat) => {
            const slot = resolveSlot(beat.imageSlot);
            return {
              src: slot.src ?? "",
              alt: slot.alt,
              ratio: slot.ratio,
              paragraphs: beat.paragraphs,
            };
          })}
          tribute={{
            src: resolveSlot(STORY.tribute.imageSlot).src ?? "",
            alt: resolveSlot(STORY.tribute.imageSlot).alt,
            lines: STORY.tribute.lines,
          }}
        />
      </div>

      {/* Bridge into the vision */}
      <section className="border-t border-dust/15 bg-soot/40">
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

      {/* The three cofounders */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{STORY.founders.kicker}</Kicker>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            <GlitchText text={STORY.founders.heading} />
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
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
            </Reveal>
          ))}
        </div>
        <div className="mt-24 flex justify-center">
          <Image
            src="/brand/star-sharp.png"
            alt=""
            width={44}
            height={44}
            className="vhs-glow"
          />
        </div>
      </section>
    </article>
  );
}
