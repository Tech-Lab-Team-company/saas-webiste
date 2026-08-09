<script setup lang="ts">
import HomeV2 from '~/components/home/v2/HomeV2.vue'
import { useHomePage } from '~/features/HomePageFeature/composables/useHomePage'

const { home, pending, loadCoursesByYear } = await useHomePage()

definePageMeta({
  layout: 'home-v2',
})

const homeTitle = computed(() =>
  home.value.site.brandName
    ? `${home.value.site.brandName} | كورسات وكتب تعليمية`
    : 'منصة تعليمية للكورسات والكتب',
)
const homeDescription = computed(() =>
  home.value.hero.data?.description ||
  home.value.site.description ||
  'اكتشف الكورسات والكتب والمحتوى التعليمي المناسب لمسارك الدراسي.',
)
const homeImage = computed(() =>
  home.value.hero.data?.image?.src ||
  home.value.hero.data?.mobileImage?.src ||
  home.value.site.cover?.src ||
  home.value.site.logo?.src ||
  undefined,
)

useSeoMeta({
  title: () => homeTitle.value,
  description: () => homeDescription.value,
  robots: 'index, follow, max-image-preview:large',
  ogTitle: () => homeTitle.value,
  ogDescription: () => homeDescription.value,
  ogImage: () => homeImage.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => homeTitle.value,
  twitterDescription: () => homeDescription.value,
  twitterImage: () => homeImage.value,
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
