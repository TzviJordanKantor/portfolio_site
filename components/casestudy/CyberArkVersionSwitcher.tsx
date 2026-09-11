"use client";

import Link from "next/link";

const VERSIONS = [
  { id: "original", href: "/work/cyberark/original", label: "Original", note: "First draft" },
  { id: "v1", href: "/work/cyberark/v1", label: "v1", note: "Systems narrative" },
] as const;

export type CyberArkVersionId = (typeof VERSIONS)[number]["id"];

/**
 * Fixed pill bar for flipping between CyberArk case-study iterations on localhost.
 * Comparison aid only: not shown on the canonical /work/cyberark page,
 * which renders V1 clean. Same pattern as Staging and Fax.
 */
export default function CyberArkVersionSwitcher({ current }: { current: CyberArkVersionId }) {
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
