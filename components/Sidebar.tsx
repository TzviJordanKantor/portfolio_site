"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink } from "lucide-react";
import profile from "@/data/profile.json";
import skills from "@/data/skills.json";
import education from "@/data/education.json";

// AI/systems skills → purple pill treatment
const AI_SKILLS = new Set([
  "Prompt Engineering",
  "Content Systems",
  "Evaluations",
  "Conversation Design",
  "Agentic Workflows",
]);

const SKILL_TOOLTIPS: Record<string, string> = {
  "Microcopy":           "Button labels, errors, and empty states. Words at the UI layer.",
  "UX":                  "End-to-end product content across flows and surfaces.",
  "Localization":        "Multi-language content architecture and copy reviews.",
  "User Research":       "Interviews, heuristic audits, and usability analysis.",
  "Prompt Engineering":  "LLM instruction design, chain-of-thought, and output optimization.",
  "Content Systems":     "Scalable docs, governance, and component content architecture.",
  "Evaluations":         "AI output quality rubrics and structured eval protocols.",
  "Conversation Design": "Chat and voice flow architecture for AI products.",
  "Agentic Workflows":   "Autonomous AI pipeline design and orchestration.",
};


interface SidebarProps {
  onHeadshotClick: () => void;
}

export default function Sidebar({ onHeadshotClick }: SidebarProps) {
  const [avatarHovered, setAvatarHovered] = useState(false);

  return (
    <aside style={{ background: "var(--sidebar-bg)" }}>

      {/* ── STICKY: Contact card ───────────────────────────
          Fixed hero height — matches identity hero on the right.
          Identity (name/title) lives in the right hero only.
      ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          height: "var(--hero-height)",
          flexShrink: 0,
          background: "var(--sidebar-bg)",
          padding: "var(--space-5)",
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            flex: 1,
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5) var(--space-5) var(--space-5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "var(--space-3)",
            background: "var(--sidebar-card-bg)",
            boxShadow: "var(--shadow-contact)",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Portrait */}
          <motion.button
            onClick={onHeadshotClick}
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: "relative",
              width: 108,
              height: 108,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid white",
              cursor: "pointer",
              background: "none",
              flexShrink: 0,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Open about"
          >
            <Image
              src={profile.headshot}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="108px"
              priority
            />
            {/* Hover overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: avatarHovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(20,35,22,0.58)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <span style={{
                fontSize: "0.5625rem",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                lineHeight: 1.3,
                textAlign: "center",
                padding: "0 8px",
              }}>
                ABOUT
              </span>
            </motion.div>
          </motion.button>

          {/* Contact items */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
            <SectionLabel>Contact</SectionLabel>
            <ContactItem icon={<Mail size={11} />}         href={`mailto:${profile.email}`}  label={profile.email} />

            {/* Phone pair — US + IL side by side */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.6875rem" }}>
              <span style={{ color: "var(--sidebar-muted)", flexShrink: 0, display: "flex" }}><Phone size={11} /></span>
              <div style={{ display: "flex", flex: 1, gap: "var(--space-3)", minWidth: 0 }}>
                <a
                  href={`tel:${profile.phone}`}
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", flex: 1, minWidth: 0 }}
                  className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
                >
                  <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--sidebar-muted)", background: "var(--sidebar-bg)", borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>US</span>
                  <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="group-hover:text-[var(--accent)] transition-colors">{profile.phone}</span>
                </a>
                <a
                  href={`tel:${(profile as { phone_il?: string }).phone_il}`}
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", flex: 1, minWidth: 0 }}
                  className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
                >
                  <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--sidebar-muted)", background: "var(--sidebar-bg)", borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>IL</span>
                  <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="group-hover:text-[var(--accent)] transition-colors">{(profile as { phone_il?: string }).phone_il ?? ""}</span>
                </a>
              </div>
            </div>

            <ContactItem icon={<ExternalLink size={11} />} href={profile.linkedin}            label="LinkedIn"         external />
          </div>
        </motion.div>
      </div>

      {/* ── SCROLLABLE: Skills, Focus, Education ──────────── */}
      <div
        style={{
          padding: "0 var(--space-5) var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
          paddingTop: "var(--space-5)",
        }}
      >
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
        >
          <SectionLabel>Skills</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {skills.core.map((skill) => (
              <SkillPill key={skill} label={skill} isAI={AI_SKILLS.has(skill)} />
            ))}
          </div>
        </motion.div>

        <Divider />

        {/* Education */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
        >
          <SectionLabel>Education</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {education.map((entry, idx) => (
              <EducationCard key={entry.institution} entry={entry} highlighted={idx === 0} />
            ))}
          </div>
        </motion.div>

      </div>
    </aside>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function EducationCard({
  entry,
  highlighted,
}: {
  entry: { institution: string; degree: string; field: string; year: string };
  highlighted: boolean;
}) {
  const degreePrefix =
    entry.degree !== "Bootcamp" && entry.degree !== "Certificate"
      ? `${entry.degree} · `
      : "";

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 6px 18px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)" }}
      transition={{ duration: 0.15 }}
      style={{
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        background:   highlighted ? "var(--accent-light)"   : "var(--sidebar-card-bg)",
        boxShadow:    "var(--shadow-soft)",
        border:       `1px solid ${highlighted ? "var(--accent-border)" : "var(--sidebar-border)"}`,
        cursor: "default",
        transition: "box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
        <span style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          lineHeight: 1.35,
          color: highlighted ? "var(--accent)" : "var(--sidebar-text)",
        }}>
          {entry.institution}
        </span>
        <span style={{ fontSize: "0.625rem", flexShrink: 0, color: "var(--sidebar-muted)", paddingTop: 1 }}>
          {entry.year}
        </span>
      </div>
      <span style={{
        fontSize: "0.625rem",
        lineHeight: 1.45,
        color: highlighted ? "var(--accent-hover)" : "var(--sidebar-muted)",
      }}>
        {degreePrefix}{entry.field}
      </span>
    </motion.div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--sidebar-border)" }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: "0.5625rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontFamily: "var(--font-display)",
      color: "var(--sidebar-muted)",
    }}>
      {children}
    </h2>
  );
}

