// One continuous color field behind an entire page, tinted from its
// hero. Because it is a single element spanning the whole article,
// section boundaries have no background change to expose: the color
// simply continues. Wandering nebula blobs echo the hero art all the
// way down; an optional second color alternates the blobs for pages
// with two-tone heroes.
export default function PageAmbience({
  rgb,
  rgbB,
}: {
  /** primary tint, e.g. "109 40 217" */
  rgb: string;
  /** optional secondary tint for alternating blobs */
  rgbB?: string;
}) {
  const b = rgbB ?? rgb;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background: [
          `radial-gradient(130% 50% at 50% 0%, rgb(${rgb} / 0.14), transparent 70%)`,
          `radial-gradient(95% 34% at 12% 26%, rgb(${b} / 0.11), transparent 72%)`,
          `radial-gradient(95% 34% at 90% 44%, rgb(${rgb} / 0.11), transparent 72%)`,
          `radial-gradient(95% 34% at 8% 64%, rgb(${b} / 0.10), transparent 72%)`,
          `radial-gradient(100% 38% at 88% 86%, rgb(${rgb} / 0.11), transparent 72%)`,
          `radial-gradient(120% 30% at 50% 100%, rgb(${b} / 0.10), transparent 75%)`,
          `linear-gradient(to bottom, rgb(${rgb} / 0.05), rgb(${rgb} / 0.02) 35%, rgb(${b} / 0.03) 70%, rgb(${rgb} / 0.05))`,
        ].join(","),
      }}
    />
  );
}
