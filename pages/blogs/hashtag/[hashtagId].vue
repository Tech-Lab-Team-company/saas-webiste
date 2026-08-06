<script setup lang="ts">
import "~/assets/css/home-v2.css";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapBlogsPage,
  mapHomeSite,
} from "~/features/HomePageFeature/mappers/homePageMapper";

interface BlogHashtag {
  id: number;
  title: string;
}

definePageMeta({ layout: "home-v2" });

const route = useRoute();
const settingsStore = useSettingStore();
const site = computed(() => mapHomeSite(settingsStore.setting));
const hashtagId = computed(() => {
  const rawValue = Array.isArray(route.params.hashtagId)
    ? route.params.hashtagId[0]
    : route.params.hashtagId;
  const value = Number(rawValue);
  return Number.isInteger(value) && value > 0 ? value : null;
});

const requestUrl = useRequestURL();
const webDomain = ["localhost", "127.0.0.1", "mr-eslamsalama.com"].includes(
  requestUrl.hostname,
)
  ? "mr-eslamsalama.com"
  : requestUrl.hostname;
const api = new HomePageApi(webDomain);

const normalizeHashtags = (value: unknown): BlogHashtag[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const source = item as Record<string, unknown>;
    const id = Number(source.id);
    const title = typeof source.title === "string" ? source.title.trim() : "";
    return Number.isInteger(id) && id > 0 && title ? [{ id, title }] : [];
  });
};

const { data: hashtags } = await useAsyncData(
  `blog-hashtags:${webDomain}`,
  async () => normalizeHashtags(await api.fetchHashtags()),
  { default: () => [] },
);

const {
  data: blogs,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `hashtag-blogs:${webDomain}:${hashtagId.value ?? "invalid"}`,
  async () => {
    if (hashtagId.value === null) {
      throw createError({ statusCode: 404, statusMessage: "Hashtag not found" });
    }
    return mapBlogsPage(await api.fetchBlogs(hashtagId.value));
  },
  { default: () => [], watch: [hashtagId] },
);

const activeHashtag = computed(
  () => hashtags.value.find((item) => item.id === hashtagId.value) || null,
);
const pageTitle = computed(() => activeHashtag.value?.title || "نتائج الوسم");
const tones = ["navy", "blue", "coral"] as const;
const markers = ["فهم", "اقرأ", "فكرة", "وقت", "خطوة", "دقة"] as const;

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

