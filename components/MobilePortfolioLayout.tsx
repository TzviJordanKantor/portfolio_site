"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ChevronUp, ChevronLeft, ChevronRight, ArrowUpRight, Mail, Phone, ExternalLink } from "lucide-react";
import ExperienceCard from "@/components/ExperienceCard";
import ExperienceModal from "@/components/ExperienceModal";
import { STEPS } from "@/components/WelcomeWizard";
import { SEGMENTS } from "@/components/FocusModal";
import profile from "@/data/profile.json";
import skillsData from "@/data/skills.json";
import educationData from "@/data/education.json";
import experienceData from "@/data/experience.json";
import type { Experience } from "@/types";

const AI_SKILLS = new Set([
  "Prompt Engineering",
  "Content Systems",
  "Evaluations",
  "Conversation Design",
  "Agentic Workflows",
]);

const SKILL_TOOLTIPS: Record<string, string> = {
  "Microcopy": "Button labels, errors, and empty states. Words at the UI layer.",
  "UX": "I understand how structure, flow, timing, hierarchy, and language shape the user experience.",
  "Localization": "Multi-language content architecture and copy reviews.",
  "User Research": "Interviews, heuristic audits, and usability analysis.",
  "Prompt Engineering": "LLM instruction design, chain-of-thought, and output optimization.",
  "Content Systems": "Scalable docs, governance, and component content architecture.",
  "Evaluations": "AI output quality rubrics and structured eval protocols.",
  "Conversation Design": "Chat and voice flow architecture for AI products.",
  "Agentic Workflows": "Autonomous AI pipeline design and orchestration.",
  "Accessibility": "I write and structure interface content so more people can understand, navigate, and recover from mistakes.",
  "Workshop Facilitation": "I lead working sessions, guilds, and presentations that help teams align around better product language.",
  "Information Architecture": "I organize product and content structures so people can find, understand, and act on information.",
  "Editorial Strategy": "I shape messaging systems, content priorities, and review standards so teams can make better writing decisions.",
  "Branding": "I connect product language to a broader voice so the experience feels consistent across surfaces.",
  "Figma": "I use Figma to write, test, and review product copy in context.",
  "Notion": "I use Notion to organize research, content systems, and working documentation.",
  "Jira": "I use Jira to track UX writing work across product and engineering workflows.",
  "Confluence": "I use Confluence to document standards, decisions, and reusable guidance.",
  "Miro": "I use Miro to map flows, facilitate workshops, and structure early thinking.",
  "Claude / Claude Code": "I use Claude and Claude Code to structure content systems, build workflows, and ship working interface prototypes.",
};

