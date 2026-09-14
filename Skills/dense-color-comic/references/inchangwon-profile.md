# Inchangwon Lecture Comic Profile

Use this bundled office-comic cast and visual profile by default, including outside the original repository. A user-supplied cast or style overrides the relevant defaults. Read paths relative to the skill root, never the current working directory.

## Required reading and visual inspection

Read `references/characters.md`, `references/layout.md`, and `references/preferred-selections.md`. For new or revised character sheets, also read `references/character-prompts.md`.

Before generation, actually open:
- The CAST-00 current sheet in `assets/characters/` and the current sheet for each appearing supporting character, as named in `references/characters.md`.
- Both images in `assets/layout/`: the FHD spread controls page geometry; the portrait source controls reaction and dialogue rhythm only.
- `assets/style/skill-creation-comic-source-montage-v9-color-dialogue.png` and a relevant representative spread (01, 06, or 08) from that folder.
- Relevant approved images in `assets/preferred/`, selected through `references/preferred-selections.md`; inspect all for a whole-deck consistency contract.

The v9 pages control ink density, lighting, dialogue integration and dramatic rhythm, never current identity or factual content. The layout image controls reading flow, never a fixed grid. Style samples may have imperfect gutters or older faces: the written gutter rule and current character sheets take priority. Use cool white as the base; darker office scenes are appropriate when the story calls for them.

In the source lecture repository, read its current AGENTS.md and matching current reference indexes first; newer project rules and current sheets override this bundled snapshot. Outside it, all required defaults are included here. Do not search the original repository or output history to make this skill work.

## Character contract

### Protagonist, CAST-00

- Friendly, unpretentious Korean male office worker in his 30s.
- Soft oval face, natural cheeks and jaw, realistically sized calm eyes, natural black fringe.
- Light-blue or white shirt, navy slacks, employee badge.
- Do not beautify him into a celebrity, romance-cover lead, sharp V-line hero, or muscular action character.
- Use 5-head proportions for humorous failure, surprise, and discovery; use natural 7.4-head proportions for ordinary office, analysis, reporting, and mentoring scenes.

### Team-lead mentor, CAST-08

- Korean male working team lead or senior practitioner in his 40s, not an executive or CEO.
- Salt-and-pepper swept-back short hair, broad calm face, navy casual work jacket, white shirt, employee badge.
- Practical, warm, observant, and direct. Avoid authoritarian posing or luxury executive styling.

## Dialogue hierarchy

Choose speech level from the relationship, age and rank difference, familiarity, organizational culture, and the formality of the scene. No character has one absolute speech level for every conversation.

- The team-lead mentor generally speaks down comfortably to the protagonist: natural 해체 or mildly mixed speech such as `그렇지`, `해봐`, `남겨봐`, `되는 거야`, `됐지?`, `이제 시작이야`. He may use questions and short guidance rather than commands. Do not make him insulting, contemptuous, threatening, or excessively authoritarian.
- The protagonist uses natural everyday honorifics toward the older team-lead mentor: `그럼 뭘 남겨야 하죠?`, `이렇게 하면 될까요?`, `알겠습니다`, `해볼게요`, `맞나요?`. Perfect formal `-습니다` speech is not required in every balloon; ordinary `-요` and `-죠` forms are preferred.
- Do not generalize that mentor-junior pattern to every scene. With colleagues, the protagonist and the other person may use workplace honorifics, mixed polite speech, or comfortable casual speech according to their established relationship. Colleagues may absolutely speak politely to each other; equal rank does not imply banmal.
- With a close colleague or a junior, casual speech is allowed only when the script or relationship supports it. Do not force banmal merely because the characters are peers, and do not force honorifics merely because the protagonist is speaking.
- When the relationship is unspecified, use neutral workplace politeness as the safe default and keep both speakers' register mutually coherent.
- Preserve the mentor-protagonist asymmetry when they speak to each other. In group presentations or formal meetings, raise the register as the situation requires without erasing role hierarchy.

Example pair:

- Mentor: `요청문 말고, 일하는 방법 자체를 남겨봐.`
- Protagonist: `그럼 기준과 예외까지 적어야 하죠?`

## Visual and color contract

- Premium Korean office manga, not a photo and not a pale pastel explainer.
- Ink-forward, high-density composition modeled on `v9-color-dialogue`: deep navy-black shadows, cool night-office depth where suitable, detailed papers and work surfaces, crisp white balloons, strong reaction cuts, speed lines or glow only when motivated.
- Keep the project layout contract expressive: rectangles provide reading stability, while motivated diagonals and selective same-page frame-breaking by characters, hands, props, effects, or balloons create emphasis. Never let those elements touch or cross the center gutter.
- Keep the core palette cool white, graphite, deep navy, steel blue, natural skin tones, limited teal and coral.
- Use the project's approved preferred-materials library for color balance, information density, and character treatment, but never duplicate the same diagrams or layout across all pages.

## Text generation contract

This project requires artwork and Korean text to be generated together. Do not follow the older plan's instruction to generate empty text areas and add Korean later. That step is superseded by this skill and the user's latest direction.

- Finalize exact Korean dialogue before generation.
- Put the exact dialogue, speaker, panel, and register in the prompt.
- Generate title, speech balloons, captions, diagrams, and their text as one finished image.
- If Korean text is wrong, regenerate the affected spread or redraw the entire affected panel with the text integrated. Never overlay corrected text afterward.

## Project-specific QA

- All final spreads are 1920x1080.
- Central gutter is untouched.
- Text is correct and readable at lecture distance.
- Mentor and protagonist register follows the hierarchy above.
- Current character sheets, not older output history, control identity.
- No unsupported company UI, facts, achievements, numbers, or system access claims appear.
- New versions use distinct filenames and never overwrite approved reference images.
