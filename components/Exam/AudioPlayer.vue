<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import RightArrowIcon from "~/public/icons/RightArrowIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import MusicIcon from "~/public/icons/music.vue";

const answer1 = new URL("@/assets/audio/answer.mp3", import.meta.url).href;

const SelectedAnswer = ref<number[]>([]);
const QuestionIndex = ref(0);

const questions = ref([
  {
    questionNumber: "السؤال الاول",
    questionText: "اي من المقاطع التالية هو الصحيح؟",
    answers: [
      { label: " (1)", audio: answer1, icon: MusicIcon },
      { label: " (2)", audio: answer1, icon: MusicIcon },
      { label: " (3)", audio: answer1, icon: MusicIcon },
      { label: " (4)", audio: answer1, icon: MusicIcon },
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

const audioStates = ref(
  questions.value.map((question) =>
    question.answers.map(() => ({
      isPlaying: false,
      audio: null as HTMLAudioElement | null,
      currentTime: 0,
      duration: 0,
      activeWaves: 0,
      totalWaves: 80,
    }))
  )
);

onMounted(() => {
  questions.value.forEach((question, qIndex) => {
    question.answers.forEach((answer, aIndex) => {
      const audioState = audioStates.value[qIndex][aIndex];
      try {
        audioState.audio = new Audio(answer.audio);
        audioState.audio.addEventListener("loadedmetadata", () => {
          audioState.duration = audioState.audio!.duration || 0;
          console.log(`Loaded metadata for question ${qIndex}, answer ${aIndex}: duration ${audioState.duration}`);
        });
        audioState.audio.addEventListener("timeupdate", () => {
          audioState.currentTime = audioState.audio!.currentTime;
          const progress = audioState.currentTime / audioState.duration;
          audioState.activeWaves = Math.floor(progress * audioState.totalWaves);
        });
        audioState.audio.addEventListener("ended", () => {
          audioState.isPlaying = false;
          audioState.currentTime = 0;
          audioState.activeWaves = 0;
          console.log(`Audio ended for question ${qIndex}, answer ${aIndex}`);
        });
        audioState.audio.addEventListener("error", (e) => {
          console.error("Error loading audio:", e);
        });
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      }
    });
  });
});

onBeforeUnmount(() => {
  audioStates.value.forEach((questionStates) => {
    questionStates.forEach((state) => {
      if (state.audio) {
        state.audio.pause();
        state.audio = null;
      }
    });
  });
});

const togglePlay = async (qIndex: number, aIndex: number) => {
  const audioState = audioStates.value[qIndex][aIndex];
  if (!audioState.audio) {
    console.error("Audio not initialized for", qIndex, aIndex);
    return;
  }

  try {
    if (audioState.isPlaying) {
      audioState.audio.pause();
      audioState.audio.currentTime = 0; 
      audioState.currentTime = 0;
      audioState.activeWaves = 0;
      audioState.isPlaying = false;
      console.log(`Paused audio for question ${qIndex}, answer ${aIndex}`);
    } else {

      audioStates.value[qIndex].forEach((state, index) => {
        if (index !== aIndex && state.isPlaying) {
          state.audio?.pause();
          state.audio.currentTime = 0;
          state.currentTime = 0;
          state.activeWaves = 0;
          state.isPlaying = false;
          console.log(`Paused previous audio for question ${qIndex}, answer ${index}`);
        }
      });
      await audioState.audio.play();
      audioState.isPlaying = true;
      console.log(`Playing audio for question ${qIndex}, answer ${aIndex}`);
    }
  } catch (error) {
    console.error("Error in togglePlay:", error);
  }
};

const resetAudioForQuestion = (qIndex: number) => {
  audioStates.value[qIndex].forEach((state) => {
    if (state.audio) {
      state.audio.pause();
      state.audio.currentTime = 0;
      state.isPlaying = false;
      state.currentTime = 0;
      state.activeWaves = 0;
    }
  });
  console.log(`Reset audio for question ${qIndex}`);
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

const selectAnswer = (index: number) => {
  SelectedAnswer.value[QuestionIndex.value] = index;
};
</script>

<template>
  <div class="question-container">
    <div class="question-title">
      <p class="question-number">{{ questions[QuestionIndex].questionNumber }}</p>
      <p class="question-text">{{ questions[QuestionIndex].questionText }}</p>
    </div>

    <form>
      <div class="questions">
        <div v-for="(answer, index) in questions[QuestionIndex].answers" :key="index" class="question">
          <label :class="SelectedAnswer[QuestionIndex] === index ? 'selected' : ''" @click.stop="selectAnswer(index)">
            <button type="button">
                <div class="audio-player">
                  <div @click.stop="togglePlay(QuestionIndex, index)" class="play-btn">
                    <span v-if="!audioStates[QuestionIndex][index].isPlaying">
                      <img style="justify-self: anchor-center;" width="15" height="15" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/play.png" alt="play"/>
                    </span>
                    <span v-else>
                      <img style="justify-self: anchor-center;" width="15" height="15" src="https://img.icons8.com/glyph-neue/64/FFFFFF/stop.png" alt="stop"/>
                    </span>
                  </div>

                  <div class="waveform">
                    <span
                      v-for="i in 80"
                      :key="i"
                      class="wave"
                      :class="{ active: i <= audioStates[QuestionIndex][index].activeWaves }"
                    ></span>
                  </div>
                </div>
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

.audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff2dc;
  padding: 10px;
  border-radius: 20px;
  width: 20em;
  justify-self: center;
  direction: ltr;
}

.play-btn {
  background: #d38911;
  color: white;
  border-radius: 50%;
  border: none;
  width: 35px;
  height: 35px;
  font-size: 18px;
  cursor: pointer;
  align-content: center;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-grow: 1;
}
.wave {
  width: 2.5px;
  height: 10px;
  background-color: #909dad;
  border-radius: 2px;
  display: inline-block;
  transition: background-color 0.3s ease;
}
.wave.active {
  background-color: #000;
}
.wave:nth-child(2n) {
  height: 15px;
}
.wave:nth-child(3n) {
  height: 20px;
}
.wave:nth-child(5n) {
  height: 25px;
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