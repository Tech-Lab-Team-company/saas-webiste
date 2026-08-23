<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import {
  DataDump,
  DataEmpty,
  DataFailed,
  DataInitial,
  DataLoading,
  DataSuccess,
} from "~/base/core/networkStructure/Resources/dataState/data_state";
import FetchPurchasesParams from "~/features/FetchPurchases/Core/Params/fetch_purchases_params";
import PurchasesModel, {
  type PurchaseKind,
  type PurchasedItem,
} from "~/features/FetchPurchases/Data/models/purchases_model";
import FetchPurchasesController from "~/features/FetchPurchases/presentation/controllers/fetch_purchases_controller";

type PurchaseFilter = "all" | PurchaseKind;

interface PurchaseSection {
  key: PurchaseKind;
  label: string;
  description: string;
  icon: string;
  items: PurchasedItem[];
}

const controller = FetchPurchasesController.getInstance();
const emptyPurchases = PurchasesModel.empty();
const state = controller.state;

void controller.fetchPurchases(new FetchPurchasesParams());

const activeFilter = ref<PurchaseFilter>("all");
const searchWord = ref("");

const purchases = computed(() => state.value.data ?? emptyPurchases);
const isLoading = computed(
  () =>
    state.value instanceof DataInitial || state.value instanceof DataLoading,
);
const isFailed = computed(() => state.value instanceof DataFailed);
const isSuccessful = computed(
  () => state.value instanceof DataSuccess || state.value instanceof DataDump,
);
const isEmpty = computed(
  () =>
    state.value instanceof DataEmpty ||
    (isSuccessful.value && purchases.value.totalItems === 0),
);

const sections = computed<PurchaseSection[]>(() => [
  {
    key: "course",
    label: "الكورسات",
    description: "دروسك ومحتوى الكورسات المشترك بها",
    icon: "pi pi-play-circle",
    items: purchases.value.courses,
  },
  {
    key: "book",
    label: "الكتب",
    description: "الكتب الرقمية والمطبوعة التي طلبتها",
    icon: "pi pi-book",
    items: purchases.value.books,
  },
  {
    key: "questionBank",
    label: "بنوك الأسئلة",
    description: "تدريباتك وإحصائيات إجاباتك",
    icon: "pi pi-file-edit",
    items: purchases.value.questionBanks,
  },
  {
    key: "package",
    label: "الباقات",
    description: "كل محتويات الباقات في مكان واحد",
    icon: "pi pi-box",
    items: purchases.value.packages,
  },
]);

const filterOptions = computed(() => [
  { key: "all" as const, label: "الكل", count: purchases.value.totalItems },
  ...sections.value.map((section) => ({
    key: section.key,
    label: section.label,
    count: section.items.length,
  })),
]);

const normalizedSearchWord = computed(() => searchWord.value.trim().toLowerCase());
const matchesSearch = (item: PurchasedItem) => {
  const word = normalizedSearchWord.value;
  if (!word) return true;

  const extra =
    item.kind === "course"
      ? `${item.subjectTitle} ${item.teacherName}`
      : item.kind === "package"
        ? `${item.courses.map((course) => course.title).join(" ")} ${item.questionBanks
            .map((bank) => bank.title)
            .join(" ")}`
        : "";

  return `${item.title} ${item.description} ${extra}`
    .toLowerCase()
    .includes(word);
};

const visibleSections = computed(() =>
  sections.value
    .filter(
      (section) =>
        activeFilter.value === "all" || section.key === activeFilter.value,
    )
    .map((section) => ({
      ...section,
      items: section.items.filter(matchesSearch),
    }))
    .filter((section) => section.items.length > 0),
);

const visibleItemsCount = computed(() =>
  visibleSections.value.reduce(
    (total, section) => total + section.items.length,
    0,
  ),
);

const purchaseStatus = (item: PurchasedItem) => {
  if (item.kind === "course" && item.isBlocked) {
    return { label: "الوصول موقوف", tone: "blocked" };
  }

  if (
    (item.kind === "course" && (item.isPaid || item.allowStatus === 1)) ||
    (item.kind === "book" && (item.isFree || item.allowStatus === 1)) ||
    (item.kind === "questionBank" && item.isPaid) ||
    (item.kind === "package" && item.isSubscribed)
  ) {
    return { label: "متاح الآن", tone: "active" };
  }

  return { label: "تم تسجيل الشراء", tone: "recorded" };
};

