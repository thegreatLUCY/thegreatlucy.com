import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a66ff",
          borderRadius: 40,
          color: "white",
          fontSize: 106,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1,
          paddingBottom: 8,
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
