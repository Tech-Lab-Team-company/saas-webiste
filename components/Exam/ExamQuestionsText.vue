<script setup lang="ts">
import RightArrowIcon from "~/public/icons/RightArrowIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import type ExamDetailsModel from "~/features/FetchExams/Data/models/exam_details_model";
import QuestionAnswerController from "~/features/SubmitQuestionAnswer/presentation/controllers/submit_question_answer_controller";
import QuestionAnswerParams from "~/features/SubmitQuestionAnswer/Core/Params/submit_question_answer_params";
import { ExamShuffleStatus } from "../CourseDetails/Enum/Exam_status_enum";
import type QuestionsModel from "~/features/FetchExams/Data/models/questions_model";

const SelectedAnswer = ref<string[]>([]);
const CorrectAnswers = ref<(boolean | null)[]>([]);
const QuestionIndex = ref(0);
const props = defineProps({
  questionDetailsData: {
    type: Object as () => ExamDetailsModel | null,
    default: null,
  },
  remainingTimeMinutes: {
    type: Number,
  },
});
const RemainingTimeMinutes = ref<Number>(props.remainingTimeMinutes ?? 0);

const questionDetails = ref(props.questionDetailsData);

watch(
  () => props.questionDetailsData,
  (newValue) => {
    questionDetails.value = newValue;
    // GetExamShuffleStatus();
  },
  { immediate: true },
);

const emit = defineEmits(["SendAnswerIndex"]);
const SendEmit = () => {
  emit("SendAnswerIndex", QuestionIndex.value);
};

const selected = ref<(number | undefined)[]>([]);

const router = useRouter();
const toast = useToast();

const checkIsCorrectAnswer = (answerId: number, question: QuestionsModel) => {
  // const question = [...questionDetails.value?.questions[QuestionIndex.value]];

  // console.log(question, "question");
  return question?.answers?.find((answer) => answer.id === answerId)?.correct;
};

const sendData = async (status: string) => {
  // console.log(selected.value[QuestionIndex.value])
  const questionAnswerParams = new QuestionAnswerParams(
    Number(router.currentRoute.value.params.exam),
    Number(questionDetails?.value?.questions[QuestionIndex.value]?.id),
    selected.value[QuestionIndex.value] ?? 0,
  );
  const questionAnswerController = QuestionAnswerController.getInstance();
  if (selected.value[QuestionIndex.value] !== undefined) {
    // console.log("SubmitQuestionAnswer");
    const state = await questionAnswerController.SubmitQuestionAnswer(
      questionAnswerParams || null,
      status || " ",
    );
    const isCorrect = checkIsCorrectAnswer(
      questionAnswerParams.AnswerId,
      state.value.data,
    );
    CorrectAnswers.value[QuestionIndex.value] = isCorrect;
    // console.log("checkIsCorrectAnswer", isCorrect);
  }
};

const IncreaseIndex = () => {
  if (
    QuestionIndex.value <
    (questionDetails.value?.questions?.length ?? 0) - 1
  ) {
    QuestionIndex.value++;
    SendEmit();
  }
};

const SubmitAndIncrease = async () => {
  if (selected.value[QuestionIndex.value] == undefined) {
    toast.add({
      severity: "info",
      summary: "تنبيه",
      detail: "يجب اختيار إجابة",
      life: 3000,
    });

    return;
  }

  await sendData("");

  if (
    QuestionIndex.value <
    (questionDetails.value?.questions?.length ?? 0) - 1
  ) {
    QuestionIndex.value++;
    SendEmit();
  }
};

const EndExam = () => {
  sendData("final");
  if (selected.value[QuestionIndex.value] == undefined) {
    toast.add({
      severity: "info",
      summary: "تنبيه",
      detail: "يجب اختيار إجابة",
      life: 3000,
    });

    return;
  } else if (
    QuestionIndex.value <
    (questionDetails.value?.questions?.length ?? 0) - 1
  ) {
    QuestionIndex.value++;
    if (!selected.value[QuestionIndex.value]) {
      toast.add({
        severity: "info",
        summary: "تنبيه",
        detail: "يجب اختيار إجابة",
        life: 3000,
      });
    }
  }
  SendEmit();
  // router.push(``)
  router.push(`/course/${router.currentRoute.value.params.id}`);
};

