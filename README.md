# FACE-TRACK — Live Face, Eye & Accessory Tracker

A single-file browser app (`index.html`, no build step). It shows your webcam
like a mirror, locks a **red box** onto your face and tracks everything on it in
real time:

- **Face box** that follows your head, plus small boxes on each feature — both
  eyes, both brows, nose, mouth — each labelled with what it is doing.
- **Eyes:** how open each eye is, blinks (counted), and **iris tracking** — a ring
  on each iris, a pupil dot, a motion trail and a gaze arrow, so even small eye
  movements show up. Gaze is reported as CENTER / LEFT / RIGHT / UP / DOWN.
- **Head:** yaw / pitch / roll and which way you are facing.
- **Mouth & brows:** closed / open / wide open, smiling, brows raised.
- **Motion:** whether your head or eyes are moving, with a live meter.
- **What you're wearing:** tags such as GLASSES, SUNGLASSES, CAP, BEANIE, HAT,
  HOOD, HEADSCARF, HEADPHONES, EARBUDS, FACE MASK, BEARD, MUSTACHE, each pinned
  beside the face with a confidence %.
- **Detail scan** (pixel-level, sizes in millimetres using the iris as a ruler):
  - **Skin spots** — small red/dark marks are circled, numbered, sized and logged;
    remembered between sessions so a new one is flagged NEW.
  - **Mouth** — teeth showing, tongue, and **tooth gems** (marked with a diamond).
  - **Eyebrows** — the real drawn line of each brow: tilt, arch and tail angles,
    length, thickness and shaved **slits**.
  - **Moustache / beard** coverage and moustache band height; **head hair** height
    above the forehead and top-to-tips span.
- **Growth log** — one entry a day (moustache, beard, hair, brow thickness, spot
  count) kept in this browser, shown as change since day 1, exportable as CSV.
- **Event log** of what just changed (BLINK, EYES → LEFT, GLASSES DETECTED, SPOT #2 …).
- **Camera picker** for external webcams (1080p is requested) and a zoom slider
  when the camera supports it.

Everything runs locally in the browser; no video leaves the page.

## Run it

Serve the folder over `localhost` (the camera needs it) and open it in Chrome:

```bash
python3 -m http.server 8080
```

Then go to `http://localhost:8080`, click **ENABLE CAMERA & START** and look at
the camera with a relaxed face for a second (that sets your neutral gaze and
expression). The "wearing" recogniser downloads a ~23 MB model the first time
and starts tagging a few seconds later.

Keys: `C` recalibrate neutral, `M` mesh on/off, `L` labels on/off, `H` hide panel.

## How it works

- [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)
  gives 478 landmarks per frame (irises included). Boxes are landmark bounding
  boxes; head pose comes from a cheek-to-cheek × chin-to-forehead basis; gaze is
  the iris centre's offset between the eye corners, relative to your calibrated
  neutral.
- The detail scan re-reads the pixels a few times a second: spots are small
  blobs darker and redder than the surrounding skin; tooth gems are tiny
  sparkles ringed by tooth; brows are traced along their darkest line in
  cross-sections every ~1 mm; hair comes from MediaPipe's selfie segmenter.
  Something is only reported after it persists over several scans.
- Accessories use [MobileCLIP-S0](https://huggingface.co/Xenova/mobileclip_s0)
  via [transformers.js](https://huggingface.co/docs/transformers.js) in a Web
  Worker, compared with label embeddings pre-computed into `index.html`
  (regenerate with `tools/build-wear-data.mjs`).

## Limits worth knowing

- Millimetres assume an average iris (11.7 mm) — expect roughly ±10–15 %. Hair
  grows ~0.4 mm a day, so growth shows over a week or more, not overnight.
- For day-to-day comparison use the same camera, distance and lighting, face the
  camera, and keep still for a few seconds.
- A spot can be acne, a mole, a freckle or a piercing — the scan finds marks, it
  does not diagnose them. A tooth gem can be confused with a wet glint.
- Glasses frames hide the brows; brow slits are not reported while glasses are on.
- Accessory tags are a best guess from a general vision model.

`robot.html` is the earlier face-controlled transforming-robot toy.
