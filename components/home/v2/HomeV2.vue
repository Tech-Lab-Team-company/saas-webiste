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
    yearId: number,
    page?: number,
    perPage?: number,
    teacherId?: number | null,
    word?: string,
  ) => Promise<HomeSectionState<HomeCoursePageViewModel>>;
  loadGeneralCourses: (
    page?: number,
    perPage?: number,
    teacherId?: number | null,
    word?: string,
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
        :teachers="props.home.teachers"
        :load-courses-by-year="props.loadCoursesByYear"
        :load-general-courses="props.loadGeneralCourses"
        :hydrate-on-visible="{ rootMargin: '50px' }"
      />
      <LazyHomeV2SectionsHomeBooksSection
        v-if="props.home.books.status === 'success'"
        :books="props.home.books"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeBlogSection
        v-if="props.home.blogs.status === 'success'"
        :blogs="props.home.blogs"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeLearningJourneySection
        v-if="props.home.learningJourney.status === 'success'"
        :journey="props.home.learningJourney"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeTeachersSection
        v-if="
          props.home.site.hasTeacherDirectory &&
          props.home.teachers.status === 'success'
        "
        :teachers="props.home.teachers"
        :site="props.home.site"
        :pending="props.pending && props.home.teachers.status === 'empty'"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeAboutTeacherSection
        v-else-if="
          !props.home.site.hasTeacherDirectory &&
          props.home.aboutTeacher.status === 'success'
        "
        :about="props.home.aboutTeacher"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <LazyHomeV2SectionsHomeAppSection
        v-if="props.home.site.app.enabled"
        :site="props.home.site"
        :hydrate-on-visible="{ rootMargin: '250px' }"
      />
      <div class="home-v2__closing-sections">
        <LazyHomeV2SectionsHomeFaqSection
          :hydrate-on-visible="{ rootMargin: '250px' }"
        />
        <LazyHomeV2SectionsHomeCtaSection
          v-if="props.home.cta.status === 'success'"
          :cta="props.home.cta"
          :hydrate-on-visible="{ rootMargin: '250px' }"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-v2__closing-sections {
  --home-v2-closing-space: clamp(56px, 7vw, 96px);
  --home-v2-closing-surface-start: color-mix(
    in srgb,
    var(--home-v2-blue) 2%,
    var(--home-v2-paper)
  );
  --home-v2-closing-surface-end: color-mix(
    in srgb,
    var(--home-v2-blue) 3%,
    var(--home-v2-cream)
  );
  display: flex;
  flex-direction: column;
  gap: var(--home-v2-closing-space);
  padding-block: calc(var(--home-v2-closing-space) + 20px);
  background: linear-gradient(
    180deg,
    var(--home-v2-closing-surface-start),
    var(--home-v2-closing-surface-end)
  );
}

:deep(.home-v2-app) + .home-v2__closing-sections {
  background:
    linear-gradient(
      180deg,
      var(--home-v2-blue) 0,
      var(--home-v2-closing-surface-start) var(--home-v2-closing-space),
      transparent var(--home-v2-closing-space)
    ),
    linear-gradient(
      180deg,
      var(--home-v2-closing-surface-start),
      var(--home-v2-closing-surface-end)
    );
}

.home-v2__closing-sections:not(:has(> section)) {
  display: none;
  padding: 0;
}

.home-v2__closing-sections :deep(.home-v2-faq),
.home-v2__closing-sections :deep(.home-v2-cta) {
  padding: 0;
  background: transparent;
}

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
