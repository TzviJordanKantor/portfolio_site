"use client";

import { SectionHeader } from "@/components/SectionHeader";

interface SiteScrollPreviewProps {
  image: string;
  /** Natural pixel dimensions of `image`, used to size the frame and compute the scroll distance. */
  imageWidth: number;
  imageHeight: number;
  caption: string;
  color: string;
  frameHeight?: number;
  durationSeconds?: number;
}

/** A small preview that pans down through a real page screenshot, fades out at the
 *  bottom, snaps back to the top while invisible, and fades back in. See
 *  .site-preview-viewport / .site-preview-rail in app/globals.css. */
export default function SiteScrollPreview({
  image,
  imageWidth,
  imageHeight,
  caption,
  color,
  frameHeight = 420,
  durationSeconds = 36,
}: SiteScrollPreviewProps) {
  const travelPct = -(1 - frameHeight / imageHeight) * 100;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <SectionHeader icon={null} title="The Live Site" color={color} />
      <div
        className="site-preview-viewport"
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: `${imageWidth} / ${frameHeight}`,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
          background: "var(--card-bg)",
        }}
      >
        <div
          className="site-preview-rail"
          style={{
            ["--site-preview-travel" as string]: `${travelPct}%`,
            ["--site-preview-duration" as string]: `${durationSeconds}s`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" style={{ display: "block", width: "100%", height: "auto" }} />
        </div>
      </div>
      <p style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
        {caption}
      </p>
    </section>
  );
}
