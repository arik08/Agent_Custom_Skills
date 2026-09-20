# Animated cover verification
- Inspected 1440x810 screenshot diorama-cover.png: title, schedule, labels, and office scene do not overlap or clip.
- Deck still contains 31 slides. ArrowRight changed current from 0 to 1; Home returned to 0.
- Embedded scene status: ready=true, loaded=true. On first slide paused=false; on next slide paused=true; after Home paused=false.
- Scene time advanced before leaving first slide. No browser errors after reload and navigation.
- All image and engine resources embedded inside presentation HTML; no separate scene file required at playback.
- Existing PDF not regenerated. The diorama uses the current eight-frame artwork; this integration does not change its gait quality.
