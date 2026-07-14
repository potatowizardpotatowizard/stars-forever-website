// Native video player for the two minute explainers. Poster frames come from
// the videos themselves; nothing loads until the visitor presses play.
export default function VideoBlock({
  src,
  poster,
  title,
  className = "",
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-soot">
        <video
          controls
          preload="metadata"
          poster={poster}
          playsInline
          className="block aspect-video w-full"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="meta-label mt-3">{title}</figcaption>
    </figure>
  );
}
