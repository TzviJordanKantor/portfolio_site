"use client";

/* FROZEN — "Original". Byte-for-byte the first CyberArk case-study draft as it
   stood at HEAD fc02579 on 2026-09-10, with only the exported symbol renamed.
   Do not edit. Backup: ~/Desktop/project-b-backups/2026-09-10-pre-v1/.
   Three mechanical repairs only, none of which change a rendered word:
   the two compile repairs marked below, the Section-stretch fix on the CTA,
   and eight bare apostrophes in JSX text escaped to &apos; so the production
   build passes react/no-unescaped-entities.
   The V1 narrative rebuild lives in CyberArkV1.tsx. */
/* ── V1 draft. CyberArk Experience Builder case study. ─────────────
   Working revision. NOT wired into any route yet -- no page.tsx imports this
   until the practitioner reviews it. See docs/experience-builder/case-study-outline.md
   for the full content architecture and docs/evidence-ledger.md for what each
   claim below is allowed to say.

   Evidence-tier discipline (evidence-ledger.md §E), carried through every section:
     Verified       -- a document from the time (style guide, workshop deck).
     Attested       -- I've said it, nothing contradicts it. First person, no invented numbers.
     Reconstructed  -- rebuilt from the attested description + concept mockups. Every
                       image says "Reconstructed" (D-004). Never presented as a screenshot.
     Independent rebuild -- KantorBot Experience Builder, built separately from this
                       system, generalized, and currently in beta.

   Copy rules (voice-dna, same as FaxCaseStudy):
   - First person, ownership verbs.
   - No negative-first framing.
   - No em-dashes. Colons introduce elaboration.
   - Present tense for what a system does; past tense for what I built.

   TODO before this is publishable:
   - "system" section: FlowCarousel image paths point at
     public/assets/experience-builder/reconstructed/*.png, populated by the Figma
     reconstruction agent. Placeholder paths below; verify against
     docs/experience-builder/figma-node-map.json once that agent finishes.
   - "try-it" section: SUBDOMAIN_PLACEHOLDER stays literal until the KantorBot
     subdomain is stable and approved (docs/decisions.md D-021).
   - DEFERRED SYNC (D-042): KantorBot is described as beta throughout, because it
     is not publicly live and has no real usage numbers yet. When it genuinely
     launches, update this section's copy and swap SUBDOMAIN_PLACEHOLDER for the
     real URL. Do not describe it as live before then. See
     docs/cross-stream-implications.md, "Deferred synchronization".
   - Role title uses the portfolio's existing default ("UX and Product Content
     Lead") pending the practitioner's ruling on the resume-title contradiction
     (evidence-ledger.md §B). */

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import {
  Eyebrow, TitleLine, SectionHeader, Body, Caption, ExpandHint, Section,
  DataTable, ExpandableImage, FlowCarousel, StatGrid, Hint,
  TopBar, BackToDashboardCta, TableOfContents, CaseShell, ACCENT,
  type FlowItem, type TocItem, type Stat,
} from "@/components/casestudy/kit";

const STYLE_GUIDE_BASE = "/assets/work-samples/cyberark";
const RECON_BASE = "/assets/experience-builder/reconstructed";
const BACK_HREF = "/?exp=cyberark";

/** Kept as a literal placeholder until the subdomain is stable and approved.
    Do not hardcode a guessed URL here. See docs/decisions.md D-021. */
const SUBDOMAIN_PLACEHOLDER = "{{the_subdomain}}";

const TOC: TocItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "background", label: "Background" },
  { id: "style-guide", label: "The style guide" },
  { id: "workshop", label: "The workshop" },
  { id: "workflow", label: "The workflow I built" },
  { id: "impact", label: "Impact" },
  { id: "system", label: "The system, reconstructed" },
  { id: "guardrails", label: "Guardrails" },
  { id: "try-it", label: "Where it&apos;s going" },
  { id: "summary", label: "Summary" },
];

/* ── Impact (Attested) ──────────────────────────────────────────
   Source: practitioner recollection, consolidated 2026-09-08
   (docs/experience-builder/cyberark-impact-questions.md answers).
   Every figure here is Attested: first-person recollection, not a
   retained dashboard or export. "Roughly a third of the previous
   time" is the practitioner's own phrase and stays exactly as given,
   not converted to a percentage. Overlapping adoption estimates are
   kept separate rather than summed into one total. */
const IMPACT_STATS: Stat[] = [
  { big: "~⅓", label: "Of the previous time to get through the same review and alignment work, from combined Jira turnaround signals, surveys, and interviews" },
  { big: "12 of 20", label: "Writers on my team who used the workflow on their own products, alongside dozens of Support staff and colleagues across Product, UX, and Design" },
  { big: "~120", label: "People across roles took part in the wider measurement and feedback effort by the later period" },
  { big: "1st pass", label: "A complex, cross-product flow got signed off by every writer whose area it touched, on the first review" },
];