const itemRoute = (item: PurchasedItem): RouteLocationRaw | null => {
  if (item.kind === "course" && !item.isBlocked) {
    return { name: "course-id", params: { id: item.courseId } };
  }
  if (item.kind === "book") {
    return { path: `/books/${item.bookId}` };
  }
  if (item.kind === "questionBank") {
    return { path: "/questions", query: { bank_id: String(item.id) } };
  }
  return null;
};

const actionLabel = (item: PurchasedItem) => {
  if (item.kind === "course") return "فتح الكورس";
  if (item.kind === "book") return "تفاصيل الكتاب";
  if (item.kind === "questionBank") return "ابدأ التدريب";
  return "محتويات الباقة";
};

const kindLabel = (kind: PurchaseKind) => {
  if (kind === "course") return "كورس";
  if (kind === "book") return "كتاب";
  if (kind === "questionBank") return "بنك أسئلة";
  return "باقة";
};

const kindIcon = (kind: PurchaseKind) => {
  if (kind === "course") return "pi pi-play-circle";
  if (kind === "book") return "pi pi-book";
  if (kind === "questionBank") return "pi pi-file-edit";
  return "pi pi-box";
};

const itemFacts = (item: PurchasedItem): string[] => {
  if (item.kind === "course") {
    return [
      item.subjectTitle,
      item.teacherName,
      item.videoCount ? `${item.videoCount} فيديو` : "",
      item.pdfCount ? `${item.pdfCount} ملف` : "",
      item.audioCount ? `${item.audioCount} تسجيل` : "",
    ].filter(Boolean);
  }

  if (item.kind === "book") {
    return [
      item.pageCount ? `${item.pageCount} صفحة` : "",
      item.isFree ? "نسخة مجانية" : "كتاب تم شراؤه",
    ].filter(Boolean);
  }

  if (item.kind === "questionBank") {
    const solved = item.correctAnswers + item.wrongAnswers;
    return [
      item.totalQuestions ? `${item.totalQuestions} سؤال` : "",
      solved ? `${solved} تم حلها` : "",
      item.remainingQuestions ? `${item.remainingQuestions} متبقي` : "",
    ].filter(Boolean);
  }

  return [
    item.totalCourses ? `${item.totalCourses} كورس` : "",
    item.totalQuestionBanks ? `${item.totalQuestionBanks} بنك أسئلة` : "",
  ].filter(Boolean);
};

const progressValue = (item: PurchasedItem): number | null => {
  if (item.kind === "course") return item.progress;
  if (item.kind !== "questionBank" || !item.totalQuestions) return null;
  return Math.min(
    100,
    Math.round(
      ((item.correctAnswers + item.wrongAnswers) / item.totalQuestions) * 100,
    ),
  );
};

const priceLabel = (item: PurchasedItem) => {
  if (item.kind === "book" && item.isFree) return "مجاني";
  if (item.price === null) return "";
  if (item.price === 0) return "مجاني";
  return `${item.price} ${item.currency}`.trim();
};

const packageItemsCount = (item: PurchasedItem) =>
  item.kind === "package"
    ? item.courses.length + item.questionBanks.length
    : 0;

const retry = () => controller.fetchPurchases(new FetchPurchasesParams());
const resetSearch = () => {
  searchWord.value = "";
  activeFilter.value = "all";
};
</script>

