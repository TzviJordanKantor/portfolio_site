"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import profile from "@/data/profile.json";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
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
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(20,35,22,0.55)", backdropFilter: "blur(4px)" }}
            aria-hidden="true"
          />

          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="About Tzvi"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="relative pointer-events-auto"
              style={{
                width: "100%",
                maxWidth: 480,
                background: "var(--card-bg)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-page)",
                padding: "var(--space-7)",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "var(--space-4)",
                  right: "var(--space-4)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  background: "var(--card-bg-alt)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--card-bg-alt)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Close"
              >
                <X size={14} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: "var(--space-5)" }}>
                <p style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--accent)",
                  marginBottom: "var(--space-2)",
                }}>
                  Welcome
                </p>
                <h2 style={{
                  fontSize: "1.625rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-1)",
                }}>
                  {profile.name}
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {profile.title} · {profile.subtitle}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border)", marginBottom: "var(--space-5)" }} />

              {/* Body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                  I&rsquo;m a content designer with 10+ years turning product complexity into language
                  people trust — across SaaS, enterprise security, and AI-native products.
                </p>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                  This portfolio shows how I work: the decisions behind the words, the systems
                  that scale them, and the craft that holds it together.
                </p>
                <p style={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.7,
                  color: "var(--text-muted)",
                  background: "var(--card-bg-alt)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-3) var(--space-4)",
                  borderLeft: "3px solid var(--accent-border)",
                }}>
                  Select any role card in the experience list to explore impact,
                  ownership, and work samples.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
