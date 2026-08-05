<script setup lang="ts">
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import { homeBlogsMock } from "~/features/HomePageFeature/mocks/homeBlogs.mock";

definePageMeta({ layout: "home-v2" });

const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const blogs = homeBlogsMock;
const tones = ["navy", "blue", "coral"] as const;
const markers = ["فهم", "05", "7D", "قوة", "وقت", "دقة"] as const;

const formatDate = (date: string | null) => {
  if (!date) return "قراءة عملية";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

useSeoMeta({
  title: () => `المدونة | ${site.value.brandName || "EduHub"}`,
  description: "مقالات عملية للمذاكرة وحل المسائل والمراجعة بخطوات قابلة للتطبيق.",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div
    class="home-v2 blog-listing"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <main class="blog-listing__page">
      <header class="blog-listing__hero">
        <div class="container blog-listing__hero-grid">
          <div class="blog-listing__hero-copy">
            <span class="blog-listing__eyebrow">مدونة {{ site.brandName || "EduHub" }}</span>
            <h1>فكّر في الفيزياء.<br /><em>مش تحفظها.</em></h1>
            <p>
              أفكار عملية للمذاكرة وحل المسائل والمراجعة، مكتوبة بخطوات تقدر
              تبدأ تطبقها من جلستك الجاية.
            </p>
            <div class="blog-listing__hero-meta" aria-label="معلومات المدونة">
              <span><b>{{ blogs.length }}</b> مقالات عملية</span>
              <span><b>100%</b> قراءة مجانية</span>
            </div>
          </div>

          <div class="blog-listing__method" aria-label="طريقة التعلم في المدونة">
            <span>قاعدة بسيطة</span>
            <strong>افهم الفكرة،<br />حل بإيدك،<br /><em>راجع خطأك.</em></strong>
            <ol>
              <li><b>01</b><span>فهم</span></li>
              <li><b>02</b><span>تطبيق</span></li>
              <li><b>03</b><span>مراجعة</span></li>
            </ol>
          </div>
        </div>
      </header>

      <section class="blog-listing__main" aria-labelledby="blog-listing-title">
        <div class="container">
          <header class="blog-listing__section-heading">
            <div>
              <span>ابدأ بالمشكلة اللي بتقابلك</span>
              <h2 id="blog-listing-title">مقالات قصيرة، وخطوات قابلة للتطبيق.</h2>
            </div>
            <p>كل مقال مستقل؛ اختار الموضوع المناسب لك وابدأ منه مباشرة.</p>
          </header>

          <div class="blog-listing__grid">
            <article
              v-for="(blog, index) in blogs"
              :key="blog.id"
              :class="[
                'blog-listing__card',
                `blog-listing__card--${tones[index % tones.length]}`,
                { 'blog-listing__card--featured': index === 0 },
              ]"
            >
              <NuxtLink :to="blog.route" class="blog-listing__card-link">
                <div class="blog-listing__visual" aria-hidden="true">
                  <span>{{ blog.subtitle || "نصائح الفيزياء" }}</span>
                  <strong>{{ markers[index] }}</strong>
                  <small>{{ String(index + 1).padStart(2, "0") }}</small>
                </div>
                <div class="blog-listing__card-body">
                  <div class="blog-listing__card-meta">
                    <span>{{ blog.subtitle || "مدونة الفيزياء" }}</span>
                    <time v-if="blog.date" :datetime="blog.date">{{ formatDate(blog.date) }}</time>
                  </div>
                  <h2>{{ blog.title }}</h2>
                  <p>{{ blog.description }}</p>
                  <span class="blog-listing__read">اقرأ المقال <i aria-hidden="true">←</i></span>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </main>

    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.blog-listing__page {
  min-height: 100dvh;
  padding-top: 86px;
  overflow: clip;
  background: var(--home-v2-paper);
  color: var(--home-v2-ink);
}

.blog-listing__hero {
  position: relative;
  overflow: hidden;
  background: var(--home-v2-deep);
  color: #fff;
}

.blog-listing__hero::before,
.blog-listing__hero::after {
  position: absolute;
  border: 1px solid #ffffff1a;
  border-radius: 50%;
  content: "";
}

.blog-listing__hero::before {
  top: -330px;
  left: -320px;
  width: 560px;
  height: 560px;
}

.blog-listing__hero::after {
  right: -150px;
  bottom: -165px;
  width: 250px;
  height: 250px;
  border: 56px solid color-mix(in srgb, var(--home-v2-blue) 26%, transparent);
}

.blog-listing__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 540px;
  grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.7fr);
  align-items: center;
  gap: clamp(50px, 8vw, 110px);
  padding-block: 72px;
}

