"use client";

/* ── V1. FROZEN 2026-09-02. Do not edit. ──────────────────────────
   Kept only so /work/fax/v1 can render it beside the current build for
   comparison. All revisions land in FaxCaseStudy.tsx (v2). */

/* East End Neuropsych provider fax campaign.
   Built on the shared kit so this page and /work/staging read as one system.

   Copy rules (voice-dna, enterprise-instructive lean):
   first person and ownership verbs; people are the subject, never the software;
   no em-dashes; no "just / simply / easy"; colons introduce elaboration.

   Every number on this page traces to docs/east-end/metrics.md section A, B or C.
   Nothing from section D (unverifiable) or E (reported, unconfirmed) appears here. */

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "@/components/Lightbox";
import {
  PAGE_BG, ACCENT,
  Eyebrow, TitleLine, SectionHeader, Body, Caption, ExpandHint, Section,
  DataTable, ExpandableImage, FlowCarousel, StateCard, StatGrid,
  TopBar, BackToDashboardCta, TableOfContents, CaseShell,
  type FlowItem, type TocItem, type Stat,
} from "@/components/casestudy/kit";

const BASE = "/case-studies/fax";
const BACK_HREF = "/?exp=eastend";

const TOC: TocItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "background", label: "Background" },
  { id: "list", label: "The list" },
  { id: "asset", label: "The asset" },
  { id: "personalization", label: "Personalization" },
  { id: "system", label: "The system" },
  { id: "guardrails", label: "Guardrails" },
  { id: "verification", label: "Verification" },
  { id: "results", label: "Results" },
  { id: "summary", label: "Summary" },
];

/* ── The three shipped newsletter variants ───────────────────── */
const VARIANTS: FlowItem[] = [
  {
    src: `${BASE}/newsletter-a-grayscale.png`,
    title: "A · grayscale photos",
    caption: "The baseline. Pure black on white, boxed sections, heavy rules. The director's portrait is still a photograph, and its mid-tones are already crushing toward black.",
    pos: "top",
  },
  {
    src: `${BASE}/newsletter-a2-brightened.png`,
    title: "A2 · brightened portrait",
    caption: "Same layout, portrait lifted so the mid-tones survive the transmission. The page is also tightened so nothing important sits where the fax header prints.",
    pos: "top",
  },
  {
    src: `${BASE}/newsletter-b-image-free.png`,
    title: "B · image-free",
    caption: "The portrait becomes an ES / MEDICAL DIRECTOR monogram block. This is the variant that lets a rendering fault be a pause rather than a shutdown.",
    pos: "top",
  },
];

/* ── What a fax does to a design ─────────────────────────────── */
const RENDER_RULES: [string, string, string][] = [
  ["Color", "Flattened to grayscale, often to one bit", "Pure black on white. No color carries meaning."],
  ["Photography", "Mid-tones crush to black", "High-contrast portrait, brightened. Image-free variant held in reserve."],
  ["Hairline rules", "Drop out entirely", "Heavy borders and boxed sections."],
  ["Small type", "Fills in and blurs", "Minimum body size raised. Hierarchy carried by weight, not size."],
  ["Page top", "Overwritten by the fax header", "Top margin cleared. Nothing critical in the first strip."],
  ["Subject line", "Truncated inside the header", "Fixed pattern, under 60 characters."],
  ["QR code", "Fails below a module threshold", "Oversized, with a generous quiet zone."],
];

const COVERSHEETS: [string, string, string][] = [
  ["A", "Neurologists", "Parkinson's, dementia, caregiver support, neuropsychiatry"],
  ["B", "Geriatric primary care", "Cognitive decline, elderly depression, difficult psychiatric cases"],
  ["C", "Family and internal medicine", "Broad referral support, and when to refer to geriatric psychiatry"],
  ["D", "Psychologists", "Medication-management partnership"],
  ["E", "Hand-picked referrers", "Named introduction and a visit offer. Flagged by hand, never auto-assigned."],
];

const WORKBOOK: [string, string, string][] = [
  ["Sheet1", "Raw provider data", "Never overwritten. The source of truth for facts."],
  ["Campaign Segmentation Tracker", "Live campaign state", "30 columns. Tier, priority and coversheet fill in by formula. Batch, send and status columns are written during operations."],
  ["Updox Contacts Import", "Delivery mapping", "Providers mapped into the send tool's patient schema, because that is the only contact object it has."],
  ["Rollout Playbook", "The operating manual", "Eight sections: segmentation, tiering, coversheets, batching, stop logic, first-rollout spec, field legend, cleanup protocol."],
];

