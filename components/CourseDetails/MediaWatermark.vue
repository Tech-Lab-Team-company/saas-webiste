<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const props = defineProps<{
  courseId?: number | null;
}>();

const userStore = useUserStore();
const protectionConfig = useCourseProtectionConfig();
const marks = Array.from(
  { length: protectionConfig.watermarkCopies },
  (_, index) => index,
);

const watermark = computed(() => {
  const user = userStore.user;
  if (!user) return protectionConfig.watermarkFallbackText;

  return [
    protectionConfig.watermarkShowStudentName ? user.name : "",
    protectionConfig.watermarkShowStudentId && user.id ? `ID ${user.id}` : "",
    protectionConfig.watermarkShowCourseId && props.courseId
      ? `COURSE ${props.courseId}`
      : "",
  ]
    .filter(Boolean)
    .join("  •  ") || protectionConfig.watermarkFallbackText;
});

const watermarkStyle = computed(() => ({
  "--course-watermark-opacity": String(protectionConfig.watermarkOpacity),
}));
</script>

<template>
  <div
    v-if="protectionConfig.enabled && protectionConfig.watermarkEnabled"
    class="course-media-watermark"
    :style="watermarkStyle"
    aria-hidden="true"
  >
    <span v-for="mark in marks" :key="mark">{{ watermark }}</span>
  </div>
</template>

<style scoped>
.course-media-watermark {
  position: absolute;
  z-index: 12;
  inset: 0;
  display: grid;
  overflow: hidden;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  align-content: space-around;
  gap: clamp(20px, 5vw, 58px) 12px;
  padding: 24px 0;
  pointer-events: none;
  user-select: none;
}

.course-media-watermark span {
  color: rgb(255 255 255 / var(--course-watermark-opacity, 0.3));
  font-size: clamp(9px, 1.05vw, 13px);
  font-weight: 800;
  letter-spacing: 0.035em;
  text-align: center;
  text-shadow: 0 1px 3px rgb(0 0 0 / 70%);
  transform: rotate(-18deg);
  white-space: nowrap;
}

@media (max-width: 680px) {
  .course-media-watermark {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    gap: 22px 8px;
  }
}
</style>
