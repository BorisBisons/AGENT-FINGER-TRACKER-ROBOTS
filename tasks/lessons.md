# Lessons

- **Confirm what the output should look like before converting an app.** "Make it a face tracker
  instead of a finger tracker" was read as "swap the input, keep the robot"; Boris wanted the
  tracker itself on screen (red box, features, eyes, labels). When a request can mean "change the
  input" or "change what the app shows", state the interpretation up front in one line, or ask.
- **Give terminal commands as one paste-able line** (joined with `&&`) — separate blocks got pasted
  together and broke.
- **Don't assume Node is installed** on Boris's Mac; `python3 -m http.server` works there.
- **Two MediaPipe generations cannot share a page.** The legacy `@mediapipe/face_mesh` and
  `@mediapipe/tasks-vision` both claim the global WASM `Module`; use Tasks for everything.
- **Check model variants before shipping.** The 8-bit quantised MobileCLIP vision model gave wrong
  labels; fp16 matched full precision.
