<script setup lang="ts">
import HomeV2 from '~/components/home/v2/HomeV2.vue'
import { useHomePage } from '~/features/HomePageFeature/composables/useHomePage'
import { normalizeSeoText, resolveHomepageSeo } from '~/utils/seoText'

const { home, pending, loadCoursesByYear, loadGeneralCourses } = await useHomePage()

definePageMeta({
  layout: 'home-v2',
})

const heroSeoText = computed(() => [
  home.value.hero.data?.title,
  home.value.hero.data?.subtitle,
].map(normalizeSeoText).filter(Boolean))

const homepageSeo = computed(() => resolveHomepageSeo({
  metaTitle: home.value.site.metaTitle,
  metaDescription: home.value.site.metaDescription,
  heroTitle: home.value.hero.data?.title,
  heroSubtitle: home.value.hero.data?.subtitle,
  heroDescription: home.value.hero.data?.description,
  brandName: home.value.site.brandName,
  siteDescription: home.value.site.description,
}))

const homeTitle = computed(() => homepageSeo.value.title)
const homeDescription = computed(() => homepageSeo.value.description)

const homeKeywords = computed(() =>
  normalizeSeoText(home.value.site.metaKeywords) ||
  Array.from(new Set([
    normalizeSeoText(home.value.site.brandName),
    normalizeSeoText(home.value.site.description),
    ...heroSeoText.value,
    ...home.value.courses.data.tabs.flatMap((tab) =>
      tab.courses.map((course) => normalizeSeoText(course.sourceSubject?.title)),
    ),
    'كورسات تعليمية',
    'كتب تعليمية',
  ].filter(Boolean))).slice(0, 8).join(', '),
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
  <HomeV2
    :home="home"
    :pending="pending"
    :load-courses-by-year="loadCoursesByYear"
    :load-general-courses="loadGeneralCourses"
  />
</template>
