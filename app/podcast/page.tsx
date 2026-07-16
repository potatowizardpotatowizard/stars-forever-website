import type { Metadata } from "next";
import Image from "next/image";
import Cta from "@/components/Cta";
import GlitchText from "@/components/GlitchText";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";
import { PODCAST } from "@/content/podcast";

export const metadata: Metadata = {
  title: "Respectfully Inspired Podcast",
  description: PODCAST.tagline,
  openGraph: {
    images: [{ url: "/brand/og-podcast.jpg", width: 1200, height: 630 }],
  },
};

// Pull the YouTube id out of an href so episodes show real thumbnails
function youtubeId(href: string): string | null {
  const m = href.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{6,})/);
  return m ? m[1] : null;
}

export default function PodcastPage() {
  return (
    <article>
      {/* Hero: behind the mic */}
      <header className="relative overflow-hidden">
        <Image
          src="/images/podcast-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/50 via-night/30 to-night"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-44 sm:px-8">
          <Kicker>{PODCAST.kicker}</Kicker>
          <h1 className="mt-6 font-display text-5xl font-bold sm:text-7xl">
            {PODCAST.title}
          </h1>
          <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {PODCAST.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Cta href={PODCAST.channelUrl}>{PODCAST.channelCta}</Cta>
            {PODCAST.listen.map((p) => (
              <Cta key={p.href} href={p.href} variant="ghost">
                {p.label}
              </Cta>
            ))}
          </div>
        </div>
      </header>

      {/* Episodes with real thumbnails, under the hero's blue afterglow */}
      <section className="relative overflow-hidden border-b border-dust/15">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[40vh] bg-[linear-gradient(to_bottom,rgb(30_64_175/0.3),rgb(30_64_175/0.1)_45%,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <Kicker>{PODCAST.episodes.kicker}</Kicker>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              <GlitchText text={PODCAST.episodes.heading} />
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {PODCAST.episodes.items.map((ep) => {
              const yt = youtubeId(ep.href);
              return (
                <Reveal key={ep.href}>
                  <a
                    href={ep.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {yt ? (
                      <div className="relative overflow-hidden rounded-xl border border-dust/20">
                        <Image
                          src={`https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`}
                          alt=""
                          width={1280}
                          height={720}
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-night/70 pl-1 text-xl text-starlight backdrop-blur-sm transition-colors group-hover:bg-ember group-hover:text-night">
                            ▶
                          </span>
                        </span>
                      </div>
                    ) : null}
                    <p className="meta-label mt-5">{ep.guest}</p>
                    <p className="mt-2 font-display text-xl font-bold leading-snug transition-colors group-hover:text-ember">
                      {ep.title}
                    </p>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why it exists */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="grid items-center gap-10 md:grid-cols-[16rem_1fr] md:gap-16">
          <Image
            src="/images/podcast-hat.jpg"
            alt="A lighthearted moment behind the mic"
            width={640}
            height={958}
            sizes="16rem"
            className="hidden rounded-xl md:block"
          />
          <div className="max-w-2xl">
            <Kicker>{PODCAST.why.kicker}</Kicker>
            <div className="mt-8 space-y-5">
              {PODCAST.why.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-starlight/85">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <Cta href={PODCAST.channelUrl} variant="ghost">
                {PODCAST.channelCta}
              </Cta>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
