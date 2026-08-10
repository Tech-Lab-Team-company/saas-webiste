<script setup lang="ts">
import { storeToRefs } from "pinia";
import BuyBookDialog from "~/components/Books/BuyBookDialog.vue";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapBookDetailsResource,
  mapHomeSite,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import {
  BookTypeEnum,
  type HomeBookDetailsResourceViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import { buildSeoTitle } from "~/utils/seoText";

interface BookMediaItem {
  key: string;
  url: string;
  label: string;
  sessionId: number | null;
  type: number | null;
}

definePageMeta({
  layout: "home-v2",
});

const route = useRoute();
const requestUrl = useRequestURL();
const webDomain = getWebDomain();

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
const bookId = computed(() => {
  const rawValue = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  const value = Number(rawValue);
  return Number.isInteger(value) && value > 0 ? value : null;
});

const api = new HomePageApi(webDomain);
const { data: bookDetails, pending, error, refresh } = await useAsyncData<
  HomeBookDetailsResourceViewModel | null
>(
  `book-details:${webDomain}:${bookId.value ?? "invalid"}`,
  async () => {
    if (bookId.value === null) {
      throw createError({ statusCode: 404, statusMessage: "Book not found" });
    }

    return mapBookDetailsResource(await api.fetchBookDetails(bookId.value));
  },
  {
    default: () => null,
    dedupe: "defer",
  },
);

watch(bookId, () => refresh());

const book = computed(() => bookDetails.value?.book ?? null);
const websiteSectionBook = computed(
  () => bookDetails.value?.websiteSectionBook ?? null,
);
const bookSteps = computed(() =>
  websiteSectionBook.value?.steps.length
    ? websiteSectionBook.value.steps
    : book.value?.steps ?? [],
);
const coverImage = computed(() =>
  book.value?.image
  || book.value?.images[0]
  || websiteSectionBook.value?.image
  || null,
);
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
    return { url: currentBook.freeBookUrl, label: "قراءة النسخة المجانية", kind: "reader" as const };
  }

  if (
    currentBook.bookUrl &&
    (currentBook.isFree || currentBook.allowStatus === 1 || currentBook.orderStatus === 1)
  ) {
    return { url: currentBook.bookUrl, label: "قراءة الكتاب", kind: "reader" as const };
  }

  if (currentBook.invoiceLink) {
    return { url: currentBook.invoiceLink, label: "شراء الكتاب", kind: "external" as const };
  }

  return null;
});

const mediaItems = computed<BookMediaItem[]>(() => {
  const currentBook = book.value;
  if (!currentBook) return [];

  const items: BookMediaItem[] = [];
  const seenUrls = new Set<string>();
  const addItem = (item: BookMediaItem) => {
    if (seenUrls.has(item.url)) return;
    seenUrls.add(item.url);
    items.push(item);
  };

  currentBook.attachments.forEach((attachment, index) => {
    addItem({
      key: `attachment-${attachment.id}`,
      url: attachment.file,
      label: `مرفق الكتاب ${index + 1}`,
      sessionId: attachment.id,
      type: attachment.type,
    });
  });
  currentBook.videoLinks.forEach((url, index) => {
    addItem({
      key: `video-${index}-${url}`,
      url,
      label: `فيديو الكتاب ${index + 1}`,
      sessionId: null,
      type: 4,
    });
  });
  currentBook.externalVideoLinks.forEach((url, index) => {
    addItem({
      key: `external-${index}-${url}`,
      url,
      label: `فيديو خارجي ${index + 1}`,
      sessionId: null,
      type: 4,
    });
  });

  return items;
});

const isReaderOpen = ref(false);
const activeMedia = ref<BookMediaItem | null>(null);
const openReader = () => {
  if (primaryAction.value?.kind === "reader") isReaderOpen.value = true;
};
const openMedia = (item: BookMediaItem) => {
  activeMedia.value = item;
};

const formatBookDate = (date: string | null): string => {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const bookFeatures = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return [];

  return [
    ...(currentBook.numberOfPages
      ? [`${currentBook.numberOfPages} صفحة`]
      : []),
    ...(currentBook.bookTypes.length
      ? [`متاح بصيغة ${currentBook.bookTypes.map((type) => type.label).join(" و")}`]
      : []),
    currentBook.isFree ? "متاح مجانًا" : "متاح للشراء",
    ...(currentBook.attachments.length
      ? [`${currentBook.attachments.length} مرفق`]
      : []),
  ];
});

