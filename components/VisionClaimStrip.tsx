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
              ? "border-ember/70 bg-soot/70 font-bold text-white shadow-[0_0_16px_rgb(109_40_217/0.4)]"
              : "border-dust/10 bg-night/30 text-starlight/30"
          }`}
        >
          <span
            className={
              lit
                ? "text-[#d9c8ff] drop-shadow-[0_0_5px_rgba(215,190,255,0.8)]"
                : "text-dust/35"
            }
          >
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
    <div className="mt-6 space-y-4 overflow-hidden pb-4 sm:mt-8 sm:pb-6">
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
