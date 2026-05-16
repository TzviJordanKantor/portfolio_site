"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SEGMENTS = [
  {
    label: "Writing",
    pct: 35,
    color: "#7A6BAF",
    description:
      "The core of my work in recent years. Microcopy, UX flows, product narratives, and conversation design.",
  },
  {
    label: "Research",
    pct: 20,
    color: "#5B8C7A",
    description:
      "User interviews, competitive audits, heuristic reviews. Good words come from understanding real-life data and experience.",
  },
  {
    label: "Collaboration",
    pct: 20,
    color: "#9DB5A0",
    description:
      "Content design is a team sport that spans design, product, engineering, and localization.",
  },
  {
    label: "Prototyping",
    pct: 15,
    color: "#8B7DB8",
    description:
      "Actively providing content-first design solutions and testing iterations.",
  },
  {
    label: "Admin & Automation",
    pct: 10,
    color: "#8A8FA8",
    description:
      "Agentic workflows, evaluation protocols, and prompt engineering. These systems (plus the human in the loop) allow for my creativity to shine.",
  },
];

interface FocusModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FocusModal({ open, onClose }: FocusModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(20,35,22,0.50)", backdropFilter: "blur(4px)" }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Focus breakdown"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ padding: "var(--space-5)" }}
          >
            <div
              className="pointer-events-auto"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 400,
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                background: "var(--card-bg)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.16)",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "var(--space-4)",
                  right: "var(--space-4)",
                  zIndex: 10,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                className="hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div style={{
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
              }}>

                {/* Header */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", paddingRight: "var(--space-7)" }}>
                  <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                    Where my time goes
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Approximate focus breakdown across a typical project or release cycle
                  </p>
                </div>

                {/* Chart */}
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "var(--chart-bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-4)",
                }}>
                  <Image
                    src="/assets/pie 2.png"
                    alt="Focus area breakdown"
                    width={170}
                    height={170}
                    className="object-contain"
                  />
                </div>

                {/* Segments */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  {SEGMENTS.map((seg, i) => (
                    <motion.div
                      key={seg.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}
                    >
                      <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: 3,
                        background: seg.color,
                      }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                            {seg.label}
                          </span>
                          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                            {seg.pct}%
                          </span>
                        </div>
                        <p style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                          {seg.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
