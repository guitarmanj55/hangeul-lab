# Hangeul Lab

A personal Korean-learning app: read Hangeul first, then vocabulary, then speaking.

Live at https://guitarmanj55.github.io/hangeul-lab/ (pushing to `main` redeploys it).

- **Beginner course:** 18 short units in order, from the first vowels to real conversations, each step teaching first and then checking
- **Hangeul module:** all 40 letters with shape mnemonics, plus a syllable builder
- **Vocab module:** 147 survival words and phrases in 12 categories
- **Reading practice:** real signs, menus and Busan place names, plus 9 sound-change rules (why 합니다 is said "hamnida")
- **Grammar:** 12 short lessons, from word order and particles to past tense and requests, each with a quiz
- **Listening drills:** hear a letter or word, pick what you heard; a "tricky sounds" mode for ㄱ/ㅋ/ㄲ-style pairs
- **Speaking practice:** listen, say it aloud, get a score where the device supports it, or record yourself and compare with the native clip
- **Backup:** download or copy your progress and load it on another device (merges, never overwrites newer reviews)
- **Spaced repetition:** a simplified SM-2 scheduler drives all reviews
- **Recorded audio:** 789 natural-voice clips, so it sounds right on phones with no Korean voice installed
- **Installable and offline:** add it to your home screen; after the first visit it works with no signal

## Run it

It is a static site. Serve the folder and open http://localhost:8123:

```
python -m http.server 8123
```

Opening `index.html` directly also works, but without offline mode.

## Regenerate audio

After changing letters or vocab in `index.html`:

```
pip install edge-tts
python scripts/make_audio.py
```

Then bump `CACHE` in `sw.js` so installed copies pick up the new clips.

## Status

v1.3: guided beginner course. See `ROADMAP.md` for history and ideas.
