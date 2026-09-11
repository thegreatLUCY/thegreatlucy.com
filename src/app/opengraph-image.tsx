import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["Tenawar", "Bubble Trouble", "MultiChat", "Prompt Stacker", "The Lab"];

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
          background: "#f6f6f4",
          padding: "72px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 104,
              height: 104,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a66ff",
              borderRadius: 26,
              color: "white",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1,
              paddingBottom: 6,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#161616", letterSpacing: -1 }}>
            thegreatLucy
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            color: "#161616",
            letterSpacing: -3,
            lineHeight: 1.02,
            display: "flex",
            flexDirection: "column",
          }}
        >
          small software,
          <br />
          shipped.
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#161616",
                border: "2px solid #16161622",
                background: "white",
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {c}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, fontSize: 28, fontWeight: 600, color: "#0a66ff" }}>
          thegreatlucy.com
        </div>
      </div>
    ),
    { ...size }
  );
}
