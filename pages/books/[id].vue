<script setup lang="ts">
import { storeToRefs } from "pinia";
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapBookDetails,
  mapHomeSite,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeBookDetailsViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

definePageMeta({
  layout: "home-v2",
});

const route = useRoute();
const requestUrl = useRequestURL();
const webDomain = ["localhost", "127.0.0.1", "mr-eslamsalama.com"].includes(
  requestUrl.hostname,
)
  ? "mr-eslamsalama.com"
  : requestUrl.hostname;

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
const bookId = computed(() => {
  const rawValue = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  const value = Number(rawValue);
  return Number.isInteger(value) && value > 0 ? value : null;
});

const api = new HomePageApi(webDomain);
const { data: book, pending, error, refresh } = await useAsyncData<
  HomeBookDetailsViewModel | null
>(
  `book-details:${webDomain}:${bookId.value ?? "invalid"}`,
  async () => {
    if (bookId.value === null) {
      throw createError({ statusCode: 404, statusMessage: "Book not found" });
    }

    return mapBookDetails(await api.fetchBookDetails(bookId.value));
  },
  {
    default: () => null,
    dedupe: "defer",
  },
);

watch(bookId, () => refresh());

const coverImage = computed(() => book.value?.images[0] || book.value?.image || null);
const galleryImages = computed(() => book.value?.images ?? []);
const displayPrice = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return "";
  if (currentBook.isFree || Number(currentBook.price) === 0) return "مجاني";

  const value = currentBook.totalAfterDiscount > 0
    ? currentBook.totalAfterDiscount
    : currentBook.price;
  return `${value} ${currentBook.currency}`.trim();
});

const primaryAction = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return null;

  if (currentBook.hasFreePreview && currentBook.freeBookUrl) {
    return { url: currentBook.freeBookUrl, label: "قراءة النسخة المجانية" };
  }

  if (currentBook.isFree && currentBook.bookUrl) {
    return { url: currentBook.bookUrl, label: "تحميل الكتاب" };
  }

  if (currentBook.invoiceLink) {
    return { url: currentBook.invoiceLink, label: "شراء الكتاب" };
  }

  return null;
});

const mediaLinks = computed(() => [
  ...(book.value?.videoLinks ?? []),
  ...(book.value?.externalVideoLinks ?? []),
]);

useSeoMeta({
  title: () => book.value
    ? `${book.value.title} | ${site.value.brandName || "EduHub"}`
    : `تفاصيل الكتاب | ${site.value.brandName || "EduHub"}`,
  description: () => book.value?.description || "تفاصيل الكتاب ومحتواه وسعره.",
  ogTitle: () => book.value?.title,
  ogDescription: () => book.value?.description || undefined,
  ogImage: () => coverImage.value || undefined,
});

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});
</script>

