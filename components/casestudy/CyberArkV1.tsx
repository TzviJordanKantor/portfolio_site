"use client";

/* ── CyberArk Experience Builder case study. ───────────────────────
   Canonical at /work/cyberark. The frozen first draft is preserved at
   CyberArkOriginal.tsx and served at /work/cyberark/original.

   Editorial pass 2026-09-11, from the practitioner's marked-up draft:
   - Sections cut entirely: the product-development stream table, the
     three source-document cards, Guardrails, and the old "Where it led".
   - "Reconstructed" is banned as a visible word. The hero discloses once
     that the screens were rebuilt because the originals are under NDA,
     and no caption repeats it. The Figma frames were re-exported with
     their annotation strips and caption blocks rewritten so the word does
     not appear inside any image either.
   - Historical artifacts changed shape: the style guide is one cover that
     opens the real 12-page PDF in a new tab; the two decks are covers that
     open a full-slide carousel (20 and 10 slides, rendered from the PDFs).
   - The workflow is now a single 7-screen carousel of the real pipeline.

   Asset map:            docs/experience-builder/cyberark-v1-asset-map.md
   Jira/Forge grounding: docs/experience-builder/jira-forge-research.md

   Copy rules (voice-dna, same as FaxCaseStudy):
   - First person, ownership verbs. People are the subject, never the software.
   - No em-dashes. Colons introduce elaboration.
   - Present tense for what a system does, past tense for what I built. */

import { useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import {
  ACCENT,
  Eyebrow, TitleLine, SectionHeader, Body, Caption, ExpandHint, Section,
  FlowCarousel, StatGrid,
  TopBar, BackToDashboardCta, TableOfContents, CaseShell,
  type FlowItem, type TocItem, type Stat,
} from "@/components/casestudy/kit";

const SAMPLES = "/assets/work-samples/cyberark";
const DOCS = `${SAMPLES}/documents`;
const DECKS = `${SAMPLES}/decks`;
const V1 = "/assets/experience-builder/v1";
const BACK_HREF = "/?exp=cyberark";

const TOC: TocItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "background", label: "Background" },
  { id: "style-guide", label: "The style guide" },
  { id: "experience-builder", label: "Experience Builder" },
  { id: "workflow", label: "The workflow" },
  { id: "impact", label: "Impact" },
  { id: "kantorbot", label: "What I took with me" },
  { id: "summary", label: "Summary" },
];

const IMPACT_STATS: Stat[] = [
  { big: "Most", label: "Of the group it was offered to tried it at least once" },
  { big: "~40%", label: "Became regular users" },
  { big: "~33%", label: "Decrease in time to complete approval and handoff, in tracked work" },
  { big: "50+", label: "Small fixes implemented off the back of support-driven evidence within two quarters" },
];

