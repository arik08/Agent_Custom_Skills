---
name: dense-color-comic
description: Create or revise dense full-color instructional comics and 16:9 two-page comic spreads using ink-forward manga composition, integrated speech-bubble text, and consistent recurring characters. Includes bundled character sheets, panel-layout and style references. Use for 만화, 코믹, 교육 만화, comic slide, 양면 펼침, or v9-color-dialogue style requests; do not use for ordinary non-comic slides.
metadata:
  short-description: Dense color comics with integrated dialogue
---

# Dense Color Comic

Create finished color comics with the information density and dramatic value structure of a carefully inked black-and-white manga. Do not create a monochrome intermediate; apply that design logic inside each final-color generation.

## Self-contained reference package

This folder includes the current 10-character cast, two layout/rhythm references, four v9 style samples, and seven user-selected visual references. Copy the entire `dense-color-comic/` folder to reuse it; copying SKILL.md alone loses the images. All paths are relative to this skill directory.

1. Read [references/visual-workflow.md](references/visual-workflow.md) for each comic task.
2. Read [references/inchangwon-profile.md](references/inchangwon-profile.md) for the bundled default cast, visual references and relationship-sensitive Korean dialogue. Follow its image-opening instructions before generation.
3. Current user instructions and supplied script take priority. For a different requested cast, style or format, replace only those defaults; do not impose the lecture story on unrelated work.
4. [references/asset-manifest.json](references/asset-manifest.json) records source paths and SHA-256 for the bundled images. Source paths are provenance, not runtime dependencies. Preserve approval statuses in the cast and preferred-selection indexes.

## Generation and delivery

Use an available image-generation/editing tool that accepts reference images and integrated text. Inspect local reference images before attaching them; explicitly label identity, supporting cast, layout and style roles. Use the tool's supported reference mechanism. If no image tool is available, provide the script and generation prompt and clearly state that artwork was not generated.

Save the panel ledger, exact generation prompt and versioned final image in the user's output location (default `output/comic/<topic>/`). Never overwrite reference assets. Request 1920x1080 for default FHD spreads and verify actual dimensions; if the generator returns a different size, report it and obtain the requested canvas using supported image generation/editing. Do not assert FHD from the prompt alone. Inspect text and layout again after any correction. A request to create or update this skill does not itself require a paid sample-image generation.

## Workflow

1. Lock the message, exact dialogue, speaker, register, and reading order before image generation. Shorten wording only with the user's consent or when meaning is preserved and no exact wording was supplied.
2. Design each 16:9 spread as two independent pages with a hard center gutter. Use rectangular panels as a readable baseline, not a rigid box grid: vary panel size, use motivated diagonals, and allow limited internal frame-breaking by a character, prop, effect, or balloon when it strengthens the scene. Give each page one dominant scene and supporting action, reaction, evidence, or detail panels. Vary the rhythm across spreads.
3. Build a value-first scene plan: clear black/white separation, ink texture, environmental detail, selective speed lines, and strong focal lighting. Then assign a restrained color script without weakening the value hierarchy.
4. Generate each spread directly as finished color artwork. Generate artwork, characters, speech balloons, exact dialogue, captions, labels, and sound effects together in the same image operation.
5. Use character sheets as identity references and prior approved comic pages as style references. State each reference's role explicitly in the generation prompt.
6. Inspect the actual output at full size. Check dialogue accuracy, speaker attribution, page order, gutter clearance, character identity, density, and legibility.
7. If text is wrong, regenerate the affected spread or redraw the affected panel with its art, balloon, and text together. Never patch a blank balloon with a later text layer and never place replacement text over existing artwork.

## Non-negotiable constraints

- No blank-balloon-first or art-first/text-later workflow.
- No separate monochrome image followed by automatic colorization.
- No center-gutter contact or crossing by panels, people, balloons, tails, props, effects, shadows, or decoration.
- No invented facts, product UI, numbers, achievements, or company details.
- No repeated template across every spread; preserve narrative variety.
- No claim of completion until the final rendered images have been visually inspected.

Treat “single pass” as one finished-color generation per spread, not one call for an entire book. Establish the series contract once, then generate and verify spreads individually so dialogue and character continuity remain controllable.
