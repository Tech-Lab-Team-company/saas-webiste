<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import RightArrowIcon from "~/public/icons/RightArrowIcon.vue";
import LeftArrowIcon from "~/public/icons/LeftArrowIcon.vue";
import MusicIcon from "~/public/icons/music.vue";
import MusicIconone from "~/public/icons/musicone.vue";


const answer1 = new URL("@/assets/audio/answer.mp3", import.meta.url).href;

const SelectedAnswer = ref<number[]>([]);
const QuestionIndex = ref(0);

const questions = ref([
  {
    questionNumber: "السؤال الاول",
    questionText: "اي من المقاطع التالية هو الصحيح؟",
    answers: [
      { label: " (1)", audio: answer1, icon: MusicIcon, iconone: MusicIconone },
      { label: " (2)", audio: answer1, icon: MusicIcon ,iconone: MusicIconone},
      { label: " (3)", audio: answer1, icon: MusicIcon ,iconone: MusicIconone},
      { label: " (4)", audio: answer1, icon: MusicIcon ,iconone: MusicIconone},
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
  questions.value.map((q) =>
    q.answers.map(() => ({
      isPlaying: false,
      audio: null as HTMLAudioElement | null,
      currentTime: 0,
      duration: 0,
      activeWaves: 0,
      totalWaves: 80,
    }))
  )
);

const initAudio = (qIndex: number, aIndex: number, src: string) => {
  const state = audioStates.value[qIndex][aIndex];
  const audio = new Audio(src);

  audio.addEventListener("loadedmetadata", () => {
    state.duration = audio.duration || 0;
  });

  audio.addEventListener("timeupdate", () => {
    state.currentTime = audio.currentTime;
    state.activeWaves = Math.floor(
      (audio.currentTime / state.duration) * state.totalWaves
    );
  });

  audio.addEventListener("ended", () => {
    Object.assign(state, {
      isPlaying: false,
      currentTime: 0,
      activeWaves: 0,
    });
  });

  audio.addEventListener("error", (e) => {
    console.error("Error loading audio:", e);
  });

  state.audio = audio;
};

onMounted(() => {
  questions.value.forEach((q, qi) =>
    q.answers.forEach((a, ai) => initAudio(qi, ai, a.audio))
  );
});

onBeforeUnmount(() => {
  audioStates.value.flat().forEach((state) => {
    state.audio?.pause();
    state.audio = null;
  });
});

const togglePlay = async (qIndex: number, aIndex: number) => {
  const state = audioStates.value[qIndex][aIndex];
  if (!state.audio) return console.error("Audio not initialized");

  const pauseState = (s: typeof state) => {
    s.audio?.pause();
    Object.assign(s, {
      isPlaying: false,
      currentTime: 0,
      activeWaves: 0,
    });
    if (s.audio) s.audio.currentTime = 0;
  };

  if (state.isPlaying) {
  pauseState(state);
} else {
  audioStates.value[qIndex].forEach((s, i) => i !== aIndex && pauseState(s));
  await state.audio.play();
  state.isPlaying = true;

  SelectedAnswer.value[qIndex] = aIndex;
}

};

const resetAudioForQuestion = (qIndex: number) => {
  audioStates.value[qIndex].forEach((s) => {
    if (s.audio) {
      s.audio.pause();
      s.audio.currentTime = 0;
    }
    Object.assign(s, {
      isPlaying: false,
      currentTime: 0,
      activeWaves: 0,
    });
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

const selectAnswer = (index: number) => {
  SelectedAnswer.value[QuestionIndex.value] = index;
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
            @click.stop="selectAnswer(index)"
          >
            <button type="button">
              <div class="audio-player">
                <div
                  @click.stop="togglePlay(QuestionIndex, index)"
                  class="play-btn"
                >
                  <span v-if="!audioStates[QuestionIndex][index].isPlaying" class="audio-icon">
                    <component :is="answer.icon" />
                  </span>
                  <span v-else class="audio-icon">
                    <component :is="answer.iconone" />

                  </span>
                </div>

                <div class="waveform">
                  <span
                    v-for="i in 80"
                    :key="i"
                    class="wave"
                    :class="{
                      active:
                        i <= audioStates[QuestionIndex][index].activeWaves,
                    }"
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

.audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff2dc;
  padding: 10px;
  border-radius: 15px;

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

.audio-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
