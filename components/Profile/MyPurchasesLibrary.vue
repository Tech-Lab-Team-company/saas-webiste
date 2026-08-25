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
const searchInput = ref<HTMLInputElement | null>(null);

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

const continueCourse = computed(() => {
  const availableCourses = purchases.value.courses.filter(
    (course) => !course.isBlocked,
  );

  return (
    availableCourses.find(
      (course) => course.progress > 0 && course.progress < 100,
    ) ??
    availableCourses.find((course) => course.progress < 100) ??
    availableCourses[0] ??
    null
  );
});

const showContinueCourse = computed(
  () =>
    continueCourse.value !== null &&
    !normalizedSearchWord.value &&
    (activeFilter.value === "all" || activeFilter.value === "course"),
);

const activeFilterLabel = computed(
  () =>
    filterOptions.value.find((filter) => filter.key === activeFilter.value)
      ?.label ?? "الكل",
);

const hasActiveQuery = computed(
  () => activeFilter.value !== "all" || normalizedSearchWord.value.length > 0,
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

const normalizePercentage = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

const progressValue = (item: PurchasedItem): number | null => {
  if (item.kind === "course") return normalizePercentage(item.progress);
  if (item.kind !== "questionBank" || !item.totalQuestions) return null;
  return normalizePercentage(
    ((item.correctAnswers + item.wrongAnswers) / item.totalQuestions) * 100,
  );
};

const continueCourseProgress = computed(() =>
  continueCourse.value ? normalizePercentage(continueCourse.value.progress) : 0,
);

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

const handleSearchShortcut = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  const isEditing =
    target?.matches("input, textarea, select") || target?.isContentEditable;

  if (event.key === "/" && !isEditing) {
    event.preventDefault();
    searchInput.value?.focus();
    searchInput.value?.select();
  }
};

