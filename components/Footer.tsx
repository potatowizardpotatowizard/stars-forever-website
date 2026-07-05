import { ANCHOR_VERSE, CONTACT, SITE_NAME, SOCIAL } from "@/content/site";
import StarMark from "@/components/StarMark";

export default function Footer() {
  return (
    <footer className="border-t border-dust/15">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-2.5 font-display text-lg">
              <StarMark className="h-3.5 w-3.5 text-ember" />
              {SITE_NAME}
            </p>
            <p className="mt-5 max-w-xs font-display text-sm leading-relaxed text-dust italic">
              {ANCHOR_VERSE.text}
            </p>
            <p className="meta-label mt-3">{ANCHOR_VERSE.reference}</p>
          </div>

          <div>
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
                  Book a call
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="meta-label">Follow</h2>
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
