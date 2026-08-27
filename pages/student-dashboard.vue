<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";
import CoursesParams from "~/features/FetchCourses/Core/Params/courses_params";
import type CoursesModel from "~/features/FetchCourses/Data/models/courses_model";
import CoursesController from "~/features/FetchCourses/presentation/controllers/courses_controller";
import { useUserStore } from "~/stores/user";
import { useStudentDashboardMotion } from "~/composables/useStudentDashboardMotion";

definePageMeta({
  name: "student-dashboard",
  middleware: ["verified-student"],
});

useHead({
  title: "الرئيسية | مساحة الطالب",
  htmlAttrs: { lang: "ar", dir: "rtl" },
});

const router = useRouter();
const userStore = useUserStore();
const courses = ref<CoursesModel[]>([]);
const isLoading = ref(true);
const coursesError = ref("");
const { animateCourseCards, animateSummaryScore } = useStudentDashboardMotion();

const user = computed(() => userStore.user);
const studentName = computed(
  () =>
    user.value?.name ||
    [user.value?.firstName, user.value?.lastName].filter(Boolean).join(" ") ||
    "يا بطل",
);
const educationLabel = computed(() => {
  const info = user.value?.userInfo;
  return (
    info?.year_title ||
    info?.stage_title ||
    info?.university_title ||
    "مساحتك التعليمية"
  );
});
const educationDetails = computed(() => {
  const info = user.value?.userInfo;
  return [
    info?.basic_education_type_title || info?.university_education_type_title,
    info?.stage_title,
    info?.year_title,
    info?.college_title,
    info?.department_title,
  ]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .join(" · ");
});
const today = computed(() =>
  new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date()),
);
const courseProgress = (course?: CoursesModel): number => {
  if (!course) return 0;

  const value = Number(course.percentage ?? course.progress ?? 0);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
};
const displayCourseProgress = (course?: CoursesModel): string =>
  String(Math.round(courseProgress(course)));
const featuredCourse = computed(() =>
  courses.value.find((course) => course.is_last === true),
);
const completedCourses = computed(
  () => courses.value.filter((course) => courseProgress(course) >= 100).length,
);

const courseImage = (course: CoursesModel) => {
  const image = course?.image as CoursesModel["image"] | string | undefined;
  return typeof image === "string" ? image : image?.img;
};

const courseRoute = (courseId: number) => ({
  name: "student-dashboard-course-id",
  params: { id: courseId },
});

