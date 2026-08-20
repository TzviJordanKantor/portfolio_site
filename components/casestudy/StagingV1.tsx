"use client";

/* v1 — FIRST BUILD, preserved for comparison. Marketing-flavored, static
   images, pricing-first, "nobody asked for" closer. Superseded by v2.
   Do not "improve" this file; it is a frozen snapshot of the iteration. */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BASE = "/case-studies/staging";
const ACCENT = "#2E7D6E";

const FLOW = [
  { src: `${BASE}/flow-empty-state.png`, title: "The empty state", caption: "Before staging exists, one panel does the teaching. It says what a staging environment is and offers one action: create one." },
  { src: `${BASE}/flow-push-modal.png`, title: "The confirmation", caption: "Pulling the live site into staging duplicates it. The modal sets expectations before the copy runs, and the terms checkbox gates the button." },
  { src: `${BASE}/flow-staging-site.png`, title: "Inside staging", caption: "An amber banner marks the environment on every screen. The action set stays in one place: push, pull, delete, with a full history log below." },
  { src: `${BASE}/flow-single-site.png`, title: "The overwrite warning", caption: "The destructive path gets the loudest copy. It names what gets overwritten and what access the user loses while the process runs." },
];

const TERMS = [
  { concept: "The public website", dev: "production, prod", ours: "Live site" },
  { concept: "The private copy", dev: "staging, staging env", ours: "Staging environment" },
  { concept: "Send changes up", dev: "deploy, push to prod", ours: "Push to live" },
  { concept: "Bring the live site down", dev: "pull, sync down", ours: "Pull to staging" },
];

const ERROR_STATES = [
  { when: "Right after a confirmation", what: "The modal closes and a toast appears at the bottom right. Nothing half-committed stays on screen." },
  { when: "While creating staging", what: "An inline status shows on the staging card, with a Retry." },
  { when: "While pushing or pulling", what: "Inline status on the card, plus a page-level alert on top. These actions touch the live site, so the warning gets more room." },
  { when: "While deleting", what: "Same pattern: card status and a page-level alert, so a failed delete is never silent." },
];

