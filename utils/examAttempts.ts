export const toBooleanFlag = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

interface ExamAttemptState {
  allowMultipleAttempts?: unknown;
  allow_multiple_attempts?: unknown;
  isFinished?: unknown;
  is_finished?: unknown;
  attended?: unknown;
  startTime?: unknown;
  start_time?: unknown;
  endTime?: unknown;
  end_time?: unknown;
}

export type ExamAvailability = "open" | "upcoming" | "expired";

const examState = (exam: unknown) => exam as ExamAttemptState | null | undefined;

export const allowsMultipleExamAttempts = (exam: unknown): boolean => {
  const state = examState(exam);
  return toBooleanFlag(state?.allowMultipleAttempts ?? state?.allow_multiple_attempts);
};

export const hasCompletedExamAttempt = (exam: unknown): boolean => {
  const state = examState(exam);
  return toBooleanFlag(state?.isFinished ?? state?.is_finished) || toBooleanFlag(state?.attended);
};

export const isExamAttemptLocked = (exam: unknown): boolean =>
  hasCompletedExamAttempt(exam) && !allowsMultipleExamAttempts(exam);

export const parseExamDateTime = (value: unknown): number | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  const timestamp = new Date(value.trim().replace(" ", "T")).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

export const getExamAvailability = (
  exam: unknown,
  now = Date.now(),
): ExamAvailability => {
  const state = examState(exam);
  const start = parseExamDateTime(state?.startTime ?? state?.start_time);
  const end = parseExamDateTime(state?.endTime ?? state?.end_time);

  if (end !== null && now >= end) return "expired";
  if (start !== null && now < start) return "upcoming";
  return "open";
};
