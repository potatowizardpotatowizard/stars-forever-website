// Decorative constellation clusters that draw themselves in when their
// chapter scrolls into view (the parent Reveal adds .is-visible). Purely
// ornamental; hidden from assistive tech and small screens.
const SHAPES: Record<string, { dots: [number, number, number][]; lines: [number, number, number, number][] }> = {
  // little dipper-ish hook
  a: {
    dots: [[10, 80, 1.6], [40, 58, 1.1], [74, 48, 1.6], [110, 40, 1.1], [138, 18, 2.2], [166, 34, 1.2]],
    lines: [[10, 80, 40, 58], [40, 58, 74, 48], [74, 48, 110, 40], [110, 40, 138, 18], [138, 18, 166, 34]],
  },
  // triangle with a tail
  b: {
    dots: [[16, 24, 1.4], [66, 12, 2.0], [88, 58, 1.4], [30, 66, 1.1], [130, 84, 1.7]],
    lines: [[16, 24, 66, 12], [66, 12, 88, 58], [88, 58, 16, 24], [88, 58, 130, 84]],
  },
  // long zigzag
  c: {
    dots: [[8, 16, 1.2], [48, 40, 1.8], [84, 24, 1.1], [122, 52, 1.6], [158, 44, 1.1], [186, 76, 2.0]],
    lines: [[8, 16, 48, 40], [48, 40, 84, 24], [84, 24, 122, 52], [122, 52, 158, 44], [158, 44, 186, 76]],
  },
};

export default function Constellation({
  variant = "a",
  className = "",
}: {
  variant?: "a" | "b" | "c";
  className?: string;
}) {
  const shape = SHAPES[variant];
  return (
    <svg
      viewBox="0 0 200 100"
      aria-hidden="true"
      className={`constellation pointer-events-none absolute w-48 text-starlight ${className}`}
    >
      {shape.lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={`l${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="0.5"
          style={{ transitionDelay: `${0.3 + i * 0.25}s` }}
        />
      ))}
      {shape.dots.map(([cx, cy, r], i) => (
        <circle
          key={`d${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="currentColor"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </svg>
  );
}
