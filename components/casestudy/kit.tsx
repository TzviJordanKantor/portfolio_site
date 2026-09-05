"use client";

/* Shared case-study primitives.
   Extracted from the Staging case study so /work/staging and /work/fax render from
   one set of parts. Any change here lands on both pages by design: the two case
   studies are meant to read as one system, not as siblings that drifted. */

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Palette (a touch more light sage than the base tokens) ─── */
export const PAGE_BG = "#F2F6F3";
export const ALT_BG = "#E7EEE9";
export const ACCENT = "#2E7D6E"; // sage-green; purple stays reserved for AI

/* ── Type ────────────────────────────────────────────────────── */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "var(--font-display)", color: ACCENT }}>{children}</span>;
}

export function TitleLine({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--text-primary)" }}>{children}</h2>;
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <TitleLine>{title}</TitleLine>
    </div>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620 }}>{children}</p>;
}

export function Caption({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 620 }}>{children}</span>;
}

/** Instruction line for something that opens full size. Always sits ABOVE the
    thing it describes. The icon is a promise: only use this where a click
    genuinely expands. */
export function ExpandHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
      <Maximize2 size={12} />
      {children}
    </span>
  );
}

/** Instruction line for an interactive element that does NOT expand, so the
    expand icon would be a false promise. */
export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
      {children}
    </span>
  );
}

