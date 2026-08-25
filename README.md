# MECHA-HAND — Hand-Tracked Transforming Robot Toy

A single-file browser app (`index.html`, no build step) that turns your webcam
hand into the controller for a low-poly transforming robot toy — and makes the
robot move **faster than your hand**.

Open `index.html` in desktop Chrome (serve it over `http(s)` or `localhost` so
the camera permission works, e.g. `npx http-server .`), click **ENABLE CAMERA &
START**, and show your hand. No camera? **START WITHOUT CAMERA** drives the same
pipeline with the mouse.

## Controls

| Gesture | Effect |
| --- | --- |
| Open palm | ROBOT mode; palm orientation/position drives the robot |
| Closed fist | Transform to VEHICLE mode (~0.6 s articulated fold, reversible) |
| Peace sign (2 fingers) | Freeze / hold pose |
| Fast horizontal swipe | Full 360° spin that completes on its own momentum |
| Fast vertical flick | 180° flip |
| Hand leaves frame | Robot eases into an idle spin — never snaps |

Keys: `C` calibrate neutral, `T` transform, `M` mouse mode, `H` hide HUD.

## The "faster than me" pipeline

Every frame: MediaPipe 21-landmark tracking → **One Euro Filter** per landmark →
palm basis (quaternion-derived yaw/pitch/roll, yaw unwrapped for continuous
360°) → deadzone (~1.5°/frame) → **Holt double-exponential smoothing** (level +
trend) → **predictive lead** (constant-velocity extrapolation 0–260 ms via the
trend) → calibration offset → **gain amplification** (1–5×, default 2.5×) +
gesture impulses → **under-damped spring** on unwrapped scalar axes (momentum
overshoot, tunable stiffness/damping) → robot transform.

All of it is tunable live from the HUD sliders: gain, prediction lead,
smoothing, spring stiffness, overshoot.

## Tech

- [MediaPipe Hands](https://www.npmjs.com/package/@mediapipe/hands) + camera_utils (CDN)
- [Three.js](https://threejs.org) r128 (CDN)
- Vanilla JS, zero assets — the robot, vehicle, and scene are all procedural
  primitives. Original toy design, not branded IP.
