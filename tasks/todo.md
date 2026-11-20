# Face tracker v4: fine-detail scan

- [x] Skin spots: detect, size (mm), number, log, remember between sessions (NEW flag)
- [x] Mouth: teeth, tongue, tooth gems
- [x] Eyebrows: traced line, tilt / arch / tail angles, length, thickness, slits
- [x] Moustache / beard coverage, moustache band height, head-hair extent
- [x] Daily growth log (browser storage) with CSV export
- [x] Camera picker for external webcams, 1080p request, zoom slider when supported
- [x] Move face tracking to MediaPipe Tasks (the legacy library could not share a page with the hair segmenter)
- [ ] Next (requested): objects in the vicinity, outfit + shopping links, haircut freshness, durable log location

## Review

Verified in headless Chromium with real models on photo feeds:
- 4 painted test spots (2.0–3.6 mm) all found, sized within ~0.5 mm; clean face shows 3 marks (nose ring, freckles).
- Painted brow slit → "1 slit" on the correct brow; brow line traced smoothly; glasses correctly suppress slit reports.
- Painted moustache → 100 % coverage, 9 mm band; real bearded man → moustache 99 %, beard 97 %; clean face → none.
- Painted tooth gem → GEM ×1; same photo without it → none.
- Hair measured (and flagged "≥" when it runs off the top of the frame).
- Glasses 96 %, beard 74 % still recognised after the tracking-library change.

Not verified here: real acne, a real tongue ("TONGUE OUT" label), real tooth gems, zoom slider on a real
Logitech, anything in motion (tests were still photos), and day-over-day growth numbers.
