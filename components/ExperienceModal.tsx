"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, CheckCircle2, Wrench, Tag, FileText, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SampleModal from "@/components/SampleModal";
import type { Experience, Project } from "@/types";

const TYPE_META: Record<Project["type"], { label: string; bg: string; color: string }> = {
  ui:     { label: "UI Copy",  bg: "rgba(45,89,134,0.12)",  color: "#2D5986" },
  flow:   { label: "Flow",     bg: "rgba(46,125,110,0.12)", color: "#2E7D6E" },
  system: { label: "System",   bg: "var(--accent-light)",   color: "var(--accent)" },
  doc:    { label: "Document", bg: "rgba(139,90,43,0.12)",  color: "#8B5A2B" },
  video:  { label: "Video",    bg: "rgba(153,27,27,0.12)",  color: "#991B1B" },
};

const CARD_GAP = 12;

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
}

export default function ExperienceModal({ experience, onClose }: ExperienceModalProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [winsOpen, setWinsOpen] = useState(false);
  const [ownedOpen, setOwnedOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [carouselAtStart, setCarouselAtStart] = useState(true);
  const [carouselAtEnd, setCarouselAtEnd] = useState(false);
  const [carouselPage, setCarouselPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (e.key === "Escape") onClose();
    },
    [onClose, selectedProject]
  );

  useEffect(() => {
    if (!experience) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [experience, handleKeyDown]);

  useEffect(() => {
    setSelectedProject(null);
    setWinsOpen(false);
    setOwnedOpen(false);
    setToolsOpen(false);
    setCarouselAtStart(true);
    setCarouselAtEnd((experience?.projects.length ?? 0) <= 2);
    setCarouselPage(0);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [experience]);

  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCarouselAtStart(scrollLeft < 10);
    setCarouselAtEnd(scrollWidth - scrollLeft - clientWidth < 10);
    if (clientWidth > 0) {
      const cardWidth = (clientWidth - CARD_GAP) / 2;
      setCarouselPage(Math.round(scrollLeft / (cardWidth + CARD_GAP)));
    }
  }, []);

  const scrollByOne = useCallback((direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = (el.clientWidth - CARD_GAP) / 2;
    el.scrollBy({ left: direction * (cardWidth + CARD_GAP), behavior: "smooth" });
  }, []);

  const hasMultiplePages = (experience?.projects.length ?? 0) > 2;

  return (
    <>
      <AnimatePresence>
        {experience && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(20,35,22,0.50)", backdropFilter: "blur(4px)" }}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label={`${experience.company} details`}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="experience-drawer-panel fixed right-0 top-0 bottom-0 z-50 overflow-y-auto"
              style={{
                width: "min(560px, 44vw)",
                maxWidth: "94vw",
                minWidth: 340,
                background: "var(--card-bg)",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.14)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {/* Sticky header */}
              <div
                className="sticky top-0 z-10"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-5) var(--space-6)",
                  background: "var(--card-bg)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "14px",
                    overflow: "hidden", position: "relative", flexShrink: 0,
                    background: experience.color + "18",
                    border: `1px solid ${experience.color}22`,
                  }}>
                    {experience.logo ? (
                      <Image src={experience.logo} alt={experience.company} fill className="object-contain" />
                    ) : (
                      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Briefcase size={16} style={{ color: experience.color }} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: "0.9375rem", fontFamily: "var(--font-display)", lineHeight: 1.25, color: "var(--text-primary)" }}>
                      {experience.company}
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      {experience.role} · {experience.period}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-muted)", background: "none", border: "none",
                    cursor: "pointer", flexShrink: 0,
                  }}
                  className="hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

                <div style={{ height: 3, width: 48, borderRadius: 99, background: experience.color }} />

                {/* Overview */}
                <section>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                    {experience.expanded}
                  </p>
                </section>

                {experience.note && (
                  <div style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent-light)",
                    border: "1px solid rgba(122,107,175,0.3)",
                    fontSize: "0.8125rem",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                  }}>
                    {experience.note}
                  </div>
                )}

                {/* Work Samples — horizontal carousel */}
                {experience.projects.length > 0 && (
                  <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    {/* Header row — counter only, no arrows */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <SectionHeader icon={null} title="Work Samples" color={experience.color} />
                      {hasMultiplePages && (
                        <span style={{
                          fontSize: "0.5625rem",
                          color: "var(--text-muted)",
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "0.02em",
                        }}>
                          {carouselPage + 1}–{Math.min(carouselPage + 2, experience.projects.length)} of {experience.projects.length}
                        </span>
                      )}
                    </div>

                    {/* Carousel rail */}
                    <div style={{ position: "relative" }}>
                      <div
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                        className="carousel-rail"
                        style={{
                          display: "flex",
                          gap: CARD_GAP,
                          overflowX: "scroll",
                          scrollSnapType: "x mandatory",
                          scrollbarWidth: "none",
                          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
                          paddingBottom: 2,
                        } as React.CSSProperties}
                      >
                        {experience.projects.map((project) => (
                          <div
                            key={project.id}
                            style={{
                              flexShrink: 0,
                              width: `calc(50% - ${CARD_GAP / 2}px)`,
                              scrollSnapAlign: "start",
                            }}
                          >
                            <ProjectCard
                              project={project}
                              accentColor={experience.color}
                              onClick={() => setSelectedProject(project)}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Left edge fade + arrow */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 2,
                          width: 40,
                          background: "linear-gradient(to right, rgba(255,255,255,0.82) 20%, transparent)",
                          pointerEvents: "none",
                          zIndex: 1,
                          opacity: carouselAtStart ? 0 : 1,
                          transition: "opacity 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          paddingLeft: 4,
                        }}
                      >
                        <div style={{ pointerEvents: "auto" }}>
                          <CarouselNavButton
                            direction="left"
                            disabled={carouselAtStart}
                            onClick={() => scrollByOne(-1)}
                            color={experience.color}
                          />
                        </div>
                      </div>

                      {/* Right edge fade + arrow */}
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 2,
                          width: 40,
                          background: "linear-gradient(to left, rgba(255,255,255,0.82) 20%, transparent)",
                          pointerEvents: "none",
                          zIndex: 1,
                          opacity: carouselAtEnd ? 0 : 1,
                          transition: "opacity 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 4,
                        }}
                      >
                        <div style={{ pointerEvents: "auto" }}>
                          <CarouselNavButton
                            direction="right"
                            disabled={carouselAtEnd}
                            onClick={() => scrollByOne(1)}
                            color={experience.color}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Accordion sections — grouped tightly */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <AccordionSection
                    icon={<CheckCircle2 size={13} />}
                    title="Impact & Wins"
                    color={experience.color}
                    open={winsOpen}
                    onToggle={() => setWinsOpen(v => !v)}
                  >
                    <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                      {experience.wins.map((win, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: "var(--space-3)",
                            fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-secondary)",
                          }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                            marginTop: 8, background: experience.color,
                          }} />
                          {win}
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>

                  <AccordionSection
                    icon={<Tag size={13} />}
                    title="What I Owned"
                    color={experience.color}
                    open={ownedOpen}
                    onToggle={() => setOwnedOpen(v => !v)}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {experience.owned.map((item) => (
                        <span
                          key={item}
                          style={{
                            fontSize: "0.75rem", fontWeight: 500,
                            padding: "5px 13px", borderRadius: "var(--radius-sm)",
                            background: experience.color + "12",
                            color: experience.color,
                            border: `1px solid ${experience.color}28`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </AccordionSection>

                  <AccordionSection
                    icon={<Wrench size={13} />}
                    title="Tools & Process"
                    color={experience.color}
                    open={toolsOpen}
                    onToggle={() => setToolsOpen(v => !v)}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {experience.tools.map((tool) => (
                        <span
                          key={tool}
                          style={{
                            fontSize: "0.75rem", fontWeight: 500,
                            padding: "5px 13px", borderRadius: "var(--radius-sm)",
                            background: "var(--body-bg)", color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </AccordionSection>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SampleModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

/* ── CarouselNavButton ───────────────────────────────────── */

function CarouselNavButton({
  direction,
  disabled,
  onClick,
  color,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: disabled ? "var(--card-bg-alt)" : hovered ? color + "18" : "var(--card-bg-alt)",
        border: `1px solid ${disabled ? "var(--border)" : hovered ? color + "50" : "var(--border)"}`,
        color: disabled ? "var(--border)" : hovered ? color : "var(--text-muted)",
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {direction === "left" ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
    </button>
  );
}

/* ── ProjectCard ─────────────────────────────────────────── */

function ProjectCard({
  project,
  accentColor,
  onClick,
}: {
  project: Project;
  accentColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[project.type];

  const validSamples = project.samples.filter(
    (s) => s?.src && s.src.trim().length > 0
  );
  const firstSample = validSamples[0] ?? null;

  const thumbnailSrc = (() => {
    if (!firstSample) return null;
    if (firstSample.src.startsWith("https://www.youtube.com/embed/")) {
      return `https://img.youtube.com/vi/${firstSample.src.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg`;
    }
    if (/\.(mp4|webm|mov|m4v)$/i.test(firstSample.src)) return firstSample.poster ?? null;
    return firstSample.src;
  })();

  const hasThumbnail = thumbnailSrc !== null;

  const countLabel = (() => {
    const n = validSamples.length;
    if (project.type === "doc") return `${n} pages`;
    if (project.type === "system") return `${n} pages`;
    if (project.type === "video") return `${n} video${n !== 1 ? "s" : ""}`;
    return `${n} samples`;
  })();

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      style={{
        textAlign: "left",
        background: "var(--card-bg-alt)",
        border: `1px solid ${hovered ? accentColor + "50" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxShadow: hovered
          ? `0 6px 20px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)`
          : "var(--shadow-card)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      aria-label={`Preview ${project.title}`}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        aspectRatio: "4/3",
        overflow: "hidden",
        background: hasThumbnail ? "var(--body-bg)" : accentColor + "08",
        flexShrink: 0,
      }}>
        {hasThumbnail ? (
          <Image
            src={thumbnailSrc!}
            alt={project.title}
            fill
            className="object-contain"
            sizes="280px"
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "var(--space-2)",
          }}>
            <FileText size={20} style={{ color: accentColor, opacity: 0.35 }} />
            <span style={{
              fontSize: "0.5625rem", fontWeight: 600,
              color: "var(--text-muted)", textAlign: "center", lineHeight: 1.4,
              padding: "0 var(--space-3)",
            }}>
              {meta.label}
            </span>
            <span style={{ fontSize: "0.5rem", color: "var(--text-muted)", opacity: 0.7 }}>
              Preview pending
            </span>
          </div>
        )}

        {/* Play button overlay for video cards */}
        {project.type === "video" && hasThumbnail && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.18)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.90)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 2.5L11 7L3 11.5V2.5Z" fill="#222" />
              </svg>
            </div>
          </div>
        )}

        {validSamples.length > 1 && (
          <div style={{
            position: "absolute", bottom: 8, right: 8,
            background: "rgba(0,0,0,0.52)",
            borderRadius: 99,
            padding: "3px 9px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{
              fontSize: "0.5625rem",
              fontWeight: 500,
              color: "white",
              letterSpacing: "normal",
              lineHeight: 1,
            }}>
              {countLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: "var(--space-3) var(--space-3) var(--space-4)",
        display: "flex", flexDirection: "column", gap: "var(--space-1)", flex: 1,
      }}>
        <p style={{
          fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-display)",
          color: "var(--text-primary)", lineHeight: 1.3,
        }}>
          {project.title}
        </p>
        <p style={{
          fontSize: "0.6875rem", lineHeight: 1.6,
          color: "var(--text-secondary)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}>
          {project.summary}
        </p>
        <p style={{
          fontSize: "0.5625rem", fontWeight: 600,
          color: hovered ? accentColor : "var(--text-muted)",
          marginTop: "auto", paddingTop: "var(--space-2)",
          transition: "color 0.15s",
          letterSpacing: "0.02em",
        }}>
          View project →
        </p>
      </div>
    </motion.button>
  );
}

/* ── AccordionSection ────────────────────────────────────── */

function AccordionSection({
  icon, title, color, open, onToggle, children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid var(--border)",
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: hovered ? "var(--card-bg-alt)" : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "var(--space-3) var(--space-3)",
          borderRadius: open
            ? "0 0 0 0"
            : hovered ? "var(--radius-sm)" : 0,
          width: "100%",
          transition: "background 0.15s",
        }}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-expanded={open}
      >
        <SectionHeader icon={icon} title={title} color={color} />
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            color: hovered ? color : "var(--text-muted)",
            display: "flex",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "var(--space-2) var(--space-3) var(--space-4)" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── SectionHeader ───────────────────────────────────────── */

function SectionHeader({
  icon, title, color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <h3 style={{
      fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.1em", color, fontFamily: "var(--font-display)",
      display: "flex", alignItems: "center", gap: "var(--space-2)",
    }}>
      {icon}
      {title}
    </h3>
  );
}
