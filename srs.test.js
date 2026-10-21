// Run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const SRS = require("./srs.js");

const NOW = Date.UTC(2026, 9, 22, 9);
const DAY = SRS.DAY;

test("a new card is not due until it has been seen", () => {
  const it = SRS.newCard();
  assert.equal(SRS.isDue(it, NOW), false);
  SRS.markSeen(it, NOW);
  assert.equal(SRS.isDue(it, NOW), true);
});

test("markSeen leaves an already seen card alone", () => {
  const it = SRS.grade(SRS.markSeen(SRS.newCard(), NOW), 2, NOW);
  const due = it.due;
  SRS.markSeen(it, NOW + DAY);
  assert.equal(it.due, due);
  assert.equal(it.reps, 1);
});

test("good answers step 1 day, 3 days, then interval x ease", () => {
  const it = SRS.markSeen(SRS.newCard(), NOW);
  SRS.grade(it, 2, NOW);
  assert.equal(it.interval, 1);
  SRS.grade(it, 2, NOW);
  assert.equal(it.interval, 3);
  SRS.grade(it, 2, NOW);
  assert.equal(it.interval, 8); // round(3 * 2.5)
  assert.equal(it.due, NOW + 8 * DAY);
  assert.equal(it.ef, 2.5);
});

test("hard and easy change the second interval and the ease", () => {
  const hard = SRS.grade(SRS.grade(SRS.newCard(), 1, NOW), 1, NOW);
  assert.equal(hard.interval, 2);
  assert.ok(Math.abs(hard.ef - 2.2) < 1e-9);
  const easy = SRS.grade(SRS.grade(SRS.newCard(), 3, NOW), 3, NOW);
  assert.equal(easy.interval, 4);
  assert.ok(Math.abs(easy.ef - 2.7) < 1e-9);
});

test("a miss resets reps, counts a lapse and comes back in 12 hours", () => {
  const it = SRS.grade(SRS.grade(SRS.newCard(), 2, NOW), 2, NOW);
  SRS.grade(it, 0, NOW);
  assert.equal(it.reps, 0);
  assert.equal(it.interval, 0);
  assert.equal(it.lapses, 1);
  assert.equal(it.due, NOW + 12 * 60 * 60 * 1000);
  assert.ok(Math.abs(it.ef - 2.3) < 1e-9);
});

test("ease never drops below 1.3", () => {
  const it = SRS.newCard();
  for (let i = 0; i < 20; i++) SRS.grade(it, 0, NOW);
  assert.equal(it.ef, 1.3);
});

test("mastered needs 5 reps and a 21-day interval", () => {
  const it = SRS.newCard();
  for (let i = 0; i < 4; i++) SRS.grade(it, 2, NOW);
  assert.equal(SRS.isMastered(it), false);
  SRS.grade(it, 2, NOW);
  assert.equal(it.reps, 5);
  assert.ok(it.interval >= 21);
  assert.equal(SRS.isMastered(it), true);
});

const defaults = () => ({ schema: 2, items: {}, streak: 0, done: {}, dailyCap: 10, lastBackupAt: 0 });

test("schema 1 vocab keys move to permanent ids; unknown positions are dropped", () => {
  const s = SRS.migrate({ items: { v_0: { reps: 3 }, v_2: { reps: 1 }, v_99: { reps: 9 }, h_a: { reps: 2 } } }, defaults(), ["v_hello", "v_bye", "v_thanks"]);
  assert.equal(s.schema, 2);
  assert.deepEqual(Object.keys(s.items).sort(), ["h_a", "v_hello", "v_thanks"]);
  assert.equal(s.items.v_hello.reps, 3);
});

test("schema 2 keys are left alone and missing fields get defaults", () => {
  const s = SRS.migrate({ schema: 2, items: { v_0: { reps: 1 } }, streak: 4 }, defaults(), ["v_hello"]);
  assert.deepEqual(Object.keys(s.items), ["v_0"]);
  assert.equal(s.streak, 4);
  assert.equal(s.dailyCap, 10);
  assert.equal(s.lastBackupAt, 0);
  assert.deepEqual(s.done, {});
});

test("dayValue compares unpadded day strings", () => {
  assert.ok(SRS.dayValue("2026-10-2") < SRS.dayValue("2026-10-10"));
  assert.ok(SRS.dayValue("2026-9-30") < SRS.dayValue("2026-10-1"));
});

test("merge keeps the most recent review of each item and skips unknown ids", () => {
  const state = { items: { a: { lastReview: 5 }, b: { lastReview: 9 } }, done: {}, streak: 2, lastActiveDay: "2026-10-20" };
  const incoming = { items: { a: { lastReview: 7 }, b: { lastReview: 1 }, c: { lastReview: 3 }, gone: { lastReview: 3 } }, done: {}, streak: 5, lastActiveDay: "2026-10-21" };
  const r = SRS.merge(state, incoming, (id) => id !== "gone");
  assert.deepEqual(r, { added: 1, updated: 1 });
  assert.equal(state.items.a.lastReview, 7);
  assert.equal(state.items.b.lastReview, 9);
  assert.ok(state.items.c);
  assert.equal(state.items.gone, undefined);
  assert.equal(state.streak, 5);
  assert.equal(state.lastActiveDay, "2026-10-21");
});

test("merge keeps reading and grammar review items when they are known", () => {
  const state = { items: {}, done: {}, streak: 0, lastActiveDay: null };
  const incoming = { items: { r_sign1: { lastReview: 1 }, gq_order_0: { lastReview: 1 } }, done: {}, streak: 0 };
  assert.equal(SRS.merge(state, incoming, () => true).added, 2);
});

test("merge on the same day keeps the longer streak; done keeps the later time", () => {
  const state = { items: {}, done: { c_u1_0: 10, l_x: 50 }, streak: 3, lastActiveDay: "2026-10-22" };
  const incoming = { items: {}, done: { c_u1_0: 20, l_x: 40, l_y: 1 }, streak: 2, lastActiveDay: "2026-10-22" };
  SRS.merge(state, incoming, () => true);
  assert.equal(state.streak, 3);
  assert.deepEqual(state.done, { c_u1_0: 20, l_x: 50, l_y: 1 });
});

test("backup reminder: nothing to back up, never backed up, recent, a week old", () => {
  assert.deepEqual(SRS.backupStatus(0, false, NOW), { overdue: false, days: null });
  assert.deepEqual(SRS.backupStatus(0, true, NOW), { overdue: true, days: null });
  assert.deepEqual(SRS.backupStatus(NOW - 6 * DAY, true, NOW), { overdue: false, days: 6 });
  assert.deepEqual(SRS.backupStatus(NOW - 7 * DAY, true, NOW), { overdue: true, days: 7 });
});
