// The signature motif: a small four point star, used as the logo glyph
// and as a restrained section marker.
export default function StarMark({
  className = "h-3 w-3 text-ember",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z" />
    </svg>
  );
}
