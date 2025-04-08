<script setup lang="ts">
import { ref } from "vue";
import RightArrowIcon from "~/public/icons/RightArrowIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import MusicIcon from "~/public/icons/music.vue";
import MusicIconone from "~/public/icons/musicone.vue";
import answer1 from "~/assets/audio/answer.mp3";
import AudioPlayer from "./AudioPlayer.vue";

const SelectedAnswer = ref<number[]>([]);
const QuestionIndex = ref(0);

// تخزين مراجع لمثيلات AudioPlayer باستخدام ref
const audioPlayers = ref<InstanceType<typeof AudioPlayer>[]>([]);

const questions = ref([
  {
    questionNumber: "السؤال الاول",
    questionText: "اي من المقاطع التالية هو الصحيح؟",
    answers: [
      { label: " (1)", audio: answer1, icon: MusicIcon, iconone: MusicIconone },
      { label: " (2)", audio: answer1, icon: MusicIcon, iconone: MusicIconone },
      { label: " (3)", audio: answer1, icon: MusicIcon, iconone: MusicIconone },
      { label: " (4)", audio: answer1, icon: MusicIcon, iconone: MusicIconone },
    ],
  },
  {
    questionNumber: "السؤالثاني",
    questionText: "اي من المقاطع التالية هو الصحيح؟",
    answers: [
      { label: " (1)", audio: answer1, icon: MusicIcon },
      { label: " (2)", audio: answer1, icon: MusicIcon },
      { label: " (3)", audio: answer1, icon: MusicIcon },
      { label: " (4)", audio: answer1, icon: MusicIcon },
    ],
  },
]);

const pauseOthers = (qIndex: number, aIndex: number) => {
  audioPlayers.value.forEach((player) => {
    if (
      player &&
      (player.$props.qIndex !== qIndex || player.$props.aIndex !== aIndex)
    ) {
      player.pauseSelf(); // استدعاء دالة pauseSelf لكل AudioPlayer آخر
    }
  });
};

const resetAudioForQuestion = (qIndex: number) => {
  audioPlayers.value.forEach((player) => {
    if (player && player.$props.qIndex === qIndex) {
      player.pauseSelf();
    }
  });
};

const emit = defineEmits(["SendAnswerIndex"]);
const SendEmit = () => emit("SendAnswerIndex", QuestionIndex.value);

const IncreaseIndex = () => {
  if (QuestionIndex.value < questions.value.length - 1) {
    resetAudioForQuestion(QuestionIndex.value);
    QuestionIndex.value++;
  }
  SendEmit();
};

const DecreaseIndex = () => {
  if (QuestionIndex.value > 0) {
    resetAudioForQuestion(QuestionIndex.value);
    QuestionIndex.value--;
  }
  SendEmit();
};

const selectAnswer = (qIndex: number, aIndex: number) => {
  SelectedAnswer.value[qIndex] = aIndex;
};
</script>

<template>
  <div class="question-container">
    <div class="question-title">
      <p class="question-number">
        {{ questions[QuestionIndex].questionNumber }}
      </p>
      <p class="question-text">{{ questions[QuestionIndex].questionText }}</p>
    </div>

    <form>
      <div class="questions">
        <div
          v-for="(answer, index) in questions[QuestionIndex].answers"
          :key="index"
          class="question"
        >
          <label
            :class="SelectedAnswer[QuestionIndex] === index ? 'selected' : ''"
            @click.stop="selectAnswer(QuestionIndex, index)"
          >
            <button type="button">
              <AudioPlayer
                :src="answer.audio"
                :q-index="QuestionIndex"
                :a-index="index"
                :icon="answer.icon"
                :iconone="answer.iconone"
                :pause-others="pauseOthers"
                @toggle-play="
                  (qIndex, aIndex, isPlaying) => {
             
                  }
                "
                @select-answer="selectAnswer"
                ref="audioPlayers"
              />
            </button>
            <span>{{ answer.label }}</span>
          </label>
        </div>
      </div>
    </form>

    <div class="next-btn" v-if="QuestionIndex === 0">
      <button @click="IncreaseIndex">التالي</button>
    </div>

    <div class="btns" v-else>
      <button @click="DecreaseIndex">
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
.question-container {
  padding: 20px;
}
.question label {
  justify-content: center !important;
  direction: ltr !important;
  width: 60% !important;
}
.question-title {
  margin-bottom: 20px;
}

.questions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question label {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 18px;
  cursor: pointer;
}

.selected {
  background-color: #eee;
  border-radius: 10px;
  padding: 10px;
}

.next-btn,
.btns {
  margin-top: 20px;
}
</style>