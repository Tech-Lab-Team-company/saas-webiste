<script setup lang="ts">
import "~/assets/css/home-v2.css";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";
import { mapBlogsPage } from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeBlogViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

interface ApiBlogDetails {
  id: number;
  slug: string | null;
  read_time: number | string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  quote: string | null;
  content_point: string[] | null;
  read_remember: string[] | null;
  summary:
    | string
    | {
        title?: string | null;
        subtitle?: string | null;
      }
    | null;
  date: string | null;
  mail_image: string | null;
  attachments?: Array<{ id?: number; file?: string; alt?: string }>;
  hashtags?: Array<{ id?: number; title?: string }>;
}

definePageMeta({ layout: "home-v2" });

const route = useRoute();
const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const slug = computed(() => String(route.params.slug || ""));
const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: blog, pending, error, refresh } = await useAsyncData(
  `blog-details:${webDomain}:${slug.value}`,
  async () => (await api.fetchBlog(slug.value)) as ApiBlogDetails,
  { watch: [slug] },
);
const { data: allBlogs } = await useAsyncData<HomeBlogViewModel[]>(
  `blog-related:${webDomain}`,
  async () => mapBlogsPage(await api.fetchBlogs()),
  { default: () => [] },
);
const routeSlug = (item: HomeBlogViewModel) => {
  const segment = item.route.split("/").filter(Boolean).at(-1) || "";

  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};
const blogIndex = computed(() =>
  Math.max(allBlogs.value.findIndex((item) => routeSlug(item) === slug.value), 0),
);
const tone = computed(
  () => ["navy", "blue", "coral"][blogIndex.value % 3],
);
const relatedBlogs = computed(() =>
  allBlogs.value.filter((item) => routeSlug(item) !== slug.value).slice(0, 2),
);
const category = computed(() => blog.value?.hashtags?.[0]?.title || "المدونة");
const marker = computed(() => blog.value?.title?.trim().slice(0, 3) || "");
const contentPoints = computed(() =>
  (blog.value?.content_point || []).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  ),
);
const readRemember = computed(() =>
  (blog.value?.read_remember || []).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  ),
);
const articleImage = computed(() => {
  const attachment = blog.value?.attachments?.find((item) => item.file);

  if (attachment?.file) {
    return {
      src: attachment.file,
      alt: attachment.alt || blog.value?.title || "صورة المقال",
    };
  }

  if (blog.value?.mail_image) {
    return {
      src: blog.value.mail_image,
      alt: blog.value.title || "صورة المقال",
    };
  }

  return null;
});
const summaryContent = computed(() => {
  const summary = blog.value?.summary;

  if (typeof summary === "string") {
    const text = summary.trim();
    return text ? { title: "ملخص المقال", subtitle: text } : null;
  }

  if (!summary || typeof summary !== "object") return null;

  const title = summary.title?.trim() || "";
  const subtitle = summary.subtitle?.trim() || "";

  return title || subtitle ? { title, subtitle } : null;
});
const readTime = computed(() => {
  if (blog.value?.read_time !== null && blog.value?.read_time !== undefined) {
    const value = String(blog.value.read_time).trim();
    if (value) {
      return /^\d+(?:[.,]\d+)?$/.test(value) ? `${value} دقيقة قراءة` : value;
    }
  }

  const content = `${blog.value?.subtitle || ""} ${blog.value?.description || ""}`
    .replace(/<[^>]*>/g, " ")
    .trim();
  if (!content) return "";
  return `${Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180))} دقائق قراءة`;
});

const formattedDate = computed(() => {
  if (!blog.value?.date) return "";
  const parsedDate = new Date(blog.value.date);
  if (Number.isNaN(parsedDate.getTime())) return blog.value.date;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
});

