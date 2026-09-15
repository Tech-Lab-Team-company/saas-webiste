<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Player, Video, DefaultUi, DefaultControls } from '@vime/vue-next';
import '@vime/core/themes/default.css';

const props = defineProps<{
    video: string;
    sessionId?: number | null;
    courseId?: number | null;
    securityData?: any;
}>();
const emit = defineEmits<{
    playbackStateChange: [isPlaying: boolean];
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

const isPlayerPaused = ref(true);

function handlePausedChange(event: CustomEvent<boolean>) {
    isPlayerPaused.value = event.detail;
    emit('playbackStateChange', !event.detail);
    watchHistory.handlePausedChange(event);
}

function handlePlaybackStarted() {
    isPlayerPaused.value = false;
    emit('playbackStateChange', true);
}

function handlePlaybackEnded() {
    isPlayerPaused.value = true;
    emit('playbackStateChange', false);
    watchHistory.markPlaybackEnded();
}

async function playVideo() {
    if (isPlayerLoading.value) return;
    try {
        if (playerRef.value?.play) {
            await playerRef.value.play();
        } else {
            const nativeVideo = videoContainer.value?.querySelector('video');
            if (nativeVideo) await nativeVideo.play();
        }
        isPlayerPaused.value = false;
    } catch {
        // ignore
    }
}

async function pauseVideo() {
    if (isPlayerLoading.value) return;
    try {
        if (playerRef.value?.pause) {
            await playerRef.value.pause();
        } else {
            const nativeVideo = videoContainer.value?.querySelector('video');
            if (nativeVideo) nativeVideo.pause();
        }
        isPlayerPaused.value = true;
    } catch {
        // ignore
    }
}

async function togglePlayPause() {
    if (isPlayerLoading.value) return;
    const nativeVideo = videoContainer.value?.querySelector('video');
    const isPaused = nativeVideo ? nativeVideo.paused : (playerRef.value?.paused ?? isPlayerPaused.value);
    if (isPaused) {
        await playVideo();
    } else {
        await pauseVideo();
    }
}

function isInteractiveTarget(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) return true;
    if (target.isContentEditable) return true;
    if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], .p-dialog')) return true;
    return false;
}

function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar') {
        if (isInteractiveTarget(event.target)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        void togglePlayPause();
    }
}

watch(
    () => props.video,
    (newVal) => {
        isPlayerPaused.value = true;
        emit('playbackStateChange', false);
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
    window.addEventListener('keydown', handleGlobalKeydown);
});
onBeforeUnmount(() => {
    clearLoadingDelayTimer();
    window.removeEventListener('keydown', handleGlobalKeydown);
    emit('playbackStateChange', false);
});
</script>

<template>
    <div ref="videoContainer" class="Video-container" @contextmenu.prevent>
        <Player
            :key="playerReloadKey"
            ref="playerRef"
            playsinline
            style="width: 100%; height: 100%;"
            @vmPlaybackReady="finishPlayerLoading"
            @vmPlay="emit('playbackStateChange', true)"
            @vmDurationChange="watchHistory.updateDuration"
            @vmCurrentTimeChange="watchHistory.updateCurrentTime"
            @vmPausedChange="handlePausedChange"
            @vmPlaybackEnded="handlePlaybackEnded"
            @vmError="markPlayerDelayed"
        >
            <Video ref="videoRef" style="width: 100%; height: 100%;">
                <source :data-src="props.video" type="video/mp4" />
            </Video>

            <CourseDetailsMediaWatermark :course-id="courseId" :security-data="securityData" />

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
