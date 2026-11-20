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
- **Event log** of what just changed (BLINK, EYES → LEFT, GLASSES DETECTED, …).

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

- [MediaPipe Face Mesh](https://www.npmjs.com/package/@mediapipe/face_mesh) with
  iris refinement gives 478 landmarks per frame. Boxes are landmark bounding
  boxes; head pose comes from a cheek-to-cheek × chin-to-forehead basis; eye
  openness is the eye aspect ratio against the widest that eye has been; gaze is
  the iris centre's offset between the eye corners, relative to your calibrated
  neutral and One-Euro filtered.
- Accessories use [MobileCLIP-S0](https://huggingface.co/Xenova/mobileclip_s0)
  via [transformers.js](https://huggingface.co/docs/transformers.js) in a Web
  Worker. About once a second a head-and-shoulders crop is embedded and compared
  with label-prompt embeddings that are pre-computed and stored inside
  `index.html` (regenerate with `tools/build-wear-data.mjs`), so only the small
  vision half of the model is downloaded.

Accessory tags are a best guess from a general vision model, not a certainty —
they need a second or two to settle and can be wrong in odd lighting.

`robot.html` is the earlier face-controlled transforming-robot toy.
