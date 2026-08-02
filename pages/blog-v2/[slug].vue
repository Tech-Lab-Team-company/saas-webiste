<script setup lang="ts">
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import {
  findMockBlogDetails,
  homeBlogDetailsMock,
} from "~/features/HomePageFeature/mocks/homeBlogDetails.mock";

definePageMeta({ layout: "home-v2" });

const route = useRoute();
const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const slug = computed(() => String(route.params.slug || ""));
const blog = computed(() => findMockBlogDetails(slug.value));
const blogIndex = computed(() =>
  homeBlogDetailsMock.findIndex((item) => item.slug === slug.value),
);
const tone = computed(
  () => ["navy", "blue", "coral"][Math.max(blogIndex.value, 0) % 3],
);
const relatedBlogs = computed(() =>
  homeBlogDetailsMock.filter((item) => item.slug !== slug.value).slice(0, 2),
);

const formattedDate = computed(() => {
  if (!blog.value?.date) return "";
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(blog.value.date));
});

useSeoMeta({
  title: () =>
    blog.value
      ? `${blog.value.title} | ${site.value.brandName || "المدونة"}`
      : "المقال غير موجود",
  description: () => blog.value?.description || site.value.description || "",
  ogTitle: () => blog.value?.title || "",
  ogDescription: () => blog.value?.description || "",
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div
    class="blog-v2"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${
        site.colors.primary || '#28366c'
      } 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <template v-if="blog">
      <header :class="['blog-v2__hero', `blog-v2__hero--${tone}`]">
        <div class="blog-v2__shell blog-v2__hero-grid">
          <div class="blog-v2__hero-copy">
            <nav class="blog-v2__breadcrumbs" aria-label="مسار الصفحة">
              <NuxtLink to="/home-v2">الرئيسية</NuxtLink><span>/</span>
              <NuxtLink to="/home-v2#blog-preview">المدونة</NuxtLink
              ><span>/</span>
              <b>{{ blog.category }}</b>
            </nav>
            <span class="blog-v2__category">{{ blog.category }}</span>
            <h1>
              {{ blog.title }}<br /><em>{{ blog.subtitle }}</em>
            </h1>
            <p>{{ blog.description }}</p>
            <div class="blog-v2__meta">
              <span>{{ blog.readTime }}</span>
              <time :datetime="blog.date">{{ formattedDate }}</time>
            </div>
          </div>
          <div class="blog-v2__mark" aria-hidden="true">
            <small>{{ String(blogIndex + 1).padStart(2, "0") }}</small>
            <strong>{{ blog.marker }}</strong>
            <span>{{ site.brandName || "Physics" }}</span>
          </div>
        </div>
      </header>

      <main class="blog-v2__main">
        <div class="blog-v2__shell blog-v2__layout">
          <article class="blog-v2__article">
            <p class="blog-v2__lead">{{ blog.lead }}</p>

            <section
              v-for="(section, index) in blog.sections"
              :id="`section-${index + 1}`"
              :key="section.title"
              class="blog-v2__content-section"
            >
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
              <h2>{{ index + 1 }}. {{ section.title }}</h2>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
              <ul v-if="section.bullets?.length">
                <li v-for="bullet in section.bullets" :key="bullet">
                  {{ bullet }}
                </li>
              </ul>
              <aside v-if="section.tip" class="blog-v2__tip">
                <b>{{ section.tip.title }}</b>
                <p>{{ section.tip.text }}</p>
              </aside>
            </section>

            <section class="blog-v2__conclusion">
              <span>الخلاصة</span>
              <h2>خطوة صغيرة تتكرر، أفضل من خطة كبيرة تتوقف.</h2>
              <p>
                اختار نقطة واحدة من المقال وطبّقها في مذاكرتك اليوم، وبعدها قيّم
                الفرق وعدّل طريقتك بهدوء.
              </p>
              <NuxtLink to="/course">شوف كورسات صفك <span>←</span></NuxtLink>
            </section>
          </article>

          <aside class="blog-v2__aside">
            <nav class="blog-v2__toc" aria-label="محتويات المقال">
              <span>في هذا المقال</span>
              <a
                v-for="(section, index) in blog.sections"
                :key="section.title"
                :href="`#section-${index + 1}`"
              >
                <b>{{ String(index + 1).padStart(2, "0") }}</b
                ><span>{{ section.title }}</span>
              </a>
            </nav>
            <div class="blog-v2__takeaways">
              <span>افتكر 3 حاجات</span>
              <ul>
                <li v-for="item in blog.takeaways" :key="item">{{ item }}</li>
              </ul>
            </div>
          </aside>
        </div>

        <section class="blog-v2__related" aria-labelledby="related-title">
          <div class="blog-v2__shell">
            <div class="blog-v2__related-heading">
              <span>كمّل القراءة</span>
              <h2 id="related-title">مقالات تساعدك في الخطوة الجاية.</h2>
            </div>
            <div class="blog-v2__related-grid">
              <article v-for="item in relatedBlogs" :key="item.id">
                <NuxtLink :to="`/blog-v2/${item.slug}`">
                  <span>{{ item.category }} · {{ item.readTime }}</span>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                  <b>اقرأ المقال ←</b>
                </NuxtLink>
              </article>
            </div>
            <NuxtLink class="blog-v2__all" to="/home-v2#blog-preview"
              >كل مقالات المدونة ←</NuxtLink
            >
          </div>
        </section>
      </main>
    </template>

    <main v-else class="blog-v2__not-found">
      <span>404</span>
      <h1>المقال غير موجود</h1>
      <p>الرابط غير صحيح أو المقال لم يعد متاحًا.</p>
      <NuxtLink to="/home-v2#blog-preview">العودة إلى المدونة</NuxtLink>
    </main>

    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.blog-v2 {
  --ink: #081b3a;
  --muted: #4f617c;
  --line: #dfe7f3;
  --coral: #ef7a63;
  --home-v2-ink: #081b3a;
  --home-v2-muted: #4f617c;
  --home-v2-line: #081b3a24;
  --home-v2-heading: "bold", Tahoma, Arial, sans-serif;
  min-width: 0;
  overflow-x: clip;
  color: var(--ink);
  background: #f4f7fb;
  font-family: "regular", Tahoma, Arial, sans-serif;
}
.blog-v2 * {
  box-sizing: border-box;
}
.blog-v2 :deep(.container),
.blog-v2__shell {
  width: min(1180px, calc(100% - 48px));
  margin-inline: auto;
}
.blog-v2__hero {
  position: relative;
  overflow: hidden;
  padding-top: 86px;
  color: #fff;
  background: var(--home-v2-deep);
}
.blog-v2__hero:before,
.blog-v2__hero:after {
  position: absolute;
  border: 1px solid #ffffff20;
  border-radius: 50%;
  content: "";
}
.blog-v2__hero:before {
  top: -170px;
  left: -100px;
  width: 430px;
  height: 430px;
}
.blog-v2__hero:after {
  right: 45%;
  bottom: -240px;
  width: 480px;
  height: 480px;
}
.blog-v2__hero--blue {
  background: var(--home-v2-blue);
}
.blog-v2__hero--coral {
  background: var(--coral);
}
.blog-v2__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 520px;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.55fr);
  align-items: center;
  gap: clamp(50px, 9vw, 130px);
  padding-block: 72px;
}
.blog-v2__breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 28px;
  color: #ffffffad;
  font-size: 13px;
}
.blog-v2__breadcrumbs b {
  color: #fff;
}
.blog-v2__category {
  display: inline-flex;
  padding: 7px 12px;
  border: 1px solid #ffffff52;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}
.blog-v2__hero h1 {
  max-width: 800px;
  margin: 17px 0 14px;
  font: 900 clamp(43px, 5vw, 68px) / 1.18 "bold", Tahoma, sans-serif;
  letter-spacing: -0.035em;
}
.blog-v2__hero h1 em {
  color: #fff;
  opacity: 0.72;
  font-style: normal;
}
.blog-v2__hero-copy > p {
  max-width: 740px;
  margin: 0;
  color: #ffffffd1;
  font-size: 17px;
  line-height: 1.9;
}
.blog-v2__meta {
  display: flex;
  gap: 22px;
  margin-top: 25px;
  color: #ffffffb8;
  font-size: 13px;
}
.blog-v2__mark {
  position: relative;
  display: grid;
  min-height: 330px;
  place-content: center;
  overflow: hidden;
  border: 1px solid #ffffff35;
  border-radius: 18px;
  background: #ffffff12;
  text-align: center;
  box-shadow: 20px 24px #00000014;
}
.blog-v2__mark:before,
.blog-v2__mark:after {
  position: absolute;
  border: 1px solid #ffffff26;
  border-radius: 50%;
  content: "";
}
.blog-v2__mark:before {
  top: -75px;
  right: -65px;
  width: 210px;
  height: 210px;
}
.blog-v2__mark:after {
  bottom: -90px;
  left: -55px;
  width: 230px;
  height: 230px;
}
.blog-v2__mark > * {
  position: relative;
  z-index: 1;
}
.blog-v2__mark small {
  font-weight: 900;
}
.blog-v2__mark strong {
  font: 900 clamp(65px, 8vw, 105px) / 1 "bold";
}
.blog-v2__mark span {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 900;
  opacity: 0.72;
}
.blog-v2__main {
  padding-top: 74px;
}
.blog-v2__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: 32px;
}
.blog-v2__article {
  padding: clamp(32px, 5vw, 70px);
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 30px 80px -68px #06114780;
}
.blog-v2__lead {
  position: relative;
  margin: 0 0 58px;
  padding: 27px 34px;
  border-inline-start: 4px solid var(--coral);
  border-radius: 2px;
  background: color-mix(in srgb, var(--coral) 10%, white);
  color: #172b4d;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.95;
  box-shadow: 0 12px 32px -30px color-mix(in srgb, var(--coral) 65%, transparent);
}
.blog-v2__content-section {
  position: relative;
  padding-inline-start: 58px;
  scroll-margin-top: 24px;
}
.blog-v2__content-section + .blog-v2__content-section {
  margin-top: 58px;
  padding-top: 58px;
  border-top: 1px solid var(--line);
}
.blog-v2__content-section > span {
  position: absolute;
  top: 2px;
  inset-inline-start: 0;
  color: var(--home-v2-blue);
  font: 900 14px "bold";
}
.blog-v2__content-section + .blog-v2__content-section > span {
  top: 60px;
}
.blog-v2__content-section h2 {
  margin: 0 0 18px;
  font: 900 clamp(26px, 3vw, 36px) / 1.45 "bold";
}
.blog-v2__content-section > p {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 17px;
  line-height: 2;
}
.blog-v2__content-section ul {
  margin: 22px 0;
  padding: 20px 25px;
  border-inline-start: 3px solid var(--home-v2-blue);
  background: var(--home-v2-blue-light);
  list-style: none;
}
.blog-v2__content-section li {
  position: relative;
  padding-inline-start: 20px;
  color: #304563;
  line-height: 1.9;
}
.blog-v2__content-section li:before {
  position: absolute;
  top: 0.8em;
  inset-inline-start: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--home-v2-blue);
  content: "";
}
.blog-v2__tip {
  margin-top: 25px;
  padding: 22px 25px;
  border: 1px solid color-mix(in srgb, var(--coral) 35%, white);
  border-radius: 10px;
  background: color-mix(in srgb, var(--coral) 9%, white);
}
.blog-v2__tip b {
  color: #c9523d;
}
.blog-v2__tip p {
  margin: 5px 0 0;
  color: var(--muted);
  line-height: 1.8;
}
.blog-v2__conclusion {
  margin-top: 65px;
  padding: 38px;
  border-radius: 12px;
  color: #fff;
  background: var(--home-v2-deep);
}
.blog-v2__conclusion > span {
  font-size: 12px;
  font-weight: 900;
  opacity: 0.7;
}
.blog-v2__conclusion h2 {
  margin: 8px 0;
  font: 900 30px/1.45 "bold";
}
.blog-v2__conclusion p {
  color: #ffffffc4;
  line-height: 1.85;
}
.blog-v2__conclusion a {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  margin-top: 12px;
  padding: 12px 18px;
  border-radius: 6px;
  color: var(--home-v2-deep);
  background: #fff;
  font-weight: 900;
}
.blog-v2__aside {
  position: sticky;
  top: 24px;
  display: grid;
  gap: 18px;
}
.blog-v2__toc,
.blog-v2__takeaways {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}
.blog-v2__toc > span,
.blog-v2__takeaways > span {
  display: block;
  margin-bottom: 15px;
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}
.blog-v2__toc a {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}
.blog-v2__toc a:hover {
  color: var(--home-v2-blue);
}
.blog-v2__toc b {
  color: var(--home-v2-blue);
}
.blog-v2__takeaways {
  color: #fff;
  background: var(--home-v2-blue);
  border-color: transparent;
}
.blog-v2__takeaways > span {
  color: #fff;
}
.blog-v2__takeaways ul {
  display: grid;
  gap: 11px;
  margin: 0;
  padding-inline-start: 18px;
  color: #ffffffdc;
  line-height: 1.7;
}
.blog-v2__related {
  margin-top: 80px;
  padding: 82px 0;
  background: #eaf0f8;
}
.blog-v2__related-heading > span {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}
.blog-v2__related-heading h2 {
  margin: 8px 0 30px;
  font: 900 clamp(30px, 4vw, 46px) "bold";
}
.blog-v2__related-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.blog-v2__related-grid article {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  transition: 0.24s ease;
}
.blog-v2__related-grid article:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 50px -40px #061147;
}
.blog-v2__related-grid a {
  display: block;
  padding: 28px;
}
.blog-v2__related-grid span {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}
.blog-v2__related-grid h3 {
  margin: 10px 0;
  font: 900 22px/1.5 "bold";
}
.blog-v2__related-grid p {
  color: var(--muted);
  line-height: 1.75;
}
.blog-v2__related-grid b {
  color: var(--home-v2-blue);
  font-size: 13px;
}
.blog-v2__all {
  display: inline-flex;
  margin-top: 28px;
  color: var(--home-v2-blue);
  font-weight: 900;
}
.blog-v2__not-found {
  display: grid;
  min-height: 75vh;
  place-content: center;
  padding: 140px 20px;
  text-align: center;
}
.blog-v2__not-found > span {
  color: var(--home-v2-blue);
  font: 900 70px "bold";
}
.blog-v2__not-found h1 {
  margin: 0;
  font: 900 40px "bold";
}
.blog-v2__not-found p {
  color: var(--muted);
}
.blog-v2__not-found a {
  width: fit-content;
  margin: 15px auto;
  padding: 12px 20px;
  border-radius: 6px;
  color: #fff;
  background: var(--home-v2-blue);
  font-weight: 900;
}
@media (max-width: 960px) {
  .blog-v2__hero-grid {
    grid-template-columns: 1fr 250px;
    gap: 40px;
  }
  .blog-v2__layout {
    grid-template-columns: 1fr;
  }
  .blog-v2__aside {
    position: static;
    grid-template-columns: 1fr 1fr;
  }
  .blog-v2__toc {
    display: none;
  }
}
@media (max-width: 700px) {
  .blog-v2__shell {
    width: calc(100% - 30px);
  }
  .blog-v2__hero-grid {
    grid-template-columns: 1fr;
    padding-block: 55px;
  }
  .blog-v2__hero h1 {
    font-size: 42px;
  }
  .blog-v2__mark {
    min-height: 230px;
  }
  .blog-v2__main {
    padding-top: 40px;
  }
  .blog-v2__article {
    padding: 30px 22px;
  }
  .blog-v2__lead {
    margin-bottom: 45px;
    padding: 22px 20px;
    font-size: 17px;
    line-height: 1.9;
  }
  .blog-v2__content-section {
    padding-inline-start: 0;
  }
  .blog-v2__content-section > span,
  .blog-v2__content-section + .blog-v2__content-section > span {
    position: static;
    display: block;
    margin-bottom: 8px;
  }
  .blog-v2__content-section h2 {
    font-size: 26px;
  }
  .blog-v2__content-section > p {
    font-size: 16px;
  }
  .blog-v2__conclusion {
    padding: 28px 22px;
  }
  .blog-v2__aside,
  .blog-v2__related-grid {
    grid-template-columns: 1fr;
  }
  .blog-v2__related {
    margin-top: 45px;
    padding: 60px 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .blog-v2__related-grid article {
    transition: none;
  }
  .blog-v2__related-grid article:hover {
    transform: none;
  }
}
</style>
