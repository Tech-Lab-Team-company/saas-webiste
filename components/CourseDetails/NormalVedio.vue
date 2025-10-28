<script setup lang="ts">
import {
    Player,
    Video,
    Ui,
    Controls,
    PlaybackControl,
    VolumeControl,
    SettingsControl,
    ScrubberControl,
    FullscreenControl,
    DefaultSettings,
    LoadingScreen,
    Poster,
    ClickToPlay
} from '@vime/vue-next';
import { ref, watch } from 'vue';
import { useSettingStore } from '~/stores/setting';

const props = defineProps<{ video: string }>();

const playerInstance = ref<any>(null);
const VideoBlurScreen = ref(true);
const isPiP = ref(false);

function TogglePip() {
    isPiP.value = !isPiP.value;
}

function onPlayerReady(event: any) {
    playerInstance.value = event.detail;
}

const settingStore = useSettingStore();

watch(() => props.video, (newVal) => {
    if (playerInstance.value) {
        playerInstance.value.pause();
        playerInstance.value.currentTime = 0;
        playerInstance.value.src = newVal;
    }
});
</script>

<template>
    <br>
    <div :class="isPiP ? 'video-player-pip' : 'video-player'">
        <Player theme="dark" id="normalVideo" :style="`--vm-player-theme: var(--secondary-color)`" class="content"
            @click="VideoBlurScreen = !VideoBlurScreen" @vmPlay="VideoBlurScreen = false"
            @vmPause="VideoBlurScreen = true" :paused="VideoBlurScreen">
            <div v-if="VideoBlurScreen" class="overlay" @click="VideoBlurScreen = false">
                <!-- Optional overlay play icon -->
                <IconsPause class="logo-image" />
            </div>

            <Video :crossorigin="'anonymous'" :preload="'auto'" :poster="settingStore.setting?.image?.img"
                :src="props.video" @vmReady="onPlayerReady" />

            <Ui>
                <DefaultSettings />
                <Controls>
                    <PlaybackControl />
                    <VolumeControl />
                    <ScrubberControl @click="VideoBlurScreen = true" />
                    <SettingsControl />
                    <FullscreenControl />
                </Controls>
                <Poster />
                <ClickToPlay />
                <LoadingScreen>
                    <img :src="settingStore.setting?.image?.img" class="image_loading" alt="logo" />
                </LoadingScreen>
            </Ui>
        </Player>
    </div>
</template>

<style scoped>
.overlay {
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
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
