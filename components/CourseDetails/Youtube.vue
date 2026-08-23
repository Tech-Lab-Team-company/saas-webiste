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

function setHDQuality() {
  if (playerInstance.value && playerInstance.value.setPlaybackQuality) {
    playerInstance.value.setPlaybackQuality('hd1080');
  }
}

function onPlayerReady(event: any) {
  playerInstance.value = event.detail;
  setHDQuality();
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
  VideoBlurScreen.value = true;
  playerReloadKey.value += 1;
  startPlayerLoading();
}

function getYoutubeVideoId(url: string): string | null {
  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const videoId = ref(getYoutubeVideoId(props.video))

const settingStore = useSettingStore();
const VideoBlurScreen = ref(true)

const onPausedChange = (event: CustomEvent<boolean>) => {
  VideoBlurScreen.value = event.detail;
  emit('playbackStateChange', !event.detail);
  watchHistory.handlePausedChange(event);
};

const handlePlaybackStarted = () => {
  VideoBlurScreen.value = false;
  emit('playbackStateChange', true);
};

const handlePlaybackEnded = () => {
  emit('playbackStateChange', false);
  watchHistory.markPlaybackEnded();
};

function handlePlayerClick() {
  if (isPlayerLoading.value) return;
  VideoBlurScreen.value = !VideoBlurScreen.value;
}

// function playVideo() {
//   if (playerInstance.value) {
//     playerInstance.value.play();
//     VideoBlurScreen.value = false;
//   }
// }
watch(() => props.video, (newVal) => {
  videoId.value = getYoutubeVideoId(newVal)
  playerReloadKey.value += 1;
  VideoBlurScreen.value = true;
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
    <Player theme="dark" id="myVideo" :key="playerReloadKey" :style="`--vm-player-theme: var(--secondary-color)`" class="content"
      @click="handlePlayerClick"
      @vmPlay="handlePlaybackStarted"
      @vmPausedChange="onPausedChange"
      @vmDurationChange="watchHistory.updateDuration"
      @vmCurrentTimeChange="watchHistory.updateCurrentTime"
      @vmPlaybackReady="finishPlayerLoading"
      @vmPlaybackEnded="handlePlaybackEnded"
      @vmError="markPlayerDelayed"
      :paused="VideoBlurScreen">
      <div @click="VideoBlurScreen = false" v-if="VideoBlurScreen && !isPlayerLoading" class="overlay">
        <!-- <img :src="settingStore.setting?.image?.img" class="logo-image" alt=""> -->
        <IconsPause  class="logo-image" @click="VideoBlurScreen = false" />
        <!-- <i class="pi pi-play "></i> -->
      </div>

      <Youtube :showFullscreenControl="false"  :key="videoId" :videoId="videoId!"  @vmReady="onPlayerReady" />
      <CourseDetailsMediaWatermark :course-id="courseId" />
      <Ui>
        <DefaultSettings />
        <Controls>
          <PlaybackControl />
          <VolumeControl />
          <ScrubberControl @click="VideoBlurScreen = true" />
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
  background-color: rgb(0, 0, 0);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  cursor: pointer;
}

.play-icon {
  width: 50px;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  transform: translateY(-10%);
  cursor: pointer;
}

.logo-image {
  width: 300px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  cursor: pointer;
  border-radius: 20px;

}
</style>