<template>
  <div class="purchases-library">
    <div v-if="isLoading" class="purchases-loading" aria-live="polite">
      <span class="sr-only">جارٍ تحميل مشترياتك</span>
      <article v-for="item in 4" :key="item" class="purchase-skeleton">
        <span />
        <div><i /><i /><i /><i /></div>
      </article>
    </div>

    <div v-else-if="isFailed" class="purchases-state purchases-state--error">
      <span class="purchases-state__icon pi pi-exclamation-circle" />
      <div>
        <h2>تعذّر تحميل مشترياتك</h2>
        <p>تأكد من اتصالك بالإنترنت، ثم حاول مرة أخرى.</p>
      </div>
      <button type="button" @click="retry">
        <i class="pi pi-refresh" />
        إعادة المحاولة
      </button>
    </div>

    <div v-else-if="isEmpty" class="purchases-state purchases-state--empty">
      <div class="purchases-empty-art" aria-hidden="true">
        <span class="pi pi-play-circle" />
        <span class="pi pi-book" />
        <span class="pi pi-file-edit" />
        <span class="pi pi-box" />
      </div>
      <div>
        <span class="purchases-eyebrow">مكتبتك الشخصية</span>
        <h2>كل مشترياتك ستظهر هنا</h2>
        <p>
          بعد شراء كورس أو كتاب أو بنك أسئلة أو باقة، ستجدها هنا مع حالة
          الوصول والفاتورة والمحتوى المتاح.
        </p>
        <div class="purchases-empty-actions">
          <NuxtLink to="/course">تصفّح الكورسات</NuxtLink>
          <NuxtLink to="/books">تصفّح الكتب</NuxtLink>
        </div>
      </div>
    </div>

    <template v-else-if="isSuccessful">
      <section class="purchases-overview" aria-labelledby="purchases-summary-title">
        <header>
          <div>
            <span class="purchases-eyebrow">ملخص المكتبة</span>
            <h2 id="purchases-summary-title">
              {{ purchases.totalItems }} عنصر مرتبط بحسابك
            </h2>
          </div>
          <p>اختر النوع أو ابحث بالاسم للوصول إلى مشترياتك بسرعة.</p>
        </header>

        <div class="purchases-stats">
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            :class="[
              'purchase-stat',
              `purchase-stat--${section.key}`,
              { 'purchase-stat--active': activeFilter === section.key },
            ]"
            :aria-pressed="activeFilter === section.key"
            @click="activeFilter = section.key"
          >
            <i :class="section.icon" aria-hidden="true" />
            <span>{{ section.label }}</span>
            <strong>{{ section.items.length }}</strong>
          </button>
        </div>
      </section>

      <section class="purchases-toolbar" aria-label="البحث وتصفية المشتريات">
        <label class="purchases-search">
          <span class="sr-only">ابحث في مشترياتك</span>
          <i class="pi pi-search" aria-hidden="true" />
          <input
            v-model="searchWord"
            type="search"
            placeholder="ابحث باسم الكورس أو الكتاب أو الباقة..."
          />
          <button
            v-if="searchWord"
            type="button"
            aria-label="مسح البحث"
            @click="searchWord = ''"
          >
            <i class="pi pi-times" />
          </button>
        </label>

        <div class="purchases-filters" role="group" aria-label="نوع المشتريات">
          <button
            v-for="filter in filterOptions"
            :key="filter.key"
            type="button"
            :class="{ active: activeFilter === filter.key }"
            :aria-pressed="activeFilter === filter.key"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}
            <span>{{ filter.count }}</span>
          </button>
        </div>
      </section>

      <div
        v-if="visibleItemsCount === 0"
        class="purchases-state purchases-state--search"
      >
        <span class="purchases-state__icon pi pi-search" />
        <div>
          <h2>لا توجد نتائج مطابقة</h2>
          <p>جرّب كلمة أخرى أو اعرض كل أنواع المشتريات.</p>
        </div>
        <button type="button" @click="resetSearch">عرض كل المشتريات</button>
      </div>

      <div v-else class="purchase-sections">
        <section
          v-for="section in visibleSections"
          :key="section.key"
          class="purchase-section"
          :aria-labelledby="`purchases-${section.key}`"
        >
          <header class="purchase-section__header">
            <div>
              <span :class="['purchase-section__icon', `tone-${section.key}`]">
                <i :class="section.icon" aria-hidden="true" />
              </span>
              <div>
                <h2 :id="`purchases-${section.key}`">{{ section.label }}</h2>
                <p>{{ section.description }}</p>
              </div>
            </div>
            <span>{{ section.items.length }} عنصر</span>
          </header>

          <div class="purchase-grid">
            <article
              v-for="item in section.items"
              :key="`${item.kind}-${item.id}`"
              :class="['purchase-card', `purchase-card--${item.kind}`]"
            >
              <div class="purchase-card__visual">
                <span class="purchase-card__fallback" aria-hidden="true">
                  <i :class="kindIcon(item.kind)" />
                </span>
                <img v-if="item.image" :src="item.image" :alt="item.title" />
                <span class="purchase-card__kind">
                  <i :class="kindIcon(item.kind)" aria-hidden="true" />
                  {{ kindLabel(item.kind) }}
                </span>
              </div>

              <div class="purchase-card__body">
                <div class="purchase-card__topline">
                  <span
                    :class="[
                      'purchase-status',
                      `purchase-status--${purchaseStatus(item).tone}`,
                    ]"
                  >
                    <i aria-hidden="true" />
                    {{ purchaseStatus(item).label }}
                  </span>
                  <span v-if="priceLabel(item)" class="purchase-card__price">
                    {{ priceLabel(item) }}
                  </span>
                </div>

                <h3>{{ item.title }}</h3>
                <p>
                  {{
                    item.description ||
                    `كل تفاصيل ${kindLabel(item.kind)} متاحة من حسابك.`
                  }}
                </p>

                <ul v-if="itemFacts(item).length" class="purchase-card__facts">
                  <li v-for="fact in itemFacts(item)" :key="fact">{{ fact }}</li>
                </ul>

                <div
                  v-if="progressValue(item) !== null"
                  class="purchase-progress"
                  :aria-label="`نسبة الإنجاز ${progressValue(item)}%`"
                >
                  <div>
                    <span>نسبة الإنجاز</span>
                    <strong>{{ progressValue(item) }}%</strong>
                  </div>
                  <span>
                    <i :style="{ width: `${progressValue(item)}%` }" />
                  </span>
                </div>

                <details
                  v-if="item.kind === 'package' && packageItemsCount(item)"
                  class="purchase-package"
                >
                  <summary>
                    <span>{{ actionLabel(item) }}</span>
                    <i class="pi pi-chevron-down" aria-hidden="true" />
                  </summary>
                  <div class="purchase-package__content">
                    <div v-if="item.courses.length">
                      <strong>الكورسات</strong>
                      <NuxtLink
                        v-for="course in item.courses"
                        :key="`package-course-${course.id}`"
                        :to="{ name: 'course-id', params: { id: course.id } }"
                      >
                        {{ course.title }}
                        <i class="pi pi-arrow-left" />
                      </NuxtLink>
                    </div>
                    <div v-if="item.questionBanks.length">
                      <strong>بنوك الأسئلة</strong>
                      <NuxtLink
                        v-for="bank in item.questionBanks"
                        :key="`package-bank-${bank.id}`"
                        :to="{ path: '/questions', query: { bank_id: String(bank.id) } }"
                      >
                        {{ bank.title }}
                        <i class="pi pi-arrow-left" />
                      </NuxtLink>
                    </div>
                  </div>
                </details>

                <footer class="purchase-card__footer">
                  <NuxtLink
                    v-if="itemRoute(item)"
                    class="purchase-card__primary"
                    :to="itemRoute(item) || '/'"
                  >
                    {{ actionLabel(item) }}
                    <i class="pi pi-arrow-left" aria-hidden="true" />
                  </NuxtLink>
                  <span
                    v-else-if="item.kind === 'course' && item.isBlocked"
                    class="purchase-card__disabled"
                  >
                    تواصل مع الدعم لاستعادة الوصول
                  </span>
                  <span v-else class="purchase-card__included">
                    {{ packageItemsCount(item) }} محتوى داخل الباقة
                  </span>

                  <a
                    v-if="item.invoiceLink"
                    class="purchase-card__invoice"
                    :href="item.invoiceLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i class="pi pi-file-pdf" aria-hidden="true" />
                    الفاتورة
                  </a>
                </footer>
              </div>
            </article>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.purchases-library {
  width: 100%;
  min-width: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.purchases-overview {
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid var(--profile-border);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 8% 18%,
      color-mix(in srgb, var(--profile-secondary) 12%, transparent),
      transparent 30%
    ),
    var(--profile-surface);
}