const plainText = (value: string | null) =>
  (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

useSeoMeta({
  title: () => `${pageTitle.value} | مدونة ${site.value.brandName || "EduHub"}`,
  description: () => `مقالات مرتبطة بوسم ${pageTitle.value}.`,
});

useHead({ htmlAttrs: { lang: "ar", dir: "rtl" } });
</script>

<template>
  <div class="home-v2 hashtag-page" dir="rtl">
    <main class="hashtag-page__main">
      <header class="hashtag-page__hero">
        <div class="container hashtag-page__hero-content">
          <nav aria-label="مسار الصفحة">
            <NuxtLink to="/home-v2">الرئيسية</NuxtLink>
            <span>/</span>
            <NuxtLink to="/blogs">المدونة</NuxtLink>
            <span>/</span>
            <b>{{ pageTitle }}</b>
          </nav>
          <span class="hashtag-page__eyebrow">تصفّح حسب الموضوع</span>
          <h1>مقالات <em>{{ pageTitle }}</em></h1>
          <p>
            كل المقالات المرتبطة بهذا الموضوع في مكان واحد، بخطوات وأفكار
            عملية تقدر تبدأ بها مباشرة.
          </p>
          <div class="hashtag-page__count">
            <strong>{{ blogs.length }}</strong>
            <span>مقال متاح</span>
          </div>
        </div>
      </header>

      <section class="hashtag-page__content" aria-labelledby="hashtag-results-title">
        <div class="container hashtag-page__layout">
          <div class="hashtag-page__results">
            <header class="hashtag-page__heading">
              <div>
                <span>نتائج الوسم</span>
                <h2 id="hashtag-results-title">اختار المقال المناسب وابدأ القراءة.</h2>
              </div>
              <NuxtLink to="/blogs">عرض كل المقالات ←</NuxtLink>
            </header>

            <div v-if="pending" class="hashtag-page__state" role="status">
              جاري تحميل المقالات…
            </div>
            <div v-else-if="error" class="hashtag-page__state" role="alert">
              <strong>تعذر تحميل المقالات.</strong>
              <button type="button" @click="refresh">إعادة المحاولة</button>
            </div>
            <div v-else-if="!blogs.length" class="hashtag-page__state">
              <strong>لا توجد مقالات مرتبطة بهذا الوسم حاليًا.</strong>
              <NuxtLink to="/blogs">العودة إلى كل المقالات</NuxtLink>
            </div>

            <div v-else class="hashtag-page__grid">
              <article
                v-for="(blog, index) in blogs"
                :key="blog.id"
                :class="[
                  'hashtag-card',
                  `hashtag-card--${tones[index % tones.length]}`,
                ]"
              >
                <NuxtLink :to="blog.route">
                  <div class="hashtag-card__visual" aria-hidden="true">
                    <img
                      v-if="blog.image?.src"
                      :src="blog.image.src"
                      :alt="blog.image.alt || ''"
                    />
                    <span>{{ blog.subtitle || pageTitle }}</span>
                    <strong>{{ markers[index % markers.length] }}</strong>
                    <small>{{ String(index + 1).padStart(2, "0") }}</small>
                  </div>
                  <div class="hashtag-card__body">
                    <div class="hashtag-card__meta">
                      <span>{{ pageTitle }}</span>
                      <time v-if="blog.date" :datetime="blog.date">
                        {{ formatDate(blog.date) }}
                      </time>
                    </div>
                    <h2>{{ blog.title }}</h2>
                    <p>{{ plainText(blog.description || blog.subtitle) }}</p>
                    <b>اقرأ المقال <span aria-hidden="true">←</span></b>
                  </div>
                </NuxtLink>
              </article>
            </div>
          </div>

          <aside class="hashtag-page__aside" aria-label="وسوم المدونة">
            <span>استكشف موضوعًا آخر</span>
            <h2>وسوم المدونة</h2>
            <nav>
              <NuxtLink
                v-for="item in hashtags"
                :key="item.id"
                :to="`/blogs/hashtag/${item.id}`"
                :class="{ active: item.id === hashtagId }"
              >
                <span>{{ item.title }}</span>
                <b>←</b>
              </NuxtLink>
            </nav>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.hashtag-page { min-width: 0; background: var(--home-v2-paper); color: var(--home-v2-ink); }
