# Hangeul Lab

A personal Korean-learning app: read Hangeul first, then vocabulary, then speaking.

Live at https://guitarmanj55.github.io/hangeul-lab/ (pushing to `main` redeploys it).

- **Hangeul module:** all 40 letters with shape mnemonics, plus a syllable builder
- **Vocab module:** 97 survival words and phrases in 8 categories
- **Listening drills:** hear a letter or word, pick what you heard; a "tricky sounds" mode for ㄱ/ㅋ/ㄲ-style pairs
- **Speaking practice:** listen, then say it aloud (mic scoring where the browser supports it)
- **Backup:** download or copy your progress and load it on another device (merges, never overwrites newer reviews)
- **Spaced repetition:** a simplified SM-2 scheduler drives all reviews
- **Recorded audio:** 522 natural-voice clips, so it sounds right on phones with no Korean voice installed
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

v1.1: permanent vocab IDs, progress backup, listening drills (on top of v1.0: recorded audio, installable, offline). See `ROADMAP.md` for what is next.