onMounted(() => window.addEventListener("keydown", handleSearchShortcut));
onBeforeUnmount(() =>
  window.removeEventListener("keydown", handleSearchShortcut),
);
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
      <section class="purchases-toolbar" aria-label="البحث وتصفية المشتريات">
        <label class="purchases-search">
          <span class="sr-only">ابحث في مشترياتك</span>
          <i class="pi pi-search" aria-hidden="true" />
          <input
            ref="searchInput"
            v-model="searchWord"
            type="search"
            aria-controls="purchase-results"
            placeholder="ابحث باسم الكورس أو الكتاب أو الباقة..."
            @keydown.esc="searchWord = ''"
          />
          <button
            v-if="searchWord"
            type="button"
            aria-label="مسح البحث"
            @click="searchWord = ''"
          >
            <i class="pi pi-times" />
          </button>
          <kbd v-else aria-hidden="true">/</kbd>
        </label>

        <div class="purchases-filters" role="group" aria-label="نوع المشتريات">
          <button
            v-for="filter in filterOptions"
            :key="filter.key"
            type="button"
            :class="{ active: activeFilter === filter.key }"
            :aria-pressed="activeFilter === filter.key"
            aria-controls="purchase-results"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}
            <span>{{ filter.count }}</span>
          </button>
        </div>
      </section>

      <div class="purchases-results-meta" aria-live="polite">
        <p>
          <strong>{{ visibleItemsCount }}</strong>
          نتيجة ضمن <span>{{ activeFilterLabel }}</span>
          <template v-if="normalizedSearchWord">
            للبحث عن «{{ searchWord.trim() }}»
          </template>
        </p>
        <button v-if="hasActiveQuery" type="button" @click="resetSearch">
          <i class="pi pi-times" aria-hidden="true" />
          مسح التصفية
        </button>
      </div>

      <aside
        v-if="showContinueCourse && continueCourse"
        class="purchases-resume"
        aria-labelledby="purchases-resume-title"
      >
        <div class="purchases-resume__visual" aria-hidden="true">
          <img v-if="continueCourse.image" :src="continueCourse.image" alt="" />
          <span v-else><i class="pi pi-play-circle" /></span>
          <i class="pi pi-play purchases-resume__play" />
        </div>
        <div class="purchases-resume__copy">
          <span class="purchases-resume__eyebrow">
            <i aria-hidden="true" />
            أكمل من حيث توقفت
          </span>
          <h2 id="purchases-resume-title">{{ continueCourse.title }}</h2>
          <p>
            {{
              [continueCourse.subjectTitle, continueCourse.teacherName]
                .filter(Boolean)
                .join(" · ") || "كورس جاهز للمتابعة"
            }}
          </p>
          <div
            class="purchases-resume__progress"
            :aria-label="`نسبة الإنجاز ${continueCourseProgress}%`"
          >
            <div>
              <span>التقدّم</span>
              <strong>{{ continueCourseProgress }}%</strong>
            </div>
            <span><i :style="{ width: `${continueCourseProgress}%` }" /></span>
          </div>
        </div>
        <NuxtLink :to="itemRoute(continueCourse) || '/'">
          متابعة التعلّم
          <i class="pi pi-arrow-left" aria-hidden="true" />
        </NuxtLink>
      </aside>

      <div
        v-if="visibleItemsCount === 0"
        id="purchase-results"
        class="purchases-state purchases-state--search"
      >
        <span class="purchases-state__icon pi pi-search" />
        <div>
          <h2>لا توجد نتائج مطابقة</h2>
          <p>جرّب كلمة أخرى أو اعرض كل أنواع المشتريات.</p>
        </div>
        <button type="button" @click="resetSearch">عرض كل المشتريات</button>
      </div>

      <div v-else id="purchase-results" class="purchase-sections">
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
              v-for="(item, itemIndex) in section.items"
              :key="`${item.kind}-${item.id}`"
              :class="['purchase-card', `purchase-card--${item.kind}`]"
              :style="{ '--purchase-order': itemIndex }"
            >
              <NuxtLink
                v-if="item.kind === 'book'"
                class="purchase-card__book-link"
                :to="itemRoute(item) || '/'"
                :aria-label="`تفاصيل الكتاب: ${item.title}، عدد الصفحات ${item.pageCount || 'غير محدد'}`"
              >
                <div class="purchase-card__book" aria-hidden="true">
                  <div class="purchase-card__book-pages">
                    <div class="purchase-card__book-page">
                      <i class="pi pi-book" />
                      <small>نسختك التعليمية</small>
                      <strong class="purchase-card__book-page-title">
                        {{ item.title }}
                      </strong>
                      <span class="purchase-card__book-page-rule" />
                      <span class="purchase-card__book-length">
                        <small>عدد الصفحات</small>
                        <b>{{ item.pageCount || "غير محدد" }}</b>
                        <em v-if="item.pageCount">صفحة</em>
                      </span>
                    </div>
                  </div>

                  <div class="purchase-card__book-cover">
                    <img v-if="item.image" :src="item.image" alt="" />
                    <span v-else class="purchase-card__book-cover-fallback">
                      <i class="pi pi-book" />
                      <strong>{{ item.title }}</strong>
                    </span>
                    <span class="purchase-card__book-spine" />
                    <span class="purchase-card__book-label">
                      <i class="pi pi-book" />
                      كتاب
                    </span>
                  </div>
                </div>
              </NuxtLink>

              <template v-else>
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
                    <li v-for="fact in itemFacts(item)" :key="fact">
                      {{ fact }}
                    </li>
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
                          :to="{
                            path: '/questions',
                            query: { bank_id: String(bank.id) },
                          }"
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
              </template>
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

.purchases-eyebrow {
  color: var(--profile-secondary);
  font-size: 11px;
  font-weight: 900;
}

.purchases-resume {
  position: relative;
  display: grid;
  min-height: 108px;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(14px, 2vw, 22px);
  overflow: hidden;
  margin: 4px 0 16px;
  padding: 10px 12px 10px 10px;
  border: 1px solid color-mix(
    in srgb,
    var(--profile-secondary) 25%,
    var(--profile-border)
  );
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 8% 15%,
      color-mix(in srgb, var(--profile-secondary) 13%, transparent),
      transparent 28%
    ),
    var(--profile-surface);
  box-shadow: 0 10px 28px
    color-mix(in srgb, var(--profile-primary) 5%, transparent);
}

