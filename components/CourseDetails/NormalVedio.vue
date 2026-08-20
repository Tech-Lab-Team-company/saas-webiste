<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Player, Video, DefaultUi, DefaultControls } from '@vime/vue-next';
import '@vime/core/themes/default.css';

const props = defineProps<{
    video: string;
    sessionId?: number | null;
    courseId?: number | null;
}>();
const videoRef = ref<HTMLVideoElement | null>(null);
const playerRef = ref<any>(null);
const videoContainer = ref<HTMLElement | null>(null);
const playerReloadKey = ref(0);
const isPlayerLoading = ref(true);
const isPlayerTakingLong = ref(false);
let loadingDelayTimer: ReturnType<typeof setTimeout> | null = null;
const watchHistory = useCourseWatchHistory(() => props.sessionId);
const protectionConfig = useCourseProtectionConfig();

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
    nextTick(applyVideoProtection);
}

function markPlayerDelayed() {
    isPlayerLoading.value = true;
    isPlayerTakingLong.value = true;
    clearLoadingDelayTimer();
}

function retryPlayer() {
    playerReloadKey.value += 1;
    startPlayerLoading();
}

watch(
    () => props.video,
    (newVal) => {
        startPlayerLoading();
        if (videoRef.value && newVal) {
            videoRef.value.pause();
            videoRef.value.currentTime = 0;
            videoRef.value.src = newVal;
            videoRef.value.load();
        }
    },
    { immediate: false }
);

const applyVideoProtection = () => {
    const nativeVideo = videoContainer.value?.querySelector('video');
    if (!nativeVideo || !protectionConfig.enabled) return;
    const controlRestrictions = [
      protectionConfig.disableVideoDownload ? 'nodownload' : '',
      protectionConfig.disableRemotePlayback ? 'noremoteplayback' : '',
    ].filter(Boolean);

    if (controlRestrictions.length) {
      nativeVideo.setAttribute('controlsList', controlRestrictions.join(' '));
    }
    if (protectionConfig.disableRemotePlayback) {
      nativeVideo.setAttribute('disableRemotePlayback', 'true');
    }
    nativeVideo.disablePictureInPicture = protectionConfig.disablePictureInPicture;
};

onMounted(() => {
    startPlayerLoading();
    nextTick(applyVideoProtection);
});
onBeforeUnmount(clearLoadingDelayTimer);
</script>

<template>
    <div ref="videoContainer" class="Video-container" @contextmenu.prevent>
        <Player
            :key="playerReloadKey"
            ref="playerRef"
            playsinline
            style="width: 100%; height: 100%;"
            @vmPlaybackReady="finishPlayerLoading"
            @vmDurationChange="watchHistory.updateDuration"
            @vmCurrentTimeChange="watchHistory.updateCurrentTime"
            @vmPausedChange="watchHistory.handlePausedChange"
            @vmPlaybackEnded="watchHistory.markPlaybackEnded"
            @vmError="markPlayerDelayed"
        >
            <Video ref="videoRef" style="width: 100%; height: 100%;">
                <source :data-src="props.video" type="video/mp4" />
            </Video>

            <CourseDetailsMediaWatermark :course-id="courseId" />

            <DefaultUi noControls>
                <DefaultControls hideOnMouseLeave :activeDuration="2000" />
            </DefaultUi>
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
