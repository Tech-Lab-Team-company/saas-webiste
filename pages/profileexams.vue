<script setup lang="ts">
import ProfileSidebar from "~/components/Profile/ProfileSidebar.vue";
import CoursesParams from "~/features/FetchCourses/Core/Params/courses_params";
import type CoursesModel from "~/features/FetchCourses/Data/models/courses_model";
import CoursesController from "~/features/FetchCourses/presentation/controllers/courses_controller";
import FetchMyExamsParams from "~/features/FetchMyExams/Core/Params/fetch_my_exams_params";
import type MyExamModel from "~/features/FetchMyExams/Data/models/my_exam_model";
import MyExamsResource from "~/features/FetchMyExams/Data/models/my_exams_resource";
import FetchMyExamsController from "~/features/FetchMyExams/presentation/controllers/fetch_my_exams_controller";
import { useUserStore } from "~/stores/user";
import {
  allowsMultipleExamAttempts,
  hasCompletedExamAttempt,
  isExamAttemptLocked,
} from "~/utils/examAttempts";

definePageMeta({
  name: "profileexams",
  middleware: ["verified-student"],
});

useHead({
  title: "اختباراتي | مساحة الطالب",
  htmlAttrs: { lang: "ar", dir: "rtl" },
});

const userStore = useUserStore();
const examsController = FetchMyExamsController.getInstance();
const coursesController = CoursesController.getInstance();

const exams = ref(new MyExamsResource([], []));
const courses = ref<CoursesModel[]>([]);
const courseFilterSelect = ref<HTMLSelectElement | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const selectedCourseId = ref("");
const { isOpen, isExpired, isUpcoming } = useExamAvailabilityClock();

const attendedExams = computed(() =>
  exams.value.lastExams.filter((exam) => exam.attended),
);
const availableExams = computed(() =>
  exams.value.currentExams.filter(
    (exam) => isOpen(exam) && !isExamAttemptLocked(exam),
  ),
);
const averageScore = computed(() => {
  if (!attendedExams.value.length) return 0;
  const total = attendedExams.value.reduce(
    (sum, exam) => sum + examPercentage(exam),
    0,
  );
  return Math.round(total / attendedExams.value.length);
});

const examPercentage = (exam: MyExamModel) => {
  if (!exam.examMark) return 0;
  return Math.max(0, Math.min(100, Math.round((exam.mark / exam.examMark) * 100)));
};

const formatDate = (value: string) => {
  if (!value) return "غير محدد";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTime = (value: string) => {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const examCourseId = (exam: MyExamModel) =>
  exam.courseId ||
  (selectedCourseId.value ? Number(selectedCourseId.value) : null);

const examRoute = (exam: MyExamModel) => {
  if (!isOpen(exam) || isExamAttemptLocked(exam)) return null;
  const courseId = examCourseId(exam);
  if (!courseId) return null;
  return {
    name: "course-id-exam",
    params: { id: courseId, exam: exam.id },
  };
};

const canRepeatExam = (exam: MyExamModel) =>
  isOpen(exam) &&
  hasCompletedExamAttempt(exam) &&
  allowsMultipleExamAttempts(exam);

const loadCourses = async () => {
  const categoryId = String(userStore.user?.category_id || "2");
  const state = await coursesController.FetchCourses(new CoursesParams(categoryId));
  courses.value = state.value.data ?? [];
};

const loadExams = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const state = await examsController.fetchMyExams(
      new FetchMyExamsParams(selectedCourseId.value || null),
    );
    if (state.value.data) {
      exams.value = state.value.data;
    } else {
      exams.value = new MyExamsResource([], []);
      errorMessage.value = state.value.error?.title || "تعذر تحميل الاختبارات الآن.";
    }
  } catch {
    exams.value = new MyExamsResource([], []);
    errorMessage.value = "تعذر تحميل الاختبارات الآن. حاول مرة أخرى.";
  } finally {
    isLoading.value = false;
  }
};

const applyCourseFilter = async () => {
  await loadExams();
};

const focusCourseFilter = () => {
  courseFilterSelect.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  courseFilterSelect.value?.focus({ preventScroll: true });
};

onMounted(async () => {
  await loadCourses();
  await loadExams();
});
</script>

