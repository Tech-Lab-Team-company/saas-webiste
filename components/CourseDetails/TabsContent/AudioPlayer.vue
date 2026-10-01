<script lang="ts" setup>
const props = withDefaults(defineProps<{
  src?: string;
  sessionId?: number | null;
}>(), {
  src: "",
  sessionId: null,
});

const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const loadError = ref(false);
const watchHistory = useCourseWatchHistory(() => props.sessionId);

const audioUrl = computed(() => props.src.trim());
const progress = computed(() =>
  duration.value > 0
    ? Math.min(100, (currentTime.value / duration.value) * 100)
    : 0,
);

const readDuration = () => {
  const value = Number(audioElement.value?.duration);
  duration.value = Number.isFinite(value) && value > 0 ? value : 0;
  watchHistory.updateDuration(duration.value);
  loadError.value = false;
};

const handleTimeUpdate = () => {
  currentTime.value = audioElement.value?.currentTime || 0;
  watchHistory.updateCurrentTime(currentTime.value);
};

const handlePause = () => {
  isPlaying.value = false;
  void watchHistory.saveProgress(true);
};

const handleEnded = () => {
  isPlaying.value = false;
  currentTime.value = duration.value;
  watchHistory.markPlaybackEnded();
};

const handleError = () => {
  isPlaying.value = false;
  loadError.value = true;
};

const togglePlay = async () => {
  const audio = audioElement.value;
  if (!audio || !audioUrl.value || loadError.value) return;

  if (!audio.paused) {
    audio.pause();
    return;
  }

  try {
    await audio.play();
  } catch {
    isPlaying.value = false;
    loadError.value = true;
  }
};

const seekAudio = (event: Event) => {
  const audio = audioElement.value;
  const target = event.target as HTMLInputElement;
  if (!audio || duration.value <= 0) return;

  const nextTime = Math.min(duration.value, Math.max(0, Number(target.value)));
  audio.currentTime = nextTime;
  currentTime.value = nextTime;
  watchHistory.updateCurrentTime(nextTime);
};

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  if (["input", "textarea", "select"].includes(tagName)) return true;
  if (target.isContentEditable) return true;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="dialog"], .p-dialog',
    ),
  );
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (
    event.code === "Space" ||
    event.key === " " ||
    event.key === "Spacebar"
  ) {
    if (isInteractiveTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    void togglePlay();
  }
}

watch(audioUrl, async () => {
  isPlaying.value = false;
  currentTime.value = 0;
  duration.value = 0;
  loadError.value = false;
  await nextTick();
  audioElement.value?.load();
});

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  audioElement.value?.pause();
});

function formatTime(value: number) {
  const seconds = Number.isFinite(value) ? Math.max(0, value) : 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div class="audio-player">
    <!-- Native media loading works for playable cross-origin files without
         requiring the CORS-enabled fetch that waveform decoding needs. -->
    <audio
      ref="audioElement"
      :src="audioUrl"
      preload="metadata"
      @loadedmetadata="readDuration"
      @durationchange="readDuration"
      @timeupdate="handleTimeUpdate"
      @play="isPlaying = true"
      @pause="handlePause"
      @ended="handleEnded"
      @error="handleError"
    ></audio>

    <button
      type="button"
      class="play-audio"
      :disabled="!audioUrl || loadError"
      :aria-label="isPlaying ? 'إيقاف الصوت مؤقتًا' : 'تشغيل الصوت'"
      @click="togglePlay"
    >
      <IconsPause v-if="isPlaying" />
      <IconsPlay v-else />
    </button>

    <input
      class="audio-progress"
      type="range"
      dir="ltr"
      min="0"
      :max="duration || 0"
      step="0.1"
      :value="currentTime"
      :disabled="duration <= 0 || loadError"
      :style="{ '--audio-progress': `${progress}%` }"
      aria-label="موضع تشغيل الصوت"
      @input="seekAudio"
    />

    <p v-if="loadError" class="audio-error" role="alert">
      تعذر تحميل الملف الصوتي. حاول مرة أخرى.
    </p>

    <div class="time-display" dir="ltr">
      <span>{{ formatTime(currentTime) }}</span>
      <span>/</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.audio-player {
  width: 100%;
  height: fit-content;
  padding: 2rem 1rem 0.75rem;
  border-radius: 8px;
  background: linear-gradient(30deg, rgb(41 33 29) 0%, #000 100%);

  audio {
    display: none;
  }

  .play-audio {
    display: grid;
    width: 55px;
    height: 55px;
    padding: 0.8rem;
    border: 0;
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    background-color: rgb(240 241 244 / 40%);
    color: #fff;
    cursor: pointer;
    place-items: center;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .audio-progress {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    appearance: none;
    background: linear-gradient(
      to right,
      var(--primary-color, #ef233c) var(--audio-progress),
      rgb(240 241 244 / 35%) var(--audio-progress)
    );
    cursor: pointer;

    &::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
      border: 2px solid #fff;
      border-radius: 50%;
      appearance: none;
      background: var(--primary-color, #ef233c);
    }

    &::-moz-range-thumb {
      width: 13px;
      height: 13px;
      border: 2px solid #fff;
      border-radius: 50%;
      background: var(--primary-color, #ef233c);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  .audio-error {
    margin: 0.75rem 0 0;
    color: #ffb7bd;
    font-size: 0.9rem;
    text-align: center;
  }

  .time-display {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.25rem;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid rgb(240 241 244 / 20%);
    color: #f0f1f4;
    font-family: "regular", sans-serif;
    font-size: 1.2rem;
  }
}
</style>
