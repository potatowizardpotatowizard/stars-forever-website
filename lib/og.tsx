import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

// Shared share-card builder: a full-bleed photo under the night
// gradient, the star and wordmark up top of the text block, then the
// page's title and one line of copy. The home page keeps its own
// verse card (app/opengraph-image.tsx); every other page feeds this.
export const OG_SIZE = { width: 1200, height: 630 };

export async function pageOg({
  image,
  title,
  line,
}: {
  /** path inside /public, e.g. "images/story-set.jpg" */
  image: string;
  title: string;
  line: string;
}) {
  const data = await readFile(path.join(process.cwd(), "public", image));
  const src = `data:image/jpeg;base64,${data.toString("base64")}`;
  const text = line.length > 160 ? `${line.slice(0, 157).trimEnd()}…` : line;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(to top, rgba(7,5,12,0.96) 0%, rgba(7,5,12,0.6) 45%, rgba(7,5,12,0.18) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            color: "#efecf7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#a78bfa"
                d="M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z"
              />
            </svg>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#c4b5fd",
              }}
            >
              Stars Forever
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              lineHeight: 1.4,
              color: "rgba(239,236,247,0.88)",
              maxWidth: 1000,
            }}
          >
            {text}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