const fetchStudentCourses = async () => {
  isLoading.value = true;
  coursesError.value = "";

  try {
    const categoryId = String(user.value?.category_id || "2");
    const state = await CoursesController.getInstance().FetchCourses(
      new CoursesParams(categoryId),
    );
    courses.value = state.value.data ?? [];

    if (state.value.error) {
      coursesError.value =
        state.value.error.title || "تعذر تحميل الكورسات الآن";
    }
  } catch {
    coursesError.value = "تعذر تحميل الكورسات الآن";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.apiToken) {
    await router.replace("/loginhome");
    return;
  }

  await fetchStudentCourses();
  await animateCourseCards();
  await animateSummaryScore();
});
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <div class="prfile-home profile-dashboard student-dashboard-shell">
      <ProfileSidebar class="profile-dashboard-sidebar" />

      <div class="profile-dashboard-workspace">
        <header class="profile-dashboard-topbar">
          <div class="profile-topbar-copy">
            <strong>مساحة الطالب</strong>
            <span>كل محتواك الدراسي وتقدّمك في مكان واحد</span>
          </div>
          <div class="profile-topbar-status"><span />{{ educationLabel }}</div>
        </header>

        <main
          id="student-content"
          class="profile-dashboard-main student-dashboard-main"
        >
          <section class="dashboard-heading">
            <div>
              <span class="dashboard-date"><i />{{ today }}</span>
              <h1>
                أهلًا، {{ studentName }}
                <span class="welcome-wave" role="img" aria-label="مرحبًا">
                  <img width="65"  src="/images/waving-hand.png" alt="مرحبًا" />
                </span>
              </h1>
              <p v-if="educationDetails">
                هنا ستجد المحتوى المناسب لـ {{ educationDetails }}.
              </p>
              <p v-else>ابدأ رحلتك التعليمية وتابع كورساتك وتقدّمك من هنا.</p>
            </div>
            <NuxtLink class="browse-button" :to="{ name: 'course' }"
              >استكشف الكورسات <span>←</span></NuxtLink
            >
          </section>

          <div class="overview-grid">
            <section v-if="featuredCourse" class="continue-panel">
              <div class="featured-content">
                <span class="eyebrow"><i /> تابع من حيث توقفت</span>
                <h2>{{ featuredCourse.title }}</h2>
                <div class="featured-meta">
                  <span>▶ {{ featuredCourse.course_videos }} فيديو</span>
                  <span>▤ {{ featuredCourse.course_docs }} ملف</span>
                  <span>♪ {{ featuredCourse.course_records }} تسجيل صوتي</span>
                  <span v-if="featuredCourse.teacher?.name"
                    >♙ {{ featuredCourse.teacher.name }}</span
                  >
                </div>
                <div class="featured-progress">
                  <div>
                    <span>نسبة الإنجاز</span
                    ><b>{{Math.round(courseProgress(featuredCourse)) }}%</b>
                  </div>
                  <div class="progress">
                    <i
                      :style="{
                        width: `${courseProgress(featuredCourse)}%`,
                      }"
                    />
                  </div>
                </div>
                <NuxtLink :to="courseRoute(featuredCourse.id)"
                  >متابعة التعلّم <span>←</span></NuxtLink
                >
              </div>
              <div
                class="featured-art"
                :class="{ 'has-image': courseImage(featuredCourse) }"
              >
                <img
                  v-if="courseImage(featuredCourse)"
                  :src="courseImage(featuredCourse)"
                  :alt="featuredCourse.image?.alt || featuredCourse.title"
                />
                <template v-else
                  ><strong>{{ featuredCourse.title?.charAt(0) || "ك" }}</strong
                  ><small>{{ educationLabel }}</small></template
                >
              </div>
            </section>

            <section
              v-else-if="isLoading"
              class="featured-loader"
              aria-label="جارٍ تحميل بيانات الطالب"
            >
              <span /><span /><span />
            </section>

            <section v-else-if="courses.length" class="empty-feature">
              <span class="empty-icon">▶</span>
              <div>
                <small>ابدأ التعلّم</small>
                <h2>لم تبدأ أي كورس بعد</h2>
                <p>اختر أحد كورساتك، وبعد البدء سيظهر آخر كورس هنا تلقائيًا.</p>
              </div>
              <NuxtLink :to="courseRoute(courses[0].id)">ابدأ أول كورس ←</NuxtLink>
            </section>

            <section v-else class="empty-feature">
              <span class="empty-icon">▤</span>
              <div>
                <small>ابدأ من هنا</small>
                <h2>لا توجد كورسات مسجلة</h2>
                <p>
                  {{
                    coursesError || "اختر الكورس المناسب لك وابدأ رحلة التعلّم."
                  }}
                </p>
              </div>
              <NuxtLink :to="{ name: 'course' }">استعرض الكورسات ←</NuxtLink>
            </section>

            <aside class="study-summary">
              <div class="summary-head"><span>ملخص التعلّم</span><i>↗</i></div>
              <div class="summary-score">
                <div
                  class="score-ring"
                  :data-score="courseProgress(featuredCourse)"
                  :style="{
                    '--score': `${courseProgress(featuredCourse)}%`,
                  }"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuenow="Math.round(courseProgress(featuredCourse))"
                  :aria-label="`نسبة تقدم الكورس ${displayCourseProgress(featuredCourse)} بالمائة`"
                >
                  <span>
                    <span class="score-ring__value">{{
                      displayCourseProgress(featuredCourse)
                    }}</span><small>%</small>
                  </span>
                </div>
                <div>
                  <b>{{ completedCourses ? "أداء رائع!" : "واصل التقدّم" }}</b
                  ><small>تقدم آخر كورس</small>
                </div>
              </div>
              <div class="summary-stats">
                <div>
                  <span>▤</span>
                  <p>
                    <b class="summary-stat-value" :data-count="courses.length">{{ courses.length }}</b
                    ><small>كورسات مسجلة</small>
                  </p>
                </div>
                <div>
                  <span>✓</span>
                  <p>
                    <b class="summary-stat-value" :data-count="completedCourses">{{ completedCourses }}</b
                    ><small>كورسات مكتملة</small>
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <section class="courses-section">
            <div class="section-head">
              <div>
                <span class="section-kicker">المحتوى التعليمي</span>
                <h2>كورساتي</h2>
                <p>تابع جميع الكورسات المرتبطة بحسابك</p>
              </div>
              <NuxtLink :to="{ name: 'profilecourse' }"
                >عرض كل الكورسات <span>←</span></NuxtLink
              >
            </div>

            <div
              v-if="isLoading"
              class="loading-grid"
              aria-label="جارٍ تحميل الكورسات"
            >
              <span v-for="item in 3" :key="item" />
            </div>
            <div v-else-if="courses.length" class="course-grid">
              <ProfileStudentCourseCard
                v-for="course in courses.slice(0, 6)"
                :key="course.id"
                class="course-card"
                :to="courseRoute(course.id)"
                :title="course.title"
                :image="courseImage(course)"
                :image-alt="course.image?.alt || course.title"
                :subject="course.subject?.title || educationLabel"
                :teacher-name="course.teacher?.name"
                :description="course.subtitle"
                :video-count="course.course_videos"
                :document-count="course.course_docs"
                :audio-count="course.course_records"
                :progress="courseProgress(course)"
                :is-last="course.is_last"
              />
            </div>
            <div v-else class="empty-list">
              <span>▤</span><b>لا توجد كورسات مرتبطة بحسابك حاليًا</b
              ><NuxtLink :to="{ name: 'course' }">تصفح الكورسات</NuxtLink>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>

