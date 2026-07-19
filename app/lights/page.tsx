import type { Metadata } from "next";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import LightsSky from "@/components/LightsSky";
import Reveal from "@/components/Reveal";
import { getLights } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Wall of Light",
  description:
    "A shared night sky. Every light is a prayer someone left. Tap to add yours.",
};

// New lights appear for everyone within a minute.
export const revalidate = 60;

export default async function LightsPage() {
  const { points, count, capped } = await getLights();
  return (
    <article className="relative overflow-hidden">
      <Grain />
      <header className="mx-auto max-w-7xl px-5 pt-44 text-center sm:px-8">
        <Reveal>
          <Kicker>Wall of Light</Kicker>
          <h1 className="mt-6 font-display text-5xl font-bold sm:text-6xl">
            Leave a light on
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-starlight/75">
            Every point in this sky is a prayer someone left behind. No names,
            no feed. Tap anywhere to add yours.
          </p>
          <p className="meta-label mt-6 text-ember">
            {count.toLocaleString()}
            {capped ? "+" : ""} lights and counting
          </p>
        </Reveal>
      </header>
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8">
        <div className="overflow-hidden rounded-xl border border-dust/20 bg-night/60">
          <LightsSky points={points} />
        </div>
        <p className="meta-label mt-4 text-center text-dust/60">
          “Let your light so shine before men…” — Matthew 5:16
        </p>
      </section>
    </article>
  );
}
