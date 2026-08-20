/* v2 — FROZEN snapshot for comparison. Do not edit; v3 lives in StagingCaseStudy.tsx. */
"use client";

import { useRef, useState, useCallback } from "react";
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
    src: `${BASE}/flow-staging-site.png`,
    title: "Inside the environment",
    caption:
      "An amber banner marks staging on every screen. Push, pull, and delete stay in one place, with a full history below.",
  },
  {
    src: `${BASE}/flow-push-modal.png`,
    title: "Pull to staging",
    caption:
      "Copying the live site into staging. The modal sets expectations before the copy runs, and the checkbox gates the button.",
  },
  {
    src: `${BASE}/flow-single-site.png`,
    title: "The overwrite warning",
    caption:
      "Pulling live back down overwrites staging. The warning names what changes, and what access pauses while it runs.",
  },
];

const TERMS = [
  { concept: "The public site", dev: "production, prod", ours: "Live site" },
  { concept: "The private copy", dev: "staging, staging env", ours: "Staging environment" },
  { concept: "Send changes up", dev: "deploy, push to prod", ours: "Push to live" },
  { concept: "Bring the live site down", dev: "pull, sync down", ours: "Pull to staging" },
];

const ERROR_STATES = [
  {
    when: "Before staging exists",
    what: "A failed action right after a confirmation closes the modal and drops a toast, bottom right. Nothing half-done stays on screen.",
  },
  {
    when: "While creating",
    what: "An inline status appears on the staging card, with a retry.",
  },
  {
    when: "While pushing to live",
    what: "Inline status on the card, plus a page-level alert on top. Pushing touches the live site, so the warning gets more room.",
  },
  {
    when: "While pulling live",
    what: "The same pattern: card status and a page-level alert, so a failed pull is never silent.",
  },
  {
    when: "While deleting",
    what: "Card status and a page-level alert again. A failed delete always surfaces.",
  },
];
const ERROR_IMAGES = [
  `${BASE}/error-1-before-create.png`,
  `${BASE}/error-2-creating.png`,
  `${BASE}/error-3-pushing.png`,
  `${BASE}/error-4-pulling.png`,
  `${BASE}/error-5-deleting.png`,
];

const STATS = [
  { big: "12.5% → ~62.5%", label: "Turned on staging in targeted groups, first month of testing to two quarters in" },
  { big: "$127 → $147", label: "ARPU in the test markets, across the test period" },
  { big: "Business · Grow · Scale", label: "The paid plans where staging shipped" },
];

/* Feature-neutral community gratitude clips from the rollout-window releases
   (from the OKR decks). No staging-specific praise exists, so these speak to
   the release cadence, not the feature. */
const SOCIAL: { src: string; alt: string }[] = [
  { src: `${BASE}/social-1.png`, alt: "Community comment: Excellent update. Thanks to the Elementor team." },
  { src: `${BASE}/social-2.png`, alt: "Community comment: thanks to the Elementor team for the great features and continuous updates." },
  { src: `${BASE}/social-3.png`, alt: "Community comment: Wow what a massive update. So excited to try out everything." },
  { src: `${BASE}/social-4.png`, alt: "Community comment: Seeing Elementor getting better and better. Keep it up devs." },
  { src: `${BASE}/social-5.png`, alt: "Community comment: A wonderful update. Congratulations to the great team of Elementor." },
];

/* ── Shared bits ─────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "var(--font-display)", color: ACCENT }}>
      {children}
    </span>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--text-primary)" }}>
        {title}
      </h2>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620 }}>{children}</p>;
}

/** Small instruction line placed ABOVE every expandable element. */
function ExpandHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
      <Maximize2 size={12} />
      {children}
    </span>
  );
}

