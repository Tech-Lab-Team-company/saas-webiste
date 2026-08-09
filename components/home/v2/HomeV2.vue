<script setup lang="ts">
import "~/assets/css/home-v2.css";
import type {
  HomeCourseViewModel,
  HomePageViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

import HomeHeroSection from "./sections/HomeHeroSection.vue";

const props = defineProps<{
  home: HomePageViewModel;
  pending: boolean;
  loadCoursesByYear: (
    stageId: number,
    yearId: number,
  ) => Promise<HomeSectionState<HomeCourseViewModel[]>>;
}>();

const themeStyles = computed(() => {
  const primary = props.home.site.colors.primary || "#28366c";
  const secondary = props.home.site.colors.secondary || "#3a3e7e";
  return {
    "--home-v2-brand-primary": primary,
    "--home-v2-brand-secondary": secondary,
    "--home-v2-blue": primary,
    "--home-v2-deep": secondary,
    "--home-v2-blue-light": `color-mix(in srgb, ${primary} 14%, white)`,
  };
});
</script>

<template>
  <div
    class="home-v2"
    dir="rtl"
    :data-home-pending="props.pending ? 'true' : 'false'"
    :style="themeStyles"
  >
    <main>
      <HomeHeroSection :hero="props.home.hero" :site="props.home.site" />
      <LazyHomeV2SectionsHomeCoursesSection
        :courses="props.home.courses"
        :load-courses-by-year="props.loadCoursesByYear"
        :hydrate-on-visible="{ rootMargin: '50px' }"
      />
      <LazyHomeV2SectionsHomeBooksSection
        :books="props.home.books"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeBlogSection
        :blogs="props.home.blogs"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeLearningJourneySection
        :journey="props.home.learningJourney"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeAboutTeacherSection
        :about="props.home.aboutTeacher"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeAppSection
        :site="props.home.site"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeFaqSection
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeCtaSection
        :cta="props.home.cta"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
    </main>
  </div>
</template>