const DeacreseIndes = () => {
  if (QuestionIndex.value > 0) {
    if (QuestionIndex.value > -1) {
      QuestionIndex.value--;
    }
  }
  SendEmit();
};

watch(
  () => props.remainingTimeMinutes,
  (NewValue) => {
    RemainingTimeMinutes.value = NewValue ?? 0;
  },
);

const GetExamShuffleStatus = () => {
  if (
    questionDetails.value?.allow_shuffle == 1 &&
    questionDetails.value?.edit_answer == 1
  ) {
    return ExamShuffleStatus.shuffleAndEdit;
  } else if (
    questionDetails.value?.allow_shuffle == 1 &&
    questionDetails.value?.edit_answer == 0
  ) {
    return ExamShuffleStatus.ShuffleOnly;
  } else {
    return ExamShuffleStatus.NoShuffleNoEdit;
  }
};

const examStatus = computed(() => GetExamShuffleStatus());

const canNavigateBack = computed(
  () =>
    examStatus.value === ExamShuffleStatus.shuffleAndEdit ||
    examStatus.value === ExamShuffleStatus.ShuffleOnly,
);

const canEdit = computed(
  () => examStatus.value === ExamShuffleStatus.shuffleAndEdit,
);

const canSelectAnswer = computed(
  () => canEdit.value || selected.value[QuestionIndex.value] === undefined,
);

const selectAnswer = (answerId: number) => {
  if (!canSelectAnswer.value) return;
  SelectedAnswer.value[QuestionIndex.value] = `${answerId}`;
  selected.value[QuestionIndex.value] = answerId;
  // Clear correctness state if user changes answer
  CorrectAnswers.value[QuestionIndex.value] = null;
};

const answerLabels = ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح"];
const answerLabel = (index: number) => answerLabels[index] || `${index + 1}`;
</script>