.purchases-overview > header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.purchases-eyebrow {
  color: var(--profile-secondary);
  font-size: 11px;
  font-weight: 900;
}

.purchases-overview h2 {
  margin: 7px 0 0;
  color: var(--profile-ink);
  font-size: clamp(21px, 2.2vw, 29px);
}

.purchases-overview header p {
  max-width: 390px;
  margin: 0;
  color: var(--profile-muted);
  font-size: 12px;
  line-height: 1.8;
}

.purchases-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.purchase-stat {
  display: grid;
  min-width: 0;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border: 1px solid var(--profile-border);
  border-radius: 14px;
  background: color-mix(
    in srgb,
    var(--profile-secondary) 3%,
    var(--profile-surface-raised)
  );
  color: var(--profile-ink);
  font: inherit;
  text-align: right;
  cursor: pointer;
  transition: border-color 180ms ease, background-color 180ms ease,
    transform 180ms ease;
}

.purchase-stat:hover,
.purchase-stat--active {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 38%,
    var(--profile-border)
  );
  background: var(--profile-secondary-soft);
  transform: translateY(-2px);
}

.purchase-stat > i {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 11px;
  background: var(--profile-surface);
  color: var(--profile-secondary);
}

.purchase-stat > span {
  overflow: hidden;
  font-size: 11px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-stat > strong {
  color: var(--profile-secondary);
  font-size: 20px;
}

.purchases-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 22px 0 34px;
  padding: 14px;
  border: 1px solid var(--profile-border);
  border-radius: 16px;
  background: var(--profile-surface);
}