.blog-listing__eyebrow,
.blog-listing__section-heading span {
  color: var(--home-v2-coral);
  font-size: 13px;
  font-weight: 900;
}

.blog-listing__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.blog-listing__eyebrow::before {
  width: 34px;
  height: 2px;
  background: var(--home-v2-coral);
  content: "";
}

.blog-listing__hero-copy h1 {
  max-width: 720px;
  margin: 16px 0 18px;
  font: 900 clamp(48px, 5.3vw, 74px) / 1.16 var(--home-v2-heading);
  letter-spacing: -0.04em;
}

.blog-listing__hero-copy h1 em,
.blog-listing__method strong em {
  color: var(--home-v2-coral);
  font-style: normal;
}

.blog-listing__hero-copy > p {
  max-width: 650px;
  margin: 0;
  color: #ffffffbd;
  font-size: 17px;
  line-height: 1.9;
}

.blog-listing__hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 28px;
}

.blog-listing__hero-meta span {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  color: #ffffffb3;
  font-size: 13px;
}

.blog-listing__hero-meta b {
  color: #fff;
  font: 900 19px var(--home-v2-heading);
}

.blog-listing__method {
  position: relative;
  min-height: 330px;
  padding: 34px;
  border: 1px solid #ffffff2e;
  background: #ffffff12;
  box-shadow: 24px 24px color-mix(in srgb, var(--home-v2-blue) 32%, transparent);
}

.blog-listing__method::after {
  position: absolute;
  top: 24px;
  left: 25px;
  width: 110px;
  height: 110px;
  border: 1px solid #ffffff24;
  border-radius: 50%;
  content: "";
}

.blog-listing__method > span {
  color: var(--home-v2-coral);
  font-size: 12px;
  font-weight: 900;
}

.blog-listing__method > strong {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12px;
  font: 900 31px/1.45 var(--home-v2-heading);
}

.blog-listing__method ol {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.blog-listing__method li {
  display: flex;
  min-height: 66px;
  flex-direction: column;
  justify-content: center;
  padding: 11px;
  border-top: 2px solid var(--home-v2-blue);
  background: #ffffff0f;
}

.blog-listing__method li b {
  color: var(--home-v2-coral);
  font: 900 11px var(--home-v2-heading);
}

.blog-listing__method li span {
  margin-top: 3px;
  color: #ffffffd1;
  font-size: 12px;
  font-weight: 800;
}

.blog-listing__main {
  padding: 86px 0 100px;
}

.blog-listing__section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.52fr);
  align-items: end;
  gap: 65px;
  margin-bottom: 34px;
}

.blog-listing__section-heading h2 {
  margin: 7px 0 0;
  font: 900 clamp(30px, 3.4vw, 46px) / 1.35 var(--home-v2-heading);
  letter-spacing: -0.03em;
}

.blog-listing__section-heading > p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.85;
}

.blog-listing__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.blog-listing__card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: var(--home-v2-surface);
  box-shadow: 0 24px 60px -48px #0611478c;
  transition: transform 0.2s, box-shadow 0.2s;
}

.blog-listing__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 34px 70px -48px #061147a6;
}

.blog-listing__card--featured {
  grid-column: 1 / -1;
}

