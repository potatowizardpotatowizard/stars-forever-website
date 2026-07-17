"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ANCHOR_VERSE,
  CONTACT,
  FOOTER_NAV,
  GIVING_URL,
  NAV,
  SITE_NAME,
  SOCIAL,
} from "@/content/site";
import Grain from "@/components/Grain";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";

export default function Footer() {
  // The strategy page is its own product: no mission updates, explore,
  // or contact columns there. Everywhere else, the full footer.
  const minimal = usePathname() === "/strategy";

  return (
    <footer className="relative border-t border-dust/15">
      <Grain />
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
            {minimal ? null : (
              <>
                <h2 className="meta-label mt-8">Mission updates</h2>
                <p className="mt-2 max-w-sm text-sm text-starlight/70">
                  Field notes from the mission, straight to your inbox. No
                  noise.
                </p>
                <div className="mt-4">
                  <NewsletterForm />
                </div>
              </>
            )}
          </div>

          {minimal ? null : (
          <div>
            <h2 className="meta-label">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
              {[...NAV, ...FOOTER_NAV].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ember"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          )}

          <div>
            {minimal ? null : (
            <>
            <h2 className="meta-label">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
              <li>
                <a
                  href={`mailto:${CONTACT.primaryEmail}`}
                  className="transition-colors hover:text-ember"
                >
                  {CONTACT.primaryEmail}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ember"
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
            </>
            )}
            {minimal ? (
              <>
                <h2 className="meta-label">Email</h2>
                <p className="mt-4 text-sm text-starlight/85">
                  <a
                    href="mailto:flixforauzi@gmail.com"
                    className="transition-colors hover:text-ember"
                  >
                    flixforauzi@gmail.com
                  </a>
                </p>
              </>
            ) : null}
            <h2 className="meta-label mt-8">Follow</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-starlight/85">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ember"
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
