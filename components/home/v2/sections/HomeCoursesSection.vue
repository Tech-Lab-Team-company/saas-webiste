<script setup lang="ts">
import type {
  HomeCourseTabKey,
  HomeCourseViewModel,
  HomeCoursesViewModel,
} from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  courses: HomeSectionState<HomeCoursesViewModel>;
  loadCoursesByYear: (
    stageId: number,
    yearId: number,
  ) => Promise<HomeSectionState<HomeCourseViewModel[]>>;
}>();

const selectedTabKey = ref<HomeCourseTabKey | null>(null);
const coursesByTab = ref<
  Partial<Record<HomeCourseTabKey, HomeSectionState<HomeCourseViewModel[]>>>
>({});
const loadingTabKey = ref<HomeCourseTabKey | null>(null);
const requestIds = ref<Partial<Record<HomeCourseTabKey, number>>>({});

const selectedTab = computed(
  () =>
    props.courses.data.tabs.find((tab) => tab.key === selectedTabKey.value) ??
    null,
);

const selectedCourses = computed<HomeSectionState<
  HomeCourseViewModel[]
> | null>(() => {
  if (!selectedTab.value) {
    return null;
  }

  return coursesByTab.value[selectedTab.value.key] ?? null;
});

const selectTab = async (tabKey: HomeCourseTabKey) => {
  const tab = props.courses.data.tabs.find((item) => item.key === tabKey);

  if (!tab || loadingTabKey.value === tab.key) {
    return;
  }

  selectedTabKey.value = tab.key;
  loadingTabKey.value = tab.key;
  const requestId = (requestIds.value[tab.key] ?? 0) + 1;
  requestIds.value[tab.key] = requestId;

  const result = await props.loadCoursesByYear(tab.stageId, tab.yearId);

  if (requestIds.value[tab.key] !== requestId) {
    return;
  }

  coursesByTab.value[tab.key] = result;

  if (loadingTabKey.value === tab.key) {
    loadingTabKey.value = null;
  }
};
</script>

