<script setup lang="ts">
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
</script>

<template>
  <div
    class="home-v2 home-v2-layout"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />
    <LazySpeedDialToast class="social-icons" />
    <div class="home-v2-layout__content">
      <slot />
    </div>
    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.home-v2-layout {
  display: flex;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;
}

.home-v2-layout__content {
  min-width: 0;
  flex: 1 0 auto;
}
</style>
