<script setup lang="ts">
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import HomeCoursesSection from "~/components/home/v2/sections/HomeCoursesSection.vue";
import { useHomePage } from "~/features/HomePageFeature/composables/useHomePage";

const { home, pending, loadCoursesByYear } = useHomePage();

definePageMeta({ layout: "home-v2" });

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});
</script>

<template>
  <div
    class="home-v2 course-page"
    dir="rtl"
    :data-home-pending="pending ? 'true' : 'false'"
    :style="{
      '--home-v2-blue': home.site.colors.primary || '#28366c',
      '--home-v2-deep': home.site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${home.site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="home.site" />

    <main class="course-page__main">
      <header class="course-page__hero">
        <span class="course-page__hero-ring" aria-hidden="true" />
        <span class="course-page__hero-word" aria-hidden="true">COURSES</span>
        <div class="container course-page__hero-grid">
          <div class="course-page__hero-title">
            <span>فيزياء أولى · ثانية · ثالثة ثانوي</span>
            <h1>كل صف ليه<br /><em>خطة واضحة.</em></h1>
          </div>
          <p>
            اختار صفك الأول، وهتلاقي كورسات الفيزياء المتاحة لمرحلتك مع
            {{ home.site.brandName || "المنصة" }} من غير خلط بين الصفوف.
          </p>
        </div>
      </header>

      <HomeCoursesSection
        :courses="home.courses"
        :load-courses-by-year="loadCoursesByYear"
        catalog
      />
    </main>

    <HomeFooterSection :site="home.site" />
  </div>
</template>

<style scoped>
.course-page,
.course-page > main {
  width: 100%;
  min-width: 0;
}

.course-page__main {
  padding-top: 86px;
}

.course-page__hero {
  position: relative;
  min-height: 335px;
  overflow: hidden;
  background: linear-gradient(115deg, color-mix(in srgb, var(--home-v2-deep) 82%, #06113d), var(--home-v2-deep));
  color: #fff;
}

.course-page__hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(60px, 9vw, 150px);
  min-height: 335px;
  padding-block: 58px;
}

.course-page__hero-title {
  justify-self: start;
  animation: course-hero-title .8s cubic-bezier(.2,.75,.25,1) both;
}

.course-page__hero-title > span {
  color: #ffd05e;
  font-size: 12px;
  font-weight: 900;
}

.course-page__hero h1 {
  margin: 22px 0 0;
  font: 900 clamp(48px, 5vw, 76px)/1.08 var(--home-v2-heading);
  letter-spacing: -.045em;
}

.course-page__hero h1 em {
  color: #ff7a61;
  font-style: normal;
}

.course-page__hero p {
  max-width: 390px;
  margin: 75px auto 0;
  color: rgb(255 255 255 / 64%);
  font-size: 15px;
  line-height: 1.95;
  animation: course-hero-copy .75s .18s ease both;
}

.course-page__hero-ring {
  position: absolute;
  top: -185px;
  left: -115px;
  width: 405px;
  height: 405px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
}

.course-page__hero-word {
  position: absolute;
  bottom: -13px;
  left: 4%;
  color: rgb(255 255 255 / 4%);
  font: 900 clamp(72px, 9vw, 132px)/1 var(--home-v2-heading);
  letter-spacing: -.06em;
  animation: course-hero-word 1s .25s ease both;
}

@keyframes course-hero-title {
  from { opacity: 0; transform: translateY(34px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes course-hero-copy {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes course-hero-word {
  from { opacity: 0; transform: translateX(-45px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 700px) {
  .course-page__main { padding-top: 86px; }
  .course-page__hero, .course-page__hero-grid { min-height: 440px; }
  .course-page__hero-grid { grid-template-columns: 1fr; align-content: center; gap: 24px; padding-block: 55px; }
  .course-page__hero-title { justify-self: stretch; }
  .course-page__hero h1 { font-size: clamp(43px, 13vw, 60px); }
  .course-page__hero p { margin: 0; }
  .course-page__hero-word { font-size: 68px; }
}

@media (prefers-reduced-motion: reduce) {
  .course-page__hero-title, .course-page__hero p, .course-page__hero-word { animation: none; }
}
</style>
