---
name: visual-artifact
description: Create polished single-file HTML visual artifacts such as reports, dashboards, infographics, one-pagers, slide-like webpages, interactive explainers, microsites, visual summaries, comparison pages, timelines, and interactive previews. Use when the user asks for a beautiful/dynamic webpage-like output, HTML preview, visual report, homepage-like single-file artifact, source/system/product explainer, presentation-style page, screenshot-ready artifact, PDF-ready page, business/research summary, or any reusable visual deliverable intended to be opened in a browser or captured into PPT/PDF.
---

# Visual Artifact

Create browser-native visual deliverables that are polished enough to screenshot, present, print, or convert to PDF/PPT.

## Default output

- Prefer one self-contained `.html` file with inline CSS and JS.
- Use a short purpose-specific kebab-case filename, not `index.html`, unless the user explicitly asks for it or an existing app requires it.
- Keep dependencies minimal. Use no CDN when CSS/SVG is enough; use CDN libraries when they materially improve the result.
- Make the artifact readable in a constrained iframe and in a normal browser window.
- Do not include secrets or unsanitized user-provided HTML.

## Decide the artifact type

- **Executive/report page**: structured findings, tables, charts, recommendations, sources.
- **Dashboard**: KPI cards, charts, filters/toggles if useful, data table.
- **Infographic/one-pager**: strong story flow, big numbers, compact sections, print/capture-ready layout.
- **Slide-like HTML**: 16:9 sections, keyboard or scroll navigation only if useful.
- **Interactive explainer / microsite**: homepage-like narrative artifact for unpacking a product, source codebase, system, process, or research topic with hero context, metrics, section navigation, diagrams, and lightweight interactions.
- **Diagram/timeline/comparison**: SVG, Mermaid, or HTML/CSS layouts depending on complexity.

## Design bar

- Aim for “usable in a real meeting,” not merely “AI-generated.”
- Use restrained business styling: clear type scale, tight spacing, meaningful hierarchy, and a purposeful palette.
- Avoid defaulting to flat white/gray report pages. Add controlled visual richness with subtle gradients, tinted section bands, fine borders, quiet shadows, and accent lines when they improve scanability.
- Gradients are welcome when they carry structure: report covers, executive summary bands, KPI strips, section headers, risk/severity zones, chart context backgrounds, or transitions between dense sections.
- Default to a clean light theme for work/business artifacts unless the user asks for dark mode or the subject strongly calls for it.
- Avoid oversized radii, pill-heavy cards, loud full-page gradients, low-contrast gradient text surfaces, and bloated padding unless requested.
- Prefer 4–8px radius for panels/cards/buttons.
- Use exact tables for exact values; use charts for trends, comparisons, proportions, timelines, or distributions.
- Use accessible contrast and semantic HTML.

## Design autonomy

- For visual reports, do not ask the user to choose colors, layout style, or decorative direction by default. Infer an appropriate design direction from the audience, subject, data density, and intended use.
- Ask questions only when missing information would change the content, factual scope, or required deliverable. Do not ask merely to choose between visual treatments.

## Theme and palette

- Default to a polished light theme for business, office, executive, reporting, and presentation artifacts.
- Dark themes are allowed when the user asks for them, the subject clearly benefits from a dark presentation surface, or the artifact is more cinematic/demo-like than office-report-like. When using a dark theme, keep it legible on projectors and screenshots, and provide print-safe styling.
- Use a small but expressive palette: neutral base, 1-2 accents, and semantic colors for status, risk, or category. Avoid dull gray-only, muddy low-chroma, all-slate, all-brown, or accidentally monochrome pages unless the subject explicitly calls for that mood.
- Keep surface colors cohesive. Tables, cards, chart panels, callouts, and section bands should feel derived from the same palette, with compatible hue temperature, saturation, and lightness.
- Do not drop in generic cool gray, blue-gray, or beige table fills when the surrounding palette has a different temperature or emotional tone. Use true neutrals or gently tinted neutrals that harmonize with the accent system.
- Header fills, row dividers, badges, and chart backgrounds should look intentionally related to the report's color system, not imported from another template.

## Report design directions

- Before writing CSS, silently choose a design direction that fits the request. Do not ask the user to pick one.
- Examples: boardroom brief with a crisp light surface, executive band, KPI strip, and restrained accent gradient; analytical report with wide charts, clean grid, precise tables, and data-led color; strategy memo with editorial rhythm, strong callouts, and comparison blocks; risk review with severity zones, mitigation matrix, and action register; market scan with richer accents, source cards, trend panels, and ranked findings; technical explainer with diagrams, dependency maps, and compact evidence sections.
- Avoid producing a report that is only a vertical stack of similar white cards. A polished report should usually include at least three distinct section treatments, such as a summary band, KPI strip, wide chart section, matrix, timeline, recommendation panel, or compact table block.

## Text contrast rules