.purchases-resume::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    var(--profile-secondary),
    color-mix(in srgb, var(--profile-secondary) 35%, transparent)
  );
  content: "";
}

.purchases-resume__visual {
  position: relative;
  height: 86px;
  overflow: hidden;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--profile-primary), #07152f);
  box-shadow: 0 8px 18px rgb(3 11 29 / 18%);
}

.purchases-resume__visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgb(2 10 28 / 58%));
  content: "";
}

.purchases-resume__visual > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.purchases-resume__visual > span {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: rgb(255 255 255 / 35%);
  font-size: 34px;
}

.purchases-resume__play {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 8px 20px rgb(0 0 0 / 24%);
  color: var(--profile-secondary);
  font-size: 10px;
  transform: translate(-50%, -50%);
}

.purchases-resume__copy {
  min-width: 0;
}

.purchases-resume__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #168457;
  font-size: 9px;
  font-weight: 900;
}

.purchases-resume__eyebrow > i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentcolor;
  box-shadow: 0 0 0 4px rgb(22 132 87 / 11%);
}

.purchases-resume h2 {
  display: -webkit-box;
  overflow: hidden;
  margin: 4px 0 2px;
  color: var(--profile-ink);
  font-size: clamp(14px, 1.6vw, 17px);
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.purchases-resume__copy > p {
  margin: 0;
  color: var(--profile-muted);
  font-size: 9px;
}

.purchases-resume__progress {
  max-width: 330px;
  margin-top: 7px;
}

.purchases-resume__progress > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
  color: var(--profile-muted);
  font-size: 8px;
  font-weight: 800;
}

.purchases-resume__progress > div strong {
  color: var(--profile-secondary);
}

.purchases-resume__progress > span {
  display: block;
  height: 5px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--profile-canvas);
}

.purchases-resume__progress > span > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--profile-secondary),
    color-mix(in srgb, var(--profile-secondary) 52%, #6be7bd)
  );
}

.purchases-resume > a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 13px;
  border-radius: 10px;
  background: var(--profile-action);
  color: var(--profile-on-action);
  font-size: 9px;
  font-weight: 900;
  text-decoration: none;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.purchases-resume > a:hover,
.purchases-resume > a:focus-visible {
  box-shadow: 0 10px 24px
    color-mix(in srgb, var(--profile-secondary) 20%, transparent);
  outline: 0;
  transform: translateY(-2px);
}

.purchases-toolbar {
  position: sticky;
  top: 94px;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 8px;
  padding: 9px;
  border: 1px solid var(--profile-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--profile-surface) 94%, transparent);
  box-shadow: 0 8px 22px
    color-mix(in srgb, var(--profile-primary) 4%, transparent);
  backdrop-filter: blur(14px);
}

.purchases-search {
  display: flex;
  min-width: min(100%, 360px);
  min-height: 40px;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
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

.purchases-search kbd {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  place-items: center;
  border: 1px solid var(--profile-border);
  border-radius: 7px;
  background: var(--profile-surface);
  color: var(--profile-muted);
  font: inherit;
  font-size: 10px;
  box-shadow: 0 2px 0 var(--profile-border);
}

.purchases-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.purchases-filters button {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
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
.purchases-filters button.active,
.purchases-filters button:focus-visible {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 24%,
    var(--profile-border)
  );
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
  outline: 0;
}

.purchases-results-meta {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 0 2px 8px;
}

.purchases-results-meta > p {
  margin: 0;
  color: var(--profile-muted);
  font-size: 9px;
}

.purchases-results-meta > p strong {
  color: var(--profile-ink);
  font-size: 12px;
}

.purchases-results-meta > p span {
  color: var(--profile-secondary);
  font-weight: 900;
}

.purchases-results-meta > button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 0;
  background: transparent;
  color: var(--profile-secondary);
  font: inherit;
  font-size: 8px;
  font-weight: 900;
  cursor: pointer;
}

