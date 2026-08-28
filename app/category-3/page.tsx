import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Category3Ignite from "@/components/Category3Ignite";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { CATEGORY3 } from "@/content/category3";
import { resolveSlot } from "@/lib/media";

export const metadata: Metadata = {
  title: "Category 1, 2, & 3 Explained",
  description:
    "The educational framework behind Stars Forever: the difference between Category 1, 2, and 3 content, and why it matters.",
  openGraph: { images: [{ url: "/brand/og-category3.jpg", width: 1200, height: 630 }] },
};

export default function Category3Page() {
  return (
    <article>
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-black-meteor.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70 [mask-image:linear-gradient(to_bottom,black_55%,transparent_97%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night/70 [mask-image:linear-gradient(to_bottom,black_55%,transparent_97%)]"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pt-32 sm:px-8 sm:pt-44">
          <Kicker>{CATEGORY3.burningQuestion.kicker}</Kicker>
          <h1 className="mt-8 max-w-4xl font-display text-3xl leading-tight sm:text-5xl sm:leading-tight">
            {CATEGORY3.burningQuestion.heading}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-starlight/80">
            {CATEGORY3.burningQuestion.body}
          </p>
        </div>
        {/* Filmstrip of real Category 3 moments drifting along the hero */}
        <div className="relative mt-16 overflow-hidden pb-10">
          <div className="film-marquee">
            {[...CATEGORY3.filmstrip, ...CATEGORY3.filmstrip].map((frame, i) => {
              const media = resolveSlot(frame.slot);
              if (!media.src) return null;
              return (
                <Link
                  key={`${frame.slot}-${i}`}
                  href={frame.href}
                  tabIndex={i >= CATEGORY3.filmstrip.length ? -1 : 0}
                  aria-hidden={i >= CATEGORY3.filmstrip.length}
                  className="block shrink-0 overflow-hidden rounded-md border border-dust/25 opacity-60 transition-opacity duration-300 hover:opacity-100"
                >
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={320}
                    height={192}
                    sizes="14rem"
                    className="h-24 w-40 object-cover sm:h-28 sm:w-48"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* The three categories, under a faint starlight afterglow */}
      <section
        aria-label="The three categories"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[40vh] bg-[linear-gradient(to_bottom,transparent,rgb(239_236_247/0.06)_30%,rgb(239_236_247/0.02)_62%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Reveal>
          <h2 className="whitespace-nowrap font-display text-[7.2vw] font-bold sm:whitespace-normal sm:text-5xl">
            <GlitchText text="Which Creator Are You?" />
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {CATEGORY3.categories.map((cat, i) => {
            const isThree = i === 2;
            const card = (
                <div
                  className={`flex h-full flex-col border p-8 ${
                    isThree
                      ? "border-ember/60 bg-soot"
                      : "border-dust/20 bg-soot/40"
                  }`}
                >
                  <p
                    className={`meta-label ${isThree ? "text-ember" : ""}`}
                    style={isThree ? { color: "var(--color-ember)" } : undefined}
                  >
                    {cat.number}
                  </p>
                  <h2 className="mt-4 font-display text-2xl">{cat.name}</h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-starlight/70">
                    {cat.body}
                  </p>
                  <p className="meta-label mt-6">
                    Example:{" "}
                    <a
                      href={cat.exampleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember transition-colors hover:text-starlight"
                    >
                      {cat.example} ↗
                    </a>
                  </p>
                </div>
            );
            return (
              <Reveal as="li" key={cat.number}>
                {isThree ? <Category3Ignite>{card}</Category3Ignite> : card}
              </Reveal>
            );
          })}
        </ol>
        </div>
      </section>

      {/* The mechanism: three practical paths */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{CATEGORY3.mechanism.kicker}</Kicker>
          <h2 className="mt-6 max-w-2xl font-display text-4xl sm:text-5xl">
            <GlitchText text={CATEGORY3.mechanism.heading} />
          </h2>
        </Reveal>
        <div className="mt-16 space-y-16">
          {CATEGORY3.mechanism.paths.map((path, i) => (
            <Reveal key={path.title}>
              <div className="grid gap-6 pt-10 md:grid-cols-[auto_1fr] md:gap-14">
                <p className="font-display text-5xl text-ember/70">{i + 1}</p>
                <div className="max-w-2xl">
                  <h3 className="font-display text-2xl sm:text-3xl">
                    {path.title}
                  </h3>
                  <p className="mt-5 leading-relaxed text-starlight/80">
                    {path.body}
                  </p>
                  <a
                    href={path.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-label mt-6 inline-block text-ember transition-colors hover:text-starlight"
                  >
                    {path.videoLabel}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <Link
            href="/podcast"
            className="meta-label inline-block text-dust transition-colors hover:text-ember"
          >
            Respectfully Inspired Podcast →
          </Link>
        </Reveal>
      </section>

      {/* Close */}
      <section className="bg-gradient-to-b from-transparent via-soot/50 to-transparent">
        <div className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <Image
              src="/brand/star-sharp.png"
              alt=""
              width={44}
              height={44}
              className="vhs-glow mx-auto"
            />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl sm:text-5xl">
              {CATEGORY3.closing.heading}
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {CATEGORY3.closing.ctas.map((cta) => (
                <Cta key={cta.href} href={cta.href}>
                  {cta.label}
                </Cta>
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
    </article>
  );
}
