"use client";

/* ── V2. East End Neuropsych provider fax campaign. ───────────────
   Revision pass from Tzvi's editorial notes, 2026-09-03.
   V1 is frozen at FaxV1.tsx; /work/fax/v1 renders it for comparison.

   Copy rules (voice-dna, enterprise-instructive lean):
   - First person, ownership verbs. People are the subject, never the software.
   - NO negative-first framing. Lead with what a thing IS, never "X is not Y".
   - Banned: "nobody asked for / nobody markets on", quietly, silently,
     "subtler", just, simply, easy.
   - No em-dashes. Colons introduce elaboration.
   - The campaign is LIVE: present tense for what the system does, past for
     what I built.

   Every number traces to docs/east-end/metrics.md, except the practice-reported
   outcomes in RESULTS, which Tzvi confirmed on the record and which are shown
   as approximations. */

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "@/components/Lightbox";
import {
  PAGE_BG, ACCENT,
  Eyebrow, TitleLine, SectionHeader, Body, Caption, ExpandHint, Section,
  DataTable, ExpandableImage, FlowCarousel, StateCard, StatGrid, ScrollingSheet, Hint,
  TopBar, BackToDashboardCta, TableOfContents, CaseShell,
  type FlowItem, type TocItem, type Stat, type SheetRow,
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
  { id: "results", label: "Results" },
  { id: "summary", label: "Summary" },
];

/* ── The design iteration, first draft to fax-safe ───────────── */
const ITERATIONS: FlowItem[] = [
  {
    src: `${BASE}/iter-1-first-draft.png`,
    title: "1 · First draft",
    caption: "The idea is there, but this was fitting in too much visual material, all of which would be crushed by the conversion to black and white. It also spoke to patients rather than to referring physicians.",
    pos: "top",
  },
  {
    src: `${BASE}/iter-2-color-flyer.png`,
    title: "2 · Repositioned",
    caption: "Rewritten to address referring physicians, with real contact details. The Parkinson's group arrives as the practice's existing flyer, pasted straight in.",
    pos: "top",
  },
  {
    src: `${BASE}/iter-3-refined-color.png`,
    title: "3 · Refined",
    caption: "The flyer becomes a typographic panel that belongs to the page, the portrait is tightened, and the grid is rebuilt to Letter size.",
    pos: "top",
  },
  {
    src: `${BASE}/iter-4-faxsafe-final.png`,
    title: "4 · Fax-safe",
    caption: "Converted to pure black on white. The portrait is brightened so mid-tones survive, hairlines become heavy rules, and nothing critical sits in the header strip.",
    pos: "top",
  },
];

const RENDER_RULES: [string, string, string][] = [
  ["Color", "Flattened to grayscale, often to one bit", "Pure black on white. No color carries meaning."],
  ["Photography", "Mid-tones crush to black", "High-contrast portrait, brightened so the mid-tones survive."],
  ["Hairline rules", "Drop out entirely", "Heavy borders and boxed sections."],
  ["Small type", "Fills in and blurs", "Minimum body size raised. Hierarchy carried by weight, not size."],
  ["Page top", "Overwritten by the fax header", "Top margin cleared. Nothing critical in the first strip."],
  ["QR code", "Modules blur together below a certain size", "Oversized, with a generous quiet zone."],
];

/* ── Coversheets. Four specialty versions plus the fallback. ─── */
const COVERSHEETS: { when: string; what: string }[] = [
  { when: "Fax Blast · fallback", what: "The generic version, and the one the first live batch went out on. Leads with the Parkinson's group and an open invitation to call." },
  { when: "Cover A · Neurologists", what: "Leads with the psychiatric side of movement disorders: the psychosis, the impulse control changes, the apathy that arrives with the tremor." },
  { when: "Cover B · Geriatric primary care", what: "Leads with memory and dementia evaluation, late-life depression, and behavior that has become hard to manage at home." },
  { when: "Cover C · Family and internal medicine", what: "Names the kinds of patient worth referring, so a busy primary care physician can recognize one without reading the whole page." },
  { when: "Cover D · Psychologists", what: "Leads with prescribing alongside their therapy, and makes clear the client stays in their care." },
];
const COVER_IMAGES = [
  `${BASE}/cover-0-generic.png`,
  `${BASE}/cover-a-neurology.png`,
  `${BASE}/cover-b-geriatric.png`,
  `${BASE}/cover-c-generalpcp.png`,
  `${BASE}/cover-d-psychologists.png`,
];

