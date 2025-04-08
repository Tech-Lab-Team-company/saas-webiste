<script setup lang="ts">
import RightArrowIcon from "~/public/icons/RightArrowIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import MusicIcon from "~/public/icons/music.vue"; 
const SelectedAnswer = ref<number[]>([]);
const QuestionIndex = ref(0);
import answer from "@/assets/audio/answer.mp3";

const questions = ref([
  {
    questionNumber: "السؤال الاول",
    questionText: "اي من المقاطع التالية هو الصحيح؟",
    answers: [
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
    ],
  },
  {
    questionNumber: "السؤال الثاني",
    img: "/images/background.png",
    questionText: "اختر الصوت المناسب:",
    answers: [
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
      {
        label: " (1)",
        audio: answer, 
        icon: MusicIcon,
      },
    ],
  },
]);

const emit = defineEmits(["SendAnswerIndex"]);
const SendEmit = () => emit("SendAnswerIndex", QuestionIndex.value);

const IncreaseIndex = () => {
  if (QuestionIndex.value < questions.value.length - 1) {
    QuestionIndex.value++;
  }
  SendEmit();
};

const DeacreseIndes = () => {
  if (QuestionIndex.value > 0) {
    QuestionIndex.value--;
  }
  SendEmit();
};

const audio = ref<HTMLAudioElement | null>(null);

const selectAnswer = (index: number) => {
  SelectedAnswer.value[QuestionIndex.value] = index;
  const audioSrc = questions.value[QuestionIndex.value].answers[index].audio;
 
};
</script>

<template>
  <div class="question-container">
    <div class="question-title">
      <p class="question-number">{{ questions[QuestionIndex].questionNumber }}</p>
      <img v-if="questions[QuestionIndex].img" :src="questions[QuestionIndex].img" alt="image" />
      <p class="question-text">{{ questions[QuestionIndex].questionText }}</p>
    </div>

    <form>
      <div class="questions">
        <div v-for="(answer, index) in questions[QuestionIndex].answers" :key="index" class="question">
          <label :for="`answer${index}`" @click="SelectedAnswer[QuestionIndex] = index" :class="SelectedAnswer[QuestionIndex] === index ? 'selected' : ''">
            <button type="button">
              <component :is="answer.icon" />
              <audio :src="answer.audio" controls />
            </button>
            <span>{{ answer.label }}</span>
          </label>

      
        </div>
      </div>
    </form>

    <div class="next-btn" v-if="QuestionIndex == 0">
      <button @click="IncreaseIndex">التالي</button>
    </div>

    <div class="btns" v-if="QuestionIndex > 0">
      <button @click="DeacreseIndes">
        <LeftArrowIcon />
        السابق
      </button>
      <button @click="IncreaseIndex">
        التالي
        <RightArrowIcon />
      </button>
    </div>
  </div>
</template>

<style scoped>
.question label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: "regular";
  font-weight: 400;
  font-size: 21px;
  text-align: center;
  color: #6f777b;
  direction: ltr;
}

.next-btn button {
  width: 35%;
}
.question-container{
  height: auto !important;
}
</style>
