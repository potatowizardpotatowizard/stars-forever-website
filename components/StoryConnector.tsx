// The thread between story chapters: not a straight line but a small
// constellation hop, bending through faint waypoint stars before landing
// on the chapter's node. Draws itself when the chapter scrolls in.
const PATHS: Record<string, { points: string; dots: [number, number][] }> = {
  a: { points: "100,0 138,52 72,96 100,150", dots: [[138, 52], [72, 96]] },
  b: { points: "100,0 58,44 132,92 100,150", dots: [[58, 44], [132, 92]] },
  c: { points: "100,0 122,38 64,72 118,112 100,150", dots: [[122, 38], [64, 72], [118, 112]] },
};

export default function StoryConnector({
  variant = "a",
}: {
  variant?: "a" | "b" | "c";
}) {
  const shape = PATHS[variant];
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      className="story-connector mx-auto block h-36 w-52 text-ember"
    >
      <polyline
        points={shape.points}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {shape.dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.8"
          fill="currentColor"
          style={{ animationDelay: `${0.6 + i * 0.5}s` }}
        />
      ))}
    </svg>
  );
}
