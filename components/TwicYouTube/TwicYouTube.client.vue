<!-- <script setup lang="ts">
const props = defineProps({
  youtubeurl: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'preview'
  },
  ratio: {
    type: String,
    default: '16/9'
  }
})

// const youtubeUrl = computed(() => `${props.youtubeurl}`)
// const thumbnailUrl = computed(() => `https://img.youtube.com/vi/${props.youtubeId}/maxresdefault.jpg`)
</script> -->
<!-- 
<template>
  <div class="twic-youtube-container"> -->
    <!-- TwicPics optimized thumbnail -->
    <!-- <TwicImg
      :src="thumbnailUrl"
      :ratio="ratio"
      :placeholder="placeholder"
      mode="cover"
      class="thumbnail"
    >
      <template #placeholder>
        <div class="play-button">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" fill="currentColor"/>
          </svg>
        </div>
      </template>
    </TwicImg>
     -->
    <!-- The actual YouTube iframe (lazy loaded) -->
    <!-- <iframe
      class="youtube-iframe"
      :src="props.youtubeurl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    />
  </div>
</template> -->

<!-- <style scoped>
.twic-youtube-container {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.thumbnail {
  transition: opacity 0.3s;
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s;
}

.twic-youtube-container:hover .thumbnail {
  opacity: 0.8;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-button svg {
  width: 24px;
  height: 24px;
  fill: white;
  margin-left: 4px;
}

.twic-youtube-container.playing .thumbnail {
  opacity: 0;
}

.twic-youtube-container.playing .youtube-iframe {
  opacity: 1;
}
</style> -->