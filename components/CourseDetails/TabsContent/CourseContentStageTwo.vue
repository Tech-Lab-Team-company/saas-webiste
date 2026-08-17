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
import { isExamAttemptLocked } from '~/utils/examAttempts';
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

const sendactivetab = (activetabvalue: number, sessionId: number, link: string, title: string, description: string) => {
  activetab.value = activetabvalue;
  emit('coursechanged', { activetabvalue, sessionId, link, title, description });
}
const toast = useToast();

const userStore = useUserStore()
const { isOpen, isExpired, isUpcoming } = useExamAvailabilityClock();
const isExamAvailable = (exam: unknown) =>
  isOpen(exam) && !isExamAttemptLocked(exam);
const activeIndices = ref<number[]>([]);
const isdisabled = ref(false)

const selectedSessionIndex = ref<number | null>(null);

function handleSessionClick(index: number, sessionId: number, link: string, title: string, text: string, show: boolean, sessionPaid: boolean) {
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
        sendactivetab(0, sessionId, link, title, text);
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
        sendactivetab(0, sessionId, link, title, text);
        visible.value = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      else if ((!props.isPaied)) {
        isdisabled.value = false
        selectedSessionIndex.value = index;
        sendactivetab(0, sessionId, link, title, text);
        visible.value = false;
      }
    }
  }
}


const visible = ref(false);
const UserSetting = useUserStore();
const router = useRouter()
const GotoExam = (exam: any, courseId: number) => {
  if (!userStore.user) {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول أولًا', life: 3000 });
    return;
  }
  if (props.isPaied && !props.isSubscribed) {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب شراء الكورس أولًا', life: 3000 });
    return;
  }
  if (isExamAttemptLocked(exam)) {
    toast.add({
      severity: 'warn',
      summary: 'الامتحان مغلق',
      detail: 'لقد أنهيت هذا الامتحان ولا يسمح المدرس بمحاولة أخرى.',
      life: 4500,
    });
    return;
  }
  if (isUpcoming(exam)) {
    toast.add({ severity: 'info', summary: 'لم يبدأ الامتحان بعد', detail: 'سيصبح الامتحان متاحًا تلقائيًا في الموعد المحدد.', life: 4000 });
    return;
  }
  if (isExpired(exam)) {
    toast.add({ severity: 'warn', summary: 'انتهى موعد الامتحان', detail: 'لا يمكن بدء محاولة جديدة بعد انتهاء الموعد.', life: 4500 });
    return;
  }

  router.push(`/course/${courseId}/${exam?.id}`)
}
</script>

<template>

  <Accordion v-if="CardDetails.length > 0" value="0" class="course-content-container">
    <AccordionPanel :value="index == 0 ? '0' : index" class="course-content-panel"
      v-for="(lesson, index) in CardDetails" :key="index" :class="{ 'active': activePanels.includes(index) }">
      <AccordionHeader class="course-content-header ">
        <span class="chapter-index">{{ String(index + 1).padStart(2, "0") }}</span>
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
          @click="handleSessionClick(thirdindex, session?.id, session?.link, session?.title, session?.text, session?.web_show_video, session?.is_paid)">

          <component :is="getIconByType(session?.type)" />
          <div class="session-name session-name2">
            <LockIcon v-if="!session?.web_show_video" />
            <p>{{ session?.title }} <span class="preview-badge" v-if="!session?.is_paid && !props.isSubscribed">مجانى</span></p>
            <p v-if="!session?.web_show_video">(هذا المحتوى حصرى للتطبيق فقط)</p>
          </div>

        </div>
        <div class="course-body-details course-exam" v-if="session?.exam"
          :class="{ 'course-exam--unavailable': !isExamAvailable(session?.exam) }"
          @click="GotoExam(session?.exam, CourseId)">
          <div class="session-name" :class="{
            'disabled': !isExamAvailable(session?.exam) || !userStore?.user
              || (isPaied == true && isSubscribed == false)
          }">

            <p>{{ session?.exam?.title }} (امتحان) </p>
            <component v-if="isExamAvailable(session?.exam)" :is="getIconByType(ContentTypeEnum.EXAM)" />
            <div v-else-if="isExamAttemptLocked(session?.exam)">
              <div class="exam-rate">
                <p class="rating" v-if="session?.exam.degree_type == 2" :class="session?.exam.mark < 6 ? 'failed' : ''">
                  {{ session?.exam.mark }} / {{ session?.exam.exam_mark }}</p>
                <p class="rating" v-if="session?.exam.degree_type == 1"
                  :class="(session?.exam.mark / session?.exam.exam_mark) * 100 < 50 ? 'failed' : ''"> {{
                    ((session?.exam.mark / session?.exam.exam_mark) * 100).toFixed(2) }} %</p>
              </div>
            </div>
            <span v-else-if="isExpired(session?.exam)" class="exam-inline-status">
              <i class="pi pi-calendar-times"></i> انتهى الموعد
            </span>
            <span v-else-if="isUpcoming(session?.exam)" class="exam-inline-status exam-inline-status--upcoming">
              <i class="pi pi-clock"></i> لم يبدأ بعد
            </span>
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


<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-content-stage-two.scss"></style>
