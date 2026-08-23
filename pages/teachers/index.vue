<script setup lang="ts">
import HomeTeachersSection from "~/components/home/v2/sections/HomeTeachersSection.vue";
import { useTeacherDirectory } from "~/features/HomePageFeature/composables/useTeacherDirectory";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

definePageMeta({
  layout: "home-v2",
});

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const {
  hasTeacherDirectory,
  teachers,
  pending,
  refresh,
  searchTeachers,
} = await useTeacherDirectory();

if (!hasTeacherDirectory) {
  await navigateTo("/about-teacher", { redirectCode: 302 });
}

const pageTitle = computed(
  () => `مدرسو ${site.value.brandName || "المنصة"}`,
);
const pageDescription = computed(
  () =>
    `تعرّف على مدرسي ${site.value.brandName || "المنصة"}، خبراتهم والكورسات التي يقدمونها.`,
);
const socialImage = computed(
  () =>
    teachers.value.data.find((teacher) => teacher.image)?.image?.src ||
    site.value.cover?.src ||
    site.value.logo?.src ||
    undefined,
);

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  robots: "index, follow, max-image-preview:large",
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogImage: () => socialImage.value,
  ogType: "website",
  twitterCard: "summary_large_image",
});

useHead({
  htmlAttrs: { lang: "ar", dir: "rtl" },
});
</script>

<template>
  <main class="teachers-page">
    <HomeTeachersSection
      :teachers="teachers"
      :site="site"
      :pending="pending"
      :on-retry="refresh"
      catalog
      @search="searchTeachers"
    />
  </main>
</template>

<style scoped>
.teachers-page {
  min-height: 100vh;
  padding-top: 86px;
  background: var(--app-bg, #fbfcff);
}

@media (max-width: 760px) {
  .teachers-page { padding-top: 118px; }
}
</style>