.purchase-sections {
  display: grid;
  gap: 28px;
}

.purchase-section {
  min-width: 0;
}

.purchase-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 11px;
}

.purchase-section__header > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.purchase-section__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 11px;
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
  font-size: 14px;
}

.purchase-section__header h2 {
  margin: 0;
  color: var(--profile-ink);
  font-size: 17px;
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

.purchase-grid:has(.purchase-card--book) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(18px, 2.4vw, 30px);
  align-items: start;
}

.purchase-card {
  --purchase-order: 0;
  position: relative;
  isolation: isolate;
  display: grid;
  min-width: 0;
  grid-template-columns: 145px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--profile-border);
  border-radius: 18px;
  background: var(--profile-surface);
  box-shadow: 0 18px 38px
    color-mix(in srgb, var(--profile-primary) 5%, transparent);
  animation: purchase-card-enter 520ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  animation-delay: calc(var(--purchase-order) * 55ms);
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

.purchase-card--book {
  min-height: 390px;
  place-items: center;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.purchase-card--book:hover,
.purchase-card--book:focus-within {
  border-color: transparent;
  box-shadow: none;
}

.purchase-card__course-pass {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(
    in srgb,
    var(--profile-primary) 15%,
    var(--profile-border)
  );
  border-radius: 17px;
  background: var(--profile-surface);
  box-shadow: 0 12px 30px
    color-mix(in srgb, var(--profile-primary) 7%, transparent);
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.purchase-card__course-pass::before,
.purchase-card__course-pass::after {
  position: absolute;
  z-index: 4;
  top: 149px;
  width: 18px;
  height: 18px;
  border: 1px solid var(--profile-border);
  border-radius: 50%;
  background: var(--profile-canvas);
  content: "";
}

.purchase-card__course-pass::before {
  right: -10px;
}

.purchase-card__course-pass::after {
  left: -10px;
}

.purchase-card--course:hover .purchase-card__course-pass,
.purchase-card--course:focus-within .purchase-card__course-pass {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 38%,
    var(--profile-border)
  );
  box-shadow: 0 30px 62px
    color-mix(in srgb, var(--profile-primary) 16%, transparent);
}

.purchase-card__course-media-cover {
  position: relative;
  height: 158px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 50%, var(--profile-secondary-soft), transparent 35%),
    linear-gradient(135deg, var(--profile-primary), #06122d);
}

.purchase-card__course-media-cover::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(2 9 27 / 8%) 35%, rgb(2 9 27 / 76%)),
    linear-gradient(90deg, rgb(255 255 255 / 9%), transparent 35%);
  content: "";
  pointer-events: none;
}

.purchase-card__course-media-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 500ms ease, transform 650ms ease;
}

.purchase-card--course:hover .purchase-card__course-media-cover > img,
.purchase-card--course:focus-within .purchase-card__course-media-cover > img {
  filter: saturate(1.08) contrast(1.03);
  transform: scale(1.055);
}

.purchase-card__course-cover-fallback {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: rgb(255 255 255 / 35%);
  font-size: 62px;
}

.purchase-card__course-access {
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 10px;
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 99px;
  background: rgb(2 10 28 / 65%);
  color: #d8f8e8;
  font-size: 8px;
  font-weight: 900;
  backdrop-filter: blur(9px);
}

.purchase-card__course-access > i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #54d798;
  box-shadow: 0 0 0 3px rgb(84 215 152 / 14%);
}

.purchase-card__course-access--recorded {
  color: #ffebbd;
}

.purchase-card__course-access--recorded > i {
  background: #f5bd51;
}

.purchase-card__course-access--blocked {
  color: #ffd5d2;
}

.purchase-card__course-access--blocked > i {
  background: #ff746c;
}

