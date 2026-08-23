<script setup lang="ts">
import HomeTeachersSection from "~/components/home/v2/sections/HomeTeachersSection.vue";
import { useTeacherDirectory } from "~/features/HomePageFeature/composables/useTeacherDirectory";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

definePageMeta({ layout: "home-v2" });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const { hasTeacherDirectory, teachers, pending, refresh } = await useTeacherDirectory();

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
    <header class="teachers-page__hero">
      <div class="teachers-page__mark" aria-hidden="true">TEAM</div>
      <div class="container teachers-page__hero-grid">
        <div>
          <span>الخبرة التي تقود رحلتك</span>
          <h1>مدرسونا.<br /><em>اختار خبرتك.</em></h1>
        </div>
        <p>
          وجوه وخبرات مختلفة، يجمعها هدف واحد: تقديم محتوى يساعدك توصل لهدفك
          على {{ site.brandName || "المنصة" }}.
        </p>
      </div>
    </header>

    <HomeTeachersSection
      :teachers="teachers"
      :site="site"
      :pending="pending"
      :on-retry="refresh"
      catalog
    />
  </main>
</template>

<style scoped>
.teachers-page {
  min-height: 100vh;
  background: var(--app-bg, #fbfcff);
}

.teachers-page__hero {
  position: relative;
  overflow: hidden;
  padding: clamp(92px, 11vw, 156px) 0 clamp(68px, 8vw, 110px);
  background:
    radial-gradient(circle at 14% 20%, color-mix(in srgb, var(--home-v2-blue) 48%, transparent), transparent 30%),
    linear-gradient(135deg, var(--home-v2-deep), color-mix(in srgb, var(--home-v2-blue) 74%, #07152e));
  color: #fff;
}

.teachers-page__hero::after {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px);
  background-size: 54px 54px;
  content: "";
  mask-image: linear-gradient(to bottom, black, transparent 90%);
  pointer-events: none;
}

.teachers-page__mark {
  position: absolute;
  inset-inline-end: -18px;
  bottom: -0.2em;
  color: rgb(255 255 255 / 4%);
  font-size: clamp(118px, 22vw, 360px);
  font-weight: 950;
  line-height: 0.72;
  letter-spacing: -0.08em;
  pointer-events: none;
}

.teachers-page__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: 48px;
}

.teachers-page__hero span {
  color: color-mix(in srgb, var(--home-v2-blue-light) 58%, #fff);
  font-size: 13px;
  font-weight: 900;
}

.teachers-page__hero h1 {
  margin: 14px 0 0;
  font-size: clamp(52px, 7.4vw, 108px);
  line-height: 0.96;
  letter-spacing: -0.055em;
}

.teachers-page__hero h1 em {
  color: color-mix(in srgb, var(--home-v2-blue-light) 66%, #fff);
  font-style: normal;
}

.teachers-page__hero p {
  max-width: 520px;
  margin: 0;
  color: rgb(255 255 255 / 74%);
  font-size: 16px;
  line-height: 2;
}

@media (max-width: 760px) {
  .teachers-page__hero-grid { grid-template-columns: 1fr; gap: 28px; }
  .teachers-page__hero h1 { font-size: 56px; }
}
</style>