.hashtag-page__main { min-height: 100dvh; padding-top: 86px; }
.hashtag-page__hero {
  position: relative;
  overflow: hidden;
  padding: 68px 0 62px;
  border-bottom: 1px solid var(--home-v2-line);
  background: linear-gradient(135deg, var(--home-v2-cream), var(--home-v2-paper));
}
.hashtag-page__hero::after {
  position: absolute;
  width: 420px;
  height: 420px;
  left: -140px;
  bottom: -290px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 20%, transparent);
  border-radius: 50%;
  content: "";
}
.hashtag-page__hero-content { position: relative; z-index: 1; }
.hashtag-page__hero nav { display: flex; gap: 8px; color: var(--home-v2-muted); font-size: 12px; }
.hashtag-page__hero nav b { color: var(--home-v2-ink); }
.hashtag-page__eyebrow { display: block; margin-top: 27px; color: var(--home-v2-blue); font-size: 12px; font-weight: 900; }
.hashtag-page__hero h1 { max-width: 820px; margin: 9px 0 12px; color: var(--home-v2-ink); font: 900 clamp(40px, 5vw, 67px)/1.25 var(--home-v2-heading); }
.hashtag-page__hero h1 em { color: var(--home-v2-blue); font-style: normal; }
.hashtag-page__hero p { max-width: 690px; margin: 0; color: var(--home-v2-muted); font-size: 16px; line-height: 1.9; }
.hashtag-page__count { display: flex; align-items: baseline; gap: 9px; margin-top: 24px; }
.hashtag-page__count strong { color: var(--home-v2-blue); font-size: 28px; }
.hashtag-page__count span { color: var(--home-v2-muted); font-size: 12px; }
.hashtag-page__content { padding: 70px 0 90px; }
.hashtag-page__layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; align-items: start; gap: 38px; }
.hashtag-page__heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.hashtag-page__heading > div > span,
.hashtag-page__aside > span { color: var(--home-v2-blue); font-size: 12px; font-weight: 900; }
.hashtag-page__heading h2 { margin: 7px 0 0; color: var(--home-v2-ink); font: 900 clamp(25px, 3vw, 36px)/1.4 var(--home-v2-heading); }
.hashtag-page__heading > a { flex: 0 0 auto; color: var(--home-v2-blue); font-weight: 900; }
.hashtag-page__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.hashtag-card { overflow: hidden; border: 1px solid var(--home-v2-line); border-radius: 14px; background: var(--home-v2-surface); transition: .22s ease; }
.hashtag-card:hover { transform: translateY(-4px); box-shadow: 0 24px 55px -45px var(--home-v2-shadow); }
.hashtag-card > a { display: grid; height: 100%; grid-template-rows: 215px 1fr; }
.hashtag-card__visual { position: relative; display: grid; place-content: center; overflow: hidden; background: var(--home-v2-deep); color: #fff; text-align: center; }
.hashtag-card--blue .hashtag-card__visual { background: var(--home-v2-blue); }
.hashtag-card--coral .hashtag-card__visual { background: var(--home-v2-coral); }
.hashtag-card__visual img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .24; }
.hashtag-card__visual > *:not(img) { position: relative; z-index: 1; }
.hashtag-card__visual > span { position: absolute; top: 18px; right: 18px; left: 18px; overflow: hidden; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; opacity: .78; }
.hashtag-card__visual strong { font: 900 52px/1 var(--home-v2-heading); }
.hashtag-card__visual small { margin-top: 10px; font-weight: 900; opacity: .68; }
.hashtag-card__body { display: flex; flex-direction: column; padding: 23px; }
.hashtag-card__meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; color: var(--home-v2-muted); font-size: 10px; }
.hashtag-card__meta span { color: var(--home-v2-blue); font-weight: 900; }
.hashtag-card h2 { margin: 12px 0 8px; color: var(--home-v2-ink); font: 900 21px/1.5 var(--home-v2-heading); }
.hashtag-card p { display: -webkit-box; overflow: hidden; margin: 0 0 18px; color: var(--home-v2-muted); line-height: 1.8; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.hashtag-card__body > b { margin-top: auto; color: var(--home-v2-blue); font-size: 12px; }
.hashtag-page__aside { position: sticky; top: 96px; padding: 24px; border: 1px solid var(--home-v2-line); border-radius: 14px; background: var(--home-v2-surface); }
.hashtag-page__aside h2 { margin: 6px 0 18px; color: var(--home-v2-ink); font: 900 23px var(--home-v2-heading); }
.hashtag-page__aside nav { display: grid; gap: 7px; }
.hashtag-page__aside nav a { display: flex; justify-content: space-between; gap: 10px; padding: 10px 11px; border: 1px solid transparent; border-radius: 7px; color: var(--home-v2-muted); font-size: 12px; font-weight: 800; }
.hashtag-page__aside nav a:hover,
.hashtag-page__aside nav a.active { border-color: color-mix(in srgb, var(--home-v2-blue) 30%, var(--home-v2-line)); background: var(--home-v2-blue-light); color: var(--home-v2-blue); }
.hashtag-page__state { display: grid; justify-items: center; gap: 14px; padding: 45px 25px; border: 1px solid var(--home-v2-line); border-radius: 12px; background: var(--home-v2-surface); color: var(--home-v2-muted); text-align: center; }
.hashtag-page__state button,
.hashtag-page__state a { padding: 9px 15px; border: 1px solid var(--home-v2-blue); border-radius: 7px; background: transparent; color: var(--home-v2-blue); cursor: pointer; font-family: inherit; font-weight: 900; }
@media (max-width: 920px) {
  .hashtag-page__layout { grid-template-columns: 1fr; }
  .hashtag-page__aside { position: static; grid-row: 1; }
  .hashtag-page__aside nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 650px) {
  .hashtag-page__hero { padding: 48px 0; }
  .hashtag-page__content { padding: 50px 0 65px; }
  .hashtag-page__heading { display: block; }
  .hashtag-page__heading > a { display: inline-flex; margin-top: 12px; }
  .hashtag-page__grid { grid-template-columns: 1fr; }
  .hashtag-page__aside nav { grid-template-columns: 1fr; }
}
</style>
