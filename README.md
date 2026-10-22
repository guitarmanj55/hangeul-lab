# Hangeul Lab

A personal Korean-learning app: read Hangeul first, then vocabulary, then speaking.

Live at https://guitarmanj55.github.io/hangeul-lab/ (pushing to `main` redeploys it).

- **Beginner course:** 25 short units in order, from the first vowels to real conversations, each step teaching first and then checking
- **Hangeul module:** all 40 letters with shape mnemonics, plus a syllable builder
- **Vocab module:** 147 survival words and phrases in 12 categories
- **Reading practice:** real signs, menus and Busan place names, plus 9 sound-change rules (why 합니다 is said "hamnida")
- **Grammar:** 17 short lessons, from word order and particles to past and future, linking words (and, but, so) and counters, each with a quiz
- **Listening drills:** hear a letter or word, pick what you heard; a "tricky sounds" mode for ㄱ/ㅋ/ㄲ-style pairs
- **Numbers drill:** prices, times and counting, so you learn when it's 하나, 둘, 셋 and when it's 일, 이, 삼
- **Typing practice:** hear a word and spell it on the phone's Korean keyboard
- **Speaking practice:** listen, say it aloud, get a score where the device supports it, or record yourself and compare with the native clip
- **Study calendar:** the days you studied over the last 12 weeks, and how many reviews fall due each day this week
- **Backup:** download or copy your progress and load it on another device (merges, never overwrites newer reviews)
- **Spaced repetition:** a simplified SM-2 scheduler drives one daily review of letters, words, reading items and grammar sentences
- **Recorded audio:** 1,015 natural-voice clips, so it sounds right on phones with no Korean voice installed
- **Installable and offline:** add it to your home screen; after the first visit it works with no signal

## Run it

It is a static site. Serve the folder and open http://localhost:8123:

```
python -m http.server 8123
```

Opening `index.html` directly also works, but without offline mode.

## Regenerate audio

After changing letters, vocab or the number pools in `korean.js` (the script asks Node for the number phrases):

```
pip install edge-tts
python scripts/make_audio.py
```

Then bump `CACHE` in `sw.js` so installed copies pick up the new clips.

## Status

v1.8: numbers drill, typing practice and a study calendar. See `ROADMAP.md` for history and ideas.
