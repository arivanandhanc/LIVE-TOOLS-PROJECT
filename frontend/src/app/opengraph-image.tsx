import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { TOOL_COUNT } from "@/lib/tools/registry";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#FBBF24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
              color: "#27241d",
            }}
          >
            CF
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#27241d" }}>
            <span>Convert</span>
            <span style={{ color: "#d97706" }}>Flow</span>
          </div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, maxWidth: 980 }}>
          Every file tool you need, in one fast workspace
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 34, color: "#57534e" }}>
          {TOOL_COUNT}+ PDF, image, CSV & developer tools · Free · Private · No sign-up
        </div>
      </div>
    ),
    { ...size }
  );
}
