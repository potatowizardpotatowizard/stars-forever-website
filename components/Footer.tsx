"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ANCHOR_VERSE,
  CONTACT,
  GIVING_URL,
  SITE_NAME,
  SOCIAL,
} from "@/content/site";
import FooterConstellation from "@/components/FooterConstellation";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";
import StarVerse from "@/components/StarVerse";

export default function Footer() {
  // The strategy page is its own product: no mission updates, explore,
  // or contact columns there. Everywhere else, the full footer.
  const minimal = usePathname() === "/strategy";

  if (minimal) {
    return (
      <footer className="relative">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <Reveal>
                <Image
                  src="/brand/logo-full.png"
                  alt={SITE_NAME}
                  width={220}
                  height={124}
                  className="logo-wipe vhs-glow -ml-3"
                />
              </Reveal>
              <p className="mt-5 max-w-sm font-meta text-sm leading-relaxed text-dust">
                {ANCHOR_VERSE.text}
              </p>
              <p className="meta-label mt-3">{ANCHOR_VERSE.reference}</p>
            </div>
            <div className="md:col-start-4">
              <h2 className="meta-label">Email</h2>
              <p className="mt-4 text-sm text-starlight/85">
                <a
                  href="mailto:flixforauzi@gmail.com"
                  className="inline-block py-1.5 -my-1.5 transition-colors hover:text-ember"
                >
                  flixforauzi@gmail.com
                </a>
              </p>
              <h2 className="meta-label mt-8">Follow</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-1.5 -my-1.5 transition-colors hover:text-ember"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="meta-label mt-16">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative">
      {/* the anchor verse, written in stars as the final scene */}
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <StarVerse />
        <p className="mx-auto mt-7 max-w-xl text-center font-meta text-xs leading-relaxed text-dust">
          {ANCHOR_VERSE.text}
        </p>
        <p className="meta-label mt-3 text-center">{ANCHOR_VERSE.reference}</p>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-5 md:gap-10">
          <div className="order-3 md:order-none md:col-span-2">
            <Reveal>
              <Image
                src="/brand/logo-full.png"
                alt={SITE_NAME}
                width={220}
                height={124}
                className="logo-wipe vhs-glow -ml-3"
              />
            </Reveal>
            <h2 className="meta-label mt-8">Mission updates</h2>
            <p className="mt-2 max-w-sm text-sm text-starlight/70">
              Field notes from the mission, straight to your inbox. No noise.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>

          <div className="order-1 md:order-none md:col-span-2">
            <FooterConstellation />
          </div>

          <div className="order-2 grid grid-cols-2 gap-10 md:order-none md:block">
            <div>
              <h2 className="meta-label">Contact</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
                <li>
                  <a
                    href={`mailto:${CONTACT.primaryEmail}`}
                    className="inline-block break-all py-1.5 -my-1.5 transition-colors hover:text-ember"
                  >
                    {CONTACT.primaryEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 -my-1.5 transition-colors hover:text-ember"
                  >
                    Book a Call
                  </a>
                </li>
                {GIVING_URL ? (
                  <li>
                    <a
                      href={GIVING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-ember transition-colors hover:text-starlight"
                    >
                      Give to the Mission
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="md:mt-8">
              <h2 className="meta-label">Follow</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-1.5 -my-1.5 transition-colors hover:text-ember"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="meta-label mt-16">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
