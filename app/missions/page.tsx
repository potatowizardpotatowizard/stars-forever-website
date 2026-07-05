import type { Metadata } from "next";
import Link from "next/link";
import Kicker from "@/components/Kicker";
import MediaSlot from "@/components/MediaSlot";
import Reveal from "@/components/Reveal";
import { MISSIONS, MISSIONS_INDEX } from "@/content/missions";

export const metadata: Metadata = {
  title: "Missions",
  description:
    "Documentary case studies of God moving through creators: Tokyo Drift, the Revolutionary Cohort in Joshua Tree, and Beast Games.",
};

export default function MissionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-44 sm:px-8">
      <header>
        <Kicker>{MISSIONS_INDEX.kicker}</Kicker>
        <h1 className="mt-8 font-display text-5xl sm:text-6xl">
          {MISSIONS_INDEX.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-starlight/80">
          {MISSIONS_INDEX.intro}
        </p>
      </header>

      <div className="mt-20 space-y-20">
        {MISSIONS.map((mission, i) => (
          <Reveal key={mission.slug}>
            <Link
              href={`/missions/${mission.slug}`}
              className="group grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <MediaSlot
                name={mission.cardImageSlot}
                sizes="(min-width: 768px) 50vw, 100vw"
                showCaption={false}
                className={i % 2 === 1 ? "md:order-2" : ""}
              />
              <div>
                <dl className="meta-label space-y-1">
                  <div className="flex gap-2">
                    <dt className="sr-only">Location</dt>
                    <dd>{mission.location}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Date</dt>
                    <dd>{mission.date}</dd>
                  </div>
                </dl>
                <h2 className="mt-5 font-display text-4xl transition-colors group-hover:text-ember">
                  {mission.name}
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-starlight/75">
                  {mission.summary}
                </p>
                <span className="meta-label mt-7 inline-block text-ember">
                  Read the case study
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
