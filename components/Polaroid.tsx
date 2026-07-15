import MediaSlot from "@/components/MediaSlot";

// A kept photograph: white instant film frame, a strip of tape at the top,
// a typewriter caption in the margin. Tilts slightly and straightens when
// touched. The Story is told through these.
export default function Polaroid({
  name,
  caption,
  tilt = "none",
  priority = false,
  sizes = "(min-width: 768px) 640px, 100vw",
  className = "",
}: {
  name: string;
  caption?: string;
  tilt?: "left" | "right" | "none";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const tiltClass =
    tilt === "left"
      ? "md:-rotate-2 md:hover:rotate-0"
      : tilt === "right"
        ? "md:rotate-[1.5deg] md:hover:rotate-0"
        : "";
  return (
    <figure
      className={`polaroid relative mx-auto max-w-2xl transition-transform duration-500 ${tiltClass} ${className}`}
    >
      <span aria-hidden="true" className="polaroid-tape" />
      <MediaSlot name={name} priority={priority} sizes={sizes} showCaption={false} />
      <figcaption className="polaroid-caption">
        {caption ?? ""}
      </figcaption>
    </figure>
  );
}
