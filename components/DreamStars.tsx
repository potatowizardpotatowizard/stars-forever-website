// The apply hero's opening picture: a small ball of light arrives carrying
// "Your Dreams", a bigger one arrives carrying "God's Dreams", pulls the
// small one in and swallows it, then settles massive and glowing, pointing
// down toward the application. Pure CSS choreography.
export default function DreamStars() {
  return (
    <div aria-hidden="true" className="dream-stage">
      <div className="dream-small">
        <span className="dream-orb dream-orb-small" />
        <span className="dream-label">Your Dreams</span>
      </div>
      <span className="dream-flash" />
      <div className="dream-big">
        <span className="dream-orb dream-orb-big" />
        <span className="dream-label dream-label-big">God&apos;s Dreams</span>
      </div>
      <span className="dream-arrow">↓</span>
    </div>
  );
}