const RAMP: [string, string, string][] = [
  ["Days 1 to 3", "25 a day", "90% delivered, no retry storms, no complaints"],
  ["Days 4 to 7", "50 a day", "90% delivered on two consecutive days"],
  ["Week 2", "100 a day", "Delivery stable, dashboard clean"],
  ["Week 3 on", "150 to 200 a day", "Continuous monitoring. Pause on any breach."],
];

const STOP_RULES: { trigger: string; threshold: string; action: string }[] = [
  { trigger: "Delivery failure spike", threshold: "More than 15% of a batch failed", action: "Pause. Investigate the numbers and the line before the next batch." },
  { trigger: "Retry storm", threshold: "More than 25% of a batch in repeated retry", action: "Pause. Check the carrier and the queue. Start no new batch." },
  { trigger: "Queue backlog", threshold: "Pending not clearing inside 30 minutes", action: "Hold new sends until the queue drains." },
  { trigger: "Office complaints", threshold: "Two or more requests to stop faxing", action: "Pause that specialty group and flag do-not-contact." },
  { trigger: "Attachment corruption", threshold: "Any garbled or blank fax reported", action: "Full stop. Re-run rendering QA before resuming." },
];

/* ── Failure taxonomy. Each card opens that record. ──────────── */
const FAILURES: { when: string; what: string }[] = [
  { when: "Busy signal detected", what: "The line exists and it answered. It was carrying someone else's transmission at the time." },
  { when: "Does not answer (code 42)", what: "It rings, and nothing picks up the fax handshake." },
  { when: "No carrier detected", what: "No fax tone on the line at all. Often a voice number sitting in a fax column." },
  { when: "Line disconnected", what: "The carrier reports the number as dead. This one is a list problem." },
  { when: "No receiver protocol", what: "Something answered and never negotiated. A broken machine, or the wrong number entirely." },
];
const FAILURE_IMAGES = [
  `${BASE}/fail-1-busy.png`,
  `${BASE}/fail-2-noanswer.png`,
  `${BASE}/fail-3-nocarrier.png`,
  `${BASE}/fail-4-disconnected.png`,
  `${BASE}/fail-5-t30.png`,
];

/* Results. Only verified figures. See metrics.md sections A and B. */
const STATS: Stat[] = [
  { big: "32,053", label: "Provider records pulled from the public NPI registry across 239 Long Island ZIP codes" },
  { big: "2,521", label: "Providers on the built list, every one of them with a fax number" },
  { big: "1,901", label: "Unique fax destinations behind those providers, which is what the batching actually had to respect" },
  { big: "35", label: "Batches sent, from a pilot of two through to batches of fifty" },
];

