// Hero-colored waves down an entire page: the black starry night fades
// INTO the hero color and back OUT to true black, again and again, as
// one continuous element spanning the article. Between blooms the
// background is genuinely black; inside them the hero lives on. Since
// nothing starts or stops at section boundaries, no seams can form.
export default function PageAmbience({
  rgb,
  centers = [20, 54, 88],
}: {
  /** the hero color, e.g. "109 40 217" */
  rgb: string;
  /** vertical bloom positions as % of page height */
  centers?: [number, number, number];
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background: [
          `radial-gradient(130% 34% at 50% ${centers[0]}%, rgb(${rgb} / 0.15), transparent 68%)`,
          `radial-gradient(130% 32% at 50% ${centers[1]}%, rgb(${rgb} / 0.13), transparent 68%)`,
          `radial-gradient(130% 34% at 50% ${centers[2]}%, rgb(${rgb} / 0.14), transparent 68%)`,
        ].join(","),
      }}
    />
  );
}
