<script setup lang="ts">
import type {
  HomeCoursePageViewModel,
  HomePageViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

import HomeHeroSection from "./sections/HomeHeroSection.vue";

const props = defineProps<{
  home: HomePageViewModel;
  pending: boolean;
  loadCoursesByYear: (
    stageId: number,
    yearId: number
  ) => Promise<HomeSectionState<HomeCoursePageViewModel>>;
  loadGeneralCourses: (
    page?: number,
    perPage?: number,
  ) => Promise<HomeSectionState<HomeCoursePageViewModel>>;
}>();

const homeRoot = ref<HTMLElement | null>(null);
useHomePageCinematicMotion(homeRoot);

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
    ref="homeRoot"
    class="home-v2"
    dir="rtl"
    :data-home-pending="props.pending ? 'true' : 'false'"
    :style="themeStyles"
  >
    <div class="home-v2-motion-trail" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <main>
      <HomeHeroSection :hero="props.home.hero" :site="props.home.site" />
      <LazyHomeV2SectionsHomeCoursesSection
        :courses="props.home.courses"
        :load-courses-by-year="props.loadCoursesByYear"
        :load-general-courses="props.loadGeneralCourses"
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

<style scoped>
.home-v2-motion-trail {
  position: fixed;
  z-index: 9000;
  inset: 0;
  pointer-events: none;
}

.home-v2-motion-trail > span {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 50%;
  background: var(--home-v2-coral);
  box-shadow: 0 0 18px color-mix(in srgb, var(--home-v2-coral) 58%, transparent);
  opacity: 0;
  will-change: transform;
}

.home-v2-motion-trail > span:nth-child(2) {
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;
  border: 0;
  background: color-mix(in srgb, var(--home-v2-blue) 52%, #fff);
}

.home-v2-motion-trail > span:nth-child(3) {
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border: 0;
  background: #fff;
  box-shadow: 0 0 12px rgb(255 255 255 / 72%);
}

@media (max-width: 780px), (prefers-reduced-motion: reduce) {
  .home-v2-motion-trail {
    display: none;
  }
}
</style>
