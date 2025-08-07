

<template>
  <div>
    <LayoutsHeader />
    <Banner v-if="route.path != '/'" />
    <slot />
    <LayoutsFooter />
  </div>
</template>

<script lang="ts" setup>
import Banner from '~/components/Global/banner.vue';

const route = useRoute();



</script>

<style scoped lang="scss">


</style>