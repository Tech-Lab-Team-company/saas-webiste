<script setup lang="ts">
import "~/assets/css/home-v2.css";
import type {
  HomeCourseViewModel,
  HomePageViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

import HomeAppSection from "./sections/HomeAppSection.vue";
import HomeBlogSection from "./sections/HomeBlogSection.vue";
import HomeCoursesSection from "./sections/HomeCoursesSection.vue";
import HomeCtaSection from "./sections/HomeCtaSection.vue";
import HomeFaqSection from "./sections/HomeFaqSection.vue";
import HomeHeroSection from "./sections/HomeHeroSection.vue";
import HomeBooksSection from "./sections/HomeBooksSection.vue";
import HomeLearningJourneySection from "~/components/Home/v2/sections/HomeLearningJourneySection.vue";
import HomeAboutTeacherSection from "~/components/Home/v2/sections/HomeAboutTeacherSection.vue";

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
      <HomeCoursesSection
        :courses="props.home.courses"
        :load-courses-by-year="props.loadCoursesByYear"
      />
      <HomeBooksSection :books="props.home.books" />
      <HomeBlogSection :blogs="props.home.blogs" />
      <HomeLearningJourneySection :journey="props.home.learningJourney" />
      <HomeAboutTeacherSection :about="props.home.aboutTeacher" />
      <HomeAppSection :site="props.home.site" />
      <HomeFaqSection />
      <HomeCtaSection :cta="props.home.cta" />
    </main>
  </div>
</template>