<template>
  <section
    id="courses"
    class="section home-v2-courses"
    aria-labelledby="home-v2-courses-title"
  >
    <div class="container">
      <div class="home-v2-courses__heading">
        <div>
          <span class="section-tag">اختار نقطة البداية</span>
          <h2 id="home-v2-courses-title">
            ابدأ من صفك،<br /><em>وكمل بخطة واضحة.</em>
          </h2>
        </div>
        <p>
          كل صف له منهجه وسرعته. اختار مرحلتك علشان تشوف كورساتها ومراجعاتها
          فقط.
        </p>
      </div>

      <div class="home-v2-courses__panel">
        <div>
          <span>خطوتك الأولى</span>
          <h3 id="home-v2-stage-title">أنت في أنهي صف؟</h3>
          <p id="home-v2-stage-help">
            اختار صفك وهنعرض لك الكورسات المناسبة له فورًا.
          </p>
        </div>

        <div
          class="home-v2-courses__stages"
          role="group"
          aria-labelledby="home-v2-stage-title"
          aria-describedby="home-v2-stage-help"
        >
          <button
            v-for="(tab, index) in courses.data.tabs"
            :key="tab.key"
            type="button"
            :class="{ 'is-active': selectedTabKey === tab.key }"
            :aria-pressed="selectedTabKey === tab.key"
            aria-controls="home-v2-course-results"
            @click="selectTab(tab.key)"
          >
            <b aria-hidden="true">0{{ index + 1 }}</b>
            <span>{{ tab.label }}</span>
            <small v-if="loadingTabKey === tab.key">جاري التحميل</small>
          </button>
        </div>
      </div>

      <div
        id="home-v2-course-results"
        class="home-v2-courses__results"
        aria-live="polite"
      >
        <div v-if="!selectedTab" class="home-v2-courses__empty">
          <span aria-hidden="true">01</span>
          <div>
            <b>البداية من هنا</b>
            <h3>اختار صفك من فوق</h3>
            <p>
              هنظهر لك الكورسات المناسبة من غير ما نخلط لك مناهج باقي الصفوف.
            </p>
          </div>
        </div>

        <template v-else>
          <div class="home-v2-courses__result-head">
            <div>
              <span>المسار المختار</span>
              <h3>كورسات {{ selectedTab.label }}</h3>
            </div>
            <b v-if="selectedCourses"
              >{{ selectedCourses.data.length }} كورسات</b
            >
          </div>

          <div
            v-if="loadingTabKey === selectedTab.key"
            class="home-v2-courses__message"
            role="status"
          >
            <span>جاري التحميل</span>
            <h3>بنجهز لك كورسات {{ selectedTab.label }}</h3>
            <p>ثواني ونظهر لك المحتوى المتاح لسنتك.</p>
          </div>

          <div
            v-else-if="selectedCourses?.status === 'error'"
            class="home-v2-courses__message"
            role="alert"
          >
            <span>تعذر التحميل</span>
            <h3>لم نتمكن من عرض الكورسات الآن</h3>
            <p>{{ selectedCourses.error?.message }}</p>
            <button type="button" @click="selectTab(selectedTab.key)">
              حاول مرة أخرى
            </button>
          </div>

          <div
            v-else-if="selectedCourses?.status === 'empty'"
            class="home-v2-courses__message"
            role="status"
          >
            <span>لا توجد كورسات</span>
            <h3>لا توجد كورسات متاحة لـ {{ selectedTab.label }} حاليًا</h3>
            <p>ستظهر الكورسات والمراجعات هنا فور إتاحتها.</p>
          </div>

          <div v-else-if="selectedCourses" class="home-v2-courses__grid">
            <NuxtLink
              v-for="course in selectedCourses.data"
              :key="course.id"
              :to="course.route"
              class="home-v2-courses__card"
            >
              <div class="home-v2-courses__image">
                <NuxtImg
                  v-if="course.image"
                  :src="course.image.src"
                  :alt="course.image.alt || course.title"
                  width="680"
                  height="360"
                  loading="lazy"
                />
                <span v-else aria-hidden="true">📚</span>
              </div>
              <div class="home-v2-courses__card-content">
                <span>{{
                  course.sourceSubject?.title || selectedTab.label
                }}</span>
                <h3>{{ course.title }}</h3>
                <p v-if="course.description">{{ course.description }}</p>
                <div>
                  <small>{{ course.videosCount ?? 0 }} درس</small>
                  <b>{{
                    course.price !== null && course.price > 0
                      ? `${course.price} ${course.currency ?? ""}`
                      : "مجاني"
                  }}</b>
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>

      <NuxtLink
        :to="selectedTab ? `/course?year_id=${selectedTab.yearId}` : '/course'"
        class="home-v2-courses__link"
      >
        {{
          selectedTab
            ? `شاهد كل كورسات ${selectedTab.label}`
            : "عرض الكورسات الحالية"
        }}
        <span aria-hidden="true">←</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.home-v2-courses {
  background: var(--home-v2-paper);
}

.home-v2-courses__heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 60px;
  margin-bottom: 38px;
}