useSeoMeta({
  title: () =>
    blog.value
      ? `${blog.value.title}${site.value.brandName ? ` | ${site.value.brandName}` : ""}`
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
    <main v-if="pending" class="blog-v2__not-found" role="status">
      <span>•••</span>
      <h1>جاري تحميل المقال</h1>
    </main>

    <main v-else-if="error" class="blog-v2__not-found" role="alert">
      <span>!</span>
      <h1>تعذر تحميل المقال</h1>
      <p>حدثت مشكلة أثناء الاتصال بالخدمة.</p>
      <button type="button" @click="refresh">إعادة المحاولة</button>
    </main>

    <template v-else-if="blog">
      <header :class="['blog-v2__hero', `blog-v2__hero--${tone}`]">
        <div class="blog-v2__shell blog-v2__hero-grid">
          <div class="blog-v2__hero-copy">
            <nav class="blog-v2__breadcrumbs" aria-label="مسار الصفحة">
              <NuxtLink to="/home-v2">الرئيسية</NuxtLink><span>/</span>
              <NuxtLink to="/blogs">المدونة</NuxtLink
              ><span>/</span>
              <b>{{ category }}</b>
            </nav>
            <span class="blog-v2__category">{{ category }}</span>
            <h1>
              {{ blog.title }}<template v-if="blog.subtitle"><br /><em>{{ blog.subtitle }}</em></template>
            </h1>
            <p v-if="blog.description">{{ blog.description }}</p>
            <div class="blog-v2__meta">
              <span v-if="readTime">{{ readTime }}</span>
              <time v-if="formattedDate" :datetime="blog.date">{{ formattedDate }}</time>
            </div>
          </div>
          <div class="blog-v2__mark" aria-hidden="true">
            <small>{{ String(blogIndex + 1).padStart(2, "0") }}</small>
            <strong v-if="marker">{{ marker }}</strong>
            <span v-if="site.brandName">{{ site.brandName }}</span>
          </div>
        </div>
      </header>

      <main class="blog-v2__main">
        <div class="blog-v2__shell blog-v2__layout">
          <article class="blog-v2__article">
            <blockquote
              v-if="blog.quote"
              class="blog-v2__lead blog-v2__quote"
            >
              <p>{{ blog.quote }}</p>
            </blockquote>

            <section
              class="blog-v2__content-section"
              aria-labelledby="blog-article-content-title"
            >
              <span aria-hidden="true">01</span>
              <h2 id="blog-article-content-title">{{ blog.title }}</h2>
              <div
                v-if="blog.description"
                class="blog-v2__content-copy blog-v2__html-content"
                v-html="blog.description"
              />
            </section>

            <div
              v-if="articleImage"
              class="blog-v2__article-image blog-v2__article-image--content"
            >
              <img
                :src="articleImage.src"
                :alt="articleImage.alt"
              />
            </div>

            <section v-if="summaryContent" class="blog-v2__conclusion">
              <span>الخلاصة</span>
              <h2 v-if="summaryContent.title">{{ summaryContent.title }}</h2>
              <p v-if="summaryContent.subtitle">{{ summaryContent.subtitle }}</p>
            </section>

          </article>

          <aside class="blog-v2__aside">
            <section
              v-if="contentPoints.length"
              class="blog-v2__toc"
              aria-labelledby="blog-content-points-title"
            >
              <h2 id="blog-content-points-title">في هذا المقال</h2>
              <ol>
                <li v-for="(item, index) in contentPoints" :key="`${index}-${item}`">
                  <b aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</b>
                  <span>{{ item }}</span>
                </li>
              </ol>
            </section>

            <section
              v-if="readRemember.length"
              class="blog-v2__takeaways"
              aria-labelledby="blog-read-remember-title"
            >
              <h2 id="blog-read-remember-title">
                افتكر {{ readRemember.length }} حاجات
              </h2>
              <ul>
                <li v-for="(item, index) in readRemember" :key="`${index}-${item}`">
                  {{ item }}
                </li>
              </ul>
            </section>

            <div class="blog-v2__topics" v-if="blog.hashtags?.length">
              <span>موضوعات المقال</span>
              <ul>
                <li v-for="item in blog.hashtags" :key="item.id || item.title">
                  {{ item.title }}
                </li>
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
                <NuxtLink :to="item.route">
                  <span v-if="item.subtitle">{{ item.subtitle }}</span>
                  <h3>{{ item.title }}</h3>
                  <p v-if="item.description">{{ item.description }}</p>
                  <b>اقرأ المقال ←</b>
                </NuxtLink>
              </article>
            </div>
            <NuxtLink class="blog-v2__all" to="/blogs"
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
      <NuxtLink to="/blogs">العودة إلى المدونة</NuxtLink>
    </main>

  </div>
</template>

<style scoped>
.blog-v2 {
  --ink: var(--app-text, #081b3a);
  --muted: var(--app-muted, #4f617c);
  --line: var(--app-line, #dfe7f3);
  --paper: var(--app-bg, #f4f7fb);
  --surface: var(--app-surface, #fff);
  --surface-raised: var(--app-surface-raised, #fff);
  --accent: var(--home-v2-blue);
  --action-text: #fff;
  --coral: #ef7a63;
  --home-v2-ink: var(--ink);
  --home-v2-muted: var(--muted);
  --home-v2-line: var(--line);
  --home-v2-heading: "bold", Tahoma, Arial, sans-serif;
  min-width: 0;
  overflow-x: clip;
  color: var(--ink);
  background: var(--paper);
  font-family: "regular", Tahoma, Arial, sans-serif;
}
:global(html[data-theme="dark"]) .blog-v2 {
  --accent: var(--app-accent);
  --action-text: #07101f;
}
.blog-v2 * {
  box-sizing: border-box;
}
.blog-v2__article-image {
  overflow: hidden;
  margin-bottom: 28px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-raised);
}
.blog-v2__article-image img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: cover;
}
.blog-v2__article-image--content {
  margin: 48px 0 0;
}
.blog-v2__html-content :deep(*) {
  max-width: 100%;
}
.blog-v2__html-content :deep(img) {
  height: auto;
  border-radius: 8px;
}
.blog-v2__html-content :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}
.blog-v2__not-found button {
  padding: 11px 18px;
  border: 1px solid var(--accent);
  border-radius: 7px;
  background: var(--accent);
  color: var(--action-text);
  cursor: pointer;
  font-family: inherit;
  font-weight: 900;
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
.blog-v2__breadcrumbs a {
  color: inherit;
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
  background: var(--surface);
  box-shadow: 0 30px 80px -68px var(--app-shadow, #06114780);
}
.blog-v2__lead {
  position: relative;
  margin: 0 0 58px;
  padding: 27px 34px;
  border-inline-start: 4px solid var(--coral);
  border-radius: 2px;
  background: color-mix(in srgb, var(--coral) 11%, var(--surface-raised));
  color: var(--ink);
  font-size: 20px;
  font-weight: 900;
  line-height: 1.95;
  box-shadow: 0 12px 32px -30px color-mix(in srgb, var(--coral) 65%, transparent);
}
.blog-v2__quote p {
  margin: 0;
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
  color: var(--accent);
  font: 900 14px "bold";
}
.blog-v2__content-section + .blog-v2__content-section > span {
  top: 60px;
}
.blog-v2__content-section h2 {
  margin: 0 0 18px;
  font: 900 clamp(26px, 3vw, 36px) / 1.45 "bold";
}
.blog-v2__content-copy,
.blog-v2__content-copy :deep(p) {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 17px;
  line-height: 2;
}
.blog-v2__content-section ul {
  margin: 22px 0;
  padding: 20px 25px;
  border-inline-start: 3px solid var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, var(--surface-raised));
  list-style: none;
}
.blog-v2__content-section li {
  position: relative;
  padding-inline-start: 20px;
  color: var(--muted);
  line-height: 1.9;
}
.blog-v2__content-section li:before {
  position: absolute;
  top: 0.8em;
  inset-inline-start: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  content: "";
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
.blog-v2__takeaways,
.blog-v2__topics {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}
.blog-v2__toc h2,
.blog-v2__takeaways h2 {
  margin: 0;
  font: 900 15px/1.5 "bold", Tahoma, sans-serif;
}
.blog-v2__toc h2 {
  color: var(--accent);
}
.blog-v2__toc ol {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}
.blog-v2__toc li {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 13px;
  line-height: 1.65;
}
.blog-v2__toc li b {
  padding-top: 2px;
  color: var(--coral);
  font-size: 10px;
}
.blog-v2__topics > span {
  display: block;
  margin-bottom: 15px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 900;
}
.blog-v2__takeaways {
  color: #fff;
  background: var(--home-v2-deep);
  border-color: transparent;
}
.blog-v2__takeaways h2 {
  color: var(--coral);
}
.blog-v2__takeaways ul {
  display: grid;
  gap: 12px;
  margin: 14px 0 0;
  padding: 0;
  color: #ffffffdc;
  list-style: none;
  line-height: 1.7;
}
.blog-v2__takeaways li {
  position: relative;
  padding-inline-start: 18px;
  font-size: 13px;
}
.blog-v2__takeaways li::before {
  position: absolute;
  top: 0.72em;
  inset-inline-start: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--coral);
  content: "";
}
.blog-v2__topics ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.blog-v2__topics li {
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, var(--surface-raised));
  font-size: 12px;
  font-weight: 800;
}
.blog-v2__related {
  margin-top: 80px;
  padding: 82px 0;
  background: color-mix(in srgb, var(--accent) 7%, var(--paper));
}
.blog-v2__related-heading > span {
  color: var(--accent);
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
  background: var(--surface);
  transition: 0.24s ease;
}
.blog-v2__related-grid article:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 42%, var(--line));
  box-shadow: 0 22px 50px -40px var(--app-shadow, #061147);
}
.blog-v2__related-grid a {
  display: block;
  padding: 28px;
}
.blog-v2__related-grid span {
  color: var(--accent);
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
  color: var(--accent);
  font-size: 13px;
}
.blog-v2__all {
  display: inline-flex;
  margin-top: 28px;
  color: var(--accent);
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
  color: var(--accent);
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
  color: var(--action-text);
  background: var(--accent);
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
  .blog-v2__topics {
    grid-column: 1 / -1;
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
