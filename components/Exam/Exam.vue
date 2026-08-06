<script setup lang="ts">
import ExamDetailsParams from '~/features/FetchExams/Core/Params/exam_details_params';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import ExamDetailsController from '~/features/FetchExams/presentation/controllers/exam_details_controller';

const router = useRouter();
const ExamDetails = ref<ExamDetailsModel | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

const FetchExamQuestions = async () => {
  isLoading.value = true;
  hasError.value = false;

  try {
    const ExamParams = new ExamDetailsParams(
      Number(router.currentRoute.value.params.exam),
    );
    const examDetailsController = ExamDetailsController.getInstance();
    const state = await examDetailsController.FetchExamDetails(ExamParams);

    if (state.value.data) {
      ExamDetails.value = state.value.data;

      if (state.value.data.attended) {
        localStorage.removeItem(
          `exam-start-${router.currentRoute.value.params.exam}`,
        );
      }
    } else {
      hasError.value = true;
    }
  } catch {
    hasError.value = true;
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
      <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
      <h2>تعذر تحميل الامتحان</h2>
      <p>حاول مرة أخرى، وتأكد من اتصالك بالإنترنت.</p>
      <button type="button" @click="FetchExamQuestions">إعادة المحاولة</button>
    </div>

    <template v-else-if="ExamDetails.attended">
      <ExamHeader :course-data-header="ExamDetails" />
      <div class="exam-state exam-state--attended" role="status">
        <span class="exam-state__icon" aria-hidden="true">
          <i class="pi pi-check"></i>
        </span>
        <small>تم حضور الامتحان</small>
        <h2>لقد أنهيت هذا الامتحان بالفعل</h2>
        <p>لا يمكن دخول الامتحان أو إرسال الإجابات مرة أخرى.</p>
        <div v-if="ExamDetails.examMark" class="exam-state__result">
          <span>درجتك</span>
          <strong>{{ ExamDetails.mark }} / {{ ExamDetails.examMark }}</strong>
        </div>
        <button
          type="button"
          @click="router.push(`/course/${router.currentRoute.value.params.id}`)"
        >
          العودة إلى الكورس
        </button>
      </div>
    </template>

    <template v-else>
      <ExamHeader :course-data-header="ExamDetails" />
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
