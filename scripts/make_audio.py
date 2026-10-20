"""Generate the recorded audio clips in audio/ from the word lists in index.html.

Run once on the laptop after changing letters or vocab:

    pip install edge-tts
    python scripts/make_audio.py

Each clip is named by an FNV-1a hash of the exact text the app speaks, so the
app finds it without a lookup table (see clipUrl() in index.html). Clips that
already exist are skipped; pass --force to regenerate everything.
"""
import argparse
import asyncio
import json
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
VOICE = "ko-KR-SunHiNeural"
RATE = "-10%"

# Same tables as index.html, used for letter sounds and the syllable builder.
INITIALS = list("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
VOWELS = list("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")


def fnv1a(text: str) -> str:
    h = 0x811C9DC5
    for b in text.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def compose(ini: str, vow: str) -> str:
    return chr(0xAC00 + INITIALS.index(ini) * 588 + VOWELS.index(vow) * 28)


def collect_texts() -> list[str]:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    texts = re.findall(r'\bkr:"([^"]+)"', html)  # vocab and letter examples
    # Every open syllable: covers letter sounds (가, 아...) and most of the builder.
    texts += [compose(i, v) for i in INITIALS for v in VOWELS]
    seen, out = set(), []
    for t in texts:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out


def spoken_form(text: str) -> str:
    # "제 이름은 ~예요" is a template; drop the placeholder so the voice reads it cleanly.
    return text.replace("~", "").strip()


async def make_clip(text: str, sem: asyncio.Semaphore, force: bool) -> bool:
    path = AUDIO / f"{fnv1a(text)}.mp3"
    if path.exists() and not force:
        return False
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(spoken_form(text), VOICE, rate=RATE).save(str(path))
                return True
            except Exception as e:  # network hiccups: retry, then give up on this clip
                if attempt == 2:
                    print(f"  failed: {text} ({e})", file=sys.stderr)
                    path.unlink(missing_ok=True)
                await asyncio.sleep(1 + attempt)
    return False


async def main(force: bool) -> None:
    AUDIO.mkdir(exist_ok=True)
    texts = collect_texts()
    sem = asyncio.Semaphore(6)
    made = sum(await asyncio.gather(*(make_clip(t, sem, force) for t in texts)))
    clips = {fnv1a(t): t for t in texts if (AUDIO / f"{fnv1a(t)}.mp3").exists()}
    index = {"voice": VOICE, "rate": RATE, "clips": clips}
    (AUDIO / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(texts)} texts, {made} new clips, {len(clips)} in audio/index.json")
    if len(clips) < len(texts):
        sys.exit(1)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--force", action="store_true", help="regenerate clips that already exist")
    asyncio.run(main(p.parse_args().force))
