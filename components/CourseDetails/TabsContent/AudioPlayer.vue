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

</script>

<template>
  <div class="audio-player">
    <audio
      ref="audioElement"
      class="native-audio"
      :src="audioUrl"
      controls
      controlslist="nodownload"
      preload="auto"
      @loadedmetadata="readDuration"
      @durationchange="readDuration"
      @canplay="loadError = false"
      @timeupdate="handleTimeUpdate"
      @play="isPlaying = true"
      @pause="handlePause"
      @ended="handleEnded"
      @error="handleError"
    ></audio>

    <p v-if="loadError" class="audio-error" role="alert">
      تعذر تحميل الملف الصوتي. حاول مرة أخرى.
    </p>
  </div>
</template>

<style scoped lang="scss">
.audio-player {
  width: 100%;
  height: fit-content;
  padding: 2rem 1rem 0.75rem;
  border-radius: 8px;
  background: linear-gradient(30deg, rgb(41 33 29) 0%, #000 100%);

  .native-audio {
    display: block;
    width: 100%;
    min-height: 54px;
    accent-color: var(--primary-color, #ef233c);
  }

  .audio-error {
    margin: 0.75rem 0 0;
    color: #ffb7bd;
    font-size: 0.9rem;
    text-align: center;
  }

}
</style>
