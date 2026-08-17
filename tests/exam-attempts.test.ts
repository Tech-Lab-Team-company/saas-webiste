import assert from "node:assert/strict";
import test from "node:test";

import {
  allowsMultipleExamAttempts,
  hasCompletedExamAttempt,
  getExamAvailability,
  isExamAttemptLocked,
  parseExamDateTime,
  toBooleanFlag,
} from "../utils/examAttempts.ts";

test("exam flags support boolean, numeric, and string API values", () => {
  assert.equal(toBooleanFlag(true), true);
  assert.equal(toBooleanFlag(1), true);
  assert.equal(toBooleanFlag("1"), true);
  assert.equal(toBooleanFlag("true"), true);
  assert.equal(toBooleanFlag(false), false);
  assert.equal(toBooleanFlag(0), false);
  assert.equal(toBooleanFlag("0"), false);
});

test("exam availability respects its start and end window", () => {
  const exam = {
    start_time: "2025-12-30 15:53:00",
    end_time: "2026-01-30 16:53:00",
  };
  const duringExam = parseExamDateTime("2026-01-01 12:00:00")!;
  const afterExam = parseExamDateTime("2026-08-17 12:00:00")!;
  const beforeExam = parseExamDateTime("2025-12-01 12:00:00")!;

  assert.equal(getExamAvailability(exam, beforeExam), "upcoming");
  assert.equal(getExamAvailability(exam, duringExam), "open");
  assert.equal(getExamAvailability(exam, afterExam), "expired");
});

test("missing or invalid exam dates do not block access", () => {
  assert.equal(getExamAvailability({}, 1), "open");
  assert.equal(getExamAvailability({ end_time: "not-a-date" }, 1), "open");
});

test("a completed exam is locked when multiple attempts are disabled", () => {
  const exam = {
    is_finished: 1,
    attended: 1,
    allow_multiple_attempts: 0,
  };

  assert.equal(hasCompletedExamAttempt(exam), true);
  assert.equal(allowsMultipleExamAttempts(exam), false);
  assert.equal(isExamAttemptLocked(exam), true);
});

test("a completed exam can be reopened when multiple attempts are enabled", () => {
  const apiExam = {
    is_finished: "1",
    attended: true,
    allow_multiple_attempts: "1",
  };
  const mappedExam = {
    isFinished: true,
    attended: true,
    allowMultipleAttempts: true,
  };

  assert.equal(isExamAttemptLocked(apiExam), false);
  assert.equal(isExamAttemptLocked(mappedExam), false);
});
