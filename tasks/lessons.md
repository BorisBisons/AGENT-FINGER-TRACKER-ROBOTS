# Lessons

- **Confirm what the output should look like before converting an app.** "Make it a face tracker
  instead of a finger tracker" was read as "swap the input, keep the robot"; Boris wanted the
  tracker itself on screen (red box, features, eyes, labels). When a request can mean "change the
  input" or "change what the app shows", state the interpretation up front in one line, or ask.
- **Give terminal commands as one paste-able line** (joined with `&&`) — separate blocks got pasted
  together and broke.
- **Don't assume Node is installed** on Boris's Mac; `python3 -m http.server` works there.
