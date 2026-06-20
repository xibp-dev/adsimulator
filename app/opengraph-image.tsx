import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/siteSettings";

export const runtime = "edge";
export const alt = "AdSimulator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const s = await getSiteSettings();

  const title = s.title || "AdSimulator — Simulator Meta Ads Gratis";
  const description =
    s.description?.slice(0, 120) ||
    "Latihan buat iklan Facebook & Instagram tanpa biaya nyata. Platform edukasi digital marketing terlengkap.";
  const siteName = s.siteName || "AdSimulator";
  const domain = (s.siteUrl || "adsimulator.web.id").replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a1628 0%, #0d2147 50%, #0a1628 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(8,102,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(8,102,255,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(8,102,255,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 72px",
          }}
        >
          {/* Top: logo + domain */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#0866FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(8,102,255,0.6)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="9" height="9" rx="2" fill="white" opacity="0.9" />
                <rect x="13" y="2" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                <rect x="2" y="13" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                <rect x="13" y="13" width="9" height="9" rx="2" fill="white" opacity="0.3" />
              </svg>
            </div>
            <span style={{ color: "white", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
              {siteName}
            </span>
            <div
              style={{
                marginLeft: 8,
                background: "rgba(8,102,255,0.25)",
                border: "1px solid rgba(8,102,255,0.5)",
                borderRadius: 20,
                padding: "4px 14px",
                color: "#60a5fa",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              GRATIS
            </div>
          </div>

          {/* Center: title + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820 }}>
            <div
              style={{
                color: "white",
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: -1.5,
              }}
            >
              {title.length > 60 ? title.slice(0, 60) + "…" : title}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 22,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom: feature pills + domain */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {["Facebook Ads", "Instagram Ads", "Meta Pixel", "Analitik"].map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 20,
                    padding: "6px 16px",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>{domain}</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
