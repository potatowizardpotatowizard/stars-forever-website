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
              ? "border-ember bg-soot/80 font-bold text-white shadow-[0_0_14px_rgb(167_139_250/0.65),0_0_36px_rgb(109_40_217/0.55)] [text-shadow:0_0_12px_rgb(235_225_255/0.85),0_0_26px_rgb(167_139_250/0.6)]"
              : "border-dust/10 bg-night/30 text-starlight/30"
          }`}
        >
          <span
            className={
              lit
                ? "text-[#d9c8ff] drop-shadow-[0_0_9px_rgba(215,190,255,1)]"
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
    <div className="mt-5 space-y-4 overflow-hidden pb-4 sm:mt-12 sm:pb-6">
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
