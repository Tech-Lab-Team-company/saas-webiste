<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  src: string; // مسار الصوت
  qIndex: number; // فهرس السؤال
  aIndex: number; // فهرس الإجابة
  icon: any; // أيقونة التشغيل
  iconone: any; // أيقونة الإيقاف
  pauseOthers: (qIndex: number, aIndex: number) => void; // دالة لإيقاف الصوتيات الأخرى
}>();

const emit = defineEmits<{
  (e: "toggle-play", qIndex: number, aIndex: number, isPlaying: boolean): void;
  (e: "select-answer", qIndex: number, aIndex: number): void;
}>();

// حالة الصوت الخاصة بهذا المكون فقط
const audioState = ref({
  isPlaying: false,
  audio: null as HTMLAudioElement | null,
  currentTime: 0,
  duration: 0,
  activeWaves: 0,
  totalWaves: 80,
});

const initAudio = () => {
  const audio = new Audio(props.src);

  audio.addEventListener("loadedmetadata", () => {
    audioState.value.duration = audio.duration || 0;
  });

  audio.addEventListener("timeupdate", () => {
    audioState.value.currentTime = audio.currentTime;
    audioState.value.activeWaves = Math.floor(
      (audio.currentTime / audioState.value.duration) * audioState.value.totalWaves
    );
  });

  audio.addEventListener("ended", () => {
    Object.assign(audioState.value, {
      isPlaying: false,
      currentTime: 0,
      activeWaves: 0,
    });
    emit("toggle-play", props.qIndex, props.aIndex, false);
  });

  audio.addEventListener("error", (e) => {
    console.error("Error loading audio:", e);
  });

  audioState.value.audio = audio;
};

onMounted(() => {
  initAudio();
});

onBeforeUnmount(() => {
  if (audioState.value.audio) {
    audioState.value.audio.pause();
    audioState.value.audio = null;
  }
});

const togglePlay = async () => {
  if (!audioState.value.audio) return console.error("Audio not initialized");

  if (audioState.value.isPlaying) {
    audioState.value.audio.pause();
    audioState.value.isPlaying = false;
    audioState.value.activeWaves = Math.floor(
      (audioState.value.audio.currentTime / audioState.value.duration) * audioState.value.totalWaves
    );
    emit("toggle-play", props.qIndex, props.aIndex, false);
  } else {
    props.pauseOthers(props.qIndex, props.aIndex); // إيقاف الصوتيات الأخرى
    await audioState.value.audio.play();
    audioState.value.isPlaying = true;
    emit("toggle-play", props.qIndex, props.aIndex, true);
    emit("select-answer", props.qIndex, props.aIndex);
  }
};

const seekAudio = (event: MouseEvent) => {
  if (!audioState.value.audio || !audioState.value.duration) return;

  const waveform = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const clickX = event.clientX - waveform.left;
  const waveformWidth = waveform.width;
  const seekPosition = (clickX / waveformWidth) * audioState.value.duration;

  audioState.value.audio.currentTime = seekPosition;
  audioState.value.currentTime = seekPosition;
  audioState.value.activeWaves = Math.floor(
    (seekPosition / audioState.value.duration) * audioState.value.totalWaves
  );
};

// دالة لإيقاف الصوت الحالي (تُستخدم من المكون الرئيسي عبر pauseOthers)
const pauseSelf = () => {
  if (audioState.value.audio && audioState.value.isPlaying) {
    audioState.value.audio.pause();
    audioState.value.isPlaying = false;
    audioState.value.activeWaves = Math.floor(
      (audioState.value.audio.currentTime / audioState.value.duration) * audioState.value.totalWaves
    );
    emit("toggle-play", props.qIndex, props.aIndex, false);
  }
};

// تعريض دالة pauseSelf للمكون الرئيسي
defineExpose({
  pauseSelf,
});
</script>

<template>
  <div class="audio-player">
    <div @click.stop="togglePlay" class="play-btn">
      <span v-if="!audioState.isPlaying" class="audio-icon">
        <component :is="props.icon" />
      </span>
      <span v-else class="audio-icon">
        <component :is="props.iconone" />
      </span>
    </div>

    <div class="waveform" @click.stop="seekAudio($event)">
      <span
        v-for="i in audioState.totalWaves"
        :key="i"
        class="wave"
        :class="{ active: i <= audioState.activeWaves }"
      ></span>
    </div>
  </div>
</template>

<style scoped>
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
  cursor: pointer;
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

.audio-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>