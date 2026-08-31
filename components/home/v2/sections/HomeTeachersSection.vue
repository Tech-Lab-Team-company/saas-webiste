<script setup lang="ts">
import type {
  HomeSiteViewModel,
  HomeTeacherViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = withDefaults(
  defineProps<{
    teachers: HomeSectionState<HomeTeacherViewModel[]>;
    site: HomeSiteViewModel;
    catalog?: boolean;
    pending?: boolean;
    onRetry?: () => void | Promise<void>;
  }>(),
  {
    catalog: false,
    pending: false,
    onRetry: undefined,
  },
);
const emit = defineEmits<{
  search: [value: string];
}>();

const failedImages = ref(new Set<number>());
const searchQuery = ref("");
const selectedLocation = ref("all");
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const locations = computed(() =>
  Array.from(
    new Set(
      props.teachers.data
        .map((teacher) => teacher.address?.trim())
        .filter((address): address is string => Boolean(address)),
    ),
  ).sort((first, second) => first.localeCompare(second, "ar")),
);

const filteredTeachers = computed(() => {
  return props.teachers.data.filter(
    (teacher) =>
      selectedLocation.value === "all" ||
      teacher.address?.trim() === selectedLocation.value,
  );
});

const visibleTeachers = computed(() =>
  props.catalog ? filteredTeachers.value : props.teachers.data.slice(0, 3),
);

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedLocation.value !== "all",
);

const requestSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    emit("search", searchQuery.value.trim());
  }, 450);
};

const resetFilters = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchQuery.value = "";
  selectedLocation.value = "all";
  emit("search", "");
};

const teacherSummary = (teacher: HomeTeacherViewModel) =>
  (
    teacher.shortDescription ||
    teacher.intro ||
    teacher.description ||
    `مدرس على ${props.site.brandName || "المنصة"}`
  ).replace(/\r\n?/gu, "\n");

const teacherInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const phoneHref = (phone: string | null) =>
  phone ? `tel:${phone.replace(/[^\d+]/gu, "")}` : null;

const markImageAsFailed = (teacherId: number) => {
  failedImages.value = new Set(failedImages.value).add(teacherId);
};

