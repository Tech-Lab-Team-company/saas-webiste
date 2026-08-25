<script setup lang="ts">
import { ContentTypeEnum } from '~/components/CourseDetails/Enum/content_type_enum';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import { useUserStore } from "~/stores/user";
import { isExamAttemptLocked } from '~/utils/examAttempts';
const props = defineProps({
  CourseData: {
    type: Object as () => UnitsModel | null,
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
  courseId:{
    type: Number
  }
});

const CardDetails = ref(props.CourseData);
const CourseId = ref(props.courseId)

watch(() => props.CourseData, (newValue) => {
  CardDetails.value = newValue;
}, { immediate: true });

interface ContentTypeMeta {
  icon: string;
  label: string;
}

const typeMetaMap: Record<ContentTypeEnum, ContentTypeMeta> = {
  [ContentTypeEnum.VIDEO]: { icon: 'pi pi-play', label: 'فيديو' },
  [ContentTypeEnum.PDF]: { icon: 'pi pi-file-pdf', label: 'ملف PDF' },
  [ContentTypeEnum.AUDIO]: { icon: 'pi pi-volume-up', label: 'محتوى صوتي' },
  [ContentTypeEnum.VIDEO_PDF]: { icon: 'pi pi-clone', label: 'فيديو وملف' },
  [ContentTypeEnum.AUDIO_PDF]: { icon: 'pi pi-headphones', label: 'صوت وملف' },
  [ContentTypeEnum.GENERALSESSION]: { icon: 'pi pi-file', label: 'محتوى تعليمي' },
  [ContentTypeEnum.EXAM]: { icon: 'pi pi-file-edit', label: 'اختبار' },
};

function getTypeMeta(type?: number | null): ContentTypeMeta {
  return typeMetaMap[type as ContentTypeEnum] || typeMetaMap[ContentTypeEnum.GENERALSESSION];
}

const formatLessonCount = (count: number) =>
  count === 1 ? "درس واحد" : count === 2 ? "درسان" : `${count} دروس`;

const formatContentCount = (count: number) =>
  count === 1 ? "عنصر واحد" : count === 2 ? "عنصران" : `${count} عناصر`;


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

const userStore = useUserStore()
const { isOpen, isExpired, isUpcoming } = useExamAvailabilityClock();
const isExamAvailable = (exam: unknown) =>
  isOpen(exam) && !isExamAttemptLocked(exam);

const selectedSessionId = ref<number | null>(null);
const toast = useToast();
const { promptCourseSubscription } = useCourseAccessPrompt();
const isdisabled = ref(false)

function handleSessionClick(sessionId: number, link: string, title: string, text: string, show: boolean) {
  if (show === false) {
    visible.value = true;
    return;
  }

  if (!userStore.user) {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول', life: 3000 });
    // return;
  }
  else {
    if (show === true) {
      // console.log(props.isSubscribed, "props.isSubscribed")
      // console.log(props.isPaid, "props.isPaid")
      if (!props.isSubscribed && props.isPaied) {
        isdisabled.value = true
        promptCourseSubscription(props.CourseStatus);
        return;
      }
      else if (props.isSubscribed && props.isPaied) {
        isdisabled.value = false
        selectedSessionId.value = sessionId;
        sendactivetab(0, sessionId, link, title, text);
        visible.value = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });

      }
      else if ((!props.isPaied)) {
        isdisabled.value = false
        selectedSessionId.value = sessionId;
        sendactivetab(0, sessionId, link, title, text);
        visible.value = false;
      }
    }
  }
}
//  <Nuxt-link  v-if="!(exam?.is_finished) " :to="`/course/${course_id}/timer?id=${exam.id}&time=${exam.start_time}`"

const router = useRouter();
const visible = ref(false);


const isFinished = ref(false)
const GotoExam = (exam:any, CourseId:number)=>{
    if (!userStore.user) {
      toast.add({ severity: 'info', summary: 'سجّل الدخول أولًا', detail: 'يلزم تسجيل الدخول لبدء الامتحان.', life: 3500 });
      return;
    }
    if (props.isPaied && !props.isSubscribed) {
      promptCourseSubscription(props.CourseStatus);
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
      isFinished.value = true
      toast.add({ severity: 'warn', summary: 'انتهى موعد الامتحان', detail: 'لا يمكن بدء محاولة جديدة بعد انتهاء الموعد.', life: 4500 });
      return;
    }
    isFinished.value = false
    router.push(`/course/${CourseId}/${exam?.id}`)
}
</script>

