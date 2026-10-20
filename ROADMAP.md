# Roadmap

## Next (fixes the known problems)
- [ ] Pre-recorded audio for every letter and word in `audio/`, so sound does not depend on the voices installed on the phone (the artifact version failed on a device with no Korean voice)
- [ ] `scripts/` generator that builds the audio files from the word list, run once on the laptop
- [ ] Play recorded audio first; fall back to browser speech only for the syllable builder
- [ ] Deploy to GitHub Pages (or Vercel) so it has its own address
- [ ] Installable on a phone home screen, working offline (web app manifest + service worker)

## Then
- [ ] Progress export/import, then cross-device sync
- [ ] Split the data (letters, vocab) out of `index.html` into JSON files
- [ ] Grammar module: particles, sentence order, basic conjugation
- [ ] More vocab depth and categories
- [ ] Batchim pronunciation rules (linking, assimilation)

## Known limits
- Progress is stored in the browser's localStorage only
- Mic scoring needs Chrome and a direct page (not an embedded preview)
