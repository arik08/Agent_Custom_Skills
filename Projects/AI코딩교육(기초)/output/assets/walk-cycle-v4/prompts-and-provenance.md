# Walk cycle v4: original character proportions

Generated with built-in image_gen image editing. v3 is superseded: its body proportions were too tall and thin. All drawing edits redraw complete figures. Technical packing only extracts, uniformly scales and aligns complete figures; no isolated feet or legs are drawn or attached.

## References and output

- Male identity: input/walk-character-identity-reference.png (user supplied rounded chibi male).
- Female identity: existing employee-b original first-row standing sprite.
- Motion only: input/walk-cycle-eight-poses-reference.png, retained via the v3 pose strips.
- Saved sources: employee-a-source.png, employee-b-source.png.
- Runtime assets: employee-a-walk.png, employee-b-walk.png (1024x512, eight whole-body cells).
- Generated male source: exec-09f16388-0f40-4d80-a461-6f8d2c588707.png.
- Generated female source: exec-95be1300-2f65-48d3-bf06-3f760e699116.png.

## Male edit prompt

EDIT IMAGE1 ITSELF. Retain its ONE ROW of8 walking poses exactly, especially different arm swings and different supporting legs in frames1 and5 and different passing legs3 and7. Do not replace its poses with image2's repeated poses. Image2 is a character-model proportional reference ONLY. Transform image1's thin character into image2's STOCKY CHIBI proportions. Enlarge the head relative to body until full height is only2.5 head-heights. Shorten legs and arms about25%, broaden the torso/jacket20%, make hands/shoes chunky and rounded. Change proportions as a complete coherently redrawn body, not by stretching/compositing any isolated parts. Same smooth sidepart hair, oval eyes, rounded cheeks, navy jacket, teal ID, charcoal straight loose trousers, brown shoes as image2. The end result must have the big round head, compact rounded torso, short sturdy legs and overall broad silhouette of image2. NO long slim adult proportions. Preserve image1's complete8-phase motion geometry as relative JOINT ANGLES and support/swing roles while shortening the limb lengths. Its feet must still alternate left-right and its near arm must swing back in first half and forward in second half. All8 fullbody figures, one row, consistent scale and foot baseline, enough margin that nothing clips/touches. Transparent alpha, no text or ground. This is a proportional model correction of image1, not a new generic walk-cycle generation.

## Female edit prompt

EDIT IMAGE1 ITSELF: retain its exact eight walking poses and order, correct supporting-leg alternation and opposing arm swing. Its tall thin female proportions are WRONG. Transform her into the SAME SHORT ROUND CHIBI woman in the FIRST ROW of IMAGE2. Image2 controls face/body identity; image3 shows the desired matching chibi proportions of her male colleague, NOT a replacement person. BIG warm brown bob head and rounded cheeks, brown eyes, cream softly rounded blazer, teal ID lanyard, navy relaxed straight trousers, chunky brown low shoes. Full height ONLY2.5 head heights, head38-40% of full-body height and broad, short stocky torso, short thick arms, short sturdy legs. No long thin adult/fashion-model body or tiny head. Preserve her original feminine identity, hair silhouette, clothing palette. Change image1's body proportions coherently while retaining its pose JOINT ANGLES and which foot is planted/lifted in ALL8 frames. Shortened limb lengths must keep contact/down/passing/up phases from image1, not imitate image2's old repeated walking poses. Whole-body redraw only, no pasted head/legs/feet, no simple horizontal stretch. One horizontal strip of eight same-size complete figures facing right with generous margins, no clipping/touching. Transparent alpha, no labels/ground. Keep the original chubby large-headed visual identity from image2 FIRST ROW. The previous skinny version is unacceptable; this must look like the same woman as her original standing pose.

## Validation

Both embedded cover asset paths synchronized. Actual-deck browser check: both humans displayed cells0-7; no bad foot heights, asset-load failures or page errors. Comparison screenshot reviewed alongside original standing figures. This verifies rendering and frame selection; visual anatomy is assessed by image review, not the automated assertions. Existing standing/work assets remain unchanged.