<template>
  <div
    v-if="questionDetails?.questions?.length"
    class="question-container"
  >
    <div class="question-title">
      <div class="question-number">
        <span>{{ `السؤال ${QuestionIndex + 1}` }}</span>
        <small>من {{ questionDetails.questions.length }}</small>
      </div>

      <img
        v-if="questionDetails?.questions[QuestionIndex].image"
        :src="questionDetails?.questions[QuestionIndex].image"
        alt="image"
      />

      <p
        class="question-text"
        dir="auto"
        v-html="questionDetails?.questions[QuestionIndex].question"
      ></p>
    </div>
    <form>
      <div class="questions-img">
        <div
          class="question-img"
          v-for="(answer, index) in questionDetails?.questions[QuestionIndex]
            .answers"
          :key="index"
        >
          <div v-if="answer.image" class="question-img">
            <img
              :src="answer?.image"
              width="150"
              height="150"
              :for="`answer-${answer.id}`"
              @click="selectAnswer(answer.id)"
              :class="[
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? `selected-img`
                  : ``,
                CorrectAnswers[QuestionIndex] !== null &&
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? CorrectAnswers[QuestionIndex]
                    ? 'success-img'
                    : 'danger-img'
                  : '',
              ]"
              :style="
                !canSelectAnswer ? 'cursor: not-allowed; opacity: 0.7;' : ''
              "
            />

            <label
              :for="`answer-${answer.id}`"
              @click.prevent="selectAnswer(answer.id)"
              :class="[
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? `selected`
                  : ``,
                CorrectAnswers[QuestionIndex] !== null &&
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? CorrectAnswers[QuestionIndex]
                    ? 'success'
                    : 'danger'
                  : '',
              ]"
            >
              <span class="answer-choice__marker">{{ answerLabel(index) }}</span>
              <span
                class="answer-choice__content"
                dir="auto"
                v-html="answer?.answer"
              ></span>
            </label>

            <input
              class="answer"
              :checked="selected[QuestionIndex] === answer.id"
              type="radio"
              :value="answer.id"
              name="answer"
              :id="`answer-${answer.id}`"
              :disabled="!canSelectAnswer"
            />
          </div>
        </div>
      </div>

      <div class="questions">
        <div
          class="question"
          v-for="(answer, index) in questionDetails?.questions[QuestionIndex]
            .answers"
          :key="index"
        >
          <div class="answer-text" v-if="!answer.image">
            <label
              :for="`answer-${answer.id}`"
              @click.prevent="selectAnswer(answer.id)"
              :class="[
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? `selected`
                  : ``,
                CorrectAnswers[QuestionIndex] !== null &&
                SelectedAnswer[QuestionIndex] == `${answer.id}`
                  ? CorrectAnswers[QuestionIndex]
                    ? 'success'
                    : 'danger'
                  : '',
              ]"
            >
              <span class="answer-choice__marker">{{ answerLabel(index) }}</span>
              <span
                class="answer-choice__content"
                dir="auto"
                v-html="answer?.answer"
              ></span>
              <i
                v-if="SelectedAnswer[QuestionIndex] == `${answer.id}`"
                class="pi pi-check answer-choice__check"
                aria-hidden="true"
              ></i>
            </label>
            <input
              class="answer"
              :checked="selected[QuestionIndex] === answer.id"
              type="radio"
              :value="answer.id"
              name="answer"
              :id="`answer-${answer.id}`"
              :disabled="!canSelectAnswer"
            />
          </div>
        </div>
      </div>
    </form>

    <div class="btns">
      <!-- Previous Button (Only for shuffle/edit exams) -->
      <button
        type="button"
        v-if="canNavigateBack && QuestionIndex > 0"
        @click="DeacreseIndes"
      >
        <RightArrowIcon />
        {{ $t("السابق") }}
      </button>

      <!-- Next Button (No Submit - for shuffle/edit exams) -->
      <button
        type="button"
        v-if="
          canNavigateBack &&
          QuestionIndex < (questionDetails?.questions?.length ?? 0) - 1
        "
        @click="IncreaseIndex"
      >
        <LeftArrowIcon />
        {{ $t("التالي") }}
      </button>

      <!-- Submit Answer Button (Manual submit - for shuffle/edit exams) -->
      <button
        type="button"
        v-if="
          canNavigateBack &&
          QuestionIndex < (questionDetails?.questions?.length ?? 0) - 1
        "
        @click="sendData"
        class="btn-submit"
      >
        {{ $t("ارسال الاجابة") }}
      </button>

      <!-- Next Button (With Submit - for standard exams) -->
      <button
        type="button"
        v-if="
          !canNavigateBack &&
          QuestionIndex < (questionDetails?.questions?.length ?? 0) - 1
        "
        :class="!canNavigateBack ? 'w-full' : ''"
        @click="SubmitAndIncrease"
      >
        <LeftArrowIcon />
        {{ $t("التالي") }}
      </button>

      <!-- Final Submit Button (For all exam types at the end) -->
      <button
        type="button"
        v-if="QuestionIndex === (questionDetails?.questions?.length ?? 0) - 1"
        :class="
          !canNavigateBack || questionDetails?.questions?.length < 2
            ? 'w-50'
            : ''
        "
        @click="EndExam"
      >
        {{ $t("ارسال الاجابة و انهاء الامتحان") }}
      </button>
    </div>
  </div>

  <div v-else class="no-content question-container">
    <i class="pi pi-list-check" aria-hidden="true"></i>
    <p>لا توجد أسئلة متاحة في هذا الامتحان.</p>
  </div>
</template>

<style scoped lang="scss">
.questions-img {
  display: grid;
  grid-template-columns: 1fr;
  // width: 60%;
  margin-left: auto;
  margin-right: auto;
  gap: 20px;

  .question-img {
    .question-img {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;

      img {
        border-radius: 10px;
        cursor: pointer;
      }

      label {
        border: 1px solid #dde1e6;
        border-radius: 10px;
        padding: 12px;
        width: 50%;
        margin-inline: 10px;
        text-align: right;
        cursor: pointer;

        &.selected {
          border: 2px solid var(--secondary-color);
        }
      }
      .answer {
        display: none;
        width: 100%;
      }
    }
  }
}

.answer-img {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;

  img {
    width: 150px;
    height: 150px;
    border-radius: 10px;
  }
}

.questions {
  flex-wrap: wrap;

  .question {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .answer-text {
      display: flex;
      width: 100%;
      text-align: center;
      .answer {
        width: 100%;
      }
    }
  }
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;

  button {
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &.btn-submit {
      background-color: var(--secondary-color);
      color: white;
      border: none;
    }
  }
}

label {
  &.success {
    border: 2px solid #28a745 !important;
    background-color: #d4edda;
  }
  &.danger {
    border: 2px solid #dc3545 !important;
    background-color: #f8d7da;
  }
}