.purchase-card__course-play {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--profile-secondary) 90%,
    rgb(255 255 255 / 12%)
  );
  box-shadow:
    0 10px 24px rgb(0 0 0 / 28%),
    0 0 0 6px rgb(255 255 255 / 10%);
  color: #fff;
  text-decoration: none;
  transform: translate(-50%, -50%);
  transition: box-shadow 220ms ease, transform 220ms ease;
}

.purchase-card__course-play > i {
  margin-left: 2px;
}

.purchase-card__course-play:hover,
.purchase-card__course-play:focus-visible {
  box-shadow:
    0 16px 34px rgb(0 0 0 / 36%),
    0 0 0 12px rgb(255 255 255 / 12%);
  outline: 0;
  transform: translate(-50%, -50%) scale(1.08);
}

.purchase-card__course-play--disabled {
  background: rgb(91 103 122 / 86%);
}

.purchase-card__course-details {
  position: relative;
  min-height: 220px;
  padding: 16px 17px 14px;
  border-top: 1px dashed color-mix(
    in srgb,
    var(--profile-primary) 22%,
    var(--profile-border)
  );
}

.purchase-card__course-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.purchase-card__course-heading > span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  color: var(--profile-secondary);
  font-size: 8px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-card__course-heading > small {
  color: var(--profile-muted);
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.purchase-card__course-details h3 {
  margin: 6px 0 3px;
  font-size: 16px;
  line-height: 1.45;
}

.purchase-card__course-teacher {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--profile-muted);
  font-size: 9px;
  font-weight: 700;
}

.purchase-card__course-content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.purchase-card__course-content > li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 7px;
  border: 1px solid var(--profile-border);
  border-radius: 9px;
  background: var(--profile-surface-raised);
  color: var(--profile-muted);
  font-size: 7px;
  font-weight: 800;
}

.purchase-card__course-content i {
  color: var(--profile-secondary);
  font-size: 10px;
}

.purchase-card__course-content strong {
  color: var(--profile-ink);
  font-size: 9px;
}

.purchase-card__course-progress {
  margin-top: 10px;
}

.purchase-card__course-progress > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  color: var(--profile-muted);
  font-size: 8px;
  font-weight: 800;
}

.purchase-card__course-progress > div strong {
  color: var(--profile-secondary);
}

.purchase-card__course-progress > span {
  display: block;
  height: 6px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--profile-canvas);
}

.purchase-card__course-progress > span > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--profile-secondary),
    color-mix(in srgb, var(--profile-secondary) 50%, #67e8c2)
  );
}

.purchase-card__course-footer {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 12px;
}

.purchase-card__course-footer > a:first-child,
.purchase-card__course-footer > span:first-child {
  display: inline-flex;
  min-height: 36px;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 13px;
  border-radius: 10px;
  background: var(--profile-action);
  color: var(--profile-on-action);
  font-size: 9px;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
}

.purchase-card__course-footer > span:first-child {
  background: color-mix(in srgb, #b42318 10%, var(--profile-surface-raised));
  color: #b42318;
}

.purchase-card__course-footer > a:last-child:not(:first-child) {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border: 1px solid var(--profile-border);
  border-radius: 10px;
  color: var(--profile-muted);
  text-decoration: none;
}

.purchase-card__course-footer > a:hover,
.purchase-card__course-footer > a:focus-visible {
  outline: 0;
  transform: translateY(-2px);
}

.purchase-card__course-pass--blocked .purchase-card__course-media-cover > img {
  filter: grayscale(0.72) brightness(0.74);
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

.purchase-card__visual > img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 250px;
  object-fit: cover;
  transition: transform 300ms ease;
}

.purchase-card:hover .purchase-card__visual > img {
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

.purchase-card__book-link {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 390px;
  padding: 24px 8px 42px;
  place-items: center;
  color: inherit;
  perspective: 1450px;
  text-decoration: none;
}

.purchase-card__book-link::before {
  position: absolute;
  right: 14%;
  bottom: 28px;
  left: 14%;
  height: 28px;
  border-radius: 50%;
  background: rgb(8 18 42 / 32%);
  filter: blur(12px);
  content: "";
  opacity: 0.72;
  transform: rotate(-1deg);
}

.purchase-card__book-link:focus-visible {
  border-radius: 12px;
  outline: 3px solid var(--profile-secondary-soft);
  outline-offset: 4px;
}

.purchase-card__book {
  position: relative;
  z-index: 2;
  width: 220px;
  height: 330px;
  transform: rotate(-1.5deg) translateZ(0);
  transform-style: preserve-3d;
  transition: transform 650ms cubic-bezier(0.2, 0.78, 0.18, 1);
}

.purchase-card__book-pages {
  position: absolute;
  inset: 5px 4px 5px 1px;
  overflow: hidden;
  border: 1px solid rgb(194 183 157 / 65%);
  border-radius: 7px 3px 3px 7px;
  background:
    repeating-linear-gradient(
      90deg,
      #f8f3e7 0 3px,
      #e6dcc7 3px 4px
    );
  box-shadow:
    -6px 8px 0 -2px #d9ceb7,
    -11px 17px 28px rgb(0 0 0 / 38%);
}

.purchase-card__book-pages::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent 74%, rgb(94 75 42 / 13%));
  content: "";
  pointer-events: none;
}

