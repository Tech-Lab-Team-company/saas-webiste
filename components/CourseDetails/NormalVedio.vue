<script setup lang="ts">
import { ref, watch } from 'vue';
import { Player, Video, DefaultUi, DefaultControls } from '@vime/vue-next';
import '@vime/core/themes/default.css';

const props = defineProps<{
    video: string;
    sessionId?: number | null;
}>();
const videoRef = ref<HTMLVideoElement | null>(null);
const playerRef = ref<any>(null);
const watchHistory = useCourseWatchHistory(() => props.sessionId);

watch(
    () => props.video,
    (newVal) => {
        if (videoRef.value && newVal) {
            videoRef.value.pause();
            videoRef.value.currentTime = 0;
            videoRef.value.src = newVal;
            videoRef.value.load();
        }
    },
    { immediate: false }
);

const onPlaybackReady = () => {
    console.log('Playback ready');
};
</script>

<template>
    <div class="Video-container">
        <Player
            ref="playerRef"
            playsinline
            style="width: 100%; height: 100%;"
            @vPlaybackReady="onPlaybackReady"
            @vmDurationChange="watchHistory.updateDuration"
            @vmCurrentTimeChange="watchHistory.updateCurrentTime"
            @vmPausedChange="watchHistory.handlePausedChange"
            @vmPlaybackEnded="watchHistory.markPlaybackEnded"
        >
            <Video ref="videoRef" style="width: 100%; height: 100%;">
                <source :data-src="props.video" type="video/mp4" />
            </Video>

            <DefaultUi noControls>
                <DefaultControls hideOnMouseLeave :activeDuration="2000" />
            </DefaultUi>
        </Player>
    </div>
</template>

<style scoped>
.Video-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
}

.Video-container :deep(.vm-player),
.Video-container :deep(.vm-video),
.Video-container :deep(video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
}

.Video-container :deep(video) {
    object-fit: contain;
}

.Video-container.cover :deep(video) {
    object-fit: cover;
}
</style>
