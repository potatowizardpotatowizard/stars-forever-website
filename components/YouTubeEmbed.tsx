// A YouTube embed styled like the native video blocks: rounded frame,
// hairline border, mono caption. Loads lazily and uses the privacy
// enhanced player domain.
export default function YouTubeEmbed({
  youtubeId,
  title,
  caption,
  className = "",
}: {
  youtubeId: string;
  title: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl border border-dust/20 bg-soot">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="block aspect-video w-full border-0"
        />
      </div>
      {caption ? (
        <figcaption className="meta-label mt-3">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
