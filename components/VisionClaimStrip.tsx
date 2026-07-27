import { NICHES } from "@/content/niches";

// Idea three, pure: the same niches twice, passing each other along
// the hero's base. The world as it is drifts one way, dim and
// starless; the world to come drifts the other, every niche carrying
// its ember star.
function Row({ lit, hidden }: { lit?: boolean; hidden?: boolean }) {
  return (
    <>
      {NICHES.map((niche) => (
        <span
          key={niche}
          aria-hidden={hidden || undefined}
          className={`meta-label flex shrink-0 items-center gap-2.5 rounded-md border px-4 py-2.5 ${
            lit
              ? "border-dust/25 bg-night/50 text-starlight/85"
              : "border-dust/10 bg-night/30 text-starlight/35"
          }`}
        >
          <span className={lit ? "text-ember" : "text-dust/40"}>
            {lit ? "\u2726" : "\u2727"}
          </span>
          {niche}
        </span>
      ))}
    </>
  );
}

export default function VisionClaimStrip() {
  return (
    <div className="mt-16 space-y-4 overflow-hidden pb-10">
      {/* the world as it is */}
      <div className="claim-marquee-left">
        <Row />
        <Row hidden />
      </div>
      {/* the world to come */}
      <div className="claim-marquee-right">
        <Row lit />
        <Row lit hidden />
      </div>
    </div>
  );
}