<template>
  <div
    class="home-v2 book-details-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <main class="book-details-page__main">
      <div v-if="pending" class="container book-details-page__state" role="status">
        جاري تحميل تفاصيل الكتاب...
      </div>
      <div v-else-if="error || !book" class="container book-details-page__state book-details-page__state--error" role="alert">
        <strong>تعذر العثور على الكتاب.</strong>
        <p>قد يكون الكتاب غير متاح أو تم تغيير رابطه.</p>
        <NuxtLink to="/books">العودة إلى كل الكتب</NuxtLink>
      </div>

      <template v-else>
        <section class="book-details-page__hero">
          <div class="container">
            <nav class="book-details-page__breadcrumb" aria-label="مسار التنقل">
              <NuxtLink to="/books">الكتب</NuxtLink>
              <span aria-hidden="true">/</span>
              <span>{{ book.title }}</span>
            </nav>

            <div class="book-details-page__hero-grid">
              <div class="book-details-page__copy">
                <span>{{ book.subtitle || "كتاب من مكتبة المنصة" }}</span>
                <h1>{{ book.title }}</h1>
                <p v-if="book.description">{{ book.description }}</p>

                <div class="book-details-page__badges">
                  <span v-if="book.numberOfPages">{{ book.numberOfPages }} صفحة</span>
                  <span>{{ book.isFree ? "كتاب مجاني" : "كتاب مدفوع" }}</span>
                  <span v-if="book.isFlipbook || book.isFreeFlipbook">يدعم التصفح التفاعلي</span>
                </div>

                <div class="book-details-page__price">{{ displayPrice }}</div>

                <div class="book-details-page__actions">
                  <a
                    v-if="primaryAction"
                    :href="primaryAction.url"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ primaryAction.label }}
                    <span aria-hidden="true">↗</span>
                  </a>
                  <span v-else class="book-details-page__unavailable">
                    غير متاح للشراء أو التحميل حاليًا
                  </span>
                  <NuxtLink to="/books">كل الكتب</NuxtLink>
                </div>
              </div>

              <figure class="book-details-page__cover">
                <img
                  v-if="coverImage"
                  :src="coverImage"
                  :alt="book.title"
                  loading="eager"
                />
                <div v-else aria-hidden="true">
                  <span>BOOK</span>
                  <strong>{{ book.title }}</strong>
                  <small>{{ book.numberOfPages ? `${book.numberOfPages} صفحة` : "مكتبة المنصة" }}</small>
                </div>
              </figure>
            </div>
          </div>
        </section>

        <section class="section book-details-page__information">
          <div class="container">
            <header class="book-details-page__section-head">
              <span class="section-tag">بيانات الكتاب</span>
              <h2>كل ما تحتاج معرفته</h2>
            </header>

            <div class="book-details-page__metrics">
              <article>
                <span>عدد الصفحات</span>
                <strong>{{ book.numberOfPages || "—" }}</strong>
              </article>
              <article>
                <span>مقاطع الفيديو</span>
                <strong>{{ book.videoLinksCount }}</strong>
              </article>
              <article>
                <span>المحتوى الإضافي</span>
                <strong>{{ book.multimediaCount }}</strong>
              </article>
              <article>
                <span>التقييمات</span>
                <strong>{{ book.ratesCount }}</strong>
              </article>
            </div>

            <div
              v-if="!book.isFree && (book.fees > 0 || book.vat > 0)"
              class="book-details-page__pricing"
            >
              <div><span>السعر الأساسي</span><b>{{ book.price }} {{ book.currency }}</b></div>
              <div v-if="book.fees > 0"><span>الرسوم</span><b>{{ book.fees }}</b></div>
              <div v-if="book.vat > 0"><span>ضريبة القيمة المضافة</span><b>{{ book.vat }}%</b></div>
              <div><span>الإجمالي</span><b>{{ displayPrice }}</b></div>
            </div>
          </div>
        </section>

        <section v-if="galleryImages.length > 0" class="section book-details-page__gallery">
          <div class="container">
            <header class="book-details-page__section-head">
              <span class="section-tag">معاينة الكتاب</span>
              <h2>صور من المحتوى</h2>
            </header>
            <div class="book-details-page__gallery-grid">
              <figure v-for="(image, index) in galleryImages" :key="image">
                <img :src="image" :alt="`${book.title} - صورة ${index + 1}`" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section v-if="mediaLinks.length > 0" class="section book-details-page__media">
          <div class="container">
            <header class="book-details-page__section-head">
              <span class="section-tag">محتوى إضافي</span>
              <h2>روابط الفيديو</h2>
            </header>
            <div class="book-details-page__media-links">
              <a
                v-for="(link, index) in mediaLinks"
                :key="link"
                :href="link"
                target="_blank"
                rel="noreferrer"
              >
                مشاهدة الفيديو {{ index + 1 }}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </template>
    </main>

    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.book-details-page {
  min-height: 100vh;
  background: var(--home-v2-paper);
}

.book-details-page__main {
  min-height: 70vh;
  padding-top: 86px;
}

.book-details-page__state {
  display: grid;
  min-height: 620px;
  place-items: center;
  align-content: center;
  gap: 14px;
  color: var(--home-v2-muted);
  text-align: center;
}

.book-details-page__state strong {
  color: var(--home-v2-ink);
  font: 900 30px var(--home-v2-heading);
}

.book-details-page__state p {
  margin: 0;
}

.book-details-page__state a {
  min-height: 46px;
  margin-top: 8px;
  padding: 11px 22px;
  border-radius: 8px;
  background: var(--home-v2-blue);
  color: #fff;
  font-weight: 800;
}

.book-details-page__hero {
  padding: 54px 0 80px;
  background:
    radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--home-v2-blue) 17%, transparent), transparent 30%),
    linear-gradient(145deg, #f7f9fd, #eaf1ff);
}

