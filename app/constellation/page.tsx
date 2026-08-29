import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import ConstellationForm from "@/components/ConstellationForm";
import ConstellationGlobe from "@/components/ConstellationGlobe";
import SendStar from "@/components/SendStar";
import Grain from "@/components/Grain";
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
    <article>
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-black-sparkle.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent_97%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/25 to-night/70 [mask-image:linear-gradient(to_bottom,black_55%,transparent_97%)]"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-44">
          <Kicker>{CONSTELLATION.kicker}</Kicker>
          <h1 className="mt-6 font-display text-5xl font-bold sm:text-6xl">
            {CONSTELLATION.title}
          </h1>
          <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {CONSTELLATION.intro}
          </p>
        </div>
      </header>

      {/* The map */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <Reveal>
          <ConstellationGlobe members={members} />
        </Reveal>
      </section>

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
