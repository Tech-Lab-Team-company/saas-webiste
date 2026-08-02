<script setup lang="ts">

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import coursenotesicon from '~/public/icons/coursenotesicon.vue';
import microphoneicon from '~/public/icons/microphoneicon.vue';
// import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import { useUserStore } from "~/stores/user";
import type LessonsModel from '~/features/FetchCourseDetails/Data/models/lessons_model';
import { ContentTypeEnum } from "~/components/CourseDetails/Enum/content_type_enum";
import LockIcon from '~/public/icons/LockIcon.vue';
import { IconsBook } from '#components';
const props = defineProps({
  CourseData: {
    type: Object as () => LessonsModel | null,
    default: null
  },
  CourseStatus: {
    type: Number,
  },
  isSubscribed: {
    type: Boolean,
  },
  isPaied: {
    type: Boolean,
  },
  courseId: {
    type: Number
  }
});

const CardDetails = ref(props.CourseData);
const CourseId = ref(props.courseId)

watch(() => props.CourseData, (newValue) => {
  CardDetails.value = newValue;
}, { immediate: true });


function getExtFromUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
  return match ? match[1].toLowerCase() : '';
}

const typeIconMap: Record<ContentTypeEnum, any> = {
  [ContentTypeEnum.VIDEO]: CourseVideoIcon,
  [ContentTypeEnum.PDF]: coursenotesicon,
  [ContentTypeEnum.AUDIO]: microphoneicon,
  [ContentTypeEnum.VIDEO_PDF]: CourseVideoIcon,
  [ContentTypeEnum.AUDIO_PDF]: microphoneicon,
  [ContentTypeEnum.GENERALSESSION]: coursenotesicon,
  [ContentTypeEnum.EXAM]: IconsBook
};

function getIconByType(type: ContentTypeEnum) {
  return typeIconMap[type] || CourseVideoIcon;
}


// const router = useRouter();
const activePanels = ref<number[]>([]);
const SecondactivePanels = ref<number[]>([]);
// const thirdactivePanels = ref<number[]>([]);
const activetab = ref(1)

const emit = defineEmits(['coursechanged']);

const sendactivetab = (activetabvalue: number, link: string, title: string, description: string) => {
  activetab.value = activetabvalue;
  emit('coursechanged', { activetabvalue: activetabvalue, link: link, title: title, description: description });
}
const toast = useToast();

const userStore = useUserStore()
const activeIndices = ref<number[]>([]);
const isdisabled = ref(false)

const selectedSessionIndex = ref<number | null>(null);

function handleSessionClick(index: number, link: string, title: string, text: string, show: boolean, sessionPaid: boolean) {
  if (!userStore.user) {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول', life: 3000 });
    // return;
  }
  else {
    if (show === false) {
      if ((UserSetting.setting?.app_store && UserSetting.setting?.app_store != '-') && (UserSetting.setting?.play_store && UserSetting.setting?.play_store != '-')) {
        visible.value = true;
      }
    }
    else if (show === true) {
      if (!sessionPaid && !props.isSubscribed) {
        isdisabled.value = false
        selectedSessionIndex.value = index;
        sendactivetab(0, link, title, text);
        visible.value = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      else if (!props.isSubscribed && props.isPaied) {
        isdisabled.value = true

        toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب شراء الكورس اولا ', life: 3000 });
        // console.log("non")
      }
      else if ((props.isSubscribed && props.isPaied)) {
        isdisabled.value = false
        selectedSessionIndex.value = index;
        sendactivetab(0, link, title, text);
        visible.value = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      else if ((!props.isPaied)) {
        isdisabled.value = false
        selectedSessionIndex.value = index;
        sendactivetab(0, link, title, text);
        visible.value = false;
      }
    }
  }
}


const visible = ref(false);
const UserSetting = useUserStore();
const router = useRouter()
const ExamTime = ref()
const GotoExam = (examId: number, StartTime: string, EndTime: string, CourseId: number, IsFinished: boolean) => {
  const start = new Date(StartTime).getTime();
  const end = new Date(EndTime).getTime();
  ExamTime.value = Math.floor((end - start) / 1000 / 60);
  if (!IsFinished && ExamTime.value > 0) {
    router.push(`/course/${CourseId}/timer?id=${examId}&time=${StartTime}`)
  }
}
const handelExam = (isFinished: boolean) => {
  if ((isFinished || !userStore?.user
    || (props.isPaied == true && props?.isSubscribed == false))) {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: ' يجب شراء الكورس اولا ', life: 3000 })
    return;
  } else {

  }

}
</script>

