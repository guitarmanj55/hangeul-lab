// Run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const KO = require("./korean.js");

test("Sino-Korean numbers drop 일 before 십, 백 and 천, and group by 만", () => {
  assert.equal(KO.sino(15), "십오");
  assert.equal(KO.sino(27), "이십칠");
  assert.equal(KO.sino(100), "백");
  assert.equal(KO.sino(1500), "천오백");
  assert.equal(KO.sino(3500), "삼천오백");
  assert.equal(KO.sino(10000), "만");
  assert.equal(KO.sino(15000), "만 오천");
  assert.equal(KO.sino(35000), "삼만 오천");
  assert.equal(KO.sino(120000), "십이만");
});

test("native numbers shorten before a counter", () => {
  assert.equal(KO.native(1), "하나");
  assert.equal(KO.native(1, true), "한");
  assert.equal(KO.native(4, true), "네");
  assert.equal(KO.native(11, true), "열한");
  assert.equal(KO.native(20), "스물");
  assert.equal(KO.native(20, true), "스무");
  assert.equal(KO.native(27, true), "스물일곱");
});

test("prices, times and counts read the way they're said", () => {
  assert.equal(KO.price(4500), "사천오백 원");
  assert.equal(KO.time(3, 30), "세 시 삼십 분");
  assert.equal(KO.time(5, 30, true), "다섯 시 반");
  assert.equal(KO.time(12, 0), "열두 시");
  const items = KO.numberItems();
  assert.ok(items.some((it) => it.kr === "커피 두 잔" && it.fig === "2 coffees"));
  assert.ok(items.some((it) => it.kr === "스무 살" && it.fig === "20 years old"));
  assert.ok(items.some((it) => it.kr === "만 이천 원" && it.fig === "₩12,000"));
});

test("every number question has three different options, one of them right", () => {
  for (const it of KO.numberItems()) {
    for (const dir of ["read", "say"]) {
      const q = KO.numberQuestion(it, dir);
      assert.equal(q.options.length, 3, it.kr + " " + dir);
      assert.equal(new Set(q.options).size, 3, it.kr + " " + dir);
      assert.equal(q.options[0], q.answer);
      assert.equal(q.audio, it.kr);
    }
  }
});

test("wrong answers are the classic mix-ups, never another way to say the right one", () => {
  const two = KO.numberItems("count").find((it) => it.kr === "커피 두 잔");
  assert.ok(KO.wrongKr(two).includes("커피 이 잔"));
  assert.ok(KO.wrongKr(two).includes("커피 둘 잔"));
  const half = KO.numberItems("time").find((it) => it.kr === "세 시 반");
  assert.ok(!KO.wrongKr(half).includes("세 시 삼십 분"));
  assert.ok(KO.wrongKr(half).includes("삼 시 반"));
});

test("spoken numbers are unique, so each has one clip", () => {
  const spoken = KO.spokenNumbers();
  assert.equal(new Set(spoken).size, spoken.length);
});

test("jamo splits syllables and double finals", () => {
  assert.deepEqual(KO.jamo("닭"), ["ㄷ", "ㅏ", "ㄹ", "ㄱ"]);
  assert.deepEqual(KO.jamo("과"), ["ㄱ", "ㅘ"]);
  assert.deepEqual(KO.jamo("가 ㄴ!"), ["ㄱ", "ㅏ", "ㄴ"]);
});

test("typing ignores spaces and punctuation, and spots near misses", () => {
  assert.equal(KO.checkTyping("영어할줄아세요", "영어 할 줄 아세요?").ok, true);
  const near = KO.checkTyping("감사함니다", "감사합니다");
  assert.equal(near.ok, false);
  assert.equal(near.close, true);
  assert.equal(KO.checkTyping("고양이", "커피").close, false);
  assert.equal(KO.checkTyping("keopi", "커피").latin, true);
  assert.equal(KO.checkTyping("  ", "커피").empty, true);
});
