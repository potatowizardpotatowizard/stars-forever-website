import Image from "next/image";
import Link from "next/link";
import { NICHES } from "@/content/niches";

// The claiming of the feed, drifting along the vision hero's base in
// two counter-moving rows. Above: ghost wireframe feed cards, the
// unclaimed digital world, one of them igniting every few seconds
// with the green-purple glow and a star on its corner. Below,
// drifting the other way: niche plaques naming every mission field,
// interleaved with real photo frames of the dream already happening,
// each clicking through to the receipts.
const FRUIT: { src: string; alt: string; href: string }[] = [
  {
    src: "/images/beast-podcast-jeremy.jpg",
    alt: "Jeremy sharing Jesus on a Beast Games podcast",
    href: "/partner-projects/beast-games",
  },
  {
    src: "/images/joshua-stargazing.jpg",
    alt: "Cohort creators stargazing at Joshua Tree",
    href: "/partner-projects/revolutionary-cohort#testimonies",
  },
  {
    src: "/images/story-baptism-island.jpg",
    alt: "A baptism on a remote island",
    href: "/story",
  },
  {
    src: "/images/tokyo-drift-car.jpg",
    alt: "The Tokyo Drift video shoot",
    href: "/partner-projects/tokyo-drift",
  },
  {
    src: "/images/joshua-prayer.jpg",
    alt: "Prayer at the Revolutionary Cohort",
    href: "/partner-projects/revolutionary-cohort#testimonies",
  },
  {
    src: "/images/beast-podcast-courtney.jpg",
    alt: "Courtney sharing her baptism story",
    href: "/partner-projects/beast-games",
  },
];

const GHOSTS = 8;

function GhostRow({ hidden }: { hidden?: boolean }) {
  return (
    <>
      {Array.from({ length: GHOSTS }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="claim-card relative flex h-24 w-40 shrink-0 flex-col gap-2 rounded-md border border-dust/25 bg-night/40 p-2.5"
          style={{ animationDelay: `${(i + (hidden ? GHOSTS : 0)) * -2.7}s` }}
        >
          <div className="flex-1 rounded-sm bg-soot/70" />
          <div className="h-1.5 w-3/4 rounded-full bg-dust/25" />
          <div className="h-1.5 w-1/2 rounded-full bg-dust/20" />
          <span
            className="claim-card-star absolute -right-2 -top-2.5 text-sm text-ember"
            style={{ animationDelay: `${(i + (hidden ? GHOSTS : 0)) * -2.7}s` }}
          >
            ✦
          </span>
        </div>
      ))}
    </>
  );
}

function FieldRow({ hidden }: { hidden?: boolean }) {
  const niches = NICHES.slice(0, 12);
  return (
    <>
      {niches.map((niche, i) => (
        <span key={`${niche}-${i}`} className="flex shrink-0 items-center gap-5">
          <span
            aria-hidden={hidden}
            className="meta-label flex items-center gap-2.5 rounded-md border border-dust/25 bg-night/50 px-4 py-2.5 text-starlight/70"
          >
            <span className="text-ember">✦</span>
            {niche} · Mission field
          </span>
          {i % 2 === 0 ? (
            <Link
              href={FRUIT[(i / 2) % FRUIT.length].href}
              tabIndex={hidden ? -1 : 0}
              aria-hidden={hidden}
              className="block shrink-0 overflow-hidden rounded-md border border-dust/25 opacity-65 transition-opacity duration-300 hover:opacity-100"
            >
              <Image
                src={FRUIT[(i / 2) % FRUIT.length].src}
                alt={hidden ? "" : FRUIT[(i / 2) % FRUIT.length].alt}
                width={256}
                height={160}
                sizes="9rem"
                className="h-20 w-32 object-cover"
              />
            </Link>
          ) : null}
        </span>
      ))}
    </>
  );
}

export default function VisionClaimStrip() {
  return (
    <div className="relative mt-14 space-y-5 overflow-hidden pb-10">
      {/* the unclaimed feed, igniting card by card */}
      <div className="claim-marquee-left">
        <GhostRow />
        <GhostRow hidden />
      </div>
      {/* the mission fields and the fruit, drifting the other way */}
      <div className="claim-marquee-right">
        <FieldRow />
        <FieldRow hidden />
      </div>
    </div>
  );
}
