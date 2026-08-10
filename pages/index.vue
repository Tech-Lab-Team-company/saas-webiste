<script setup lang="ts">
import HomeV2 from '~/components/home/v2/HomeV2.vue'
import { useHomePage } from '~/features/HomePageFeature/composables/useHomePage'

const { home, pending, loadCoursesByYear } = await useHomePage()

definePageMeta({
  layout: 'home-v2',
})

const normalizeSeoText = (value: string | null | undefined) =>
  String(value || '').replace(/\s+/gu, ' ').trim()

const truncateSeoText = (value: string, limit: number) => {
  if (value.length <= limit) return value
  const shortened = value.slice(0, limit + 1)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, lastSpace > limit * 0.7 ? lastSpace : limit).trim()}…`
}

const heroSeoText = computed(() => [
  home.value.hero.data?.title,
  home.value.hero.data?.subtitle,
].map(normalizeSeoText).filter(Boolean))

const homeTitle = computed(() => truncateSeoText([
  normalizeSeoText(home.value.site.brandName),
  heroSeoText.value[0],
  'كورسات وكتب تعليمية',
].filter(Boolean).join(' | ') || 'منصة تعليمية للكورسات والكتب', 65))

const homeDescription = computed(() => truncateSeoText([
  ...heroSeoText.value,
  normalizeSeoText(home.value.hero.data?.description),
  ...(!home.value.hero.data?.description
    ? [normalizeSeoText(home.value.site.description)]
    : []),
].filter((value, index, values) => value && values.indexOf(value) === index).join(' — ') ||
  'اكتشف الكورسات والكتب والمحتوى التعليمي المناسب لمسارك الدراسي.', 155))

const homeKeywords = computed(() => Array.from(new Set([
  normalizeSeoText(home.value.site.brandName),
  ...heroSeoText.value,
  ...home.value.courses.data.tabs.flatMap((tab) =>
    tab.courses.map((course) => normalizeSeoText(course.sourceSubject?.title)),
  ),
  'كورسات تعليمية',
  'كتب تعليمية',
].filter(Boolean))).slice(0, 8).join(', '))
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
  keywords: () => homeKeywords.value,
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
