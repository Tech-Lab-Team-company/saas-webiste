<script setup lang="ts">
import { gsap } from "gsap";
import { storeToRefs } from "pinia";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  createEmptyBooks,
  mapBooksPage,
  mapHomeCourseStages,
  mapHomeCourseYears,
  mapHomeSite,
  mapHomeSubjects,
} from "~/features/HomePageFeature/mappers/homePageMapper";
import type {
  HomeBookViewModel,
  HomeCourseStageViewModel,
  HomeCourseTabViewModel,
  HomeSubjectViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import HomeSectionEmptyState from "~/components/home/v2/ui/HomeSectionEmptyState.vue";

definePageMeta({ layout: "home-v2" });

const route = useRoute();
const router = useRouter();
const webDomain = getWebDomain();

const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));
const currentPage = computed(() => {
  const value = Number(route.query.page);
  return Number.isInteger(value) && value > 0 ? value : 1;
});
const readPositiveQueryInteger = (value: unknown) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};
const currentStageId = computed(() =>
  readPositiveQueryInteger(route.query.stage_id),
);
const currentYearId = computed(() =>
  readPositiveQueryInteger(route.query.year_id),
);
const currentSubjectId = computed(() => {
  return readPositiveQueryInteger(route.query.subject_id);
});

const api = new HomePageApi(webDomain);
const { data: stages, pending: stagesPending } = await useAsyncData<
  HomeCourseStageViewModel[]
>(
  `books-stages:${webDomain}`,
  async () => mapHomeCourseStages(await api.fetchStages()),
  {
    default: () => [],
    dedupe: "defer",
  },
);
const selectedStage = computed(() =>
  stages.value.find((stage) => stage.id === currentStageId.value) ?? null,
);
const yearsRequest = useAsyncData<HomeCourseTabViewModel[]>(
  `books-stage-years:${webDomain}`,
  async () => {
    if (!selectedStage.value) return [];
    return mapHomeCourseYears(
      selectedStage.value,
      await api.fetchStageYears(selectedStage.value.id),
    );
  },
  {
    default: () => [],
    dedupe: "defer",
    watch: [currentStageId],
  },
);
const subjectsRequest = useAsyncData<HomeSubjectViewModel[]>(
  `books-subjects:${webDomain}`,
  async () => {
    if (!currentYearId.value) return [];
    return mapHomeSubjects(await api.fetchSubjectsByYear(currentYearId.value));
  },
  {
    default: () => [],
    dedupe: "defer",
    watch: [currentYearId],
  },
);
const booksRequest = useAsyncData(
  `books-page:${webDomain}`,
  async () =>
    mapBooksPage(
      await api.fetchBooks(
        currentPage.value,
        currentSubjectId.value,
        currentYearId.value,
      ),
    ),
  {
    default: createEmptyBooks,
    dedupe: "defer",
    watch: [currentPage, currentSubjectId, currentYearId],
  },
);
const [
  { data: years, pending: yearsPending },
  { data: subjects, pending: subjectsPending },
  { data: books, pending, error },
] = await Promise.all([yearsRequest, subjectsRequest, booksRequest]);