const WORKBOOK: [string, string, string][] = [
  ["Sheet1", "Raw provider data", "Never overwritten. Source of truth for the basis of the list."],
  ["Campaign Segmentation Tracker", "Live campaign state", "30 columns. Tier, priority and coversheet fill in by formula. Batch, send and status columns are written during operations."],
  ["Updox Contacts Import", "Delivery mapping", "The same list, reshaped into the columns Updox needs in order to import a contact."],
  ["Rollout Playbook", "The operating manual", "Eight sections: segmentation, tiering, coversheets, batching, stop logic, first-rollout spec, field legend, cleanup protocol. The agent reads it as a preflight check before any batch goes out."],
];

const RAMP: [string, string, string][] = [
  ["Days 1 to 3", "25 a day", "90% delivered, no retry storms, no complaints"],
  ["Days 4 to 7", "50 a day", "90% delivered on two consecutive days"],
  ["Week 2", "100 a day", "Delivery stable, dashboard clean"],
  ["Week 3 on", "150 to 200 a day", "Continuous monitoring. Pause on any breach."],
];

const STOP_RULES: [string, string, string][] = [
  ["Delivery failure spike", "Over 15% of a batch failed", "Pause and investigate the numbers and the line before the next batch."],
  ["Retry storm", "Over 25% of a batch in repeated retry", "Pause. The carrier is redialing failures, so check the queue and start nothing new."],
  ["Queue backlog", "Pending not clearing inside 30 minutes", "Hold new sends until the outbound queue drains."],
  ["Office complaints", "Two requests to stop faxing", "Pause that specialty group and flag do-not-contact."],
  ["Attachment corruption", "Any garbled or blank fax reported", "Full stop, and re-run rendering QA before resuming."],
];

const FAILURES: [string, string, string][] = [
  ["Busy signal detected", "The line answered while carrying another transmission", "Retry"],
  ["Does not answer (code 42)", "It rings, and nothing picks up the fax handshake", "Retry"],
  ["No carrier detected", "No fax tone at all, often a voice number in a fax column", "Retry once"],
  ["Line disconnected", "The carrier reports the number as dead", "Fix the row"],
  ["No receiver protocol", "Something answered and never negotiated", "Fix the row"],
];

/* Synthetic tracker rows for the scrolling sheet. Invented providers,
   555-01xx numbers. The structure is the live one. */