const STYLE_GUIDE_IMAGES: FlowItem[] = [
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p1.png`, title: "Cover", caption: "The guide&apos;s cover: positioned as both a reference during review and a prompt for new writing." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p2.png`, title: "Voice & tone", caption: "One voice, direct and clear. Five tones, Instructive as the default, Reassuring or Helpful when a user is blocked or anxious." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p3.png`, title: "Microcopy patterns", caption: "Fill-in-the-blank templates with parenthetical guidance and bracketed slots, built to be used at the point of work." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p4.png`, title: "Component copy", caption: "Rules tied to specific components." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p5.png`, title: "Error framework", caption: "The problem stated first, then the impact, then the fix." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-style-guide-p6.png`, title: "Terminology", caption: "One term per concept, standardized across the product suite." },
];

const WORKSHOP_IMAGES: FlowItem[] = [
  { src: `${STYLE_GUIDE_BASE}/cyberark-ux-principles-p1.png`, title: "The framework", caption: "Ten questions designers actually ask while working, each grounded in a real product screen." },
  { src: `${STYLE_GUIDE_BASE}/cyberark-ux-principles-p2.png`, title: "From principle to decision", caption: "Cognitive load maps to shorter strings. Error design maps to safe exits. Recognition over recall maps to consistent terminology." },
];

const GATE_ROWS: [string, string, string][] = [
  ["G-IN · Input", "The brief is complete: open questions resolved or assumptions accepted before anything generates.", "Blocking"],
  ["G-DS · Design system", "Every component resolves to a registry entry. Tokens and layout match what&apos;s approved.", "Blocking"],
  ["G-SG · Style guide", "Pattern grammar filled, verb-led CTAs, banned words caught, sentence case, lexicon matched.", "Blocking"],
  ["G-TERM · Terminology", "Say/avoid glossary and page-local consistency checked against the same term list every time.", "Blocking"],
  ["G-TONE · Tone & state of mind", "Tone level matches the user&apos;s declared state: Instructive by default, Reassuring when blocked.", "Warning by default; blocking for high-consequence flows"],
  ["G-A11Y · Accessibility", "Plain language, reading level, labels, and contrast on the design system's own tokens.", "Blocking"],
  ["G-SPEC · Spectrum baseline", "Adobe Spectrum&apos;s content guidelines fill any gap the style guide leaves open.", "Warning"],
  ["G-APR · Approval", "A human reviewer signs off before anything writes back to Jira or freezes a file.", "Blocking"],
];