export default function FaxV1() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <CaseShell>
      <TopBar backHref={BACK_HREF} />

      {/* ── Hero ── */}
      <header id="intro" style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)", scrollMarginTop: 64 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Case study · East End Neuropsych</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 780 }}>
            Making fax behave like a marketing channel
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            The clinicians at East End Neuropsych treat older adults whose cognition, mood and neurological health overlap: the cases that do not sit inside one specialty. Their patients arrive by referral, and referrals arrive by fax, because a fax machine is what a physician&apos;s front desk still watches. The practice had never used the channel in the other direction, so I built the outbound side of it. That meant a 2,521-provider list assembled from the public NPI registry, a one-page newsletter designed to survive a grayscale fax machine, coversheets carrying the personalization so the attachment could stay fixed, and one spreadsheet doing the work of a CRM. It also meant deciding what a software agent was allowed to do on its own, and what it had to stop and ask me for.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", paddingTop: "var(--space-2)" }}>
          {[
            ["Surface", "Provider referral outreach"],
            ["Role", "Digital product and content systems consultant"],
            ["Contributions", "Data pipeline · content design · asset design · agent workflow · measurement"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{k}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: 320 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* First image: the thing that had to survive the wire. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
          <ExpandHint>The page that had to survive the wire. Click to open it full size.</ExpandHint>
          <div style={{ maxWidth: 560 }}>
            <ExpandableImage
              src={`${BASE}/newsletter-a-grayscale.png`}
              alt="The East End Neuropsych referral newsletter, fax-safe grayscale version"
              onOpen={() => open([`${BASE}/newsletter-a-grayscale.png`], 0)}
              contain
            />
          </div>
          <Caption>
            One page, pure black on white, every rule heavy enough to survive a 1980s telephony protocol. It has two jobs: introduce the practice as a referral partner, and fill a new Parkinson&apos;s wellness group. Everything on it is sized for a machine that throws detail away.
          </Caption>
        </div>
      </header>

      {/* ── Background ── */}
      <Section alt id="background">
        <SectionHeader eyebrow="Background" title="A channel nobody markets on" />
        <Body>
          Fax is the obvious channel for reaching physicians, and nobody treats it as a channel. There is no Mailchimp for fax. No list rental, no open rates, no unsubscribe link, no A/B test, no deliverability dashboard worth the name. What exists is a telephony protocol older than the web, a tool called Updox that sits next to the practice&apos;s records system, and a receiving office that will read a page if it looks like it came from a colleague.
        </Body>
        <Body>
          One detail set the tone for every rule that followed. The campaign went out on the practice&apos;s clinical fax line, the same number real patient faxes moved across on the same days: referral documents, records requests, assisted-living paperwork. Marketing volume was sharing a line that patient care depends on. That is why the pause rules further down are written in the language of an operations runbook rather than a campaign plan.
        </Body>
      </Section>

      {/* ── The list ── */}
      <Section id="list">
        <SectionHeader eyebrow="The list" title="2,521 providers, built not bought" />
        <Body>
          Referral lists are for sale. Bought lists are stale, over-faxed and full of numbers that stopped answering years ago, which in a channel with no unsubscribe means irritating exactly the people you want referring to you. So I built the list from NPPES, the public NPI registry that CMS maintains.
        </Body>
        <Body>
          The registry&apos;s API caps any single query at 1,200 results, so it cannot be asked the question I actually had, which was &quot;every neurologist and geriatrician within driving distance of Centereach.&quot; I inverted it. The extraction walks 239 Nassau and Suffolk ZIP codes one at a time, pulls every individual provider in each, and applies the specialty filter afterwards, locally, against 69 taxonomy codes carrying a referral-priority band each. Distance came from a haversine calculation against a built-in table of ZIP centroids, which kept the whole pipeline free of a geocoding dependency.
        </Body>
        <DataTable
          cols="1.6fr 0.7fr 1.5fr"
          headers={["Stage", "Rows", "What happened"]}
          rows={[
            ["Registry pull, 239 ZIPs", "32,053", "Individual providers only, across 66 specialties"],
            ["Carrying a fax number", "12,559", "39% of the pull. The rest cannot be reached on this channel."],
            ["Twelve referral-relevant specialties", "2,577", "Neurology, geriatrics, primary care, psychology, pain, neurosurgery"],
            [<span key="f">Shipped list</span>, <strong key="n" style={{ color: ACCENT }}>2,521</strong>, "56 rows removed by hand, 53 of them General Practice"],
          ]}
          accentLastHeader
        />
        <Caption>
          That last line is honest rather than tidy. The specialty filter yields 2,577 and the campaign ran on 2,521. I can still see exactly what went: 53 of the 54 General Practice rows, and three Internal Medicine ones. What did not survive is the reasoning, so it is named here instead of smoothed over.
        </Caption>
        <Body>
          Then I tiered them, because 2,521 contacts arriving at once is not a campaign, it is a complaint generator. Tiering runs on clinical affinity, and priority is inherited from the registry record.
        </Body>
        <DataTable
          cols="0.4fr 2fr 0.6fr"
          headers={["Tier", "What it means", "Providers"]}
          rows={[
            ["A", "Highest strategic value: Parkinson's and dementia overlapping with geriatrics", "261"],
            ["B", "Strong referral potential: primary care, family and internal medicine", "1,926"],
            ["C", "Relationship adjacency: psychologists and pain management", "290"],
            ["D", "Peripheral: neurological surgery", "44"],
          ]}
        />
        <Body>
          Rollout followed value rather than volume: neurology first, then neuromuscular, geriatrics, psychology, and only then Tier B in chunks. Tier A converts best, it is small enough to manage as relationships rather than as sends, and it is the lowest-risk cohort to prove the pacing on.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <TitleLine>A list of providers is not a list of destinations</TitleLine>
          <Body>
            The finding that changed the batching logic came out of the data itself. Those 2,521 providers sit behind only <strong style={{ color: ACCENT }}>1,901 unique fax numbers</strong>. 319 numbers are shared by two or more providers, 939 people on the list sit behind a shared line, and the busiest single fax machine serves fourteen of them.
          </Body>
          <Body>
            Faxing a list by provider would therefore have dialed some offices fourteen times for one campaign. The tracker enforces one destination per batch instead, and rows whose number was already reached carry their own status: covered by a shared fax, delivered, deliberately not resent. Providers whose shared line failed get flagged for an individual send later. Fifty-seven providers were reached that way, and in the send records every batch that went out shows one hundred percent unique destinations: no office was ever dialed twice in the same send.
          </Body>
        </div>
      </Section>

      {/* ── The asset ── */}
      <Section alt id="asset">
        <SectionHeader eyebrow="The asset" title="Designing for a machine that throws away detail" />
        <Body>
          A fax is a low-resolution grayscale scan sent down a phone line. Everything a normal brand asset leans on degrades or disappears, and the failure is invisible from the sending end: the transmission reports success while a black rectangle arrives at the other office.
        </Body>
        <DataTable
          cols="0.8fr 1.2fr 1.6fr"
          headers={["Element", "What a fax does to it", "What shipped"]}
          rows={RENDER_RULES.map((r) => [r[0], r[1], r[2]])}
          accentLastHeader
        />
        <Body>
          Three variants shipped, and keeping all three is the point. The hardest rule in the playbook is the one about attachment corruption: a single garbled page halts the campaign until rendering QA re-runs. Having a known-good image-free variant already built is what makes that a pause instead of a shutdown.
        </Body>
        <ExpandHint>Scroll through the iteration, or click any variant for full size.</ExpandHint>
        <FlowCarousel items={VARIANTS} onOpen={(i) => open(VARIANTS.map((v) => v.src), i)} cardWidth={300} imageHeight={380} />
      </Section>

      {/* ── Personalization ── */}
      <Section id="personalization">
        <SectionHeader eyebrow="Personalization" title="Five coversheets, not 2,521 PDFs" />
        <Body>
          The obvious move is to personalize the newsletter for each recipient. It is also the wrong one. 2,521 rendered PDFs is 2,521 chances at a rendering fault you cannot see, on a channel where you find out days later, if at all. So the newsletter stays fixed and universal, and all the personalization lives in the coversheet, the subject line, and how the send group is framed.
        </Body>
        <DataTable
          cols="0.4fr 1.2fr 2fr"
          headers={["Cover", "Audience", "Framing"]}
          rows={COVERSHEETS.map((c) => [c[0], c[1], c[2]])}
        />
        <Caption>
          Subject lines follow one pattern, held under 60 characters so they survive the fax header: East End Neuropsych, then the specialty framing, then the season.
        </Caption>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <TitleLine>What the compose window shows is not evidence</TitleLine>
          <Body>
            Updox has no per-recipient coversheet picker at batch scale. The coversheet is set once as the sending account&apos;s default and every recipient card in the compose window inherits it, which is efficient and completely opaque: the screen looks identical whether the inheritance worked or not.
          </Body>
          <Body>
            So I stopped reading the screen. Verifying a prepared batch meant querying the application&apos;s own in-page data for the list of addressees and checking, per recipient, the coversheet ID and the addressing mode actually attached to each one. The note I left myself in the pre-send checkpoint was blunt about it: treat the open compose window as a convenience, never as truth. That instinct, checking the underlying state rather than the rendered one, turned out to be the whole discipline this campaign ran on.
          </Body>
        </div>
      </Section>

      {/* ── The system ── */}
      <Section alt id="system">
        <SectionHeader eyebrow="The system" title="One workbook, four jobs" />
        <Body>
          There is no CRM for this. Updox sends faxes and stores records, and it has no concept of a marketing list, a campaign or a batch. So the system of record is a single spreadsheet doing four separate jobs, with a strict rule about which layer may be written to.
        </Body>
        <DataTable
          cols="1.1fr 0.9fr 2fr"
          headers={["Tab", "Job", "Rule"]}
          rows={WORKBOOK.map((w) => [w[0], w[1], w[2]])}
        />
        <ExpandHint>Click either sheet for full size.</ExpandHint>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandableImage
            src={`${BASE}/sheet-tracker.png`}
            alt="The campaign segmentation tracker, showing tier, priority, coversheet, batch and delivery columns"
            onOpen={() => open([`${BASE}/sheet-tracker.png`, `${BASE}/sheet-import.png`], 0)}
            contain
          />
          <Caption>
            The tracker. The lilac columns fill in by formula from specialty and priority. Everything from Batch ID rightward is written during operations, one batch at a time. Row 6 shows the shared-line rule doing its job: a provider covered by the fax that already went to row 5, deliberately not resent. The rows on this screenshot are invented; the structure is the live one.
          </Caption>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <ExpandableImage
            src={`${BASE}/sheet-import.png`}
            alt="The Updox contacts import tab, mapping providers into a patient schema"
            onOpen={() => open([`${BASE}/sheet-tracker.png`, `${BASE}/sheet-import.png`], 1)}
            contain
          />
          <Caption>
            The import mapping, and my favorite piece of evidence that this channel has no marketing infrastructure. Every referring physician has to enter the send tool as a patient record, because the patient object is the only contact object the tool has. The operational group rides in the EHR account field, which is the only column that survives the import and can still be filtered at send time.
          </Caption>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <TitleLine>The whole pipeline</TitleLine>
          <Body>
            The build runs once. The operating loop runs once per batch, and it is deliberately interrupted in the middle.
          </Body>
          <ExpandHint>Click the diagram for full size.</ExpandHint>
          <ExpandableImage
            src={`${BASE}/pipeline.svg`}
            alt="Pipeline diagram: registry pull, filter, tier, tracker; then reserve, agent prepares, human approval, send, verify and write back"
            onOpen={() => open([`${BASE}/pipeline.svg`], 0)}
            contain
          />
        </div>
      </Section>

      {/* ── Guardrails ── */}
      <Section id="guardrails">
        <SectionHeader eyebrow="Guardrails" title="Rules for a channel that can burn a referrer" />
        <Body>
          Fax has no unsubscribe. A campaign that irritates a referring office does not lose a subscriber, it loses a referral source, permanently. Two things follow from that: a human authorizes every transmission, and volume advances only when the previous stage has earned it.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <TitleLine>The send gate</TitleLine>
          <Body>
            A scheduled agent ran on weekday mornings. It reconciled the previous batch, read the delivery record, worked out who was eligible next, enforced one fax destination per batch, assembled the recipients, and checked the attachment against a stored hash so an older newsletter could never go out by mistake. Then it stopped and reported. It could not transmit. Sending required me to reply with a specific sentence naming the specific batch, which is a typed authorization rather than a click on something that could be clicked by accident.
          </Body>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`, borderRadius: "var(--radius-md)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)", boxShadow: "var(--shadow-card)", maxWidth: 620 }}>
            <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>The authorization</span>
            <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.9375rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
              Approved. Send EEN-NEURO-001.
            </code>
            <span style={{ fontSize: "0.8125rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              On the first live batch the agent reported at 9:07 in the morning and the faxes left at 9:29. Twenty-two minutes, with a human decision in the middle of them.
            </span>
          </div>
          <Body>
            The reservation is visible in the spreadsheet too. A prepared batch writes a batch ID onto its rows and marks them reserved, leaving send date and delivery status empty. Preparation is therefore a state the system of record can show, without any of it counting as a send. The checkpoint I wrote the night before the first batch ends with a line I still like: nothing has been transmitted, send has not been clicked.
          </Body>
          <Body>
            The agent also had a vocabulary for the things it could not do. Three escalation headers covered a login it could not perform, an attachment it could not place, and a desktop action it needed hands for. Each came with one sentence describing what was on screen, so I could act on it from a phone and reply that it could continue. State survived the interruption, and the campaign never had to be rebuilt.
          </Body>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
          <TitleLine>Gates, not targets</TitleLine>
          <Body>
            Volume never advanced because a day had passed. Each stage had a condition to clear first, and batches stayed homogeneous by specialty so that a failure spike could be attributed to a carrier, a list segment or a coversheet, because only one thing varied at a time.
          </Body>
          <DataTable
            cols="0.8fr 0.8fr 1.8fr"
            headers={["Stage", "Daily volume", "Gate to advance"]}
            rows={RAMP.map((r) => [r[0], r[1], r[2]])}
          />
          <Body>
            And five conditions stopped it. One trigger meant pause and notify. Two in the same day meant rolling back to the last known-good batch state.
          </Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "var(--space-3)" }}>
            {STOP_RULES.map((r) => (
              <div key={r.trigger} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`, borderRadius: "var(--radius-md)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)", boxShadow: "var(--shadow-card)" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{r.trigger}</span>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.02em" }}>{r.threshold}</span>
                <span style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{r.action}</span>
              </div>
            ))}
          </div>
          <Caption>
            None of the five ever fired. Across the whole campaign the office received zero requests to stop faxing, and the do-not-contact column stayed empty.
          </Caption>
        </div>
      </Section>

      {/* ── Verification ── */}
      <Section alt id="verification">
        <SectionHeader eyebrow="Verification" title="Delivered is not a fact until you check" />
        <Body>
          This is the part I did not plan for, and the part I would carry into any other channel.
        </Body>
        <Body>
          Fax delivery is asynchronous, and it is forgiving in a way that quietly corrupts your data. A number that is busy or unanswered gets retried automatically, sometimes an hour or two later. A status snapshot taken at the end of a send is therefore a snapshot of an unfinished process, and any row sitting there marked failed may have gone on to deliver after you looked away.
        </Body>
        <Body>
          On one send day, verifying records one at a time before archiving them caught five rows out of twenty-one that were marked failed and had actually delivered, retried a minute or two after the snapshot was taken. Archiving on the spreadsheet&apos;s word would have buried five real deliveries. That became a written step in the protocol: before acting on any status, re-open the record and read its own account of what happened.
        </Body>
        <Body>
          A second problem was subtler. The send tool&apos;s clock runs seven hours ahead of local time, so reconciling a day&apos;s sends against a one-day window silently loses records. The protocol now queries two days for every reconciliation. Neither of these is a bug in the tool exactly. Both are the kind of thing you only find by checking the machine&apos;s own words against your own records, on purpose, more than once.
        </Body>
        <Body>
          Failures also needed sorting rather than counting. Retrying everything that bounced is how you burn the numbers that are still good, so each failure code carries its own verdict.
        </Body>
        <ExpandHint>Click a failure type to open that record.</ExpandHint>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "var(--space-3)" }}>
          {FAILURES.map((f, i) => (
            <StateCard key={f.when} when={f.when} what={f.what} onClick={() => open(FAILURE_IMAGES, i)} />
          ))}
        </div>
        <Caption>
          Three of the five are worth retrying. Two are the list telling you something, and the correct response to those is to fix the row rather than dial it again.
        </Caption>
      </Section>

      {/* ── Results ── */}
      <Section id="results">
        <SectionHeader eyebrow="Results" title="What the channel did, and what is still open" />
        <StatGrid stats={STATS} />
        <Body>
          Operationally the channel worked. Batches assembled and went out, statuses resolved, failures sorted by cause, the shared-line rule prevented every duplicate transmission it was built to prevent, and no office ever asked to be taken off the list.
        </Body>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`, borderRadius: "var(--radius-md)", padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)", boxShadow: "var(--shadow-card)", maxWidth: 660 }}>
          <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>The open item</span>
          <span style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
            The business outcome is not in yet. The tracker has columns built for exactly this, callbacks, visit requests and referrals received, and as of this writing they are empty. A referral relationship between two medical practices takes months to show up, not the weeks this campaign has run. The one inbound fax that looked like a response turned out to be a records request the practice had made itself the day before, and I logged it as a non-result so nobody would read it as one later.
          </span>
        </div>

        <Body>
          Publishing that is the honest version, and it is also the useful one. The delivery numbers measure whether the channel works. They are not a proxy for whether the campaign worked, and a case study that quietly swaps one for the other is not a technical case study.
        </Body>
      </Section>

      {/* ── Summary ── */}
      <section id="summary" style={{ borderTop: "1px solid var(--border)", background: PAGE_BG, scrollMarginTop: 64 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <Eyebrow>Summary</Eyebrow>
          <p style={{ fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.8, color: "var(--text-secondary)", maxWidth: 640 }}>
            Fax has no marketing infrastructure, so the campaign had to bring its own: a list built from public registry data instead of bought, an asset designed against what a grayscale machine actually renders, personalization pushed into coversheets so the payload could stay fixed, a spreadsheet doing the work of a CRM, and gates rather than targets on volume. The part I would carry anywhere is the verification discipline. A send tool&apos;s status is a claim, and an agent that prepares work faster than a person can check it makes the difference between a claim and a fact matter more, not less. That is also why a person still types the sentence that sends the fax.
          </p>
          <BackToDashboardCta href={BACK_HREF} />
        </div>
      </section>

      <TableOfContents items={TOC} />

      {lightbox && <Lightbox images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
    </CaseShell>
  );
}
