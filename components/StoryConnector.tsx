// The thread between story chapters: wide, low constellation figures with
// triangles and squares among the stars, drawing edge by edge and lighting
// each vertex as the chapter scrolls in. Kept short so the story flows.
type Shape = {
  lines: [number, number, number, number][];
  dots: [number, number, number][];
};

const SHAPES: Record<string, Shape> = {
  // a wide triangle slung between the chapters
  a: {
    lines: [
      [150, 0, 104, 26], // entry
      [104, 26, 198, 34], // triangle
      [198, 34, 138, 58],
      [138, 58, 104, 26],
      [138, 58, 150, 100], // exit
    ],
    dots: [
      [150, 4, 1.4],
      [104, 26, 2.2],
      [198, 34, 2.2],
      [138, 58, 2.2],
    ],
  },
  // a wide tilted square
  b: {
    lines: [
      [150, 0, 92, 30], // entry
      [92, 30, 152, 20], // square
      [152, 20, 212, 40],
      [212, 40, 150, 56],
      [150, 56, 92, 30],
      [150, 56, 150, 100], // exit
    ],
    dots: [
      [150, 4, 1.4],
      [92, 30, 2.2],
      [152, 20, 2.0],
      [212, 40, 2.2],
      [150, 56, 2.2],
    ],
  },
  // triangle bridged to a small box, spread across the sky
  c: {
    lines: [
      [150, 0, 78, 22], // entry
      [78, 22, 134, 14], // triangle
      [134, 14, 118, 42],
      [118, 42, 78, 22],
      [118, 42, 190, 36], // bridge
      [190, 36, 226, 50], // box
      [226, 50, 202, 70],
      [202, 70, 166, 56],
      [166, 56, 190, 36],
      [202, 70, 150, 100], // exit
    ],
    dots: [
      [150, 4, 1.4],
      [78, 22, 2.2],
      [134, 14, 2.0],
      [118, 42, 2.2],
      [190, 36, 2.0],
      [226, 50, 2.0],
      [202, 70, 2.0],
      [166, 56, 1.8],
    ],
  },
  // the tribute's constellation: a compact cross of stars
  d: {
    lines: [
      [150, 0, 150, 22], // entry
      [150, 22, 150, 76], // upright
      [124, 40, 176, 40], // beam
      [150, 76, 150, 100], // exit
    ],
    dots: [
      [150, 4, 1.4],
      [150, 22, 2.2],
      [124, 40, 2.0],
      [150, 40, 1.6],
      [176, 40, 2.0],
      [150, 76, 2.2],
    ],
  },
};

export default function StoryConnector({
  variant = "a",
}: {
  variant?: "a" | "b" | "c" | "d";
}) {
  const shape = SHAPES[variant];
  return (
    <svg
      viewBox="0 0 300 100"
      aria-hidden="true"
      className="story-connector mx-auto block h-24 w-72 text-ember"
    >
      {shape.lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={`l${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{ transitionDelay: `${0.15 + i * 0.18}s` }}
        />
      ))}
      {shape.dots.map(([cx, cy, r], i) => (
        <circle
          key={`d${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="currentColor"
          style={{
            transitionDelay: `${0.25 + i * 0.18}s`,
            animationDelay: `${1.5 + i * 0.6}s`,
          }}
        />
      ))}
    </svg>
  );
}
