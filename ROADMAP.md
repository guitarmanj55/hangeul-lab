# Roadmap

## Done
### v1.4: Tidier layout
- [x] Bottom tab bar (Today, Course, Practise, Me) replaces the eight-tab strip; respects iPhone safe areas
- [x] Today screen: daily goal ring (reviews clear + one course step), one "up next" card, one-line progress summary
- [x] Practise hub with tiles for letters, vocab, reading, grammar, listening and speaking; "‹ Practise" back links
- [x] Me page: progress stats above settings

### v1.3: Beginner path
- [x] Course tab: 18 units, 41 steps, Continue card on Home; letters → words you can read → phrases → conversations → grammar → sound rules
- [x] Teach first: meet each item, then a multiple-choice check (80% to pass); passing schedules the first review for tomorrow
- [x] "Words you can read now" built only from letters already learned, loanwords first
- [x] "What you already say" check credits phrases picked up in Busan
- [x] Six conversations (café, restaurant, taxi, convenience store, directions, colleague) with play-all, slow mode and a practise-your-lines quiz
- [x] Slow audio (🐢 buttons and a Settings speed), romanization hints in drills and reading, plain-English line on every lesson and rule
- [x] Drills: a never-seen item opens turned over so you meet it before being tested

### v1.2.2
- [x] iPhone home-screen app: scoring mic hidden (iOS blocks it there); Record & compare plays through one tap-unlocked player so iOS doesn't block playback

### v1.2.1
- [x] Mic scoring no longer sticks on "Listening": start and overall timeouts, tap to stop, interim results, clear error reasons
- [x] Record & compare: record yourself, hear the native clip then yours
- [x] Version number and "Check for update" in Settings

### v1.2
- [x] Reading practice: 45 real signs, menu items and Busan place names; sound it out, reveal, self-check
- [x] Sound rules: 9 batchim/pronunciation rules (linking, final sounds, nasalisation, ㄴ+ㄹ, ㄹ→ㄴ, aspiration, tensing, palatalisation, silent ㅎ) with examples and quizzes
- [x] Grammar module: 12 lessons (word order, 은/는, 이/가, 을/를, 에/에서, 이에요/예요, present, past, 안/못, -고 싶어요, 주세요, 있어요/없어요) with quizzes
- [x] 50 more words, 4 new categories (people, work & study, describing things, feelings)
- [x] Polish: drills only charge new items to the daily budget when shown; update notice on first open of a new version; dark-mode hero contrast

### v1.1
- [x] Permanent vocab IDs (progress was keyed by list position); schema 2 with a migration from v1
- [x] Progress backup: download/open a file, or copy/paste between devices; imports merge by most recent review
- [x] Listening drills: hear → pick the letter, tricky sounds (ㄱ/ㅋ/ㄲ, ㅓ/ㅗ/ㅜ/ㅡ…), hear → pick the word

### v1.0
- [x] Pre-recorded audio for every letter and word in `audio/`, so sound does not depend on the voices installed on the phone
- [x] `scripts/` generator that builds the audio files, run once on the laptop
- [x] Play recorded audio first; device voice only for builder syllables with a 받침
- [x] Deploy to GitHub Pages: https://guitarmanj55.github.io/hangeul-lab/
- [x] Installable on a phone home screen, working offline (web app manifest + service worker)

## Ideas
- [ ] Automatic cross-device sync (needs a small backend; Copy/Paste covers it for now)
- [ ] Reading items and grammar sentences in the spaced-repetition reviews, not only practice rounds
- [ ] More grammar: connecting clauses (-고, -지만, -아서), future (-(으)ㄹ 거예요), counters
- [ ] Split the data out of `index.html` once it gets unwieldy (as a `data.js` script, so opening the file directly still works)

## Known limits
- Progress is stored per browser; move it with Settings > Back up progress
- Mic scoring depends on the device's speech service (needs internet on Android; unreliable in the iPhone home-screen app). Record & compare works everywhere