.purchase-card__book-page {
  position: absolute;
  inset: 18px 17px 18px 13px;
  display: flex;
  padding: 20px 17px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgb(114 92 54 / 16%);
  color: #5d513d;
  text-align: center;
}

.purchase-card__book-page > i {
  color: color-mix(in srgb, var(--profile-secondary) 76%, #303d52);
  font-size: 33px;
}

.purchase-card__book-page > small {
  color: #8a7a5f;
  font-size: 9px;
  font-weight: 800;
}

.purchase-card__book-page-title {
  display: -webkit-box;
  overflow: hidden;
  color: #3d3427;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.purchase-card__book-page-rule {
  width: 42px;
  height: 2px;
  margin-block: 2px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--profile-secondary) 62%, #8a7655);
}

.purchase-card__book-length {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: center;
  gap: 1px 5px;
  color: #5d513d;
}

.purchase-card__book-length small {
  grid-column: 1 / -1;
  color: #9a8869;
  font-size: 8px;
  font-weight: 700;
}

.purchase-card__book-length b {
  font-size: 18px;
  font-weight: 900;
}

.purchase-card__book-length em {
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
}

.purchase-card__book-cover {
  position: absolute;
  z-index: 4;
  inset: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 8px 3px 3px 8px;
  background:
    linear-gradient(150deg, rgb(255 255 255 / 12%), transparent 34%),
    var(--profile-primary);
  box-shadow:
    -10px 14px 24px rgb(0 0 0 / 34%),
    inset 10px 0 18px rgb(255 255 255 / 7%);
  backface-visibility: hidden;
  transform: rotateY(0deg);
  transform-origin: right center;
  transform-style: preserve-3d;
  transition: transform 700ms cubic-bezier(0.18, 0.78, 0.16, 1),
    box-shadow 700ms ease;
}

.purchase-card__book-cover::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 62%, rgb(0 0 0 / 24%)),
    linear-gradient(180deg, transparent 45%, rgb(2 12 35 / 58%));
  content: "";
  pointer-events: none;
}

.purchase-card__book-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.015);
  transition: transform 650ms ease, filter 650ms ease;
}

.purchase-card__book-cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  padding: 38px 28px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  color: #fff;
  text-align: center;
}

.purchase-card__book-cover-fallback > i {
  font-size: 46px;
  opacity: 0.86;
}

