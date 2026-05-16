#!/usr/bin/env node
/**
 * extract-strings.mjs
 * Extracts all content strings from the portfolio site for human review.
 * Output: CONTENT_STRING_REVIEW.csv (project root)
 *
 * Run: node scripts/extract-strings.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load JSON data ────────────────────────────────────────────────────────────
const profile    = JSON.parse(readFileSync(resolve(ROOT, 'data/profile.json'), 'utf-8'));
const skillsData = JSON.parse(readFileSync(resolve(ROOT, 'data/skills.json'), 'utf-8'));
const eduData    = JSON.parse(readFileSync(resolve(ROOT, 'data/education.json'), 'utf-8'));
const expData    = JSON.parse(readFileSync(resolve(ROOT, 'data/experience.json'), 'utf-8'));

// ── CSV helpers ───────────────────────────────────────────────────────────────
function esc(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function csvRow(...cols) { return cols.map(esc).join(','); }

// ── Auto-flag logic ───────────────────────────────────────────────────────────
const REVISE_TRIGGERS = [
  '—', ' just ', 'simply', 'easy ', 'easy,', 'easily',
  'awesome', 'AI-powered', 'seamlessly', 'intuitive',
  'user-friendly', 'passionate about', 'storyteller',
];
const REVIEW_TRIGGERS = [
  'wordsmith', ' AI ', 'AI-', 'AI\n', '20+', '20 year', '20,',
  'million', ' shipped', ' owned', 'first ', 'Palo Alto', 'acquisition',
];

function computeAutoFlags(s) {
  const hits = [];
  for (const t of REVISE_TRIGGERS) if (s.includes(t)) hits.push(`Revise: "${t.trim()}"`);
  for (const t of REVIEW_TRIGGERS) if (s.includes(t)) hits.push(`Review: "${t.trim()}"`);
  return hits;
}

function resolveStatus(s, extraFlags = []) {
  const all = [...computeAutoFlags(s), ...extraFlags];
  if (all.some(f => f.startsWith('Revise'))) return 'Revise';
  if (all.length > 0) return 'Needs review';
  return 'Approved';
}

function resolveSeverity(s, extraFlags = []) {
  const st = resolveStatus(s, extraFlags);
  return st === 'Revise' ? 'High' : st === 'Needs review' ? 'Medium' : 'Low';
}

// ── Tracking counters ─────────────────────────────────────────────────────────
const statusCounts = { Approved: 0, 'Needs review': 0, Revise: 0 };
const layerCounts  = {};

// ── Column header ─────────────────────────────────────────────────────────────
const HEADER = [
  'String ID', 'Layer', 'Page / State', 'Surface', 'Component',
  'Recurring component?', 'Source type', 'Source file', 'Source key / path',
  'Render path / click path', 'Current string', 'Human rewrite',
  'Recommended status', 'Flag severity', 'Flags', 'Notes',
  'Global or instance-specific?', 'Visible / hidden / orphaned',
  'Applies to', 'Character count',
];

// ── Entry builder ─────────────────────────────────────────────────────────────
function e({
  id,
  layer,
  page,
  surface,
  comp,
  recurring    = 'No',
  srcType,
  srcFile,
  srcKey,
  renderPath,
  str,
  statusOverride,
  severityOverride,
  flagsOverride,
  notes        = '',
  scope        = 'Instance',
  vis          = 'Visible',
  appliesTo    = 'All visitors',
  extraFlags   = [],
}) {
  if (!str && str !== 0) str = '';
  str = String(str);

  const allExtraFlags = [...extraFlags];
  const flags   = flagsOverride  ?? [...computeAutoFlags(str), ...allExtraFlags].join('; ');
  const st      = statusOverride  ?? resolveStatus(str, allExtraFlags);
  const sev     = severityOverride ?? resolveSeverity(str, allExtraFlags);

  statusCounts[st]   = (statusCounts[st]   || 0) + 1;
  layerCounts[layer] = (layerCounts[layer] || 0) + 1;
  strLog.push({ id, str });

  return csvRow(
    id, layer, page, surface, comp, recurring,
    srcType, srcFile, srcKey, renderPath, str,
    '',   // Human rewrite — blank for reviewer
    st, sev, flags, notes, scope, vis, appliesTo,
    String(str.length),
  );
}

// ── Entries collector ─────────────────────────────────────────────────────────
const rows    = [];
const strLog  = []; // parallel array of { id, str } for placeholder check
const push    = (...r) => rows.push(...r);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. METADATA — app/layout.tsx
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'META-001', layer: 'metadata', page: 'All pages', surface: 'Browser tab / SEO head',
      comp: 'layout.tsx', srcType: 'hardcoded', srcFile: 'app/layout.tsx', srcKey: 'metadata.title',
      renderPath: 'Browser tab title · <title> element',
      str: 'Tzvi Kantor — UX Writer · AI Content Systems',
      notes: 'Page <title>. Contains em dash (—).', scope: 'Global', vis: 'Hidden (SEO)' }),

  e({ id: 'META-002', layer: 'metadata', page: 'All pages', surface: 'SEO meta description',
      comp: 'layout.tsx', srcType: 'hardcoded', srcFile: 'app/layout.tsx', srcKey: 'metadata.description',
      renderPath: '<meta name="description">',
      str: 'UX writer and content systems builder with 10+ years across SaaS, enterprise security, and AI-assisted content workflows.',
      notes: 'Meta description. "AI-" prefix triggers review.', scope: 'Global', vis: 'Hidden (SEO)' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PROFILE JSON — data/profile.json
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'PROFILE-001', layer: 'data', page: 'Main page / WelcomeWizard / Sidebar',
      surface: 'Multiple surfaces', comp: 'Sidebar · WelcomeWizard · AboutModal',
      srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.name',
      renderPath: 'Sidebar img alt · WelcomeWizard step 1 heading · AboutModal heading',
      str: profile.name,
      notes: 'Name used across Sidebar, WelcomeWizard step 1 heading, headshot aria. See duplication flag.',
      scope: 'Global',
      extraFlags: ['Review: "Tzvi Kantor" appears in page title, WelcomeWizard heading, Sidebar aria — review for redundancy'] }),

  e({ id: 'PROFILE-002', layer: 'data', page: 'N/A (orphaned context)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.title',
      renderPath: 'Orphaned — AboutModal not wired in page.tsx',
      str: profile.title,
      vis: 'Hidden (orphaned)', notes: 'Used only in orphaned AboutModal. Not rendered.', scope: 'Global' }),

  e({ id: 'PROFILE-003', layer: 'data', page: 'N/A (orphaned context)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.subtitle',
      renderPath: 'Orphaned — AboutModal not wired in page.tsx',
      str: profile.subtitle ?? '',
      vis: 'Hidden (orphaned)', notes: 'Used only in orphaned AboutModal.', scope: 'Global' }),
);

// tagline / bio — exact duplicates
const isDupe = profile.tagline === profile.bio;
const dupeFlag = isDupe
  ? ['Needs review: profile.tagline === profile.bio — exact duplicate. One field is redundant.']
  : [];

push(
  e({ id: 'PROFILE-004', layer: 'data', page: 'Main page', surface: 'Hero bio area',
      comp: 'page.tsx (hero)', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.tagline',
      renderPath: 'Main page → hero bio text',
      str: profile.tagline ?? '',
      extraFlags: dupeFlag,
      notes: isDupe ? 'Exact duplicate of profile.bio — one field is redundant.' : '' }),

  e({ id: 'PROFILE-005', layer: 'data', page: 'Main page', surface: 'Hero bio area',
      comp: 'page.tsx (hero)', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.bio',
      renderPath: 'Main page → hero bio text (same render as tagline if duplicate)',
      str: profile.bio ?? '',
      extraFlags: dupeFlag,
      notes: isDupe ? 'Exact duplicate of profile.tagline — one field is redundant.' : '' }),
);

// profile.about — single string, not rendered (AboutModal orphaned)
if (profile.about) {
  push(e({
    id: 'PROFILE-ABOUT-001', layer: 'data', page: 'N/A (orphaned context)', surface: 'AboutModal (orphaned)',
    comp: 'AboutModal (orphaned)', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.about',
    renderPath: 'Orphaned — AboutModal not wired in page.tsx',
    str: profile.about,
    vis: 'Hidden (orphaned)', notes: 'profile.about is not rendered. AboutModal is orphaned.', scope: 'Instance',
  }));
}

// Contact fields
push(
  e({ id: 'PROFILE-006', layer: 'data', page: 'Main page', surface: 'Sidebar contact card',
      comp: 'Sidebar → ContactItem', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.email',
      renderPath: 'Sidebar → email link label + mailto href', str: profile.email }),

  e({ id: 'PROFILE-007', layer: 'data', page: 'Main page', surface: 'Sidebar contact card',
      comp: 'Sidebar → ContactItem', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.phone',
      renderPath: 'Sidebar → US phone link label + tel href', str: profile.phone,
      notes: 'Displayed with "US" sublabel badge.' }),
);
if (profile.phone_il) {
  push(e({
    id: 'PROFILE-008', layer: 'data', page: 'Main page', surface: 'Sidebar contact card',
    comp: 'Sidebar → ContactItem', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.phone_il',
    renderPath: 'Sidebar → IL phone link label + tel href', str: profile.phone_il,
    notes: 'Displayed with "IL" sublabel badge.',
  }));
}
if (profile.location) {
  push(e({
    id: 'PROFILE-009', layer: 'data', page: 'Main page', surface: 'Sidebar contact card',
    comp: 'Sidebar → ContactItem', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.location',
    renderPath: 'Sidebar contact card → location', str: profile.location,
  }));
}
if (profile.linkedin) {
  push(e({
    id: 'PROFILE-010', layer: 'data', page: 'Main page', surface: 'Sidebar contact card',
    comp: 'Sidebar → ContactItem', srcType: 'json', srcFile: 'data/profile.json', srcKey: 'profile.linkedin',
    renderPath: 'Sidebar → LinkedIn link href (label = "LinkedIn")', str: profile.linkedin,
    notes: 'URL value. Visible label is the hardcoded string "LinkedIn" (see SIDEBAR-LBL-006).',
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SKILLS JSON — data/skills.json
// ═══════════════════════════════════════════════════════════════════════════════

skillsData.core.forEach((skill, i) => {
  push(e({
    id: `SKILL-CORE-${String(i + 1).padStart(3, '0')}`,
    layer: 'data', page: 'Main page', surface: 'Sidebar skills section',
    comp: 'Sidebar → SkillPill', srcType: 'json', srcFile: 'data/skills.json',
    srcKey: `skills.core[${i}]`,
    renderPath: 'Sidebar → Skills section → SkillPill label',
    str: skill, vis: 'Visible', scope: 'Global',
  }));
});

(skillsData.tools || []).forEach((tool, i) => {
  push(e({
    id: `SKILL-TOOL-${String(i + 1).padStart(3, '0')}`,
    layer: 'data', page: 'N/A', surface: 'Not rendered', comp: 'N/A',
    srcType: 'json', srcFile: 'data/skills.json', srcKey: `skills.tools[${i}]`,
    renderPath: 'Not rendered — skills.tools has no component consumer',
    str: tool, vis: 'Hidden (orphaned)', notes: 'skills.tools array not rendered anywhere.',
  }));
});

(skillsData.adjacent || []).forEach((adj, i) => {
  push(e({
    id: `SKILL-ADJ-${String(i + 1).padStart(3, '0')}`,
    layer: 'data', page: 'N/A', surface: 'Not rendered', comp: 'N/A',
    srcType: 'json', srcFile: 'data/skills.json', srcKey: `skills.adjacent[${i}]`,
    renderPath: 'Not rendered — skills.adjacent has no component consumer',
    str: adj, vis: 'Hidden (orphaned)', notes: 'skills.adjacent array not rendered anywhere.',
  }));
});

(skillsData.strengths || []).forEach((s, i) => {
  push(
    e({ id: `SKILL-STR-${String(i + 1).padStart(3, '0')}A`, layer: 'data', page: 'N/A (orphaned)',
        surface: 'StrengthTiles (orphaned)', comp: 'StrengthTiles (orphaned)',
        srcType: 'json', srcFile: 'data/skills.json', srcKey: `skills.strengths[${i}].label`,
        renderPath: 'StrengthTiles → tile label (orphaned — not wired in page.tsx)',
        str: s.label, vis: 'Hidden (orphaned)', notes: 'StrengthTiles not imported in page.tsx.' }),
    e({ id: `SKILL-STR-${String(i + 1).padStart(3, '0')}B`, layer: 'data', page: 'N/A (orphaned)',
        surface: 'StrengthTiles (orphaned)', comp: 'StrengthTiles (orphaned)',
        srcType: 'json', srcFile: 'data/skills.json', srcKey: `skills.strengths[${i}].description`,
        renderPath: 'StrengthTiles → tile description (orphaned — not wired in page.tsx)',
        str: s.description, vis: 'Hidden (orphaned)', notes: 'StrengthTiles not imported in page.tsx.' }),
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. EDUCATION JSON — data/education.json
// ═══════════════════════════════════════════════════════════════════════════════

eduData.forEach((edu, i) => {
  const n = String(i + 1).padStart(3, '0');
  push(
    e({ id: `EDU-${n}A`, layer: 'data', page: 'Main page', surface: 'Sidebar education section',
        comp: 'Sidebar → EducationCard', srcType: 'json', srcFile: 'data/education.json',
        srcKey: `education[${i}].institution`, renderPath: 'Sidebar → Education → EducationCard → institution name',
        str: edu.institution, scope: 'Global' }),
    e({ id: `EDU-${n}B`, layer: 'data', page: 'Main page', surface: 'Sidebar education section',
        comp: 'Sidebar → EducationCard', srcType: 'json', srcFile: 'data/education.json',
        srcKey: `education[${i}].degree`, renderPath: 'Sidebar → Education → EducationCard → degree prefix (hidden if Bootcamp or Certificate)',
        str: edu.degree, scope: 'Global' }),
    e({ id: `EDU-${n}C`, layer: 'data', page: 'Main page', surface: 'Sidebar education section',
        comp: 'Sidebar → EducationCard', srcType: 'json', srcFile: 'data/education.json',
        srcKey: `education[${i}].field`, renderPath: 'Sidebar → Education → EducationCard → field of study',
        str: edu.field, scope: 'Global' }),
    e({ id: `EDU-${n}D`, layer: 'data', page: 'Main page', surface: 'Sidebar education section',
        comp: 'Sidebar → EducationCard', srcType: 'json', srcFile: 'data/education.json',
        srcKey: `education[${i}].year`, renderPath: 'Sidebar → Education → EducationCard → year badge',
        str: edu.year, scope: 'Global' }),
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. EXPERIENCE JSON — data/experience.json
// ═══════════════════════════════════════════════════════════════════════════════

expData.forEach((co) => {
  const name    = co.company;
  const slug    = name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 6);
  const isCyber = slug === 'CYBERA';  // CyberArk

  push(
    e({ id: `EXP-${slug}-SUMM`, layer: 'content', page: 'Main page', surface: 'Experience card',
        comp: 'ExperienceCard', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.summary`, renderPath: 'Main page → ExperienceCard → summary text',
        str: co.summary, notes: `${name} card summary.` }),
  );

  if (co.expanded) {
    push(e({ id: `EXP-${slug}-EXP`, layer: 'content', page: 'Experience modal', surface: 'Slide-in drawer — expanded bio',
        comp: 'ExperienceModal', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.expanded`, renderPath: 'ExperienceModal → expanded description section',
        str: co.expanded, notes: `${name} expanded description.` }));
  }

  if (co.note) {
    push(e({ id: `EXP-${slug}-NOTE`, layer: 'content', page: 'Experience modal', surface: 'Slide-in drawer — note callout',
        comp: 'ExperienceModal', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.note`, renderPath: 'ExperienceModal → note callout block',
        str: co.note,
        extraFlags: ['Review: company note — keep factual and calm (layoff/acquisition context)'],
        notes: `${name} contextual note. Review for tone — factual, no editorial spin.` }));
  }

  (co.wins || []).forEach((win, i) => {
    push(e({ id: `EXP-${slug}-WIN-${String(i + 1).padStart(3, '0')}`, layer: 'content',
        page: 'Experience modal', surface: 'Impact & Wins accordion',
        comp: 'ExperienceModal → accordion', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.wins[${i}]`, renderPath: 'ExperienceModal → "Impact & Wins" accordion item',
        str: win }));
  });

  (co.owned || []).forEach((own, i) => {
    push(e({ id: `EXP-${slug}-OWN-${String(i + 1).padStart(3, '0')}`, layer: 'content',
        page: 'Experience modal', surface: 'What I Owned accordion',
        comp: 'ExperienceModal → accordion', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.owned[${i}]`, renderPath: 'ExperienceModal → "What I Owned" accordion item',
        str: own }));
  });

  (co.tools || []).forEach((tool, i) => {
    push(e({ id: `EXP-${slug}-TOOL-${String(i + 1).padStart(3, '0')}`, layer: 'content',
        page: 'Experience modal', surface: 'Tools & Process accordion',
        comp: 'ExperienceModal → accordion', srcType: 'json', srcFile: 'data/experience.json',
        srcKey: `${name}.tools[${i}]`, renderPath: 'ExperienceModal → "Tools & Process" accordion chip',
        str: tool }));
  });

  (co.projects || []).forEach((proj, pi) => {
    const pn = String(pi + 1);

    push(
      e({ id: `EXP-${slug}-P${pn}-TITLE`, layer: 'content', page: 'Experience modal',
          surface: 'Project card', comp: 'ExperienceModal → ProjectCard',
          srcType: 'json', srcFile: 'data/experience.json',
          srcKey: `${name}.projects[${pi}].title`,
          renderPath: 'ExperienceModal → ProjectCard → title',
          str: proj.title }),
      e({ id: `EXP-${slug}-P${pn}-SUMM`, layer: 'content', page: 'Experience modal',
          surface: 'Project card', comp: 'ExperienceModal → ProjectCard',
          srcType: 'json', srcFile: 'data/experience.json',
          srcKey: `${name}.projects[${pi}].summary`,
          renderPath: 'ExperienceModal → ProjectCard → summary',
          str: proj.summary }),
    );

    if (proj.context) {
      push(e({ id: `EXP-${slug}-P${pn}-CTX`, layer: 'content', page: 'Sample modal',
          surface: 'Project detail modal — context note', comp: 'SampleModal → context callout',
          srcType: 'json', srcFile: 'data/experience.json',
          srcKey: `${name}.projects[${pi}].context`,
          renderPath: 'SampleModal → italic context note (left-border callout)',
          str: proj.context }));
    }

    (proj.decisions || []).forEach((dec, di) => {
      push(e({ id: `EXP-${slug}-P${pn}-DEC-${String(di + 1).padStart(3, '0')}`, layer: 'content',
          page: 'Sample modal', surface: 'Key decisions section',
          comp: 'SampleModal → Key decisions', srcType: 'json', srcFile: 'data/experience.json',
          srcKey: `${name}.projects[${pi}].decisions[${di}]`,
          renderPath: 'SampleModal → "Key decisions" numbered list item',
          str: dec }));
    });

    (proj.impact || []).forEach((imp, ii) => {
      push(e({ id: `EXP-${slug}-P${pn}-IMP-${String(ii + 1).padStart(3, '0')}`, layer: 'content',
          page: 'Sample modal', surface: 'Impact section',
          comp: 'SampleModal → Impact', srcType: 'json', srcFile: 'data/experience.json',
          srcKey: `${name}.projects[${pi}].impact[${ii}]`,
          renderPath: 'SampleModal → "Impact" bullet list item',
          str: imp }));
    });

    (proj.samples || []).forEach((samp, si) => {
      if (samp && samp.caption) {
        push(e({ id: `EXP-${slug}-P${pn}-CAP-${String(si + 1).padStart(3, '0')}`, layer: 'content',
            page: 'Sample modal', surface: 'Image carousel caption',
            comp: 'SampleModal → carousel', srcType: 'json', srcFile: 'data/experience.json',
            srcKey: `${name}.projects[${pi}].samples[${si}].caption`,
            renderPath: 'SampleModal → image carousel → caption text below image',
            str: samp.caption }));
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SIDEBAR.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

const SKILL_TOOLTIPS = [
  ['Microcopy',           'Button labels, errors, and empty states. Words at the UI layer.'],
  ['UX',                  'End-to-end product content across flows and surfaces.'],
  ['Localization',        'Multi-language content architecture and copy reviews.'],
  ['User Research',       'Interviews, heuristic audits, and usability analysis.'],
  ['Prompt Engineering',  'LLM instruction design, chain-of-thought, and output optimization.'],
  ['Content Systems',     'Scalable docs, governance, and component content architecture.'],
  ['Evaluations',         'AI output quality rubrics and structured eval protocols.'],
  ['Conversation Design', 'Chat and voice flow architecture for AI products.'],
  ['Agentic Workflows',   'Autonomous AI pipeline design and orchestration.'],
];

SKILL_TOOLTIPS.forEach(([label, tip], i) => {
  push(e({
    id: `SIDEBAR-TT-${String(i + 1).padStart(3, '0')}`,
    layer: 'global-ui', page: 'Main page', surface: 'Sidebar skills section — hover tooltip',
    comp: 'Sidebar → SkillPill → tooltip', recurring: 'Yes',
    srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx',
    srcKey: `SKILL_TOOLTIPS["${label}"]`,
    renderPath: 'Sidebar → SkillPill hover → portal tooltip',
    str: tip, scope: 'Global', vis: 'Visible on hover',
    notes: `Tooltip for "${label}" skill pill.`,
  }));
});

push(
  e({ id: 'SIDEBAR-LBL-001', layer: 'global-ui', page: 'Main page', surface: 'Sidebar skills section header',
      comp: 'Sidebar → SectionLabel', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'SectionLabel text "Skills"',
      renderPath: 'Sidebar → "Skills" section heading', str: 'Skills',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SIDEBAR-LBL-002', layer: 'global-ui', page: 'Main page', surface: 'Sidebar education section header',
      comp: 'Sidebar → SectionLabel', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'SectionLabel text "Education"',
      renderPath: 'Sidebar → "Education" section heading', str: 'Education',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SIDEBAR-LBL-003', layer: 'global-ui', page: 'Main page', surface: 'Sidebar headshot hover overlay',
      comp: 'Sidebar → headshot button → overlay',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'headshot hover overlay text "About\\nTzvi"',
      renderPath: 'Sidebar → headshot button → hover overlay text',
      str: 'About\nTzvi', notes: 'Two-line text on headshot hover. Newline between words.', scope: 'Instance' }),

  e({ id: 'SIDEBAR-LBL-004', layer: 'global-ui', page: 'Main page', surface: 'Sidebar contact card — phone sublabel',
      comp: 'Sidebar → ContactItem → sublabel',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'ContactItem sublabel "US"',
      renderPath: 'Sidebar → US phone row → sublabel badge', str: 'US',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SIDEBAR-LBL-005', layer: 'global-ui', page: 'Main page', surface: 'Sidebar contact card — phone sublabel',
      comp: 'Sidebar → ContactItem → sublabel',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'ContactItem sublabel "IL"',
      renderPath: 'Sidebar → IL phone row → sublabel badge', str: 'IL',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SIDEBAR-LBL-006', layer: 'global-ui', page: 'Main page', surface: 'Sidebar contact card — LinkedIn link',
      comp: 'Sidebar → ContactItem',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'ContactItem label "LinkedIn"',
      renderPath: 'Sidebar → LinkedIn link → visible label text', str: 'LinkedIn',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SIDEBAR-ARIA-001', layer: 'global-ui', page: 'Main page', surface: 'Sidebar headshot button',
      comp: 'Sidebar → headshot button',
      srcType: 'hardcoded', srcFile: 'components/Sidebar.tsx', srcKey: 'aria-label headshot button "Open about"',
      renderPath: 'Sidebar → headshot button → aria-label',
      str: 'Open about', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 7. APP/PAGE.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

const FOCUS_LEGEND = [
  { label: 'Writing',       pct: 35 },
  { label: 'Research',      pct: 20 },
  { label: 'Collaboration', pct: 20 },
  { label: 'Prototyping',   pct: 15 },
  { label: 'Automation',    pct: 10 },
];

FOCUS_LEGEND.forEach((item, i) => {
  const mismatch = item.label === 'Automation'
    ? ['MISMATCH: page.tsx FOCUS_LEGEND uses "Automation" but FocusModal SEGMENTS uses "Admin & Automation" — label inconsistency across components']
    : [];
  push(e({
    id: `PAGE-FOCUS-${String(i + 1).padStart(3, '0')}`,
    layer: 'global-ui', page: 'Main page', surface: 'Focus section — donut chart legend',
    comp: 'page.tsx → FOCUS_LEGEND', srcType: 'hardcoded', srcFile: 'app/page.tsx',
    srcKey: `FOCUS_LEGEND[${i}].label`, renderPath: 'Main page → focus chart legend label + percentage',
    str: `${item.label} ${item.pct}%`, scope: 'Global', extraFlags: mismatch,
    notes: item.label === 'Automation' ? 'MISMATCH with FocusModal "Admin & Automation".' : '',
  }));
});

push(
  e({ id: 'PAGE-UI-001', layer: 'global-ui', page: 'Main page', surface: 'Focus section — header label',
      comp: 'page.tsx', srcType: 'hardcoded', srcFile: 'app/page.tsx', srcKey: 'section label "Focus"',
      renderPath: 'Main page → focus section → section header', str: 'Focus',
      statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'PAGE-UI-002', layer: 'global-ui', page: 'Main page', surface: 'Focus section — modal CTA',
      comp: 'page.tsx', srcType: 'hardcoded', srcFile: 'app/page.tsx', srcKey: 'CTA "View breakdown →"',
      renderPath: 'Main page → focus section → "View breakdown →" link',
      str: 'View breakdown →', scope: 'Global',
      notes: 'Inline → character in CTA label. Check if → is a real character or styled arrow.' }),

  e({ id: 'PAGE-UI-003', layer: 'global-ui', page: 'Main page', surface: 'Experience section — header',
      comp: 'page.tsx', srcType: 'hardcoded', srcFile: 'app/page.tsx',
      srcKey: 'section label "Professional Experience"',
      renderPath: 'Main page → experience section → section heading',
      str: 'Professional Experience', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'PAGE-UI-004', layer: 'global-ui', page: 'Main page', surface: 'Experience section — instruction text',
      comp: 'page.tsx', srcType: 'hardcoded', srcFile: 'app/page.tsx',
      srcKey: 'experience section instruction text',
      renderPath: 'Main page → experience section → descriptive text below heading',
      str: 'Select any role to explore impact, ownership, and work samples.', scope: 'Global' }),

  e({ id: 'PAGE-ARIA-001', layer: 'global-ui', page: 'Main page', surface: 'Focus chart button',
      comp: 'page.tsx → focus button', srcType: 'hardcoded', srcFile: 'app/page.tsx',
      srcKey: 'aria-label focus button "View focus breakdown"',
      renderPath: 'Main page → focus chart → button aria-label',
      str: 'View focus breakdown', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'PAGE-ARIA-002', layer: 'global-ui', page: 'Main page', surface: 'Scroll indicator button',
      comp: 'page.tsx → scroll button', srcType: 'hardcoded', srcFile: 'app/page.tsx',
      srcKey: 'aria-label scroll button — dynamic two states',
      renderPath: 'Main page → scroll indicator → aria-label (state-dependent)',
      str: 'Scroll down / Back to top',
      notes: 'Two states: "Scroll down" when at top, "Back to top" after scrolling. Dynamic label.',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'PAGE-ALT-001', layer: 'global-ui', page: 'Main page', surface: 'Focus donut chart image',
      comp: 'page.tsx → Image', srcType: 'hardcoded', srcFile: 'app/page.tsx',
      srcKey: 'Image alt "Focus area breakdown"',
      renderPath: 'Main page → focus chart → <Image> alt attribute',
      str: 'Focus area breakdown', statusOverride: 'Approved', vis: 'Hidden (alt)', scope: 'Global' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 8. WELCOMEWIZARD.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

const WIZARD_STEPS = [
  {
    eyebrow: 'About me',
    heading: 'Tzvi Kantor',
    sub:     'UX Writer · AI Content Systems',
    body: [
      'Father of two. Musician. Quick study. Someone who loves collaborating with creative minds and reads everything.',
      '10+ years building writing that holds up under pressure: from grants for a national disability nonprofit to enterprise security UX to AI-assisted content systems.',
    ],
  },
  {
    eyebrow: 'About my work',
    heading: 'Full-stack wordsmith',
    sub:     'UX writing · Content design · Systems · AI',
    body: [
      'The work spans UX writing, content design, technical writing, performance marketing, grant writing, and AI-assisted content systems.',
      'Each role added a layer. Shalva built institutional range. WeBetter sharpened conversion instincts. Wix unlocked product UX. Elementor was the full-function build. CyberArk was the scale test.',
    ],
  },
  {
    eyebrow: 'About this site',
    heading: 'Start with a role',
    sub:     'Then go as deep as you want',
    body: [
      'This site is a resume, a portfolio, and a working demo of the content and design system thinking behind the work. The architecture is part of the proof.',
      'Click any role card to explore samples, decisions, and process. More samples and features are in progress.',
    ],
  },
];

WIZARD_STEPS.forEach((step, si) => {
  const key = `STEP${si + 1}`;
  const s1flags = si === 0
    ? ['Needs review: heading "Tzvi Kantor" repeats profile.name — already in page title and Sidebar alt; review redundancy in wizard']
    : [];
  const subFlags = si === 0
    ? ['Needs review: subtitle "UX Writer · AI Content Systems" repeats the page <title> subtitle — identical on first impression']
    : [];

  push(
    e({ id: `WIZARD-${key}-001`, layer: 'modal', page: 'Welcome Wizard (first visit / headshot click)',
        surface: 'Welcome Wizard modal — step eyebrow', comp: 'WelcomeWizard',
        srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx', srcKey: `STEPS[${si}].eyebrow`,
        renderPath: `WelcomeWizard step ${si + 1} → eyebrow label`, str: step.eyebrow, scope: 'Instance' }),

    e({ id: `WIZARD-${key}-002`, layer: 'modal', page: 'Welcome Wizard (first visit / headshot click)',
        surface: 'Welcome Wizard modal — step heading', comp: 'WelcomeWizard',
        srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx', srcKey: `STEPS[${si}].heading`,
        renderPath: `WelcomeWizard step ${si + 1} → heading`, str: step.heading,
        scope: 'Instance', extraFlags: s1flags }),

    e({ id: `WIZARD-${key}-003`, layer: 'modal', page: 'Welcome Wizard (first visit / headshot click)',
        surface: 'Welcome Wizard modal — step subtitle', comp: 'WelcomeWizard',
        srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx', srcKey: `STEPS[${si}].sub`,
        renderPath: `WelcomeWizard step ${si + 1} → subtitle`, str: step.sub,
        scope: 'Instance', extraFlags: subFlags }),
  );

  step.body.forEach((para, bi) => {
    push(e({
      id: `WIZARD-${key}-BODY-${String(bi + 1).padStart(3, '0')}`,
      layer: 'modal', page: 'Welcome Wizard (first visit / headshot click)',
      surface: 'Welcome Wizard modal — step body', comp: 'WelcomeWizard',
      srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx', srcKey: `STEPS[${si}].body[${bi}]`,
      renderPath: `WelcomeWizard step ${si + 1} → body paragraph ${bi + 1}`,
      str: para, scope: 'Instance',
    }));
  });
});

push(
  e({ id: 'WIZARD-UI-001', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — navigation button',
      comp: 'WelcomeWizard', recurring: 'Yes', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'button label "Next"', renderPath: 'WelcomeWizard → Next button (steps 1 and 2)',
      str: 'Next', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'WIZARD-UI-002', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — final CTA',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'button label "Enter portfolio" (step 3 CTA)',
      renderPath: 'WelcomeWizard → step 3 → final CTA button',
      str: 'Enter portfolio', scope: 'Instance',
      notes: 'Final step CTA. Consider: "Enter" vs "Explore" or "Let\'s go".' }),

  e({ id: 'WIZARD-UI-003', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — back button',
      comp: 'WelcomeWizard', recurring: 'Yes', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'button label "Back"', renderPath: 'WelcomeWizard → Back button (steps 2 and 3)',
      str: 'Back', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'WIZARD-ARIA-001', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard modal',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'dialog aria-label "Welcome"',
      renderPath: 'WelcomeWizard → <div role="dialog"> aria-label',
      str: 'Welcome', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),

  e({ id: 'WIZARD-ARIA-002', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — close button',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'close button aria-label "Dismiss"',
      renderPath: 'WelcomeWizard → close button → aria-label',
      str: 'Dismiss', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'WIZARD-ARIA-003', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — back button',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'back button aria-label "Previous step"',
      renderPath: 'WelcomeWizard → Back button → aria-label',
      str: 'Previous step', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'WIZARD-ARIA-004', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — step dots',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'step dot button aria-label "Go to step N" (dynamic)',
      renderPath: 'WelcomeWizard → step indicator dots → each dot button aria-label',
      str: 'Go to step N', notes: 'Dynamic — N = step number (1, 2, or 3). Example: "Go to step 2".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'WIZARD-ARIA-005', layer: 'modal', page: 'Welcome Wizard', surface: 'Welcome Wizard — next button',
      comp: 'WelcomeWizard', srcType: 'hardcoded', srcFile: 'components/WelcomeWizard.tsx',
      srcKey: 'next button aria-label — conditional "Next step" / "Enter portfolio"',
      renderPath: 'WelcomeWizard → next/CTA button → aria-label',
      str: 'Next step / Enter portfolio',
      notes: 'Two states: "Next step" on steps 1–2, "Enter portfolio" on step 3.',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 9. FOCUSMODAL.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'FOCUS-001', layer: 'modal', page: 'Focus modal (triggered via "View breakdown →")',
      surface: 'Focus modal — header', comp: 'FocusModal',
      srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx', srcKey: 'header text "Where my time goes"',
      renderPath: 'FocusModal → main heading', str: 'Where my time goes', scope: 'Instance' }),

  e({ id: 'FOCUS-002', layer: 'modal', page: 'Focus modal', surface: 'Focus modal — subheader', comp: 'FocusModal',
      srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
      srcKey: 'subheader text "Approximate focus breakdown across a typical engagement"',
      renderPath: 'FocusModal → subheader / descriptor text',
      str: 'Approximate focus breakdown across a typical engagement', scope: 'Instance' }),
);

const FOCUS_SEGMENTS = [
  { label: 'Writing',           pct: 35,
    body: 'Core of the work. Microcopy, UX flows, product narratives, conversation design — this is where the craft lives.' },
  { label: 'Research',          pct: 20,
    body: 'User interviews, competitive audits, heuristic reviews. Good words come from understanding the problem first.' },
  { label: 'Collaboration',     pct: 20,
    body: 'Working across design, product, engineering, and localization. Content design is a team sport.' },
  { label: 'Prototyping',       pct: 15,
    body: 'Building with words in Figma, testing flows, validating copy in context before it ships.' },
  { label: 'Admin & Automation', pct: 10,
    body: 'Agentic workflows, eval protocols, prompt engineering. Automating the repeatable to protect space for the creative.' },
];

FOCUS_SEGMENTS.forEach((seg, i) => {
  const n = String(i + 1).padStart(3, '0');
  const mismatch = seg.label === 'Admin & Automation'
    ? ['MISMATCH: FocusModal uses "Admin & Automation" but page.tsx FOCUS_LEGEND uses "Automation" — reconcile label']
    : [];
  push(
    e({ id: `FOCUS-SEG-${n}A`, layer: 'modal', page: 'Focus modal', surface: 'Focus modal — segment label',
        comp: 'FocusModal → SEGMENTS', srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
        srcKey: `SEGMENTS[${i}].label`, renderPath: `FocusModal → segment ${i + 1} label + percentage`,
        str: `${seg.label} ${seg.pct}%`, scope: 'Global', extraFlags: mismatch }),
    e({ id: `FOCUS-SEG-${n}B`, layer: 'modal', page: 'Focus modal', surface: 'Focus modal — segment description',
        comp: 'FocusModal → SEGMENTS', srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
        srcKey: `SEGMENTS[${i}].body`, renderPath: `FocusModal → segment ${i + 1} description text`,
        str: seg.body, scope: 'Instance' }),
  );
});

push(
  e({ id: 'FOCUS-ARIA-001', layer: 'modal', page: 'Focus modal', surface: 'Focus modal dialog',
      comp: 'FocusModal', srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
      srcKey: 'dialog aria-label "Focus breakdown"', renderPath: 'FocusModal → dialog aria-label',
      str: 'Focus breakdown', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),

  e({ id: 'FOCUS-ARIA-002', layer: 'modal', page: 'Focus modal', surface: 'Focus modal — pie chart image',
      comp: 'FocusModal', srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
      srcKey: 'Image alt "Focus area breakdown"', renderPath: 'FocusModal → <Image> alt attribute',
      str: 'Focus area breakdown', statusOverride: 'Approved', vis: 'Hidden (alt)', scope: 'Instance' }),

  e({ id: 'FOCUS-ARIA-003', layer: 'modal', page: 'Focus modal', surface: 'Focus modal — close button',
      comp: 'FocusModal', srcType: 'hardcoded', srcFile: 'components/FocusModal.tsx',
      srcKey: 'close button aria-label "Close"', renderPath: 'FocusModal → close button → aria-label',
      str: 'Close', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 10. EXPERIENCEMODAL.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'EXP-MODAL-001', layer: 'modal', page: 'Experience modal', surface: 'Accordion header',
      comp: 'ExperienceModal → accordion', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'accordion title "Work Samples"',
      renderPath: 'ExperienceModal → accordion → "Work Samples" header',
      str: 'Work Samples', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'EXP-MODAL-002', layer: 'modal', page: 'Experience modal', surface: 'Accordion header',
      comp: 'ExperienceModal → accordion', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'accordion title "Impact & Wins"',
      renderPath: 'ExperienceModal → accordion → "Impact & Wins" header',
      str: 'Impact & Wins', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'EXP-MODAL-003', layer: 'modal', page: 'Experience modal', surface: 'Accordion header',
      comp: 'ExperienceModal → accordion', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'accordion title "What I Owned"',
      renderPath: 'ExperienceModal → accordion → "What I Owned" header',
      str: 'What I Owned', scope: 'Global',
      notes: '"owned" is in the editorial review list — but as a section label it is standard PM/UX vocabulary. Likely approve.' }),

  e({ id: 'EXP-MODAL-004', layer: 'modal', page: 'Experience modal', surface: 'Accordion header',
      comp: 'ExperienceModal → accordion', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'accordion title "Tools & Process"',
      renderPath: 'ExperienceModal → accordion → "Tools & Process" header',
      str: 'Tools & Process', statusOverride: 'Approved', scope: 'Global' }),

  // TYPE_META project type labels
  e({ id: 'EXP-MODAL-005', layer: 'modal', page: 'Experience modal', surface: 'Project card — type pill',
      comp: 'ExperienceModal → TYPE_META', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'TYPE_META["ui"].label', renderPath: 'ExperienceModal → ProjectCard → type pill label',
      str: 'UI Copy', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'EXP-MODAL-006', layer: 'modal', page: 'Experience modal', surface: 'Project card — type pill',
      comp: 'ExperienceModal → TYPE_META', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'TYPE_META["flow"].label', renderPath: 'ExperienceModal → ProjectCard → type pill label',
      str: 'Flow', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'EXP-MODAL-007', layer: 'modal', page: 'Experience modal', surface: 'Project card — type pill',
      comp: 'ExperienceModal → TYPE_META', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'TYPE_META["system"].label', renderPath: 'ExperienceModal → ProjectCard → type pill label',
      str: 'System', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'EXP-MODAL-008', layer: 'modal', page: 'Experience modal', surface: 'Project card — type pill',
      comp: 'ExperienceModal → TYPE_META', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'TYPE_META["doc"].label', renderPath: 'ExperienceModal → ProjectCard → type pill label',
      str: 'Document', statusOverride: 'Approved', scope: 'Global' }),

  // CTA
  e({ id: 'EXP-MODAL-009', layer: 'modal', page: 'Experience modal', surface: 'Project card — CTA',
      comp: 'ExperienceModal → ProjectCard', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'ProjectCard CTA "View project →"',
      renderPath: 'ExperienceModal → ProjectCard → "View project →" button',
      str: 'View project →', scope: 'Global',
      notes: 'Inline → in CTA. Confirm character is intentional vs styled icon.' }),

  // No-thumbnail fallback
  e({ id: 'EXP-MODAL-010', layer: 'modal', page: 'Experience modal', surface: 'Project card — thumbnail fallback',
      comp: 'ExperienceModal → ProjectCard',
      srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'no-thumbnail fallback text "Preview pending"',
      renderPath: 'ExperienceModal → ProjectCard → thumbnail placeholder text',
      str: 'Preview pending', scope: 'Global', vis: 'Conditional (no image)',
      notes: 'Shown when project has no thumbnail image.' }),

  // Aria
  e({ id: 'EXP-MODAL-ARIA-001', layer: 'modal', page: 'Experience modal', surface: 'Experience modal dialog',
      comp: 'ExperienceModal', srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'dialog aria-label "{company} details" (dynamic)',
      renderPath: 'ExperienceModal → dialog aria-label',
      str: '{company} details',
      notes: 'Dynamic — "{company}" = company name. Example: "CyberArk details".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),

  e({ id: 'EXP-MODAL-ARIA-002', layer: 'modal', page: 'Experience modal', surface: 'Experience modal — close button',
      comp: 'ExperienceModal', srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'close button aria-label "Close"',
      renderPath: 'ExperienceModal → close button → aria-label',
      str: 'Close', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'EXP-MODAL-ARIA-003', layer: 'modal', page: 'Experience modal', surface: 'Project carousel — scroll left',
      comp: 'ExperienceModal → carousel', srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'carousel left arrow aria-label "Scroll left"',
      renderPath: 'ExperienceModal → project thumbnail carousel → left scroll button',
      str: 'Scroll left', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'EXP-MODAL-ARIA-004', layer: 'modal', page: 'Experience modal', surface: 'Project carousel — scroll right',
      comp: 'ExperienceModal → carousel', srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'carousel right arrow aria-label "Scroll right"',
      renderPath: 'ExperienceModal → project thumbnail carousel → right scroll button',
      str: 'Scroll right', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'EXP-MODAL-ARIA-005', layer: 'modal', page: 'Experience modal', surface: 'Project card — open button',
      comp: 'ExperienceModal → ProjectCard', srcType: 'hardcoded', srcFile: 'components/ExperienceModal.tsx',
      srcKey: 'ProjectCard button aria-label "Preview {title}" (dynamic)',
      renderPath: 'ExperienceModal → ProjectCard → open button aria-label',
      str: 'Preview {title}',
      notes: 'Dynamic — "{title}" = project title. Example: "Preview Microcopy & UX Writing Style Guide".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),

  // ExperienceCard.tsx dynamic aria
  e({ id: 'EXP-CARD-ARIA-001', layer: 'content', page: 'Main page', surface: 'Experience card button',
      comp: 'ExperienceCard', srcType: 'hardcoded', srcFile: 'components/ExperienceCard.tsx',
      srcKey: 'aria-label "View {company} details" (dynamic)',
      renderPath: 'Main page → ExperienceCard → card click button aria-label',
      str: 'View {company} details',
      notes: 'Dynamic — "{company}" = company name. Example: "View Elementor details".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 11. SAMPLEMODAL.TSX — hardcoded strings
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'SAMPLE-001', layer: 'modal', page: 'Sample modal', surface: 'Key decisions section label',
      comp: 'SampleModal → SectionLabel', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'SectionLabel "Key decisions"',
      renderPath: 'SampleModal → "Key decisions" section heading',
      str: 'Key decisions', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SAMPLE-002', layer: 'modal', page: 'Sample modal', surface: 'Impact section label',
      comp: 'SampleModal → SectionLabel', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'SectionLabel "Impact"',
      renderPath: 'SampleModal → "Impact" section heading',
      str: 'Impact', statusOverride: 'Approved', scope: 'Global' }),

  // Empty state
  e({ id: 'SAMPLE-003', layer: 'modal', page: 'Sample modal', surface: 'Sample image empty state — heading',
      comp: 'SampleModal → empty state',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'empty state heading "Visual preview pending"',
      renderPath: 'SampleModal → no-sample placeholder → heading',
      str: 'Visual preview pending', scope: 'Global', vis: 'Conditional (no samples)',
      notes: 'Shown when project.samples is empty or all srcs are blank.' }),

  e({ id: 'SAMPLE-004', layer: 'modal', page: 'Sample modal', surface: 'Sample image empty state — body',
      comp: 'SampleModal → empty state',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'empty state body "Work sample coming soon."',
      renderPath: 'SampleModal → no-sample placeholder → body text',
      str: 'Work sample coming soon.', scope: 'Global', vis: 'Conditional (no samples)' }),

  // TYPE_STYLES labels (defined separately from ExperienceModal TYPE_META but same values)
  e({ id: 'SAMPLE-TYPE-001', layer: 'modal', page: 'Sample modal', surface: 'Project type pill',
      comp: 'SampleModal → TypePill', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'TYPE_STYLES["ui"].label',
      renderPath: 'SampleModal → TypePill → "UI Copy"',
      str: 'UI Copy', statusOverride: 'Approved', scope: 'Global',
      notes: 'Same value as ExperienceModal TYPE_META["ui"].label — defined separately in each component.' }),

  e({ id: 'SAMPLE-TYPE-002', layer: 'modal', page: 'Sample modal', surface: 'Project type pill',
      comp: 'SampleModal → TypePill', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'TYPE_STYLES["flow"].label',
      renderPath: 'SampleModal → TypePill → "Flow"',
      str: 'Flow', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SAMPLE-TYPE-003', layer: 'modal', page: 'Sample modal', surface: 'Project type pill',
      comp: 'SampleModal → TypePill', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'TYPE_STYLES["system"].label',
      renderPath: 'SampleModal → TypePill → "System"',
      str: 'System', statusOverride: 'Approved', scope: 'Global' }),

  e({ id: 'SAMPLE-TYPE-004', layer: 'modal', page: 'Sample modal', surface: 'Project type pill',
      comp: 'SampleModal → TypePill', recurring: 'Yes',
      srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'TYPE_STYLES["doc"].label',
      renderPath: 'SampleModal → TypePill → "Document"',
      str: 'Document', statusOverride: 'Approved', scope: 'Global' }),

  // Aria
  e({ id: 'SAMPLE-ARIA-001', layer: 'modal', page: 'Sample modal', surface: 'Sample modal dialog',
      comp: 'SampleModal', srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'dialog aria-label = project.title (dynamic)',
      renderPath: 'SampleModal → dialog aria-label',
      str: '{project.title}',
      notes: 'Dynamic — equals the project title. Example: "Content Design Framework".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Instance' }),

  e({ id: 'SAMPLE-ARIA-002', layer: 'modal', page: 'Sample modal', surface: 'Sample modal — close button',
      comp: 'SampleModal', srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'close button aria-label "Close"', renderPath: 'SampleModal → close button → aria-label',
      str: 'Close', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'SAMPLE-ARIA-003', layer: 'modal', page: 'Sample modal', surface: 'Image carousel — prev button',
      comp: 'SampleModal → carousel', srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'carousel prev button aria-label "Previous image"',
      renderPath: 'SampleModal → image carousel → prev arrow button',
      str: 'Previous image', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'SAMPLE-ARIA-004', layer: 'modal', page: 'Sample modal', surface: 'Image carousel — next button',
      comp: 'SampleModal → carousel', srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'carousel next button aria-label "Next image"',
      renderPath: 'SampleModal → image carousel → next arrow button',
      str: 'Next image', statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),

  e({ id: 'SAMPLE-ARIA-005', layer: 'modal', page: 'Sample modal', surface: 'Image carousel — dot buttons',
      comp: 'SampleModal → carousel', srcType: 'hardcoded', srcFile: 'components/SampleModal.tsx',
      srcKey: 'carousel dot button aria-label "Go to image N" (dynamic)',
      renderPath: 'SampleModal → image carousel → dot navigation buttons',
      str: 'Go to image N',
      notes: 'Dynamic — N = image number. Example: "Go to image 3".',
      statusOverride: 'Approved', vis: 'Hidden (aria)', scope: 'Global' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 12. ABOUTMODAL.TSX — ORPHANED (not wired in page.tsx)
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'ABOUT-001', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'hardcoded', srcFile: 'components/AboutModal.tsx',
      srcKey: 'eyebrow "Welcome"', renderPath: 'NOT RENDERED — AboutModal not imported/wired in page.tsx',
      str: 'Welcome', vis: 'Hidden (orphaned)', scope: 'Instance',
      notes: 'AboutModal is a complete component but has no trigger in page.tsx. All strings are orphaned.' }),

  e({ id: 'ABOUT-002', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'hardcoded', srcFile: 'components/AboutModal.tsx',
      srcKey: 'body paragraph 1',
      renderPath: 'NOT RENDERED — AboutModal not imported/wired in page.tsx',
      str: "I'm a content designer with 10+ years turning product complexity into language people trust — across SaaS, enterprise security, and AI-native products.",
      vis: 'Hidden (orphaned)', scope: 'Instance',
      notes: 'Contains em dash (—). If component is reactivated, review against WelcomeWizard body for consistency.' }),

  e({ id: 'ABOUT-003', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'hardcoded', srcFile: 'components/AboutModal.tsx',
      srcKey: 'body paragraph 2',
      renderPath: 'NOT RENDERED — AboutModal not imported/wired in page.tsx',
      str: 'This portfolio shows how I work: the decisions behind the words, the systems that scale them, and the craft that holds it together.',
      vis: 'Hidden (orphaned)', scope: 'Instance' }),

  e({ id: 'ABOUT-004', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'hardcoded', srcFile: 'components/AboutModal.tsx',
      srcKey: 'callout text',
      renderPath: 'NOT RENDERED — AboutModal not imported/wired in page.tsx',
      str: 'Select any role card in the experience list to explore impact, ownership, and work samples.',
      vis: 'Hidden (orphaned)', scope: 'Instance',
      notes: 'Closely mirrors page.tsx instruction text ("Select any role to explore..."). Would need alignment if reactivated.' }),

  e({ id: 'ABOUT-ARIA-001', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'AboutModal (orphaned)',
      comp: 'AboutModal (orphaned)', srcType: 'hardcoded', srcFile: 'components/AboutModal.tsx',
      srcKey: 'dialog aria-label "About Tzvi"',
      renderPath: 'NOT RENDERED — AboutModal not imported/wired in page.tsx',
      str: 'About Tzvi', vis: 'Hidden (orphaned)', scope: 'Instance' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 13. STRENGTHTILES.TSX — ORPHANED (not wired in page.tsx)
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'STRENGTH-001', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'StrengthTiles (orphaned)',
      comp: 'StrengthTiles (orphaned)', srcType: 'hardcoded', srcFile: 'components/StrengthTiles.tsx',
      srcKey: 'section heading "Focus Areas"',
      renderPath: 'NOT RENDERED — StrengthTiles not imported in page.tsx',
      str: 'Focus Areas', vis: 'Hidden (orphaned)', scope: 'Instance',
      notes: 'StrengthTiles renders skills.strengths[] (label + description). Component exists but is not used.' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// 14. LIGHTBOX.TSX — ORPHANED (not used anywhere)
// ═══════════════════════════════════════════════════════════════════════════════

push(
  e({ id: 'LIGHTBOX-001', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'Lightbox (orphaned)',
      comp: 'Lightbox (orphaned)', srcType: 'hardcoded', srcFile: 'components/Lightbox.tsx',
      srcKey: 'dialog aria-label "Image viewer"',
      renderPath: 'NOT RENDERED — Lightbox not used anywhere in codebase',
      str: 'Image viewer', vis: 'Hidden (orphaned)', scope: 'Global' }),

  e({ id: 'LIGHTBOX-002', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'Lightbox (orphaned)',
      comp: 'Lightbox (orphaned)', srcType: 'hardcoded', srcFile: 'components/Lightbox.tsx',
      srcKey: 'close button aria-label "Close"',
      renderPath: 'NOT RENDERED — Lightbox not used anywhere in codebase',
      str: 'Close', vis: 'Hidden (orphaned)', scope: 'Global' }),

  e({ id: 'LIGHTBOX-003', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'Lightbox (orphaned)',
      comp: 'Lightbox (orphaned)', srcType: 'hardcoded', srcFile: 'components/Lightbox.tsx',
      srcKey: 'prev button aria-label "Previous"',
      renderPath: 'NOT RENDERED — Lightbox not used anywhere in codebase',
      str: 'Previous', vis: 'Hidden (orphaned)', scope: 'Global' }),

  e({ id: 'LIGHTBOX-004', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'Lightbox (orphaned)',
      comp: 'Lightbox (orphaned)', srcType: 'hardcoded', srcFile: 'components/Lightbox.tsx',
      srcKey: 'next button aria-label "Next"',
      renderPath: 'NOT RENDERED — Lightbox not used anywhere in codebase',
      str: 'Next', vis: 'Hidden (orphaned)', scope: 'Global' }),

  e({ id: 'LIGHTBOX-005', layer: 'orphaned', page: 'N/A (orphaned)', surface: 'Lightbox (orphaned)',
      comp: 'Lightbox (orphaned)', srcType: 'hardcoded', srcFile: 'components/Lightbox.tsx',
      srcKey: 'image alt "Work sample N" (dynamic)',
      renderPath: 'NOT RENDERED — Lightbox not used anywhere in codebase',
      str: 'Work sample N',
      notes: 'Dynamic — N = image index. Example: "Work sample 2".',
      vis: 'Hidden (orphaned)', scope: 'Instance' }),
);

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════════════════════

const csvLines = [csvRow(...HEADER), ...rows];
const outPath  = resolve(ROOT, 'CONTENT_STRING_REVIEW.csv');
writeFileSync(outPath, csvLines.join('\n'), 'utf-8');

// ── Placeholder check (scans only the Current string column, not full row) ────
const BANNED_PLACEHOLDERS = [
  'tooltip body', 'Body para', 'segment body', 'project context',
  '[PLACEHOLDER]', '[TBD]', 'TBD', 'lorem ipsum',
];
const badRows = [];
strLog.forEach(({ id, str }, i) => {
  for (const ph of BANNED_PLACEHOLDERS) {
    if (str.toLowerCase().includes(ph.toLowerCase())) {
      badRows.push({ row: i + 2, placeholder: ph, id, preview: str.slice(0, 80) });
    }
  }
});

// ── Summary ───────────────────────────────────────────────────────────────────
const total = rows.length;
console.log('\n══════════════════════════════════════════════════');
console.log('  CONTENT STRING REVIEW — Extraction complete');
console.log('══════════════════════════════════════════════════');
console.log(`  Total strings:     ${total}`);
console.log(`    ✓ Approved:      ${statusCounts['Approved']     || 0}`);
console.log(`    ⚠ Needs review:  ${statusCounts['Needs review'] || 0}`);
console.log(`    ✗ Revise:        ${statusCounts['Revise']       || 0}`);
console.log('\n  By layer:');
Object.entries(layerCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`    ${k.padEnd(18)} ${v}`));
if (badRows.length === 0) {
  console.log('\n  ✓ No placeholder strings detected.');
} else {
  console.log('\n  ⚠ Placeholder strings found:');
  badRows.forEach(p => console.log(`    ${p.id}: "${p.placeholder}" in: "${p.preview}"`));
}
console.log(`\n  Output: ${outPath}`);
console.log('══════════════════════════════════════════════════\n');