const bookFacts = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return [];

  return [
    ...(currentBook.numberOfPages
      ? [{ label: "عدد الصفحات", value: `${currentBook.numberOfPages} صفحة` }]
      : []),
    ...(currentBook.bookTypes.length
      ? [{ label: "نوع النسخة", value: currentBook.bookTypes.map((type) => type.label).join(" · ") }]
      : []),
    ...(displayPrice.value ? [{ label: "السعر", value: displayPrice.value }] : []),
    ...(currentBook.startDate ? [{ label: "متاح من", value: formatBookDate(currentBook.startDate) }] : []),
    ...(currentBook.endDate ? [{ label: "متاح حتى", value: formatBookDate(currentBook.endDate) }] : []),
    { label: "المرفقات", value: String(currentBook.attachments.length) },
    { label: "مقاطع الفيديو", value: String(currentBook.videoLinksCount) },
    { label: "المحتوى الإضافي", value: String(currentBook.multimediaCount) },
  ];
});

const purchaseOptions = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return [];

  if (currentBook.bookTypes.length) {
    return currentBook.bookTypes.map((type) => ({
      id: type.id,
      label: type.label,
      price: currentBook.isFree ? 0 : type.price,
      isDigital: /إلكتروني|رقمي/u.test(type.label),
      requiresDelivery: currentBook.bookType === BookTypeEnum.PAPER
        || currentBook.bookType === BookTypeEnum.BOTH,
    }));
  }

  return [{
    id: currentBook.bookType ?? currentBook.id,
    label: currentBook.bookType === 1
      ? "كتاب إلكتروني"
      : currentBook.bookType === 2
        ? "نسخة مطبوعة"
        : currentBook.bookType === 3
          ? "إلكتروني ومطبوع"
          : "نسخة الكتاب",
    price: currentBook.isFree ? 0 : Number(currentBook.price),
    isDigital: currentBook.bookType === 1,
    requiresDelivery: currentBook.bookType === BookTypeEnum.PAPER
      || currentBook.bookType === BookTypeEnum.BOTH,
  }];
});

const bookOrigin = computed(() =>
  webDomain ? `https://${webDomain}` : requestUrl.origin,
);
const bookUrl = computed(() => new URL(route.path, bookOrigin.value).toString());
const bookSchema = computed(() => {
  const currentBook = book.value;
  if (!currentBook) return null;

  const numericPrices = purchaseOptions.value
    .map((option) => Number(option.price))
    .filter((price) => Number.isFinite(price) && price >= 0);
  const price = currentBook.isFree
    ? 0
    : numericPrices.length
      ? Math.min(...numericPrices)
      : Number(currentBook.totalAfterDiscount || currentBook.price);
  const normalizedCurrency = currentBook.currency.trim().toUpperCase();

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${bookUrl.value}#book`,
    url: bookUrl.value,
    name: currentBook.title,
    description: currentBook.description
      || websiteSectionBook.value?.description
      || undefined,
    image: coverImage.value ? [coverImage.value] : undefined,
    inLanguage: "ar",
    numberOfPages: currentBook.numberOfPages || undefined,
    isAccessibleForFree: currentBook.isFree,
    publisher: {
      "@type": "Organization",
      "@id": `${bookOrigin.value}/#organization`,
      name: site.value.brandName || "المنصة التعليمية",
    },
    ...(Number.isFinite(price) && price >= 0
      ? {
          offers: {
            "@type": "Offer",
            url: bookUrl.value,
            price,
            priceCurrency: /^[A-Z]{3}$/u.test(normalizedCurrency)
              ? normalizedCurrency
              : "EGP",
            availability: "https://schema.org/InStock",
            ...(currentBook.endDate
              ? { priceValidUntil: currentBook.endDate }
              : {}),
          },
        }
      : {}),
  };
});

