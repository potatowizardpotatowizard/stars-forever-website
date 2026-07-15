// The thread between story chapters: a full constellation figure with
// triangles and squares among the stars, drawing itself edge by edge and
// lighting each vertex as the chapter scrolls in.
type Shape = {
  lines: [number, number, number, number][];
  dots: [number, number, number][];
};

const SHAPES: Record<string, Shape> = {
  // entry line into a triangle, then down to the node
  a: {
    lines: [
      [100, 0, 128, 42], // entry
      [128, 42, 74, 66], // triangle
      [74, 66, 118, 96],
      [118, 96, 128, 42],
      [118, 96, 100, 150], // exit
    ],
    dots: [
      [100, 4, 1.4],
      [128, 42, 2.2],
      [74, 66, 2.2],
      [118, 96, 2.2],
    ],
  },
  // a tilted square hung mid line
  b: {
    lines: [
      [100, 0, 68, 36], // entry
      [68, 36, 104, 58], // square
      [104, 58, 132, 92],
      [132, 92, 96, 112],
      [96, 112, 68, 36],
      [96, 112, 100, 150], // exit
    ],
    dots: [
      [100, 4, 1.4],
      [68, 36, 2.2],
      [104, 58, 2.0],
      [132, 92, 2.2],
      [96, 112, 2.2],
    ],
  },
  // triangle chained to a small square, like a kite with a box tail
  c: {
    lines: [
      [100, 0, 136, 30], // entry
      [136, 30, 92, 46], // triangle
      [92, 46, 122, 66],
      [122, 66, 136, 30],
      [122, 66, 74, 92], // bridge
      [74, 92, 96, 110], // square
      [96, 110, 78, 128],
      [78, 128, 56, 108],
      [56, 108, 74, 92],
      [78, 128, 100, 150], // exit
    ],
    dots: [
      [100, 4, 1.4],
      [136, 30, 2.2],
      [92, 46, 2.0],
      [122, 66, 2.2],
      [74, 92, 2.0],
      [96, 110, 1.8],
      [78, 128, 2.0],
      [56, 108, 1.8],
    ],
  },
};

export default function StoryConnector({
  variant = "a",
}: {
  variant?: "a" | "b" | "c";
}) {
  const shape = SHAPES[variant];
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      className="story-connector mx-auto block h-44 w-60 text-ember"
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