<template>

  <Accordion v-if="CardDetails.length > 0" value="0" class="course-content-container">
    <AccordionPanel :value="index == 0 ? '0' : index" class="course-content-panel"
      v-for="(lesson, index) in CardDetails" :key="index" :class="{ 'active': activePanels.includes(index) }">
      <AccordionHeader class="course-content-header ">
        <span class="accordion-heading-copy">
          <span class="accordion-title">{{ lesson?.title }}</span>
          <span class="accordion-count" v-if="lesson?.sessions?.length">
            <i class="pi pi-play-circle" aria-hidden="true"></i>
            {{ lesson?.sessions?.length }} {{ $t("course_items") }}
          </span>
        </span>
      </AccordionHeader>
      <AccordionContent class="course-class-body" v-for="(session, thirdindex) in lesson?.sessions">
        <div class="course-body-details" :key="thirdindex"
          :class="[selectedSessionIndex === thirdindex ? 'active' : '', isdisabled == true ? 'disabled' : '']"
          @click="handleSessionClick(thirdindex, session?.link, session?.title, session?.text, session?.web_show_video, session?.is_paid)">

          <component :is="getIconByType(session?.type)" />
          <div class="session-name session-name2">
            <LockIcon v-if="!session?.web_show_video" />
            <p>{{ session?.title }} <span class="preview-badge" v-if="!session?.is_paid && !props.isSubscribed">مجانى</span></p>
            <p v-if="!session?.web_show_video">(هذا المحتوى حصرى للتطبيق فقط)</p>
          </div>

        </div>
        <div class="course-body-details course-exam" v-if="session?.exam"
          @click="GotoExam(session?.exam?.id, session?.exam?.start_time, session?.exam?.end_time, CourseId, session?.exam?.is_finished)">
          <div class="session-name" :class="{
            'disabled': session?.exam?.is_finished || !userStore?.user
              || (isPaied == true && isSubscribed == false)
          }" @click="handelExam(session?.exam?.is_finished)">

            <p>{{ session?.exam?.title }} (امتحان) </p>
            <component v-if="!session?.exam?.is_finished" :is="getIconByType(ContentTypeEnum.EXAM)" />
            <div v-else>
              <div class="exam-rate">
                <p class="rating" v-if="session?.exam.degree_type == 2" :class="session?.exam.mark < 6 ? 'failed' : ''">
                  {{ session?.exam.mark }} / {{ session?.exam.exam_mark }}</p>
                <p class="rating" v-if="session?.exam.degree_type == 1"
                  :class="(session?.exam.mark / session?.exam.exam_mark) * 100 < 50 ? 'failed' : ''"> {{
                    ((session?.exam.mark / session?.exam.exam_mark) * 100).toFixed(2) }} %</p>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

  <div v-else>
    <NuxtImg class="empty-content" src="/images/EmptyContent.png" alt="empty content" />
  </div>
  <Dialog v-model:visible="visible" modal :dismissableMask="true" :style="{ width: '25rem' }">
    <div class="stores-logos-container">
      <a v-if="UserSetting.setting?.app_store && UserSetting.setting?.app_store != '-'" class="stores-logos-link"
        target="_blank" :href="UserSetting.setting?.app_store">
        <NuxtImg class="stores-logos stores-logos-apple" src="/images/Download_on_the_App_Store_Badge.svg.webp" />

      </a>
      <a v-if="UserSetting.setting?.play_store && UserSetting.setting?.play_store != '-'" class="stores-logos-link"
        target="_blank" :href="UserSetting.setting?.play_store">
        <NuxtImg class="stores-logos" src="/images/en_badge_web_generic.png" />
      </a>
    </div>
  </Dialog>
</template>


<style scoped lang="scss">
.course-content-container {
  width: 100%;
  margin: 20px 0 0;
  border: 0;
}

