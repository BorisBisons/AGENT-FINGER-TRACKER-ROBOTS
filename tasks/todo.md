# Convert finger tracker → face tracker

- [x] Swap MediaPipe Hands for MediaPipe FaceMesh (same CDN/API family, camera_utils kept)
- [x] Head pose (yaw/pitch/roll, position, depth) replaces palm pose
- [x] Expressions replace finger curls: jaw, wink R/L, brows, smile → head / arms / legs
- [x] Gestures: mouth wide open = transform toggle, kiss = freeze, head shake = spin, nod = flip
- [x] Neutral-expression calibration (first sighting + `C`)
- [x] Tracker overlay draws face mesh; HUD, help, boot text, README renamed (MECHA-FACE v2.0)
- [x] Verify in headless Chromium with a fake webcam face + simulated landmarks

## Review

Verified (Chromium, real FaceMesh model on a face photo via fake webcam):
- Face acquired, overlay aligned, HUD live.
- Head-pose math: synthetic 20° yaw / 15° pitch / 10° roll recovered within 2°.
- Expressions classify correctly: mouth open, wink (blink cancels), brows, smile, kiss.
- Mouth open toggles ROBOT→VEHICLE once, no re-toggle while held, toggles back on next open.
- Kiss freezes; slow head turn steers without spinning; fast shake = 360° spin; fast nod = 180° flip.
- Wink R raises only the right arm; face lost → NO FACE + idle; mouse mode unchanged.

Not verified here: feel of the expression thresholds on a live, moving human
face (only a still photo + simulated landmark motion was available). Tune via
EXPRESSION GAIN, or the constants in `expressions()` / `SHAKE_V` / `NOD_V`.