function ContactItem({
  icon,
  href,
  label,
  sublabel,
  external,
}: {
  icon: React.ReactNode;
  href?: string;
  label: string;
  sublabel?: string;
  external?: boolean;
}) {
  if (!label) return null;

  const inner = (
    <span
      className="group"
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.6875rem" }}
    >
      <span style={{ color: "var(--sidebar-muted)", flexShrink: 0, display: "flex" }}>{icon}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }}>
        {sublabel && (
          <span style={{
            fontSize: "0.5625rem",
            fontWeight: 600,
            color: "var(--sidebar-muted)",
            background: "var(--sidebar-bg)",
            borderRadius: 4,
            padding: "1px 5px",
            flexShrink: 0,
          }}>
            {sublabel}
          </span>
        )}
        <span
          style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          className={href ? "group-hover:text-[var(--accent)] transition-colors" : ""}
        >
          {label}
        </span>
      </span>
    </span>
  );

  if (!href) return <div>{inner}</div>;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
    >
      {inner}
    </a>
  );
}

function SkillPill({ label, isAI }: { label: string; isAI: boolean }) {
  const tooltip = SKILL_TOOLTIPS[label];
  const [hovered, setHovered] = useState(false);
  const [tipPos, setTipPos] = useState<{ top: number; left: number } | null>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    setHovered(true);
    if (tooltip && pillRef.current) {
      const r = pillRef.current.getBoundingClientRect();
      setTipPos({ top: r.top - 10, left: r.left + r.width / 2 });
    }
  }, [tooltip]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setTipPos(null);
  }, []);

  const pillStyle: React.CSSProperties = {
    fontSize: "0.6875rem",
    fontWeight: 500,
    padding: "5px 12px",
    borderRadius: "12px",
    display: "inline-block",
    lineHeight: 1.3,
    cursor: "default",
    transition: "background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s",
    ...(isAI ? {
      background: hovered ? "var(--accent)" : "var(--accent-light)",
      color: hovered ? "white" : "var(--accent)",
      border: `1px solid ${hovered ? "var(--accent)" : "var(--accent-border)"}`,
    } : {
      background: hovered ? "#C8D8CC" : "rgba(255,255,255,0.85)",
      color: hovered ? "#1A2B1C" : "var(--text-secondary)",
      border: hovered ? "1px solid rgba(0,0,0,0.18)" : "1px solid var(--sidebar-border)",
      boxShadow: hovered ? "0 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)" : "none",
    }),
  };

  return (
    <span
      ref={pillRef}
      style={{ display: "inline-flex" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span style={pillStyle}>{label}</span>

      {/* Portal tooltip — renders into document.body, never clipped */}
      {tooltip && tipPos && typeof document !== "undefined" &&
        createPortal(
          <span
            style={{
              position: "fixed",
              top: tipPos.top,
              left: tipPos.left,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
              background: "var(--text-primary)",
              color: "white",
              fontSize: "0.5625rem",
              lineHeight: 1.55,
              padding: "8px 12px",
              borderRadius: "8px",
              maxWidth: 240,
              width: "max-content",
              whiteSpace: "normal",
              textAlign: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              pointerEvents: "none",
            }}
          >
            {tooltip}
            <span style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid var(--text-primary)",
            }} />
          </span>,
          document.body
        )
      }
    </span>
  );
}