.book-details-page__breadcrumb {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  margin-bottom: 34px;
  color: var(--home-v2-muted);
  font-size: 13px;
}

.book-details-page__breadcrumb > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-details-page__breadcrumb a {
  color: var(--home-v2-blue);
  font-weight: 800;
}

.book-details-page__hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  align-items: center;
  gap: clamp(50px, 8vw, 110px);
}

.book-details-page__copy > span:first-child {
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
}

.book-details-page h1 {
  max-width: 780px;
  margin: 16px 0 22px;
  color: var(--home-v2-ink);
  font: 900 clamp(39px, 5vw, 65px) / 1.3 var(--home-v2-heading);
}

.book-details-page__copy > p {
  max-width: 680px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 17px;
  line-height: 1.95;
}

.book-details-page__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 25px;
}

.book-details-page__badges span {
  padding: 7px 11px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 18%, transparent);
  border-radius: 999px;
  background: #fff;
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 800;
}

.book-details-page__price {
  margin-top: 25px;
  color: var(--home-v2-blue);
  font: 900 30px var(--home-v2-heading);
}

.book-details-page__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.book-details-page__actions > a,
.book-details-page__unavailable {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 22px;
  border-radius: 8px;
  font-weight: 800;
}

.book-details-page__actions > a:first-child {
  background: var(--home-v2-blue);
  color: #fff;
}

.book-details-page__actions > a:last-child {
  border: 1px solid var(--home-v2-blue);
  color: var(--home-v2-blue);
}

.book-details-page__unavailable {
  background: #e4e8ef;
  color: var(--home-v2-muted);
}

.book-details-page__cover {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  margin: 0;
  border: 10px solid #fff;
  border-radius: 18px 18px 72px;
  background: var(--home-v2-deep);
  box-shadow: 0 38px 70px -45px #061147a6;
}

.book-details-page__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details-page__cover > div {
  display: grid;
  height: 100%;
  align-content: end;
  gap: 14px;
  padding: 34px;
  background: linear-gradient(135deg, transparent 48%, #ffffff12 49%);
  color: #fff;
}

.book-details-page__cover > div span {
  color: #9dcbff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.book-details-page__cover > div strong {
  font: 900 clamp(26px, 3vw, 38px) / 1.4 var(--home-v2-heading);
}

.book-details-page__cover > div small {
  color: #ffffffb8;
}

.book-details-page__section-head {
  margin-bottom: 32px;
}

.book-details-page__section-head h2 {
  margin: 9px 0 0;
  font: 900 clamp(32px, 4vw, 48px) / 1.3 var(--home-v2-heading);
}

.book-details-page__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.book-details-page__metrics article {
  display: grid;
  min-height: 150px;
  align-content: center;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: #fff;
}

.book-details-page__metrics span {
  color: var(--home-v2-muted);
  font-size: 13px;
}

.book-details-page__metrics strong {
  color: var(--home-v2-blue);
  font: 900 32px var(--home-v2-heading);
}

.book-details-page__pricing {
  display: grid;
  max-width: 620px;
  margin-top: 28px;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: #fff;
}

.book-details-page__pricing div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 20px;
}

.book-details-page__pricing div + div {
  border-top: 1px solid var(--home-v2-line);
}

.book-details-page__pricing span {
  color: var(--home-v2-muted);
}

.book-details-page__gallery {
  background: #eef4ff;
}

.book-details-page__gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.book-details-page__gallery figure {
  overflow: hidden;
  aspect-ratio: 4 / 3;
  margin: 0;
  border: 8px solid #fff;
  border-radius: 12px;
  box-shadow: 0 20px 48px -38px #06114799;
}

.book-details-page__gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details-page__media-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.book-details-page__media-links a {
  display: flex;
  min-height: 62px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 20px;
  border: 1px solid var(--home-v2-line);
  border-radius: 10px;
  background: #fff;
  color: var(--home-v2-blue);
  font-weight: 800;
}

@media (max-width: 850px) {
  .book-details-page__hero-grid {
    grid-template-columns: 1fr;
  }

  .book-details-page__cover {
    width: min(430px, 100%);
  }

  .book-details-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .book-details-page__gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .book-details-page__metrics,
  .book-details-page__gallery-grid,
  .book-details-page__media-links {
    grid-template-columns: 1fr;
  }
}
</style>