<style scoped>
.student-dashboard-main {
  --navy: var(--profile-primary, var(--primary-color, #28366c));
  --primary: var(--profile-secondary, var(--secondary-color, #3a3e7e));
  --primary-soft: var(--profile-secondary-soft, color-mix(in srgb, var(--primary) 11%, var(--profile-surface, white)));
  --muted: var(--profile-muted, #6c7890);
  --border: var(--profile-border, #e5eaf2);
  width: min(1240px, calc(100% - 56px));
  padding-top: 38px;
}
.dashboard-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 30px;
}
.dashboard-date {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}
.dashboard-date i,
.eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2eb67d;
  box-shadow: 0 0 0 4px #2eb67d18;
}
.dashboard-heading h1 {
  margin: 7px 0 2px;
  color: var(--profile-ink);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.35;
  display: flex;
  align-items: center;
  gap: 12px;
}
.welcome-wave {
  display: inline-block;
  transform-origin: 72% 72%;
  animation: welcome-wave 2s ease-in-out infinite;
  will-change: transform;
}
.dashboard-heading:hover .welcome-wave {
  animation-duration: 1.45s;
}
.dashboard-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}
.browse-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  gap: 18px;
  padding: 0 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--profile-ink);
  background: var(--profile-surface);
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 25px #17315e08;
  transition: 0.2s ease;
}
.browse-button:hover {
  border-color: color-mix(in srgb, var(--primary) 38%, white);
  color: var(--primary);
  transform: translateY(-2px);
}
.overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 22px;
  margin-bottom: 38px;
}
.continue-panel {
  position: relative;
  display: grid;
  min-height: 315px;
  grid-template-columns: minmax(0, 1.2fr) minmax(220px, 0.8fr);
  gap: 32px;
  overflow: hidden;
  padding: 36px 38px;
  border: 1px solid color-mix(in srgb, var(--primary) 45%, var(--navy));
  border-radius: 18px;
  color: #fff;
  background: radial-gradient(circle at 78% 15%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 35%),
    linear-gradient(135deg, var(--navy), color-mix(in srgb, var(--navy) 68%, var(--primary)));
  box-shadow: 0 20px 48px color-mix(in srgb, var(--navy) 18%, transparent);
}
.continue-panel::after {
  position: absolute;
  inset: auto -70px -110px auto;
  width: 240px;
  height: 240px;
  border: 1px solid #ffffff10;
  border-radius: 50%;
  content: "";
}
.featured-content {
  position: relative;
  z-index: 2;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in srgb, var(--primary) 38%, white);
  font-size: 12px;
  font-weight: 800;
}
.eyebrow i {
  background: color-mix(in srgb, var(--primary) 68%, white);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--primary) 18%, transparent);
}
.continue-panel h2 {
  display: -webkit-box;
  overflow: hidden;
  margin: 12px 0 14px;
  font-size: clamp(23px, 2.2vw, 33px);
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: color-mix(in srgb, var(--navy) 20%, white);
  font-size: 12px;
}
.featured-progress {
  width: min(480px, 100%);
  margin-top: 23px;
}
.featured-progress > div:first-child {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: color-mix(in srgb, var(--navy) 20%, white);
  font-size: 12px;
}
.featured-progress b {
  color: #fff;
}
.progress {
  height: 6px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--border);
}
.progress i {
  display: block;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 58%, white));
}
.continue-panel .progress {
  background: #ffffff1c;
}
.continue-panel a {
  align-self: flex-start;
  display: inline-flex;
  gap: 16px;
  margin-top: 23px;
  padding: 12px 20px;
  border-radius: 10px;
  color: var(--navy);
  background: #fff;
  font-weight: 800;
  text-decoration: none;
}
.featured-art {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 235px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #ffffff1c;
  border-radius: 14px;
  background: #ffffff0d;
}
.featured-art strong {
  font-size: 64px;
}
.featured-art small {
  color: color-mix(in srgb, var(--primary) 34%, white);
}
.featured-art img {
  width: 100%;
  height: 100%;
  min-height: 235px;
  object-fit: cover;
}
.study-summary {
  padding: 23px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--profile-surface);
  box-shadow: 0 15px 38px color-mix(in srgb, var(--navy) 6%, transparent);
}
.summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--profile-ink);
  font-weight: 800;
}
.summary-head i {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 8px;
  color: var(--primary);
  background: var(--primary-soft);
  font-style: normal;
}
.summary-score {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 23px 0;
  border-bottom: 1px solid var(--border);
}
.score-ring {
  --score: 0%;
  display: grid;
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--primary) var(--score), var(--border) 0);
}
.score-ring::before {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--profile-surface);
  content: "";
}
.score-ring > span {
  position: absolute;
  color: var(--profile-ink);
  font-size: 21px;
  font-weight: 900;
}
.score-ring small {
  font-size: 10px;
}
.summary-score > div:last-child {
  display: flex;
  flex-direction: column;
}
.summary-score b {
  color: var(--profile-ink);
  font-size: 14px;
}
.summary-score small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
}
.summary-stats {
  display: grid;
  gap: 14px;
  padding-top: 19px;
}
.summary-stats > div {
  display: flex;
  align-items: center;
  gap: 11px;
}
.summary-stats > div > span {
  display: grid;
  width: 37px;
  height: 37px;
  place-items: center;
  border-radius: 10px;
  color: var(--primary);
  background: var(--primary-soft);
  font-weight: 900;
}
.summary-stats p {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.summary-stats b {
  color: var(--profile-ink);
  font-size: 17px;
  line-height: 1;
}
.summary-stats small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 10px;
}
.featured-loader {
  display: flex;
  min-height: 315px;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 40px;
  border-radius: 18px;
  background: var(--profile-surface-raised);
}
.featured-loader span {
  height: 16px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--profile-surface), var(--profile-surface-raised), var(--profile-surface));
  background-size: 200%;
  animation: loading 1.3s infinite;
}
.featured-loader span:nth-child(1) {
  width: 25%;
}
.featured-loader span:nth-child(2) {
  width: 70%;
  height: 38px;
}
.featured-loader span:nth-child(3) {
  width: 48%;
}
.empty-feature {
  display: flex;
  min-height: 315px;
  align-items: center;
  gap: 20px;
  padding: 34px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--profile-surface);
}
.empty-feature .empty-icon {
  display: grid;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  place-items: center;
  border-radius: 16px;
  color: var(--primary);
  background: var(--primary-soft);
  font-size: 25px;
}
.empty-feature h2 {
  margin: 5px 0;
  color: var(--profile-ink);
}
.empty-feature p {
  margin: 0;
  color: var(--muted);
}
.empty-feature a {
  margin-right: auto;
  color: var(--profile-on-action);
  background: var(--primary);
  padding: 11px 15px;
  text-decoration: none;
  white-space: nowrap;
}
.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}
.section-kicker {
  color: var(--primary);
  font-size: 11px;
  font-weight: 800;
}
.section-head h2 {
  margin: 2px 0 0;
  color: var(--profile-ink);
  font-size: 27px;
}
.section-head p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.section-head > a {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  border-radius: 9px;
  color: var(--primary);
  background: var(--primary-soft);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}