const NAV_SECTIONS = [
  { id: "bio", label: "Bio" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "focus", label: "Focus" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const CARD: CSSProperties = {
  background: "var(--card-bg)",
  borderRadius: "var(--radius-xl)",
  padding: "var(--space-5)",
  boxShadow: "var(--shadow-card)",
};

const SECTION_LABEL: CSSProperties = {
  fontSize: "0.5625rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: "var(--font-display)",
  color: "var(--text-muted)",
};

const GROUP_LABEL: CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const experiences = experienceData as Experience[];

const SKILL_DEF_BLOCK: CSSProperties = {
  background: "var(--accent-light)",
  borderRadius: "var(--radius-sm)",
  padding: "var(--space-3) var(--space-4)",
  border: "1px solid var(--accent-border)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
};

export default function MobilePortfolioLayout() {
  const [carouselStep, setCarouselStep] = useState(0);
  const [carouselDir, setCarouselDir] = useState<1 | -1>(1);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const touchStartX = useRef<number>(0);

  const hasOpenOverlay = Boolean(selectedExp || focusOpen);

  // Auto-rotate: resets whenever carouselStep changes (manual or auto)
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselDir(1);
      setCarouselStep(s => (s + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselStep]);

  const handleManualNext = useCallback(() => {
    if (carouselStep < STEPS.length - 1) {
      setCarouselDir(1);
      setCarouselStep(s => s + 1);
    }
  }, [carouselStep]);

  const handleManualBack = useCallback(() => {
    if (carouselStep > 0) {
      setCarouselDir(-1);
      setCarouselStep(s => s - 1);
    }
  }, [carouselStep]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleManualNext();
    else if (diff < -50) handleManualBack();
  };

  const scrollToSection = (id: string) => {
    setHamburgerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const slideVariants = {
    enter: (d: 1 | -1) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: 1 | -1) => ({ opacity: 0, x: d * -28 }),
  };

  const current = STEPS[carouselStep];

  return (
    <div style={{ background: "var(--viewport-bg)", minHeight: "100vh", paddingTop: 64 }}>

      {/* ── Hamburger ─────────────────────────────────────── */}
      {!hasOpenOverlay && (
        <>
          <div style={{ position: "fixed", top: 16, right: 16, zIndex: 200 }}>
            <button
              onClick={() => setHamburgerOpen(o => !o)}
              style={{
                width: 40, height: 40,
                borderRadius: "50%",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-secondary)",
              }}
              aria-label={hamburgerOpen ? "Close menu" : "Open menu"}
            >
              {hamburgerOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <AnimatePresence>
              {hamburgerOpen && (
                <motion.nav
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute", top: 48, right: 0,
                    background: "var(--card-bg)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-page)",
                    padding: "var(--space-2)",
                    minWidth: 160,
                    zIndex: 201,
                  }}
                >
                  {NAV_SECTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px var(--space-4)",
                        background: "none", border: "none",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.875rem", fontWeight: 500,
                        color: "var(--text-primary)",
                        cursor: "pointer",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger backdrop */}
          <AnimatePresence>
            {hamburgerOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setHamburgerOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 199 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── Card stack ────────────────────────────────────── */}
      <div style={{
        maxWidth: 480, margin: "0 auto",
        padding: "var(--space-3)", paddingBottom: "var(--space-6)",
        display: "flex", flexDirection: "column", gap: "var(--space-3)",
      }}>

        {/* ── Bio ────────────────────────────────────────── */}
        <section id="bio" style={CARD}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <span style={SECTION_LABEL}>Profile</span>
            <h1 style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}>
              {profile.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                {profile.title}
              </span>
              <span style={{ color: "var(--border)", userSelect: "none" }}>·</span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--accent)" }}>
                {profile.subtitle}
              </span>
            </div>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--text-secondary)" }}>
              {profile.bio}
            </p>
          </div>
        </section>

        {/* ── About carousel ─────────────────────────────── */}
        <section
          id="about"
          style={{ ...CARD, padding: 0, overflow: "hidden" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Slide area with gradient nav overlays */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait" custom={carouselDir}>
              <motion.div
                key={carouselStep}
                custom={carouselDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div style={{ position: "relative", height: 160, width: "100%" }}>
                  <Image
                    src={current.image}
                    alt={current.heading}
                    fill
                    className="object-cover"
                    sizes="480px"
                    priority
                  />
                </div>
                <div style={{ paddingTop: "var(--space-4)", paddingLeft: "var(--space-5)" }}>
                  <div style={{ width: 28, height: 3, borderRadius: 2, background: "var(--accent)" }} />
                </div>
                <div style={{
                  padding: "var(--space-3) var(--space-5) var(--space-4)",
                  display: "flex", flexDirection: "column", gap: "var(--space-2)",
                }}>
                  <h2 style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}>
                    {current.heading}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {current.body.map((p, i) => (
                      <p key={i} style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left gradient overlay + arrow */}
            <div
              style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 40,
                pointerEvents: "none", zIndex: 5,
                opacity: carouselStep === 0 ? 0 : 1,
                transition: "opacity 0.2s",
                background: "linear-gradient(to right, rgba(250,252,249,0.92) 20%, transparent)",
                display: "flex", alignItems: "center", paddingLeft: 4,
              }}
            >
              <div style={{ pointerEvents: "auto" }}>
                <button
                  onClick={handleManualBack}
                  disabled={carouselStep === 0}
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--card-bg-alt)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    flexShrink: 0,
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={13} />
                </button>
              </div>
            </div>

            {/* Right gradient overlay + arrow */}
            <div
              style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
                pointerEvents: "none", zIndex: 5,
                opacity: carouselStep === STEPS.length - 1 ? 0 : 1,
                transition: "opacity 0.2s",
                background: "linear-gradient(to left, rgba(250,252,249,0.92) 20%, transparent)",
                display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 4,
              }}
            >
              <div style={{ pointerEvents: "auto" }}>
                <button
                  onClick={handleManualNext}
                  disabled={carouselStep === STEPS.length - 1}
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--card-bg-alt)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    flexShrink: 0,
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel footer — dots only */}
          <div style={{
            display: "flex", justifyContent: "center",
            padding: "var(--space-3) var(--space-5) var(--space-4)",
            borderTop: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCarouselDir(i > carouselStep ? 1 : -1); setCarouselStep(i); }}
                  style={{
                    width: i === carouselStep ? 20 : 6, height: 6,
                    borderRadius: 3,
                    background: i === carouselStep ? "var(--accent)" : "var(--border)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.2s, background 0.2s",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills ─────────────────────────────────────── */}
        <section id="skills" style={CARD}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={SECTION_LABEL}>Skills</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Tap any skill to see its definition.
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Skills highlighted in purple are AI-related.
              </p>
            </div>

            {/* Core */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={GROUP_LABEL}>Core</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {skillsData.core.map(skill => (
                  <button
                    key={skill}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    className={`pill-base ${AI_SKILLS.has(skill) ? "pill-ai" : "pill-neutral"}`}
                    style={{
                      cursor: "pointer",
                      ...(activeSkill === skill
                        ? { outline: "2px solid var(--accent)", outlineOffset: "2px" }
                        : {}),
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Core skill definition */}
            <AnimatePresence>
              {activeSkill && skillsData.core.includes(activeSkill) && SKILL_TOOLTIPS[activeSkill] && (
                <motion.div
                  key={`${activeSkill}-core`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={SKILL_DEF_BLOCK}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)" }}>
                      {activeSkill}
                    </span>
                    <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      {SKILL_TOOLTIPS[activeSkill]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Adjacent */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={GROUP_LABEL}>Adjacent</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {skillsData.adjacent.map(skill => (
                  <button
                    key={skill}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    className="pill-base pill-neutral"
                    style={{
                      cursor: "pointer",
                      ...(activeSkill === skill
                        ? { outline: "2px solid var(--accent)", outlineOffset: "2px" }
                        : {}),
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Adjacent skill definition */}
            <AnimatePresence>
              {activeSkill && skillsData.adjacent.includes(activeSkill) && SKILL_TOOLTIPS[activeSkill] && (
                <motion.div
                  key={`${activeSkill}-adjacent`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={SKILL_DEF_BLOCK}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)" }}>
                      {activeSkill}
                    </span>
                    <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      {SKILL_TOOLTIPS[activeSkill]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tools */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={GROUP_LABEL}>Tools</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {skillsData.tools.map(skill => (
                  <button
                    key={skill}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    className="pill-base pill-neutral"
                    style={{
                      cursor: "pointer",
                      ...(activeSkill === skill
                        ? { outline: "2px solid var(--accent)", outlineOffset: "2px" }
                        : {}),
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools skill definition */}
            <AnimatePresence>
              {activeSkill && skillsData.tools.includes(activeSkill) && SKILL_TOOLTIPS[activeSkill] && (
                <motion.div
                  key={`${activeSkill}-tools`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={SKILL_DEF_BLOCK}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)" }}>
                      {activeSkill}
                    </span>
                    <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      {SKILL_TOOLTIPS[activeSkill]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Education ──────────────────────────────────── */}
        <section id="education" style={CARD}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <span style={SECTION_LABEL}>Education</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {educationData.map((edu, i) => (
                <div
                  key={edu.institution}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    paddingBottom: i < educationData.length - 1 ? "var(--space-3)" : 0,
                    borderBottom: i < educationData.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: "0.875rem", fontWeight: 600,
                      color: i === 0 ? "var(--accent)" : "var(--text-primary)",
                    }}>
                      {edu.institution}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {edu.degree} · {edu.field}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "0.75rem", color: "var(--text-muted)",
                    flexShrink: 0, marginLeft: "var(--space-3)",
                  }}>
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Focus ──────────────────────────────────────── */}
        <section id="focus" style={CARD}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={SECTION_LABEL}>Focus</span>
              <button
                onClick={() => { setHamburgerOpen(false); setFocusOpen(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: "0.75rem", fontWeight: 600,
                  color: "var(--accent)", background: "none", border: "none",
                  cursor: "pointer", padding: 0,
                }}
              >
                View breakdown <ArrowUpRight size={12} />
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src="/assets/pie 2.png"
                alt="Focus area breakdown"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {SEGMENTS.map(seg => (
                <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", flex: 1 }}>
                    {seg.label}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>
                    {seg.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience ─────────────────────────────────── */}
        <section id="experience" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "rgba(239,244,240,0.94)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0,0,0,0.10)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            marginLeft: "calc(-1 * var(--space-3))",
            marginRight: "calc(-1 * var(--space-3))",
            paddingTop: "var(--space-3)",
            paddingBottom: "var(--space-2)",
            paddingLeft: "var(--space-3)",
            paddingRight: 72,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                fontFamily: "var(--font-display)",
                color: "var(--text-secondary)",
              }}>Professional Experience</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Tap any role to explore impact, ownership, and work samples.
              </p>
            </div>
          </div>
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={i}
              onClick={setSelectedExp}
              showMobileAffordance
              noWhileInView
            />
          ))}
        </section>

        {/* ── Contact ────────────────────────────────────── */}
        <section id="contact" style={CARD}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <span style={SECTION_LABEL}>Get in Touch</span>

            {/* Business-card row: contact left, portrait right */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>

              {/* Left: contact rows */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <a
                  href={`mailto:${profile.email}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem",
                    minWidth: 0,
                  }}
                >
                  <Mail size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profile.email}
                  </span>
                </a>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                  <Phone size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <a href={`tel:${profile.phone}`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem" }}>
                      {profile.phone} <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>US</span>
                    </a>
                    {profile.phone_il && (
                      <a href={`tel:${profile.phone_il}`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem" }}>
                        {profile.phone_il} <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>IL</span>
                      </a>
                    )}
                  </div>
                </div>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem",
                  }}
                >
                  <ExternalLink size={16} color="var(--accent)" />
                  LinkedIn
                </a>
              </div>

              {/* Right: portrait zone — decorative, not clickable */}
              <div
                style={{
                  flexShrink: 0,
                  width: "clamp(96px, 28vw, 132px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-hidden="true"
              >
                <div style={{
                  width: "clamp(82px, 22vw, 108px)",
                  height: "clamp(82px, 22vw, 108px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  border: "2px solid var(--border)",
                  flexShrink: 0,
                }}>
                  <Image src={profile.headshot} alt="" fill className="object-cover" sizes="108px" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Endnote ────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          padding: "var(--space-5) var(--space-4) var(--space-6)",
          display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "center",
        }}>
          <p style={{ fontSize: "0.8125rem", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 320 }}>
            This experience was designed as a horizontally oriented dashboard. For the best experience, come back on your computer.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-2)",
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: "0.5625rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <ChevronUp size={12} />
            Back to top
          </button>
        </div>

      </div>

      {/* ── Focus drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {focusOpen && (
          <>
            <motion.div
              key="focus-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFocusOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 52,
                background: "rgba(20,35,22,0.50)", backdropFilter: "blur(4px)",
              }}
              aria-hidden="true"
            />
            <motion.aside
              key="focus-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Focus breakdown"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: "88vw", maxWidth: 380,
                background: "var(--card-bg)",
                zIndex: 53,
                overflowY: "auto",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{
                position: "sticky", top: 0,
                background: "var(--card-bg)",
                borderBottom: "1px solid var(--border)",
                padding: "var(--space-5) var(--space-5) var(--space-4)",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                zIndex: 10,
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <h2 style={{
                    fontSize: "1.0625rem", fontWeight: 700,
                    fontFamily: "var(--font-display)", color: "var(--text-primary)",
                  }}>
                    Where my time goes
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Approximate focus breakdown across a typical project cycle
                  </p>
                </div>
                <button
                  onClick={() => setFocusOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-muted)", background: "none", border: "none",
                    cursor: "pointer", flexShrink: 0, marginLeft: "var(--space-3)",
                  }}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "var(--space-5)" }}>
                <div style={{
                  display: "flex", justifyContent: "center",
                  background: "var(--chart-bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-4)",
                  marginBottom: "var(--space-5)",
                }}>
                  <Image
                    src="/assets/pie 2.png"
                    alt="Focus area breakdown"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  {SEGMENTS.map((seg, i) => (
                    <motion.div
                      key={seg.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}
                    >
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        flexShrink: 0, marginTop: 3, background: seg.color,
                      }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Experience drawer ─────────────────────────────── */}
      <ExperienceModal experience={selectedExp} onClose={() => setSelectedExp(null)} />
    </div>
  );
}
