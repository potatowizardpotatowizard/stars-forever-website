import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import StarMark from "@/components/StarMark";
import { CATEGORY3 } from "@/content/category3";

export const metadata: Metadata = {
  title: "Category 3",
  description:
    "The Stars Forever framework: creators whose work connects with secular culture while intentionally weaving in the Gospel.",
};

export default function Category3Page() {
  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
        <Kicker>{CATEGORY3.burningQuestion.kicker}</Kicker>
        <h1 className="mt-8 max-w-4xl font-display text-3xl leading-tight sm:text-5xl sm:leading-tight">
          {CATEGORY3.burningQuestion.heading}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-starlight/80">
          {CATEGORY3.burningQuestion.body}
        </p>
      </header>

      {/* The three categories as a horizontal progression */}
      <section
        aria-label="The three categories"
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8"
      >
        <ol className="grid gap-6 md:grid-cols-3">
          {CATEGORY3.categories.map((cat, i) => {
            const isThree = i === 2;
            return (
              <Reveal as="li" key={cat.number}>
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
                  <p className="meta-label mt-6">{cat.example}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* The mechanism: three practical paths */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Kicker>{CATEGORY3.mechanism.kicker}</Kicker>
          <h2 className="mt-6 max-w-2xl font-display text-4xl sm:text-5xl">
            {CATEGORY3.mechanism.heading}
          </h2>
        </Reveal>
        <div className="mt-16 space-y-16">
          {CATEGORY3.mechanism.paths.map((path, i) => (
            <Reveal key={path.title}>
              <div className="grid gap-6 border-t border-dust/15 pt-10 md:grid-cols-[auto_1fr] md:gap-14">
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
      </section>

      {/* Close */}
      <section className="border-t border-dust/15 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <StarMark className="mx-auto h-4 w-4 text-ember" />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-4xl sm:text-5xl">
              {CATEGORY3.closing.heading}
            </h2>
            <div className="mt-10">
              <Cta href={CATEGORY3.closing.href}>{CATEGORY3.closing.cta}</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
