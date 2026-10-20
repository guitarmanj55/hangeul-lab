# Hangeul Lab

Personal Korean-learning web app. Owner: Oli (British, learning Korean, previously on placement in Busan). Reading Hangeul comes first, speaking second.

## Rules
- Vocab drills always show Hangeul as the prompt, never romanization
- Keep it a dependency-free static site unless there is a clear reason; no build step for now
- Progress lives in localStorage under `hangeullab_progress_v1`; do not change that key or the saved shape without a migration. Saved state carries `schema` (now 2); add migrations to `migrateState()`, which also runs on imported backups
- Every vocab entry has a permanent `id`; progress is saved against it. Give new words a new id, never rename or reuse one, and never edit `LEGACY_VOCAB_IDS`
- Lesson and sound-rule completion lives in `state.done` ({id: timestamp}); reading, rule and lesson ids must stay stable too
- Bump `APP_VERSION` and `APP_WHATS_NEW` in `index.html` for each release (drives the "Updated to…" notice)
- Light and dark themes both stay working; colours come from the CSS tokens at the top of `index.html`
- Fonts: Fraunces (display), Noto Serif/Sans KR (Korean), IBM Plex Mono (romanization and numbers)

## Layout
- `index.html` the whole app (data, SRS engine, UI)
- `audio/` recorded clips, named by an FNV-1a hash of the spoken text, plus `index.json` listing them. Generated, never hand-edited
- `scripts/make_audio.py` builds `audio/` from the `kr:"..."` strings and grammar quiz `q`/`a` pairs in `index.html` and every open syllable (edge-tts, voice ko-KR-SunHiNeural). Its hash must match `clipUrl()` in `index.html`
- `scripts/make_icons.ps1` renders `icons/`
- `manifest.webmanifest` and `sw.js` make it installable and offline. Bump `CACHE` in `sw.js` after regenerating audio
- `ROADMAP.md` what to do next

## After changing letters or vocab
Run `python scripts/make_audio.py` (needs `pip install edge-tts`), then bump `CACHE` in `sw.js`.

## Testing
Serve the folder (`python -m http.server 8123`) rather than opening the file, so the service worker runs. Click through: Hangeul grid, a drill, syllable builder, vocab, speaking, settings. Check both themes and a phone-width window.
