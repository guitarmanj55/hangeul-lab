# Roadmap

## Done
### v1.1
- [x] Permanent vocab IDs (progress was keyed by list position); schema 2 with a migration from v1
- [x] Progress backup: download/open a file, or copy/paste between devices; imports merge by most recent review
- [x] Listening drills: hear → pick the letter, tricky sounds (ㄱ/ㅋ/ㄲ, ㅓ/ㅗ/ㅜ/ㅡ…), hear → pick the word

### v1.0
- [x] Pre-recorded audio for every letter and word in `audio/`, so sound does not depend on the voices installed on the phone
- [x] `scripts/` generator that builds the audio files from the word list, run once on the laptop
- [x] Play recorded audio first; fall back to browser speech only for the syllable builder (open syllables like 가 are recorded too; ones with a 받침 still use the device voice)
- [x] Deploy to GitHub Pages: https://guitarmanj55.github.io/hangeul-lab/
- [x] Installable on a phone home screen, working offline (web app manifest + service worker)

## Next (v1.2)
- [ ] Reading practice with real-world text: signs, menus, Busan place names
- [ ] Batchim pronunciation rules (linking, nasalisation) with audio examples

## Then
- [ ] Automatic cross-device sync (needs a small backend)
- [ ] Split the data (letters, vocab) out of `index.html` into JSON files
- [ ] Grammar module: particles, sentence order, basic conjugation
- [ ] More vocab depth and categories

## Polish
- [ ] Starting a drill spends the day's new-item budget even if you leave straight away
- [ ] Tell the user when a new version has loaded
- [ ] Dark mode: text on the home hero banner is low contrast

## Known limits
- Progress is stored per browser; move it with Settings > Back up progress
- Mic scoring needs Chrome and a direct page (not an embedded preview)
