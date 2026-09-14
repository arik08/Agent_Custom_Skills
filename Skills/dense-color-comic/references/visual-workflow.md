# Dense Color Comic Visual Workflow

## Outcome

Produce a full-color comic that feels as dense and deliberate as a high-quality black-and-white manga: decisive darks, tactile ink detail, dramatic focal lighting, varied panel rhythm, environmental storytelling, readable dialogue, and controlled color. The result must not look like a pale corporate webtoon or an infographic with character stickers.

## 1. Script and dialogue lock

Before generating, prepare a panel ledger with:

- panel purpose and visual beat;
- speaker and visible listener;
- exact dialogue or caption;
- speech register and emotional subtext;
- required prop, evidence, diagram, or screen;
- transition to the next panel.

Keep balloons short enough to read at presentation distance. Prefer one idea per balloon and usually one or two short lines. Split technical exposition across dialogue, reaction, props, captions, and diagrams instead of filling one balloon with a paragraph.

The dialogue is part of the composition, not post-production copy. The model must know the final wording while choosing the speaker's expression, gesture, balloon size, tail direction, empty space, and panel crop.

## 2. Single-pass color, monochrome-manga logic

Do not render a monochrome page and colorize it later. Instead, plan the final color image as though an expert manga artist had already solved the page in ink:

- establish three clear value bands: deep blacks, structural midtones, and protected whites;
- reserve the darkest masses for focal depth, night interiors, clothing, furniture, machinery, or dramatic backgrounds;
- use crosshatching, dry-brush texture, controlled speed lines, paper and office detail, rim light, and selective bloom where narratively motivated;
- let quiet panels breathe while keeping hero panels visually rich;
- keep faces, hands, key props, and dialogue readable against the dense background;
- use color to separate story information, not to replace value contrast.

Suggested palette: black, graphite, deep navy, steel blue, cool white, natural skin tones, and restrained cyan/teal or coral accents. A night-office palette is preferred when it supports the story, but scene logic has priority. Avoid beige or sepia casts, washed-out pastel fills, glossy photorealistic skin, and romance-cover glamour.

Useful style phrasing:

> Finished full-color Korean office manga with the density of premium black-and-white serialized manga: bold ink hierarchy, detailed environments, deep navy-black shadows, crisp white speech balloons, restrained cool color, dramatic but readable lighting, expressive reaction panels, and cinematic focal scenes. Design the page in monochrome values internally, but output only the final color artwork.

## 3. Two-page spread contract

- Canvas: 1920x1080, 16:9.
- Treat the canvas as an open book with left and right pages.
- Reading order: finish the left page, then read the right page.
- Use horizontal and vertical 90-degree rectangles for ordinary dialogue and process scenes, but treat them as a readable baseline rather than a rigid grid.
- Vary panel size and aspect ratio. Contrast one large anchor scene with smaller reaction, evidence, close-up, or transition panels so the page does not become a uniform wall of boxes.
- Use diagonal borders for a motivated discovery, collision, rapid motion, decisive gesture, surprise, emotional rise, or climax. Usually use 0-1 diagonal transition per page and at most two; do not tilt every row or panel.
- A speech balloon may cross an internal panel border when it improves dialogue overlap, emphasis, or eye flow. It must remain on the same page and keep an unambiguous tail.
- A head, hand, body part, prop, sound effect, or motion line may break an internal panel frame at a key moment. Use this selectively for visual force, never as decoration on every panel.
- Give each page at least one strong anchor panel; use smaller reaction or evidence panels around it.
- Typical total: roughly 6-9 panels, adjusted to the script rather than forced into a fixed grid.
- Keep balloon tails unambiguous and balloons close to their speakers without covering faces, hands, or evidence.

Internal panel borders are flexible storytelling devices; the center gutter is not. The center gutter is an absolute hard boundary. Keep visible white safety space on both sides. Nothing may touch or cross it, including hair, hands, shadows, speed lines, balloon tails, and decorative effects. Never direct a frame-breaking element toward the gutter and do not use a panorama across both pages.

Include this in generation prompts:

