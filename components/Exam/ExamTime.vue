<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import ExamDetailsParams from '~/features/FetchExams/Core/Params/exam_details_params';
import { QuestionTypeEnum } from '~/features/FetchExams/Core/questoin_type_enum';
import type ExamDetailsModel from '~/features/FetchExams/Data/models/exam_details_model';
import ExamDetailsController from '~/features/FetchExams/presentation/controllers/exam_details_controller';
import QuestionAnswerParams from '~/features/SubmitQuestionAnswer/Core/Params/submit_question_answer_params';
import QuestionAnswerController from '~/features/SubmitQuestionAnswer/presentation/controllers/submit_question_answer_controller';

import clockicon from '~/public/icons/clockicon.vue';
import progressIcon from '~/public/icons/progressIcon.vue';

const router = useRouter();

const questionIndex = ref(0);
const ExamDetails = ref<ExamDetailsModel | null>(null);
const RemainingTime = ref<number>(0);
const RemainingTimeMinutes = ref<number>(0);
const RemainingTimeSeconds = ref<number>(0);
const ExamTime = ref<number | null>(null);

let timerInterval: ReturnType<typeof setInterval>;

const examId = Number(router.currentRoute.value.params.exam);
const startTimeKey = `exam-start-${examId}`;

const FetchExamQuestions = async () => {
  const ExamParams = new ExamDetailsParams(Number(router.currentRoute.value.params.exam));
  const examDetailsController = ExamDetailsController.getInstance();
  const state = await examDetailsController.FetchExamDetails(ExamParams);

  if (state.value.data) {
    ExamDetails.value = state.value.data;

    const start = new Date(state.value.data.startTime).getTime();
    const end = new Date(state.value.data.endTime).getTime();
    ExamTime.value = Math.floor((end - start) / 1000 / 60);

    // startTimer(new Date().getTime() + state.value.data.duration * 60 * 1000);
  }
  let startTime: number;

  const storedStart = localStorage.getItem(startTimeKey);
  if (storedStart) {
    startTime = Number(storedStart);
  } else {
    startTime = Date.now();
    localStorage.setItem(startTimeKey, startTime.toString());
  }

  const endTime = startTime + state.value.data.duration * 60 * 1000;
  startTimer(endTime);

};


// const sendData = async (status: string) => {
//     const questionAnswerParams = new QuestionAnswerParams(
//         Number(router.currentRoute.value.params.exam),
//         null,
//         null
//     );
//     const questionAnswerController = QuestionAnswerController.getInstance()
//         const state = await questionAnswerController.SubmitQuestionAnswer(questionAnswerParams || null, status || " " );
// }

const startTimer = (endTime: number) => {
  console.log(endTime, "endtime");
  timerInterval = setInterval(() => {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) {
      clearInterval(timerInterval);
      localStorage.removeItem(startTimeKey); // Clear storage after timeout
      RemainingTime.value = 0;
      RemainingTimeMinutes.value = 0;
      RemainingTimeSeconds.value = 0;
      router.push(`/course/${router.currentRoute.value.params.id}`);
    } else {
      RemainingTime.value = diff;
      RemainingTimeMinutes.value = Math.floor(diff / 1000 / 60);
      RemainingTimeSeconds.value = Math.floor((diff % 60000) / 1000);
    }
  }, 1000);
};

onMounted(() => {
  FetchExamQuestions();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<template>
  <div class="exam-time-container">
    <div class="exam-totla-time">
      <clockicon />
      <p>{{ `${ExamDetails?.duration} min` }}</p>
    </div>

    <div class="exam-time">
      <p>علي نهايه الامتحان</p>
      <span>{{ RemainingTimeMinutes }} : {{ RemainingTimeSeconds.toString().padStart(2, '0') }} دقيقة</span>
    </div>
  </div>

  <div class="progress-bar">
    <div class="active-bar"
      :style="`width:${(questionIndex + 1) * (100 / Number(ExamDetails?.questions.length || 1))}%`"></div>
    <div class="dots">
      <div v-for="(dot, index) in ExamDetails?.questions.length" :key="index" class="dot"
        :class="questionIndex === index ? 'white' : ''"></div>
    </div>
  </div>

  <div>
    <ExamQuestionsText :remainingTimeMinutes="RemainingTimeMinutes" :QuestionDetails="ExamDetails"
      @SendAnswerIndex="questionIndex = $event" />
  </div>
</template>


<style scoped lang="scss">
.exam-time-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 20px;

  .exam-time {
    display: flex;
    align-items: center;
    gap: 6px;

    p {
      color: #D38911;
      font-size: 18px;
    }

    span {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .exam-totla-time {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    p {
      color: #6F777B;
    }
  }

}

.progress-bar {
  width: 96%;
  height: 10px;
  margin: 0 20px;
  border-radius: 10px;
  background: #E0E0E0;
  margin-top: 2px;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: -1;

  .dots {
    position: absolute;
    width: 100%;
    display: flex;
    // justify-content: space-between;
    padding: 0 5px;
    justify-content: space-between;



    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: black;
      z-index: 10;

      &:last-child {

        background-color: white !important;
      }


      //     &.white{
      //     background-color: white !important;
      //  }



      &:last-child {
        // background-color: white;
      }
    }
  }

  .active-bar {
    position: absolute;
    background-image: linear-gradient(to left, #D38911, #FFB949);
    right: 0;
    width: 10.5%;
    height: 100%;
    border-radius: 10px;
    z-index: 0;

  }


}
</style>
<!-- <div class="active-bar" :style="`width:${questionIndex * 5.2}%`"></div> -->
