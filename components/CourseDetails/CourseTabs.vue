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
  <div class="course-details-page" dir="auto">
    <div class="page-loader" v-if="!CardData">
      <Loder />
    </div>
    <div class="course-viewer" v-if="activetab == 0">
      <CourseDetailsCourseVideo
        :CourseData="CardData"
        :CourseVideoLink="videoLink"
      />
    </div>

    <div v-if="activetab != 0">
      <CourseDetailsCourseCard
        :CourseData="CardData"
        :status="CardData?.allow_status"
        :isSubscribed="CardData?.is_subscribed"
        :isPaied="CardData?.is_paid"
        @Changestatus="FetchCourseDetails"
      />
    </div>

    <section class="course-tabs">
      <div class="tabs-container">
        <nav class="tabs-header" :aria-label="$t('course_sections')">
          <button
          type="button"
          class="tab-title"
          v-if="CardData?.homeworks?.length"
          @click="tab_value = 'homework'"
          :class="tab_value === 'homework' ? 'active-tab' : ''"
          :aria-current="tab_value === 'homework' ? 'page' : undefined"
        >
          <homeworkicon />
          <p>{{ $t("homework") }}</p>
        </button>
        <button
          type="button"
          class="tab-title"
          v-if="CardData?.lives?.length"
          @click="tab_value = 'live'"
          :class="tab_value === 'live' ? 'active-tab' : ''"
          :aria-current="tab_value === 'live' ? 'page' : undefined"
        >
          <wifiIcon />
          <p>{{ $t("live_sessions") }}</p>
        </button>
        <button
          type="button"
          class="tab-title"
          v-if="CardData?.externalLinks?.length"
          @click="tab_value = 'urls'"
          :class="tab_value === 'urls' ? 'active-tab' : ''"
          :aria-current="tab_value === 'urls' ? 'page' : undefined"
        >
          <exterinalurls />
          <p>{{ $t("external_links") }}</p>
        </button>
        <button
          type="button"
          class="tab-title"
          v-if="CardData?.exams?.length"
          @click="tab_value = 'exams'"
          :class="tab_value === 'exams' ? 'active-tab' : ''"
          :aria-current="tab_value === 'exams' ? 'page' : undefined"
        >
          <examsicon />
          <p>{{ $t("exams") }}</p>
        </button>
        <button
          type="button"
          class="tab-title"
          v-if="CardData?.units"
          @click="tab_value = 'content'"
          :class="tab_value === 'content' ? 'active-tab' : ''"
          :aria-current="tab_value === 'content' ? 'page' : undefined"
        >
          <ContentIcon />
          <p>{{ $t("content") }}</p>
        </button>
        </nav>

        <div class="tabs-content">
          <header class="content-heading">
            <span class="content-heading-icon">
              <i
                :class="tab_value === 'content' ? 'pi pi-list-check' : 'pi pi-folder-open'"
                aria-hidden="true"
              ></i>
            </span>
            <div>
              <p>{{ $t("course_sections") }}</p>
              <h2 v-if="tab_value === 'content'">{{ $t("course_curriculum") }}</h2>
              <h2 v-else-if="tab_value === 'homework'">{{ $t("homework") }}</h2>
              <h2 v-else-if="tab_value === 'live'">{{ $t("live_sessions") }}</h2>
              <h2 v-else-if="tab_value === 'urls'">{{ $t("external_links") }}</h2>
              <h2 v-else-if="tab_value === 'exams'">{{ $t("exams") }}</h2>
            </div>
          </header>

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
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.course-details-page {
  --course-accent: var(--primary-color, #1d4ed8);
  --course-accent-soft: color-mix(in srgb, var(--course-accent) 8%, white);
  --course-ink: #172033;
  --course-muted: #6b7485;
  --course-border: #e5e9f0;
  min-height: 70vh;
  background: #f7f8fb;
}

.page-loader {
  height: 100vh;
  width: 100%;
  position: fixed;
  background-color: #000000c9;
  top: 0;
  left: 0;
  z-index: 99;
}

.course-viewer {
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 0;
  overflow: hidden;
  border: 1px solid var(--course-border);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 14px 36px rgba(24, 39, 75, 0.08);
}

.course-tabs {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0 clamp(14px, 4vw, 54px) clamp(40px, 6vw, 72px);
  overflow: visible;
  background: #f7f8fb;
}

.tabs-container {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding-top: clamp(26px, 4vw, 48px);
}

.tabs-header {
  position: sticky;
  z-index: 30;
  top: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  overflow-x: auto;
  border: 1px solid var(--course-border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 24px rgba(24, 39, 75, 0.07);
  scrollbar-width: none;
}

.tabs-header::-webkit-scrollbar {
  display: none;
}

.tab-title {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 112px;
  min-height: 46px;
  padding: 9px 15px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--course-muted);
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.tab-title:hover {
  background: var(--course-accent-soft);
  color: var(--course-accent);
}

.tab-title.active-tab {
  border: 0;
  background: var(--course-accent);
  color: #fff;
  box-shadow: 0 7px 16px color-mix(in srgb, var(--course-accent) 22%, transparent);
}

.tab-title :deep(svg) {
  width: 19px;
  height: 19px;
}

.tab-title :deep(svg path) {
  stroke: currentColor;
}

.tab-title p {
  margin: 0;
}

.tabs-content {
  width: 100%;
  margin: 20px auto 0;
  padding: clamp(18px, 3vw, 32px);
  position: relative;
  z-index: 20;
  border: 1px solid var(--course-border);
  border-radius: 20px;
  background: #fff;
  text-align: start;
  box-shadow: 0 10px 30px rgba(24, 39, 75, 0.05);
}

.content-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--course-border);
}

