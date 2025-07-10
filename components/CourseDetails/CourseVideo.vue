<script setup lang="ts">

import {useUserStore} from "~/stores/user";
import Youtube from "~/components/CourseDetails/Youtube.vue";
import AudioPlayer from "./TabsContent/AudioPlayer.vue";

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
  if (link.includes('youtube') || link.includes('youtu.be')) return 'youtube';
  if (link.endsWith('.mp3')) return 'audio';
  if (link.endsWith('.pdf')) return 'pdf';
  return 'unknown';
});

const embedVideoLink = computed(() => {
  if (fileType.value === 'youtube' && CourseVideoLink.value?.videoLink) {
    const match = CourseVideoLink.value.videoLink.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return CourseVideoLink.value.videoLink;
  }
  return CourseVideoLink.value?.videoLink || '';
});

const playVideo = ref(false)
</script>


<template>
  <div class="course-video-container">
    <Youtube :video="embedVideoLink" v-if="fileType === 'youtube'" />

    <iframe
        v-else-if="fileType === 'pdf'"
        width="100%"
        height="600"
        :src="embedVideoLink"
        frameborder="0"
        allowfullscreen
    ></iframe>


    <!--<audio
        v-else-if="fileType === 'audio'"
        controls
        :src="CourseVideoLink?.videoLink"
        style="width: 100%;"
    ></audio> -->
     <AudioPlayer v-else-if="fileType === 'audio'" :src="CourseVideoLink?.videoLink" />



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