<template>


  <Accordion value="0" class="course-content-container" v-if="CardDetails.length > 0">
    <AccordionPanel :value="index == 0 ? '0' : index" class="course-content-panel" v-for="(unit, index) in CardDetails"
      :key="unit?.id || index" :class="{ 'active': activePanels.includes(index) }">
      <AccordionHeader class="course-content-header">
        <span class="chapter-index">
          <small>الوحدة</small>
          <strong>{{ String(index + 1).padStart(2, "0") }}</strong>
        </span>
        <span class="accordion-heading-copy">
          <span class="accordion-title">{{ unit?.title }}</span>
          <span class="accordion-count" v-if="unit?.lessons?.length">
            <i class="pi pi-book" aria-hidden="true"></i>
            {{ formatLessonCount(unit?.lessons?.length) }}
          </span>
        </span>
        <template #toggleicon="{ active }">
          <span class="accordion-toggle" aria-hidden="true">
            <span class="accordion-toggle-label">{{ active ? "إخفاء الوحدة" : "عرض الوحدة" }}</span>
            <i :class="active ? 'pi pi-minus' : 'pi pi-plus'"></i>
          </span>
        </template>
      </AccordionHeader>

      <AccordionContent class="course-content-body">
        <Accordion value="0" class="course-class-list">
          <AccordionPanel v-for="(lesson, secondindex) in unit?.lessons" :key="lesson?.id || secondindex"
            :class="{ 'active': SecondactivePanels.includes(secondindex) }" :value="secondindex"
            class="course-class-panel">
            <AccordionHeader class="course-class-header">
              <span class="lesson-index">
                <small>الدرس</small>
                <strong>{{ String(secondindex + 1).padStart(2, "0") }}</strong>
              </span>
              <span class="accordion-heading-copy">
                <span class="accordion-title">{{ lesson?.title }}</span>
                <span class="accordion-count" v-if="lesson?.sessions?.length">
                  <i class="pi pi-list" aria-hidden="true"></i>
                  {{ formatContentCount(lesson?.sessions?.length) }}
                </span>
              </span>
              <template #toggleicon="{ active }">
                <span class="lesson-toggle" aria-hidden="true">
                  <i :class="active ? 'pi pi-minus' : 'pi pi-plus'"></i>
                </span>
              </template>
            </AccordionHeader>

            <AccordionContent class="course-class-body">
              <template v-for="(session, thirdindex) in lesson?.sessions" :key="session?.id || thirdindex">
                <button class="course-body-details" type="button"
                  :class="[
                    selectedSessionId === session?.id ? 'active' : '',
                    isdisabled ? 'disabled' : '',
                    !session?.web_show_video ? 'course-body-details--app-only' : '',
                  ]"
                  @click="handleSessionClick(session?.id, session?.link, session?.title, session?.text, session?.web_show_video)">
                  <span class="session-type-icon" aria-hidden="true">
                    <i :class="getTypeMeta(session?.type).icon"></i>
                  </span>
                  <span class="session-name session-name2">
                    <span class="session-name__title">
                      <strong>{{ session?.title }}</strong>
                      <span class="preview-badge" v-if="!session?.is_paid && !props.isSubscribed">معاينة مجانية</span>
                    </span>
                    <span class="session-name__meta">
                      <span>{{ getTypeMeta(session?.type).label }}</span>
                      <span v-if="!session?.web_show_video">
                        <i class="pi pi-mobile" aria-hidden="true"></i>
                        متاح عبر تطبيق الموبايل فقط
                      </span>
                    </span>
                  </span>
                  <span class="session-row-action" aria-hidden="true">
                    <i :class="session?.web_show_video ? 'pi pi-arrow-left' : 'pi pi-mobile'"></i>
                  </span>
                </button>

                <button class="course-body-details course-exam" type="button" v-if="session?.exam"
                  :class="{ 'course-exam--unavailable': !isExamAvailable(session?.exam) }"
                  @click="GotoExam(session?.exam, CourseId)">
                  <span class="session-type-icon course-exam__icon" aria-hidden="true">
                    <i class="pi pi-file-edit"></i>
                  </span>
                  <span class="session-name session-name2">
                    <span class="session-name__title"><strong>{{ session?.exam?.title }}</strong></span>
                    <span class="session-name__meta"><span>اختبار على محتوى الدرس</span></span>
                  </span>
                  <span v-if="isExamAvailable(session?.exam)" class="session-row-action" aria-hidden="true">
                    <i class="pi pi-arrow-left"></i>
                  </span>
                  <span v-else-if="isExamAttemptLocked(session?.exam)" class="exam-rate">
                    <span class="rating" v-if="session?.exam.degree_type == 2" :class="session?.exam.mark < 6 ? 'failed' : ''">
                      {{ session?.exam.mark }} / {{ session?.exam.exam_mark }}
                    </span>
                    <span class="rating" v-if="session?.exam.degree_type == 1"
                      :class="(session?.exam.mark / session?.exam.exam_mark) * 100 < 50 ? 'failed' : ''">
                      {{ ((session?.exam.mark / session?.exam.exam_mark) * 100).toFixed(2) }} %
                    </span>
                  </span>
                  <span v-else-if="isExpired(session?.exam)" class="exam-inline-status">
                    <i class="pi pi-calendar-times"></i> انتهى الموعد
                  </span>
                  <span v-else-if="isUpcoming(session?.exam)" class="exam-inline-status exam-inline-status--upcoming">
                    <i class="pi pi-clock"></i> لم يبدأ بعد
                  </span>
                </button>
              </template>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

  <div v-else>
    <NuxtImg class="empty-content" src="/images/EmptyContent.png" alt="empty content" />
  </div>

  <CourseDetailsAppOnlyContentDialog v-model:visible="visible" />



</template>


<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-content.scss"></style>