watch(currentPage, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

const visiblePages = computed(() => {
  const lastPage = books.value.pagination.lastPage;
  const start = Math.max(1, Math.min(currentPage.value - 2, lastPage - 4));
  const end = Math.min(lastPage, start + 4);
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
});

const priceLabel = (book: HomeBookViewModel) => {
  if (book.isFree || Number(book.price) === 0) return "مجاني";
  return `${book.price} ${book.currency}`.trim();
};

const coverTones = ["mint", "coral", "sky", "gold", "deep", "violet"] as const;
const coverTone = (book: HomeBookViewModel) =>
  coverTones[Math.abs(book.id) % coverTones.length];

type FormatKey = "all" | "digital" | "printed";

const selectedFormat = ref<FormatKey>("all");

const filteredBooks = computed(() => books.value.items.filter((book) => {
  const matchesFormat = selectedFormat.value === "all"
    || book.bookType === null
    || book.bookType === 3
    || (selectedFormat.value === "digital" && book.bookType === 1)
    || (selectedFormat.value === "printed" && book.bookType === 2);

  return matchesFormat;
}));

const selectedSubjectLabel = computed(() =>
  subjects.value.find((subject) => subject.id === currentSubjectId.value)?.label
    || "كل المواد",
);
const visibleBookCount = computed(() =>
  selectedFormat.value === "all"
    ? books.value.pagination.total || filteredBooks.value.length
    : filteredBooks.value.length,
);

const booksQuery = (page = 1) => ({
  ...(currentStageId.value ? { stage_id: currentStageId.value } : {}),
  ...(currentYearId.value ? { year_id: currentYearId.value } : {}),
  ...(currentSubjectId.value ? { subject_id: currentSubjectId.value } : {}),
  ...(page > 1 ? { page } : {}),
});

const selectStage = async (stageId: number) => {
  if (stageId === currentStageId.value) return;
  await router.push({ path: "/books", query: { stage_id: stageId } });
};

const selectYear = async (yearId: number) => {
  if (yearId === currentYearId.value) return;
  await router.push({
    path: "/books",
    query: {
      ...(currentStageId.value ? { stage_id: currentStageId.value } : {}),
      year_id: yearId,
    },
  });
};

const selectSubject = async (subjectId: number | null) => {
  if (subjectId === currentSubjectId.value) return;
  await router.push({
    path: "/books",
    query: {
      ...(currentStageId.value ? { stage_id: currentStageId.value } : {}),
      ...(currentYearId.value ? { year_id: currentYearId.value } : {}),
      ...(subjectId ? { subject_id: subjectId } : {}),
    },
  });
};

const heroBooksRef = ref<HTMLElement | null>(null);
let heroBooksAnimationContext: ReturnType<typeof gsap.context> | null = null;

onMounted(() => {
  if (!heroBooksRef.value) return;

  heroBooksAnimationContext = gsap.context(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>("i", heroBooksRef.value);
    const badge = heroBooksRef.value?.querySelector<HTMLElement>(":scope > span");
    const finalRotations = [-7, 0, 8];

    const timeline = gsap.timeline({
      defaults: { ease: "back.out(1.35)" },
    });

    cards.forEach((card, index) => {
      timeline.fromTo(
        card,
        {
          autoAlpha: 0,
          y: 105,
          scale: 0.72,
          rotation: index === 0 ? 18 : index === 2 ? -18 : 0,
          transformOrigin: "50% 100%",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotation: finalRotations[index],
          duration: 0.9,
        },
        index * 0.13,
      );
    });

    if (badge) {
      timeline.fromTo(
        badge,
        { autoAlpha: 0, y: 18, scale: 0.82 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.8)" },
        "-=0.3",
      );
    }
  }, heroBooksRef.value);
});

onBeforeUnmount(() => {
  heroBooksAnimationContext?.revert();
  heroBooksAnimationContext = null;
});

const listingTitle = computed(() =>
  `كل كتاب له هدف واضح${site.value.brandName ? ` | ${site.value.brandName}` : ""}`,
);
const listingDescription = computed(() =>
  "كل كتاب له هدف واضح. تصفح الكتب والمراجع التعليمية واختر ما يناسب احتياجك.",
);

