// A small burst of brand stars for the moment a form lands: twelve
// glints fly out from the center once, then rest.
export default function SuccessStars() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <span
            key={i}
            className="success-star"
            style={{
              left: "50%",
              top: "38%",
              ["--sx" as string]: `${Math.cos(a) * (70 + (i % 3) * 34)}px`,
              ["--sy" as string]: `${Math.sin(a) * (52 + (i % 3) * 26)}px`,
              animationDelay: `${(i % 4) * 60}ms`,
            }}
          />
        );
      })}
    </span>
  );
}