.purchases-search {
  display: flex;
  min-width: min(100%, 360px);
  min-height: 46px;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--profile-border);
  border-radius: 12px;
  background: var(--profile-surface-raised);
  color: var(--profile-muted);
}

.purchases-search:focus-within {
  border-color: var(--profile-secondary);
  box-shadow: 0 0 0 3px var(--profile-secondary-soft);
}

.purchases-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--profile-ink);
  font: inherit;
  font-size: 11px;
}

.purchases-search button {
  border: 0;
  background: transparent;
  color: var(--profile-muted);
  cursor: pointer;
}

.purchases-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.purchases-filters button {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--profile-muted);
  font: inherit;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
}

.purchases-filters button span {
  display: grid;
  min-width: 21px;
  height: 21px;
  place-items: center;
  padding-inline: 5px;
  border-radius: 7px;
  background: var(--profile-canvas);
  font-size: 9px;
}

.purchases-filters button:hover,
.purchases-filters button.active {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 24%,
    var(--profile-border)
  );
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
}

.purchase-sections {
  display: grid;
  gap: 44px;
}

.purchase-section {
  min-width: 0;
}

.purchase-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 17px;
}

.purchase-section__header > div {
  display: flex;
  align-items: center;
  gap: 13px;
}

.purchase-section__icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  border-radius: 14px;
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
  font-size: 17px;
}

.purchase-section__header h2 {
  margin: 0;
  color: var(--profile-ink);
  font-size: 19px;
}

.purchase-section__header p {
  margin: 2px 0 0;
  color: var(--profile-muted);
  font-size: 10px;
}

.purchase-section__header > span {
  color: var(--profile-muted);
  font-size: 10px;
  font-weight: 800;
}

.purchase-grid,
.purchases-loading {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.purchase-card {
  display: grid;
  min-width: 0;
  grid-template-columns: 145px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--profile-border);
  border-radius: 18px;
  background: var(--profile-surface);
  box-shadow: 0 18px 38px
    color-mix(in srgb, var(--profile-primary) 5%, transparent);
  transition: border-color 200ms ease, box-shadow 200ms ease,
    transform 200ms ease;
}

.purchase-card:hover {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 35%,
    var(--profile-border)
  );
  box-shadow: 0 24px 46px
    color-mix(in srgb, var(--profile-primary) 10%, transparent);
  transform: translateY(-3px);
}

.purchase-card__visual {
  position: relative;
  min-height: 250px;
  overflow: hidden;
  background: color-mix(
    in srgb,
    var(--profile-secondary) 14%,
    var(--profile-surface-raised)
  );
}

.purchase-card--book .purchase-card__visual {
  background: color-mix(
    in srgb,
    var(--profile-primary) 10%,
    var(--profile-surface-raised)
  );
}