.course-grid,
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.course-grid {
  perspective: 1200px;
}
.loading-grid span {
  height: 400px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: linear-gradient(100deg, var(--profile-surface), var(--profile-surface-raised), var(--profile-surface));
  background-size: 200%;
  animation: loading 1.3s infinite;
}
.empty-list {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px dashed var(--border);
  color: var(--profile-ink);
  background: var(--profile-surface);
}
.empty-list > span {
  color: var(--primary);
  font-size: 27px;
}
.empty-list > a {
  color: var(--primary);
  font-weight: 800;
  text-decoration: none;
}
@keyframes loading {
  to {
    background-position: -200% 0;
  }
}
@keyframes welcome-wave {
  0%, 55%, 100% {
    transform: rotate(0deg) scale(1);
  }
  8% {
    transform: rotate(18deg) scale(1.10);
  }
  16% {
    transform: rotate(-10deg) scale(1.10);
  }
  24% {
    transform: rotate(16deg) scale(1.10);
  }
  32% {
    transform: rotate(-7deg) scale(1.08);
  }
  40% {
    transform: rotate(10deg) scale(1.06);
  }
  48% {
    transform: rotate(0deg) scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .welcome-wave {
    animation: none;
  }
}
@media (max-width: 1180px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  .study-summary {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 20px;
  }
  .summary-score {
    padding: 0 22px;
    border: 0;
    border-inline: 1px solid var(--border);
  }
  .summary-stats {
    grid-template-columns: repeat(2, 140px);
    padding: 0;
  }
  .course-grid,
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 820px) {
  .student-dashboard-main {
    width: min(100% - 28px, 680px);
    padding-top: 28px;
  }
  .browse-button {
    display: none;
  }
  .continue-panel {
    grid-template-columns: 1fr;
    padding: 27px;
  }
  .featured-art {
    display: none;
  }
  .study-summary {
    display: block;
  }
  .summary-score {
    margin-top: 15px;
    padding: 18px 0;
    border: 0;
    border-block: 1px solid var(--border);
  }
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
    padding-top: 18px;
  }
  .course-grid,
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .dashboard-heading h1 {
    font-size: 26px;
  }
  .dashboard-heading p {
    font-size: 12px;
  }
  .section-head p {
    display: none;
  }
  .continue-panel {
    min-height: 290px;
  }
  .empty-feature {
    min-height: 260px;
    flex-direction: column;
    align-items: flex-start;
  }
  .empty-feature a {
    margin-right: 0;
  }
}
</style>