export default function CyberArkOriginal() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <CaseShell>
      <TopBar backHref={BACK_HREF} />

      {/* ── Hero / intro ── */}
      <header id="intro" style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)", scrollMarginTop: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Leadership case study · CyberArk</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 820 }}>
            Building a content system, then designing the tool to run it
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            This case study mixes four kinds of material, and I want to be upfront about which is which before any of it reads as a claim.
          </p>
        </div>

        <DataTable
          cols="1fr 3fr"
          headers={["Tier", "What it means here"]}
          rows={[
            ["Verified", "A document from the time: the style guide, the workshop deck. Shown as fact."],
            ["Attested", "I've said it and nothing contradicts it. First person, no invented numbers."],
            ["Reconstructed", "Rebuilt for this case study from the attested description, concept mockups, and research into what the real enterprise screens contain. Every image says so. Not a screenshot of an internal tool."],
            ["Independent rebuild", "KantorBot Experience Builder: the same thinking, generalized into a separate product, currently in beta."],
          ]}
          accentLastHeader
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-2)" }}>
          {[
            ["Surface", "Product microcopy, an enterprise identity-security platform"],
            ["Role", "UX and Product Content Lead"],
            ["Contributions", "Style guide · UX principles workshop · AI-assisted prototyping workflow · system design"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{k}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: 320 }}>{v}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Background ── */}
      <Section alt id="background">
        <SectionHeader eyebrow="Background" title="A distributed writing org with no shared standard" />
        <Body>
          I joined as the first UX writer inside a roughly 20-person technical-writing organization spread across four time zones, and I trained the group as I went. Before I built anything, product microcopy across the platform was inconsistent: the same action carried different verbs on different screens, and every design review re-litigated wording that a shared pattern could have settled once.
        </Body>
        <Body>
          I wrote end-to-end UX content for identity security product flows: access control, session management, and third-party vendor access. The pattern I kept running into lived one level above the sentence: writers needed a shared language before they needed better sentences.
        </Body>
      </Section>

      {/* ── The style guide (Verified) ── */}
      <Section id="style-guide">
        <SectionHeader eyebrow="The style guide · Verified" title="One formula for every microcopy decision" />
        <Body>
          I organized the V1 Microcopy and UX Writing Style Guide around a single principle: <em>Great text = (What + So What + What Next) ÷ User State of Mind</em>. The guide asked writers to internalize one formula. It defines a tone spectrum with Instructive as the default and Helpful or Reassuring for moments when a user is blocked or anxious, seven asset patterns as fill-in-the-blank templates with bracketed slots, and a terminology standard: &ldquo;Remove access&rdquo; and &ldquo;Remove account&rdquo; replaced the mix of &ldquo;Delete,&rdquo; &ldquo;Remove it,&rdquo; and informal variants already in use across teams.
        </Body>
        <Body>
          It shipped within my first three months, covering pages, dialogs, errors, empty states, and controls. Glossary and mobile-specific patterns were planned for V2.
        </Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>Six pages from the guide. Click to open one full size.</ExpandHint>
          <FlowCarousel items={STYLE_GUIDE_IMAGES} onOpen={(i) => open(STYLE_GUIDE_IMAGES.map((s) => s.src), i)} />
        </div>
      </Section>

      {/* ── The workshop (Verified) ── */}
      <Section alt id="workshop">
        <SectionHeader eyebrow="The workshop · Verified" title="Why the patterns exist, not only what they say" />
        <Body>
          A pattern only survives contact with a deadline if the team understands why it exists. So before the team could align on the style guide&apos;s patterns, I built and ran a ten-question workshop grounding every microcopy decision in how people actually see, read, remember, decide, and make mistakes, each question tied to a real product screen rather than an abstract principle.
        </Body>
        <Body>
          The workshop gave the team a shared vocabulary: cognitive load, recognition over recall, progressive disclosure. Reviewers could point at a specific mechanism instead of trading opinions about taste, and that vocabulary is the reason design-review cycles driven by personal preference dropped off.
        </Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>Two pages from the workshop deck.</ExpandHint>
          <FlowCarousel items={WORKSHOP_IMAGES} onOpen={(i) => open(WORKSHOP_IMAGES.map((s) => s.src), i)} cardWidth={380} />
        </div>
      </Section>

      {/* ── The workflow I built (Attested) ── */}
      <Section id="workflow">
        <SectionHeader eyebrow="The workflow I built · Attested" title="From a Jira ticket to reviewable, pre-governed UI" />
        <Body>
          Once the style guide and the workshop gave the team a shared standard, I integrated that standard into an AI-assisted prototyping workflow: a Jira ticket becomes design-system UI carrying pre-governed copy, ready for writer review, through a Figma Make and Claude workflow I put together. The style guide&apos;s rules apply at generation time instead of at review time, so a reviewer starts from something already close to right rather than a blank page that still needs every pattern re-checked by hand.
        </Body>
        <Body>
          Writer review stayed the gate. The workflow narrows what a reviewer has to catch; it never removes the reviewer.
        </Body>
      </Section>

      {/* ── Impact (Attested) ── */}
      <Section alt id="impact">
        <SectionHeader eyebrow="Impact · Attested" title="Faster reviews, fewer rounds, one shared voice" />
        <StatGrid stats={IMPACT_STATS} min={220} />
        <Body>
          By my own tracking and recollection, teams using this workflow got through the same review and alignment work in <strong style={{ color: ACCENT }}>roughly a third of the previous time</strong>. I measured this by combining several Jira turnaround signals, response, handoff, and revision time, with surveys and interviews run alongside the rollout. Fewer meetings and less back-and-forth over wording did most of that work: writers could prototype a solution directly instead of routing through rounds of clarification, and Product could hand UX a fuller picture of what they meant starting from the first ticket.
        </Body>
        <Body>
          The same governance behind the style guide carried into the generated output: shared syntax, cadence, framing, and terminology across every product area the workflow touched. Writers still made the final call on every string, but they started from an agreed system instead of renegotiating the same language decisions on every review.
        </Body>
        <Body>
          Adoption moved well past the writing team. At least twelve of the roughly twenty writers on my team used it on their own products, alongside dozens of Support staff building out ticket requests and mockups of their own, plus Product, UX, Design, and a handful of engineers reaching for something concrete to bring into a meeting.
        </Body>
        <Body>
          One flow stands out clearly. A complex, cross-product identity-security experience touched several areas, each governed by a different writer. Every one of them approved their section on the first pass, no second round of revisions, and some of the terminology clarifications that surfaced along the way later found their way back into those product areas on their own.
        </Body>
        <Body>
          My direct involvement ended around the start of 2026. When I checked back with former colleagues months later, the system had moved past where I left it: a working Jira entry point, a standalone workspace outside Jira, and enough real use behind it to confirm the impact held. A later organizational shift interrupted some of that continued rollout, so I&apos;m treating this as real signal from a real operating period, not an unbroken growth curve.
        </Body>
      </Section>

      {/* ── The system, reconstructed ── */}
      <Section id="system">
        <SectionHeader eyebrow="The system, reconstructed" title="What that workflow could look like end to end" />
        <Body>
          The attested workflow above was a working mechanism, real but without dedicated screens of its own. To show what a fuller version of that system could look like, end to end, I rebuilt it as an Experience Builder: brief, context review, generation, options, refinement against real checks, a working Figma handoff, and an approval-and-write-back record. Every image below is a reconstruction: built from that description and from concept mockups, standing in for screenshots that don&apos;t exist. Names, issue keys, and comments are fictional.
        </Body>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>The reconstructed golden path, eight screens.</ExpandHint>
          <FlowCarousel
            items={[
              { src: `${RECON_BASE}/p-01-experience-workspace-reconstructed.png`, title: "1 · Workspace", caption: "Reconstructed: every experience in one place, filterable by status and owner, before starting a new one." },
              { src: `${RECON_BASE}/p-03-jira-brief-reconstructed.png`, title: "2 · Jira brief", caption: "Reconstructed: the ticket, its context, and supporting materials, gathered before anything generates." },
              { src: `${RECON_BASE}/p-06-context-review-reconstructed.png`, title: "3 · Context review", caption: "Reconstructed: what the system understood, with open questions settled before generation starts." },
              { src: `${RECON_BASE}/p-07-generation-progress-reconstructed.png`, title: "4 · Generation", caption: "Reconstructed: the design system, style guide, and product knowledge in use, shown as they&apos;re applied." },
              { src: `${RECON_BASE}/p-08-experience-options-reconstructed.png`, title: "5 · Options", caption: "Reconstructed: three directions to choose between before refining any one of them." },
              { src: `${RECON_BASE}/p-09-experience-review-reconstructed.png`, title: "6 · Review", caption: "Reconstructed: screens and strings refined against real, failable checks." },
              { src: `${RECON_BASE}/p-10-figma-exploration-reconstructed.png`, title: "7 · Figma handoff", caption: "Reconstructed: an editable file, kept in sync with what&apos;s approved." },
              { src: `${RECON_BASE}/p-11-build-record-reconstructed.png`, title: "8 · Build record", caption: "Reconstructed: what informed the experience, traceable back to its sources." },
            ]}
            onOpen={(i) => open([], i)}
          />
        </div>
      </Section>

      {/* ── Guardrails ── */}
      <Section alt id="guardrails">
        <SectionHeader eyebrow="Guardrails · Reconstructed" title="Checks that can actually fail" />
        <Body>
          A generator is only as trustworthy as what happens when it&apos;s wrong. The design runs eight checks, and each one is built to block or warn, not to pass by default.
        </Body>
        <DataTable
          cols="1.1fr 2.3fr 1fr"
          headers={["Gate", "What it checks", "Behavior"]}
          rows={GATE_ROWS}
        />
      </Section>

      {/* ── Where it&apos;s going (Independent rebuild) ── */}
      <Section id="try-it">
        <SectionHeader eyebrow="Where it&apos;s going · Independent rebuild" title="KantorBot Experience Builder" />
        <Body>
          The thinking above continues in KantorBot, a separate product I am building to generalize it: two modes, Microcopy when the interface is fixed and only the content changes, and Full UI when the structure, the flow and the content move together. It is in beta.
        </Body>
        {/* COMPILE REPAIR (freeze): kit's Body takes no `style` prop. Reproduced inline
           with Body's own styles plus the intended weight, so the render is unchanged. */}
        <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620, fontWeight: 600 }}>
          If you want to give it a try, head over to {SUBDOMAIN_PLACEHOLDER}.
        </p>
      </Section>

      {/* ── Summary ── */}
      <Section alt id="summary">
        <SectionHeader eyebrow="Summary" title="A standard, a reason for it, and a way to run it at scale" />
        <Body>
          The style guide gave the team one formula instead of a list of rules. The workshop gave them the reasoning behind it. The workflow put that standard into the tool doing the drafting, with a human reviewer as the gate the whole way through. By my own account, that combination cut review time to roughly a third of what it took before and carried a shared voice across every area it reached. What&apos;s reconstructed here is my best-effort design for what that system becomes at full scale, and what continues in KantorBot, the generalized version I am building now.
        </Body>
        {/* RENDER REPAIR (freeze): kit's Section is a flex column with the default
           align-items: stretch, which stretches the inline-flex CTA to full width.
           Staging and Fax avoid this by hand-rolling their summary section with
           align-items: flex-start. A block wrapper restores the compact pill
           without touching the shared kit. */}
        <div>
          <BackToDashboardCta href={BACK_HREF} />
        </div>
      </Section>

      <TableOfContents items={TOC} />

      {/* COMPILE REPAIR (freeze): Lightbox takes `initialIndex` and holds its own
         index. The draft called a controlled API that does not exist. */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </CaseShell>
  );
}