> Treat the 16:9 canvas as an open two-page comic spread. Finish the left page before reading the right page. Use horizontal and vertical 90-degree rectangular panels as the readable default, but avoid a monotonous uniform box grid. Vary panel scale and rhythm. Use diagonal panel edges for motivated dynamic moments. Speech bubbles and key characters, hands, props, or effects may selectively cross an internal panel border when useful, but must remain inside the same page. The vertical center gutter is an absolute hard boundary: no panel, person, body part, object, speech bubble, tail, effect line, shadow, or decoration may touch or cross it.

## 4. Integrated text contract

Generate the art and all visible language together. This includes title lettering, speech balloons, captions, labels, diagram text, interface-like cards, and sound effects.

For every text element, provide the exact string in quotation marks and bind it to a panel and speaker. Ask for Korean glyphs that are large, high-contrast, correctly spaced, and centered within naturally shaped balloons. Provide fewer, shorter text elements rather than shrinking type.

Forbidden workflows:

- generating empty speech balloons and adding text later;
- generating art first and overlaying captions afterward;
- covering incorrect text with a rectangle and replacement text;
- placing detached text near a character without a clear tail;
- accepting gibberish because the rest of the picture looks good.

When a typo occurs, regenerate the whole spread when errors are systemic. For an isolated error, redraw the complete affected panel or region so background, character acting, balloon, tail, and corrected text are regenerated as one visual unit. A later overlay is not an acceptable repair.

## 5. Character continuity

Use the most current approved identity sheet for every recurring character. State `identity reference`, `supporting cast reference`, or `style reference` explicitly. Preserve face shape, hair silhouette, age, body type, outfit, badge, and role across panels and spreads.

Vary camera distance and expression without redesigning the cast. Supporting characters must not inherit the protagonist's face. Match posture to hierarchy: a mentor may lean in or point casually; a junior may listen, question, or confirm without becoming timid or childlike.

## 6. Prompt assembly template

```text
Create one finished 1920x1080 full-color two-page instructional comic spread.

STORY PURPOSE
[One-sentence message and emotional turn.]

STYLE
[Use the ink-forward full-color manga phrasing above.]
This is a direct final-color generation. Internally use black-and-white manga value logic, but do not output a monochrome intermediate and do not colorize a previous grayscale page.

REFERENCES
- Image 1: [character] identity reference.
- Image 2: [character] supporting cast reference.
- Image 3: approved dense-color comic style reference.
- Image 4: two-page layout reference.

LAYOUT
[Describe left-page panels, then right-page panels.]
[Include the hard center-gutter paragraph.]

EXACT INTEGRATED TEXT
- Left panel 1, [speaker]: "[exact dialogue]"
- Left panel 2, caption: "[exact caption]"
- Right panel 1, [speaker]: "[exact dialogue]"
[Continue only for essential visible text.]
Render every quoted string inside the artwork during the same generation. Match acting, balloon size, and tail direction to the text. No empty balloons and no post-added text.

CHARACTER ACTING AND REGISTER
[Identity, relationship, posture, emotional subtext, honorific/casual register.]

AVOID
[Project-specific prohibitions, factual inventions, character drift, gutter crossing, washed-out color, photorealism, and text overlays.]
```

## 7. Visual QA

Inspect every spread at full size and as a thumbnail.

- Exact text: spelling, spacing, punctuation, speaker, and register are correct.
- Integrated composition: balloons feel native to the art and tails point to the correct speaker.
- Reading flow: the left page finishes before the right page; panel order is obvious.
- Layout expressiveness: panel sizes vary, diagonals have a story reason, and selective internal frame-breaking adds emphasis without becoming a repeated gimmick.
- Gutter: no contact or crossing at the center.
- Density: hero panels contain meaningful environment and evidence detail; small panels add reaction or progression.
- Value: the story remains readable when mentally reduced to grayscale.
- Color: accents guide attention without flattening the ink hierarchy.
- Identity: face, hair, age, build, and clothing remain consistent.
- Facts: every label, number, screen, and result comes from the supplied script or source.
- Series rhythm: successive spreads vary composition while retaining the same visual contract.

If any item fails, regenerate before calling the spread complete.
