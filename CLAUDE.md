# Hangeul Lab

Personal Korean-learning web app. Owner: Oli (British, learning Korean, previously on placement in Busan). Reading Hangeul comes first, speaking second.

## Rules
- Vocab drills always show Hangeul as the prompt, never romanization
- Keep it a dependency-free static site unless there is a clear reason; no build step for now
- Progress lives in localStorage under `hangeullab_progress_v1`; do not change that key or the saved shape without a migration
- Light and dark themes both stay working; colours come from the CSS tokens at the top of `index.html`
- Fonts: Fraunces (display), Noto Serif/Sans KR (Korean), IBM Plex Mono (romanization and numbers)

## Layout
- `index.html` the whole app (data, SRS engine, UI)
- `audio/` recorded clips (to be generated)
- `scripts/` helper scripts (audio generator)
- `ROADMAP.md` what to do next

## Testing
Open `index.html` in a browser and click through: Hangeul grid, a drill, syllable builder, vocab, speaking, settings. Check both themes and a phone-width window.
