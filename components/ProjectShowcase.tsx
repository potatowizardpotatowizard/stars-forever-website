import Image from "next/image";
import Link from "next/link";
import ProjectBurst from "@/components/ProjectBurst";
import Reveal from "@/components/Reveal";
import { MISSIONS, MISSIONS_INDEX } from "@/content/missions";
import { resolveSlot } from "@/lib/media";

// Six photos across the three projects, collaged around the video
const BURST_PHOTOS = [
  { src: "/images/tokyo-drift-car.jpg", alt: "" },
  { src: "/images/rt-abandoned-plane.jpg", alt: "" },
  { src: "/images/home-proof-beast-games.jpg", alt: "" },
  { src: "/images/rt-church.jpg", alt: "" },
  { src: "/images/tokyo-hitchhike.jpg", alt: "" },
  { src: "/images/beast-island-prayer.jpg", alt: "" },
];

// The Projects So Far: the bursting collage that becomes the Real
// Treasure preview, then the remaining projects as a vertical list.
// Shared by the home page and the partner projects page so both stay
// exactly in step.
export default function ProjectShowcase() {
  const projects = MISSIONS.filter(
    (m) => m.slug !== "revolutionary-cohort" && m.slug !== "real-treasure",
  ).map((m) => {
    const slot = resolveSlot(m.cardImageSlot);
    return {
      slug: m.slug,
      name: m.name,
      location: m.location,
      date: m.date,
      src: slot.src,
      alt: slot.alt,
      video: m.heroVideo ?? null,
      year: (m.date.match(/\d{4}/) ?? [""])[0],
    };
  });

  return (
    <>
      {/* heading, bursting photo collage, and the project list flow
          together as one continuous scene */}
      <ProjectBurst
        photos={BURST_PHOTOS}
        videoSrc="/brand/video/real-treasure-hero-bg.mp4"
        videoPoster="/images/real-treasure-hero.jpg"
        kicker={MISSIONS_INDEX.kicker}
        heading="The Projects So Far"
        intro={MISSIONS_INDEX.intro}
        project={{
          name: "Real Treasure",
          year: "2026",
          meta: "Iceland and Southern California · July 9 to 17, 2026",
          href: "/partner-projects/real-treasure",
        }}
      />
      <section className="relative z-20 mx-auto -mt-[18svh] max-w-5xl space-y-12 px-5 pb-20 sm:mt-0 sm:px-8 sm:pb-24 sm:pt-8">
        {projects.map((p) => (
          <Reveal key={p.slug}>
            <Link
              href={`/partner-projects/${p.slug}`}
              className="group relative block"
            >
              <div className="relative overflow-hidden rounded-xl border border-dust/25">
                {p.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={p.src ?? undefined}
                    aria-label={p.alt}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  >
                    <source src={p.video} type="video/mp4" />
                  </video>
                ) : p.src ? (
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={1500}
                    height={1000}
                    sizes="(min-width: 1024px) 60rem, 100vw"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent"
                />
                <div className="absolute bottom-0 left-0 p-5 text-left sm:p-9">
                  <p className="meta-label text-starlight/70">
                    Previous project · {p.year}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-ember sm:text-5xl">
                    {p.name}
                  </h3>
                  <p className="meta-label mt-3 hidden text-dust sm:block">
                    {p.location} · {p.date}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-starlight/40 text-base text-starlight backdrop-blur-sm transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-night sm:bottom-9 sm:right-9 sm:h-12 sm:w-12 sm:text-lg"
                >
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
        <Reveal className="pt-6 text-center">
          <p className="font-display text-3xl font-bold leading-snug text-starlight/85">
            The next project is unwritten.
          </p>
          <Link
            href="/apply"
            className="mono-link mt-6 inline-block text-sm font-bold text-ember"
          >
            Bring us your God dream →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
