/* eslint-disable @next/next/no-img-element */
import { CONSTELLATION } from "@/content/constellation";

// The Constellation map: a dark equirectangular world with a glowing star
// for every approved creator. Star positions use the same projection the
// map was generated with, so placement is exact.
function project(lat: number, lng: number) {
  return {
    left: `${(((lng + 180) / 360) * 100).toFixed(2)}%`,
    top: `${(((90 - lat) / 180) * 100).toFixed(2)}%`,
  };
}

export default function ConstellationMap() {
  const members = CONSTELLATION.members;
  return (
    <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-night/60">
      <img
        src="/brand/world-map.svg"
        alt="World map of the Constellation"
        className="block w-full opacity-90"
      />
      {members.map((m) => {
        const pos = project(m.lat, m.lng);
        const star = (
          <span className="group absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
            <span className="constellation-dot block" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-dust/30 bg-night/95 px-3 py-1.5 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="block font-display text-sm font-bold">
                {m.name}
              </span>
              <span className="meta-label">{m.city}, {m.country}</span>
            </span>
          </span>
        );
        return m.href ? (
          <a
            key={`${m.name}-${m.city}`}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${m.name} in ${m.city}, ${m.country}`}
          >
            {star}
          </a>
        ) : (
          <span key={`${m.name}-${m.city}`}>{star}</span>
        );
      })}
      {members.length === 0 ? (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-meta text-xs uppercase tracking-[0.18em] text-starlight/80 sm:text-sm">
          {CONSTELLATION.emptyNote}
        </p>
      ) : null}
    </div>
  );
}