useSeoMeta({
  title: () => book.value
    ? buildSeoTitle(book.value.title, site.value.brandName)
    : buildSeoTitle("تفاصيل الكتاب", site.value.brandName),
  description: () => book.value?.description
    || websiteSectionBook.value?.description
    || "تفاصيل الكتاب ومحتواه وسعره.",
  ogTitle: () => book.value?.title,
  ogDescription: () => book.value?.description
    || websiteSectionBook.value?.description
    || undefined,
  ogImage: () => coverImage.value || undefined,
  ogType: "book",
  twitterCard: "summary_large_image",
  twitterImage: () => coverImage.value || undefined,
});

useHead(() => ({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
  script: bookSchema.value
    ? [{
        key: "book-schema",
        type: "application/ld+json",
        innerHTML: JSON.stringify(bookSchema.value).replace(/</gu, "\\u003c"),
      }]
    : [],
}));
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
          <div class="container book-details-page__hero-grid">
            <figure class="book-details-page__cover">
              <img
                v-if="coverImage"
                :src="coverImage"
                :alt="book.title"
                loading="eager"
              />
              <span>كتاب رقم {{ book.bookId }}</span>
              <strong>{{ book.title }}</strong>
              <small v-if="book.numberOfPages">
                {{ book.numberOfPages }} صفحة
              </small>
            </figure>

            <div class="book-details-page__copy">
              <nav class="book-details-page__breadcrumb" aria-label="مسار التنقل">
                <NuxtLink to="/">الرئيسية</NuxtLink>
                <span aria-hidden="true">/</span>
                <NuxtLink to="/books">المكتبة</NuxtLink>
                <span aria-hidden="true">/</span>
                <b>{{ book.title }}</b>
              </nav>

              <span class="book-details-page__badge">
                {{ websiteSectionBook?.title || (book.isFree ? "كتاب مجاني" : "كتاب مستقل") }}
              </span>
              <h1>{{ book.title }}</h1>
              <h2 v-if="book.subtitle || websiteSectionBook?.subtitle">
                {{ book.subtitle || websiteSectionBook?.subtitle }}
              </h2>
              <p v-if="book.description || websiteSectionBook?.description">
                {{ book.description || websiteSectionBook?.description }}
              </p>

              <div
                v-if="site.brandName || book.numberOfPages"
                class="book-details-page__author"
              >
                <span v-if="site.brandName" aria-hidden="true">
                  {{ site.brandName.slice(0, 1) }}
                </span>
                <div v-if="site.brandName">
                  <small>إعداد ومراجعة</small>
                  <b>{{ site.brandName }}</b>
                </div>
                <i v-if="site.brandName && book.numberOfPages" aria-hidden="true"></i>
                <div v-if="book.numberOfPages">
                  <small>عدد الصفحات</small>
                  <b>{{ book.numberOfPages }} صفحة</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="book-details-page__information">
          <div class="container book-details-page__information-grid">
            <div class="book-details-page__content">
              <article v-if="book.description || bookFeatures.length">
                <span class="book-details-page__section-tag">عن الكتاب</span>
                <h2>{{ book.title }}</h2>
                <p v-if="book.description">{{ book.description }}</p>
                <div class="book-details-page__feature-grid">
                  <div v-for="(feature, index) in bookFeatures" :key="feature">
                    <span>{{ String(index + 1).padStart(2, "0") }}</span>
                    <p>{{ feature }}</p>
                  </div>
                </div>
              </article>

              <HomeSectionEmptyState
                v-else
                label="تفاصيل الكتاب"
                title="أضف تفاصيل الكتاب"
                description="أضف وصف الكتاب ومعلوماته من لوحة التحكم لتظهر هنا."
              />

              <article v-if="bookSteps.length" class="book-details-page__steps-section">
                <div class="book-details-page__steps-heading">
                  <div>
                    <span class="book-details-page__section-tag">
                      {{ websiteSectionBook?.title || "خطوات الكتاب" }}
                    </span>
                    <h2>
                      {{ websiteSectionBook?.subtitle || "استفد من الكتاب خطوة بخطوة" }}
                    </h2>
                    <p v-if="websiteSectionBook?.description">
                      {{ websiteSectionBook.description }}
                    </p>
                  </div>
                  <img
                    v-if="websiteSectionBook?.image"
                    :src="websiteSectionBook.image"
                    :alt="websiteSectionBook.title"
                    loading="lazy"
                  />
                </div>

                <div class="book-details-page__steps-grid">
                  <div
                    v-for="(step, index) in bookSteps"
                    :key="step.id"
                    class="book-details-page__step-card"
                  >
                    <figure>
                      <img
                        v-if="step.image"
                        :src="step.image"
                        :alt="step.title"
                        loading="lazy"
                      />
                      <span v-else>{{ String(index + 1).padStart(2, "0") }}</span>
                    </figure>
                    <div>
                      <small v-if="step.subtitle">{{ step.subtitle }}</small>
                      <h3>{{ step.title }}</h3>
                      <p v-if="step.description">{{ step.description }}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article>
                <span class="book-details-page__section-tag">بيانات الكتاب</span>
                <h2>كل التفاصيل في مكان واحد</h2>
                <div class="book-details-page__facts">
                  <div v-for="fact in bookFacts" :key="fact.label">
                    <span>{{ fact.label }}</span>
                    <b>{{ fact.value }}</b>
                  </div>
                </div>
              </article>

              <article v-if="book.hasFreePreview || book.isFlipbook || book.isFreeFlipbook" class="book-details-page__digital-policy">
                <span aria-hidden="true">▣</span>
                <div>
                  <h2>تصفّح نسخة الكتاب المتاحة</h2>
                  <p>يمكنك فتح نسخة القراءة أو المعاينة المتاحة من خلال المنصة.</p>
                  <button
                    v-if="primaryAction?.kind === 'reader'"
                    type="button"
                    @click="openReader"
                  >
                    {{ primaryAction.label }} ←
                  </button>
                  <a
                    v-else-if="primaryAction"
                    :href="primaryAction.url"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ primaryAction.label }} ←
                  </a>
                </div>
              </article>
            </div>

            <aside class="book-details-page__buy-card">
              <h2>اختار نسختك</h2>
              <div
                v-for="option in purchaseOptions"
                :key="option.id"
                :class="['book-details-page__format', { 'book-details-page__format--print': !option.isDigital }]"
              >
                <div>
                  <span aria-hidden="true">{{ option.isDigital ? "▣" : "▤" }}</span>
                  <p>
                    <b>{{ option.label }}</b>
                    <small>{{ option.isDigital ? "قراءة إلكترونية" : "نسخة مستقلة من الكتاب" }}</small>
                  </p>
                </div>
                <strong>
                  {{ option.price === 0 ? "مجاني" : option.price }}
                  <small v-if="option.price !== 0">{{ book.currency }}</small>
                </strong>
                <ul>
                  <li>شراء مستقل عن الكورسات</li>
                  <li v-if="book.numberOfPages">{{ book.numberOfPages }} صفحة</li>
                  <li>الوصول حسب نوع النسخة المتاحة</li>
                </ul>
                <button
                  v-if="option.price === 0 && primaryAction?.kind === 'reader'"
                  type="button"
                  @click="openReader"
                >
                  {{ primaryAction.label }} ←
                </button>
                <a
                  v-else-if="option.price === 0 && primaryAction"
                  :href="primaryAction.url"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ primaryAction.label }} ←
                </a>
                <BuyBookDialog
                  v-else-if="option.price > 0"
                  :book-id="book.bookId"
                  :title="book.title"
                  :price="option.price"
                  :currency="book.currency"
                  :option-label="option.label"
                  :requires-delivery="option.requiresDelivery"
                  @purchased="refresh"
                />
                <span v-else class="book-details-page__format-unavailable">غير متاح حاليًا</span>
              </div>
              <NuxtLink to="/books">العودة إلى كل الكتب</NuxtLink>
            </aside>
          </div>
        </section>

        <section v-if="galleryImages.length > 0" class="section book-details-page__gallery">
          <div class="container">
            <header class="book-details-page__section-head">
              <span class="book-details-page__section-tag">معاينة الكتاب</span>
              <h2>صور من المحتوى</h2>
            </header>
            <div class="book-details-page__gallery-grid">
              <figure v-for="(image, index) in galleryImages" :key="image">
                <img :src="image" :alt="`${book.title} - صورة ${index + 1}`" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section v-if="mediaItems.length > 0" class="section book-details-page__media">
          <div class="container">
            <header class="book-details-page__section-head">
              <span class="book-details-page__section-tag">محتوى إضافي</span>
              <h2>المرفقات وروابط الفيديو</h2>
            </header>
            <div class="book-details-page__media-links">
              <button
                v-for="(item, index) in mediaItems"
                :key="item.key"
                type="button"
                @click="openMedia(item)"
              >
                فتح المحتوى {{ index + 1 }}
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </div>
        </section>
      </template>
    </main>

    <BookReaderDialog
      v-if="isReaderOpen && book && primaryAction?.kind === 'reader'"
      :url="primaryAction.url"
      :book-id="book.bookId"
      :title="book.title"
      :total-pages="book.numberOfPages"
      @close="isReaderOpen = false"
    />
    <BookMediaDialog
      v-if="activeMedia"
      :key="activeMedia.key"
      :item="activeMedia"
      @close="activeMedia = null"
    />

  </div>
