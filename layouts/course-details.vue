<script setup lang="ts">
import { storeToRefs } from "pinia";
import "~/assets/style/main.min.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
const courseHeader = ref<{ $el: Element } | null>(null);
const courseHeaderOffset = ref(80);
let courseHeaderResizeObserver: ResizeObserver | null = null;

const syncCourseHeaderOffset = () => {
  const headerElement = courseHeader.value?.$el;
  if (!(headerElement instanceof HTMLElement)) return;

  courseHeaderOffset.value =
    Math.ceil(headerElement.getBoundingClientRect().height) + 8;
};

onMounted(async () => {
  await nextTick();
  syncCourseHeaderOffset();

  if (typeof ResizeObserver !== "undefined") {
    courseHeaderResizeObserver = new ResizeObserver(syncCourseHeaderOffset);
    const headerElement = courseHeader.value?.$el;
    if (headerElement) courseHeaderResizeObserver.observe(headerElement);
  }
});

onBeforeUnmount(() => {
  courseHeaderResizeObserver?.disconnect();
  courseHeaderResizeObserver = null;
});
</script>

<template>
  <div
    class="home-v2 course-details-layout"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
      '--course-header-offset': `${courseHeaderOffset}px`,
    }"
  >
    <HomeHeaderSection ref="courseHeader" :site="site" />
    <main class="course-details-layout__content">
      <slot />
    </main>
    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.course-details-layout {
  display: flex;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;
}

.course-details-layout__content {
  min-width: 0;
  flex: 1 0 auto;
  padding-top: var(--course-header-offset, 86px);
}
</style>
