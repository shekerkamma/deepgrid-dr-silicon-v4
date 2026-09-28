# DG32 fault-path motion explainer (pilot)

Rendered with HyperFrames 0.8.31 (HTML + GSAP -> MP4) via the `faceless-explainer` workflow.
Output on the site: `public/media/dg32-fault-path-explained.{mp4,vtt}` + poster, shown on
/technology/safety#film and linked from /products.

- Narration: Kokoro `bm_george`, per-line speed in `speeds.json` tuned to 141-155 spoken wpm
  (`HYPERFRAMES_PYTHON=~/.venvs/kokoro/bin/python hyperframes tts ... --speed <s>`).
- Word timings: Groq whisper-large-v3-turbo, aligned to SCRIPT.md so captions use script spelling.
- Frames: `python3 build_frames.py` writes `compositions/frames/*.html`; cue times are the
  narration's word starts. Fonts (Georgia, Arial, Courier New) were copied from Windows into the
  working project's `assets/fonts/` and are not committed here.
- Gates run: `hyperframes lint` 0/0, `hyperframes check` passed (after fixing caption ink/accent
  in `compositions/captions.html` for the dark palette), narration echo 0-10% per frame.
- Working project (with assets): `~/hyperframes-videos/videos/dg32-fault-path-explained`.