.blog-listing__card-link {
  display: grid;
  min-height: 100%;
  grid-template-rows: 225px 1fr;
  color: inherit;
}

.blog-listing__card--featured .blog-listing__card-link {
  grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1.22fr);
  grid-template-rows: minmax(300px, auto);
}

.blog-listing__visual {
  position: relative;
  overflow: hidden;
  padding: 24px;
  background: var(--home-v2-deep);
  color: #fff;
}

.blog-listing__visual::before,
.blog-listing__visual::after {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  opacity: 0.15;
  content: "";
}

.blog-listing__visual::before {
  bottom: -120px;
  left: -95px;
  width: 220px;
  height: 220px;
}

.blog-listing__visual::after {
  bottom: -52px;
  left: -32px;
  width: 105px;
  height: 105px;
}

.blog-listing__visual > span {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 900;
}

.blog-listing__visual > strong {
  position: absolute;
  z-index: 1;
  right: 24px;
  bottom: 20px;
  font: 900 clamp(58px, 8vw, 110px) / 1 var(--home-v2-heading);
  letter-spacing: -0.08em;
}

.blog-listing__visual > small {
  position: absolute;
  top: 21px;
  left: 23px;
  font: 900 13px var(--home-v2-heading);
}

.blog-listing__card--blue .blog-listing__visual {
  background: var(--home-v2-blue);
}

.blog-listing__card--coral .blog-listing__visual {
  background: var(--home-v2-coral);
  color: #081b3a;
}

.blog-listing__card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
}

.blog-listing__card--featured .blog-listing__card-body {
  justify-content: center;
  padding: clamp(32px, 5vw, 58px);
}

.blog-listing__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 17px;
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 800;
}

.blog-listing__card-meta span:first-child {
  color: var(--home-v2-blue);
}

.blog-listing__card-body h2 {
  margin: 13px 0 9px;
  color: var(--home-v2-ink);
  font: 900 clamp(21px, 2.2vw, 31px) / 1.45 var(--home-v2-heading);
  letter-spacing: -0.02em;
}

.blog-listing__card-body p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.85;
}

.blog-listing__read {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 18px;
  margin-top: auto;
  padding-top: 20px;
  color: var(--home-v2-blue);
  font-size: 14px;
  font-weight: 900;
}

.blog-listing__read i {
  color: var(--home-v2-coral);
  font-size: 18px;
  font-style: normal;
}

@media (max-width: 940px) {
  .blog-listing__hero-grid {
    grid-template-columns: 1fr;
    gap: 38px;
    padding-block: 64px;
  }

  .blog-listing__method {
    width: min(560px, 100%);
  }

  .blog-listing__section-heading {
    grid-template-columns: 1fr;
    gap: 13px;
  }
}

@media (max-width: 720px) {
  .blog-listing__grid {
    grid-template-columns: 1fr;
  }

  .blog-listing__card--featured {
    grid-column: auto;
  }

  .blog-listing__card--featured .blog-listing__card-link {
    grid-template-columns: 1fr;
    grid-template-rows: 225px 1fr;
  }
}

@media (max-width: 560px) {
  .blog-listing__page {
    padding-top: 76px;
  }

  .blog-listing__hero-grid {
    min-height: 0;
    padding-block: 52px;
  }

  .blog-listing__hero-copy h1 {
    font-size: 42px;
  }

  .blog-listing__hero-copy > p {
    font-size: 15px;
  }

  .blog-listing__method {
    min-height: 300px;
    padding: 26px;
    box-shadow: 12px 12px color-mix(in srgb, var(--home-v2-blue) 32%, transparent);
  }

  .blog-listing__method > strong {
    font-size: 27px;
  }

  .blog-listing__main {
    padding-block: 66px 76px;
  }

  .blog-listing__card-body,
  .blog-listing__card--featured .blog-listing__card-body {
    padding: 24px;
  }

  .blog-listing__card-body h2 {
    font-size: 23px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-listing__card {
    transition: none;
  }
}
</style>
