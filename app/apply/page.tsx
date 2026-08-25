import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import ProofConstellation from "@/components/ProofConstellation";
import ApplyForm from "@/components/ApplyForm";
import GalaxyHero from "@/components/GalaxyHero";
import DreamStars from "@/components/DreamStars";
import Grain from "@/components/Grain";
import Kicker from "@/components/Kicker";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for a Partner Project: a specific project that shares Jesus with a secular audience. It costs you nothing.",
  openGraph: { images: [{ url: "/brand/og-partner.jpg", width: 1200, height: 630 }] },
};

export default function ApplyPage() {
  return (
    <article>
      <header className="relative overflow-hidden">
        <Image
          src="/brand/bg-purple-meteor.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <GalaxyHero />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/25 to-night"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pb-44 pt-32 sm:px-8 sm:pb-56 sm:pt-40">
          <Kicker>Partner Project</Kicker>
          <h1 className="mt-6 font-display text-5xl font-bold sm:text-6xl">
            Bring Us Your God Dream
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-starlight/80">
            Three short questions and we will take it from there. Prefer to
            talk first?{" "}
            <a
              href={CONTACT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember transition-colors hover:text-starlight"
            >
              Book a call
            </a>
            .
          </p>
        </div>
      </header>

      {/* the star choreography flows straight into the application:
          same night sky, no seam, the merged star pointing down at
          the first question */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8 sm:pb-20">
        <DreamStars />
        <div className="mt-2">
          <ApplyForm />
        </div>
      </section>

      {/* Proof: dreams that came through this exact form */}
      <section className="border-t border-dust/10 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>Dreams that started right here</Kicker>
          <ProofConstellation>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
            {[
              {
                href: "/partner-projects/real-treasure",
                slot: "real-treasure-card",
                name: "Real Treasure",
                line: "A treasure hunt from Southern California to Iceland that put Jesus in front of millions.",
              },
              {
                href: "/partner-projects/tokyo-drift",
                slot: "home-proof-tokyo",
                name: "Tokyo Drift",
                line: "Thirty days in Japan that became the blueprint for sharing Jesus on secular YouTube.",
              },
              {
                href: "/partner-projects/beast-games",
                slot: "home-proof-beast-games",
                name: "Beast Games",
                line: "Podcasts filmed around the biggest show on earth, carrying Jesus to a secular fanbase.",
              },
            ].map((proj) => (
              <Link
                key={proj.href}
                href={proj.href}
                className="group relative z-10 block will-change-transform"
              >
                <MediaSlot
                  name={proj.slot}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  showCaption={false}
                  className="overflow-hidden rounded-lg border border-dust/20"
                />
                <p className="mt-4 font-display text-xl font-bold transition-colors group-hover:text-ember">
                  {proj.name}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-starlight/70">{proj.line}</p>
              </Link>
            ))}
          </div>
          </ProofConstellation>
        </div>
      </section>
    </article>
  );
}
