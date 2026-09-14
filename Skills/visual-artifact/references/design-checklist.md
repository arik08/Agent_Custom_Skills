# Design Checklist

Use this checklist before final delivery of a visual HTML artifact.

## Content

- The first screen communicates the purpose immediately.
- Exact values are shown in tables or labels, not only visual marks.
- Every chart has a title, units, and readable labels.
- The artifact has a clear ending: conclusion, recommendation, next steps, or source notes.

## Layout

- No accidental horizontal scroll at desktop or mobile widths.
- Cards in the same row align consistently.
- Major sections have enough contrast without looking like unrelated templates.
- Dense information uses tables, small multiples, or grouped sections instead of giant cards.
- Primary report charts use the main content width and are not trapped in narrow cards with large unused gutters.
- Chart grids keep each chart readable: important charts span full width, supporting charts use responsive `minmax` columns, and narrow previews collapse to one column.
- Chart containers have explicit width and height/min-height, with no CSS grid/flex constraints causing canvas or SVG elements to shrink unexpectedly.

## Style

- The artifact is light-first unless a dark theme is clearly justified by the request or subject.
- Palette is purposeful, expressive enough for the topic, and not dull gray-only, muddy, or accidentally monochrome.
- Tables, cards, charts, callouts, and section bands share a coherent color system; no surface looks like it came from a different template.
- Neutral fills and dividers match the palette temperature and saturation instead of defaulting to unrelated gray, blue-gray, beige, or washed-out colors.
- The artifact does not read as a flat stack of white cards; key report moments use purposeful depth, color planes, accent lines, or subtle gradients.
- Gradients and color washes are structural, not decorative noise: they support hierarchy, grouping, severity, or section transitions.
- The page does not rely on repeated identical cards for every section; major sections vary rhythm through scale, color plane, chart/table treatment, or callout structure.
- Typography uses a small scale: title, section heading, body, caption.
- Rendered type respects the default lower bounds: page title `36px`, section heading `24px`, body `16px`, table/chart labels `14px`, and captions/metadata/KPI labels `13px`; presentation body is `20px` or at least `18px` only for a verified dense layout.
- Narrow screens, dense tables, and constrained iframe previews reflow or split content instead of shrinking text below the lower bounds.
- Text colors are checked per surface, not globally: normal text reaches at least 4.5:1 contrast and large/display text reaches at least 3:1.
- Muted/secondary copy on dark, saturated, gradient, or image-backed sections remains visibly readable; no meaningful text relies on low-alpha gray or parent opacity.
- Borders/shadows are subtle.
- Radii are restrained unless a soft style was requested.

## Export

- Print/PDF styles preserve hierarchy and avoid awkward page breaks.
- Important content is visible without relying on hover, animation, or collapsed panels.
- Dark backgrounds print acceptably or switch to a print-safe theme.