</template>

<style scoped>
.book-details-page {
  --book-details-action-text: #fff;
  min-height: 100vh;
  background: var(--home-v2-paper);
  color: var(--home-v2-ink);
}

:global(html[data-theme="dark"]) .book-details-page {
  --book-details-action-text: #07101f;
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
  color: var(--book-details-action-text);
  font-weight: 800;
}

.book-details-page__hero {
  padding: 60px 0;
  background: color-mix(in srgb, var(--home-v2-coral) 10%, var(--home-v2-cream));
}

.book-details-page__breadcrumb {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
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
  grid-template-columns: 300px minmax(0, 1fr);
  align-items: center;
  gap: clamp(48px, 7vw, 90px);
}

.book-details-page__badge {
  display: inline-block;
  padding: 6px 10px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  color: var(--home-v2-coral);
  font-size: 10px;
  font-weight: 900;
}
.book-details-page__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.book-details-page h1 {
  margin: 12px 0 0;
  color: var(--home-v2-ink);
  font: 900 clamp(38px, 4.2vw, 54px) / 1.3 var(--home-v2-heading);
}

.book-details-page__copy h2 {
  margin: 4px 0 17px;
  color: var(--home-v2-muted);
  font: 700 17px var(--home-v2-heading);
}

.book-details-page__copy > p {
  max-width: 700px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.9;
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
  background: var(--home-v2-surface);
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
  color: var(--book-details-action-text);
}