.content-heading-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: var(--course-accent-soft);
  color: var(--course-accent);
  font-size: 19px;
}

.content-heading p {
  color: var(--course-muted);
  font-size: 12px;
  font-weight: 700;
}

.content-heading h2 {
  margin-top: 2px;
  color: var(--course-ink);
  font-size: clamp(19px, 2.5vw, 25px);
  font-weight: 800;
}

.course-exams {
  display: flex;
  flex-direction: column-reverse;
}

@media (max-width: 700px) {
  .course-tabs {
    padding-inline: 12px;
  }

  .tabs-container {
    padding-top: 22px;
  }

  .tabs-header {
    top: 6px;
    justify-content: flex-start;
    border-radius: 14px;
  }

  .tab-title {
    min-width: auto;
    min-height: 42px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .tabs-content {
    margin-top: 14px;
    padding: 16px 12px 22px;
    border-radius: 16px;
  }

  .content-heading {
    padding-inline: 4px;
    padding-bottom: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tab-title {
    transition: none;
  }
}

/* Override the older global tab bundle only inside this page. */
.course-details-page .course-tabs .tabs-container .tabs-header {
  flex-wrap: nowrap;
  justify-content: center;
  gap: 8px;
  padding: 8px;
}

.course-details-page .course-tabs .tabs-container .tabs-header .tab-title {
  flex-direction: row;
  gap: 8px;
  min-width: 112px;
  padding: 9px 15px;
  border: 0;
  font-family: inherit;
  font-size: 14px;
}

.course-details-page .course-tabs .tabs-container .tabs-header .tab-title.active-tab {
  border: 0;
  background: var(--course-accent);
  color: #fff;
}

.course-details-page .course-tabs .tabs-container .tabs-header .tab-title :deep(svg path) {
  stroke: currentColor;
}

.course-details-page .course-tabs .tabs-container .tabs-content {
  width: 100%;
  margin: 20px auto 0;
  padding: clamp(18px, 3vw, 32px);
  text-align: start;
}

@media (max-width: 700px) {
  .course-details-page .course-tabs .tabs-container .tabs-header {
    justify-content: flex-start;
  }

  .course-details-page .course-tabs .tabs-container .tabs-header .tab-title {
    min-width: auto;
    padding: 8px 12px;
    font-size: 13px;
  }

  .course-details-page .course-tabs .tabs-container .tabs-content {
    margin-top: 14px;
    padding: 16px 12px 22px;
  }
}
</style>
