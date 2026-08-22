import Image from "next/image";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import Cta from "@/components/Cta";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { MISSIONS } from "@/content/missions";

// Recent work: the Revolutionary Cohort. The dusk video leads and
// links to the program page, the ten creators wait in an optional
// sideways scroll, and the first event closes the section.
export default function CohortSpotlight() {
  const cohort = MISSIONS.find((m) => m.slug === "revolutionary-cohort");
  const people = cohort?.roster?.people ?? [];

  return (
    <section className="relative overflow-hidden">
      <Grain />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="md:grid md:grid-cols-[2fr_3fr] md:items-center md:gap-14">
        <Reveal className="text-center md:text-left">
          <Kicker>Recent Work</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text="Revolutionary Cohort" />
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80 md:mx-0">
            A catalytic event designed to introduce creators to a missionary
            lifestyle.
          </p>
        </Reveal>

        {/* the dusk video, the door to the program */}
        <Reveal className="mx-auto mt-12 max-w-3xl md:mt-0 md:max-w-none">
          <Link href="/revolutionary" className="group relative block">
            <div className="relative overflow-hidden rounded-xl border border-dust/25">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/joshua-hero.jpg"
                className="block aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              >
                <source src="/brand/video/cohort-dusk.mp4" type="video/mp4" />
              </video>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
              />
              <div className="absolute bottom-0 left-0 p-5 text-left sm:p-8">
                <p className="meta-label text-starlight/70">Revolutionary Cohort</p>
                <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember sm:text-4xl">
                  Learn More
                </h3>
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-starlight/40 text-base text-starlight backdrop-blur-sm transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-night sm:bottom-8 sm:right-8 sm:h-11 sm:w-11"
              >
                →
              </span>
            </div>
          </Link>
        </Reveal>
        </div>

        {/* the ten creators, an optional sideways scroll */}
        <Reveal className="mt-14">
          <p className="meta-label text-center text-dust">
            The ten creators who attended · scroll →
          </p>
          <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:mx-auto md:max-w-[74rem] [&::-webkit-scrollbar]:hidden">
            {people.map((person) => {
              const platform = person.href.includes("instagram")
                ? "Instagram"
                : person.href.includes("youtube")
                  ? "YouTube"
                  : "Website";
              return (
                <li key={person.name} className="w-48 shrink-0 snap-start sm:w-56">
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

        {/* the first event, right under the creators who lived it */}
        <Reveal className="mt-4 text-center">
          <Cta href="/partner-projects/revolutionary-cohort" variant="ghost">
            Read About The First Event
          </Cta>
        </Reveal>

        {/* the next one */}
        <Reveal className="mx-auto mt-16 max-w-3xl text-center sm:mt-20 md:grid md:max-w-none md:grid-cols-[3fr_2fr] md:grid-rows-[auto_auto] md:items-center md:gap-x-14 md:text-left">
          <p className="font-display text-2xl font-bold text-starlight/90 sm:text-3xl md:col-start-2 md:row-start-1 md:self-end">
            The next cohort is coming soon.
          </p>
          <figure className="mt-8 md:col-start-1 md:row-start-1 md:row-span-2 md:mt-0">
            <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-soot">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/brand/poster-cohort-montage.jpg"
                className="block aspect-video w-full object-cover"
              >
                <source src="/brand/video/cohort-montage.mp4" type="video/mp4" />
              </video>
            </div>
            <figcaption className="meta-label mt-3 text-left">
              <span className="star-underline">scenes from the first cohort</span>
            </figcaption>
          </figure>
          <div className="md:col-start-2 md:row-start-2 md:self-start">
          <Link
            href="/apply"
            className="mono-link mt-8 inline-block text-sm font-bold text-ember md:hidden"
          >
            Apply to be part of it
          </Link>
          <div className="mt-8 hidden md:block">
            <Cta href="/apply">Apply to be part of it</Cta>
          </div>
          <p className="mt-12 text-sm text-starlight/75 md:mt-8">
            In collaboration with{" "}
            <a
              href="https://steiger.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ember underline decoration-ember/40 underline-offset-4 transition-colors hover:text-starlight"
            >
              Steiger ↗
            </a>
          </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
