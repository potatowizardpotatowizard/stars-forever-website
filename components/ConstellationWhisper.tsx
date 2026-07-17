import Link from "next/link";

// A whisper of a link: a faint star tucked at the bottom of a page,
// glowing only when found. Hidden treasure for the curious.
export default function ConstellationWhisper({
  className = "",
}: {
  className?: string;
}) {
  return (
    <p className={`text-center ${className}`}>
      <Link
        href="/constellation"
        className="group inline-flex items-center gap-2 font-meta text-[0.65rem] lowercase tracking-[0.2em] text-dust/40 transition-colors duration-500 hover:text-ember"
      >
        <span className="transition-all duration-500 group-hover:drop-shadow-[0_0_6px_rgb(167_139_250_/_0.9)]">
          ✦
        </span>
        <span>the constellation is growing</span>
      </Link>
    </p>
  );
}
