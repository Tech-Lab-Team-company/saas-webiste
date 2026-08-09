<script setup lang="ts">
import HomeV2 from '~/components/home/v2/HomeV2.vue'
import { useHomePage } from '~/features/HomePageFeature/composables/useHomePage'

const { home, pending, loadCoursesByYear } = useHomePage()

definePageMeta({
  layout: 'home-v2',
})

useSeoMeta({
  title: () => `الصفحة الرئيسية${home.value.site.brandName ? ` | ${home.value.site.brandName}` : ''}`,
  robots: 'noindex, nofollow',
})

useHead({
  htmlAttrs: {
    lang: 'ar',
    dir: 'rtl',
  },
})
</script>

<template>
  <HomeV2 :home="home" :pending="pending" :load-courses-by-year="loadCoursesByYear" />
</template>
