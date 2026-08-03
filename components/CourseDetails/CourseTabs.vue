<script setup lang="ts">
import RightDots from "~/public/icons/RightDots.vue";
import { ref } from "vue";
import ContentIcon from "~/public/icons/contentIcon.vue";
import examsicon from "~/public/icons/examsicon.vue";
import exterinalurls from "~/public/icons/exterinalurls.vue";
import wifiIcon from "~/public/icons/wifiIcon.vue";
import homeworkicon from "~/public/icons/homeworkicon.vue";
import CourseDetailsParams from "~/features/FetchCourseDetails/Core/Params/course_details_params";
import CourseDetailsController from "~/features/FetchCourseDetails/presentation/controllers/course_details_controller";
import type CourseDetailsModel from "~/features/FetchCourseDetails/Data/models/course_details_model";
import Loder from "../Loader/Loder.vue";

const value = ref("0");
const route = useRoute();
const tab_value = ref("content");
const activetab = ref({});
const videoLink = ref({
  videoLink: "",
  title: "",
  description: "",
});

// const id = ref<string>(<string>route.params.id)

const CardData = ref<CourseDetailsModel | null>(null);

const FetchCourseDetails = async () => {
  const courseDetailsParams = new CourseDetailsParams(
    route.params.id as string,
  );
  const courseDetailsController = CourseDetailsController.getInstance();
  const state = await courseDetailsController.FetchCourseDetails(
    courseDetailsParams,
  );
  if (state.value.data) {
    CardData.value = state.value.data;
  }
};

onMounted(() => {
  FetchCourseDetails();
});

const Data = (data: {
  activetabvalue: number;
  link: string;
  title: string;
  description: string;
}) => {
  // console.log(data, "data")
  activetab.value = data.activetabvalue;
  videoLink.value.videoLink = data.link;
  videoLink.value.title = data.title;
  videoLink.value.description = data.description;
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
  <div
    class="course-details-page"
    :class="{ 'is-viewing-course-content': activetab == 0 }"
    dir="auto"
  >
    <div class="page-loader" v-if="!CardData">
      <Loder />
    </div>

    <CourseDetailsCourseCard
      :CourseData="CardData"
      :status="CardData?.allow_status"
      :isSubscribed="CardData?.is_subscribed"
      :isPaied="CardData?.is_paid"
      @Changestatus="FetchCourseDetails"
    >
      <template #main="{ platformTeacher }">
        <div class="course-viewer" v-if="activetab == 0">
          <CourseDetailsCourseVideo
            :CourseData="CardData"
            :CourseVideoLink="videoLink"
          />
        </div>

        <section class="course-tabs">
          <div class="tabs-container">
            <nav class="section-navigation detail-tabs" :aria-label="$t('course_sections')">
              <a class="nav-overview" href="#course-overview">{{ $t("about_course") }}</a>
              <a
                class="nav-curriculum"
                href="#course-curriculum"
                @click="tab_value = 'content'"
              >
                {{ $t("course_curriculum") }}
              </a>
              <a
                href="#course-curriculum"
                v-if="CardData?.homeworks?.length"
                @click="tab_value = 'homework'"
                :class="{ 'active-tab': tab_value === 'homework' }"
              >
                {{ $t("homework") }}
              </a>
              <a
                href="#course-curriculum"
                v-if="CardData?.lives?.length"
                @click="tab_value = 'live'"
                :class="{ 'active-tab': tab_value === 'live' }"
              >
                {{ $t("live_sessions") }}
              </a>
              <a
                href="#course-curriculum"
                v-if="CardData?.externalLinks?.length"
                @click="tab_value = 'urls'"
                :class="{ 'active-tab': tab_value === 'urls' }"
              >
                {{ $t("external_links") }}
              </a>
              <a
                href="#course-curriculum"
                v-if="CardData?.exams?.length"
                @click="tab_value = 'exams'"
                :class="{ 'active-tab': tab_value === 'exams' }"
              >
                {{ $t("exams") }}
              </a>
              <a class="nav-teacher" href="#course-teacher" v-if="CardData?.Teacher || platformTeacher">
                {{ $t("course_teacher") }}
              </a>
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
