// Native video player for the two minute explainers. Poster frames come from
// the videos themselves; nothing loads until the visitor presses play.
export default function VideoBlock({
  src,
  poster,
  title,
  className = "",
  vertical = false,
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
  /** Portrait 9:16 video, e.g. a short form video shown at phone proportions */
  vertical?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-soot">
        <video
          controls
          preload="metadata"
          poster={poster}
          playsInline
          className={`block w-full ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="meta-label mt-3">
        <span className="star-underline">{title}</span>
      </figcaption>
    </figure>
  );
}
