import type { Metadata } from "next";
import Image from "next/image";
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
    </article>
  );
}