onMounted(() => {
  props.teachers.data.forEach((teacher) => {
    if (!teacher.image?.src) return;

    const image = new Image();
    image.onerror = () => markImageAsFailed(teacher.id);
    image.src = teacher.image.src;
  });
});

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
  <section
    v-if="
      site.hasTeacherDirectory &&
      (catalog || teachers.status === 'success')
    "
    id="teachers"
    class="home-teachers"
    :class="{ 'home-teachers--catalog': catalog }"
    aria-labelledby="home-teachers-title"
  >
    <div class="home-teachers__glow" aria-hidden="true" />
    <div class="container">
      <header v-if="!catalog" class="home-teachers__header">
        <div>
          <span>خبرات متعددة، في مكان واحد</span>
          <h2 id="home-teachers-title">
            تعرّف على <em>مدرّسي المنصة</em>
          </h2>
        </div>
        <p>
          اختر المدرس الأقرب لهدفك، وتعرّف على خبرته والمحتوى الذي يقدمه على
          {{ site.brandName || "المنصة" }}.
        </p>
      </header>

      <header v-else class="teacher-directory__header">
        <span>مدرسون بخبرات متنوعة</span>
        <h1 id="home-teachers-title">مدرسينا</h1>
        <p>
          تعرّف على مدرسي {{ site.brandName || "المنصة" }} واختر المدرس
          الأنسب لهدفك التعليمي.
        </p>
      </header>

      <div
        v-if="catalog && ['success', 'empty'].includes(teachers.status)"
        class="teacher-directory__filters"
        aria-label="تصفية المدرسين"
      >
        <div class="teacher-directory__search-field">
          <label class="teacher-directory__search">
            <span>ابحث عن مدرس</span>
            <input
              v-model="searchQuery"
              type="search"
              inputmode="search"
              placeholder="اكتب اسم المدرس أو خبرته"
              @input="requestSearch"
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </label>

          <span
            v-if="searchQuery.trim().length > 0 && searchQuery.trim().length < 3"
            class="handle-low-text"
            role="status"
          >
            <i class="pi pi-info-circle" aria-hidden="true" />
            أدخل 2 أحرف على الأقل للبحث
          </span>
        </div>

        <label class="teacher-directory__select">
          <span>الموقع</span>
          <select v-model="selectedLocation">
            <option value="all">جميع المواقع</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </label>

        <button
          v-if="hasActiveFilters"
          class="teacher-directory__reset"
          type="button"
          @click="resetFilters"
        >
          مسح التصفية
        </button>
      </div>

      <div
        v-if="catalog && ['success', 'empty'].includes(teachers.status)"
        class="teacher-directory__summary"
        aria-live="polite"
      >
        <strong>{{ visibleTeachers.length }} مدرس</strong>
        <span>متاحون لمساعدتك في رحلتك التعليمية</span>
      </div>

      <div v-if="pending" class="home-teachers__state" role="status">
        <span class="home-teachers__loader" aria-hidden="true" />
        <strong>جاري تجهيز دليل المدرسين</strong>
        <p>لحظات ونظهر لك كل الخبرات المتاحة على المنصة.</p>
      </div>

      <div
        v-else-if="teachers.status === 'error'"
        class="home-teachers__state home-teachers__state--error"
        role="alert"
      >
        <span aria-hidden="true">!</span>
        <strong>تعذر تحميل المدرسين الآن</strong>
        <p>{{ teachers.error?.message }}</p>
        <button v-if="onRetry" type="button" @click="onRetry">حاول مرة أخرى</button>
      </div>

      <div
        v-else-if="teachers.status === 'empty' && catalog && !searchQuery.trim()"
        class="home-teachers__state"
        role="status"
      >
        <span aria-hidden="true">+</span>
        <strong>دليل المدرسين قيد التجهيز</strong>
        <p>سيظهر المدرسون هنا فور إضافتهم إلى المنصة.</p>
      </div>

      <!-- Backup empty state: homepage teacher section.
      <div
        v-else-if="teachers.status === 'empty' && !catalog"
        class="home-teachers__state"
        role="status"
      >
        <span aria-hidden="true">+</span>
        <strong>دليل المدرسين قيد التجهيز</strong>
        <p>سيظهر المدرسون هنا فور إضافتهم إلى المنصة.</p>
      </div>
      -->

      <div
        v-else-if="catalog && visibleTeachers.length === 0"
        class="home-teachers__state teacher-directory__empty"
        role="status"
      >
        <span aria-hidden="true">⌕</span>
        <strong>لا توجد نتائج مطابقة</strong>
        <p>جرّب اسمًا آخر أو امسح التصفية الحالية.</p>
        <button v-if="hasActiveFilters" type="button" @click="resetFilters">
          عرض كل المدرسين
        </button>
      </div>

      <div v-else-if="catalog" class="teacher-directory__grid">
        <article
          v-for="teacher in visibleTeachers"
          :key="teacher.id"
          class="teacher-directory-card"
        >
          <span class="teacher-directory-card__status">
            <i aria-hidden="true" /> متاح
          </span>

          <div class="teacher-directory-card__portrait">
            <img
              v-if="teacher.image && !failedImages.has(teacher.id)"
              :src="teacher.image.src"
              :alt="teacher.image.alt || `صورة المدرس ${teacher.name}`"
              width="220"
              height="220"
              loading="lazy"
              @error="markImageAsFailed(teacher.id)"
            />
            <span v-else aria-hidden="true">{{ teacherInitials(teacher.name) }}</span>
          </div>

          <div class="teacher-directory-card__content">
            <h2>{{ teacher.name }}</h2>
            <p v-if="teacher.address" class="teacher-directory-card__location">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {{ teacher.address }}
            </p>
            <p class="teacher-directory-card__description">
              {{ teacherSummary(teacher) }}
            </p>
          </div>

          <dl class="teacher-directory-card__stats">
            <div>
              <dt>{{ teacher.coursesCount }}</dt>
              <dd>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
                  <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v17a3 3 0 0 1 3-3h3Z" />
                </svg>
                الكورسات
              </dd>
            </div>
            <div>
              <dt>{{ teacher.revisionsCount }}</dt>
              <dd>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
                </svg>
                المراجعات
              </dd>
            </div>
          </dl>

          <div class="teacher-directory-card__actions">
            <NuxtLink
              class="teacher-directory-card__courses"
              :to="{ path: '/course', query: { teacher_id: String(teacher.id) } }"
              :aria-label="`عرض كورسات ${teacher.name}`"
              title="عرض الكورسات"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
                <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v17a3 3 0 0 1 3-3h3Z" />
              </svg>
            </NuxtLink>
            <NuxtLink
              class="teacher-directory-card__profile"
              :to="`/teachers/${teacher.id}`"
              prefetch-on="interaction"
            >
              عرض الملف الشخصي <span aria-hidden="true">←</span>
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="home-teachers__grid">
        <article
          v-for="(teacher, index) in visibleTeachers"
          :key="teacher.id"
          class="home-teacher-card"
        >
          <div class="home-teacher-card__visual">
            <span class="home-teacher-card__index" aria-hidden="true">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <img
              v-if="teacher.image && !failedImages.has(teacher.id)"
              :src="teacher.image.src"
              :alt="teacher.image.alt || `صورة المدرس ${teacher.name}`"
              width="560"
              height="620"
              loading="lazy"
              @error="markImageAsFailed(teacher.id)"
            />
            <span v-else class="home-teacher-card__initials" aria-hidden="true">
              {{ teacherInitials(teacher.name) }}
            </span>
            <div class="home-teacher-card__badge">
              <i aria-hidden="true" /> مدرس على المنصة
            </div>
          </div>

          <div class="home-teacher-card__body">
            <span>مدرس معتمد</span>
            <h3>{{ teacher.name }}</h3>
            <p>{{ teacherSummary(teacher) }}</p>

            <dl v-if="teacher.coursesCount || teacher.revisionsCount">
              <div v-if="teacher.coursesCount">
                <dt>{{ teacher.coursesCount }}</dt>
                <dd>كورس</dd>
              </div>
              <div v-if="teacher.revisionsCount">
                <dt>{{ teacher.revisionsCount }}</dt>
                <dd>مراجعة</dd>
              </div>
            </dl>

            <div v-if="catalog" class="home-teacher-card__meta">
              <span v-if="teacher.address">⌖ {{ teacher.address }}</span>
              <a v-if="teacher.email" :href="`mailto:${teacher.email}`">راسل المدرس</a>
              <a v-else-if="phoneHref(teacher.phone)" :href="phoneHref(teacher.phone)!">
                تواصل مع المدرس
              </a>
            </div>

            <NuxtLink
              class="home-teacher-card__details"
              :to="`/teachers/${teacher.id}`"
              prefetch-on="interaction"
            >
              عرض ملف المدرس <span aria-hidden="true">←</span>
            </NuxtLink>
          </div>
        </article>
      </div>

      <footer v-if="!catalog && teachers.status === 'success'" class="home-teachers__footer">
        <p>اكتشف كل المدرسين والخبرات المتاحة على المنصة.</p>
        <NuxtLink to="/teachers" prefetch-on="interaction">
          كل المدرسين <span aria-hidden="true">←</span>
        </NuxtLink>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.home-teachers {
  position: relative;
  overflow: hidden;
  padding: clamp(76px, 9vw, 132px) 0;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--home-v2-blue) 6%, #fff), #fff 55%),
    #fff;
}

