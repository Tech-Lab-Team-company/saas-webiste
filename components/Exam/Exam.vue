<script setup lang="ts">
import ExamDetailsParams from '~/features/FetchExams/Core/Params/exam_details_params';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import ExamDetailsController from '~/features/FetchExams/presentation/controllers/exam_details_controller';
import {
  allowsMultipleExamAttempts,
  hasCompletedExamAttempt,
  getExamAvailability,
  isExamAttemptLocked,
} from '~/utils/examAttempts';

const router = useRouter();
const route = useRoute();
const ExamDetails = ref<ExamDetailsModel | null>(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const isClosedError = ref(false);

const returnRoute = computed(() => {
  const courseId = ExamDetails.value?.courseId || route.params.id;
  return courseId ? `/course/${courseId}` : '/profileexams';
});
const examLocked = computed(() => isExamAttemptLocked(ExamDetails.value));
const examAvailability = computed(() => getExamAvailability(ExamDetails.value));
const examUnavailable = computed(
  () => examLocked.value || examAvailability.value !== 'open',
);
const isRepeatAttempt = computed(() =>
  hasCompletedExamAttempt(ExamDetails.value) &&
  allowsMultipleExamAttempts(ExamDetails.value),
);
const resultValue = computed(() => {
  if (!ExamDetails.value) return '';
  if (ExamDetails.value.degreeType === 1 && ExamDetails.value.examMark) {
    return `${((ExamDetails.value.mark / ExamDetails.value.examMark) * 100).toFixed(1)}%`;
  }
  return `${ExamDetails.value.mark} / ${ExamDetails.value.examMark}`;
});

const looksLikeClosedExamError = (message: string) =>
  /already|attend|attempt|finished|closed|completed|انته|مغلق|محاولة|حضر/iu.test(message);

const readableExamError = (error: unknown) => {
  const rawMessage = error instanceof Error ? error.message : String(error ?? '');
  const message = rawMessage.trim();

  if (looksLikeClosedExamError(message)) {
    return 'لقد أنهيت هذا الامتحان، ولا يسمح المدرس بمحاولة أخرى.';
  }
  if (/forbidden|unauthorized/iu.test(message)) {
    return 'ليس لديك صلاحية لفتح هذا الامتحان.';
  }
  if (/not found/iu.test(message)) {
    return 'تعذر العثور على هذا الامتحان أو لم يعد متاحًا.';
  }
  if (!message || /unknown error/iu.test(message)) {
    return 'تعذر تحميل الامتحان الآن. تحقق من اتصالك وحاول مرة أخرى.';
  }

  return message;
};

const FetchExamQuestions = async () => {
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';
  isClosedError.value = false;

  try {
    const ExamParams = new ExamDetailsParams(
      Number(router.currentRoute.value.params.exam),
    );
    const examDetailsController = ExamDetailsController.getInstance();
    const state = await examDetailsController.FetchExamDetails(ExamParams);

    if (state.value.data) {
      ExamDetails.value = state.value.data;

      if (
        hasCompletedExamAttempt(state.value.data) ||
        getExamAvailability(state.value.data) !== 'open'
      ) {
        localStorage.removeItem(
          `exam-start-${router.currentRoute.value.params.exam}`,
        );
      }
    } else {
      hasError.value = true;
      const message = readableExamError(state.value.error?.title);
      errorMessage.value = message;
      isClosedError.value = looksLikeClosedExamError(
        state.value.error?.title || message,
      );
    }
  } catch (error) {
    hasError.value = true;
    errorMessage.value = readableExamError(error);
    isClosedError.value = looksLikeClosedExamError(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

onMounted(FetchExamQuestions);
</script>

<template>
  <div class="exam-container" :aria-busy="isLoading">
    <div v-if="isLoading" class="exam-state" role="status">
      <span class="exam-state__spinner" aria-hidden="true"></span>
      <p>جاري تجهيز الامتحان...</p>
    </div>

    <div v-else-if="hasError || !ExamDetails" class="exam-state exam-state--error">
      <i :class="isClosedError ? 'pi pi-lock' : 'pi pi-exclamation-circle'" aria-hidden="true"></i>
      <h2>{{ isClosedError ? 'الامتحان مغلق' : 'تعذر تحميل الامتحان' }}</h2>
      <p>{{ errorMessage }}</p>
      <button v-if="!isClosedError" type="button" @click="FetchExamQuestions">
        إعادة المحاولة
      </button>
      <button v-else type="button" @click="router.push(returnRoute)">
        العودة إلى الكورس
      </button>
    </div>

    <template v-else-if="examUnavailable">
      <ExamHeader :course-data-header="ExamDetails" />
      <div class="exam-state exam-state--attended" role="status">
        <span class="exam-state__icon" aria-hidden="true">
          <i class="pi pi-check"></i>
        </span>
        <small>{{ examAvailability === 'upcoming' ? 'الامتحان لم يبدأ' : 'الامتحان مغلق' }}</small>
        <h2 v-if="examAvailability === 'upcoming'">لم يحن موعد الامتحان بعد</h2>
        <h2 v-else-if="examAvailability === 'expired'">انتهى موعد هذا الامتحان</h2>
        <h2 v-else>{{ ExamDetails.attended ? 'لقد أنهيت هذا الامتحان بالفعل' : 'لم يعد هذا الامتحان متاحًا' }}</h2>
        <p v-if="examAvailability === 'upcoming'">سيصبح الامتحان متاحًا في الموعد الذي حدده المدرس.</p>
        <p v-else-if="examAvailability === 'expired'">لا يمكن إرسال إجابات جديدة بعد انتهاء الموعد المحدد.</p>
        <p v-else>لا يسمح المدرس بمحاولة أخرى أو تعديل الإجابات بعد الإنهاء.</p>
        <div v-if="examLocked && ExamDetails.examMark" class="exam-state__result">
          <span>درجتك</span>
          <strong>{{ resultValue }}</strong>
        </div>
        <div v-if="examLocked" class="exam-state__answers" aria-label="تفاصيل الإجابات">
          <span class="exam-state__answer exam-state__answer--correct">
            <i class="pi pi-check-circle" aria-hidden="true"></i>
            {{ ExamDetails.correctAnswersCount }} صحيحة
          </span>
          <span class="exam-state__answer exam-state__answer--wrong">
            <i class="pi pi-times-circle" aria-hidden="true"></i>
            {{ ExamDetails.wrongAnswersCount }} خاطئة
          </span>
          <span class="exam-state__answer">
            <i class="pi pi-minus-circle" aria-hidden="true"></i>
            {{ ExamDetails.unansweredQuestionsCount }} بدون إجابة
          </span>
        </div>
        <button
          type="button"
          @click="router.push(returnRoute)"
        >
          العودة إلى الكورس
        </button>
      </div>
    </template>

    <template v-else>
      <ExamHeader :course-data-header="ExamDetails" />
      <div v-if="isRepeatAttempt" class="exam-repeat-notice" role="status">
        <i class="pi pi-refresh" aria-hidden="true"></i>
        <div>
          <strong>محاولة جديدة متاحة</strong>
          <p>يمكنك مراجعة إجاباتك السابقة وتعديلها ثم إرسال الامتحان مرة أخرى.</p>
        </div>
      </div>
      <ExamTime :exam-details="ExamDetails" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.exam-container {
  width: min(100%, 1120px);
  margin-inline: auto;
}

.exam-state {
  min-height: 360px;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  padding: 36px;
  text-align: center;
  color: var(--home-v2-muted, var(--app-muted, #65738a));
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
  border-radius: 24px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 18px 55px rgb(8 27 58 / 8%);

  h2,
  p {
    margin: 0;
  }

  h2 {
    color: var(--home-v2-ink, var(--app-text, #081b3a));
  }

  i {
    font-size: 36px;
    color: #d95f59;
  }

  button {
    min-height: 46px;
    padding: 0 24px;
    color: #fff;
    border: 0;
    border-radius: 12px;
    background: var(--home-v2-blue, var(--primary-color, #28366c));
    cursor: pointer;
  }
}

.exam-state__spinner {
  width: 46px;
  height: 46px;
  border: 4px solid var(--home-v2-line, #e2e7ef);
  border-top-color: var(--home-v2-blue, var(--primary-color, #28366c));
  border-radius: 50%;
  animation: exam-spin 0.8s linear infinite;
}

.exam-state--attended {
  min-height: 420px;
  margin-top: 18px;

  > small {
    color: #25834c;
    font-size: 14px;
    font-weight: 800;
  }
}

.exam-state__icon {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  margin-bottom: 4px;
  color: #fff;
  border-radius: 50%;
  background: #25834c;
  box-shadow: 0 14px 34px rgb(37 131 76 / 24%);

  i {
    color: inherit;
    font-size: 32px;
  }
}

.exam-state__result {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  padding: 12px 18px;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
  border-radius: 13px;
  background: var(--home-v2-paper, var(--app-bg-muted, #f4f6fa));

  span {
    color: var(--home-v2-muted, var(--app-muted, #65738a));
  }

  strong {
    color: var(--home-v2-ink, var(--app-text, #081b3a));
    font-size: 20px;
  }
}

.exam-repeat-notice {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 18px;
  padding: 15px 18px;
  border: 1px solid color-mix(in srgb, #25834c 34%, var(--home-v2-line, var(--app-line, #e2e7ef)));
  border-radius: 15px;
  background: color-mix(in srgb, #25834c 9%, var(--home-v2-surface, var(--app-surface, #fff)));
  color: var(--home-v2-ink, var(--app-text, #081b3a));

  > i {
    color: #25834c;
    font-size: 22px;
  }

  strong,
  p {
    display: block;
    margin: 0;
  }

  p {
    margin-top: 3px;
    color: var(--home-v2-muted, var(--app-muted, #65738a));
    font-size: 13px;
  }
}

.exam-state__answers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;

  .exam-state__answer {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    color: var(--home-v2-muted, var(--app-muted, #65738a));
    border-radius: 999px;
    background: var(--home-v2-paper, var(--app-bg-muted, #f4f6fa));
    font-size: 12px;

    i {
      color: inherit;
      font-size: 14px;
    }
  }

  .exam-state__answer--correct {
    color: #237a48;
  }

  .exam-state__answer--wrong {
    color: #b5403b;
  }
}

@keyframes exam-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .exam-state__spinner {
    animation: none;
  }
}
</style>
