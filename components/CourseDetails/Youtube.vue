<script setup lang="ts">
import {
  Player,
  Youtube,
  Ui,
  LoadingScreen,
  Controls,
  PlaybackControl,
  VolumeControl,
  SettingsControl,
  ScrubberControl,
  Poster,
  DefaultSettings,
  FullscreenControl,
  ClickToPlay,
} from '@vime/vue-next';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSettingStore } from "~/stores/setting";

// Props
const props = defineProps<{
  video: string;
  sessionId?: number | null;
  courseId?: number | null;
}>();
const emit = defineEmits<{
  playbackStateChange: [isPlaying: boolean];
}>();

// State
const isPiP = ref(false);
const playerInstance = ref<any>(null);
const playerReloadKey = ref(0);
const isPlayerLoading = ref(true);
const isPlayerTakingLong = ref(false);
let loadingDelayTimer: ReturnType<typeof setTimeout> | null = null;
const watchHistory = useCourseWatchHistory(() => props.sessionId);

// Methods
function TogglePip() {
  isPiP.value = !isPiP.value;
}

function clearLoadingDelayTimer() {
  if (!loadingDelayTimer) return;
  clearTimeout(loadingDelayTimer);
  loadingDelayTimer = null;
}

function startPlayerLoading() {
  clearLoadingDelayTimer();
  isPlayerLoading.value = true;
  isPlayerTakingLong.value = false;
  loadingDelayTimer = setTimeout(() => {
    isPlayerTakingLong.value = true;
  }, 10_000);
}

function finishPlayerLoading() {
  clearLoadingDelayTimer();
  isPlayerLoading.value = false;
  isPlayerTakingLong.value = false;
}

function markPlayerDelayed() {
  isPlayerLoading.value = true;
  isPlayerTakingLong.value = true;
  clearLoadingDelayTimer();
}

function retryPlayer() {
  playerInstance.value = null;
  isPlayerPaused.value = true;
  showStartOverlay.value = true;
  playerReloadKey.value += 1;
  startPlayerLoading();
}

function getYoutubeVideoId(url: string): string | null {
  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const videoId = ref(getYoutubeVideoId(props.video))

const settingStore = useSettingStore();
const isPlayerPaused = ref(true);
const showStartOverlay = ref(true);

const onPausedChange = (event: CustomEvent<boolean> | boolean) => {
  // The Vue wrapper emits event.detail directly; native Vime events wrap it.
  const paused = typeof event === 'boolean' ? event : event.detail;
  isPlayerPaused.value = paused;
  emit('playbackStateChange', !paused);
  watchHistory.handlePausedChange(event);
};

const handlePlaybackStarted = () => {
  isPlayerPaused.value = false;
  showStartOverlay.value = false;
  emit('playbackStateChange', true);
};

const handlePlaybackEnded = () => {
  isPlayerPaused.value = true;
  showStartOverlay.value = true;
  emit('playbackStateChange', false);
  watchHistory.markPlaybackEnded();
};

async function playVideo() {
  if (isPlayerLoading.value) return;

  // The start overlay is intentionally independent from the paused state.
  // Mounting it during the same mobile tap that pauses playback can make the
  // trailing click hit the new overlay and immediately resume the video.
  showStartOverlay.value = false;
  isPlayerPaused.value = false;

  try {
    await playerInstance.value?.play?.();
  } catch {
    // Autoplay policies or a transient provider error can reject play(). Keep
    // the retry action visible instead of leaving the learner on a black frame.
    isPlayerPaused.value = true;
    showStartOverlay.value = true;
  }
}
watch(() => props.video, (newVal) => {
  videoId.value = getYoutubeVideoId(newVal)
  playerReloadKey.value += 1;
  isPlayerPaused.value = true;
  showStartOverlay.value = true;
  emit('playbackStateChange', false);
  startPlayerLoading();
})

onMounted(startPlayerLoading);
onBeforeUnmount(() => {
  clearLoadingDelayTimer();
  emit('playbackStateChange', false);
});

</script>

<template>
  <br>
  <div :class="isPiP ? 'video-player-pip' : 'video-player'" @contextmenu.prevent>
    <!-- Vime removes its iframe blocker and enables native controls on iOS unless playback is inline. -->
    <Player ref="playerInstance" playsinline data-protected-youtube theme="dark" id="myVideo" :key="playerReloadKey" :style="`--vm-player-theme: var(--secondary-color)`" class="content"
      @vmPlay="handlePlaybackStarted"
      @vmPausedChange="onPausedChange"
      @vmDurationChange="watchHistory.updateDuration"
      @vmCurrentTimeChange="watchHistory.updateCurrentTime"
      @vmPlaybackReady="finishPlayerLoading"
      @vmPlaybackEnded="handlePlaybackEnded"
      @vmError="markPlayerDelayed"
      :paused="isPlayerPaused">
      <button
        v-if="showStartOverlay && !isPlayerLoading"
        type="button"
        class="overlay"
        aria-label="تشغيل الفيديو"
        @click.stop="playVideo"
      >
        <IconsPause class="logo-image" aria-hidden="true" />
        <span>تشغيل الفيديو</span>
      </button>

      <Youtube :showFullscreenControl="false" :key="videoId" :videoId="videoId!" />
      <CourseDetailsMediaWatermark :course-id="courseId" />
      <Ui>
        <DefaultSettings />
        <Controls>
          <PlaybackControl />
          <VolumeControl />
          <ScrubberControl />
          <SettingsControl />
          <FullscreenControl />
          <!--          <button @click="TogglePip" class="pip-button">PIP</button>-->
        </Controls>
        <Poster />
        <ClickToPlay />
        <LoadingScreen>
          <img :src="settingStore.setting?.image?.img" class="image_loading" alt="logo" />
        </LoadingScreen>
      </Ui>
      <div class="tapSidesToSeek">
        <div class="spacer"></div>
        <div class="tapTarget"></div>
        <div class="spacer"></div>
      </div>
    </Player>
    <CourseDetailsVideoLoadingState
      v-if="isPlayerLoading"
      :taking-long="isPlayerTakingLong"
      can-retry
      @retry="retryPlayer"
    />
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: grid;
  width: 100%;
  height: 100%;
  padding: 0;
  place-content: center;
  gap: 12px;
  border: 0;
  background:
    radial-gradient(circle at center, rgb(40 120 232 / 24%), transparent 34%),
    rgb(0 0 0 / 88%);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
}

.overlay:focus-visible {
  outline: 3px solid #fff;
  outline-offset: -6px;
}

.logo-image {
  width: 76px;
  height: 76px;
  margin-inline: auto;
  padding: 25px 22px 25px 26px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 50%;
  background: var(--secondary-color, #2878e8);
  box-shadow: 0 14px 38px rgb(0 0 0 / 42%);
  transition: transform 180ms ease, filter 180ms ease;
}

.overlay:hover .logo-image {
  filter: brightness(1.08);
  transform: scale(1.06);
}
</style>
