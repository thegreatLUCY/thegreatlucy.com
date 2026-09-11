import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 112,
          color: "white",
          fontSize: 300,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1,
          paddingBottom: 24,
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