.home-teachers--catalog {
  min-height: calc(100vh - 86px);
  padding: clamp(42px, 6vw, 78px) 0 clamp(72px, 8vw, 112px);
  background:
    radial-gradient(circle at 8% 4%, color-mix(in srgb, var(--home-v2-blue) 9%, transparent), transparent 26%),
    linear-gradient(180deg, color-mix(in srgb, var(--home-v2-blue) 2.5%, var(--app-bg, #fbfcff)), var(--app-bg, #fbfcff));
}

.home-teachers--catalog .home-teachers__glow {
  top: -330px;
  opacity: 0.65;
}

.home-teachers__glow {
  position: absolute;
  top: -220px;
  inset-inline-end: -180px;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, transparent);
  filter: blur(8px);
  pointer-events: none;
}

.home-teachers__header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: 36px;
  margin-bottom: 48px;
}

.home-teachers__header span,
.home-teacher-card__body > span {
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.home-teachers__header h2 {
  max-width: 720px;
  margin: 12px 0 0;
  color: var(--home-v2-deep);
  font-size: clamp(38px, 5vw, 72px);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.home-teachers__header h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-teachers__header p,
.home-teachers__footer p {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 16px;
  line-height: 1.9;
}

.home-teachers__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.home-teacher-card {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 13%, #dfe5ee);
  border-radius: 28px;
  background: var(--app-surface, #fff);
  box-shadow: 0 24px 60px rgb(17 32 66 / 9%);
  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
}

.home-teacher-card:hover {
  transform: translateY(-7px);
  border-color: color-mix(in srgb, var(--home-v2-blue) 42%, #dfe5ee);
  box-shadow: 0 32px 74px color-mix(in srgb, var(--home-v2-blue) 16%, transparent);
}

.home-teacher-card__visual {
  position: relative;
  display: grid;
  min-height: 310px;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 75% 20%, rgb(255 255 255 / 45%), transparent 28%),
    linear-gradient(145deg, var(--home-v2-blue), var(--home-v2-deep));
}

.home-teacher-card__visual img {
  width: 100%;
  height: 310px;
  object-fit: cover;
  object-position: center top;
  transition: transform 500ms ease;
}

.home-teacher-card:hover .home-teacher-card__visual img {
  transform: scale(1.035);
}

.home-teacher-card__initials {
  color: rgb(255 255 255 / 94%);
  font-size: 72px;
  font-weight: 950;
  letter-spacing: -0.06em;
  text-shadow: 0 12px 32px rgb(0 0 0 / 22%);
}

.home-teacher-card__index {
  position: absolute;
  z-index: 2;
  top: 18px;
  inset-inline-start: 20px;
  color: rgb(255 255 255 / 72%);
  font-size: 12px;
  font-weight: 900;
}

.home-teacher-card__badge {
  position: absolute;
  z-index: 2;
  inset-inline: 18px;
  bottom: 18px;
  display: flex;
  width: max-content;
  max-width: calc(100% - 36px);
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 999px;
  background: rgb(8 24 52 / 66%);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  backdrop-filter: blur(14px);
}

.home-teacher-card__badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #65e6a6;
  box-shadow: 0 0 0 5px rgb(101 230 166 / 16%);
}

.home-teacher-card__body {
  padding: 26px;
}

.home-teacher-card__body h3 {
  margin: 8px 0 10px;
  color: var(--app-text, #081b3a);
  font-size: 24px;
  line-height: 1.3;
}

.home-teacher-card__body > p {
  display: -webkit-box;
  min-height: 78px;
  margin: 0;
  overflow: hidden;
  color: var(--app-muted, #53627a);
  font-size: 14px;
  line-height: 1.85;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.home-teacher-card dl {
  display: flex;
  gap: 24px;
  margin: 22px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--app-line, #e1e7f0);
}

.home-teacher-card dl div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.home-teacher-card dt {
  color: var(--home-v2-blue);
  font-size: 19px;
  font-weight: 950;
}

.home-teacher-card dd {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 12px;
}

.home-teacher-card__meta {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--app-line, #e1e7f0);
  color: var(--app-muted, #53627a);
  font-size: 12px;
}

.home-teacher-card__meta span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-teacher-card__meta a,
.home-teacher-card__details,
.home-teachers__footer a,
.home-teachers__state button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: var(--home-v2-blue);
  color: #fff;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.home-teacher-card__meta a {
  padding: 9px 13px;
  font-size: 11px;
}

.home-teacher-card__details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding: 12px 16px;
  font-size: 13px;
}

.home-teacher-card__details span {
  transition: transform 180ms ease;
}

.home-teacher-card__details:hover span {
  transform: translateX(-4px);
}

.teacher-directory__header {
  position: relative;
  max-width: 650px;
  margin: 0 auto clamp(30px, 4vw, 48px);
  text-align: center;
}

.teacher-directory__header > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--home-v2-blue);
  font-size: 13px;
  font-weight: 900;
}

.teacher-directory__header > span::before,
.teacher-directory__header > span::after {
  width: 22px;
  height: 1px;
  background: currentColor;
  content: "";
  opacity: 0.45;
}

.teacher-directory__header h1 {
  margin: 10px 0 8px;
  color: var(--app-text, #081b3a);
  font-size: clamp(36px, 4.8vw, 62px);
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.teacher-directory__header p {
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 15px;
  line-height: 1.9;
}

.teacher-directory__filters {
  position: relative;
  display: grid;
  grid-template-columns: minmax(240px, 1.6fr) minmax(180px, 0.8fr) auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, var(--app-line, #e1e7f0));
  border-radius: 20px;
  background: color-mix(in srgb, var(--app-surface, #fff) 96%, var(--home-v2-blue));
  box-shadow: 0 18px 48px rgb(17 32 66 / 7%);
}

.teacher-directory__search,
.teacher-directory__select {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 54px;
  align-items: center;
  border: 1px solid var(--app-line, #e1e7f0);
  border-radius: 13px;
  background: var(--app-surface, #fff);
}

.teacher-directory__search-field {
  display: grid;
  min-width: 0;
  gap: 7px;
}

.teacher-directory__search > span,
.teacher-directory__select > span {
  position: absolute;
  z-index: 1;
  top: 6px;
  inset-inline-start: 14px;
  color: var(--app-muted, #53627a);
  font-size: 9px;
  font-weight: 800;
  pointer-events: none;
}

.teacher-directory__search input,
.teacher-directory__select select {
  width: 100%;
  min-width: 0;
  height: 54px;
  padding: 20px 14px 5px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--app-text, #081b3a);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

.teacher-directory__search input {
  padding-inline-end: 44px;
}

.teacher-directory__search input::placeholder {
  color: color-mix(in srgb, var(--app-muted, #53627a) 75%, transparent);
}

.teacher-directory__search svg {
  position: absolute;
  inset-inline-end: 15px;
  width: 19px;
  fill: none;
  stroke: var(--home-v2-blue);
  stroke-linecap: round;
  stroke-width: 1.8;
  pointer-events: none;
}

.teacher-directory__search:focus-within,
.teacher-directory__select:focus-within {
  border-color: color-mix(in srgb, var(--home-v2-blue) 70%, var(--app-line, #e1e7f0));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue) 11%, transparent);
}

.teacher-directory__reset {
  min-height: 54px;
  padding: 0 18px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 18%, var(--app-line, #e1e7f0));
  border-radius: 13px;
  background: color-mix(in srgb, var(--home-v2-blue) 7%, var(--app-surface, #fff));
  color: var(--home-v2-blue);
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.teacher-directory__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 24px 2px 16px;
}

.teacher-directory__summary strong {
  color: var(--app-text, #081b3a);
  font-size: 16px;
}

.teacher-directory__summary span {
  color: var(--app-muted, #53627a);
  font-size: 12px;
}

.teacher-directory__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.teacher-directory-card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  padding: 18px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, var(--app-line, #e1e7f0));
  border-radius: 22px;
  background: var(--app-surface, #fff);
  box-shadow: 0 13px 35px rgb(17 32 66 / 7%);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.teacher-directory-card::before {
  position: absolute;
  top: 0;
  inset-inline: 0;
  height: 92px;
  background:
    radial-gradient(circle at 75% 0, color-mix(in srgb, var(--home-v2-blue) 15%, transparent), transparent 50%),
    linear-gradient(180deg, color-mix(in srgb, var(--home-v2-blue) 7%, var(--app-surface, #fff)), transparent);
  content: "";
  pointer-events: none;
}

.teacher-directory-card:hover {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--home-v2-blue) 38%, var(--app-line, #e1e7f0));
  box-shadow: 0 22px 52px color-mix(in srgb, var(--home-v2-blue) 12%, transparent);
}

.teacher-directory-card__status {
  position: absolute;
  z-index: 2;
  top: 14px;
  inset-inline-end: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 24%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--home-v2-blue) 9%, var(--app-surface, #fff));
  color: var(--home-v2-blue);
  font-size: 10px;
  font-weight: 900;
}

.teacher-directory-card__status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--home-v2-blue) 10%, transparent);
}

.teacher-directory-card__portrait {
  position: relative;
  z-index: 1;
  display: grid;
  width: 116px;
  height: 116px;
  margin-top: 4px;
  place-items: center;
  overflow: hidden;
  border: 4px solid var(--app-surface, #fff);
  border-radius: 50%;
  background: linear-gradient(145deg, color-mix(in srgb, var(--home-v2-blue) 22%, #fff), color-mix(in srgb, var(--home-v2-deep) 18%, #fff));
  box-shadow: 0 10px 28px color-mix(in srgb, var(--home-v2-blue) 16%, transparent);
}

.teacher-directory-card__portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.teacher-directory-card__portrait > span {
  color: var(--home-v2-deep);
  font-size: 32px;
  font-weight: 950;
}

.teacher-directory-card__content {
  width: 100%;
  min-width: 0;
  margin-top: 12px;
  text-align: center;
}

.teacher-directory-card__content h2 {
  margin: 0;
  overflow: hidden;
  color: var(--app-text, #081b3a);
  font-size: 17px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-directory-card__location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 5px 0 0;
  overflow: hidden;
  color: var(--app-muted, #53627a);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-directory-card__location svg {
  width: 13px;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--home-v2-blue);
  stroke-width: 1.7;
}

.teacher-directory-card__description {
  display: -webkit-box;
  min-height: 44px;
  margin: 10px 0 0;
  overflow: hidden;
  color: var(--app-muted, #53627a);
  font-size: 11px;
  line-height: 1.9;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.teacher-directory-card__stats {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 16px 0 12px;
}

.teacher-directory-card__stats > div {
  display: grid;
  min-height: 58px;
  place-items: center;
  align-content: center;
  gap: 4px;
  border: 1px solid var(--app-line, #e1e7f0);
  border-radius: 12px;
  background: color-mix(in srgb, var(--home-v2-blue) 2.5%, var(--app-surface, #fff));
}

.teacher-directory-card__stats dt {
  color: var(--app-text, #081b3a);
  font-size: 14px;
  font-weight: 950;
}

.teacher-directory-card__stats dd {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  color: var(--app-muted, #53627a);
  font-size: 9px;
}

.teacher-directory-card__stats svg,
.teacher-directory-card__courses svg {
  width: 14px;
  fill: none;
  stroke: var(--home-v2-blue);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.teacher-directory-card__actions {
  display: grid;
  width: 100%;
  grid-template-columns: 44px 1fr;
  gap: 8px;
  margin-top: auto;
}

.teacher-directory-card__courses,
.teacher-directory-card__profile {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  text-decoration: none;
}

.teacher-directory-card__courses {
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 20%, var(--app-line, #e1e7f0));
  background: var(--app-surface, #fff);
}

.teacher-directory-card__profile {
  gap: 10px;
  background: linear-gradient(135deg, var(--home-v2-blue), var(--home-v2-deep));
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  box-shadow: 0 9px 22px color-mix(in srgb, var(--home-v2-blue) 18%, transparent);
}

.teacher-directory-card__profile span {
  transition: transform 180ms ease;
}

.teacher-directory-card__profile:hover span {
  transform: translateX(-3px);
}

.teacher-directory__empty {
  min-height: 270px;
}

.home-teachers__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 34px;
  padding: 22px 26px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 12%, #e0e6ef);
  border-radius: 22px;
  background: color-mix(in srgb, var(--home-v2-blue) 4%, #fff);
}

.home-teachers__footer a {
  padding: 13px 19px;
}

.home-teachers__state {
  display: grid;
  min-height: 300px;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 40px;
  border: 1px dashed color-mix(in srgb, var(--home-v2-blue) 26%, #dfe5ee);
  border-radius: 28px;
  background: color-mix(in srgb, var(--home-v2-blue) 3%, #fff);
  text-align: center;
}

.home-teachers__state > span:not(.home-teachers__loader) {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 16px;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, #fff);
  color: var(--home-v2-blue);
  font-size: 22px;
  font-weight: 950;
}

.home-teachers__state strong {
  color: var(--app-text, #081b3a);
  font-size: 20px;
}

.home-teachers__state p {
  margin: 0;
  color: var(--app-muted, #53627a);
}

.home-teachers__state button {
  margin-top: 8px;
  padding: 11px 18px;
}

.home-teachers__loader {
  width: 42px;
  height: 42px;
  border: 3px solid color-mix(in srgb, var(--home-v2-blue) 15%, #fff);
  border-top-color: var(--home-v2-blue);
  border-radius: 50%;
  animation: home-teachers-spin 800ms linear infinite;
}

@keyframes home-teachers-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .home-teachers__header { grid-template-columns: 1fr; align-items: start; }
  .home-teachers__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .teacher-directory__filters { grid-template-columns: minmax(220px, 1.4fr) 1fr auto; }
  .teacher-directory__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .home-teachers { padding: 56px 0; }
  .home-teachers__header { gap: 12px; margin-bottom: 24px; }
  .home-teachers__header h2 { font-size: clamp(30px, 8.5vw, 36px); }
  .home-teachers__grid { grid-template-columns: 1fr; }
  .home-teacher-card__visual,
  .home-teacher-card__visual img { min-height: 220px; height: 220px; }
  .home-teachers__footer { align-items: stretch; flex-direction: column; }
  .home-teachers__footer a { text-align: center; }
  .home-teachers--catalog { padding: 34px 0 68px; }
  .teacher-directory__header { margin-bottom: 26px; }
  .teacher-directory__header h1 { font-size: 34px; }
  .teacher-directory__filters { grid-template-columns: 1fr; padding: 10px; }
  .teacher-directory__summary { align-items: flex-start; flex-direction: column; gap: 3px; margin-top: 20px; }
  .teacher-directory__grid { grid-template-columns: 1fr; }
  .teacher-directory-card { display: grid; grid-template-columns: 82px minmax(0, 1fr); align-items: center; gap: 12px; padding: 14px; }
  .teacher-directory-card::before { display: none; }
  .teacher-directory-card__status { top: 10px; inset-inline-end: 10px; }
  .teacher-directory-card__portrait { width: 78px; height: 78px; margin: 0; }
  .teacher-directory-card__portrait > span { font-size: 23px; }
  .teacher-directory-card__content { margin: 0; padding-inline-end: 2px; text-align: start; }
  .teacher-directory-card__location { justify-content: flex-start; }
  .teacher-directory-card__description { min-height: 0; -webkit-line-clamp: 1; }
  .teacher-directory-card__stats,
  .teacher-directory-card__actions { grid-column: 1 / -1; }
  .teacher-directory-card__stats { margin: 4px 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .home-teacher-card,
  .home-teacher-card__visual img,
  .teacher-directory-card,
  .teacher-directory-card__profile span { transition: none; }
  .home-teachers__loader { animation: none; }
}

.handle-low-text {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border: 1px solid color-mix(in srgb, #d78a10 28%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, #fff7e6 80%, var(--app-surface, #fff));
  color: #9a5c00;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.5;
}

.handle-low-text i {
  font-size: 14px;
}
</style>
