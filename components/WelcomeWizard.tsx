"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

export const WELCOME_STORAGE_KEY = "portfolio_welcomed_v1";

const TOTAL = 3;

export const STEPS = [
  {
    heading: "About me",
    body: [
      "Hey, I'm Tzvi: Father, Musician, Traveler, Reader, Tinkerer.",
      "Professionally speaking, I'm a multi-disciplinary writer in tech with 10+ years of experience drafting kick-ass, high-stakes copy. I ground my creative eye with technical literacy to create the right words for the right scenario.",
    ],
    image: "/assets/welcome-wizard/01_about_me_image.png",
  },
  {
    heading: "About my work",
    body: [
      "Everywhere I work, I try to strike the balance between quickly delivering perfect copy and raising the organizational bar. Nowadays, that involves implementing and managing AI content systems.",
    ],
    image: "/assets/welcome-wizard/02_about_my_work_image.png",
  },
  {
    heading: "About this site",
    body: [
      "I created this site on Claude Code. The design system was developed with React and Node.js, animated with Tailwind, and all the content was created, generated, and evaluated using my very own Kantorbot™ and is managed in a JSON file.",
      "To see my work, select any role in my work experience to open the expanded view. In there you can see work samples and other important details about my impact.",
    ],
    image: "/assets/welcome-wizard/03_about_this_site_image.png",
  },
];

interface WelcomeWizardProps {
  open: boolean;
  onClose: () => void;
}

type Direction = 1 | -1;

export default function WelcomeWizard({ open, onClose }: WelcomeWizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);

  const goNext = useCallback(() => {
    if (step < TOTAL - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      onClose();
    }
  }, [step, onClose]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }, [step]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight" || e.key === "Enter") { goNext(); return; }
      if (e.key === "ArrowLeft") { goBack(); }
    },
    [onClose, goNext, goBack]
  );

  // Reset to first step only when the modal opens
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setDirection(1);
  }, [open]);

  // Re-register keydown whenever step changes so goNext/goBack have fresh step
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  const current = STEPS[step];

  const slideVariants = {
    enter:  (d: Direction) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1,  x: 0 },
    exit:   (d: Direction) => ({ opacity: 0, x: d * -28 }),
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wizard-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(20,35,22,0.58)", backdropFilter: "blur(6px)" }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="wizard-modal"
            role="dialog"
            aria-modal="true"
            aria-label="About"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="relative pointer-events-auto"
              style={{
                width: "100%",
                maxWidth: 580,
                background: "var(--card-bg)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-page)",
                overflow: "hidden",
              }}
            >
              {/* Close button — floats above image */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "var(--space-4)",
                  right: "var(--space-4)",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.60)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.35)";
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 220, width: "100%" }}>
                    <Image
                      src={current.image}
                      alt={current.heading}
                      fill
                      className="object-cover"
                      sizes="(max-width: 600px) 100vw, 580px"
                      priority
                    />
                  </div>

                  {/* Accent separator */}
                  <div style={{ paddingTop: "var(--space-5)", paddingLeft: "var(--space-7)" }}>
                    <div style={{
                      width: 36,
                      height: 3,
                      borderRadius: 2,
                      background: "var(--accent)",
                    }} />
                  </div>

                  {/* Text content */}
                  <div style={{
                    padding: "var(--space-3) var(--space-7) var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}>
                    <h2 style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "var(--text-primary)",
                    }}>
                      {current.heading}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                      {current.body.map((p, i) => (
                        <p key={i} style={{
                          fontSize: "0.9375rem",
                          lineHeight: 1.75,
                          color: "var(--text-secondary)",
                        }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer: dots + nav */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-3) var(--space-7) var(--space-6)",
                borderTop: "1px solid var(--border)",
              }}>
                {/* Step dots (pill for active, dot for inactive) */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {Array.from({ length: TOTAL }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
                      style={{
                        width: i === step ? 20 : 6,
                        height: 6,
                        borderRadius: 3,
                        background: i === step ? "var(--accent)" : "var(--border)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "width 0.2s, background 0.2s",
                      }}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Nav buttons */}
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                  {step > 0 && (
                    <button
                      onClick={goBack}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--card-bg-alt)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      aria-label="Previous step"
                    >
                      <ArrowLeft size={13} />
                      Back
                    </button>
                  )}
                  <button
                    onClick={goNext}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 18px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--accent)",
                      color: "white",
                      border: "none",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    aria-label={step === TOTAL - 1 ? "Enter website" : "Next step"}
                  >
                    {step === TOTAL - 1 ? "Enter website" : "Next"}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