.purchase-card__book-cover-fallback > strong {
  display: -webkit-box;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.purchase-card__book-spine {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  width: 14px;
  border-left: 1px solid rgb(255 255 255 / 14%);
  background: linear-gradient(90deg, rgb(0 0 0 / 30%), rgb(255 255 255 / 9%));
  box-shadow: -3px 0 8px rgb(0 0 0 / 18%);
}

.purchase-card__book-label {
  position: absolute;
  z-index: 3;
  right: 22px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
}

.purchase-card--book:focus-within .purchase-card__book {
  transform: translateX(-28px) rotate(0.5deg) translateZ(0);
}

.purchase-card--book:focus-within .purchase-card__book-cover {
  box-shadow: -22px 20px 34px rgb(0 0 0 / 26%);
  transform: rotateY(88deg);
}

.purchase-card--book:focus-within .purchase-card__book-cover > img {
  filter: saturate(1.08) contrast(1.02);
  transform: scale(1.06);
}

@media (hover: hover) and (pointer: fine) {
  .purchase-card--book:hover .purchase-card__book {
    transform: translateX(-28px) rotate(0.5deg) translateZ(0);
  }

  .purchase-card--book:hover .purchase-card__book-cover {
    box-shadow: -22px 20px 34px rgb(0 0 0 / 26%);
    transform: rotateY(88deg);
  }

  .purchase-card--book:hover .purchase-card__book-cover > img {
    filter: saturate(1.08) contrast(1.02);
    transform: scale(1.06);
  }

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

@keyframes purchase-card-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (hover: none), (pointer: coarse) {
  .purchase-card__book-cover {
    transform: rotateY(9deg);
  }
}

@media (max-width: 1180px) {
  .purchase-grid,
  .purchases-loading {
    grid-template-columns: 1fr;
  }

  .purchase-grid:has(.purchase-card--book) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

}

@media (max-width: 820px) {
  .purchases-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .purchases-toolbar {
    position: relative;
    top: auto;
  }

  .purchases-resume {
    grid-template-columns: 110px minmax(0, 1fr);
  }

  .purchases-resume > a {
    grid-column: 2;
    justify-self: start;
  }

  .purchases-search {
    width: 100%;
  }

  .purchases-filters {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: thin;
  }

  .purchases-filters button {
    flex: 0 0 auto;
  }

  .purchases-state--empty {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .purchases-empty-actions {
    justify-content: center;
  }

  .purchase-grid:has(.purchase-card--book) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

}

@media (max-width: 560px) {
  .purchase-card,
  .purchase-skeleton {
    grid-template-columns: 1fr;
  }

  .purchase-card--book {
    min-height: 350px;
  }

  .purchase-card__course-media-cover {
    height: 170px;
  }

  .purchase-card__course-pass::before,
  .purchase-card__course-pass::after {
    top: 161px;
  }

  .purchase-card__course-details {
    min-height: 0;
    padding-inline: 16px;
  }

  .purchases-resume {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 10px;
    padding: 9px;
  }

  .purchases-resume__visual {
    height: 72px;
  }

  .purchases-resume > a {
    grid-column: 1 / -1;
    justify-self: stretch;
  }

  .purchases-results-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .purchase-card__visual,
  .purchase-card__visual > img {
    min-height: 190px;
    max-height: 230px;
  }

  .purchase-grid:has(.purchase-card--book) {
    grid-template-columns: 1fr;
  }

  .purchase-card__book-link {
    min-height: 350px;
    padding: 20px 8px 38px;
  }

  .purchase-card__book {
    width: 190px;
    height: 285px;
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
  .purchase-card__visual > img,
  .purchase-card__book,
  .purchase-card__book-cover,
  .purchase-card__book-cover > img,
  .purchase-card__course-pass,
  .purchase-card__course-media-cover > img,
  .purchase-card__course-play,
  .purchases-resume > a,
  .purchase-skeleton > span,
  .purchase-skeleton i {
    animation: none;
    transition: none;
  }

  .purchase-card--book:hover .purchase-card__book,
  .purchase-card--book:focus-within .purchase-card__book,
  .purchase-card--book:hover .purchase-card__book-cover,
  .purchase-card--book:focus-within .purchase-card__book-cover {
    transform: none;
  }

  .purchase-card--course:hover .purchase-card__course-media-cover > img,
  .purchase-card--course:focus-within .purchase-card__course-media-cover > img {
    transform: none;
  }
}
</style>
