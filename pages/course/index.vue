<script setup lang="ts">
import HomeCoursesSection from "~/components/home/v2/sections/HomeCoursesSection.vue";
import UniversityCoursesSection from "~/components/home/v2/sections/UniversityCoursesSection.vue";
import { useHomePage } from "~/features/HomePageFeature/composables/useHomePage";
import { CategoryIdEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const settingStore = useSettingStore();
const requestedTeacherId = Number(route.query.teacher_id);
const initialTeacherId = Number.isInteger(requestedTeacherId) && requestedTeacherId > 0
  ? requestedTeacherId
  : null;
const initialWord = typeof route.query.word === "string"
  ? route.query.word.trim().slice(0, 100)
  : "";
const { home, pending, loadCoursesByYear, loadGeneralCourses } = await useHomePage({
  initialTeacherId,
  initialWord,
});

const availableEducationCategories = computed(() => {
  const categories = settingStore.setting?.categories ?? [];
  return [CategoryIdEnum.BASIC, CategoryIdEnum.UNIVERSITY].filter((category) =>
    categories.includes(category),
  );
});
const requestedCategory = Number(route.query.category_id);
const accountCategory = Number(userStore.user?.category_id);
const selectedEducationCategory = ref<
  CategoryIdEnum.BASIC | CategoryIdEnum.UNIVERSITY
>(
  requestedCategory === CategoryIdEnum.UNIVERSITY ||
    (requestedCategory !== CategoryIdEnum.BASIC &&
      accountCategory === CategoryIdEnum.UNIVERSITY)
    ? CategoryIdEnum.UNIVERSITY
    : CategoryIdEnum.BASIC,
);

watch(
  availableEducationCategories,
  (categories) => {
    if (!categories.length || categories.includes(selectedEducationCategory.value)) return;
    selectedEducationCategory.value = categories[0] as
      | CategoryIdEnum.BASIC
      | CategoryIdEnum.UNIVERSITY;
  },
  { immediate: true },
);

watch(
  () => route.query.category_id,
  (value) => {
    const category = Number(value);
    if (
      (category === CategoryIdEnum.BASIC ||
        category === CategoryIdEnum.UNIVERSITY) &&
      availableEducationCategories.value.includes(category)
    ) {
      selectedEducationCategory.value = category;
    }
  },
);

watch(
  () => userStore.user?.category_id,
  (value) => {
    if (route.query.category_id !== undefined) return;
    const category = Number(value);
    if (
      category === CategoryIdEnum.UNIVERSITY &&
      availableEducationCategories.value.includes(category)
    ) {
      selectedEducationCategory.value = CategoryIdEnum.UNIVERSITY;
    }
  },
);

const selectEducationCategory = async (
  category: CategoryIdEnum.BASIC | CategoryIdEnum.UNIVERSITY,
) => {
  if (category === selectedEducationCategory.value) return;
  selectedEducationCategory.value = category;

  const {
    category_id: _categoryId,
    stage_id: _stageId,
    year_id: _yearId,
    education_type_id: _educationTypeId,
    university_id: _universityId,
    college_id: _collegeId,
    department_id: _departmentId,
    division_id: _divisionId,
    page: _page,
    ...query
  } = route.query;
  await router.replace({
    query: { ...query, category_id: String(category) },
  });
};

definePageMeta({ layout: "home-v2" });

const seoTitle = computed(() =>
  `${home.value.site.hasTeacherDirectory ? "اكتشف كورسات المنصة" : "اختار مرحلتك وابدأ كورسك"}${
    home.value.site.brandName ? ` | ${home.value.site.brandName}` : ""
  }`,
);
const seoDescription = computed(() =>
  home.value.site.hasTeacherDirectory
    ? `تصفّح كورسات المدرسين المتاحة على ${home.value.site.brandName || "المنصة"} واختر المحتوى المناسب لك.`
    : `اختار مرحلتك وابدأ كورسك. حدّد السنة الدراسية واكتشف الكورسات المناسبة لك على ${home.value.site.brandName || "المنصة"}.`,
);

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  robots: "index, follow, max-image-preview:large",
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
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
    class="home-v2 course-page"
    dir="rtl"
    :data-home-pending="pending ? 'true' : 'false'"
    :style="{
      '--home-v2-blue': home.site.colors.primary || '#28366c',
      '--home-v2-deep': home.site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${home.site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <main class="course-page__main">
      <header class="course-page__hero">
        <span class="course-page__hero-ring" aria-hidden="true" />
        <span class="course-page__hero-word" aria-hidden="true">COURSES</span>
        <div class="container course-page__hero-grid">
          <div class="course-page__hero-title">
            <span>{{ home.site.hasTeacherDirectory ? "مدرسون وكورسات في مكان واحد" : "كل المراحل والسنوات في مكان واحد" }}</span>
            <h1 v-if="home.site.hasTeacherDirectory">اختار مدرسك.<br /><em>وابدأ كورسك.</em></h1>
            <h1 v-else>اختار مرحلتك.<br /><em>وابدأ كورسك.</em></h1>
          </div>
          <p>
            <template v-if="home.site.hasTeacherDirectory">
              تصفّح كورسات المدرسين واختر المحتوى المناسب لك على
              {{ home.site.brandName || "المنصة" }}.
            </template>
            <template v-else>
              اختار مرحلتك وابدأ كورسك. حدّد السنة الدراسية، واكتشف الكورسات
              المناسبة لمسارك على {{ home.site.brandName || "المنصة" }}.
            </template>
          </p>
        </div>
      </header>

      <section
        v-if="availableEducationCategories.length > 1"
        class="course-category-switch"
        aria-labelledby="course-category-switch-title"
      >
        <div class="container course-category-switch__inner">
          <div>
            <span>نوع التعليم</span>
            <h2 id="course-category-switch-title">اختار مسار الكورسات</h2>
          </div>
          <div class="course-category-switch__options" role="group">
            <button
              type="button"
              :class="{ active: selectedEducationCategory === CategoryIdEnum.BASIC }"
              :aria-pressed="selectedEducationCategory === CategoryIdEnum.BASIC"
              @click="selectEducationCategory(CategoryIdEnum.BASIC)"
            >
              <b>01</b>
              <span>التعليم الأساسي</span>
            </button>
            <button
              type="button"
              :class="{ active: selectedEducationCategory === CategoryIdEnum.UNIVERSITY }"
              :aria-pressed="selectedEducationCategory === CategoryIdEnum.UNIVERSITY"
              @click="selectEducationCategory(CategoryIdEnum.UNIVERSITY)"
            >
              <b>02</b>
              <span>التعليم الجامعي</span>
            </button>
          </div>
        </div>
      </section>

      <HomeCoursesSection
        v-if="selectedEducationCategory === CategoryIdEnum.BASIC"
        :courses="home.courses"
        :teachers="home.teachers"
        :teacher-filter-enabled="home.site.hasTeacherDirectory"
        :initial-teacher-id="initialTeacherId"
        :initial-word="initialWord"
        :load-courses-by-year="loadCoursesByYear"
        :load-general-courses="loadGeneralCourses"
        catalog
      />
      <UniversityCoursesSection
        v-else
        :key="`university-${userStore.user?.id ?? 'guest'}`"
        :initial-teacher-id="initialTeacherId"
        :initial-word="initialWord"
      />
    </main>

  </div>
</template>

<style scoped>
.course-page,
.course-page > main {
  width: 100%;
  min-width: 0;
}

.course-page__main {
  padding-top: 86px;
}

.course-page__hero {
  position: relative;
  min-height: 335px;
  overflow: hidden;
  background: linear-gradient(115deg, color-mix(in srgb, var(--home-v2-blue) 82%, #06113d), var(--home-v2-blue));
  color: #fff;
}

.course-category-switch {
  border-bottom: 1px solid var(--home-v2-line);
  background: var(--home-v2-paper);
}

.course-category-switch__inner {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1fr);
  align-items: center;
  gap: 28px;
  padding-block: 22px;
}

.course-category-switch__inner > div:first-child > span {
  color: var(--home-v2-coral);
  font-size: 11px;
  font-weight: 900;
}

.course-category-switch h2 {
  margin: 3px 0 0;
  color: var(--home-v2-ink);
  font: 900 20px/1.35 var(--home-v2-heading);
}

.course-category-switch__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.course-category-switch__options button {
  display: flex;
  min-height: 58px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  color: var(--home-v2-ink);
  cursor: pointer;
  font-weight: 900;
  text-align: right;
}

.course-category-switch__options b {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--home-v2-line);
  color: var(--home-v2-blue);
  font-size: 12px;
}

.course-category-switch__options button.active {
  border-color: var(--home-v2-deep);
  background: var(--home-v2-deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--home-v2-coral);
}

.course-category-switch__options button.active b {
  border-color: rgb(255 255 255 / 30%);
  color: #fff;
}

.course-page__hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(60px, 9vw, 150px);
  min-height: 335px;
  padding-block: 58px;
}

.course-page__hero-title {
  justify-self: start;
  animation: course-hero-title .8s cubic-bezier(.2,.75,.25,1) both;
}

.course-page__hero-title > span {
  color: #ffd05e;
  font-size: 12px;
  font-weight: 900;
}

.course-page__hero h1 {
  margin: 22px 0 0;
  font: 900 clamp(48px, 5vw, 76px)/1.08 var(--home-v2-heading);
  letter-spacing: -.045em;
}

.course-page__hero h1 em {
  color: #ff7a61;
  font-style: normal;
}

.course-page__hero p {
  max-width: 390px;
  margin: 75px auto 0;
  color: rgb(255 255 255 / 64%);
  font-size: 15px;
  line-height: 1.95;
  animation: course-hero-copy .75s .18s ease both;
}

.course-page__hero-ring {
  position: absolute;
  top: -185px;
  left: -115px;
  width: 405px;
  height: 405px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
}

.course-page__hero-word {
  position: absolute;
  bottom: -13px;
  left: 4%;
  color: rgb(255 255 255 / 4%);
  font: 900 clamp(72px, 9vw, 132px)/1 var(--home-v2-heading);
  letter-spacing: -.06em;
  animation: course-hero-word 1s .25s ease both;
}

@keyframes course-hero-title {
  from { opacity: 0; transform: translateY(34px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes course-hero-copy {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes course-hero-word {
  from { opacity: 0; transform: translateX(-45px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 700px) {
  .course-page__main { padding-top: 47px; }
  .course-page__hero, .course-page__hero-grid { min-height: 280px; }
  .course-page__hero-grid { grid-template-columns: 1fr; align-content: center; gap: 10px; padding-block: 24px; }
  .course-page__hero-title { justify-self: stretch; }
  .course-page__hero-title > span { font-size: 10px; }
  .course-page__hero h1 { margin-top: 10px; font-size: clamp(30px, 8.5vw, 35px); line-height: 1.2; }
  .course-page__hero p { max-width: 330px; margin: 0; font-size: 12.5px; line-height: 1.7; }
  .course-page__hero-word { font-size: 44px; }
  .course-category-switch__inner { grid-template-columns: 1fr; gap: 14px; }
  .course-category-switch__options { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .course-page__hero-title, .course-page__hero p, .course-page__hero-word { animation: none; }
}
</style>
