<script setup lang="ts">
import "~/assets/css/home-v2.css";
import HomeCoursesSection from "~/components/home/v2/sections/HomeCoursesSection.vue";
import { useHomePage } from "~/features/HomePageFeature/composables/useHomePage";

const { home, pending, loadCoursesByYear } = useHomePage();

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});
</script>

<template>
  <div
    class="home-v2 course-page"
    dir="rtl"
    :data-home-pending="pending ? 'true' : 'false'"
    :style="{
      '--home-v2-blue': home.site.colors.primary || '#28366c',
      '--home-v2-deep': home.site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${home.site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <main>
      <HomeCoursesSection
        :courses="home.courses"
        :load-courses-by-year="loadCoursesByYear"
      />
    </main>
  </div>
</template>

<style scoped>
.course-page,
.course-page > main {
  width: 100%;
  min-width: 0;
}
</style>
