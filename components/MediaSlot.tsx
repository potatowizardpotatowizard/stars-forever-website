import Image from "next/image";
import { resolveSlot } from "@/lib/media";

// A named photo slot. Renders the real photo when the manifest file exists,
// otherwise a dignified labeled placeholder. Captions read like documentary
// lower thirds: who, where, when.
export default function MediaSlot({
  name,
  priority = false,
  sizes = "100vw",
  className = "",
  showCaption = true,
  fill = false,
}: {
  name: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  showCaption?: boolean;
  /** Fill the parent instead of reserving aspect ratio (for full bleed heroes) */
  fill?: boolean;
}) {
  const slot = resolveSlot(name);
  const caption = slot.caption
    ? [slot.caption.who, slot.caption.where, slot.caption.when]
        .filter(Boolean)
        .join("  ·  ")
    : null;

  const frame = (
    <div
      className={`overflow-hidden ${fill ? "absolute inset-0" : "relative"}`}
      style={fill ? undefined : { aspectRatio: slot.ratio }}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={slot.alt}
          className="slot-placeholder absolute inset-0 flex items-end p-4"
        >
          <span className="meta-label border border-dust/30 px-2.5 py-1.5">
            {slot.name}
          </span>
        </div>
      )}
    </div>
  );

  if (fill) return frame;

  return (
    <figure className={className}>
      {frame}
      {showCaption && caption ? (
        <figcaption className="meta-label mt-3">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
