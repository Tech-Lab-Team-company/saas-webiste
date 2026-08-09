

<template>
  <div>
    <LayoutsHeader />
    <Banner v-if="route.path != '/'" />
    <slot />
    <LayoutsFooter />
  </div>
</template>

<script lang="ts" setup>
import "primeicons/primeicons.css";
import "swiper/swiper-bundle.css";
import "~/assets/style/main.min.css";
import Banner from '~/components/Global/banner.vue';

const route = useRoute();



</script>

<style scoped lang="scss">


</style>