function Section({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <section style={{ background: alt ? ALT_BG : "transparent", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 88px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {children}
      </div>
    </section>
  );
}

/** Expandable image: hover overlay + click opens the Lightbox. */
function ExpandableImage({
  src, alt, onOpen, height, contain = false,
}: {
  src: string; alt: string; onOpen: () => void; height?: number; contain?: boolean;
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
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: height ? "100%" : "auto", objectFit: contain ? "contain" : "cover", objectPosition: "top", display: "block" }}
      />
      <span
        style={{
          position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(20,35,22,0.62)", color: "white",
          opacity: hover ? 1 : 0, transition: "opacity 0.18s", pointerEvents: "none",
        }}
      >
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
      <div
        ref={railRef}
        onScroll={onScroll}
        className="carousel-rail"
        style={{ display: "flex", gap: "var(--space-4)", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "var(--space-2)" } as React.CSSProperties}
      >
        {items.map((f, i) => (
          <figure key={f.src} style={{ margin: 0, flexShrink: 0, width: "min(340px, 80vw)", scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <ExpandableImage src={f.src} alt={f.title} onOpen={() => onOpen(i)} height={300} contain />
            <figcaption style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{f.title}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{f.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Left fade + arrow */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, display: "flex", alignItems: "center", justifyContent: "flex-start", pointerEvents: "none", background: `linear-gradient(to right, ${ALT_BG} 20%, transparent)`, opacity: atStart ? 0 : 1, transition: "opacity 0.2s" }}>
        <div style={{ pointerEvents: "auto" }}><RailBtn dir="left" disabled={atStart} onClick={() => scrollBy(-1)} /></div>
      </div>
      {/* Right fade + arrow */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, display: "flex", alignItems: "center", justifyContent: "flex-end", pointerEvents: "none", background: `linear-gradient(to left, ${ALT_BG} 20%, transparent)`, opacity: atEnd ? 0 : 1, transition: "opacity 0.2s" }}>
        <div style={{ pointerEvents: "auto" }}><RailBtn dir="right" disabled={atEnd} onClick={() => scrollBy(1)} /></div>
      </div>
    </div>
  );
}

function RailBtn({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card-bg)", border: "1px solid var(--border)", color: disabled ? "var(--border)" : ACCENT, cursor: disabled ? "default" : "pointer", boxShadow: "var(--shadow-card)" }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {dir === "left" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function StagingV2() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <div style={{ height: "100vh", overflowY: "auto", background: PAGE_BG, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
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
      <header style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Case study · Elementor</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 780 }}>
            Making a dev feature speak WordPress
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            Elementor empowers millions of web creators to build professional WordPress sites. As the product grew from a plugin into a hosting platform, it added the features hosting users expect. Staging is one of them: a private copy of your live site where you test changes before they reach the public. Developers have relied on it for years, and it topped feature requests across the WordPress world. It is also a developer concept, and it was arriving in front of designers and small-business owners who had never touched one. I owned the content design that introduced it.
          </p>
        </motion.div>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-2)" }}>
          {[
            ["Role", "Sr. Content Designer"],
            ["Contributions", "Content design · UX writing · prototyping · design iteration"],
            ["Surface", "Elementor Hosting"],
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
            <ExpandableImage
              src={`${BASE}/flow-golive-modal.png`}
              alt="Confirmation modal: Push changes in staging to your live website?"
              onOpen={() => open([`${BASE}/flow-golive-modal.png`], 0)}
              contain
            />
          </div>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 620 }}>
            Going live is the moment a creator commits. This confirmation carries the whole idea: what happens, what it overwrites, that a backup exists, and that the site pauses while it runs. The checkbox gates the button.
          </span>
        </div>
      </header>

      {/* The bet */}
      <Section>
        <SectionHeader eyebrow="The bet" title="A developer feature, for non-developers" />
        <Body>
          Most of Elementor&apos;s creators are designers, freelancers, and small teams, not engineers. Moving them onto Elementor&apos;s own hosting meant meeting a new expectation: the platform features that come with hosting, staging among them.
        </Body>
        <Body>
          The catch is that staging is a developer&apos;s tool. My job was to introduce it in language a designer already understands, and to do it inside the flow, while people used it.
        </Body>
      </Section>

      {/* Where it lives */}
      <Section alt>
        <SectionHeader eyebrow="Where it lives" title="It lives in the dashboard" />
        <Body>
          Staging is not buried behind a wall. It sits in the My Elementor dashboard, next to the site it copies, one step from where creators already manage their work. The first screen has one job: say what a staging environment is, and offer a single action to create one.
        </Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>Click to open the dashboard entry point full size.</ExpandHint>
          <div style={{ maxWidth: 720 }}>
            <ExpandableImage
              src={`${BASE}/flow-empty-state.png`}
              alt="The staging panel in the My Elementor dashboard, with a Create staging action."
              onOpen={() => open([`${BASE}/flow-empty-state.png`], 0)}
              height={320}
              contain
            />
          </div>
        </div>
      </Section>

      {/* The work */}
      <Section>
        <SectionHeader eyebrow="The work" title="Every screen, every state" />
        <Body>
          I designed the content for the full path: the empty state before staging exists, the confirmation before a copy runs, the environment itself, and the warnings around every action that can overwrite a live site.
        </Body>
        <Body>
          This was not a solo pass over finished screens. I worked with product and design across several iterations, prototyping and moving boxes together until the logic held: what a creator sees first, what they must understand before they commit, and what we say when the copy is the only thing between them and an overwritten site.
        </Body>
        <ExpandHint>Scroll through the flow, or click any screen to open it full size.</ExpandHint>
        <FlowCarousel items={WORK_FLOW} onOpen={(i) => open(WORK_FLOW.map((f) => f.src), i)} />
      </Section>

      {/* The language */}
      <Section alt>
        <SectionHeader eyebrow="The language" title="Plain words for a developer concept" />
        <Body>
          WordPress, Elementor, and developer tooling all name the same things differently. I researched the standard terms and built one set the whole flow could use, carrying the developer meaning in words a creator already knows.
        </Body>

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
        <Body>
          The through-line is human-centered: every term names what the creator does, not what the system does. They push changes and go live. The platform stays out of the sentence.
        </Body>
      </Section>

      {/* The error system */}
      <Section>
        <SectionHeader eyebrow="The error system" title="Designing the failures" />
        <Body>
          Every action can fail: creating, pushing, pulling, deleting. A failure while overwriting a live site is the worst moment in the flow, so failures needed a system, not scattered strings. I mapped a state to each action and set where its message appears: a toast after a confirmation, an inline status with a retry on the card, a page-level alert for the actions that touch the live site. One pattern, learned once.
        </Body>
        <ExpandHint>Click a state to open the exact screen the creator sees.</ExpandHint>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {ERROR_STATES.map((e, i) => (
            <ErrorCard key={e.when} when={e.when} what={e.what} onClick={() => open(ERROR_IMAGES, i)} index={i} />
          ))}
        </div>
      </Section>

      {/* Impact */}
      <Section alt>
        <SectionHeader eyebrow="Impact" title="What the release moved" />
        <Body>
          Two numbers moved, and they are worth separating. Adoption: in the first month of testing with targeted groups, 12.5 percent turned staging on. Within two quarters, that reached about 62.5 percent of the group. Revenue: across the same period, in the markets where staging shipped, average revenue per user rose from $127 to $147. Adoption and ARPU climbed together.
        </Body>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
              <span style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: ACCENT, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{s.big}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Pricing image relocated here, framed as a separate project */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
          <Body>
            Staging shipped as a feature on the paid plans. I contributed to the pricing page&apos;s UX and content as a separate project, so it belongs here, at the commercial end of the story, not at the start of the flow.
          </Body>
          <ExpandHint>Click to open the pricing page full size.</ExpandHint>
          <ExpandableImage
            src={`${BASE}/pricing-plans-highlighted.png`}
            alt="Elementor pricing table. Staging Environment is the last feature on Business, Grow, and Scale, highlighted in red."
            onOpen={() => open([`${BASE}/pricing-plans-highlighted.png`], 0)}
            contain
          />
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 620 }}>
            Staging sits on Business, Grow, and Scale, and not on Basic.
          </span>
        </div>

        {/* Social proof (renders only when clips are present) */}
        {SOCIAL.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
            <Body>Through the rollout window, the releases landed well with the community.</Body>
            <ExpandHint>Click any comment to open it full size.</ExpandHint>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 560 }}>
              {SOCIAL.map((s, i) => (
                <ExpandableImage key={s.src} src={s.src} alt={s.alt} onOpen={() => open(SOCIAL.map((x) => x.src), i)} contain />
              ))}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 560 }}>
              Feature-neutral comments from the release feed. No post named staging specifically.
            </span>
          </div>
        )}
      </Section>

      {/* Close — plain body text, summary register */}
      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)", alignItems: "flex-start" }}>
          <p style={{ fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.8, color: "var(--text-secondary)", maxWidth: 640 }}>
            Staging went from a developer&apos;s tool to something an Elementor creator can turn on without a manual. The flow teaches the concept while people use it, the language stays in their world, and the failures never leave them stranded. Adoption and revenue followed.
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600, color: "white", background: ACCENT, padding: "10px 18px", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </section>

      {lightbox && (
        <Lightbox images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

/* ── ErrorCard ───────────────────────────────────────────────── */

function ErrorCard({ when, what, onClick, index }: { when: string; what: string; onClick: () => void; index: number }) {
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
