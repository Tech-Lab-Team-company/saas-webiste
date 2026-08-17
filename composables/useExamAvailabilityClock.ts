import {
  getExamAvailability,
  type ExamAvailability,
} from "~/utils/examAttempts";

export const useExamAvailabilityClock = (refreshEveryMs = 30_000) => {
  const now = ref(Date.now());
  let interval: ReturnType<typeof setInterval> | null = null;

  const refresh = () => {
    now.value = Date.now();
  };
  const availability = (exam: unknown): ExamAvailability =>
    getExamAvailability(exam, now.value);

  onMounted(() => {
    refresh();
    interval = setInterval(refresh, refreshEveryMs);
  });
  onBeforeUnmount(() => {
    if (interval) clearInterval(interval);
  });

  return {
    availability,
    isOpen: (exam: unknown) => availability(exam) === "open",
    isExpired: (exam: unknown) => availability(exam) === "expired",
    isUpcoming: (exam: unknown) => availability(exam) === "upcoming",
  };
};
