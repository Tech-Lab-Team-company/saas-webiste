<script setup lang="ts">

const props = defineProps({
  CourseVideoLink: {
    type: Object as () => {
      videoLink: string,
      title: string,
      description: string
    } | null,
    default: ''
  }
});

const CourseVideoLink = ref(props.CourseVideoLink);


const fileType = computed(() => {
  const link = CourseVideoLink.value?.videoLink || '';
  if (link.includes('youtube')) return 'youtube';
  if (link.endsWith('.mp3')) return 'audio';
  if (link.endsWith('.pdf')) return 'pdf';
  return 'unknown';
});

watch(
    () => props.CourseVideoLink,
    (newValue) => {
      CourseVideoLink.value = newValue;
      if (
          CourseVideoLink.value &&
          CourseVideoLink.value.videoLink &&
          fileType.value === 'youtube'
      ) {
        // Only transform if not already in embed format
        if (!CourseVideoLink.value.videoLink.includes('/embed/')) {
          const match = CourseVideoLink.value.videoLink.match(/v=([^&]+)/);
          if (match) {
            CourseVideoLink.value.videoLink = `https://www.youtube.com/embed/${match[1]}`;
          }
        }
      }
    },
    { immediate: true }
);

const playVideo = ref(false)
</script>


<template>
  {{CourseVideoLink?.videoLink}}
  <div class="course-video-container">
    <iframe
        v-if="fileType === 'youtube' || fileType === 'pdf'"
        width="100%"
        height="600"
        :src="CourseVideoLink?.videoLink"
        frameborder="0"
        allowfullscreen
    ></iframe>
    <audio
        v-else-if="fileType === 'audio'"
        controls
        :src="CourseVideoLink?.videoLink"
        style="width: 100%;"
    ></audio>
    <div v-else>
      <p>Unsupported file type</p>
    </div>
  </div>
  <div class="course-video-text">
    <p class="course-video-text-title">شرح {{ CourseVideoLink?.title }}</p>
    <hr/>
    <p class="course-video-text-description">{{ CourseVideoLink?.description }}</p>
  </div>

</template>

<style scoped>

</style>