const SHEET_HEADERS = ["Provider", "Specialty", "Tier", "Group", "Coversheet", "Batch", "Status"];
const SHEET_COLS = "1.35fr 1.2fr 0.4fr 1.1fr 1fr 0.95fr 1.25fr";
const SHEET_ROWS: SheetRow[] = [
  ["Marisol Vantree, M.D.", "Neurology", { v: "A", tone: "auto" }, { v: "EEN-A-Neurology", tone: "auto" }, { v: "Cover A", tone: "auto" }, "NEURO-001", { v: "DELIVERED", tone: "ok" }],
  ["Devin Okonkwo-Hale, D.O.", "Neurology", { v: "A", tone: "auto" }, { v: "EEN-A-Neurology", tone: "auto" }, { v: "Cover A", tone: "auto" }, "NEURO-001", { v: "FAILED · busy", tone: "bad" }],
  ["Priya Ramachandran, M.D.", "Neurology - Neuromuscular", { v: "A", tone: "auto" }, { v: "EEN-A-NeuroMuscular", tone: "auto" }, { v: "Cover A", tone: "auto" }, "NEURO-001", { v: "DELIVERED", tone: "ok" }],
  ["Aurelio Benshoof, M.D.", "Internal Medicine - Geriatric", { v: "A", tone: "auto" }, { v: "EEN-A-Geriatric", tone: "auto" }, { v: "Cover B", tone: "auto" }, "NEURO-002", { v: "DELIVERED", tone: "ok" }],
  ["Halcyon Ndiaye, N.P.", "NP - Gerontology", { v: "A", tone: "auto" }, { v: "EEN-A-Geriatric", tone: "auto" }, { v: "Cover B", tone: "auto" }, "", { v: "COVERED · shared line", tone: "hold" }],
  ["Rosalind Achterberg, M.D.", "Internal Medicine - Geriatric", { v: "A", tone: "auto" }, { v: "EEN-A-Geriatric", tone: "auto" }, { v: "Cover B", tone: "auto" }, "NEURO-002", { v: "DELIVERED", tone: "ok" }],
  ["Emeka Vandersloot, M.D.", "Neurology", { v: "A", tone: "auto" }, { v: "EEN-A-Neurology", tone: "auto" }, { v: "Cover A", tone: "auto" }, "NEURO-003", { v: "DELIVERED", tone: "ok" }],
  ["Théo Marchetti-Lund, M.D.", "Internal Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-InternalMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-031", { v: "FAILED · disconnected", tone: "bad" }],
  ["Wren Castellanos, M.D.", "Family Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-FamilyMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-031", { v: "DELIVERED", tone: "ok" }],
  ["Junius Halloway-Petrie, M.D.", "Internal Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-InternalMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-031", { v: "DELIVERED", tone: "ok" }],
  ["Anouk Tessaro, M.D.", "Family Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-FamilyMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-032", { v: "DELIVERED", tone: "ok" }],
  ["Kwabena Lindqvist, N.P.", "NP - Primary Care", { v: "B", tone: "auto" }, { v: "EEN-B-PrimaryCare-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-032", { v: "FAILED · no carrier", tone: "bad" }],
  ["Delphine Okonjo, M.D.", "Internal Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-InternalMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", { v: "COVERED · shared line", tone: "hold" }],
  ["Ignatius Brambleton, M.D.", "Family Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-FamilyMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "NEURO-032", { v: "DELIVERED", tone: "ok" }],
  ["Ingrid Solheim-Baptiste, Psy.D.", "Psychologist", { v: "C", tone: "auto" }, { v: "EEN-C-Psychology", tone: "auto" }, { v: "Cover D", tone: "auto" }, "NEURO-014", { v: "DELIVERED", tone: "ok" }],
  ["Bartholomew Ferreira-Quist, Ph.D.", "Psychologist", { v: "C", tone: "auto" }, { v: "EEN-C-Psychology", tone: "auto" }, { v: "Cover D", tone: "auto" }, "NEURO-014", { v: "FAILED · no protocol", tone: "bad" }],
  ["Saoirse Nakamura-Vale, Psy.D.", "Psychologist", { v: "C", tone: "auto" }, { v: "EEN-C-Psychology", tone: "auto" }, { v: "Cover D", tone: "auto" }, "NEURO-014", { v: "DELIVERED", tone: "ok" }],
  ["Ovidiu Pemberton, M.D.", "Pain Management", { v: "C", tone: "auto" }, { v: "EEN-C-PainMgmt", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", "Not yet sent"],
  ["Yusuf Adeyemi-Strand, M.D.", "Neurological Surgery", { v: "D", tone: "auto" }, { v: "EEN-D-NeuroSurg", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", "Not yet sent"],
  ["Clementine Aubertin, M.D.", "Neurological Surgery", { v: "D", tone: "auto" }, { v: "EEN-D-NeuroSurg", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", "Not yet sent"],
  ["Ferdinand Oyelaran, M.D.", "Internal Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-InternalMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", "Not yet sent"],
  ["Beatrix Szymanski, M.D.", "Family Medicine", { v: "B", tone: "auto" }, { v: "EEN-B-FamilyMed-P1", tone: "auto" }, { v: "Cover C", tone: "auto" }, "", "Not yet sent"],
];

/* Results. Six tiles: two from the built pipeline, one from the send
   records, three practice-reported.
     2,521          — recomputed from the campaign CSV.
     ~80%           — Updox delivery telemetry: 232 delivered of 275 resolved
                      sends (84%) in the measured window. Published low.
     +580%          — 7 intakes in July against a reported 48 a month since
                      launch (3/day x 4 days x 4 weeks). Attributed in prose.
     167%           — ~50 sign-ups against 30 seats.
     ~$290          — the medical director's own figure, $289.09.
     ~$14K          — 48 x $289.09 = $13,876. Labeled a capacity estimate.
   See docs/east-end/metrics.md sections A, B and E. */
const STATS: Stat[] = [
  { big: "+580%", label: "Increase in monthly new patient intakes, from seven in July to a reported forty-eight a month since the August launch" },
  { big: "167%", label: "Of capacity on the Parkinson's group. About 50 people signed up against 30 seats, and the overflow became a second group." },
  { big: "~$14K", label: "New-intake collections a month at the reported pace, at the practice's own figure of ~$290 collected on each intake" },
  { big: "~80%", label: "Of resolved sends delivered, measured record by record rather than read off the dashboard" },
  { big: "2,521", label: "Providers on the built list, filtered from more than half a million New York practitioners, every one with a working fax number" },
  { big: "1,901", label: "Unique destinations after automated deduplication, which is what the batching respects" },
];
export default function FaxCaseStudy() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const open = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <CaseShell>
      <TopBar backHref={BACK_HREF} />

      {/* ── Hero ── */}
      <header id="intro" style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) var(--space-6) clamp(36px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: "var(--space-6)", scrollMarginTop: 64 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Eyebrow>Case study · East End Neuropsych</Eyebrow>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 400, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text-primary)", maxWidth: 820 }}>
            Transforming fax into an automated outreach channel
          </h1>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            The clinicians at East End Neuropsych treat older adults whose cases involve overlapping factors: mood, health, neurological wellness, and more. In this field, the fax machine is a primary channel of communication for a physician&apos;s front desk.
          </p>
          <p style={{ fontSize: "clamp(1.02rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 660 }}>
            The practice had never used this channel for anything beyond sharing patient information between established contacts, so I was tasked with creating a new outbound marketing funnel. That meant synthesizing a list of 2,521 providers, assembled from a public registry of more than half a million New York practitioners and filtered by relevant specialty. It meant a one-page marketing communiqué designed to survive a grayscale fax machine, personalized cover sheets per specialty bucket, and a living spreadsheet doing the work of a CRM. It also meant deciding what an agent could do on its own, and what it had to stop and ask permission for.
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

        {/* First image: the whole system at a glance. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
          <ExpandHint>The end-to-end system. Click to open it full size.</ExpandHint>
          <ExpandableImage
            src={`${BASE}/pipeline.svg`}
            alt="Pipeline diagram. Build: registry pull, filter and normalize, tier and assign a coversheet, campaign tracker. Operate, once per batch: reserve, agent prepares, human approval, Updox sends, verify and write back."
            onOpen={() => open([`${BASE}/pipeline.svg`], 0)}
            contain
          />
          <Caption>
            The build stage runs a single time to produce the list. The operating loop runs once per batch, and it stops in the middle to ask for a signature. Step 07 is the only step in the whole system that cannot be automated away.
          </Caption>
        </div>
      </header>

      {/* ── Background ── */}
      <Section alt id="background">
        <SectionHeader eyebrow="Background" title="Retrofitting fax with automation" />
        <Body>
          Fax is still an active channel for communication between physicians: somewhere between 70% and 89% of healthcare organizations still rely on it, and more than nine billion medical fax pages move across US phone lines every year.<sup><a href="https://www.faxsipit.com/blogs/fax-usage-statistics" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none", fontWeight: 700 }}>1</a></sup>{" "}The practice had not implemented it as a marketing channel. There is no Mailchimp for fax. No list rental, no open rates, no unsubscribe link, no A/B test, no deliverability dashboard worth the name. What does exist is a telephony protocol older than the web, a tool called Updox that sits next to the practice&apos;s records system, and a receiving office that will read a page, but only if it looks like it came from a colleague.
        </Body>
        <Body>
          The campaign would need to go out on the practice&apos;s clinical fax line, the same number real patient faxes move across at the same time of day. Marketing volume was therefore sharing a line that patient care depends on.
        </Body>
        <Caption>
          1. Fax usage statistics, FaxSIPit, citing the Medical Group Management Association.
        </Caption>
      </Section>

      {/* ── The list ── */}
      <Section id="list">
        <SectionHeader eyebrow="The list" title="2,521 handpicked providers" />
        <Body>
          Referral lists are for sale, but bought lists are resold, blasted repeatedly, and full of inactive numbers. On a channel with no automatic way to unsubscribe, that risks irritating the very people you want referring their clients to you. So I built the list myself, from NPPES, the National Plan and Provider Enumeration System, and its registry of National Provider Identifiers maintained by the Centers for Medicare &amp; Medicaid Services.
        </Body>
        <Body>
          New York alone lists more than half a million individual practitioners, and the registry&apos;s API returns 200 results per request and refuses to page past 1,200, so it cannot be asked the question I actually had: bring me every neurologist and geriatrician within driving distance of the practice. So I had Claude write a custom Python script that crawls 239 ZIP codes across the practice&apos;s referral region, one at a time, pulling every individual provider in each. It filters what comes back against 69 taxonomy codes, the NUCC classifications the registry files each provider under, where 2084N0400X means neurology and 207QG0300X means geriatric family medicine. Then it keeps only practitioners with a usable fax number and ranks the survivors by referral priority and distance from the practice.
        </Body>
        <DataTable
          cols="1.7fr 0.75fr 1.5fr"
          headers={["Stage", "Rows", "What happened"]}
          rows={[
            ["New York practitioners in the registry", "551,050", "The addressable universe, before any filtering"],
            ["Pulled from 239 New York ZIPs", "32,053", "Individual providers only, across 66 specialties"],
            ["Carrying a fax number", "12,559", "39% of the pull. The rest cannot be reached on this channel."],
            ["In twelve referral-relevant specialties", "2,521", "Neurology, geriatrics, primary care, psychology, pain, neurosurgery"],
            [<span key="d">After automated deduplication</span>, <strong key="n" style={{ color: ACCENT }}>1,901</strong>, "Unique fax destinations. 620 providers share a machine with a colleague already on the list."],
          ]}
          accentLastHeader
        />
        <Caption>
          That last row really impacted the send logic. The first pass reaches 1,901 destinations, one provider per line. The other 620 wait for a later, spaced send, so no office receives the same campaign twice in the same week. See below for more details.
        </Caption>
        <Body>
          Then I tiered them. A campaign this size needs pacing, so tiering runs on clinical affinity while priority is inherited from the registry record.
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
          Rollout followed value rather than volume: neurology first, then neuromuscular, geriatrics, psychology, and then Tier B in chunks. We established that Tier A converts best, that it is small enough to turn into human relationships rather than cold sends, and that it is the lowest-risk cohort to prove the pacing on.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <TitleLine>Refining providers vs. total destinations</TitleLine>
          <Body>
            One finding changed the batching logic. Those 2,521 providers sit behind only 1,901 unique fax numbers. 319 numbers are shared by two or more providers, 939 people on the list sit behind a shared line, and the busiest single fax machine serves fourteen of them.
          </Body>
          <Body>
            Faxing the list by provider would have dialed some offices fourteen times for one campaign. <strong style={{ color: ACCENT }}>Automated deduplication</strong> collapses it to one destination per batch, and every row whose number has already been reached carries its own status: covered by a shared fax, delivered, deliberately not resent. Providers whose shared line failed get flagged for an individual send later. A small share of providers were reached that way, and in the send records every batch shows one hundred percent unique destinations, so no office was ever dialed twice in the same batch.
          </Body>
        </div>
      </Section>

      {/* ── The asset ── */}
      <Section alt id="asset">
        <SectionHeader eyebrow="The asset" title="Designing high-value content for a low-resolution delivery" />
        <Body>
          Fax is a grayscale scan sent down a phone line. Everything a normal brand asset leans on degrades or disappears, and that failure is invisible from the sending end. So we needed high-contrast content that would survive the transfer.
        </Body>
        <Body>
          Content and design evolved together, the way a good software product does when writing, design and engineering iterate as one team. Here that team is one person. I gathered priorities from the practice&apos;s stakeholders and drafted the copy through my own content system, so the voice matched everything else the practice publishes. From there I connected Claude to Figma through the Figma Make MCP and worked the layout against those drafts: the design settled around a solid text draft, and the text was finalized as the design locked. Converting the finished page to fax-safe black and white came last, once the words and the layout had both settled.
        </Body>
        <DataTable
          cols="0.8fr 1.2fr 1.6fr"
          headers={["Element", "What a fax does to it", "What shipped"]}
          rows={RENDER_RULES.map((r) => [r[0], r[1], r[2]])}
          accentLastHeader
        />
        <ExpandHint>Scroll through the iteration, or click any version for full size.</ExpandHint>
        <FlowCarousel items={ITERATIONS} onOpen={(i) => open(ITERATIONS.map((v) => v.src), i)} cardWidth={290} imageHeight={380} />
      </Section>

      {/* ── Personalization ── */}
      <Section id="personalization">
        <SectionHeader eyebrow="Personalization" title="Creating custom content for different target audiences" />
        <Body>
          A coversheet is the first thing that prints at the other end, and often the only thing a front desk reads before deciding whether the pages behind it are worth passing on. So instead of personalizing the whole asset, which would have muddied the data, I put the personal touch on the coversheet. Each one opens by naming the reader&apos;s own specialty and the specific kind of patient we can collaborate on: their patients stay in their care, and we handle the psychiatric side.
        </Body>
        <Body>
          One tactic on the table was personalizing the newsletter itself for each recipient. Generating that many PDFs increases the chances of a rendering fault nobody could trace, so the newsletter stayed fixed and universal, and personalization took place in the coversheets, the subject line, and how the send group was framed.
        </Body>
        <ExpandHint>Click a coversheet to read the version that went to that specialty.</ExpandHint>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
          {COVERSHEETS.map((c, i) => (
            <StateCard key={c.when} when={c.when} what={c.what} onClick={() => open(COVER_IMAGES, i)} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <TitleLine>Overcoming missing features with automation</TitleLine>
          <Body>
            Updox was built to send one fax to one person. It has no way to attach a different coversheet to each recipient in a batch, because the coversheet is a setting on the sending account: whatever is selected there is what everyone in that send receives. Building a batch by hand also means picking every recipient out of a contact list individually, one click at a time.
          </Body>
          <Body>
            That mass of clicks is prone to human error, so the agent does it instead. It sets the account&apos;s coversheet to match the batch&apos;s specialty group, adds the recipients for that group, attaches the newsletter, and then checks its own work by reading the record Updox stores against each recipient rather than the compose window on screen. What the screen displays and what each recipient is actually carrying are two different things, and only one of them is worth trusting.
          </Body>
        </div>
      </Section>

      {/* ── The system ── */}
      <Section alt id="system">
        <SectionHeader eyebrow="The system" title="Managing all the data" />
        <Body>
          I needed a CRM. Updox sends faxes and stores delivery records, with no concept of a marketing list, a campaign, or a batch. So the system of record became a single spreadsheet doing four jobs at once, under strict rules about which tab is allowed to write to which.
        </Body>
        <DataTable
          cols="1.1fr 0.9fr 2fr"
          headers={["Tab", "Job", "Rule"]}
          rows={WORKBOOK.map((w) => [w[0], w[1], w[2]])}
        />
        <Body>
          This workbook is the system&apos;s memory, and it sits deliberately outside the agent. The Rollout Playbook tab holds the operating rules as plain text: segmentation logic, batch sizes, stop thresholds, the cleanup protocol. The scheduled task reads that tab as a preflight check before it assembles anything, compares the campaign&apos;s live state against the rules it finds there, and reports back when the two disagree. Because the rules live in the workbook rather than inside the prompt, the agent can verify itself against them, and I can change how the campaign behaves by editing a spreadsheet cell instead of rewriting a task.
        </Body>
        <Body>
          Claude also worked this sheet alongside the Gemini that runs natively inside Google Sheets. While the segmentation logic was being set up, Gemini checked the bucket arrangements and troubleshot formulas in the document itself, in place, while Claude handled the campaign state around it.
        </Body>
        <Hint>The live tracker, scrolling. Hover to pause, or swipe sideways for the rest of the columns.</Hint>
        <ScrollingSheet
          headers={SHEET_HEADERS}
          cols={SHEET_COLS}
          rows={SHEET_ROWS}
          tabs={["Sheet1", "Campaign Segmentation Tracker", "Updox Contacts Import", "Rollout Playbook"]}
          activeTab="Campaign Segmentation Tracker"
          height={360}
          seconds={38}
        />
        <Caption>
          2,521 rows deep and 30 columns wide. The lilac columns fill themselves in by formula from specialty and priority; everything from the batch ID rightward is written during operations, one batch at a time. Rows marked <em>covered by a shared line</em> are the deduplication rule doing its job. Provider names and numbers on this view are invented; the structure is the live one.
        </Caption>
      </Section>

      {/* ── Guardrails ── */}
      <Section id="guardrails">
        <SectionHeader eyebrow="Guardrails" title="Compliance, transparency and ease of use" />
        <Body>
          Fax has no built-in unsubscribe, and FCC rules require that cold outreach offer a way out. So I built one. Every coversheet closes with a line telling the recipient exactly how to be removed, by email or by phone, and that removal path runs into a do-not-contact column the agent reads before it assembles any batch. A campaign that irritates a referring office does not lose a subscriber, it loses a potential referral source, permanently. Two things follow: a human authorizes every transmission, and volume advances only when the previous stage has earned it.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <TitleLine>Approving at the send gate</TitleLine>
          <Body>
            A scheduled agent runs on weekday mornings. It reconciles the previous batch, reads the delivery record, works out who is eligible next, enforces one fax destination per batch, assembles the recipients, and confirms the attachment is the approved newsletter rather than an older draft. Then it stops and reports, without transmitting. Sending requires me to reply with a specific sentence naming the specific batch, so authorization is something typed rather than something clicked by accident. On the first live batch the agent reported at 9:07 in the morning and the faxes left at 9:29: twenty-two minutes, with a human decision in the middle. When it meets something it cannot do, a login or a file it cannot place, it says so in one line and waits, and I can clear it from my phone.
          </Body>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
          <TitleLine>Safety precautions and monitoring</TitleLine>
          <Body>
            Volume advances on evidence. Each stage has a condition to clear before the next one opens, and batches stay homogeneous by specialty, so a failure spike can be traced to a carrier, a list segment, or a coversheet, because only one thing varies at a time.
          </Body>
          <DataTable
            cols="0.8fr 0.8fr 1.8fr"
            headers={["Stage", "Daily volume", "Gate to advance"]}
            rows={RAMP.map((r) => [r[0], r[1], r[2]])}
          />
          <Body>
            Five conditions stop the campaign where it stands. Any one of them pauses the next batch and notifies me. Two in the same day roll the campaign back to the last batch known to be clean.
          </Body>
          <DataTable
            cols="0.85fr 0.95fr 1.7fr"
            headers={["Trigger", "Threshold", "Action"]}
            rows={STOP_RULES.map((r) => [r[0], r[1], r[2]])}
          />
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT}`, borderRadius: "var(--radius-md)", padding: "var(--space-5)", boxShadow: "var(--shadow-card)", maxWidth: 660 }}>
            <span style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
              None of the five has ever fired. Across the whole campaign the office has received <strong style={{ color: ACCENT }}>zero requests to stop faxing</strong>, and the do-not-contact column is still empty.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
          <TitleLine>Verifying what actually got delivered</TitleLine>
          <Body>
            Because fax delivery is asynchronous, its status is hard to track and log. A busy or unanswered number gets retried automatically, sometimes an hour or two later, so a status read at the end of a send is a reading of an unfinished process.
          </Body>
          <Body>
            So I built several layers of verification, documentation and cleanup. The protocol re-opens each record and reads its own account of what happened before acting on any status, rather than trusting the summary on the dashboard. It also queries a two-day window for every reconciliation, because the send tool&apos;s clock runs seven hours ahead of local time and a one-day window drops records.
          </Body>
          <Body>
            Failures get sorted and counted, so that we don&apos;t burn potential contacts.
          </Body>
          <DataTable
            cols="1fr 1.7fr 0.6fr"
            headers={["Failure", "What it means", "Verdict"]}
            rows={FAILURES.map((r) => [r[0], r[1], r[2]])}
            accentLastHeader
          />
        </div>
      </Section>

      {/* ── Results ── */}
      <Section alt id="results">
        <SectionHeader eyebrow="Results" title="Converting cold calls into concrete clients" />
        <StatGrid stats={STATS} min={280} />
        <Body>
          Operationally speaking, the channel worked very smoothly. Batches assembled and went out, statuses resolved, failures sorted by cause, automated deduplication blocked the duplicate transmissions it was built to prevent, and no office has asked to be taken off the list.
        </Body>
        <Body>
          The outcome that matters most to the practice is the calendar. New intakes had dipped through the winter and gone quiet over the summer, bottoming out at <strong style={{ color: ACCENT }}>seven for the whole of July</strong>. The campaign went out in August, and the practice has been <strong style={{ color: ACCENT }}>booked out for new intakes into November</strong>{" "}ever since. At the medical director&apos;s reported pace of three new intakes a day across a four-day week, that is forty-eight a month against July&apos;s seven, and at his figure of roughly $290 collected on each, about $14K a month in new-intake collections. Each of those patients then books a monthly or bi-monthly follow-up, so the annual figure lands somewhere upward of $165K in intakes alone.
        </Body>
        <Body>
          The intake, enrollment and collection figures come from the practice, which tracks referrals at the front desk. The monthly and annual figures are capacity estimates derived from those numbers rather than revenue booked.
        </Body>
      </Section>

      {/* ── Summary ── */}
      <section id="summary" style={{ borderTop: "1px solid var(--border)", background: PAGE_BG, scrollMarginTop: 64 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <Eyebrow>Summary</Eyebrow>
          <p style={{ fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.8, color: "var(--text-secondary)", maxWidth: 640 }}>
            Fax marketing has no established infrastructure, so I created a customized agent to run it: a list built from public registry data instead of bought, an asset designed against what a grayscale machine renders on the recipient side, personalization in the coversheets so a receiving practitioner opens something addressed to their own specialty rather than a generic blast, a spreadsheet serving as the brains of the operation, and success targets that gate every increase in send volume. Once the automation was in place, the return on the whole effort comfortably out-earned what the practice paid me to build it.
          </p>
          <BackToDashboardCta href={BACK_HREF} />
        </div>
      </section>

      <TableOfContents items={TOC} />

      {lightbox && <Lightbox images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
    </CaseShell>
  );
}
