import Image from "next/image";

// The apply hero's opening picture: a small star arrives carrying "Your
// Dreams", a bigger star arrives carrying "God's Dreams", the big star
// swallows the small one, and the merged star settles massive and glowing,
// pointing down toward the application. Pure CSS choreography.
export default function DreamStars() {
  return (
    <div aria-hidden="true" className="dream-stage">
      <div className="dream-small">
        <Image src="/brand/star-sharp.png" alt="" width={44} height={44} />
        <span className="dream-label">Your Dreams</span>
      </div>
      <span className="dream-flash" />
      <div className="dream-big">
        <Image src="/brand/star-sharp.png" alt="" width={88} height={88} />
        <span className="dream-label dream-label-big">God&apos;s Dreams</span>
      </div>
      <span className="dream-arrow">↓</span>
    </div>
  );
}
