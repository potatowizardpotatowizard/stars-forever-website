// Analog film grain overlay. Place inside any relatively positioned section.
// Pure CSS; jitter animation is gated behind prefers reduced motion.
export default function Grain({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`grain-layer ${className}`} />;
}
