import type { Metadata } from "next";
import Image from "next/image";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import Constellation from "@/components/Constellation";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import StoryConnector from "@/components/StoryConnector";
import { STORY } from "@/content/story";
import { FOUNDERS } from "@/content/site";

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

      {/* Photo essay beats, threaded on a constellation that draws itself */}
      <div className="relative mx-auto max-w-7xl px-5 pt-4 sm:px-8">
        <div className="space-y-14 sm:space-y-16">
          {STORY.beats.map((beat, i) => (
            <Reveal as="section" key={beat.imageSlot} className="relative">
              <Constellation
                variant={(["a", "b", "c"] as const)[i % 3]}
                className={`hidden lg:block ${
                  i % 2 === 0 ? "-left-2 top-10" : "-right-2 top-16"
                }`}
              />
              <div aria-hidden="true" className="story-node hidden md:flex">
                <StoryConnector variant={(["a", "b", "c"] as const)[i % 3]} />
                <Image
                  src="/brand/star-sharp.png"
                  alt=""
                  width={20}
                  height={20}
                  className="story-star"
                />
              </div>
              <MediaSlot
                name={beat.imageSlot}
                sizes="(min-width: 1280px) 1216px, 100vw"
                priority={i === 0}
                className="overflow-hidden rounded-xl"
              />
              <div className="mx-auto mt-12 max-w-2xl space-y-6">
                {beat.paragraphs.map((p) => (
                  <p key={p} className="text-lg leading-relaxed text-starlight/85">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Tribute: maximum reverence, held by its own quiet star */}
      <section
        aria-label="Tribute"
        className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36"
      >
        <Reveal className="mx-auto max-w-lg">
          <div aria-hidden="true" className="story-node hidden md:flex">
            <StoryConnector variant="d" />
            <Image
              src="/brand/star-sharp.png"
              alt=""
              width={20}
              height={20}
              className="story-star"
            />
          </div>
          <div className="tribute-glow overflow-hidden rounded-xl">
            <MediaSlot
              name={STORY.tribute.imageSlot}
              showCaption={false}
              sizes="32rem"
            />
          </div>
          <div className="mt-12 space-y-3 text-center">
            {STORY.tribute.lines.map((line) => (
              <p key={line} className="font-display text-xl text-starlight/90">
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

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
            <MediaSlot
              name={STORY.vision.imageSlot}
              sizes="(min-width: 1280px) 1216px, 100vw"
              showCaption={false}
            />
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
