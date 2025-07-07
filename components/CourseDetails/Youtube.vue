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
</script>

<template>
  <br>
  <div :class="isPiP ? 'video-player-pip' : 'video-player'">
    <Player
        theme="dark"
        id="myVideo"
        :style="`--vm-player-theme: #ffb949`"
        class="content"
    >
      <Youtube
          :showFullscreenControl="false"
          :videoId="videoId!"
          @vmReady="onPlayerReady"
      />
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
          <img src="https://saas.crazyidea.online/uploads/teachers/606761749586788.png" class="image_loading" alt="logo" />
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

</style>