# MECHA-FACE — Face-Tracked Transforming Robot Toy

A single-file browser app (`index.html`, no build step) that turns your webcam
face into the controller for a low-poly transforming robot toy — and makes the
robot move **faster than your face**.

Open `index.html` in desktop Chrome (serve it over `http(s)` or `localhost` so
the camera permission works, e.g. `npx http-server .`), click **ENABLE CAMERA &
START**, and look at the camera with a relaxed face (that first sighting is
taken as your neutral expression — press `C` to re-take it). No camera?
**START WITHOUT CAMERA** drives the same pipeline with the mouse.

## Controls

| Face | Effect |
| --- | --- |
| Turn / nod / tilt head | Steers the robot (yaw / pitch / roll), mirrored like a selfie |
| Move head, lean in / out | Moves the robot, brings it closer / further |
| Mouth wide open | Toggle ROBOT ⇄ VEHICLE (~0.6 s articulated fold, reversible) |
| Kiss face (pucker) | Freeze / hold pose while held |
| Raise eyebrows | Both arms go up |
| Wink | Raises the arm on that side (blinks are ignored) |
| Smile | Happy march in place |
| Open jaw a little | Robot head tips back along with you |
| Fast head shake | Full 360° spin that completes on its own momentum |
| Fast nod | 180° flip |
| Face leaves frame | Robot eases into an idle spin — never snaps |

Keys: `C` calibrate neutral (pose + expression), `T` transform, `M` mouse mode,
`H` hide HUD.

## The "faster than me" pipeline

Every frame: MediaPipe FaceMesh 468-landmark tracking → **One Euro Filter** per
used landmark → head basis (cheek-to-cheek × chin-to-forehead, quaternion-derived
yaw/pitch/roll) → deadzone (~1.5°/frame) → **Holt double-exponential smoothing**
(level + trend) → **predictive lead** (constant-velocity extrapolation 0–260 ms
via the trend) → calibration offset → **gain amplification** (1–5×, default
2.5×) + shake/nod impulses → **under-damped spring** on unwrapped scalar axes
(momentum overshoot, tunable stiffness/damping) → robot transform.

Five continuous expressions (jaw, wink R, wink L, brows, smile — each 0 = relaxed
… 1 = full, measured as scale-free 3D landmark ratios against your calibrated
neutral face) run through the same smoothing → prediction → gain → spring chain
and drive the limbs directly, so your face puppets the robot as much as your
head steers it (EXPRESSION GAIN slider, 0–3×).

All of it is tunable live from the HUD sliders: gain, expression gain,
prediction lead, smoothing, spring stiffness, overshoot.

## Tech

- [MediaPipe Face Mesh](https://www.npmjs.com/package/@mediapipe/face_mesh) + camera_utils (CDN)
- [Three.js](https://threejs.org) r128 (CDN)
- Vanilla JS, zero assets — the robot, vehicle, scene, and the Italian-racing
  style chest badge (yellow scudetto, tricolore band, rearing robo-horse,
  "MF" mark — an original emblem, not the Ferrari trademark) are all drawn
  procedurally. Original toy design, not branded IP.