<template>
  <div class="profile-page profile-redesign-page" dir="rtl">
    <div class="prfile-home profile-dashboard">
      <ProfileSidebar class="profile-dashboard-sidebar" />

      <div class="profile-dashboard-workspace">
        <header class="profile-dashboard-topbar">
          <div class="profile-topbar-copy">
            <strong>مساحة الطالب</strong>
            <span>مواعيد اختباراتك ونتائجك في مكان واحد</span>
          </div>
          <div class="profile-topbar-status"><span />اختباراتي</div>
        </header>

        <main class="profile-dashboard-main exams-dashboard-main">
          <section class="exams-heading">
            <div>
              <span class="exams-kicker">التقييمات والاختبارات</span>
              <h1>اختباراتي</h1>
              <p>تابع الاختبارات المتاحة وراجع نتائج إجاباتك السابقة.</p>
            </div>

            <label class="course-filter">
              <span>تصفية حسب الكورس</span>
              <select
                ref="courseFilterSelect"
                v-model="selectedCourseId"
                @change="applyCourseFilter"
              >
                <option value="">جميع الكورسات</option>
                <option v-for="course in courses" :key="course.id" :value="String(course.id)">
                  {{ course.title }}
                </option>
              </select>
            </label>
          </section>

          <section class="exam-statistics" aria-label="ملخص الاختبارات">
            <article>
              <span class="pi pi-bolt" />
              <div><b>{{ availableExams.length }}</b><small>اختبار متاح</small></div>
            </article>
            <article>
              <span class="pi pi-check-circle" />
              <div><b>{{ exams.lastExams.length }}</b><small>اختبار سابق</small></div>
            </article>
            <article>
              <span class="pi pi-chart-line" />
              <div><b>{{ averageScore }}%</b><small>متوسط النتائج</small></div>
            </article>
          </section>

          <div v-if="isLoading" class="exam-loading" aria-label="جارٍ تحميل الاختبارات">
            <span v-for="item in 3" :key="item" />
          </div>

          <section v-else-if="errorMessage" class="exam-state exam-state--error">
            <span class="pi pi-exclamation-circle" />
            <h2>تعذر تحميل الاختبارات</h2>
            <p>{{ errorMessage }}</p>
            <button type="button" @click="loadExams">إعادة المحاولة</button>
          </section>

          <template v-else>
            <section class="exam-section">
              <header class="exam-section__heading">
                <div>
                  <span>متاح لك الآن</span>
                  <h2>الاختبارات</h2>
                </div>
                <b>{{ exams.currentExams.length }}</b>
              </header>

              <div v-if="exams.currentExams.length" class="current-exams-grid">
                <article
                  v-for="exam in exams.currentExams"
                  :key="exam.id"
                  class="current-exam-card"
                  :class="{
                    'current-exam-card--finished': isExamAttemptLocked(exam),
                    'current-exam-card--expired': isExpired(exam),
                    'current-exam-card--upcoming': isUpcoming(exam),
                    'current-exam-card--repeatable': canRepeatExam(exam),
                  }"
                >
                  <div class="exam-card__topline">
                    <span v-if="isExamAttemptLocked(exam)" class="exam-status--finished">
                      <i class="pi pi-check" /> تم الانتهاء
                    </span>
                    <span v-else-if="isExpired(exam)" class="exam-status--unavailable">
                      <i class="pi pi-calendar-times" /> انتهى الموعد
                    </span>
                    <span v-else-if="isUpcoming(exam)" class="exam-status--unavailable exam-status--upcoming">
                      <i class="pi pi-clock" /> لم يبدأ بعد
                    </span>
                    <span v-else-if="canRepeatExam(exam)" class="exam-status--repeatable">
                      <i class="pi pi-refresh" /> متاح لمحاولة أخرى
                    </span>
                    <span v-else><i /> متاح الآن</span>
                    <small>{{ exam.subject?.title || "اختبار عام" }}</small>
                  </div>
                  <h3>{{ exam.title }}</h3>
                  <div class="exam-schedule">
                    <span><i class="pi pi-calendar" />{{ formatDate(exam.date || exam.startTime) }}</span>
                    <span><i class="pi pi-clock" />{{ formatTime(exam.startTime) }} — {{ formatTime(exam.endTime) }}</span>
                  </div>
                  <div class="exam-meta">
                    <span><b>{{ exam.numberOfQuestions }}</b> سؤال</span>
                    <span><b>{{ exam.duration || "—" }}</b> دقيقة</span>
                    <span><b>{{ exam.examMark }}</b> درجة</span>
                  </div>
                  <p v-if="canRepeatExam(exam)" class="exam-attempt-note">
                    يمكنك الرجوع إلى الامتحان وتعديل إجاباتك ثم إرسالها مرة أخرى.
                  </p>
                  <button
                    v-if="isExamAttemptLocked(exam)"
                    type="button"
                    class="exam-finished-action"
                    disabled
                    aria-label="تم إنهاء هذا الاختبار ولا يمكن فتحه مرة أخرى"
                  >
                    <i class="pi pi-lock" /> تم إنهاء الاختبار
                  </button>
                  <button
                    v-else-if="!isOpen(exam)"
                    type="button"
                    class="exam-finished-action exam-unavailable-action"
                    disabled
                  >
                    <i :class="isExpired(exam) ? 'pi pi-calendar-times' : 'pi pi-clock'" />
                    {{ isExpired(exam) ? "انتهى موعد الاختبار" : "الاختبار لم يبدأ بعد" }}
                  </button>
                  <NuxtLink v-else-if="examRoute(exam)" :to="examRoute(exam)!">
                    {{ canRepeatExam(exam) ? "العودة وتعديل الإجابات" : "ابدأ الاختبار" }}
                    <span>←</span>
                  </NuxtLink>
                  <button
                    v-else
                    type="button"
                    class="exam-route-fallback"
                    @click="focusCourseFilter"
                  >
                    اختر الكورس للبدء <span>←</span>
                  </button>
                </article>
              </div>

              <div v-else class="exam-state exam-state--compact">
                <span class="pi pi-calendar-times" />
                <h3>لا توجد اختبارات حالية</h3>
                <p>سنُظهر لك الاختبارات هنا فور إتاحتها.</p>
              </div>
            </section>

            <section class="exam-section exam-section--history">
              <header class="exam-section__heading">
                <div>
                  <span>سجل الأداء</span>
                  <h2>الاختبارات السابقة</h2>
                </div>
                <b>{{ exams.lastExams.length }}</b>
              </header>

              <div v-if="exams.lastExams.length" class="exam-history-list">
                <article v-for="exam in exams.lastExams" :key="exam.id" class="exam-result-card">
                  <div
                    class="result-score"
                    :class="{ 'result-score--absent': !exam.attended }"
                    :style="{ '--exam-score': `${exam.attended ? examPercentage(exam) : 0}%` }"
                  >
                    <div>
                      <b>{{ exam.attended ? `${examPercentage(exam)}%` : "—" }}</b>
                      <small>{{ exam.attended ? "النتيجة" : "لم يحضر" }}</small>
                    </div>
                  </div>

                  <div class="result-content">
                    <div class="exam-card__topline">
                      <span>{{ exam.subject?.title || "اختبار عام" }}</span>
                      <small>{{ formatDate(exam.date) }}</small>
                    </div>
                    <h3>{{ exam.title }}</h3>
                    <p v-if="exam.attended">حصلت على {{ exam.mark }} من {{ exam.examMark }} درجة.</p>
                    <p v-else>لم يتم تسجيل حضورك لهذا الاختبار.</p>

                    <div class="answer-statistics">
                      <span class="is-correct"><b>{{ exam.correctAnswersCount }}</b> صحيحة</span>
                      <span class="is-wrong"><b>{{ exam.wrongAnswersCount }}</b> خاطئة</span>
                      <span><b>{{ exam.unansweredQuestionsCount }}</b> بدون إجابة</span>
                    </div>

                    <NuxtLink
                      v-if="canRepeatExam(exam) && examRoute(exam)"
                      :to="examRoute(exam)!"
                      class="exam-result-retry"
                    >
                      <i class="pi pi-pencil" aria-hidden="true" />
                      العودة وتعديل الإجابات
                    </NuxtLink>
                  </div>
                </article>
              </div>

              <div v-else class="exam-state exam-state--compact">
                <span class="pi pi-inbox" />
                <h3>لا توجد نتائج سابقة</h3>
                <p>بعد إنهاء أول اختبار ستظهر نتيجتك وتفاصيل الإجابات هنا.</p>
              </div>
            </section>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/style/profile-redesign/profile.scss"></style>