.book-details-page__actions > a:last-child {
  border: 1px solid var(--home-v2-blue);
  color: var(--home-v2-blue);
}

.book-details-page__unavailable {
  background: var(--home-v2-surface-raised);
  color: var(--home-v2-muted);
}

.book-details-page__cover {
  position: relative;
  display: flex;
  height: 440px;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 35px;
  background: color-mix(in srgb, var(--home-v2-blue) 18%, var(--home-v2-surface-raised));
  color: var(--home-v2-ink);
  box-shadow: 16px 19px color-mix(in srgb, var(--home-v2-deep) 11%, transparent);
}

.book-details-page__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  opacity: 0.25;
  filter: saturate(0.75);
}

.book-details-page__cover > span,
.book-details-page__cover > strong,
.book-details-page__cover > small {
  position: relative;
  z-index: 1;
}

.book-details-page__cover > span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.book-details-page__cover > strong {
  margin: auto 0;
  font: 900 34px/1.55 var(--home-v2-heading);
}

.book-details-page__cover > small {
  color: color-mix(in srgb, var(--home-v2-ink) 65%, transparent);
  font-size: 10px;
  font-weight: 800;
}

.book-details-page__author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
}

.book-details-page__author > span {
  display: grid;
  width: 43px;
  height: 43px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  color: var(--home-v2-blue);
  font-weight: 900;
}

.book-details-page__author > div {
  display: flex;
  flex-direction: column;
}

.book-details-page__author small {
  color: var(--home-v2-muted);
  font-size: 9px;
}

.book-details-page__author b {
  font: 800 11px var(--home-v2-heading);
}

.book-details-page__author > i {
  width: 1px;
  height: 28px;
  margin-inline: 10px;
  background: color-mix(in srgb, var(--home-v2-muted) 35%, transparent);
}

.book-details-page__information {
  padding: 65px 0 100px;
  background: color-mix(in srgb, var(--home-v2-cream) 72%, var(--home-v2-paper));
  color: var(--home-v2-ink);
}

