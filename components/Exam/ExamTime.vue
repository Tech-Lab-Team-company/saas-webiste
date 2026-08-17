<script setup lang="ts">
import type ExamDetailsModel from "~/features/FetchExams/Data/models/exam_details_model";

const props = defineProps<{
  examDetails: ExamDetailsModel;
}>();

const router = useRouter();
const questionIndex = ref(0);
const remainingTimeMinutes = ref(0);
const remainingTimeSeconds = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const examId = Number(router.currentRoute.value.params.exam);
const startTimeKey = `exam-start-${examId}`;

const questionCount = computed(() => props.examDetails.questions?.length || 1);
const hasTimeLimit = computed(() => props.examDetails.isTimeRequired);
const progressPercentage = computed(() =>
  Math.min(100, ((questionIndex.value + 1) / questionCount.value) * 100),
);

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const updateTimer = (endTime: number) => {
  const diff = endTime - Date.now();

  if (diff <= 0) {
    stopTimer();
    localStorage.removeItem(startTimeKey);
    remainingTimeMinutes.value = 0;
    remainingTimeSeconds.value = 0;
    void router.push(`/course/${router.currentRoute.value.params.id}`);
    return;
  }

  remainingTimeMinutes.value = Math.floor(diff / 1000 / 60);
  remainingTimeSeconds.value = Math.floor((diff % 60000) / 1000);
};

const startTimer = () => {
  stopTimer();

  if (!hasTimeLimit.value) {
    localStorage.removeItem(startTimeKey);
    return;
  }

  const storedStart = localStorage.getItem(startTimeKey);
  const startTime = storedStart ? Number(storedStart) : Date.now();

  if (!storedStart) {
    localStorage.setItem(startTimeKey, startTime.toString());
  }

  const duration = Math.max(0, Number(props.examDetails.duration) || 0);
  const endTime = startTime + duration * 60 * 1000;
  updateTimer(endTime);
  timerInterval = setInterval(() => updateTimer(endTime), 1000);
};

onMounted(startTimer);
watch(
  () => [props.examDetails.isTimeRequired, props.examDetails.duration],
  startTimer,
);
onBeforeUnmount(stopTimer);
</script>

<template>
  <section class="exam-workspace">
    <div class="exam-status" :class="{ 'exam-status--untimed': !hasTimeLimit }">
      <div class="exam-status__item">
        <span class="exam-status__icon">
          <i class="pi pi-clock" aria-hidden="true"></i>
        </span>
        <div>
          <small>{{ hasTimeLimit ? "المدة الكاملة" : "نظام الوقت" }}</small>
          <strong>{{ hasTimeLimit ? `${examDetails.duration} دقيقة` : "بدون وقت محدد" }}</strong>
        </div>
      </div>

      <div v-if="hasTimeLimit" class="exam-status__item exam-status__item--remaining" aria-live="polite">
        <span class="exam-status__icon">
          <i class="pi pi-hourglass" aria-hidden="true"></i>
        </span>
        <div>
          <small>الوقت المتبقي</small>
          <strong>
            {{ remainingTimeMinutes }}:{{ remainingTimeSeconds.toString().padStart(2, "0") }}
          </strong>
        </div>
      </div>
    </div>

    <div class="exam-progress">
      <div class="exam-progress__labels">
        <span>تقدم الامتحان</span>
        <b>{{ questionIndex + 1 }} / {{ questionCount }}</b>
      </div>
      <div
        class="exam-progress__track"
        role="progressbar"
        :aria-valuenow="questionIndex + 1"
        aria-valuemin="1"
        :aria-valuemax="questionCount"
      >
        <span :style="{ width: `${progressPercentage}%` }"></span>
      </div>
    </div>

    <ExamQuestionsText
      :question-details-data="examDetails"
      @SendAnswerIndex="questionIndex = $event"
    />
  </section>
</template>

<style scoped lang="scss">
.exam-workspace {
  margin-top: 18px;
}

.exam-status {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
  border-radius: 20px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 14px 42px rgb(8 27 58 / 6%);
}

.exam-status--untimed {
  grid-template-columns: 1fr;
}

.exam-status__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 14px;
  background: var(--home-v2-paper, var(--app-bg-muted, #f4f6fa));

  small,
  strong {
    display: block;
  }

  small {
    margin-bottom: 3px;
    color: var(--home-v2-muted, var(--app-muted, #65738a));
    font-size: 13px;
  }

  strong {
    color: var(--home-v2-ink, var(--app-text, #081b3a));
    font-size: 17px;
  }
}

.exam-status__item--remaining {
  background: color-mix(in srgb, #ff785b 10%, var(--home-v2-surface, #fff));

  strong {
    color: #d6533a;
    direction: ltr;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

.exam-status__icon {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  color: var(--home-v2-blue, var(--primary-color, #28366c));
  border-radius: 12px;
  background: color-mix(in srgb, var(--home-v2-blue, #28366c) 12%, transparent);
}

.exam-progress {
  margin: 18px 2px 24px;
}

.exam-progress__labels {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 9px;
  color: var(--home-v2-muted, var(--app-muted, #65738a));
  font-size: 13px;

  b {
    color: var(--home-v2-ink, var(--app-text, #081b3a));
  }
}

.exam-progress__track {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--home-v2-line, var(--app-line, #e2e7ef));

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ff785b, var(--home-v2-blue, #28366c));
    transition: width 320ms ease;
  }
}

@media (max-width: 620px) {
  .exam-status {
    grid-template-columns: 1fr;
    padding: 10px;
    border-radius: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .exam-progress__track span {
    transition: none;
  }
}
</style>
