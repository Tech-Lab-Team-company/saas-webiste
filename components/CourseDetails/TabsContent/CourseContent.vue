<script setup lang="ts">
import { ContentTypeEnum } from '~/components/CourseDetails/Enum/content_type_enum';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import coursenotesicon from '~/public/icons/coursenotesicon.vue';
import microphoneicon from '~/public/icons/microphoneicon.vue';
import examsicon from '~/public/icons/examsicon.vue';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import { useUserStore } from "~/stores/user";
import LockIcon from '~/public/icons/LockIcon.vue';
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

const typeIconMap: Record<ContentTypeEnum, any> = {
  [ContentTypeEnum.VIDEO]: CourseVideoIcon,
  [ContentTypeEnum.PDF]: coursenotesicon,
  [ContentTypeEnum.AUDIO]: microphoneicon,
  [ContentTypeEnum.VIDEO_PDF]: CourseVideoIcon,
  [ContentTypeEnum.AUDIO_PDF]: microphoneicon,
  [ContentTypeEnum.GENERALSESSION]: coursenotesicon,
  [ContentTypeEnum.EXAM]: examsicon,
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

const userStore = useUserStore()
const { isOpen, isExpired, isUpcoming } = useExamAvailabilityClock();
const isExamAvailable = (exam: unknown) =>
  isOpen(exam) && !isExamAttemptLocked(exam);
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);
const toast = useToast();
const { promptCourseSubscription } = useCourseAccessPrompt();
const isdisabled = ref(false)

function handleSessionClick(index: number, sessionId: number, link: string, title: string, text: string, show: boolean) {
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
      :key="index" :class="{ 'active': activePanels.includes(index) }">

      <AccordionHeader class="course-content-header ">
        <span class="chapter-index">{{ String(index + 1).padStart(2, "0") }}</span>
        <span class="accordion-heading-copy">
          <span class="accordion-title">{{ unit?.title }}</span>
          <span class="accordion-count" v-if="unit?.lessons?.length">
            <i class="pi pi-book" aria-hidden="true"></i>
            {{ unit?.lessons?.length }} {{ $t("lesson") }}
          </span>
        </span>
      </AccordionHeader>
      <AccordionContent class="course-content-body">
        <Accordion value="0" class="course-class-container" v-model:activeIndex="activeIndices"
          v-for="(lesson, secondindex) in unit?.lessons" :key="secondindex">
          <AccordionPanel :class="{ 'active': SecondactivePanels.includes(secondindex) }" :value="secondindex"
            class="course-class-panel">
            <AccordionHeader class="course-class-header">
              <span class="accordion-heading-copy">
                <span class="accordion-title">{{ lesson?.title }}</span>
                <span class="accordion-count" v-if="lesson?.sessions?.length">
                  {{ lesson?.sessions?.length }} {{ $t("course_items") }}
                </span>
              </span>
            </AccordionHeader>

            <hr class="course-class-hr" />
            <AccordionContent class="course-class-body" v-for="(session, thirdindex) in lesson?.sessions">
              <div class="course-body-details" :key="thirdindex" 
                :class="[selectedSessionIndex === thirdindex ? 'active' : '', isdisabled == true ? 'disabled' : '']"
                @click="handleSessionClick(thirdindex, session?.id, session?.link, session?.title, session?.text, session?.web_show_video);">
                <div class="session-name">
                  <div class="session-name session-name3">

                    <LockIcon v-if="!session?.web_show_video" />
                    <p>{{ session?.title }} </p>
                    <p v-if="!session?.web_show_video">(هذا المحتوى حصري لتطبيق الموبايل فقط)</p>
                  </div>
                </div>
                <div>
                </div>
                <component :is="getIconByType(session?.type)" />
              </div>

               <div  class="course-body-details course-exam"  v-if="session?.exam   "
               :class="isExamAvailable(session?.exam) ? '' : 'disabled'"
               @click="GotoExam(session?.exam, CourseId)"
               >
                <div class="session-name" :class="isExamAvailable(session?.exam) ? '' : 'disabled'">
                  <p>{{ session?.exam?.title }} </p>
                  <component v-if="isExamAvailable(session?.exam)" :is="getIconByType(ContentTypeEnum.EXAM)" />
                  <div v-else-if="isExamAttemptLocked(session?.exam)">
                      <div class="exam-rate">
                        <p class="rating" v-if="session?.exam.degree_type == 2" :class="session?.exam.mark < 6 ? 'failed' : ''"> {{ session?.exam.mark }} / {{ session?.exam.exam_mark }}</p>
                        <p class="rating" v-if="session?.exam.degree_type == 1" :class="(session?.exam.mark / session?.exam.exam_mark)* 100 < 50 ? 'failed' : ''"> {{ ((session?.exam.mark / session?.exam.exam_mark)* 100).toFixed(2) }} %</p>
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
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

  <div v-else>
    <NuxtImg class="empty-content" src="/images/EmptyContent.png" alt="empty content" />
  </div>

  <CourseDetailsAppOnlyContentDialog v-model:visible="visible" />



</template>


<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-content.scss"></style>
