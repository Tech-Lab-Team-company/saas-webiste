<script setup lang="ts">
import { storeToRefs } from "pinia";
import "primeicons/primeicons.css";
import "~/assets/style/main.min.css";
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
</script>

<template>
  <div
    class="home-v2 course-details-layout"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />
    <main class="course-details-layout__content">
      <slot />
    </main>
    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.course-details-layout {
  min-height: 100vh;
}

.course-details-layout__content {
  min-height: 70vh;
  padding-top: 86px;
}

@media (max-width: 700px) {
  .course-details-layout__content {
    padding-top: 86px;
  }
}
</style>