.course-content-panel {
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid #e5e9f0;
  border-radius: 14px;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.course-content-panel.p-accordionpanel-active {
  border-color: color-mix(in srgb, var(--primary-color, #1d4ed8) 25%, white);
  box-shadow: 0 8px 20px rgba(24, 39, 75, 0.06);
}

.course-content-header,
.course-content-panel.p-accordionpanel-active .course-content-header {
  min-height: 62px;
  margin: 0;
  padding: 14px 18px;
  border: 0;
  border-radius: 0;
  background: #fff;
  color: #172033;
  font-size: 15px;
  text-align: start;
}

.course-content-panel.p-accordionpanel-active .course-content-header {
  background: color-mix(in srgb, var(--primary-color, #1d4ed8) 7%, white);
  color: var(--primary-color, #1d4ed8);
}

.accordion-heading-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.accordion-title {
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
}

.accordion-count {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #f1f4f8;
  color: #6b7485;
  font-size: 11px;
  font-weight: 700;
}

.course-class-body {
  display: block;
  width: 100%;
  padding: 0 18px;
  border: 0;
  background: #fff;
}

.course-class-body :deep(.p-accordioncontent-content) {
  padding: 0;
}

.course-body-details {
  position: relative;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 15px 4px;
  align-items: center;
  justify-content: space-between;
  gap: 13px;
  border: 0;
  border-bottom: 1px solid #edf0f4;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: #4c5668;
  cursor: pointer;
  text-align: start;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.course-body-details:hover,
.course-body-details.active {
  background: color-mix(in srgb, var(--primary-color, #1d4ed8) 5%, white);
  color: var(--primary-color, #1d4ed8);
}

.course-body-details > :deep(svg) {
  flex: 0 0 auto;
  width: 21px;
  height: 21px;
}

.course-body-details :deep(svg path) {
  stroke: currentColor;
}

.session-name,
.session-name2 {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;
}

.session-name p {
  min-width: 0;
  color: inherit;
  font-weight: 600;
}

.session-name p + p {
  color: #8a93a2;
  font-size: 11px;
}

.preview-badge {
  display: inline-flex;
  margin-inline-start: 7px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e9f9ef;
  color: #15803d;
  font-size: 10px;
  font-weight: 800;
}

.course-body-details:has(.disabled) {
  cursor: not-allowed;
  pointer-events: none;
}

.disabled {
  opacity: 0.52;
  cursor: not-allowed;
  pointer-events: none;
}

.exam-rate .rating {
  padding: 4px 10px;
  border-radius: 999px;
  background: #e8ffef;
  color: #08851b;
  font-size: 12px;
}

.exam-rate .rating.failed {
  background: #ffebec;
  color: #be2426;
}

.empty-content {
  width: min(360px, 80%);
  margin: 28px auto;
}

.stores-logos-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stores-logos-link {
  width: 50%;
}

.stores-logos-apple {
  width: 88%;
}

@media (max-width: 640px) {
  .course-content-header,
  .course-content-panel.p-accordionpanel-active .course-content-header {
    padding: 12px;
  }

  .course-class-body {
    padding: 0 10px;
  }

  .course-body-details {
    align-items: flex-start;
    padding: 13px 3px;
  }

  .session-name,
  .session-name2 {
    flex-wrap: wrap;
  }

  .session-name p + p {
    width: 100%;
  }
}

.course-content-container .course-content-panel .course-content-header,
.course-content-container .course-content-panel.p-accordionpanel-active .course-content-header {
  min-height: 62px;
  margin: 0;
  padding: 14px 18px;
  border: 0;
  border-radius: 0;
  background: #fff;
  color: #172033;
  text-align: start;
}

.course-content-container .course-content-panel.p-accordionpanel-active .course-content-header {
  background: color-mix(in srgb, var(--primary-color, #1d4ed8) 7%, white);
  color: var(--primary-color, #1d4ed8);
}

@media (max-width: 640px) {
  .course-content-container .course-content-panel .course-content-header,
  .course-content-container .course-content-panel.p-accordionpanel-active .course-content-header {
    padding: 12px;
  }
}
</style>
