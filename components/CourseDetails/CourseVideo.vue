<script setup lang="ts">
import AudioPlayer from "./TabsContent/AudioPlayer.vue";

const Youtube = defineAsyncComponent(
  () => import("~/components/CourseDetails/Youtube.vue"),
);
const NormalVedio = defineAsyncComponent(
  () => import("~/components/CourseDetails/NormalVedio.vue"),
);

interface CourseVideoSelection {
  sessionId: number | null;
  videoLink: string;
  title: string;
  description: string;
}

const props = defineProps({
  CourseVideoLink: {
    type: Object as () => CourseVideoSelection | null,
    default: null,
  },
  courseId: {
    type: Number,
    default: null,
  },
});

const CourseVideoLink = computed(() => props.CourseVideoLink);
const protectionConfig = useCourseProtectionConfig();

const fileType = computed(() => {
  const link = CourseVideoLink.value?.videoLink || '';
  if (link.endsWith('mp4')) return 'video';
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

const pdfIframe = ref<HTMLIFrameElement | null>(null);
const pdfContainer = ref<HTMLElement | null>(null);

const protectedPdfLink = computed(() => {
  if (
    fileType.value !== 'pdf' ||
    !protectionConfig.enabled ||
    !protectionConfig.hidePdfToolbar
  ) {
    return embedVideoLink.value;
  }
  const separator = embedVideoLink.value.includes('#') ? '&' : '#';
  return `${embedVideoLink.value}${separator}toolbar=0&navpanes=0`;
});

function openFullscreen() {
  const container = pdfContainer.value;
  if (container) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if ((container as any).webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen();
    } else if ((container as any).msRequestFullscreen) {
      (container as any).msRequestFullscreen();
    }
  }
}
</script>


<template>

  <div class="course-video-container">
    <ClientOnly v-if="fileType === 'youtube'">
      <Youtube
        :key="`youtube-${CourseVideoLink?.sessionId}`"
        :video="embedVideoLink"
        :session-id="CourseVideoLink?.sessionId"
        :course-id="courseId"
      />
    </ClientOnly>
    <ClientOnly v-else-if="fileType === 'video'">
      <NormalVedio
        :key="`video-${CourseVideoLink?.sessionId}`"
        :video="embedVideoLink"
        :session-id="CourseVideoLink?.sessionId"
        :course-id="courseId"
      />
    </ClientOnly>
    <div ref="pdfContainer" class="pdf-container" v-else-if="fileType === 'pdf'" style="width: 100%;">
      <iframe
        ref="pdfIframe"
        width="100%"
        height="600"
        :src="protectedPdfLink"
        frameborder="0"
        :referrerpolicy="protectionConfig.enabled && protectionConfig.pdfNoReferrer ? 'no-referrer' : undefined"
        allowfullscreen
        @contextmenu.prevent
      ></iframe>
      <CourseDetailsMediaWatermark :course-id="courseId" />
      <div class="flex justify-end">
        <button class="btn-primary" @click="openFullscreen">
          تكبير الشاشة
        </button>
      </div>
    </div>
    <!--<audio
        v-else-if="fileType === 'audio'"
        controls
        :src="CourseVideoLink?.videoLink"
        style="width: 100%;"
    ></audio> -->
    <AudioPlayer
      v-else-if="fileType === 'audio'"
      :key="`audio-${CourseVideoLink?.sessionId}`"
      :src="CourseVideoLink?.videoLink"
      :session-id="CourseVideoLink?.sessionId"
    />
    <div v-else>
      <p>Unsupported file type</p>
    </div>
  </div>
  <div class="course-video-text">
    <p class="course-video-text-title">شرح {{ CourseVideoLink?.title }}</p>
    <hr />
    <p class="course-video-text-description">{{ CourseVideoLink?.description }}</p>
  </div>

</template>

<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-video.scss"></style>
