<template>
  <div class="home-v2 home-v2-layout" :style="{
    '--home-v2-blue': site.colors.primary || '#28366c',
    '--home-v2-deep': site.colors.secondary || '#3a3e7e',
    '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
  }">
    <HomeHeaderSection :site="site" />
    <LazySpeedDialToast class="social-icons" />
    <main class="home-v2-layout__content">
      <slot />
    </main>
    <HomeFooterSection :site="site" />
  </div>
</template>

<script lang="ts" setup>
import "swiper/swiper-bundle.css";
import "~/assets/style/main.min.css";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));



</script>

<style scoped lang="scss">
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
  padding-top: 86px;
}

@media (max-width: 980px) {
  .home-v2-layout__content {
    padding-top: 143px;
  }
}

@media (max-width: 590px) {
  .home-v2-layout__content {
    padding-top: 96px;
  }
}
</style>