.book-details-page__information-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  align-items: start;
  gap: 55px;
}

.book-details-page__content > article {
  margin-bottom: 55px;
  padding: 0 0 55px;
  border-bottom: 1px solid var(--home-v2-line);
}

.book-details-page__content > article:last-child {
  margin-bottom: 0;
}

.book-details-page__section-tag {
  color: var(--home-v2-coral);
  font-size: 11px;
  font-weight: 900;
}

.book-details-page__content h2,
.book-details-page__section-head h2 {
  margin: 7px 0;
  color: var(--home-v2-ink);
  font: 800 clamp(26px, 3vw, 34px) var(--home-v2-heading);
}

.book-details-page__content > article > p {
  color: var(--home-v2-muted);
  font-size: 14px;
  line-height: 2;
}

.book-details-page__feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 25px;
}

.book-details-page__feature-grid > div {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
}

.book-details-page__feature-grid span {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  place-items: center;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, var(--home-v2-surface-raised));
  color: var(--home-v2-blue);
  font-size: 9px;
  font-weight: 900;
}

.book-details-page__feature-grid p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 11px;
  line-height: 1.7;
}

.book-details-page__steps-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.book-details-page__steps-heading > div {
  flex: 1;
}

.book-details-page__steps-heading p {
  max-width: 680px;
  margin: 8px 0 0;
  color: var(--home-v2-muted);
  font-size: 14px;
  line-height: 2;
}

.book-details-page__steps-heading > img {
  width: 130px;
  height: 100px;
  flex: none;
  border: 1px solid var(--home-v2-line);
  object-fit: cover;
}

.book-details-page__steps-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.book-details-page__step-card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  min-height: 132px;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
}

.book-details-page__step-card figure {
  display: grid;
  min-height: 132px;
  margin: 0;
  place-items: center;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, var(--home-v2-surface));
}

.book-details-page__step-card figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details-page__step-card figure span {
  color: var(--home-v2-blue);
  font: 900 23px var(--home-v2-heading);
}

.book-details-page__step-card > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 18px;
}

.book-details-page__step-card small {
  margin-bottom: 4px;
  color: var(--home-v2-coral);
  font-size: 9px;
  font-weight: 900;
}

.book-details-page__step-card h3 {
  margin: 0;
  color: var(--home-v2-ink);
  font: 800 16px/1.5 var(--home-v2-heading);
}

.book-details-page__step-card p {
  margin: 5px 0 0;
  color: var(--home-v2-muted);
  font-size: 10px;
  line-height: 1.8;
}

.book-details-page__facts {
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  color: var(--home-v2-ink);
}

.book-details-page__facts > div {
  display: grid;
  grid-template-columns: minmax(120px, 0.45fr) 1fr;
  align-items: center;
  gap: 18px;
  padding: 17px;
  border-bottom: 1px solid var(--home-v2-line);
}

.book-details-page__facts > div:last-child {
  border-bottom: 0;
}

.book-details-page__facts span {
  color: var(--home-v2-muted);
  font-size: 11px;
}

.book-details-page__facts b {
  font: 800 12px var(--home-v2-heading);
}

.book-details-page__digital-policy {
  display: flex;
  gap: 18px;
  padding: 27px !important;
  border: 0 !important;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, var(--home-v2-surface));
}

.book-details-page__digital-policy > span {
  display: grid;
  width: 50px;
  height: 50px;
  flex: none;
  place-items: center;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface-raised);
  color: var(--home-v2-deep);
  font-size: 20px;
}

.book-details-page__digital-policy h2 {
  margin: 0;
  font-size: 20px;
}

.book-details-page__digital-policy p {
  margin: 5px 0;
  color: var(--home-v2-muted);
  font-size: 11px;
}

