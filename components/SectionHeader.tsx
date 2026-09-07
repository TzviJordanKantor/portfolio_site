export function SectionHeader({
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
