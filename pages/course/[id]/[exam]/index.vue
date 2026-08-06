<script setup lang="ts">
import Exam from "~/components/Exam/Exam.vue";

definePageMeta({
  layout: "course-details",
});
</script>

<template>
  <section class="course-exam-page" dir="rtl">
    <Exam />
  </section>
</template>

<style scoped>
.course-exam-page {
  min-height: calc(100vh - 86px);
  padding: clamp(28px, 5vw, 64px) clamp(14px, 4vw, 42px) 80px;
  color: var(--home-v2-ink, var(--app-text, #081b3a));
  background:
    radial-gradient(
      circle at 8% 10%,
      color-mix(in srgb, var(--home-v2-blue, #28366c) 10%, transparent),
      transparent 28rem
    ),
    var(--home-v2-paper, var(--app-bg, #f7f9fc));
}

@media (max-width: 700px) {
  .course-exam-page {
    padding: 22px 12px 56px;
  }
}
</style>
