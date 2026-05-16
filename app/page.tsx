"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ExperienceCard from "@/components/ExperienceCard";
import ExperienceModal from "@/components/ExperienceModal";
import FocusModal from "@/components/FocusModal";
import WelcomeWizard, { WELCOME_STORAGE_KEY } from "@/components/WelcomeWizard";
import experienceData from "@/data/experience.json";
import profile from "@/data/profile.json";
import type { Experience } from "@/types";

const FOCUS_LEGEND = [
  { label: "Writing",       pct: 35, color: "#7A6BAF" },
  { label: "Research",      pct: 20, color: "#5B8C7A" },
  { label: "Collaboration", pct: 20, color: "#9DB5A0" },
  { label: "Prototyping",   pct: 15, color: "#8B7DB8" },
  { label: "Automation",    pct: 10, color: "#8A8FA8" },
];

const experiences = experienceData as Experience[];

export default function Home() {
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mainAtBottom, setMainAtBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Show wizard on first visit; never on SSR
  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (!seen) setWizardOpen(true);
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const check = () => {
      setMainAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
      setIsScrollable(el.scrollHeight > el.clientHeight + 4);
    };
    el.addEventListener("scroll", check, { passive: true });
    check();
    return () => el.removeEventListener("scroll", check);
  }, []);

  const handleScrollButton = () => {
    const el = mainRef.current;
    if (!el) return;
    if (mainAtBottom) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ top: 220, behavior: "smooth" });
    }
  };

  const handleWizardClose = () => {
    localStorage.setItem(WELCOME_STORAGE_KEY, "1");
    setWizardOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="resume-shell">

        {/* ── Left column ───────────────────────────────── */}
        <Sidebar
          onHeadshotClick={() => setWizardOpen(true)}
        />

        {/* ── Right column ──────────────────────────────── */}
        <main ref={mainRef} style={{ background: "var(--body-bg)" }}>

          {/* ── Sticky identity hero ──────────────────── */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "var(--body-bg)",
              borderBottom: "1px solid var(--border)",
              height: "var(--hero-height)",
              display: "flex",
              alignItems: "flex-start",
              paddingTop: 44,
              paddingLeft: "var(--space-7)",
              paddingRight: "var(--space-7)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-7)", width: "100%" }}
            >
              {/* Left cell — identity text */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: 0 }}>

                {/* Name */}
                <h1
                  style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: "var(--text-primary)",
                  }}
                >
                  {profile.name}
                </h1>

                {/* Role + specialty */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    {profile.title}
                  </span>
                  <span style={{ color: "var(--border)", userSelect: "none", fontSize: "0.875rem" }}>·</span>
                  <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--accent)" }}>
                    {profile.subtitle}
                  </span>
                </div>

                {/* Bio */}
                <p
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.85,
                    color: "var(--text-secondary)",
                    maxWidth: 480,
                    marginTop: "var(--space-2)",
                  }}
                >
                  {profile.bio}
                </p>
              </div>

              {/* Right cell — focus chart (horizontal playing-card) */}
              <motion.button
                onClick={() => setFocusOpen(true)}
                whileHover={{ y: -2, boxShadow: "var(--shadow-hover)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flexShrink: 0,
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  background: "var(--chart-bg)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-4)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-card)",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  textAlign: "left",
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="View focus breakdown"
              >
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{
                    fontSize: "0.5625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-display)",
                    color: "var(--text-muted)",
                  }}>
                    Focus
                  </span>
                  <span style={{ fontSize: "0.5625rem", fontWeight: 500, color: "var(--accent)" }}>
                    View breakdown →
                  </span>
                </div>

                {/* Chart + legend row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",
                  gap: "var(--space-4)",
                }}>
                  <Image
                    src="/assets/pie 2.png"
                    alt="Focus area breakdown"
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}>
                    {FOCUS_LEGEND.map((seg) => (
                      <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", lineHeight: 1.4, whiteSpace: "nowrap" }}>
                          {seg.label} <span style={{ color: "var(--text-muted)" }}>{seg.pct}%</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.button>
            </motion.section>
          </div>

          {/* ── Scrollable experience ─────────────────── */}
          <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

            {/* Experience section */}
            <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

              {/* Section heading */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <h2
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-display)",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Professional Experience
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Select any role to explore impact, ownership, and work samples.
                </p>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {experiences.map((exp, i) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    index={i}
                    onClick={setSelectedExp}
                  />
                ))}
              </div>
            </section>


          </div>

          {/* Scroll affordance button */}
          {isScrollable && (
            <div
              style={{
                position: "sticky",
                bottom: 20,
                height: 44,
                marginTop: -44,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 11,
              }}
            >
              <motion.button
                onClick={handleScrollButton}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  color: "var(--text-muted)",
                  transition: "color 0.15s",
                  alignSelf: "center",
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={mainAtBottom ? "Back to top" : "Scroll down"}
              >
                <motion.span
                  animate={{ rotate: mainAtBottom ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ display: "flex" }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              </motion.button>
            </div>
          )}

          {/* Bottom scroll-fade affordance */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              height: 72,
              marginTop: -72,
              background: "linear-gradient(to top, var(--body-bg) 30%, transparent)",
              pointerEvents: "none",
              zIndex: 9,
              opacity: mainAtBottom ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />
        </main>

      </div>

      <ExperienceModal experience={selectedExp} onClose={() => setSelectedExp(null)} />
      <FocusModal open={focusOpen} onClose={() => setFocusOpen(false)} />
      <WelcomeWizard open={wizardOpen} onClose={handleWizardClose} />
    </div>
  );
}