export function Section({ children, alt = false, id }: { children: React.ReactNode; alt?: boolean; id?: string }) {
  return (
    <section id={id} style={{ background: alt ? ALT_BG : "transparent", borderTop: "1px solid var(--border)", scrollMarginTop: 64 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 88px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Table ───────────────────────────────────────────────────── */

/** Card-framed data table. `cols` is a grid-template-columns string. */
export function DataTable({
  cols, headers, rows, accentLastHeader = false, mono,
}: {
  cols: string;
  headers: string[];
  rows: React.ReactNode[][];
  accentLastHeader?: boolean;
  /** Column indexes rendered in monospace. */
  mono?: number[];
}) {
  return (
    <div className="cs-table" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
      <div className="cs-head" style={{ display: "grid", gridTemplateColumns: cols, fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", background: PAGE_BG, borderBottom: "1px solid var(--border)" }}>
        {headers.map((h, i) => (
          <div key={h} style={{ padding: "var(--space-3) var(--space-4)", color: accentLastHeader && i === headers.length - 1 ? ACCENT : undefined }}>{h}</div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} className="cs-row" style={{ display: "grid", gridTemplateColumns: cols, borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.8125rem" }}>
          {r.map((c, ci) => (
            <div key={ci} className="cs-cell" data-label={headers[ci]} style={{
              padding: "var(--space-4)",
              color: ci === 0 ? "var(--text-secondary)" : "var(--text-primary)",
              fontWeight: ci === r.length - 1 && r.length > 2 ? 600 : 400,
              fontFamily: mono?.includes(ci) ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
              lineHeight: 1.55,
            }}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Images ──────────────────────────────────────────────────── */

/** Expandable image: hover overlay + click opens the Lightbox. */
export function ExpandableImage({
  src, alt, onOpen, height, contain = false, objectPosition = "top",
}: {
  src: string; alt: string; onOpen: () => void; height?: number; contain?: boolean; objectPosition?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", padding: 0, border: "1px solid var(--border)", background: "var(--card-bg)",
        borderRadius: "var(--radius-md)", boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
        cursor: "zoom-in", overflow: "hidden", width: "100%",
        height: height ?? "auto", display: "block", transition: "box-shadow 0.18s",
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      aria-label={`Open ${alt} full size`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", height: height ? "100%" : "auto", objectFit: contain ? "contain" : "cover", objectPosition, display: "block" }} />
      <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,22,0.62)", color: "white", opacity: hover ? 1 : 0, transition: "opacity 0.18s", pointerEvents: "none" }}>
        <Maximize2 size={14} />
      </span>
    </button>
  );
}

export type FlowItem = { src: string; title: string; caption: string; pos?: string };

/** Horizontal flow carousel with fade edges + arrow buttons + click-to-expand. */
export function FlowCarousel({ items, onOpen, cardWidth = 320, imageHeight = 300 }: {
  items: FlowItem[]; onOpen: (i: number) => void; cardWidth?: number; imageHeight?: number;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 10);
    setAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth < 10);
  }, []);

  // A rail wide enough to show everything has no right edge to fade.
  useEffect(() => { onScroll(); }, [onScroll, items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={railRef} onScroll={onScroll} className="carousel-rail" style={{ display: "flex", gap: "var(--space-4)", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "var(--space-2)" } as React.CSSProperties}>
        {items.map((f, i) => (
          <figure key={f.src} style={{ margin: 0, flexShrink: 0, width: `min(${cardWidth}px, 80vw)`, scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <ExpandableImage src={f.src} alt={f.title} onOpen={() => onOpen(i)} height={imageHeight} objectPosition={f.pos ?? "top"} />
            <figcaption style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{f.title}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{f.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, display: "flex", alignItems: "center", justifyContent: "flex-start", pointerEvents: "none", background: `linear-gradient(to right, ${PAGE_BG} 20%, transparent)`, opacity: atStart ? 0 : 1, transition: "opacity 0.2s" }}>
        <div style={{ pointerEvents: "auto" }}><RailBtn dir="left" disabled={atStart} onClick={() => scrollBy(-1)} /></div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, display: "flex", alignItems: "center", justifyContent: "flex-end", pointerEvents: "none", background: `linear-gradient(to left, ${PAGE_BG} 20%, transparent)`, opacity: atEnd ? 0 : 1, transition: "opacity 0.2s" }}>
        <div style={{ pointerEvents: "auto" }}><RailBtn dir="right" disabled={atEnd} onClick={() => scrollBy(1)} /></div>
      </div>
    </div>
  );
}

function RailBtn({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card-bg)", border: "1px solid var(--border)", color: disabled ? "var(--border)" : ACCENT, cursor: disabled ? "default" : "pointer", boxShadow: "var(--shadow-card)" }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      {dir === "left" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
    </button>
  );
}

/* ── Scrolling sheet ─────────────────────────────────────────── */

export type SheetRow = (string | { v: string; tone?: "ok" | "bad" | "hold" | "auto" })[];

/** A spreadsheet that scrolls itself, to show the size of the thing rather than
    describe it. Rows are synthetic. The rail duplicates the row set and
    translates by exactly half its height, so the loop is seamless. Pauses on
    hover and stands still under prefers-reduced-motion. */
export function ScrollingSheet({
  headers, cols, rows, height = 340, seconds = 42, tabs, activeTab,
}: {
  headers: string[];
  cols: string;
  rows: SheetRow[];
  height?: number;
  seconds?: number;
  tabs?: string[];
  activeTab?: string;
}) {
  const tone = (t?: string) =>
    t === "ok" ? "#137333" : t === "bad" ? "#B3261E" : t === "hold" ? "#8A6D00" : "var(--text-primary)";

  const body = [...rows, ...rows]; // doubled for a seamless wrap

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
      {tabs && (
        <div style={{ display: "flex", gap: 2, padding: "6px 8px 0", background: "#F7FAF8", borderBottom: "1px solid var(--border)", overflowX: "auto" }} className="carousel-rail">
          {tabs.map((t) => {
            const on = t === activeTab;
            return (
              <span key={t} style={{
                fontSize: "0.6875rem", padding: "6px 11px", whiteSpace: "nowrap",
                color: on ? ACCENT : "var(--text-muted)", fontWeight: on ? 700 : 500,
                background: on ? "var(--card-bg)" : "transparent",
                borderRadius: "6px 6px 0 0",
                border: on ? "1px solid var(--border)" : "1px solid transparent",
                borderBottom: "none",
              }}>{t}</span>
            );
          })}
        </div>
      )}

      {/* The grid keeps a minimum width so the columns stay legible. Below that
          the whole sheet scrolls sideways, which is honest about how wide the
          real thing is. */}
      <div className="sheet-scroll-x carousel-rail" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", background: PAGE_BG, borderBottom: "1px solid var(--border)" }}>
            {headers.map((h) => (
              <div key={h} style={{ padding: "8px 10px", whiteSpace: "nowrap", overflow: "hidden" }}>{h}</div>
            ))}
          </div>

          <div className="sheet-viewport" style={{ position: "relative", height, overflow: "hidden" }}>
            <div className="sheet-rail" style={{ ["--sheet-duration" as string]: `${seconds}s` }}>
              {body.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: cols, fontSize: "0.6875rem",
                  borderBottom: "1px solid #EDF2EE",
                  background: i % 2 ? "#FBFCFB" : "transparent",
                }}>
                  {r.map((c, ci) => {
                    const cell = typeof c === "string" ? { v: c, tone: undefined } : c;
                    return (
                      <div key={ci} style={{
                        padding: "7px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        color: tone(cell.tone),
                        fontWeight: cell.tone === "ok" || cell.tone === "bad" ? 700 : 400,
                        background: cell.tone === "auto" ? "rgba(122,107,175,0.07)" : undefined,
                      }}>{cell.v}</div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(${PAGE_BG} 0%, transparent 14%, transparent 86%, ${PAGE_BG} 100%)`, opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Clickable state card ────────────────────────────────────── */

/** Clickable card that opens one exact state. Darkens on hover to signal it. */
export function StateCard({ when, what, onClick }: { when: string; what: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left", cursor: "pointer",
        background: hover ? ACCENT + "0E" : "var(--card-bg)",
        border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`,
        borderRadius: "var(--radius-md)", padding: "var(--space-4)",
        display: "flex", flexDirection: "column", gap: "var(--space-2)",
        boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
        transition: "background 0.15s, box-shadow 0.18s",
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      aria-label={`Open state: ${when}`}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{when}</span>
        <span style={{ color: hover ? ACCENT : "var(--text-muted)", display: "flex", flexShrink: 0, transition: "color 0.15s" }}>
          <Maximize2 size={13} />
        </span>
      </span>
      <span style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{what}</span>
    </button>
  );
}

/* ── Metric tiles ────────────────────────────────────────────── */

export type Stat = { big: string; label: string };

export function StatGrid({ stats, min = 200 }: { stats: Stat[]; min?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: "var(--space-4)" }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
          <span style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: ACCENT, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{s.big}</span>
          <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Chrome ──────────────────────────────────────────────────── */

export function TopBar({ backHref, label = "Back to dashboard" }: { backHref: string; label?: string }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(242,246,243,0.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-3) var(--space-6)" }}>
        <Link href={backHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}>
          <ArrowLeft size={15} />
          {label}
        </Link>
      </div>
    </div>
  );
}

export function BackToDashboardCta({ href, label = "Back to dashboard" }: { href: string; label?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600,
        color: "white", background: hover ? "#3C9384" : ACCENT, padding: "10px 18px",
        borderRadius: "var(--radius-md)", textDecoration: "none", transition: "background 0.15s",
      }}
    >
      <ArrowLeft size={15} />
      {label}
    </Link>
  );
}

export type TocItem = { id: string; label: string };

/** setTimeout-driven eased scroll. It sets scrollTop directly, so it moves
    reliably even where native smooth-scroll is a no-op. Lives outside the
    component so its timing reads stay out of the render path.
    `lock` keeps the clicked item highlighted while the scroll animates,
    instead of tracking every section it passes through. */
function easedScrollTo(id: string, scrollId: string, lock: { current: number }) {
  const el = document.getElementById(id);
  const container = document.getElementById(scrollId);
  if (!el || !container) return;
  const target = container.scrollTop + el.getBoundingClientRect().top - container.getBoundingClientRect().top - 56;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    container.scrollTop = target;
    return;
  }
  const startTop = container.scrollTop;
  const dist = target - startTop;
  const duration = 460;
  const t0 = performance.now();
  lock.current = t0 + duration + 120;
  const tick = () => {
    const p = Math.min(1, (performance.now() - t0) / duration);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    container.scrollTop = startTop + dist * ease;
    if (p < 1) setTimeout(tick, 16);
  };
  tick();
}

/** Floating, sticky table of contents (top-right). Jumps between sections and
    tracks the active one. Hidden under 1320px via .case-toc in globals.css. */
export function TableOfContents({ items, scrollId = "case-scroll" }: { items: TocItem[]; scrollId?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const lockUntil = useRef(0);

  useEffect(() => {
    const c = document.getElementById(scrollId);
    if (!c) return;
    const onScroll = () => {
      // While a click-initiated scroll is animating, keep the clicked item
      // highlighted instead of tracking the sections it passes through.
      if (performance.now() < lockUntil.current) return;
      // At the bottom, the last (short) section is the active one even if it
      // never reaches the top of the viewport.
      if (c.scrollTop + c.clientHeight >= c.scrollHeight - 4) {
        setActive(items[items.length - 1].id);
        return;
      }
      const cTop = c.getBoundingClientRect().top;
      const marker = 120; // px below the container top
      let current = items[0].id;
      for (const t of items) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top - cTop - marker <= 0) current = t.id;
      }
      setActive(current);
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => c.removeEventListener("scroll", onScroll);
  }, [items, scrollId]);

  const jump = (id: string) => {
    setActive(id); // highlight immediately, even for the short bottom section
    easedScrollTo(id, scrollId, lockUntil);
  };

  return (
    <nav
      aria-label="On this page"
      className="case-toc"
      style={{
        position: "fixed", top: 72, right: 24, zIndex: 30, width: 176,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
        boxShadow: "0 8px 30px rgba(20,40,25,0.12), 0 2px 8px rgba(20,40,25,0.06)",
        padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2,
      }}
    >
      <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", padding: "2px 10px 6px" }}>
        On this page
      </span>
      {items.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => jump(t.id)}
            style={{
              position: "relative",
              display: "flex", alignItems: "center", textAlign: "left", cursor: "pointer",
              padding: "6px 12px", borderRadius: 8, border: "none",
              background: "transparent",
              color: on ? ACCENT : "var(--text-secondary)",
              fontWeight: on ? 600 : 500, fontSize: "0.78rem", transition: "color 0.2s",
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-current={on ? "true" : undefined}
          >
            {on && (
              <motion.span
                layoutId="toc-active"
                transition={{ type: "spring", stiffness: 460, damping: 40 }}
                style={{ position: "absolute", inset: 0, borderRadius: 8, background: ACCENT + "14" }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Page scroll container. Owns its own 100vh scroll, like the Staging page. */
export function CaseShell({ children, id = "case-scroll" }: { children: React.ReactNode; id?: string }) {
  return (
    <div id={id} style={{ height: "100vh", overflowY: "auto", background: PAGE_BG, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      {children}
    </div>
  );
}
