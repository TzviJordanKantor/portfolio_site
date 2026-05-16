"use client";

import { motion } from "framer-motion";
import { Pen, Layers, Shield, Zap } from "lucide-react";
import skills from "@/data/skills.json";

const ICONS: Record<string, React.ReactNode> = {
  pen: <Pen size={18} />,
  layers: <Layers size={18} />,
  shield: <Shield size={18} />,
  zap: <Zap size={18} />,
};

const COLORS = ["#7C3AED", "#0EA5E9", "#059669", "#F59E0B"];

export default function StrengthTiles() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Focus Areas
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {skills.strengths.map((strength, i) => (
          <StrengthTile key={strength.id} strength={strength} color={COLORS[i % COLORS.length]} index={i} />
        ))}
      </div>
    </section>
  );
}

function StrengthTile({
  strength,
  color,
  index,
}: {
  strength: (typeof skills.strengths)[0];
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}20` }}
      className="p-4 rounded-xl flex flex-col gap-2.5 cursor-default"
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${color}20`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: color + "18", color }}
      >
        {ICONS[strength.icon]}
      </span>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {strength.label}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {strength.description}
      </p>
    </motion.div>
  );
}
