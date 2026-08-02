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
import HomeFooterSection from "./sections/HomeFooterSection.vue";
import HomeHeaderSection from "./sections/HomeHeaderSection.vue";
import HomeHeroSection from "./sections/HomeHeroSection.vue";
import HomeNotesSection from "./sections/HomeNotesSection.vue";
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
</script>

<template>
  <div
    class="home-v2"
    dir="rtl"
    :data-home-pending="props.pending ? 'true' : 'false'"
    :style="{
      '--home-v2-blue': props.home.site.colors.primary || '#28366c',
      '--home-v2-deep': props.home.site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${props.home.site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="props.home.site" />
    <main>
      <HomeHeroSection :hero="props.home.hero" :site="props.home.site" />
      <HomeCoursesSection
        :courses="props.home.courses"
        :load-courses-by-year="props.loadCoursesByYear"
      />
      <HomeNotesSection />
      <HomeBlogSection :blogs="props.home.blogs" />
      <HomeLearningJourneySection :journey="props.home.learningJourney" />
      <HomeAboutTeacherSection :about="props.home.aboutTeacher" />
      <HomeAppSection :site="props.home.site" />
      <HomeFaqSection />
      <HomeCtaSection />
    </main>
    <HomeFooterSection :site="props.home.site" />
  </div>
</template>
