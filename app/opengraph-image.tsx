import { ImageResponse } from "next/og";
import { ANCHOR_VERSE, SITE_NAME } from "@/content/site";

export const alt = `${SITE_NAME}: a ministry for creators, artists, and entrepreneurs`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#07050c",
          color: "#efecf7",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="34" height="34" viewBox="0 0 24 24">
            <path
              fill="#a78bfa"
              d="M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z"
            />
          </svg>
          <div style={{ fontSize: 40, letterSpacing: 2 }}>{SITE_NAME}</div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 44,
            lineHeight: 1.35,
            maxWidth: 980,
            fontStyle: "italic",
          }}
        >
          {ANCHOR_VERSE.text}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 24,
            color: "#978bad",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {ANCHOR_VERSE.reference}
        </div>
      </div>
    ),
    { ...size },
  );
}