/* The full decks, rendered page by page from the original PDFs. */
const deckSlides = (stem: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${DECKS}/${stem}-${String(i + 1).padStart(2, "0")}.png`);

const WHAT_PROBLEM = deckSlides("what-problem", 20);
const SCALABLE = deckSlides("scalable-ux-writing", 10);

/* The workflow, end to end. One carousel, seven screens. */
const WORKFLOW: FlowItem[] = [
  { src: `${V1}/wf-1-jira-entry.png`, title: "1 · The entry point", caption: "Before an experience exists: a panel in the issue itself, stating exactly what it will take with it." },
  { src: `${V1}/wf-2-brief.png`, title: "2 · The brief", caption: "The issue arrives as a brief, with its attachments, linked issues and supporting material intact." },
  { src: `${V1}/wf-3-context-review.png`, title: "3 · Context review", caption: "What the system understood, what it assumed, and the open questions it will not guess past." },
  { src: `${V1}/wf-4-generation.png`, title: "4 · Generation", caption: "The design system, the style guide and product knowledge, named as they are applied." },
  { src: `${V1}/wf-5-review.png`, title: "5 · Review", caption: "Screens and strings against checks that can fail. Every number on this screen is sample data." },
  { src: `${V1}/wf-6-figma-handoff.png`, title: "6 · Figma", caption: "An editable working file in the design system, not a flattened export." },
  { src: `${V1}/wf-7-jira-linked.png`, title: "7 · Back to the issue", caption: "The issue now carries the experience, its review state and the working design." },
];

/* ── Local components. The shared kit is untouched by this case study. ── */

function ActDivider({ part, title }: { part: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "var(--font-display)", color: ACCENT }}>
        {part}
      </span>
      <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", letterSpacing: "0.02em" }}>{title}</span>
    </div>
  );
}

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{ margin: 0, paddingLeft: "var(--space-5)", borderLeft: `3px solid ${ACCENT}`, maxWidth: 640 }}>
      <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.8, fontStyle: "italic", color: "var(--text-secondary)" }}>
        {children}
      </p>
    </blockquote>
  );
}

/** A card whose click leaves the page. Carries a new-tab icon, never the expand icon. */
function OpenDocCard({ src, alt, href, label, meta, width = 360 }: {
  src: string; alt: string; href: string; label: string; meta: string; width?: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", width, maxWidth: "100%", textDecoration: "none",
        border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden",
        background: "var(--card-bg)", boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
        transition: "box-shadow 0.18s",
      }}
    >
      <div style={{ position: "relative", borderBottom: "1px solid var(--border)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,22,0.62)", color: "white", opacity: hover ? 1 : 0.75, transition: "opacity 0.18s" }}>
          <ExternalLink size={14} />
        </span>
      </div>
      <span style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: hover ? "#3C9384" : ACCENT, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}>
          {label} <ExternalLink size={12} />
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{meta}</span>
      </span>
    </a>
  );
}

/** A deck cover that opens every slide of that deck in the lightbox. */
function DeckCard({ src, alt, title, meta, onOpen, width = 360 }: {
  src: string; alt: string; title: string; meta: string; onOpen: () => void; width?: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Open ${title}, all ${meta}`}
      style={{
        display: "flex", flexDirection: "column", width, maxWidth: "100%", padding: 0, textAlign: "left",
        border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden",
        background: "var(--card-bg)", cursor: "zoom-in",
        boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)", transition: "box-shadow 0.18s",
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      <div style={{ position: "relative", borderBottom: "1px solid var(--border)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,22,0.62)", color: "white", opacity: hover ? 1 : 0.75, transition: "opacity 0.18s" }}>
          <Maximize2 size={14} />
        </span>
      </div>
      <span style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{title}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{meta}</span>
      </span>
    </button>
  );
}

/** Hint line for something that leaves the page. Never the expand icon. */
function OpenHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
      <ExternalLink size={12} />
      {children}
    </span>
  );
}

function CardRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>{children}</div>;
}

/** Full-bleed figure with an expand affordance and a caption. */
function Figure({ src, alt, caption, onOpen, hint }: {
  src: string; alt: string; caption: React.ReactNode; onOpen: () => void; hint?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
      {hint && <ExpandHint>{hint}</ExpandHint>}
      <button
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={`Open ${alt} full size`}
        style={{
          position: "relative", padding: 0, border: "1px solid var(--border)", background: "var(--card-bg)",
          borderRadius: "var(--radius-md)", boxShadow: hover ? "var(--shadow-hover)" : "var(--shadow-card)",
          cursor: "zoom-in", overflow: "hidden", width: "100%", display: "block", transition: "box-shadow 0.18s",
        }}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,35,22,0.62)", color: "white", opacity: hover ? 1 : 0, transition: "opacity 0.18s", pointerEvents: "none" }}>
          <Maximize2 size={14} />
        </span>
      </button>
      <Caption>{caption}</Caption>
    </div>
  );
}