img {
  &.success-img {
    border: 5px solid #28a745 !important;
  }
  &.danger-img {
    border: 5px solid #dc3545 !important;
  }
}

.selected-img {
  border: 5px solid var(--secondary-color);
}

.w-full {
  width: 100% !important;
}

.w-50 {
  width: 50% !important;
}

.no-content {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    font-size: 20px;
    font-weight: 600;
    color: #80808096;
  }
}

.no-content.question-container {
  min-height: 260px;
  height: auto;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  text-align: center;

  i {
    color: var(--home-v2-blue, var(--primary-color, #28366c));
    font-size: 38px;
  }

  p {
    width: auto;
    margin: 0;
    color: var(--home-v2-muted, var(--app-muted, #65738a));
  }
}

.finish-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  gap: 10px;

  .back-btn {
    display: flex;
  }

  button {
    width: 50%;
  }
}

.success {
  background-color: #28a74677 !important;
  border: 2px solid #28a745 !important;
}
.danger {
  background-color: #dc354588 !important;
  border: 2px solid #dc3545 !important;
}

/* Modern exam card overrides */
.question-container {
  padding: clamp(20px, 4vw, 38px);
  color: var(--home-v2-ink, var(--app-text, #081b3a));
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
  border-radius: 24px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 20px 60px rgb(8 27 58 / 8%);
}

.question-title {
  align-items: stretch !important;
  gap: 0 !important;
  margin-bottom: 28px;

  > img {
    display: block;
    width: min(100%, 640px);
    max-height: 380px;
    margin: 20px auto;
    object-fit: contain;
    border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
    border-radius: 18px;
  }
}

.question-container .question-title .question-number {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  width: auto;
  min-height: 34px;
  margin: 0 0 18px;
  padding: 7px 12px;
  color: var(--home-v2-blue, var(--primary-color, #28366c));
  border-radius: 999px;
  background-image: none;
  background: color-mix(in srgb, var(--home-v2-blue, #28366c) 11%, transparent);
  font-size: 14px;
  font-weight: 800;

  small {
    padding-inline-start: 8px;
    color: var(--home-v2-muted, var(--app-muted, #65738a));
    border-inline-start: 1px solid var(--home-v2-line, var(--app-line, #dfe5ee));
    font-size: 12px;
    font-weight: 600;
  }
}

.question-container .question-title .question-text {
  width: min(100%, 920px);
  margin: 0;
  color: var(--home-v2-ink, var(--app-text, #081b3a));
  font-size: clamp(19px, 2.4vw, 25px);
  font-weight: 750;
  line-height: 1.85;
  text-align: start;
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
  }
}

.question-container .questions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  justify-content: stretch;
  width: min(100%, 920px);
  margin: 26px auto 0;
  gap: 14px;
}

.question-container .questions .question {
  display: block;
  width: 100%;
}

.question-container .questions .question .answer-text {
  position: relative;
  display: block;
  width: 100%;
  text-align: start;

  label {
    position: relative;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) 24px;
    align-items: center;
    gap: 13px;
    width: 100%;
    min-height: 76px;
    padding: 13px 14px;
    color: var(--home-v2-ink, var(--app-text, #081b3a));
    border: 1px solid var(--home-v2-line, var(--app-line, #dfe5ee));
    border-radius: 17px;
    background: var(--home-v2-surface, var(--app-surface, #fff));
    cursor: pointer;
    transition: border-color 180ms ease, background-color 180ms ease,
      transform 180ms ease, box-shadow 180ms ease;

    &:hover {
      border-color: color-mix(in srgb, var(--home-v2-blue, #28366c) 42%, transparent);
      background: color-mix(in srgb, var(--home-v2-blue, #28366c) 4%, var(--home-v2-surface, #fff));
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgb(8 27 58 / 8%);
    }

    &.selected {
      border: 2px solid var(--home-v2-blue, var(--primary-color, #28366c));
      background: color-mix(
        in srgb,
        var(--home-v2-blue, #28366c) 9%,
        var(--home-v2-surface, #fff)
      );
      box-shadow: 0 8px 24px color-mix(in srgb, var(--home-v2-blue, #28366c) 12%, transparent);

      .answer-choice__marker {
        color: #fff;
        border-color: var(--home-v2-blue, var(--primary-color, #28366c));
        background: var(--home-v2-blue, var(--primary-color, #28366c));
      }
    }

    :deep(p) {
      margin: 0;
    }
  }

  .answer {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }
}

.answer-choice__marker {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  color: var(--home-v2-blue, var(--primary-color, #28366c));
  border: 1px solid color-mix(in srgb, var(--home-v2-blue, #28366c) 24%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--home-v2-blue, #28366c) 8%, transparent);
  font-size: 16px;
  font-weight: 850;
  transition: inherit;
}

.answer-choice__content {
  min-width: 0;
  color: inherit;
  font-size: 17px;
  font-weight: 650;
  line-height: 1.65;
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
  }
}

.answer-choice__check {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  color: #fff;
  border-radius: 50%;
  background: var(--home-v2-blue, var(--primary-color, #28366c));
  font-size: 11px;
}

.questions-img {
  gap: 14px;
  margin-bottom: 14px;
}

.questions-img .question-img .question-img {
  align-items: stretch;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));
  border-radius: 18px;
  background: var(--home-v2-paper, var(--app-bg-muted, #f7f9fc));

  img {
    width: min(100%, 360px);
    height: auto;
    max-height: 260px;
    margin-inline: auto;
    object-fit: contain;
    border-radius: 13px;
  }

  label {
    width: 100%;
    margin: 0;
    color: var(--home-v2-ink, var(--app-text, #081b3a));
    border-color: var(--home-v2-line, var(--app-line, #e2e7ef));
    background: var(--home-v2-surface, var(--app-surface, #fff));
  }
}

label.success,
.success {
  color: #16733b !important;
  border-color: #28a745 !important;
  background: color-mix(in srgb, #28a745 14%, var(--home-v2-surface, #fff)) !important;
}

label.success .answer-choice__marker {
  color: #fff;
  border-color: #28a745;
  background: #28a745;
}

label.danger,
.danger {
  color: #b22f3b !important;
  border-color: #dc3545 !important;
  background: color-mix(in srgb, #dc3545 13%, var(--home-v2-surface, #fff)) !important;
}

label.danger .answer-choice__marker {
  color: #fff;
  border-color: #dc3545;
  background: #dc3545;
}

.question-container .btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--home-v2-line, var(--app-line, #e2e7ef));

  button {
    justify-content: center;
    min-width: 148px;
    width: auto;
    min-height: 48px;
    margin-top: 0;
    padding: 11px 20px;
    color: #fff;
    border: 1px solid transparent;
    border-radius: 13px;
    background: var(--home-v2-blue, var(--primary-color, #28366c));
    cursor: pointer;
    box-shadow: 0 10px 24px color-mix(in srgb, var(--home-v2-blue, #28366c) 18%, transparent);

    :deep(svg path) {
      stroke: currentColor;
    }

    &:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--home-v2-blue, #28366c) 30%, transparent);
      outline-offset: 3px;
    }

    &:last-child {
      background: #df6249;
      box-shadow: 0 10px 24px rgb(223 98 73 / 20%);
    }

    &.btn-submit {
      color: var(--home-v2-blue, var(--primary-color, #28366c));
      border-color: color-mix(in srgb, var(--home-v2-blue, #28366c) 28%, transparent);
      background: transparent;
      box-shadow: none;
    }
  }
}

.w-full,
.w-50 {
  width: auto !important;
}

@media (max-width: 620px) {
  .question-container {
    padding: 20px 15px;
    border-radius: 18px;
  }

  .question-title {
    margin-bottom: 22px;
  }

  .question-container .questions {
    grid-template-columns: 1fr;
    margin-top: 20px;
  }

  .question-container .questions .question .answer-text label {
    grid-template-columns: 38px minmax(0, 1fr) 22px;
    gap: 10px;
    min-height: 66px;
    padding: 10px;
  }

  .answer-choice__marker {
    width: 38px;
    height: 38px;
  }

  .answer-choice__content {
    font-size: 15px;
  }

  .question-container .btns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    button {
      min-width: 0;
      width: 100% !important;
      padding-inline: 10px;
      font-size: 13px;
    }

    button:only-child,
    .w-full,
    .w-50,
    .btn-submit:last-child {
      grid-column: 1 / -1;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .questions .question .answer-text label,
  .btns button {
    transition: none;
  }
}
</style>
