import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/og";

// The strategy page's share card is bespoke: no photo, but a stylized
// video player in the brand night, the four point star riding the
// progress bar as its playhead. YouTube language, Stars Forever skin.
export const alt = "YouTube Strategy Consulting | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

const STAR =
  "M12 0c.9 6.8 4.2 10.1 12 12c-7.8 1.9-11.1 5.2-12 12c-.9-6.8-4.2-10.1-12-12C7.8 10.1 11.1 6.8 12 0Z";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: 72,
          gap: 64,
          fontFamily: "monospace",
          backgroundImage:
            "linear-gradient(135deg, #07050c 0%, #150a26 55%, #2e2347 100%)",
          color: "#efecf7",
          position: "relative",
        }}
      >
        {/* scattered stars in the night behind everything */}
        {[
          [80, 90, 3],
          [220, 480, 2],
          [420, 60, 2],
          [700, 140, 3],
          [980, 70, 2],
          [1120, 320, 3],
          [1050, 540, 2],
          [600, 560, 2],
        ].map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: 999,
              backgroundColor: "rgba(239,236,247,0.7)",
              display: "flex",
            }}
          />
        ))}

        {/* the video player */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 520,
            height: 300,
            borderRadius: 18,
            border: "2px solid rgba(151,139,173,0.35)",
            backgroundColor: "rgba(19,13,29,0.92)",
            boxShadow: "0 0 80px rgba(109,40,217,0.45)",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 999,
                backgroundColor: "#6d28d9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 46px rgba(167,139,250,0.8)",
              }}
            >
              <svg width="34" height="38" viewBox="0 0 24 28">
                <path d="M2 2 L22 14 L2 26 Z" fill="#efecf7" />
              </svg>
            </div>
          </div>
          {/* progress bar with the star as playhead */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 24px 22px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                height: 6,
                width: "100%",
                borderRadius: 999,
                backgroundColor: "rgba(151,139,173,0.3)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 24,
                display: "flex",
                height: 6,
                width: 300,
                borderRadius: 999,
                backgroundColor: "#a78bfa",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 300,
                top: -13,
                display: "flex",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path d={STAR} fill="#efecf7" />
              </svg>
            </div>
          </div>
        </div>

        {/* the words */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#a78bfa" d={STAR} />
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
              marginTop: 26,
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            YouTube Strategy
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 26,
              lineHeight: 1.45,
              color: "rgba(239,236,247,0.85)",
            }}
          >
            Find the ideas worth making. Package them so they get watched.
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
