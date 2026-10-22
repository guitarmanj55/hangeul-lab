# Hangeul Lab

Personal Korean-learning web app. Owner: Oli (British, learning Korean, previously on placement in Busan). Reading Hangeul comes first, speaking second.

## Rules
- Vocab drills always show Hangeul as the prompt, never romanization
- Keep it a dependency-free static site unless there is a clear reason; no build step for now
- Progress lives in localStorage under `hangeullab_progress_v1`; do not change that key or the saved shape without a migration. Saved state carries `schema` (now 2); add migrations to `SRS.migrate()` in `srs.js` (called by `migrateState()`), which also runs on imported backups. New fields with a default in `defaultState()` (like `lastBackupAt` and `studyDays`, the calendar's {"YYYY-MM-DD": count}) are filled in for old saves without a schema bump
- Every vocab entry has a permanent `id`; progress is saved against it. Give new words a new id, never rename or reuse one, and never edit `LEGACY_VOCAB_IDS`
- Lesson and sound-rule completion lives in `state.done` ({id: timestamp}); reading, rule and lesson ids must stay stable too
- Grammar quiz sentences are review items saved as `gq_<lesson id>_<quiz index>` in `state.items`: only append quiz items to a lesson, never reorder or remove one. Reading items are reviewed under their own `r_` ids
- Course steps are saved as `c_<unit>_<index>` in `state.done`: only append steps to a unit or add units at the end, never reorder. "Already say" ticks are `k_<vocab id>`
- Bump `APP_VERSION` and `APP_WHATS_NEW` in `index.html` for each release (drives the "Updated to…" notice)
- Light and dark themes both stay working; colours come from the CSS tokens at the top of `index.html`
- Fonts: Fraunces (display), Noto Serif/Sans KR (Korean), IBM Plex Mono (romanization and numbers)

## Layout
- `data.js` all the content: letters, vocab, reading, rules, lessons, beginner words, dialogues, the course and plain-English summaries. Loaded with a plain `<script>` before the app code. Edit content here
- `srs.js` pure logic with no DOM: SRS scheduling, migrations, backup merging, the backup reminder. Plain `<script>` (sets `window.SRS`), also `require`-able by Node. Tests in `srs.test.js`
- `korean.js` pure language helpers with no DOM: Sino-Korean and native numbers, the numbers drill's pools and wrong answers, jamo splitting, the typing check. Plain `<script>` (sets `window.KO`), `require`-able by Node. Tests in `korean.test.js`. Only add to the number pools; each answer needs a clip
- `index.html` the app itself (UI, CSS, thin wrappers around `SRS`)
- `audio/` recorded clips, named by an FNV-1a hash of the spoken text, plus `index.json` listing them. Generated, never hand-edited
- `scripts/make_audio.py` builds `audio/` from the `kr:"..."` strings and grammar quiz `q`/`a` pairs in `data.js` and `index.html`, the numbers drill answers from `korean.js` (via `node`), and every open syllable (edge-tts, voice ko-KR-SunHiNeural). Its hash must match `clipUrl()` in `index.html`
- `scripts/make_icons.ps1` renders `icons/`
- `manifest.webmanifest` and `sw.js` make it installable and offline. `index.html`, `data.js`, `srs.js` and `korean.js` are network-first. Bump `CACHE` in `sw.js` after regenerating audio or adding a file to `SHELL`
- `ROADMAP.md` what to do next

## After changing letters or vocab
Content lives in `data.js`. Run `scripts/make_audio.py` with `C:\Users\OJacq\AppData\Local\Programs\Python\Python312\python.exe` (Python is not on PATH; needs `pip install edge-tts`), then bump `CACHE` in `sw.js`.

## Testing
Run `node --test` for the logic in `srs.js` and `korean.js` (Node 24 is installed). Keep scheduling, migration and merge rules in `srs.js` with a test beside them.

Click through all four bottom tabs (Today, Course, Practise, Me), the Course steps (meet, check, conversation, lesson) and each Practise tile. Serve the folder (`python -m http.server 8123`, with the full Python path above) rather than opening the file, so the service worker runs. Click through: Hangeul grid, a drill, syllable builder, vocab, numbers, typing, speaking, settings (calendar and forecast). Check both themes and a phone-width window.
