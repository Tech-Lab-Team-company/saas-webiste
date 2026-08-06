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
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);
const toast = useToast();
const isdisabled = ref(false)

function handleSessionClick(index: number, sessionId: number, link: string, title: string, text: string, show: boolean) {
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
      // console.log(props.isSubscribed, "props.isSubscribed")
      // console.log(props.isPaid, "props.isPaid")
      if (!props.isSubscribed && props.isPaied) {
        isdisabled.value = true
        // console.log("non")
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
const UserSetting = useUserStore();


const ExamTime = ref()
const isFinished = ref(false)
const GotoExam = (examId:number , StartTime:string , EndTime:string , CourseId:number , IsFinished:boolean)=>{
    const start = new Date(StartTime).getTime();
    const end = new Date(EndTime).getTime();
    const CurrentTime = new Date();
    ExamTime.value = Math.floor((end - start) / 1000 / 60);
    if(!IsFinished && ExamTime.value > 0){
      router.push(`/course/${CourseId}/timer?id=${examId}&time=${StartTime}`)
    }
    if(end-  CurrentTime.getTime() < 0){
      isFinished.value = true
      console.log(isFinished.value , "isfinished")
      console.log(end-  CurrentTime.getTime() , "end-  CurrentTime.getTime()")
    }
    else{
      isFinished.value = false

    }
   
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
                    <p v-if="!session?.web_show_video">(هذا المحتوى حصرى للتطبيق فقط)</p>
                  </div>
                </div>
                <div>
                </div>
                <component :is="getIconByType(session?.type)" />
              </div>

               <div  class="course-body-details course-exam"  v-if="session?.exam   "
               :class="((new Date(session?.exam?.end_time).getTime() - new Date().getTime() > 0) ) ? '':'disabled'"
               @click="GotoExam(session?.exam?.id , session?.exam?.start_time ,session?.exam?.end_time , CourseId  , session?.exam?.is_finished)"
               >
                <div class="session-name" :class="((new Date(session?.exam?.end_time).getTime() - new Date().getTime() > 0) ) ? '':'disabled'">
                  <p>{{ session?.exam?.title }} </p>
                  <component v-if="!session?.exam?.is_finished" :is="getIconByType(ContentTypeEnum.EXAM)" />
                  <div v-else>
                      <div class="exam-rate">
                        <p class="rating" v-if="session?.exam.degree_type == 2" :class="session?.exam.mark < 6 ? 'failed' : ''"> {{ session?.exam.mark }} / {{ session?.exam.exam_mark }}</p>
                        <p class="rating" v-if="session?.exam.degree_type == 1" :class="(session?.exam.mark / session?.exam.exam_mark)* 100 < 50 ? 'failed' : ''"> {{ ((session?.exam.mark / session?.exam.exam_mark)* 100).toFixed(2) }} %</p>
                      </div>
                  </div>
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


<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-content.scss"></style>