useSeoMeta({
  title: () => listingTitle.value,
  description: () => listingDescription.value,
  ogTitle: () => listingTitle.value,
  ogDescription: () => listingDescription.value,
  twitterTitle: () => listingTitle.value,
  twitterDescription: () => listingDescription.value,
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
    class="home-v2 books-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <main>
      <header class="books-page__hero">
        <div class="container books-page__hero-layout">
          <div class="books-page__hero-copy">
            <span>مكتبة {{ site.brandName || "المنصة" }}</span>
            <h1>كل كتاب.<br />له <em>هدف واضح.</em></h1>
            <p>كل كتاب له هدف واضح؛ اختار الكتاب المناسب واطّلع على تفاصيله وعدد صفحاته وسعره.</p>
          </div>

          <div ref="heroBooksRef" class="books-page__hero-books" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{{ books.pagination.total || books.items.length }} كتاب متاح</span>
          </div>
        </div>
      </header>

      <section class="section books-page__catalog" aria-labelledby="books-catalog-title">
        <div class="container">
          <div class="books-page__heading">
            <div>
              <span class="section-tag">مكتبتك التعليمية</span>
              <h2 id="books-catalog-title">اختار الكتاب المناسب ليك</h2>
            </div>
            <div class="books-page__legend">
              <span><i class="digital" /> نسخة رقمية</span>
              <span><i class="details" /> التفاصيل والسعر داخل كل كتاب</span>
            </div>
          </div>

          <section class="books-page__filter-panel" aria-labelledby="books-subject-filter-title">
            <div>
              <span>الخطوة الأولى</span>
              <h3 id="books-subject-filter-title">اختار المادة</h3>
              <p>اختار المرحلة والسنة، وبعدها المادة لعرض الكتب المناسبة.</p>
            </div>
            <div class="books-page__taxonomy">
              <div class="books-page__taxonomy-group">
                <b>المرحلة</b>
                <div class="books-page__taxonomy-tabs" role="group" aria-label="اختيار المرحلة الدراسية">
                  <button
                    v-for="stage in stages"
                    :key="stage.id"
                    type="button"
                    :class="{ 'is-active': currentStageId === stage.id }"
                    :aria-pressed="currentStageId === stage.id"
                    @click="selectStage(stage.id)"
                  >
                    {{ stage.label }}
                  </button>
                  <span v-if="stagesPending" class="books-page__subjects-loading">
                    جاري تحميل المراحل...
                  </span>
                </div>
              </div>

              <div v-if="currentStageId" class="books-page__taxonomy-group">
                <b>السنة الدراسية</b>
                <div class="books-page__taxonomy-tabs" role="group" aria-label="اختيار السنة الدراسية">
                  <button
                    v-for="year in years"
                    :key="year.yearId"
                    type="button"
                    :class="{ 'is-active': currentYearId === year.yearId }"
                    :aria-pressed="currentYearId === year.yearId"
                    @click="selectYear(year.yearId)"
                  >
                    {{ year.label }}
                  </button>
                  <span v-if="yearsPending" class="books-page__subjects-loading">
                    جاري تحميل السنوات...
                  </span>
                </div>
              </div>

              <div v-if="currentYearId" class="books-page__taxonomy-group">
                <b>المادة</b>
                <div class="books-page__taxonomy-tabs" role="group" aria-label="تصفية الكتب حسب المادة">
                  <!-- <button
                    type="button"
                    :class="{ 'is-active': currentSubjectId === null }"
                    :aria-pressed="currentSubjectId === null"
                    @click="selectSubject(null)"
                  >
                    كل المواد
                  </button> -->
                  <button
                    v-for="subject in subjects"
                    :key="subject.id"
                    type="button"
                    :class="{ 'is-active': currentSubjectId === subject.id }"
                    :aria-pressed="currentSubjectId === subject.id"
                    @click="selectSubject(subject.id)"
                  >
                    {{ subject.label }}
                  </button>
                  <span v-if="subjectsPending" class="books-page__subjects-loading">
                    جاري تحميل المواد...
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div class="books-page__results-bar">
            <div>
              <span>مكتبة {{ selectedSubjectLabel }}</span>
              <b>{{ visibleBookCount }} كتاب متاح</b>
            </div>
            <div class="books-page__format-tabs" role="group" aria-label="تصفية حسب نوع النسخة">
              <button type="button" :class="{ 'is-active': selectedFormat === 'all' }" @click="selectedFormat = 'all'">
                كل النسخ
              </button>
              <button type="button" :class="{ 'is-active': selectedFormat === 'printed' }" @click="selectedFormat = 'printed'">
                نسخة مطبوعة
              </button>
              <button type="button" :class="{ 'is-active': selectedFormat === 'digital' }" @click="selectedFormat = 'digital'">
                نسخة رقمية
              </button>
            </div>
          </div>

          <div v-if="pending" class="books-page__state" role="status">
            جاري تحميل الكتب...
          </div>
          <HomeSectionEmptyState
            v-else-if="error"
            label="قسم الكتب"
            title="تعذر تحميل الكتب"
            description="تعذر جلب الكتب في الوقت الحالي. حاول مرة أخرى بعد التأكد من الخدمة."
          />
          <HomeSectionEmptyState
            v-else-if="books.items.length === 0"
            label="قسم الكتب"
            title="أضف كتب المنصة"
            description="أضف أول كتاب من لوحة التحكم ليظهر في المكتبة هنا."
          />

          <div v-else-if="filteredBooks.length === 0" class="books-page__state" role="status">
            لا توجد كتب مطابقة للاختيارات الحالية.
          </div>

          <div v-else class="books-page__grid">
            <article v-for="book in filteredBooks" :key="book.id" class="books-page__card">
              <NuxtLink
                class="books-page__cover-link"
                :to="`/books/${book.bookId}`"
                :aria-label="`عرض تفاصيل ${book.title}`"
              />

              <div :class="['books-page__cover', `books-page__cover--${coverTone(book)}`]">
                <img
                  v-if="book.image"
                  :src="book.image"
                  :alt="book.title"
                  loading="lazy"
                  decoding="async"
                />
                <template v-else>
                  <span>كتاب رقم {{ book.bookId }}</span>
                  <b>{{ book.title }}</b>
                  <small v-if="site.brandName">{{ site.brandName }}</small>
                </template>
                <em>{{ book.isFree ? "مجاني" : "متاح الآن" }}</em>
              </div>

              <div class="books-page__card-body">
                <span v-if="book.subtitle">{{ book.subtitle }}</span>
                <h3>{{ book.title }}</h3>
                <p v-if="book.description">{{ book.description }}</p>
                <div class="books-page__formats">
                  <div v-if="book.numberOfPages">
                    <small>عدد الصفحات</small>
                    <b>{{ book.numberOfPages }} صفحة</b>
                  </div>
                  <div>
                    <small>السعر</small>
                    <b>{{ priceLabel(book) }}</b>
                  </div>
                </div>
                <span class="books-page__details">
                  تفاصيل الكتاب
                  <span aria-hidden="true">←</span>
                </span>
              </div>
            </article>
          </div>

          <nav
            v-if="books.pagination.lastPage > 1"
            class="books-page__pagination"
            aria-label="صفحات الكتب"
          >
            <NuxtLink
              v-if="books.pagination.hasPreviousPage"
              :to="{ path: '/books', query: booksQuery(currentPage - 1) }"
              aria-label="الصفحة السابقة"
            >
              السابق
            </NuxtLink>
            <NuxtLink
              v-for="pageNumber in visiblePages"
              :key="pageNumber"
              :to="{ path: '/books', query: booksQuery(pageNumber) }"
              :class="{ 'is-active': pageNumber === books.pagination.currentPage }"
              :aria-current="pageNumber === books.pagination.currentPage ? 'page' : undefined"
            >
              {{ pageNumber }}
            </NuxtLink>
            <NuxtLink
              v-if="books.pagination.hasNextPage"
              :to="{ path: '/books', query: booksQuery(currentPage + 1) }"
              aria-label="الصفحة التالية"
            >
              التالي
            </NuxtLink>
          </nav>
        </div>
      </section>

      <section
        v-if="site.app.enabled"
        class="books-page__app-note"
      >
        <div class="container">
          <div class="books-page__app-icon" aria-hidden="true">
            <img v-if="site.logo?.src" :src="site.logo.src" alt="" />
            <strong v-else>ك</strong>
          </div>
          <div>
            <span>اقرأ وتعلّم من أي مكان</span>
            <h2>حمّل التطبيق وابدأ رحلتك التعليمية.</h2>
            <p>كل محتوى المنصة متاح ليك بتجربة سهلة ومنظمة.</p>
          </div>
          <div class="books-page__download-links">
            <a v-if="site.app.androidUrl" :href="site.app.androidUrl" target="_blank" rel="noreferrer">Android ←</a>
            <a v-if="site.app.iosUrl" :href="site.app.iosUrl" target="_blank" rel="noreferrer">iPhone ←</a>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<style scoped>
.books-page {
  min-height: 100vh;
  background: var(--home-v2-paper);
}

.books-page__hero {
  padding: 170px 0 90px;
  background:
    radial-gradient(circle at 15% 25%, color-mix(in srgb, var(--home-v2-blue) 22%, transparent), transparent 28%),
    linear-gradient(145deg, var(--home-v2-deep), #061147);
  color: #fff;
}

.books-page__hero span {
  color: #9dcbff;
  font-size: 13px;
  font-weight: 900;
}

.books-page__hero h1 {
  max-width: 800px;
  margin: 18px 0;
  font: 900 clamp(43px, 6vw, 76px) / 1.18 var(--home-v2-heading);
}

.books-page__hero p {
  max-width: 650px;
  margin: 0;
  color: #ffffffbd;
  font-size: 18px;
}

.books-page__catalog {
  background: #f4f7fc;
}

.books-page__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 38px;
}

.books-page__heading h2 {
  margin: 10px 0 0;
  font: 900 clamp(34px, 4vw, 52px) / 1.2 var(--home-v2-heading);
}

.books-page__heading > p {
  margin: 0;
  color: var(--home-v2-muted);
  font-weight: 800;
}

.books-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.books-page__card {
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 22px 48px -42px #06114799;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.books-page__card:hover {
  box-shadow: 0 30px 58px -40px #06114780;
  transform: translateY(-5px);
}

.books-page__cover {
  position: relative;
  height: 290px;
  overflow: hidden;
  background: var(--home-v2-deep);
}

.books-page__cover > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.books-page__cover > div {
  display: grid;
  height: 100%;
  align-content: end;
  gap: 12px;
  padding: 28px;
  background: linear-gradient(135deg, transparent 48%, #ffffff15 49%);
  color: #fff;
}

.books-page__cover > div span {
  color: #9dcbff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.books-page__cover > div b {
  display: -webkit-box;
  overflow: hidden;
  font: 900 24px/1.45 var(--home-v2-heading);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.books-page__cover > small {
  position: absolute;
  top: 18px;
  inset-inline-start: 18px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #fff;
  color: var(--home-v2-blue);
  font-weight: 900;
}

.books-page__card-body {
  display: grid;
  gap: 13px;
  padding: 24px;
}

.books-page__card-body > span:first-child {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 800;
}

.books-page__card h3 {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--home-v2-ink);
  font: 900 21px/1.55 var(--home-v2-heading);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.books-page__card p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.8;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.books-page__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.books-page__meta span {
  padding: 5px 9px;
  border-radius: 6px;
  background: #eef4ff;
  color: var(--home-v2-muted);
  font-size: 12px;
}

.books-page__card a,
.books-page__unavailable {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 4px;
  border-radius: 8px;
  font-weight: 800;
}

.books-page__card a {
  background: var(--home-v2-blue);
  color: #fff;
}

.books-page__unavailable {
  background: #eef1f6;
  color: var(--home-v2-muted);
}

.books-page__state {
  display: grid;
  min-height: 260px;
  place-items: center;
  border: 1px dashed var(--home-v2-line);
  border-radius: 16px;
  background: var(--home-v2-surface);
  color: var(--home-v2-muted);
  font-weight: 800;
}

.books-page__state--error {
  color: #b42318;
}

.books-page__pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 42px;
}

.books-page__pagination a {
  display: grid;
  min-width: 42px;
  height: 42px;
  place-items: center;
  padding-inline: 12px;
  border: 1px solid var(--home-v2-line);
  border-radius: 9px;
  background: var(--home-v2-surface);
  color: var(--home-v2-ink);
  font-weight: 800;
}

.books-page__pagination a.is-active {
  border-color: var(--home-v2-blue);
  background: var(--home-v2-blue);
  color: #fff;
}

@media (max-width: 940px) {
  .books-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .books-page__hero {
    padding: 140px 0 70px;
  }

  .books-page__heading {
    align-items: start;
    flex-direction: column;
  }

  .books-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .books-page__card {
    transition: none;
  }

  .books-page__card:hover {
    transform: none;
  }
}

/* Library design adapted from the student dashboard visual language. */
.books-page__hero {
  padding: 150px 0 78px;
  overflow: hidden;
  background: linear-gradient(145deg, color-mix(in srgb, var(--home-v2-blue) 76%, #071020), var(--home-v2-blue));
}

.books-page__hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.7fr);
  align-items: center;
  gap: 70px;
}

.books-page__hero-copy > span {
  color: #f2cc7b;
  font-size: 13px;
  font-weight: 900;
}

.books-page__hero h1 {
  margin: 14px 0 18px;
  font: 900 clamp(46px, 5.4vw, 72px) / 1.2 var(--home-v2-heading);
  letter-spacing: -0.04em;
}

.books-page__hero h1 em {
  color: color-mix(in srgb, var(--home-v2-blue) 42%, #fff);
  font-style: normal;
}

.books-page__hero p {
  max-width: 620px;
  color: #ffffffc2;
  line-height: 1.9;
}

.books-page__hero-books {
  position: relative;
  display: flex;
  height: 300px;
  align-items: end;
  justify-content: center;
}

.books-page__hero-books i {
  position: absolute;
  display: block;
  width: 130px;
  height: 230px;
  border: 4px solid #ffffffa6;
  background: var(--home-v2-blue);
  box-shadow: 0 28px 40px -26px #0009;
  transform: rotate(-7deg);
}

.books-page__hero-books i::before {
  content: "BOOK";
  display: block;
  padding: 17px;
  color: #ffffffd9;
  font: 900 10px var(--home-v2-heading);
  letter-spacing: 0.12em;
}

.books-page__hero-books i:nth-child(2) {
  z-index: 2;
  height: 260px;
  background: var(--home-v2-deep);
  transform: none;
}

.books-page__hero-books i:nth-child(3) {
  background: #ddebff;
  transform: rotate(8deg);
}

.books-page__hero-books i:nth-child(3)::before {
  color: var(--home-v2-deep);
}

.books-page__hero-books > span {
  position: absolute;
  bottom: -13px;
  z-index: 3;
  padding: 9px 14px;
  background: #fff;
  color: #081b3a;
  font-size: 12px;
  font-weight: 900;
}

.books-page__catalog {
  padding: 82px 0 100px;
  background: color-mix(in srgb, var(--home-v2-blue) 3%, var(--home-v2-paper));
}

.books-page__heading {
  align-items: end;
  margin-bottom: 35px;
}

.books-page__heading h2 {
  margin-top: 6px;
  font-size: clamp(30px, 3.5vw, 44px);
}

.books-page__legend {
  display: flex;
  gap: 18px;
  color: var(--home-v2-muted);
  font-size: 12px;
}

.books-page__legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.books-page__legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #77578a;
}

.books-page__legend i.details {
  background: #3e8778;
}

.books-page__filter-panel {
  display: grid;
  grid-template-columns: minmax(230px, 0.7fr) minmax(0, 1.3fr);
  align-items: center;
  gap: 32px;
  padding: 24px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
}

.books-page__filter-panel > div:first-child > span,
.books-page__results-bar > div:first-child > span {
  color: #ef7a63;
  font-size: 13px;
  font-weight: 900;
}

.books-page__filter-panel h3 {
  margin: 5px 0;
  color: var(--home-v2-ink);
  font: 900 24px / 1.45 var(--home-v2-heading);
}

.books-page__filter-panel p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 1.8;
}

.books-page__taxonomy {
  display: grid;
  gap: 18px;
}

.books-page__taxonomy-group {
  display: grid;
  gap: 8px;
}

.books-page__taxonomy-group > b {
  color: var(--home-v2-muted);
  font-size: 12px;
}

.books-page__taxonomy-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.books-page__subjects-loading {
  grid-column: 1 / -1;
  color: var(--home-v2-muted);
  font-size: 13px;
  text-align: center;
}

.books-page__taxonomy-tabs button,
.books-page__format-tabs button {
  min-height: 48px;
  padding: 10px 14px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface-raised);
  color: var(--home-v2-ink);
  cursor: pointer;
  font: 800 14px var(--home-v2-heading);
  transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.books-page__taxonomy-tabs button:hover,
.books-page__taxonomy-tabs button:focus-visible,
.books-page__taxonomy-tabs button.is-active {
  border-color: var(--home-v2-deep);
  outline: none;
  background: var(--home-v2-deep);
  color: #fff;
}

.books-page__taxonomy-tabs button:active,
.books-page__format-tabs button:active {
  transform: translateY(1px);
}

.books-page__results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 26px 0 18px;
}

.books-page__results-bar > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.books-page__results-bar b {
  color: var(--home-v2-ink);
  font: 900 18px var(--home-v2-heading);
}

.books-page__format-tabs {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 10px;
}

.books-page__format-tabs button {
  min-height: 44px;
  background: transparent;
}

.books-page__format-tabs button:hover,
.books-page__format-tabs button:focus-visible,
.books-page__format-tabs button.is-active {
  border-color: var(--home-v2-blue);
  outline: none;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, var(--home-v2-surface));
  color: var(--home-v2-blue);
}

