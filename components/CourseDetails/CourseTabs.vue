<script setup lang="ts">
import RightDots from "~/public/icons/RightDots.vue";
import { ref } from "vue";
import ContentIcon from "~/public/icons/contentIcon.vue";
import examsicon from "~/public/icons/examsicon.vue";
import exterinalurls from "~/public/icons/exterinalurls.vue";
import wifiIcon from "~/public/icons/wifiIcon.vue";
import homeworkicon from "~/public/icons/homeworkicon.vue";
import type CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";
import Loder from "../Loader/Loder.vue";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";

const props = withDefaults(defineProps<{
  courseData?: CourseDetailsModel | null;
  pending?: boolean;
}>(), {
  courseData: null,
  pending: false,
});
const emit = defineEmits<{
  refresh: [];
}>();

const value = ref("0");
const tab_value = ref("content");
type CoursePanel = "content" | "homework" | "live" | "urls" | "exams";
type CourseNavigation = CoursePanel | "overview" | "teacher";

const activeNavigation = ref<CourseNavigation>("content");
const tabNavigation = ref<HTMLElement | null>(null);
const settingsStore = useSettingStore();
const {
  subscriptionPrompt,
  closeCourseSubscriptionPrompt,
} = useCourseAccessPrompt();
const activetab = ref<number | null>(null);
const videoLink = ref({
  sessionId: null as number | null,
  videoLink: "",
  title: "",
  description: "",
});
const isCourseVideoPlaying = ref(false);
const isViewingCourseContent = computed(() => activetab.value === 0);
const { isCaptureShielded, protectionNotice } = useCourseContentProtection(
  isViewingCourseContent,
);

const CardData = computed(() => props.courseData);
const refreshCourseDetails = () => emit("refresh");
const isValidThemeColor = (color: unknown): color is string =>
  /^(#[\da-f]{3,8}|(?:rgb|hsl)a?\([^)]*\))$/iu.test(String(color || "").trim());
const courseAccessDialogStyle = computed<Record<string, string>>(() => {
  const primary = settingsStore.setting?.primary_color;
  const secondary = settingsStore.setting?.secondary_color;

  return {
    width: "min(470px, calc(100vw - 28px))",
    "--course-dialog-primary": isValidThemeColor(primary) ? primary : "#142b67",
    "--course-dialog-secondary": isValidThemeColor(secondary) ? secondary : "#2777e8",
  };
});

const goToCourseEnrollment = async () => {
  closeCourseSubscriptionPrompt();
  await nextTick();
  if (!import.meta.client) return;

  window.requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>(".enroll-card");
    if (!target) return;

    const headerHeight =
      document.querySelector<HTMLElement>(".home-v2-header")?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: Math.max(0, targetTop - headerHeight - 22),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
};

const scrollToCourseSection = (sectionId: string) => {
  if (!import.meta.client) return;

  const target = document.getElementById(sectionId);
  if (!target) return;

  const headerHeight =
    document.querySelector<HTMLElement>(".home-v2-header")?.getBoundingClientRect().height ?? 0;
  const navigationHeight = tabNavigation.value?.getBoundingClientRect().height ?? 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, targetTop - headerHeight - navigationHeight - 18),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
};

const navigateToCourseSection = async (
  navigation: CourseNavigation,
  sectionId: "course-curriculum" | "course-overview" | "course-teacher",
  panel?: CoursePanel,
) => {
  activeNavigation.value = navigation;
  if (panel) tab_value.value = panel;

  await nextTick();
  scrollToCourseSection(sectionId);
};

const Data = (data: {
  activetabvalue: number;
  link: string;
  title: string;
  description: string;
  sessionId: number;
}) => {
  // console.log(data, "data")
  activetab.value = data.activetabvalue;
  videoLink.value.videoLink = data.link;
  videoLink.value.title = data.title;
  videoLink.value.description = data.description;
  videoLink.value.sessionId = data.sessionId;
  isCourseVideoPlaying.value = false;
};

const handleCourseVideoPlaybackState = (isPlaying: boolean) => {
  isCourseVideoPlaying.value = isPlaying;
};

let timer: any = null;