const STATS = [
  { big: "12.5% → ~62.5%", label: "Staging adoption, first month of testing to two quarters in" },
  { big: "5×", label: "Growth in the targeted user groups over that window" },
  { big: "Business · Grow · Scale", label: "Shipped across the three paid plans" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "var(--font-display)", color: ACCENT }}>{children}</span>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", lineHeight: 1.15, color: "var(--text-primary)" }}>{children}</h2>;
}
function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620 }}>{children}</p>;
}
function Section({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <section style={{ background: alt ? "var(--card-bg-alt)" : "transparent", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 88px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {children}
      </div>
    </section>
  );
}

export default function StagingV1() {
  return (
    <div style={{ height: "100vh", overflowY: "auto", background: "var(--body-bg)", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,251,250,0.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-3) var(--space-6)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}>
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </div>

      <header style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(56px, 10vw, 104px) var(--space-6) clamp(40px, 6vw, 64px)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Case study · Elementor</Eyebrow>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--text-primary)", maxWidth: 760 }}>
            Shipping staging to people who never asked for it
          </h1>
          <p style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 640 }}>
            Elementor was growing from a plugin into a hosting platform. Staging came with that move: a developer-grade feature pointed at designers and small-business owners who had never needed one. I owned the content design for the flow. It had to teach the concept while people used it.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-3)" }}>
          {[["Role", "Sr. Content Designer"], ["Scope", "End-to-end flow, microcopy, error system"], ["Product", "Elementor Hosting"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{k}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </header>

      <Section>
        <Eyebrow>The bet</Eyebrow>
        <SectionTitle>A platform feature for a non-technical audience</SectionTitle>
        <Body>Elementor built websites for ten million people. Most were designers, freelancers, and small teams, not engineers. The company was moving those users onto its own hosting, and hosting users expect platform features: backups, site management, staging.</Body>
        <Body>Staging is where you copy your live site, break things safely, and push the changes back once they work. Developers do this without thinking. Our users had never heard the word.</Body>
        <Body>The plan put staging one rung up from free, behind the paid plans. So the content had a second job on top of teaching the concept. It had to make the feature worth paying for.</Body>
      </Section>

      <Section alt>
        <Eyebrow>Where it lived</Eyebrow>
        <SectionTitle>A user meets the word as a line they are asked to pay for</SectionTitle>
        <Body>Staging sat at the bottom of the feature list on three paid plans: Business, Grow, and Scale. Last line, smallest type, next to an info icon. No demo, no tour.</Body>
        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-card)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/pricing-plans-highlighted.png`} alt="Elementor pricing table, Staging Environment highlighted on the paid plans." style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-sm)" }} />
          </div>
          <figcaption style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>The paywall line. Staging is present on Business, Grow, and Scale, and absent from Basic. That placement set the terms: the feature has to explain itself from a cold start, and sound like something a designer would want, not something an engineer tolerates.</figcaption>
        </figure>
      </Section>

      <Section>
        <Eyebrow>The work</Eyebrow>
        <SectionTitle>Content for the full lifecycle</SectionTitle>
        <Body>I designed the content for the whole path: the empty state before staging exists, the confirmation before a copy runs, the environment itself, and every warning around the actions that overwrite a live site.</Body>
        <Body>This was not a solo pass over finished screens. I worked with product and design across several iterations, moving boxes and rewriting flows together until the logic held: what a user sees first, what they have to understand before they commit, and what we say when the copy is the only thing between them and an overwritten website.</Body>
        <div className="carousel-rail" style={{ display: "flex", gap: "var(--space-4)", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "var(--space-3)" } as React.CSSProperties}>
          {FLOW.map((f) => (
            <figure key={f.src} style={{ margin: 0, flexShrink: 0, width: "min(340px, 78vw)", scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ height: 300, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.title} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
              <figcaption style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{f.title}</span>
                <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{f.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", letterSpacing: "0.02em" }}>Scroll to move through the flow →</span>
      </Section>

      <Section alt>
        <Eyebrow>The language system</Eyebrow>
        <SectionTitle>One vocabulary, bridging two worlds</SectionTitle>
        <Body>WordPress, Elementor, and developer tooling all name the same things differently. I researched the industry-standard terms and built one hierarchy the whole flow could use, carrying the dev-native meaning underneath in words a designer would recognize.</Body>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", background: "var(--body-bg)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>Concept</div>
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>Dev-native</div>
            <div style={{ padding: "var(--space-3) var(--space-4)", color: ACCENT }}>What we shipped</div>
          </div>
          {TERMS.map((t, i) => (
            <div key={t.ours} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", borderBottom: i < TERMS.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.8125rem" }}>
              <div style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>{t.concept}</div>
              <div style={{ padding: "var(--space-4)", color: "var(--text-muted)", fontFamily: "ui-monospace, monospace" }}>{t.dev}</div>
              <div style={{ padding: "var(--space-4)", color: "var(--text-primary)", fontWeight: 600 }}>{t.ours}</div>
            </div>
          ))}
        </div>
        <Body>One decision stood in for the whole approach. We wrote environment in full, never env. Env is muscle memory for engineers and noise for everyone else.</Body>
      </Section>

      <Section>
        <Eyebrow>The error system</Eyebrow>
        <SectionTitle>Failure gets its own logic, not one-off strings</SectionTitle>
        <Body>Every action in staging can fail: creating, pushing, pulling, deleting. A failure in the middle of overwriting a live site is the worst moment in the flow. So the errors needed a system, with one rule for where each message shows up, learned once and true everywhere.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {ERROR_STATES.map((e) => (
            <div key={e.when} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`, borderRadius: "var(--radius-md)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{e.when}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{e.what}</span>
            </div>
          ))}
        </div>
        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="carousel-rail" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", boxShadow: "var(--shadow-card)", overflowX: "auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/flow-errors.png`} alt="The error-state matrix." style={{ height: 360, width: "auto", display: "block", maxWidth: "none", borderRadius: "var(--radius-sm)" }} />
          </div>
          <figcaption style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>The error matrix, mapped state by state. Scroll to see each lifecycle action and where its message lands.</figcaption>
        </figure>
      </Section>

      <Section alt>
        <Eyebrow>What happened</Eyebrow>
        <SectionTitle>Adoption climbed, and so did ARPU</SectionTitle>
        <Body>We shipped the full flow across the paid plans. In the first month of testing with targeted user groups, staging adoption sat at 12.5 percent. Within two quarters it reached roughly 62.5 percent of that group, five times where it started. YTD ARPU rose over the same window.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
              <span style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: ACCENT, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{s.big}</span>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)", alignItems: "flex-start" }}>
          <p style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 400, fontFamily: "var(--font-display)", lineHeight: 1.3, color: "var(--text-primary)", maxWidth: 640, letterSpacing: "-0.01em" }}>
            A feature nobody asked for, on three plans, explained well enough that people paid for it and used it.
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600, color: "white", background: ACCENT, padding: "10px 18px", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