.home-v2-courses h2 {
  margin: 13px 0 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-courses h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-courses__heading > p,
.home-v2-courses__panel p,
.home-v2-courses__message p,
.home-v2-courses__empty p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-courses__panel {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 36px;
  padding: clamp(24px, 4vw, 46px);
  border: 1px solid var(--home-v2-line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 25px 65px -56px #06114799;
}

.home-v2-courses__panel > div:first-child > span,
.home-v2-courses__result-head span,
.home-v2-courses__message > span,
.home-v2-courses__empty b,
.home-v2-courses__card-content > span {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.home-v2-courses h3 {
  margin: 8px 0;
  font: 900 clamp(25px, 3vw, 37px) / 1.3 var(--home-v2-heading);
}

.home-v2-courses__stages {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.home-v2-courses__stages button {
  display: grid;
  min-height: 74px;
  grid-template-columns: 48px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  padding: 7px;
  border: 1px solid var(--home-v2-line);
  border-radius: 8px;
  background: var(--home-v2-cream);
  color: var(--home-v2-ink);
  cursor: pointer;
  text-align: right;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease, transform 0.2s ease;
}

.home-v2-courses__stages button:hover {
  border-color: var(--home-v2-blue);
  transform: translateY(-3px);
}

.home-v2-courses__stages button.is-active {
  border-color: var(--home-v2-deep);
  background: var(--home-v2-deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--home-v2-coral);
}

.home-v2-courses__stages b {
  display: grid;
  width: 48px;
  height: 48px;
  grid-row: 1 / 3;
  place-items: center;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-paper);
  color: var(--home-v2-blue);
  font: 900 13px var(--home-v2-heading);
}

.home-v2-courses__stages button.is-active b {
  border-color: #ffffff47;
  background: #ffffff24;
  color: #fff;
}

.home-v2-courses__stages span {
  font: 800 18px/1.45 var(--home-v2-heading);
}

.home-v2-courses__stages small {
  color: var(--home-v2-muted);
  font-size: 11px;
  font-weight: 800;
}

.home-v2-courses__stages button.is-active small {
  color: #ffffffb8;
}

.home-v2-courses__results {
  margin-top: 24px;
}

.home-v2-courses__empty,
.home-v2-courses__message {
  display: grid;
  min-height: 190px;
  align-content: center;
  gap: 8px;
  padding: clamp(26px, 4vw, 42px);
  border: 1px dashed #0867d466;
  border-radius: 14px;
  background: linear-gradient(135deg, #eef5ff, #fbfcff);
}

.home-v2-courses__empty {
  grid-template-columns: auto minmax(0, 620px);
  align-items: center;
  gap: 22px;
}

.home-v2-courses__empty > span {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 1px solid var(--home-v2-line);
  background: #fff;
  color: var(--home-v2-deep);
  font: 900 14px var(--home-v2-heading);
}

.home-v2-courses__empty h3,
.home-v2-courses__message h3 {
  margin: 2px 0;
  font-size: clamp(22px, 3vw, 31px);
}

.home-v2-courses__result-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.home-v2-courses__result-head h3 {
  margin: 3px 0 0;
}

.home-v2-courses__result-head > b {
  flex: 0 0 auto;
  padding: 5px 10px;
  border: 1px solid var(--home-v2-line);
  border-radius: 999px;
  color: var(--home-v2-blue);
  font-size: 12px;
}

.home-v2-courses__message {
  position: relative;
  overflow: hidden;
}

.home-v2-courses__message button {
  width: max-content;
  min-height: 42px;
  margin-top: 8px;
  padding: 0 16px;
  border: 0;
  border-radius: 5px;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}

.home-v2-courses__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.home-v2-courses__card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 12px;
  background: #fff;
  color: var(--home-v2-ink);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.home-v2-courses__card:hover {
  border-color: var(--home-v2-blue);
  box-shadow: 0 18px 32px -26px #06114773;
  transform: translateY(-4px);
}

.home-v2-courses__image {
  display: grid;
  aspect-ratio: 1.85;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--home-v2-blue-light), #f4f8ff);
  color: var(--home-v2-blue);
  font-size: 34px;
}

.home-v2-courses__image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-v2-courses__card-content {
  display: flex;
  min-height: 176px;
  flex-direction: column;
  padding: 18px;
}

.home-v2-courses__card-content h3 {
  display: -webkit-box;
  margin: 8px 0 7px;
  overflow: hidden;
  font-size: 18px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-courses__card-content p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--home-v2-muted);
  font-size: 13px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-courses__card-content > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--home-v2-line);
  color: var(--home-v2-muted);
}

.home-v2-courses__card-content small {
  font-size: 12px;
}

.home-v2-courses__card-content > div b {
  color: var(--home-v2-deep);
  font: 900 13px var(--home-v2-heading);
}

.home-v2-courses__link {
  display: inline-flex;
  gap: 9px;
  margin-top: 25px;
  color: var(--home-v2-blue);
  font-weight: 800;
}

@media (max-width: 820px) {
  .home-v2-courses__heading,
  .home-v2-courses__panel {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-v2-courses__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 570px) {
  .home-v2-courses__stages,
  .home-v2-courses__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-courses__stages button {
    min-height: 92px;
  }

  .home-v2-courses__empty {
    grid-template-columns: 1fr;
  }

  .home-v2-courses__empty > span {
    display: none;
  }

  .home-v2-courses__result-head {
    align-items: start;
    flex-direction: column;
  }
}
</style>