const startExamDeadlineTimer = (exams: any[]) => {
  if (timer) clearInterval(timer);
  if (!exams?.length) return;

  const now = Date.now();

  const nextExam = exams
    .map((e: any) => ({
      ...e,
      deadline: e.end_time
        ? new Date(e.end_time.replace(" ", "T")).getTime()
        : 0,
    }))
    .filter((e: any) => e.deadline > now)
    .sort((a: any, b: any) => a.deadline - b.deadline)[0];

  if (!nextExam) return;

  timer = setInterval(() => {
    if (Date.now() >= nextExam.deadline) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 1000);
};

watch(
  () => CardData.value?.exams,
  (exams) => {
    startExamDeadlineTimer(exams || []);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <Toast position="top-center" />
  <Dialog
    v-model:visible="subscriptionPrompt.visible"
    modal
    dismissable-mask
    :draggable="false"
    :show-header="false"
    :style="courseAccessDialogStyle"
    class="course-access-dialog"
    :aria-label="subscriptionPrompt.isPending ? 'حالة طلب الاشتراك' : 'الاشتراك في الكورس'"
    dir="rtl"
  >
    <section class="course-access-dialog__body">
      <button
        type="button"
        class="course-access-dialog__close"
        aria-label="إغلاق"
        @click="closeCourseSubscriptionPrompt"
      >
        <i class="pi pi-times" aria-hidden="true"></i>
      </button>

      <div
        class="course-access-dialog__icon"
        :class="{ 'course-access-dialog__icon--pending': subscriptionPrompt.isPending }"
        aria-hidden="true"
      >
        <i :class="subscriptionPrompt.isPending ? 'pi pi-clock' : 'pi pi-lock'"></i>
      </div>

      <span class="course-access-dialog__eyebrow">
        {{ subscriptionPrompt.isPending ? "حالة الاشتراك" : "محتوى حصري" }}
      </span>
      <h2>
        {{
          subscriptionPrompt.isPending
            ? "طلب اشتراكك قيد المراجعة"
            : "هذا المحتوى للمشتركين فقط"
        }}
      </h2>
      <p>
        {{
          subscriptionPrompt.isPending
            ? "سيصبح محتوى الكورس متاحًا تلقائيًا فور قبول طلبك."
            : "اشترك في الكورس لفتح جميع الدروس والملفات والامتحانات ومتابعة تقدمك."
        }}
      </p>

      <div class="course-access-dialog__course" v-if="CardData?.title">
        <i class="pi pi-graduation-cap" aria-hidden="true"></i>
        <span>
          <small>الكورس المختار</small>
          <strong>{{ CardData.title }}</strong>
        </span>
        <b
          v-if="CardData?.CoursePrice && !subscriptionPrompt.isPending"
          dir="ltr"
        >
          {{ CardData.CoursePrice }} {{ CardData.currency }}
        </b>
      </div>

      <div class="course-access-dialog__actions">
        <button
          v-if="!subscriptionPrompt.isPending"
          type="button"
          class="course-access-dialog__primary"
          @click="goToCourseEnrollment"
        >
          <span>الانتقال إلى الاشتراك</span>
          <i class="pi pi-arrow-left" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="course-access-dialog__secondary"
          @click="closeCourseSubscriptionPrompt"
        >
          {{ subscriptionPrompt.isPending ? "حسنًا" : "لاحقًا" }}
        </button>
      </div>
    </section>
  </Dialog>

  <div
    class="course-details-page"
    :class="{ 'is-viewing-course-content': activetab == 0 }"
    dir="auto"
  >
    <Transition name="course-protection-notice">
      <div v-if="protectionNotice" class="course-protection-notice" role="status">
        <i class="pi pi-shield" aria-hidden="true"></i>
        {{ protectionNotice }}
      </div>
    </Transition>

    <div class="page-loader" v-if="pending && !CardData">
      <Loder />
    </div>

    <CourseDetailsCourseCard
      :CourseData="CardData"
      :status="CardData?.allow_status"
      :isSubscribed="CardData?.is_subscribed"
      :isPaied="CardData?.is_paid"
      @Changestatus="refreshCourseDetails"
    >
      <template #main="{ platformTeacher }">
        <div
          class="course-viewer"
          :class="{
            'is-capture-shielded': isCaptureShielded,
            'is-playing': isCourseVideoPlaying,
          }"
          v-if="activetab == 0"
        >
          <CourseDetailsCourseVideo
            :CourseData="CardData"
            :CourseVideoLink="videoLink"
            :course-id="CardData?.id"
            @playback-state-change="handleCourseVideoPlaybackState"
          />
          <div v-if="isCaptureShielded" class="course-capture-shield">
            <i class="pi pi-lock" aria-hidden="true"></i>
            <strong>المحتوى محمي</strong>
            <span>ارجع إلى نافذة الكورس لمتابعة الدرس</span>
          </div>
        </div>

        <section class="course-tabs">
          <div class="tabs-container">
            <nav
              ref="tabNavigation"
              class="section-navigation detail-tabs"
              :aria-label="$t('course_sections')"
            >
              <button
                type="button"
                class="detail-tab nav-curriculum"
                :class="{ 'active-tab': activeNavigation === 'content' }"
                :aria-current="activeNavigation === 'content' ? 'location' : undefined"
                @click="navigateToCourseSection('content', 'course-curriculum', 'content')"
              >
                <i class="pi pi-book" aria-hidden="true"></i>
                <span>{{ $t("course_curriculum") }}</span>
              </button>
              <button
                type="button"
                class="detail-tab nav-overview"
                :class="{ 'active-tab': activeNavigation === 'overview' }"
                :aria-current="activeNavigation === 'overview' ? 'location' : undefined"
                @click="navigateToCourseSection('overview', 'course-overview')"
              >
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span>{{ $t("about_course") }}</span>
              </button>
              <button
                v-if="CardData?.homeworks?.length"
                type="button"
                class="detail-tab"
                :class="{ 'active-tab': activeNavigation === 'homework' }"
                :aria-current="activeNavigation === 'homework' ? 'location' : undefined"
                @click="navigateToCourseSection('homework', 'course-curriculum', 'homework')"
              >
                <i class="pi pi-file-edit" aria-hidden="true"></i>
                <span>{{ $t("homework") }}</span>
              </button>
              <button
                v-if="CardData?.lives?.length"
                type="button"
                class="detail-tab"
                :class="{ 'active-tab': activeNavigation === 'live' }"
                :aria-current="activeNavigation === 'live' ? 'location' : undefined"
                @click="navigateToCourseSection('live', 'course-curriculum', 'live')"
              >
                <i class="pi pi-video" aria-hidden="true"></i>
                <span>{{ $t("live_sessions") }}</span>
              </button>
              <button
                v-if="CardData?.externalLinks?.length"
                type="button"
                class="detail-tab"
                :class="{ 'active-tab': activeNavigation === 'urls' }"
                :aria-current="activeNavigation === 'urls' ? 'location' : undefined"
                @click="navigateToCourseSection('urls', 'course-curriculum', 'urls')"
              >
                <i class="pi pi-link" aria-hidden="true"></i>
                <span>{{ $t("external_links") }}</span>
              </button>
              <button
                v-if="CardData?.exams?.length"
                type="button"
                class="detail-tab"
                :class="{ 'active-tab': activeNavigation === 'exams' }"
                :aria-current="activeNavigation === 'exams' ? 'location' : undefined"
                @click="navigateToCourseSection('exams', 'course-curriculum', 'exams')"
              >
                <i class="pi pi-check-square" aria-hidden="true"></i>
                <span>{{ $t("exams") }}</span>
              </button>
              <button
                v-if="CardData?.Teacher || platformTeacher"
                type="button"
                class="detail-tab nav-teacher"
                :class="{ 'active-tab': activeNavigation === 'teacher' }"
                :aria-current="activeNavigation === 'teacher' ? 'location' : undefined"
                @click="navigateToCourseSection('teacher', 'course-teacher')"
              >
                <i class="pi pi-user" aria-hidden="true"></i>
                <span>{{ $t("course_teacher") }}</span>
              </button>
            </nav>

            <article class="course-overview" id="course-overview">
              <header class="section-heading-block">
                <span class="detail-section-tag">نظرة عامة</span>
                <h2>كل ما يتضمنه <em>الكورس.</em></h2>
              </header>

              <div
                class="overview-description"
                v-if="CardData?.description"
                v-html="CardData?.description"
              ></div>

              <div class="course-statistics detail-numbers">
                <div class="statistic-item">
                  <strong>{{ CardData?.course_videos || 0 }}</strong>
                  <small>{{ $t("video") }}</small>
                </div>
                <div class="statistic-item">
                  <strong>{{ CardData?.course_docs || 0 }}</strong>
                  <small>{{ $t("paper_file") }}</small>
                </div>
                <div class="statistic-item statistic-price">
                  <strong v-if="CardData?.CoursePrice != 0">
                    {{ CardData?.CoursePrice }} {{ CardData?.currency }}
                  </strong>
                  <strong v-else>{{ $t("free") }}</strong>
                  <small>{{ $t("course_access") }}</small>
                </div>
                <div class="statistic-item" v-if="CardData?.Subject?.title">
                  <strong>{{ CardData?.Subject?.title }}</strong>
                  <small>{{ $t("content") }}</small>
                </div>
              </div>
            </article>

            <article class="curriculum-section" id="course-curriculum">
              <header class="section-heading-block curriculum-heading">
                <span class="detail-section-tag">{{ $t("course_curriculum") }}</span>
                <h2 v-if="tab_value === 'content'">ملخص المحتوى المتاح داخل الكورس</h2>
                <h2 v-else-if="tab_value === 'homework'">{{ $t("homework") }}</h2>
                <h2 v-else-if="tab_value === 'live'">{{ $t("live_sessions") }}</h2>
                <h2 v-else-if="tab_value === 'urls'">{{ $t("external_links") }}</h2>
                <h2 v-else-if="tab_value === 'exams'">{{ $t("exams") }}</h2>
              </header>

              <div class="platform-key" v-if="tab_value === 'content'">
                <span><i></i>ضمن محتوى الكورس</span>
              </div>

              <div class="tabs-content">
                <div v-if="tab_value === 'homework'">
                  <CourseDetailsTabsContentCourseHomework
                    :CourseData="CardData?.homeworks"
                    :CourseStatus="CardData?.allow_status"
                  />
                </div>
                <div v-if="tab_value === 'content' && CardData?.StageType == 3">
                  <CourseDetailsTabsContentCourseContent
                    @coursechanged="Data"
                    :CourseData="CardData?.units"
                    :CourseStatus="CardData?.allow_status"
                    :isSubscribed="CardData?.is_subscribed"
                    :isPaied="CardData?.is_paid"
                    :courseId="CardData?.id"
                  />
                </div>
                <div v-if="tab_value === 'content' && CardData?.StageType == 2">
                  <CourseDetailsTabsContentCourseContentStageTwo
                    @coursechanged="Data"
                    :CourseData="CardData?.lessons"
                    :CourseStatus="CardData?.allow_status"
                    :isSubscribed="CardData?.is_subscribed"
                    :isPaied="CardData?.is_paid"
                    :courseId="CardData?.id"
                  />
                </div>
                <div v-if="tab_value === 'content' && CardData?.StageType == 1">
                  <CourseDetailsTabsContentCourseContentStageOne
                    @coursechanged="Data"
                    :CourseData="CardData?.sessions"
                    :CourseStatus="CardData?.allow_status"
                    :isSubscribed="CardData?.is_subscribed"
                    :isPaied="CardData?.is_paid"
                    :courseId="CardData?.id"
                  />
                </div>
                <div v-if="tab_value === 'urls'">
                  <CourseDetailsTabsContentCourseUrls
                    :CourseData="CardData?.externalLinks"
                    :CourseStatus="CardData?.allow_status"
                  />
                </div>
                <div v-if="tab_value === 'live'">
                  <CourseDetailsTabsContentCourseLive
                    :CourseData="CardData?.lives"
                    :CourseStatus="CardData?.allow_status"
                  />
                </div>
                <div class="course-exams" v-if="tab_value === 'exams'">
                  <CourseDetailsTabsContentCourseExam
                    :CourseData="CardData?.exams"
                    :CourseStatus="CardData?.allow_status"
                    :isPaid="CardData?.is_paid"
                    :isSubscribed="CardData?.is_subscribed"
                  />
                </div>
              </div>
            </article>

            <article class="teacher-section public-teacher" id="course-teacher" v-if="CardData?.Teacher || platformTeacher">
              <div class="teacher-profile">
                <span class="teacher-avatar" aria-hidden="true">
                  {{ (CardData?.Teacher?.name || platformTeacher?.name || "").charAt(0) }}
                </span>
                <div>
                  <span class="teacher-role">
                    {{ $t("course_teacher") }}
                    <template v-if="CardData?.Subject?.title"> · {{ CardData?.Subject?.title }}</template>
                  </span>
                  <h2>{{ CardData?.Teacher?.name || platformTeacher?.name }}</h2>
                  <div
                    class="teacher-description"
                    v-if="!CardData?.Teacher && platformTeacher?.description"
                    v-html="platformTeacher?.description"
                  ></div>
                  <p v-else-if="CardData?.Subject?.title">{{ CardData?.Subject?.title }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>
    </CourseDetailsCourseCard>
  </div>
</template>

<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-tabs.scss">

</style>
