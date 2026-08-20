"use client";

/* v3 — current build. Lives here so /work/staging (canonical) and
   /work/staging/v3 both render it. */

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "@/components/Lightbox";

/* ── Palette (a touch more light sage than the base tokens) ─── */
const PAGE_BG = "#F2F6F3";
const ALT_BG = "#E7EEE9";
const ACCENT = "#2E7D6E"; // sage-green; purple stays reserved for AI

const BASE = "/case-studies/staging";

/* ── Content ─────────────────────────────────────────────────
   Copy generated through the Content system (voice-dna).
   Enterprise-instructive lean. Human-centered framing.
   No em-dashes. No "just / simply / easy". Benefit-first.
   ──────────────────────────────────────────────────────────── */

const WORK_FLOW = [
  {
    src: `${BASE}/flow-empty-state-highlighted.png`,
    title: "The empty state",
    caption: "Before staging exists, the dashboard explains the concept and offers one action: create it.",
    pos: "top",
  },
  {
    src: `${BASE}/flow-single-site.png`,
    title: "Pull to staging",
    caption: "The confirmation before a copy runs, phrased as a question, with the terms checkbox gating the button.",
    pos: "center",
  },
  {
    src: `${BASE}/success-toast-card.png`,
    title: "Ready",
    caption: "A toast confirms the environment is live, and where to reach it before going public.",
    pos: "center",
  },
  {
    src: `${BASE}/populated-dashboard-highlighted.png`,
    title: "Staging created",
    caption: "Back on the dashboard, the environment now exists: its address, history, and the push, pull, and delete actions.",
    pos: "top",
  },
];

const TERMS = [
  { concept: "The public site", dev: "production, prod", ours: "Live site" },
  { concept: "The private copy", dev: "staging, staging env", ours: "Staging environment" },
  { concept: "Send changes up", dev: "deploy, push to prod", ours: "Push to live" },
  { concept: "Bring the live site down", dev: "pull, sync down", ours: "Pull to staging" },
];

const ERROR_STATES = [
  { when: "Before staging exists", what: "A failed action right after a confirmation closes the modal and drops a toast, bottom right. Nothing half-done stays on screen." },
  { when: "While creating", what: "An inline status appears on the staging card, with a retry." },
  { when: "While pushing to live", what: "Inline status on the card, plus a page-level alert on top. Pushing touches the live site, so the warning gets more room." },
  { when: "While pulling live", what: "The same pattern: card status and a page-level alert, so a failed pull is never silent." },
  { when: "While deleting", what: "Card status and a page-level alert again. A failed delete always surfaces." },
];
const ERROR_IMAGES = [
  `${BASE}/error-1-before-create.png`,
  `${BASE}/error-2-creating.png`,
  `${BASE}/error-3-pushing.png`,
  `${BASE}/error-4-pulling.png`,
  `${BASE}/error-5-deleting.png`,
];

/* Impact cards, left → right: paid plans, adoption, ARPU. */
const STATS = [
  { big: "Business · Grow · Scale", label: "The paid plans where staging shipped" },
  { big: "12.5% → ~62.5%", label: "Turned on staging in targeted groups, first month of testing to two quarters in" },
  { big: "$127 → $147", label: "ARPU in the test markets, across the test period" },
];

const SOCIAL: { src: string; alt: string }[] = [
  { src: `${BASE}/social-1.png`, alt: "Community comment: Excellent update. Thanks to the Elementor team." },
  { src: `${BASE}/social-2.png`, alt: "Community comment: thanks to the Elementor team for the great features and continuous updates." },
  { src: `${BASE}/social-3.png`, alt: "Community comment: Wow what a massive update. So excited to try out everything." },
  { src: `${BASE}/social-4.png`, alt: "Community comment: Seeing Elementor getting better and better. Keep it up devs." },
  { src: `${BASE}/social-5.png`, alt: "Community comment: A wonderful update. Congratulations to the great team of Elementor." },
];

/* ── Shared bits ─────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "var(--font-display)", color: ACCENT }}>{children}</span>;
}

function TitleLine({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--text-primary)" }}>{children}</h2>;
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <TitleLine>{title}</TitleLine>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620 }}>{children}</p>;
}

function ExpandHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
      <Maximize2 size={12} />
      {children}
    </span>
  );
}

function Section({ children, alt = false, id }: { children: React.ReactNode; alt?: boolean; id?: string }) {
  return (
    <section id={id} style={{ background: alt ? ALT_BG : "transparent", borderTop: "1px solid var(--border)", scrollMarginTop: 64 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 88px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {children}
      </div>
    </section>
  );
}

/* Floating, sticky table of contents (top-right). Jumps between sections
   and tracks the active one. Hidden under 1240px via .case-toc in globals.css. */
const TOC = [
  { id: "intro", label: "Introduction" },
  { id: "bet", label: "Background" },
  { id: "language", label: "The language" },
  { id: "work", label: "The work" },
  { id: "errors", label: "The error system" },
  { id: "impact", label: "Impact" },
  { id: "summary", label: "Summary" },
];

