# Face tracker (v3): red box + feature / eye / accessory tracking

- [x] Replace the robot view with a mirrored webcam view and tracking overlay (robot kept as `robot.html`)
- [x] Red face box + labelled boxes on eyes, brows, nose, mouth
- [x] Iris tracking: ring, pupil, trail, gaze arrow, gaze direction, blink count
- [x] Head pose, mouth / brow state, head + eye motion meter, event log
- [x] "Wearing" recognition (glasses, hats, headphones, mask, beard…) via MobileCLIP in a worker
- [x] Verify in headless Chromium with fake webcam feeds

## Review

Verified in Chromium with real models on photo feeds:
- Face found, 478 landmarks (irises included), overlay aligned with the face.
- Drawn-on glasses → GLASSES 97%; man with tinted glasses + beard → GLASSES 96%, BEARD 76%;
  bare face → nothing tagged (a false CAP at 65% led to raising the show threshold to 70%).
- Gaze maths: iris shifted toward image-left / right / up gives the expected sign and size.
- Model variants compared: 8-bit quantised vision model gave wrong answers; fp16 matches full precision, so fp16 is used.

Not verified here (still photos only): live blink counting, gaze thresholds and motion meter on a
moving face; hats, headphones, masks (no test photos of those).
