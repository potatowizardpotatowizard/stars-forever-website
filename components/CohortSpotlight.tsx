import Image from "next/image";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
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
        <Reveal className="text-center">
          <Kicker>Recent Work</Kicker>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            <GlitchText text="Revolutionary Cohort" />
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-starlight/80">
            The Revolutionary Cohort is a catalytic experience designed to
            introduce creators to a missionary lifestyle.
          </p>
        </Reveal>

        {/* the dusk video, the door to the program */}
        <Reveal className="mx-auto mt-12 max-w-3xl">
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
                <p className="meta-label text-starlight/70">The program</p>
                <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember sm:text-4xl">
                  Revolutionary Cohort
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

        {/* the ten creators, an optional sideways scroll */}
        <Reveal className="mt-14">
          <p className="meta-label text-center text-dust">
            The ten creators who attended · scroll →
          </p>
          <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        {/* the first event */}
        <Reveal className="mx-auto mt-14 max-w-2xl text-center">
          <p className="meta-label text-ember">
            Cohort 1 · Joshua Tree, California · May 15 to 17, 2026
          </p>
          <p className="mt-4 text-lg leading-relaxed text-starlight/80">
            Ten creators in the desert for a weekend of teaching, prayer,
            shared meals, and collaboration. It began at a house together and
            ended under the stars.
          </p>
          <Link
            href="/partner-projects/revolutionary-cohort"
            className="mono-link mt-6 inline-block text-sm font-bold text-ember"
          >
            Read about the first cohort →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
