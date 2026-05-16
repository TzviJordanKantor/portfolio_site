"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  onClick: (exp: Experience) => void;
}

export default function ExperienceCard({ experience, index, onClick }: ExperienceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        transition: { duration: 0.18 },
      }}
      onClick={() => onClick(experience)}
      style={{
        background: "var(--card-bg-alt)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: "var(--space-5)",
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-4)",
        cursor: "pointer",
      }}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(experience)}
      aria-label={`View ${experience.company} details`}
    >
      {/* Logo */}
      <div
        style={{
          flexShrink: 0,
          width: 52,
          height: 52,
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          background: experience.color + "18",
          border: `1px solid ${experience.color}22`,
        }}
      >
        {experience.logo ? (
          <Image
            src={experience.logo}
            alt={experience.company}
            fill
            className="object-contain"
          />
        ) : (
          <span
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: experience.color,
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {experience.logoText ?? experience.company.slice(0, 2)}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
          <div>
            <h3 style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              lineHeight: 1.3,
              color: "var(--text-primary)",
            }}>
              {experience.company}
            </h3>
            <p style={{ fontSize: "0.8125rem", marginTop: 2, color: "var(--text-secondary)" }}>
              {experience.role}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }}>
            <span style={{
              fontSize: "0.6875rem",
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: "var(--radius-sm)",
              background: "var(--card-bg)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              whiteSpace: "nowrap",
            }}>
              {experience.period}
            </span>
            <span
              className="opacity-0 group-hover:opacity-50 transition-opacity"
              style={{ color: "var(--text-muted)", display: "flex" }}
            >
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        <p style={{
          fontSize: "0.8125rem",
          marginTop: "var(--space-2)",
          lineHeight: 1.65,
          color: "var(--text-secondary)",
        }}>
          {experience.summary}
        </p>
      </div>
    </motion.article>
  );
}
