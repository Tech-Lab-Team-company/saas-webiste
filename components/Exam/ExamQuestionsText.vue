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
const Answer = ref();

const props = defineProps({
  QuestionDetails: {
    type: Object as () => ExamDetailsModel | null,
    default: null,
  },
  remainingTimeMinutes: {
    type: Number,
  },
});
const RemainingTimeMinutes = ref<Number>(props.remainingTimeMinutes ?? 0);

const questionDetails = ref(props.QuestionDetails);

watch(
  () => props.QuestionDetails,
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
  console.log(answerId, "id");
  console.log(question, "question");

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
</script>

<template>
  <div class="question-container" v-if="QuestionDetails">
    <div class="question-title">
      <p class="question-number">{{ `السؤال ${QuestionIndex + 1}` }}</p>

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
              v-html="answer?.answer"
            ></label>

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
              v-html="answer?.answer"
            ></label>
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
        v-if="canNavigateBack && QuestionIndex > 0"
        @click="DeacreseIndes"
      >
        <RightArrowIcon />
        {{ $t("السابق") }}
      </button>

      <!-- Next Button (No Submit - for shuffle/edit exams) -->
      <button
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
        v-if="QuestionIndex === (questionDetails?.questions?.length ?? 0) - 1"
        :class="
          !canNavigateBack || QuestionDetails?.questions?.length < 2
            ? 'w-50'
            : ''
        "
        @click="EndExam"
      >
        {{ $t("ارسال الاجابة و انهاء الامتحان") }}
      </button>
    </div>
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
</style>