.book-details-page__digital-policy a,
.book-details-page__digital-policy button {
  padding: 0;
  color: var(--home-v2-blue);
  border: 0;
  background: transparent;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.book-details-page__buy-card {
  position: sticky;
  top: 105px;
  padding: 24px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  color: var(--home-v2-ink);
}

.book-details-page__buy-card > h2 {
  margin: 0 0 15px;
  font: 800 20px var(--home-v2-heading);
}

.book-details-page__format {
  margin-bottom: 12px;
  padding: 15px;
  border: 1px solid var(--home-v2-line);
}

.book-details-page__format > div {
  display: flex;
  gap: 10px;
}

.book-details-page__format > div > span {
  display: grid;
  width: 36px;
  height: 36px;
  flex: none;
  place-items: center;
  background: color-mix(in srgb, var(--home-v2-deep) 16%, var(--home-v2-surface-raised));
  color: var(--home-v2-deep);
}

.book-details-page__format--print > div > span {
  background: color-mix(in srgb, var(--home-v2-blue) 16%, var(--home-v2-surface-raised));
  color: var(--home-v2-blue);
}

.book-details-page__format p {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.book-details-page__format p b {
  font: 800 12px var(--home-v2-heading);
}

.book-details-page__format p small {
  color: var(--home-v2-muted);
  font-size: 9px;
}

.book-details-page__format > strong {
  display: block;
  margin-top: 12px;
  color: var(--home-v2-ink);
  font: 900 25px var(--home-v2-heading);
}

.book-details-page__format > strong small {
  font-size: 9px;
}

.book-details-page__format ul {
  margin: 12px 0;
  padding: 10px 0;
  border-top: 1px solid var(--home-v2-line);
  list-style: none;
}

.book-details-page__format li {
  position: relative;
  padding: 4px 17px 4px 0;
  color: var(--home-v2-muted);
  font-size: 9px;
}

.book-details-page__format li::before {
  position: absolute;
  right: 0;
  color: var(--home-v2-blue);
  content: "✓";
}

.book-details-page__format > a,
.book-details-page__format > button,
.book-details-page__format-unavailable {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  background: var(--home-v2-blue);
  color: var(--book-details-action-text);
  border: 0;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.book-details-page__format--print > a,
.book-details-page__format--print > button {
  background: var(--home-v2-deep);
}

.book-details-page__format-unavailable {
  background: var(--home-v2-surface-raised);
  color: var(--home-v2-muted);
}

.book-details-page__buy-card > p {
  color: var(--home-v2-muted);
  font-size: 9px;
  line-height: 1.7;
  text-align: center;
}

.book-details-page__buy-card > a {
  display: block;
  width: fit-content;
  margin: 16px auto 0;
  border-bottom: 1px solid var(--home-v2-blue);
  color: var(--home-v2-blue);
  font-size: 11px;
  font-weight: 900;
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
  background: var(--home-v2-surface);
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
  background: var(--home-v2-surface);
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
  background: color-mix(in srgb, var(--home-v2-blue) 8%, var(--home-v2-paper));
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
  border: 8px solid var(--home-v2-surface);
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

.book-details-page__media-links a,
.book-details-page__media-links button {
  display: flex;
  min-height: 62px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 20px;
  border: 1px solid var(--home-v2-line);
  border-radius: 10px;
  background: var(--home-v2-surface);
  color: var(--home-v2-blue);
  cursor: pointer;
  font-weight: 800;
}

@media (max-width: 850px) {
  .book-details-page__hero-grid {
    grid-template-columns: 1fr;
  }

  .book-details-page__cover {
    width: min(430px, 100%);
  }

  .book-details-page__information-grid {
    grid-template-columns: 1fr;
  }

  .book-details-page__buy-card {
    position: static;
  }

  .book-details-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .book-details-page__gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .book-details-page__hero {
    padding: 36px 0 52px;
  }

  .book-details-page__cover {
    height: 390px;
    padding: 28px;
  }

  .book-details-page__cover > strong {
    font-size: 29px;
  }

  .book-details-page__author {
    flex-wrap: wrap;
  }

  .book-details-page__information {
    padding: 50px 0 70px;
  }

  .book-details-page__feature-grid {
    grid-template-columns: 1fr;
  }

  .book-details-page__steps-heading > img {
    display: none;
  }

  .book-details-page__steps-grid {
    grid-template-columns: 1fr;
  }

  .book-details-page__step-card {
    grid-template-columns: 78px minmax(0, 1fr);
  }

  .book-details-page__facts > div {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .book-details-page__metrics,
  .book-details-page__gallery-grid,
  .book-details-page__media-links {
    grid-template-columns: 1fr;
  }
}
</style>
