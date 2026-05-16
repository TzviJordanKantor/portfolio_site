"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import type { Project } from "@/types";


interface SampleModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function SampleModal({ project, onClose }: SampleModalProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Only operate on samples with a real src path
  const validSamples = project?.samples.filter(
    (s) => s?.src && s.src.trim().length > 0
  ) ?? [];
  const samplesLen = validSamples.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (samplesLen <= 1) return;
      if (e.key === "ArrowLeft")  setCarouselIndex(i => (i - 1 + samplesLen) % samplesLen);
      if (e.key === "ArrowRight") setCarouselIndex(i => (i + 1) % samplesLen);
    },
    [onClose, samplesLen]
  );

  useEffect(() => {
    if (!project) return;
    setCarouselIndex(0);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="sample-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(10,20,12,0.65)", backdropFilter: "blur(6px)" }}
            aria-hidden="true"
          />

          <motion.div
            key="sample-modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="relative pointer-events-auto"
              style={{
                width: "100%",
                maxWidth: 640,
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--card-bg)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-page)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  position: "sticky",
                  top: "var(--space-4)",
                  float: "right",
                  marginRight: "var(--space-4)",
                  marginTop: "var(--space-4)",
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
                  zIndex: 2,
                  flexShrink: 0,
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

              <div style={{ padding: "var(--space-7)", paddingTop: "var(--space-5)" }}>

                {/* Header */}
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <h2 style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    color: "var(--text-primary)",
                    marginTop: 0,
                    marginBottom: "var(--space-1)",
                  }}>
                    {project.title}
                  </h2>
                </div>

                <div style={{ height: 1, background: "var(--border)", marginBottom: "var(--space-4)" }} />

                {/* Image carousel — only when valid samples exist */}
                {samplesLen > 0 && (
                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <div style={{
                      position: "relative",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      background: "var(--body-bg)",
                      border: "1px solid var(--border)",
                      aspectRatio: "4/3",
                    }}>
                      {validSamples[carouselIndex].src.startsWith("https://www.youtube.com/embed/") ? (
                        <iframe
                          key={validSamples[carouselIndex].src}
                          src={validSamples[carouselIndex].src}
                          title={validSamples[carouselIndex].caption ?? project!.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                        />
                      ) : /\.(mp4|webm|mov|m4v)$/i.test(validSamples[carouselIndex].src) ? (
                        <video
                          key={validSamples[carouselIndex].src}
                          src={validSamples[carouselIndex].src}
                          poster={validSamples[carouselIndex].poster}
                          controls
                          preload="metadata"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
                        />
                      ) : (
                        <Image
                          key={validSamples[carouselIndex].src}
                          src={validSamples[carouselIndex].src}
                          alt={validSamples[carouselIndex].caption ?? project!.title}
                          fill
                          className="object-contain"
                          sizes="640px"
                        />
                      )}

                      {samplesLen > 1 && (
                        <>
                          <button
                            onClick={() => setCarouselIndex(i => (i - 1 + samplesLen) % samplesLen)}
                            style={{
                              position: "absolute", left: 10, top: "50%",
                              transform: "translateY(-50%)",
                              width: 32, height: 32, borderRadius: "50%",
                              background: "rgba(0,0,0,0.5)", color: "white",
                              border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              zIndex: 1,
                            }}
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={() => setCarouselIndex(i => (i + 1) % samplesLen)}
                            style={{
                              position: "absolute", right: 10, top: "50%",
                              transform: "translateY(-50%)",
                              width: 32, height: 32, borderRadius: "50%",
                              background: "rgba(0,0,0,0.5)", color: "white",
                              border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              zIndex: 1,
                            }}
                            aria-label="Next image"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "var(--space-2)",
                    }}>
                      {validSamples[carouselIndex].caption ? (
                        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                          {validSamples[carouselIndex].caption}
                        </p>
                      ) : <span />}
                      {samplesLen > 1 && (
                        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: "var(--space-3)" }}>
                          {carouselIndex + 1} / {samplesLen}
                        </p>
                      )}
                    </div>

                    {/* Dot indicators */}
                    {samplesLen > 1 && (
                      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: "var(--space-2)" }}>
                        {validSamples.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCarouselIndex(i)}
                            style={{
                              width: i === carouselIndex ? 16 : 6,
                              height: 6,
                              borderRadius: 3,
                              background: i === carouselIndex ? "var(--accent)" : "var(--border)",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              transition: "width 0.2s, background 0.2s",
                            }}
                            aria-label={`Go to image ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* No valid samples — deliberate doc placeholder, no broken UI */}
                {samplesLen === 0 && (
                  <div style={{
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-7) var(--space-6)",
                    background: "var(--body-bg)",
                    border: "1.5px dashed var(--border)",
                    marginBottom: "var(--space-6)",
                    textAlign: "center",
                  }}>
                    <FileText size={28} style={{ color: "var(--text-muted)", opacity: 0.45 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                        Visual preview pending
                      </p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                        Work sample coming soon.
                      </p>
                    </div>
                  </div>
                )}

                {/* Context note */}
                {project.context && (
                  <p style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.7,
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    borderLeft: "2px solid var(--border)",
                    paddingLeft: "var(--space-3)",
                    marginBottom: project.decisions?.length || project.impact?.length ? "var(--space-5)" : 0,
                  }}>
                    {project.context}
                  </p>
                )}

                {/* Decisions */}
                {project.decisions && project.decisions.length > 0 && (
                  <div style={{ marginTop: project.context ? 0 : "var(--space-1)", marginBottom: "var(--space-5)" }}>
                    <SectionLabel>Key decisions</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {project.decisions.map((d, i) => (
                        <div key={i} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                          <span style={{
                            fontSize: "0.625rem",
                            fontWeight: 700,
                            color: "var(--accent)",
                            lineHeight: 1.6,
                            flexShrink: 0,
                            marginTop: 2,
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                            {d}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                {project.impact && project.impact.length > 0 && (
                  <div>
                    <SectionLabel>Impact</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {project.impact.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                          <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            flexShrink: 0,
                            marginTop: 7,
                          }} />
                          <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: "0.5625rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontFamily: "var(--font-display)",
      color: "var(--text-muted)",
      marginBottom: "var(--space-3)",
    }}>
      {children}
    </h3>
  );
}