export default function CyberArkV1() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });
  const one = (src: string) => () => open([src], 0);

  return (
    <CaseShell>
      <TopBar backHref={BACK_HREF} />

      {/* ── Hero ── */}
      <header id="intro" style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)", scrollMarginTop: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Systems case study · CyberArk</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 820 }}>
            From content style guide to a governed product workflow
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            CyberArk, now part of Palo Alto Networks, secures identity touchpoints for large enterprises. Around twenty excellent technical writers owned the words inside that platform. However they were working without a product-content system: no shared standard for how product text should read, and no agreed workflow for producing, reviewing and handing it off to design and dev. This case study follows that arc: research the organization, write the governance, teach the people, make the governance executable, join it to the design system, and platformize an AI-powered UI and text generator.
          </p>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 660 }}>
            The documents from the time are here in full, and you can open them. The screens have been rebuilt because the originals are locked down under a strict NDA.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-2)" }}>
          {[
            ["Surface", "Identity security platform"],
            ["Role", "Principal Content Designer"],
            ["Contributions", "Stakeholder research · content style guide · writer enablement · content governance in a generation workflow · system and workflow design"],
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
        <SectionHeader eyebrow="Background" title="Twenty writers, one platform" />
        <Body>
          The writers at CyberArk were based primarily in documentation, where the craft is different: a doc explains a system at length, to someone who has chosen to sit down and read it. Product text works inside the system, in a handful of words, for someone who is mid-task and probably anxious. Each writer solved that on their own, so the same action carried different verbs on different screens, and design reviews kept relitigating terminology that one shared pattern could have settled once.
        </Body>
        <Body>
          Before writing anything, I met the leaders across product, UX, the design system, dev, content, and support to understand how the company actually built software and where content entered it.
        </Body>
      </Section>

      {/* ── Part I ── */}
      <Section id="style-guide">
        <ActDivider part="Part I" title="Defining a standard" />
        <SectionHeader eyebrow="The style guide" title="Start with the secret sauce" />
        <Pullquote>
          I wrote the V1 Microcopy and UX Writing Style Guide around a single spine: <strong style={{ fontStyle: "normal", color: ACCENT }}>Great text = (What + So What + What Next) ÷ User state of mind</strong>. The &ldquo;What&rdquo; is the factual layer, the page title, or the first line of an error. The &ldquo;So What&rdquo; is the consequence, the reason this matters right now. The &ldquo;What Next&rdquo; is the action, a verb and an object, scannable out of context. A writer who has those three and knows who is reading has already made most of the decisions.
        </Pullquote>
        <Body>
          User state of mind is the divisor because it tweaks the tone of everything above it. The guide defines it as intent + emotion + environment, and asks the writer to note all three before drafting: What is this person trying to do? How are they likely to feel? Where are they doing it?
        </Body>
        <Body>
          To align with user state of mind, the direct, clear, transparent, simple voice can be varied through the lens of five tones. The tone moves with the situation, with &ldquo;Instructive&rdquo; as the default and &ldquo;Helpful&rdquo; or &ldquo;Reassuring&rdquo; when a person is blocked or anxious.
        </Body>
        <Body>
          The guide includes seven major asset patterns, written as fill-in-the-blank templates: pages, dialogs, empty and zero states, availability states, errors and toasts, controls, onboarding. The grammar of those templates is deliberately physical.
        </Body>
        <Body>
          Terminology got the same treatment. One term per concept, defined once, used everywhere: &ldquo;Remove access&rdquo; and &ldquo;Remove account&rdquo; replaced the mix of &ldquo;Delete,&rdquo; &ldquo;Remove it&rdquo; and informal variants that different teams had each settled on separately. The guide also carried process rules: real strings at the wireframe stage rather than lorem ipsum, before-and-after capture for traceability, and a status chain from &ldquo;In progress&rdquo; through &ldquo;Reviewed&rdquo; to &ldquo;Done&rdquo;.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <OpenHint>Open the full guide in a new tab.</OpenHint>
          <OpenDocCard
            src={`${SAMPLES}/cyberark-style-guide-p1.png`}
            alt="Cover of the CyberArk Microcopy and UX Writing Style Guide, V1"
            href={`${DOCS}/cyberark-microcopy-ux-writing-style-guide-v1.pdf`}
            label="Read the full guide"
            meta="12 pages · PDF"
            width={420}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-3)" }}>
          <TitleLine>Onboarding the team</TitleLine>
          <Body>
            To help the team adopt the process, I built and ran a workshop series for writers that grounded every UX writing decision in the cognitive science of how people see, read, remember, decide, make mistakes, and recover. We asked all the questions a designer actually asks mid-task, then offered the mechanism to answer them.
          </Body>
          <Body>
            This process gave a shared language for reviews and editing: Cognitive load, recognition over recall, slips versus mistakes, progressive disclosure. A reviewer could point at a mechanism instead of trading opinions about taste, and a writer could defend a decision with a reason rather than a preference.
          </Body>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <ExpandHint>Click to see either presentation in full.</ExpandHint>
            <CardRow>
              <DeckCard
                src={WHAT_PROBLEM[0]}
                alt="Cover slide: What problem are we solving, for whom, and at what moment?"
                title="What problem are we solving, for whom, and at what moment?"
                meta="20 slides"
                onOpen={() => open(WHAT_PROBLEM, 0)}
              />
              <DeckCard
                src={SCALABLE[0]}
                alt="Cover slide: Scalable UX writing, from intuition to systems"
                title="Scalable UX writing: from intuition to systems"
                meta="10 slides"
                onOpen={() => open(SCALABLE, 0)}
              />
            </CardRow>
          </div>
          <Body>
            The next step was to make the rules machine-readable. I rewrote the guide as structured Markdown and instructions, and integrated those rules into the writing team&apos;s existing DocuBot, which until then had mostly served documentation work. A writer could now ask for a draft of microcopy as well and get one that already knew the approved pattern and terminology.
          </Body>
        </div>
      </Section>

      {/* ── Part II ── */}
      <Section alt id="experience-builder">
        <ActDivider part="Part II" title="Building the system" />
        <SectionHeader eyebrow="Experience Builder" title="Dovetailing content and design" />
        <Body>
          In parallel to my style guide work, my colleague leading the Design System was building a way to produce UI that came out already made of approved Design System components, scaffolded in Figma Make. However, it only solved half of the problem: generated UI that is structurally correct but still arrives full of placeholder language.
        </Body>
        <Body>
          Enter the Content Style Guide. Now transformed into Markdown, we collaborated on the architecture of embedding content governance inside the UI generation workflow. We landed on a repository-backed project that held Design System context, the content rules, and the generation scaffolding, all usable from Figma Make.
        </Body>
        <Body>
          What that combination produced was UI carrying both kinds of governance at once: components and tokens the Design System had already approved, and product language that already followed the patterns, the tone, and the terminology. A reviewer opened something nearly fully baked, instead of a page of slop with many decisions still left to make.
        </Body>
        <Body>
          We tested it informally with people across Product, UX, the Design System, development, Content, and Support. We built a richer intake, so a request could arrive with a description of the problem, screenshots of the screen as it stands today, and supporting files. We evolved the orchestration layer, with Claude connecting that task-specific evidence to CyberArk product knowledge, the Design System context and the content rules.
        </Body>
      </Section>

      {/* ── The workflow ── */}
      <Section id="workflow">
        <SectionHeader eyebrow="The workflow" title="Putting it where the work already lives" />
        <Body>
          As we moved beyond that first cohort of early adopters, we brought a developer onto the project to create the architecture connecting the workflow into Jira.
        </Body>
        <Body>
          The entry point appears on relevant issues and tasks, filtered by epic, project, type, component, and permissions.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandHint>The pipeline, end to end. Click any screen to open it full size.</ExpandHint>
          <FlowCarousel
            items={WORKFLOW}
            onOpen={(i) => open(WORKFLOW.map((s) => s.src), i)}
            cardWidth={360}
            imageHeight={230}
          />
        </div>

        <Body>
          The panel states exactly what leaves the issue, because a person is more willing to use a tool that tells them what it is taking.
        </Body>
        <Body>
          What arrives on the other side is the issue as a brief, with its own supporting material attached. Then, before anything generates, the system says what it understood and what it is still unsure about. Open questions get answered or explicitly waived.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-3)" }}>
          <TitleLine>From the bottom up</TitleLine>
          <Body>
            Often, support sees the same problem countless times before product ever hears about it. The second entry point in Jira offers a way for stakeholders to create a new task with a product optimization suggestion, already bundled with a system-approved mockup to hand off through the chain. The output is a working Figma file rather than a picture of one. It is editable, made of Design System components, and it is where the team keeps working: the proposal is the start of the conversation, not the end of it. The proposal enters the ordinary product queue where Product, UX, the Design System and Content triage it like anything else.
          </Body>
          <Figure
            src={`${V1}/support-propose-improvement.png`}
            alt="A support request with a Propose product improvement dialog open, showing a prefilled summary and the evidence carried across from three related requests."
            onOpen={one(`${V1}/support-propose-improvement.png`)}
            caption="The support request stays open, and stays the evidence. Support raises the proposal; it does not approve it."
          />
          <Figure
            src={`${V1}/flow-diagram.png`}
            alt="Flow diagram: planned product work and support evidence both feed a Jira issue, which enters Experience Builder, which draws on task evidence and standing governance, produces an experience proposal, a working Figma file, human review, and writes back to the issue."
            onOpen={one(`${V1}/flow-diagram.png`)}
            hint="The whole system in one image. Click to open it full size."
            caption="Two entry routes, one pipeline, one gate. Jira manages and records the work, Experience Builder solves the problem by the rulebook, Figma is where the result is worked on together, and a person decides whether it is accepted."
          />
        </div>
      </Section>

      {/* ── Part III ── */}
      <Section alt id="impact">
        <ActDivider part="Part III" title="Proving it" />
        <SectionHeader eyebrow="Impact" title="Streamlining the back-and-forth" />
        <StatGrid stats={IMPACT_STATS} min={210} />
        <Body>
          Usage and reactions were self-reported, through feedback and conversations during rollout. Timing came from task-manager signals, comparing work that went through Experience Builder against comparable work that did not. The later operational figures, including the adoption share, were reported to me by the original Design System manager after I had left.
        </Body>
        <Body>
          The mechanism successfully reduced meetings and rounds of clarification. A writer could now take a problem and produce something concrete to react to, which changes the shape of a review. Product could hand UX a fuller picture from the first ticket. The governance that used to be enforced by whoever was most senior in the review was now applied before the review started.
        </Body>
        <Body>
          As a writer at heart, I was most proud of the soft impact of consistency: syntax, cadence, framing and terminology started matching across product areas that had never coordinated. Writers still made the final call on every string, but they could make it starting from an agreed system rather than renegotiating the same language decisions on every screen.
        </Body>
        <Body>
          Support&apos;s evidence turned into dozens of small fixes: the kind of accumulated, unglamorous correction that never gets a launch announcement and is most of what makes a product feel considered.
        </Body>
      </Section>

      {/* ── What I took with me ── */}
      <Section id="kantorbot">
        <SectionHeader eyebrow="What I took with me" title="Behold the KantorBot, coming soon" />
        <Body>
          I am building a generalized version of this thinking now, as a separate product called KantorBot. The webapp will be baked into my portfolio, allowing you to use the best UX brains and content guidelines to get microcopy solutions for any situation, and even full UI wireframes when the case requires it. Watch this space.
        </Body>
      </Section>

      {/* ── Summary ── */}
      <Section alt id="summary">
        <SectionHeader eyebrow="Summary" title="Governance, enablement, execution, workflow" />
        <Body>
          Twenty writers were producing product language without a shared system. I researched the organization, wrote the standard, and taught the reasoning behind it before automating any of it. Then I made the standard executable, joined it to the Design System so generated UI carried both kinds of governance at once, and helped design the workflow that put it inside Jira, where the work already lived, making sharing and collaborating on solutions easier for everyone.
        </Body>
        <div>
          <BackToDashboardCta href={BACK_HREF} />
        </div>
      </Section>

      <TableOfContents items={TOC} />

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
