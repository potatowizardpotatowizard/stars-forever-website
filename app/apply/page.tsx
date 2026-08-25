import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import ApplyForm from "@/components/ApplyForm";
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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/25 to-night"
        />
        <Grain />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pt-32">
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

      {/* What happens next: the three steps after the button */}
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <Kicker>What happens next</Kicker>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Submit the dream",
              b: "Three questions is all it takes. We read every single one.",
            },
            {
              n: "02",
              t: "We book a call",
              b: "A call is not a commitment. It is a place to give your vision a chance.",
            },
            {
              n: "03",
              t: "We build it together",
              b: "If it is a fit, we plan it, fund it, and film it with you.",
            },
          ].map((step) => (
            <li key={step.n} className="border-t border-dust/20 pt-5">
              <p className="meta-label text-ember">{step.n}</p>
              <p className="mt-2 font-display text-xl font-bold">{step.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-starlight/70">
                {step.b}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Proof: dreams that came through this exact form */}
      <section className="border-t border-dust/10 bg-soot/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>Dreams that started right here</Kicker>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
            {[
              {
                href: "/partner-projects/real-treasure",
                slot: "real-treasure-card",
                name: "Real Treasure",
                line: "6.7M+ views across platforms",
              },
              {
                href: "/partner-projects/tokyo-drift",
                slot: "home-proof-tokyo",
                name: "Tokyo Drift",
                line: "A gospel video for a secular audience",
              },
              {
                href: "/partner-projects/beast-games",
                slot: "home-proof-beast-games",
                name: "Beast Games",
                line: "Prayer on the world's biggest stage",
              },
            ].map((proj) => (
              <Link key={proj.href} href={proj.href} className="group block">
                <MediaSlot
                  name={proj.slot}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  showCaption={false}
                  className="overflow-hidden rounded-lg border border-dust/20"
                />
                <p className="mt-4 font-display text-xl font-bold transition-colors group-hover:text-ember">
                  {proj.name}
                </p>
                <p className="meta-label mt-1 text-dust">{proj.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