.purchase-card--questionBank .purchase-card__visual {
  background: color-mix(
    in srgb,
    var(--profile-secondary) 8%,
    var(--profile-surface)
  );
}

.purchase-card--package .purchase-card__visual {
  background: color-mix(
    in srgb,
    var(--profile-primary) 15%,
    var(--profile-surface-raised)
  );
}

.purchase-card__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--profile-secondary);
  font-size: 48px;
  opacity: 0.38;
}

.purchase-card__visual img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 250px;
  object-fit: cover;
  transition: transform 300ms ease;
}

.purchase-card:hover .purchase-card__visual img {
  transform: scale(1.04);
}

.purchase-card__visual::after {
  position: absolute;
  z-index: 2;
  inset: 0;
  background: linear-gradient(180deg, transparent 48%, rgb(5 16 38 / 55%));
  content: "";
  pointer-events: none;
}

.purchase-card__kind {
  position: absolute;
  z-index: 3;
  right: 11px;
  bottom: 11px;
  left: 11px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
}

.purchase-card__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 20px;
}

.purchase-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.purchase-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--profile-muted);
  font-size: 9px;
  font-weight: 900;
}

.purchase-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentcolor;
}

.purchase-status--active {
  color: #168457;
}

.purchase-status--recorded {
  color: #9a6500;
}

.purchase-status--blocked {
  color: #b42318;
}

.purchase-card__price {
  color: var(--profile-secondary);
  font-size: 10px;
  font-weight: 900;
}

.purchase-card h3 {
  display: -webkit-box;
  overflow: hidden;
  margin: 11px 0 5px;
  color: var(--profile-ink);
  font-size: 17px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.purchase-card__body > p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--profile-muted);
  font-size: 10px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.purchase-card__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.purchase-card__facts li {
  padding: 5px 8px;
  border: 1px solid var(--profile-border);
  border-radius: 8px;
  color: var(--profile-muted);
  font-size: 8px;
  font-weight: 800;
}

.purchase-progress {
  margin-top: 14px;
}

.purchase-progress > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: var(--profile-muted);
  font-size: 9px;
}

.purchase-progress > span {
  display: block;
  height: 5px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--profile-canvas);
}

.purchase-progress > span i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--profile-secondary);
}

.purchase-package {
  margin-top: 14px;
  border-block: 1px solid var(--profile-border);
}

.purchase-package summary {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  color: var(--profile-secondary);
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  list-style: none;
}

.purchase-package summary::-webkit-details-marker {
  display: none;
}

.purchase-package summary i {
  transition: transform 180ms ease;
}

.purchase-package[open] summary i {
  transform: rotate(180deg);
}

.purchase-package__content {
  display: grid;
  gap: 12px;
  padding: 0 0 13px;
}

.purchase-package__content > div {
  display: grid;
  gap: 5px;
}

.purchase-package__content strong {
  color: var(--profile-ink);
  font-size: 9px;
}

.purchase-package__content a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--profile-muted);
  font-size: 9px;
  text-decoration: none;
}

.purchase-package__content a:hover {
  color: var(--profile-secondary);
}

.purchase-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
}

.purchase-card__primary,
.purchase-card__invoice {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 900;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease,
    transform 180ms ease;
}

.purchase-card__primary {
  padding: 8px 13px;
  background: var(--profile-action);
  color: var(--profile-on-action);
}

.purchase-card__primary:hover {
  transform: translateY(-2px);
}

.purchase-card__invoice {
  padding: 8px 10px;
  border: 1px solid var(--profile-border);
  color: var(--profile-muted);
}

.purchase-card__invoice:hover {
  border-color: var(--profile-secondary);
  color: var(--profile-secondary);
}

.purchase-card__disabled,
.purchase-card__included {
  color: var(--profile-muted);
  font-size: 8px;
  font-weight: 800;
}

.purchases-state {
  display: flex;
  min-height: 260px;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: clamp(28px, 5vw, 58px);
  border: 1px solid var(--profile-border);
  border-radius: 22px;
  background: var(--profile-surface);
}

.purchases-state__icon {
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  place-items: center;
  border-radius: 17px;
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
  font-size: 22px;
}

.purchases-state h2 {
  margin: 0 0 4px;
  color: var(--profile-ink);
  font-size: 21px;
}