- Define text colors per surface (`--text`, `--muted`, `--subtle`) instead of reusing one generic gray across light, dark, gradient, and image-backed sections.
- Body, metadata, captions, chart labels, table text, and KPI labels must meet WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large/display text. Important subtitles and executive summaries should target 4.5:1 even when large because they carry meaning.
- On dark, saturated, gradient, or image-backed surfaces, do not use low-alpha gray text such as `rgba(..., .35)` to `rgba(..., .55)` for meaningful copy. Use a lighter muted token, add a subtle scrim/solid overlay, or simplify the background until the text reads clearly.
- Do not dim meaningful text with `opacity` on the text element or parent container to create hierarchy; choose an explicit accessible color. Reserve opacity-based dimming for disabled or decorative elements.
- Before delivery, inspect hero subtitles, section descriptions, captions, legends, footnotes, and metadata in both iframe-sized and normal browser widths. If secondary text is merely "technically present" but hard to read in a screenshot, raise contrast before shipping.

## Minimum type sizes

- Treat these as default lower bounds for rendered CSS text at 100% browser zoom: body copy `16px`; table text and chart labels `14px`; captions and metadata `13px`; card and KPI labels `13px`; section headings `24px`; page titles `36px`.
- For presentation-style or 16:9 slide-like artifacts, keep body copy at least `20px`. Use at least `18px` only when the content genuinely requires a denser layout and remains readable in the intended capture or projection size.
- Do not reduce text below these bounds merely to fit more content. First simplify wording, widen the content area, reduce columns or decorative spacing, allow wrapping, increase chart height, or split content into additional sections/pages/slides.
- Responsive layouts must preserve the same minimum sizes. Reflow grids and tables instead of shrinking type on narrow screens or constrained iframe previews.
- Apply the bounds to text rendered by chart libraries, SVG, canvas, and generated legends/tooltips as well as ordinary HTML. Do not rely on browser or library defaults when they render smaller text.
- A user-requested exact template or explicitly smaller type may override these defaults, but verify readability at the final viewport, screenshot, print, or projection size and disclose any intentional exception.

## Report chart layout

- Make charts earn the available space. Primary report charts should usually span the main content width, not sit in narrow cards that leave large empty side gutters.
- Use a practical report content width for chart-heavy artifacts, typically `max-width: 1120px` to `1280px` with responsive side padding. Avoid constraining chart sections to article-text widths unless the artifact is mostly prose.
- Treat the main chart area as a section, not a decorative card. If a chart needs notes, filters, or a legend beside it, use a wide two-column layout only when the chart column remains dominant, such as `minmax(0, 2fr) minmax(260px, 1fr)`.
- For multiple charts, use responsive grids like `repeat(auto-fit, minmax(340px, 1fr))` and let important charts span all columns. Do not force two or three columns when each chart becomes cramped.
- Give chart containers explicit dimensions: `width: 100%`, stable `min-height`/`height` appropriate to the data, and `min-width: 0` inside CSS grids. For ECharts/Chart.js, initialize after layout and call resize on window changes.
- On mobile and narrow iframe previews, collapse chart grids to one column and preserve readable axis labels rather than shrinking the plot into unusable space.
- Before delivery, inspect whether the plotted area uses the available width. If a report chart occupies less than roughly two-thirds of a wide section while unused whitespace remains, revise the layout.

## Library choices

- **ECharts**: multi-chart business dashboards/reports.
- **Chart.js**: simple common charts.
- **SVG/CSS**: small bespoke charts, diagrams, cards, timelines.
- **Mermaid**: maintainable flowcharts/architecture diagrams.
- **Reveal.js**: full HTML slide decks.
- **Three.js/D3/Leaflet**: only when 3D, advanced data visualization, or maps are central.

## Workflow

1. Infer audience, output type, size target, and reuse goal. Ask only if ambiguity risks the wrong content, factual scope, or deliverable.
2. Structure the content before styling: sections, data, charts, interactions, export needs.
3. Choose a visual concept: report direction, palette, section rhythm, data density, and where gradients, color planes, or depth will add meaning.
4. Build the single HTML artifact with responsive CSS and print/capture considerations.
5. Include `@media print` for PDF-friendly output when the artifact is report-like or slide-like.
6. If the user wants screenshots/PDF, use the `playwright-capture` skill after creating the HTML.
7. For important or dense visuals, use the `visual-review` skill to inspect clipping, overflow, chart labels, and print layout.

## Capture-friendly conventions

- For presentation-style output, include a `.stage` or `.slide` layout with 16:9 ratio when appropriate.
- For reports, make A4/Letter print behavior explicit with sensible page breaks.
- Avoid content that depends on hover-only interactions for core meaning.
- Keep animations subtle and disable or simplify them for print.

## Microsite conventions

- Use this mode for single-file explainers that feel like a polished homepage but are still an artifact, not a full production website.
- Put the subject in the first viewport with a clear title, concise promise, and real content signals such as metrics, source links, or navigation anchors.
- Build sectioned exploration: overview, architecture/process, key components, catalog/details, and caveats/sources as appropriate.
- Use animation as a first-class storytelling layer when it helps the artifact feel alive: staged reveals, step-through diagrams, subtle motion between states, scroll-linked highlights, progress indicators, or animated data transitions.
- Keep interactions lightweight and resilient: tabs, filters, step-through diagrams, expandable details, or scroll-linked highlights. Avoid interactions required to understand the core narrative.
- Prefer subtle, professional motion over spectacle. Respect `prefers-reduced-motion` and keep print/PDF output static and readable.
- If the request needs SEO, routing, persistent backend state, authentication, or deployment-oriented app structure, use a frontend app/site skill instead of this single-file artifact skill.

## References

- Read `references/design-checklist.md` when polishing a high-stakes visual, report, dashboard, or presentation artifact.