function TableOfContents() {
  const [active, setActive] = useState("intro");
  const lockUntil = useRef(0);
  useEffect(() => {
    const c = document.getElementById("case-scroll");
    if (!c) return;
    const onScroll = () => {
      // While a click-initiated scroll is animating, keep the clicked item
      // highlighted instead of tracking the sections it passes through.
      if (performance.now() < lockUntil.current) return;
      // At the bottom, the last (short) section is the active one even if it
      // never reaches the top of the viewport.
      if (c.scrollTop + c.clientHeight >= c.scrollHeight - 4) {
        setActive(TOC[TOC.length - 1].id);
        return;
      }
      const cTop = c.getBoundingClientRect().top;
      const marker = 120; // px below the container top
      let current = TOC[0].id;
      for (const t of TOC) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top - cTop - marker <= 0) current = t.id;
      }
      setActive(current);
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => c.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    const container = document.getElementById("case-scroll");
    if (!el || !container) return;
    setActive(id); // highlight immediately, even for the short bottom section
    const target = container.scrollTop + el.getBoundingClientRect().top - container.getBoundingClientRect().top - 56;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { container.scrollTop = target; return; }
    // setTimeout-driven eased scroll: it sets scrollTop directly, so it moves
    // reliably even where native smooth-scroll is a no-op.
    const startTop = container.scrollTop;
    const dist = target - startTop;
    const duration = 460;
    lockUntil.current = performance.now() + duration + 120;
    const t0 = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / duration);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      container.scrollTop = startTop + dist * ease;
      if (p < 1) setTimeout(tick, 16);
    };
    tick();
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
      {TOC.map((t) => {
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

/** Expandable image: hover overlay + click opens the Lightbox. */
function ExpandableImage({
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

/** Horizontal flow carousel with fade edges + arrow buttons + click-to-expand. */
function FlowCarousel({ items, onOpen }: { items: typeof WORK_FLOW; onOpen: (i: number) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 10);
    setAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth < 10);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={railRef} onScroll={onScroll} className="carousel-rail" style={{ display: "flex", gap: "var(--space-4)", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "var(--space-2)" } as React.CSSProperties}>
        {items.map((f, i) => (
          <figure key={f.src} style={{ margin: 0, flexShrink: 0, width: "min(320px, 80vw)", scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <ExpandableImage src={f.src} alt={f.title} onOpen={() => onOpen(i)} height={300} objectPosition={f.pos} />
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

/* ── Page ────────────────────────────────────────────────────── */

export default function StagingCaseStudy() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <div id="case-scroll" style={{ height: "100vh", overflowY: "auto", background: PAGE_BG, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(242,246,243,0.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-3) var(--space-6)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}>
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header id="intro" style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)", scrollMarginTop: 64 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Case study · Elementor</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 780 }}>
            Making a dev feature speak WordPress
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            Elementor empowers millions of web creators to build professional WordPress sites. As the product grew from a plugin into a hosting platform, it added the features hosting users expect. Staging is one of them: a private copy of your live site where you test changes before they reach the public. Developers have relied on it for years, and it topped feature requests across the WordPress world. It is also a developer concept, and it was arriving in front of designers and small-business owners who had never touched one. I owned the content design that introduced it.
          </p>
        </motion.div>

        {/* Meta — Surface, Role, Contributions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-2)" }}>
          {[
            ["Surface", "Elementor Hosting"],
            ["Role", "Sr. Content Designer"],
            ["Contributions", "Content design · UX writing · prototyping · design iteration"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{k}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: 320 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* First image = the crux modal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
          <ExpandHint>The crux of the flow. Click to open it full size.</ExpandHint>
          <div style={{ maxWidth: 620 }}>
            <ExpandableImage src={`${BASE}/flow-golive-modal.png`} alt="Confirmation modal: Push changes in staging to your live website?" onOpen={() => open([`${BASE}/flow-golive-modal.png`], 0)} contain />
          </div>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 620 }}>
            Going live is the moment a creator commits. This confirmation carries the whole idea: what happens, what it overwrites, that a backup exists, and that the site pauses while it runs. The checkbox gates the button.
          </span>
        </div>
      </header>

      {/* The bet */}
      <Section alt id="bet">
        <SectionHeader eyebrow="Background" title="A developer feature, for non-developers" />
        <Body>Most of Elementor&apos;s creators are designers, freelancers, and small teams, not engineers. Moving them onto Elementor&apos;s own hosting meant meeting a new expectation: the platform features that come with hosting, staging among them.</Body>
        <Body>The catch is that staging is a developer&apos;s tool. My job was to introduce it in language a designer already understands, and to do it inside the flow, while people used it.</Body>
      </Section>

      {/* The language (moved up: research/planning precedes the work) */}
      <Section id="language">
        <SectionHeader eyebrow="The language" title="Plain words for a developer concept" />
        <Body>WordPress, Elementor, and developer tooling all name the same things differently. Before writing a single screen, I researched the standard terms and built one set the whole flow could use, carrying the developer meaning in words a creator already knows.</Body>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", background: PAGE_BG, borderBottom: "1px solid var(--border)" }}>
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>Concept</div>
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>Dev-native</div>
            <div style={{ padding: "var(--space-3) var(--space-4)", color: ACCENT }}>What we shipped</div>
          </div>
          {TERMS.map((t, i) => (
            <div key={t.ours} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", borderBottom: i < TERMS.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.8125rem" }}>
              <div style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{t.concept}</div>
              <div style={{ padding: "var(--space-4)", color: "var(--text-muted)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{t.dev}</div>
              <div style={{ padding: "var(--space-4)", color: "var(--text-primary)", fontWeight: 600 }}>{t.ours}</div>
            </div>
          ))}
        </div>
        <Body>The through-line is human-centered: every term names what the creator does, not what the system does. They push changes and go live. The platform stays out of the sentence.</Body>
      </Section>

      {/* The work (opens with the dashboard) */}
      <Section alt id="work">
        <SectionHeader eyebrow="The work" title="Every screen, every state" />
        <Body>I owned the content across the My Elementor dashboard. The focus here is the staging environment, and it starts by being easy to reach: staging lives in the dashboard, next to the site it copies, rather than behind several clicks. The first screen explains what a staging environment is and offers how to create one.</Body>
        <Body>From there I designed the content for the full path: the confirmation before a copy runs, the warnings around every action that can overwrite a live site, and the populated dashboard once staging exists.</Body>
        <Body>The final text was mine to approve, and it was not written in isolation. I worked with product and design across several iterations, prototyping and moving boxes together until the logic held: what a creator sees first, what they must understand before they commit, and what we say when the copy is the only thing between them and an overwritten site.</Body>
        <ExpandHint>Scroll through the flow, or click for full size.</ExpandHint>
        <FlowCarousel items={WORK_FLOW} onOpen={(i) => open(WORK_FLOW.map((f) => f.src), i)} />
      </Section>

      {/* The error system */}
      <Section id="errors">
        <SectionHeader eyebrow="The error system" title="Designing the failures" />
        <Body>Every action can fail: creating, pushing, pulling, deleting. A failure while overwriting a live site is the worst moment in the flow, so failures needed a system, not scattered strings. I mapped a state to each action and set where its message appears: a toast after a confirmation, an inline status with a retry on the card, a page-level alert for the actions that touch the live site.</Body>
        <ExpandHint>Click a state to open the exact screen.</ExpandHint>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {ERROR_STATES.map((e, i) => (
            <ErrorCard key={e.when} when={e.when} what={e.what} onClick={() => open(ERROR_IMAGES, i)} />
          ))}
        </div>
      </Section>

      {/* Impact */}
      <Section alt id="impact">
        <SectionHeader eyebrow="Impact" title="What the release moved" />

        {/* Pricing image first, above the numbers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>Click for full size.</ExpandHint>
          <ExpandableImage src={`${BASE}/pricing-plans-highlighted.png`} alt="Elementor pricing table. Staging Environment is the last feature on Business, Grow, and Scale, highlighted in red." onOpen={() => open([`${BASE}/pricing-plans-highlighted.png`], 0)} contain />
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 620 }}>
            Staging shipped as a paid feature, on Business, Grow, and Scale, and not on Basic. I owned the pricing page&apos;s UX and content as a separate project.
          </span>
        </div>

        <Body>Two numbers moved, and they are worth separating. Adoption climbed in the targeted test groups, and revenue climbed in the markets where staging shipped, over the same test period.</Body>

        {/* Cards: plans, adoption, ARPU */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
              <span style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: ACCENT, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{s.big}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Second title within Impact: user sentiment */}
        {SOCIAL.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
            <TitleLine>What creators said</TitleLine>
            <Body>Through the rollout window, the releases landed well with the community.</Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 560 }}>
              {SOCIAL.map((s) => (
                <div key={s.src} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-card)", background: "var(--card-bg)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Summary */}
      <section id="summary" style={{ borderTop: "1px solid var(--border)", background: PAGE_BG, scrollMarginTop: 64 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <Eyebrow>Summary</Eyebrow>
          <p style={{ fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.8, color: "var(--text-secondary)", maxWidth: 640 }}>
            Staging went from a developer&apos;s tool to something an Elementor creator can turn on without a manual. The flow teaches the concept while people use it, the language stays in their world, and the failures never leave them stranded. Adoption and revenue followed.
          </p>
          <BackToDashboardCta />
        </div>
      </section>

      <TableOfContents />

      {lightbox && <Lightbox images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ── BackToDashboardCta ──────────────────────────────────────── */

function BackToDashboardCta() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href="/"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600,
        color: "white", background: hover ? "#3C9384" : ACCENT, padding: "10px 18px",
        borderRadius: "var(--radius-md)", textDecoration: "none", transition: "background 0.15s",
      }}
    >
      <ArrowLeft size={15} />
      Back to dashboard
    </Link>
  );
}

/* ── ErrorCard ───────────────────────────────────────────────── */

function ErrorCard({ when, what, onClick }: { when: string; what: string; onClick: () => void }) {
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
      aria-label={`Open error state: ${when}`}
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
