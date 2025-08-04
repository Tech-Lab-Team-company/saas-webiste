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
import { ref } from 'vue';
import { useSettingStore } from "~/stores/setting";

// Props
const props = defineProps<{ video: string }>();

// State
const isPiP = ref(false);
const playerInstance = ref<any>(null);

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

function getYoutubeVideoId(url: string): string | null {
  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const videoId = getYoutubeVideoId(props.video)

const settingStore = useSettingStore();
const VideoBlurScreen = ref(true)

// function playVideo() {
//   if (playerInstance.value) {
//     playerInstance.value.play();
//     VideoBlurScreen.value = false;
//   }
// }
</script>

<template>
  <br>
  <div :class="isPiP ? 'video-player-pip' : 'video-player'">
    <Player theme="dark" id="myVideo" :style="`--vm-player-theme: var(--secondary-color)`" class="content"
      @click="VideoBlurScreen = !VideoBlurScreen" @vmPlay="VideoBlurScreen = false" @vmPause="VideoBlurScreen = true"
      :paused="VideoBlurScreen">
      <div @click="VideoBlurScreen = false" v-if="VideoBlurScreen" class="overlay">
        <img :src="settingStore.setting?.image?.img" class="logo-image" alt="">
        <!-- <IconsPlay class="play-icon" @click="VideoBlurScreen = false" /> -->
        <!-- <i class="pi pi-play "></i> -->
      </div>

      <Youtube :showFullscreenControl="false" :videoId="videoId!" @vmReady="onPlayerReady" />
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
  width: 327px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  cursor: pointer;
  
}
</style>