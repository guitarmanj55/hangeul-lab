# Roadmap

## Done
### v1.8: Numbers, typing and a calendar
- [x] Numbers drill in Practise: prices, times and counting (and ages), Hangeul → figure and figure → Hangeul; wrong answers are the real mix-ups (이 잔 for 두 잔, 셋 시 for 세 시)
- [x] Course unit 25, "Numbers in real life": one step each for prices, time and counting
- [x] Typing practice: hear a word or syllable, spell it on the Korean keyboard; near misses are spotted letter by letter
- [x] Study calendar in Me (last 12 weeks, rebuilt from review history for older saves) and a 7-day forecast of reviews due
- [x] Number phrases and the typing check live in `korean.js` with `node --test` tests; 171 new audio clips
### v1.7: Grammar for making plans
- [x] 4 new grammar lessons: telling the time (시/분), -(으)ㄹ게요 (I'll, promising), -(으)면 (if), -아도/어도 돼요 (is it OK to)
- [x] Course units 21–24: the new lessons, plus the six sound rules the course hadn't reached yet
- [x] Sound-rule examples come back in the daily reviews; rules passed earlier were added, spread over a week
### v1.6: Safer progress
- [x] Weekly backup reminder on Today and in Me (download or copy counts as a backup)
- [x] A failed save shows a warning instead of failing silently; the app asks the phone to keep its storage
- [x] Restoring a backup brings back reading and grammar reviews too (they were skipped before)
- [x] SRS scheduling, migrations and backup merging moved to `srs.js` with `node --test` tests

### v1.5.1
- [x] Service worker asks the server for the page and data.js every time, so an update never mixes old and new files

### v1.5: Reviews cover everything
- [x] Today's reviews are one mixed session: letters, words, reading items and grammar sentences
- [x] Reading practice feeds the reviews (first sight comes back tomorrow; misses sooner)
- [x] Passing a grammar lesson schedules its sentences for review; lessons passed earlier were added, spread over a week
- [x] 5 new grammar lessons: -고 (and), -지만 (but), -아서/어서 (so), -(으)ㄹ 거예요 (will), counters (개, 명, 잔, 병, 장)
- [x] Course units 19 (Linking ideas) and 20 (Plans and counting)

### v1.4.1: Tidy-up
- [x] Content moved out of `index.html` into `data.js` (plain script, still works opened as a file)

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
- [ ] Numbers beyond the drill: phone numbers, dates (시월 이십이 일) and floors, maybe as review items
- [ ] Typing feeds the reviews: a word typed right on its due day counts as a review
- [ ] More grammar: -(으)니까 (because, for reasons and suggestions), -아/어야 돼요 (have to), -(으)러 가요 (go to do), -는 것 (doing as a noun)

## Known limits
- Progress is stored per browser; move it with Settings > Back up progress
- Mic scoring depends on the device's speech service (needs internet on Android; unreliable in the iPhone home-screen app). Record & compare works everywhere
