"use client";

import Link from "next/link";

const VERSIONS = [
  { id: "v1", href: "/work/staging/v1", label: "v1", note: "Storyboard" },
  { id: "v2", href: "/work/staging/v2", label: "v2", note: "First build" },
  { id: "v3", href: "/work/staging/v3", label: "v3", note: "Voice pass" },
  { id: "v4", href: "/work/staging/v4", label: "v4", note: "Current" },
] as const;

/**
 * Fixed pill bar for flipping between case-study iterations on localhost.
 * Comparison aid only — not shown on the canonical /work/staging page.
 */
export default function VersionSwitcher({ current }: { current: "v1" | "v2" | "v3" | "v4" }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 5,
        borderRadius: 999,
        background: "rgba(20,35,22,0.88)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 10px 34px rgba(0,0,0,0.30)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <span style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", padding: "0 8px 0 10px" }}>
        Compare
      </span>
      {VERSIONS.map((v) => {
        const active = v.id === current;
        return (
          <Link
            key={v.id}
            href={v.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 999,
              textDecoration: "none",
              background: active ? "#2E7D6E" : "transparent",
              color: active ? "white" : "rgba(255,255,255,0.72)",
              transition: "background 0.15s, color 0.15s",
            }}
            aria-current={active ? "page" : undefined}
          >
            <span style={{ fontWeight: 700, fontSize: "0.8125rem" }}>{v.label}</span>
            <span style={{ fontSize: "0.6875rem", opacity: active ? 0.92 : 0.62 }}>{v.note}</span>
          </Link>
        );
      })}
    </div>
  );
}