.purchases-state p {
  margin: 0;
  color: var(--profile-muted);
  font-size: 11px;
}

.purchases-state > button {
  min-height: 43px;
  margin-inline-start: auto;
  padding: 9px 16px;
  border: 0;
  border-radius: 11px;
  background: var(--profile-action);
  color: var(--profile-on-action);
  font: inherit;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.purchases-state--empty {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(300px, 1.3fr);
  background:
    radial-gradient(
      circle at 12% 22%,
      color-mix(in srgb, var(--profile-secondary) 13%, transparent),
      transparent 34%
    ),
    var(--profile-surface);
}

.purchases-state--empty h2 {
  margin-top: 8px;
  font-size: clamp(24px, 3vw, 34px);
}

.purchases-state--empty p {
  max-width: 570px;
  line-height: 1.9;
}

.purchases-empty-art {
  position: relative;
  min-height: 190px;
}

.purchases-empty-art span {
  position: absolute;
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  border: 1px solid var(--profile-border);
  border-radius: 22px;
  background: var(--profile-surface-raised);
  color: var(--profile-secondary);
  box-shadow: 0 16px 34px
    color-mix(in srgb, var(--profile-primary) 10%, transparent);
  font-size: 24px;
}

.purchases-empty-art span:nth-child(1) {
  top: 12px;
  right: 42%;
}

.purchases-empty-art span:nth-child(2) {
  top: 75px;
  right: 14%;
}

.purchases-empty-art span:nth-child(3) {
  top: 96px;
  right: 62%;
}

.purchases-empty-art span:nth-child(4) {
  top: 12px;
  right: 80%;
}

.purchases-empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.purchases-empty-actions a {
  min-height: 43px;
  padding: 10px 16px;
  border: 1px solid var(--profile-secondary);
  border-radius: 11px;
  color: var(--profile-secondary);
  font-size: 10px;
  font-weight: 900;
  text-decoration: none;
}

.purchases-empty-actions a:first-child {
  background: var(--profile-action);
  color: var(--profile-on-action);
}

.purchase-skeleton {
  display: grid;
  min-height: 250px;
  grid-template-columns: 145px 1fr;
  overflow: hidden;
  border: 1px solid var(--profile-border);
  border-radius: 18px;
  background: var(--profile-surface);
}

.purchase-skeleton > span,
.purchase-skeleton i {
  background: linear-gradient(
    100deg,
    var(--profile-surface-raised),
    var(--profile-canvas),
    var(--profile-surface-raised)
  );
  background-size: 200% 100%;
  animation: purchases-shimmer 1.2s infinite;
}

.purchase-skeleton > div {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 24px;
}

.purchase-skeleton i {
  width: 100%;
  height: 12px;
  border-radius: 5px;
}

.purchase-skeleton i:nth-child(1) {
  width: 32%;
}

.purchase-skeleton i:nth-child(2) {
  width: 75%;
  height: 25px;
}

.purchase-skeleton i:nth-child(3) {
  width: 92%;
}

.purchase-skeleton i:nth-child(4) {
  width: 58%;
}

@keyframes purchases-shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1180px) {
  .purchases-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .purchase-grid,
  .purchases-loading {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .purchases-overview > header,
  .purchases-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .purchases-search {
    width: 100%;
  }

  .purchases-filters {
    justify-content: flex-start;
  }

  .purchases-state--empty {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .purchases-empty-actions {
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .purchases-stats {
    grid-template-columns: 1fr;
  }

  .purchase-card,
  .purchase-skeleton {
    grid-template-columns: 1fr;
  }

  .purchase-card__visual,
  .purchase-card__visual img {
    min-height: 190px;
    max-height: 230px;
  }

  .purchase-card__footer,
  .purchases-state {
    align-items: stretch;
    flex-direction: column;
  }

  .purchase-card__primary,
  .purchase-card__invoice {
    flex: 1;
  }

  .purchases-state > button {
    margin-inline-start: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .purchase-card,
  .purchase-card__visual img,
  .purchase-stat,
  .purchase-skeleton > span,
  .purchase-skeleton i {
    animation: none;
    transition: none;
  }
}
</style>
