import type { Metadata } from "next";
import PageAmbience from "@/components/PageAmbience";
import { Suspense } from "react";
import ConstellationForm from "@/components/ConstellationForm";
import ConstellationGlobe from "@/components/ConstellationGlobe";
import SendStar from "@/components/SendStar";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { CONSTELLATION } from "@/content/constellation";
import { getAcceptedMembers } from "@/lib/notion";

export const metadata: Metadata = {
  title: "The Constellation",
  description: CONSTELLATION.intro,
};

// Refresh from Notion every 5 minutes: flipping a request to
// "Accepted" there places its star on the map with no code change.
export const revalidate = 300;

export default async function ConstellationPage() {
  const members = await getAcceptedMembers();
  return (
    <article className="relative">
      <PageAmbience rgb="109 40 217" />
      {/* The page IS the flight: hero copy floats in the void, then
          scrolling assembles the world */}
      <ConstellationGlobe members={members} />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <Kicker>{CONSTELLATION.how.kicker}</Kicker>
        </Reveal>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {CONSTELLATION.how.items.map((item, i) => (
            <Reveal as="li" key={item}>
              <div className="border-t border-dust/20 pt-6">
                <p className="meta-label text-ember">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 leading-relaxed text-starlight/80">{item}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Join form */}
      <section className="bg-gradient-to-b from-transparent via-soot/50 to-transparent">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <Kicker>{CONSTELLATION.form.kicker}</Kicker>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold">
              {CONSTELLATION.form.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-starlight/70">
              {CONSTELLATION.form.sub}
            </p>
            <div className="mt-12">
              <ConstellationForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Send a star. NOT inside a Reveal: the arrival takeover uses
          position fixed, which a transformed ancestor would capture. */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Suspense>
          <SendStar />
        </Suspense>
      </section>
    </article>
  );
}