<style scoped>
.exams-dashboard-main { width: min(1160px, calc(100% - 48px)); }
.exams-heading { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 28px; }
.exams-kicker, .exam-section__heading span { color: var(--profile-secondary); font-size: 12px; font-weight: 900; }
.exams-heading h1 { margin: 7px 0 4px; color: var(--profile-ink); font-size: clamp(31px, 4vw, 46px); font-weight: 900; line-height: 1.25; }
.exams-heading p { margin: 0; color: var(--profile-muted); font-size: 13px; }
.course-filter { display: grid; min-width: min(310px, 100%); gap: 7px; color: var(--profile-muted); font-size: 11px; font-weight: 800; }
.course-filter select { min-height: 47px; padding: 0 14px; border: 1px solid var(--profile-border); border-radius: 10px; background: var(--profile-surface); color: var(--profile-ink); font: 800 12px Cairo, sans-serif; }
.exam-statistics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 38px; }
.exam-statistics article { display: flex; min-height: 100px; align-items: center; gap: 14px; padding: 20px; border: 1px solid var(--profile-border); border-radius: 14px; background: var(--profile-surface); }
.exam-statistics article > span { display: grid; width: 45px; height: 45px; flex: 0 0 45px; place-items: center; border-radius: 12px; background: var(--profile-secondary-soft); color: var(--profile-secondary); }
.exam-statistics div { display: flex; flex-direction: column; }
.exam-statistics b { color: var(--profile-ink); font-size: 24px; line-height: 1.1; }
.exam-statistics small { margin-top: 5px; color: var(--profile-muted); font-size: 10px; }
.exam-section + .exam-section { margin-top: 48px; }
.exam-section__heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.exam-section__heading h2 { margin: 3px 0 0; color: var(--profile-ink); font-size: 25px; font-weight: 900; }
.exam-section__heading > b { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: var(--profile-secondary-soft); color: var(--profile-secondary); font-size: 13px; }
.current-exams-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.current-exam-card { position: relative; overflow: hidden; padding: 25px; border: 1px solid var(--profile-border); border-radius: 16px; background: var(--profile-surface); box-shadow: 0 16px 38px color-mix(in srgb, var(--profile-primary) 7%, transparent); }
.current-exam-card::before { position: absolute; top: 0; inset-inline: 0; height: 3px; background: linear-gradient(90deg, var(--profile-secondary), var(--profile-primary)); content: ""; }
.current-exam-card--finished { box-shadow: none; }
.current-exam-card--finished::before { background: #8a94a3; }
.current-exam-card--expired, .current-exam-card--upcoming { box-shadow: none; }
.current-exam-card--expired::before { background: #b75a52; }
.current-exam-card--upcoming::before { background: #d49b43; }
.current-exam-card--repeatable::before { background: linear-gradient(90deg, #2eb67d, var(--profile-secondary)); }
.exam-card__topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--profile-secondary); font-size: 10px; font-weight: 900; }
.exam-card__topline > span { display: inline-flex; align-items: center; gap: 6px; }
.exam-card__topline > span i { width: 6px; height: 6px; border-radius: 50%; background: #2eb67d; box-shadow: 0 0 0 4px rgb(46 182 125 / 13%); }
.exam-card__topline > .exam-status--finished { color: var(--profile-muted); }
.exam-card__topline > .exam-status--finished i { display: grid; width: 18px; height: 18px; place-items: center; border-radius: 50%; background: #8a94a3; box-shadow: none; color: white; font-size: 9px; }
.exam-card__topline > .exam-status--repeatable { color: #25834c; }
.exam-card__topline > .exam-status--repeatable i { display: inline; width: auto; height: auto; border-radius: 0; background: transparent; box-shadow: none; color: inherit; font-size: 11px; }
.exam-card__topline > .exam-status--unavailable { color: #a64740; }
.exam-card__topline > .exam-status--unavailable i { display: inline; width: auto; height: auto; border-radius: 0; background: transparent; box-shadow: none; color: inherit; font-size: 12px; }
.exam-card__topline > .exam-status--upcoming { color: #a36c18; }
.exam-card__topline small { color: var(--profile-muted); font-size: 10px; }
.current-exam-card h3, .exam-result-card h3 { margin: 15px 0 7px; color: var(--profile-ink); font-size: 19px; font-weight: 900; line-height: 1.55; }
.exam-schedule { display: flex; flex-wrap: wrap; gap: 10px 18px; color: var(--profile-muted); font-size: 10px; }
.exam-schedule span { display: inline-flex; align-items: center; gap: 6px; }
.exam-schedule i { color: var(--profile-secondary); }
.exam-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 22px 0 18px; padding: 15px 0; border-block: 1px solid var(--profile-border); }
.exam-meta span { display: flex; flex-direction: column; color: var(--profile-muted); text-align: center; font-size: 9px; }
.exam-meta b { color: var(--profile-ink); font-size: 15px; }
.exam-attempt-note { margin: -7px 0 16px; color: #25834c; font-size: 10px; line-height: 1.7; }
.current-exam-card > a, .current-exam-card > .exam-route-fallback, .current-exam-card > .exam-finished-action, .exam-state button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; gap: 10px; padding: 0 17px; border: 0; border-radius: 9px; background: var(--profile-action); color: var(--profile-on-action); cursor: pointer; font: 900 11px Cairo, sans-serif; text-decoration: none; }
.current-exam-card > .exam-finished-action { background: var(--profile-surface-raised); color: var(--profile-muted); cursor: not-allowed; opacity: 1; }
.current-exam-card > .exam-unavailable-action { width: 100%; border: 1px solid var(--profile-border); }
.exam-course-note { margin: 0; color: var(--profile-muted); font-size: 10px; }
.exam-history-list { display: grid; gap: 14px; }
.exam-result-card { display: grid; grid-template-columns: 132px minmax(0, 1fr); align-items: center; gap: 24px; padding: 22px; border: 1px solid var(--profile-border); border-radius: 16px; background: var(--profile-surface); }
.result-score { --exam-score: 0%; display: grid; width: 104px; height: 104px; place-items: center; margin-inline: auto; border-radius: 50%; background: conic-gradient(var(--profile-secondary) var(--exam-score), var(--profile-border) 0); }
.result-score::before { grid-area: 1 / 1; width: 80px; height: 80px; border-radius: 50%; background: var(--profile-surface); content: ""; }
.result-score > div { z-index: 1; grid-area: 1 / 1; display: flex; flex-direction: column; text-align: center; }
.result-score b { color: var(--profile-ink); font-size: 20px; }
.result-score small { color: var(--profile-muted); font-size: 9px; }
.result-score--absent { background: var(--profile-border); }
.result-content { min-width: 0; }
.result-content > p { margin: 0; color: var(--profile-muted); font-size: 11px; }
.answer-statistics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.answer-statistics span { padding: 7px 10px; border-radius: 8px; background: var(--profile-surface-raised); color: var(--profile-muted); font-size: 9px; }
.answer-statistics b { color: var(--profile-ink); font-size: 11px; }
.answer-statistics .is-correct { color: #2e9b68; background: color-mix(in srgb, #2eb67d 12%, var(--profile-surface)); }
.answer-statistics .is-wrong { color: #e06a61; background: color-mix(in srgb, #d94b43 12%, var(--profile-surface)); }
.exam-result-retry { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; padding: 0 15px; border: 1px solid color-mix(in srgb, var(--profile-secondary) 35%, var(--profile-border)); border-radius: 9px; background: var(--profile-secondary-soft); color: var(--profile-secondary); font-size: 10px; font-weight: 900; text-decoration: none; }
.exam-state { display: flex; min-height: 290px; flex-direction: column; align-items: center; justify-content: center; padding: 30px; border: 1px dashed var(--profile-border); border-radius: 16px; background: var(--profile-surface); text-align: center; }
.exam-state > span { color: var(--profile-secondary); font-size: 30px; }
.exam-state h2, .exam-state h3 { margin: 13px 0 3px; color: var(--profile-ink); }
.exam-state p { max-width: 500px; margin: 0 0 16px; color: var(--profile-muted); font-size: 11px; }
.exam-state--compact { min-height: 190px; }
.exam-state--error > span { color: #e06a61; }
.exam-loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.exam-loading span { height: 260px; border: 1px solid var(--profile-border); border-radius: 16px; background: linear-gradient(100deg, var(--profile-surface), var(--profile-surface-raised), var(--profile-surface)); background-size: 200%; animation: exam-loading 1.2s infinite; }
@keyframes exam-loading { to { background-position: -200% 0; } }
@media (max-width: 820px) { .exams-heading { align-items: stretch; flex-direction: column; } .current-exams-grid { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .exams-dashboard-main { width: calc(100% - 28px); } .exam-statistics { grid-template-columns: 1fr; } .exam-statistics article { min-height: 82px; } .exam-result-card { grid-template-columns: 1fr; text-align: center; } .exam-result-card .exam-card__topline { flex-direction: column; } .answer-statistics { justify-content: center; } .exam-loading { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .exam-loading span { animation: none; } }
</style>
