<script lang="ts" setup>
import WaveSurfer from 'wavesurfer.js'

const props = defineProps({
    src: String
})
const waveform = ref(null)
let wavesurfer: WaveSurfer | null = null
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const audioUrl = computed(() => props.src || '')

onMounted(() => {
  wavesurfer = WaveSurfer.create({
    container: waveform.value,
    waveColor: '#949494',
    progressColor: '#fff',
    cursorColor: '#fff',
    height: 60,
    responsive: true,
  })

  wavesurfer.load(audioUrl.value)

  wavesurfer.on('ready', () => {
    duration.value = wavesurfer.getDuration()
  })

  wavesurfer.on('audioprocess', () => {
    currentTime.value = wavesurfer.getCurrentTime()
  })

  wavesurfer.on('seek', () => {
    currentTime.value = wavesurfer.getCurrentTime()
  })

  wavesurfer.on('finish', () => {
    isPlaying.value = false
    currentTime.value = duration.value
  })
})

const togglePlay = () => {
  if (!wavesurfer) return
  wavesurfer.playPause()
  isPlaying.value = wavesurfer.isPlaying()
}

onBeforeUnmount(() => {
  if (wavesurfer) wavesurfer.destroy()
})

// Helper to format time as mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="audio-player">
    <button class="play-audio" @click="togglePlay">
      <IconsPause v-if="isPlaying" />
      <IconsPlay v-else />
    </button>
    <div ref="waveform" class="waveform"></div>
    <div class="time-display">
      <span>{{ formatTime(currentTime) }}</span> /
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>


<style scoped lang="scss">
.audio-player {
    width: 100%;
    height: fit-content;
    padding: 2rem 0 0.25rem;
    border-radius: 8px;
    background: linear-gradient(30deg, rgba(41, 33, 29, 1) 0%, rgba(0, 0, 0, 1) 100%);

    .play-audio {
        display: block;
        width: 55px;
        height: 55px;
        padding: 0.8rem;
        background-color: rgba(240, 241, 244, 0.4);
        border-radius: 50%;
        margin: 0 auto 2rem;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .time-display {
        display: flex;
        justify-content: end;
        align-items: center;
        color: #f0f1f4;
        font-family: "regular", sans-serif;
        padding: 0.5rem 0.5rem 0;
        font-size: 1.2rem;
        margin-top: 0.5rem;
        border-top: 1px solid rgba(240, 241, 244, 0.2);
    }
}
</style>