.books-page__grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px)));
  justify-content: start;
  gap: 24px;
}

.books-page__card {
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid var(--home-v2-line);
  border-radius: 8px;
  background: var(--home-v2-surface);
  box-shadow: 0 22px 48px -42px #06114799;
  cursor: pointer;
}

.books-page__card:hover {
  box-shadow: 0 30px 58px -40px #06114780;
}

.books-page__card .books-page__cover-link {
  display: block;
  position: absolute;
  z-index: 5;
  inset: 0;
  min-height: 100%;
  margin: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
}

.books-page__card .books-page__cover-link:focus-visible {
  outline: 3px solid var(--home-v2-blue);
  outline-offset: -4px;
}

.books-page__cover {
  position: relative;
  display: flex;
  height: 285px;
  margin: 18px 35px 0;
  padding: 24px;
  flex-direction: column;
  overflow: hidden;
  background: #bcd9d4;
  color: #081b3a;
  box-shadow: 9px 11px #1231391a;
}

.books-page__cover::before {
  position: absolute;
  bottom: -90px;
  left: -110px;
  width: 220px;
  height: 220px;
  border: 1px solid #12313921;
  border-radius: 50%;
  content: "";
}

.books-page__cover--coral { color: #fff; background: #ef7a63; }
.books-page__cover--mint { background: #bcd9d4; }
.books-page__cover--sky { background: #bad7e0; }
.books-page__cover--gold { background: #ffcf63; }
.books-page__cover--deep { color: #fff; background: #061147; }
.books-page__cover--violet { background: #d9e3ff; }

.books-page__cover > img {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  object-fit: cover;
}

.books-page__cover > span {
  font: 900 10px var(--home-v2-heading);
  letter-spacing: 0.13em;
}

.books-page__cover > b {
  position: relative;
  z-index: 2;
  margin: auto 0;
  font: 900 25px / 1.55 var(--home-v2-heading);
}

.books-page__cover > small {
  opacity: 0.72;
  font-size: 11px;
  font-weight: 800;
}

.books-page__cover > em {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  padding: 6px 9px;
  background: #fff;
  color: #081b3a;
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}

.books-page__card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
  padding: 24px;
}

.books-page__card-body > span:first-child {
  color: #ef7a63;
  font-size: 12px;
  font-weight: 900;
}

.books-page__card h3 {
  margin: 5px 0 8px;
  font-size: 20px;
  line-height: 1.5;
  -webkit-line-clamp: 2;
}

.books-page__card p {
  min-height: 50px;
  font-size: 14px;
  line-height: 1.75;
}

.books-page__formats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 18px 0;
  border-block: 1px solid var(--home-v2-line);
}

.books-page__formats > div {
  padding: 12px;
}

.books-page__formats > div:first-child {
  border-inline-end: 1px solid var(--home-v2-line);
}

.books-page__formats small {
  display: block;
  color: var(--home-v2-muted);
  font-size: 11px;
}

.books-page__formats b {
  color: var(--home-v2-ink);
  font: 900 14px var(--home-v2-heading);
}

.books-page__card .books-page__details {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: auto 0 0;
  border-radius: 0;
  background: transparent;
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
}

.books-page__card:hover .books-page__details span {
  transform: translateX(-4px);
}

.books-page__details span {
  transition: transform 0.2s ease;
}

.books-page__app-note {
  margin-bottom: clamp(48px, 6vw, 84px);
  padding: 52px 0;
  background: linear-gradient(135deg, var(--home-v2-deep), var(--home-v2-blue));
  color: #fff;
}

.books-page__app-note > .container {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 20px;
}

.books-page__app-icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
  color: var(--home-v2-deep);
}

.books-page__app-icon img {
  width: 100%;
  height: 100%;
  padding: 7px;
  border-radius: 50%;
  object-fit: contain;
}

.books-page__app-note span {
  color: #f2cc7b;
  font-size: 12px;
  font-weight: 900;
}

.books-page__app-note h2 {
  margin: 4px 0;
  font: 900 25px var(--home-v2-heading);
}

.books-page__app-note p {
  margin: 0;
  color: #ffffff94;
  font-size: 13px;
}

.books-page__download-links {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.books-page__download-links a {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding-inline: 16px;
  background: #fff;
  color: var(--home-v2-deep);
  font-size: 13px;
  font-weight: 900;
}

.books-page__download-links a:last-child:not(:first-child) {
  border: 1px solid #ffffff47;
  background: transparent;
  color: #fff;
}

@media (max-width: 760px) {
  .books-page__hero-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .books-page__hero-books {
    display: none;
  }

  .books-page__heading,
  .books-page__app-note > .container {
    align-items: start;
    grid-template-columns: 1fr;
  }

  .books-page__heading {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .books-page__heading h2 {
    font-size: clamp(29px, 8vw, 34px);
    line-height: 1.3;
  }

  .books-page__legend {
    flex-direction: column;
    gap: 7px;
  }

  .books-page__filter-panel {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px;
  }

  .books-page__filter-panel h3 {
    font-size: 20px;
  }

  .books-page__filter-panel p {
    font-size: 13px;
    line-height: 1.7;
  }

  .books-page__taxonomy {
    gap: 14px;
  }

  .books-page__taxonomy-tabs button,
  .books-page__format-tabs button {
    min-height: 44px;
    padding: 8px 11px;
    font-size: 13px;
  }

  .books-page__results-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .books-page__format-tabs {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .books-page__grid {
    gap: 16px;
  }

  .books-page__cover {
    height: 220px;
    margin: 14px 22px 0;
    padding: 18px;
  }

  .books-page__cover > b {
    font-size: 21px;
  }

  .books-page__card-body {
    padding: 17px;
  }

  .books-page__card h3 {
    font-size: 18px;
    line-height: 1.45;
  }

  .books-page__card p {
    min-height: 0;
    font-size: 12.5px;
    line-height: 1.7;
    -webkit-line-clamp: 2;
  }

  .books-page__formats {
    margin-block: 13px;
  }

  .books-page__formats > div {
    padding: 9px;
  }
}

@media (max-width: 480px) {
  .books-page__hero {
    padding: 72px 0 48px;
  }

  .books-page__hero-copy > span {
    font-size: 11px;
  }

  .books-page__hero h1 {
    margin: 10px 0 12px;
    font-size: clamp(32px, 9vw, 38px);
    line-height: 1.25;
  }

  .books-page__hero p {
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
  }

  .books-page__catalog {
    padding: 48px 0 60px;
  }

  .books-page__cover {
    height: 210px;
    margin-inline: 20px;
  }

  .books-page__filter-panel {
    padding: 16px 14px;
  }

  .books-page__taxonomy-tabs {
    display: flex;
    overflow-x: auto;
    gap: 7px;
    padding-bottom: 5px;
    scroll-snap-type: x proximity;
  }

  .books-page__taxonomy-tabs button {
    min-width: min(44vw, 150px);
    flex: 0 0 auto;
    scroll-snap-align: start;
  }
}
</style>
