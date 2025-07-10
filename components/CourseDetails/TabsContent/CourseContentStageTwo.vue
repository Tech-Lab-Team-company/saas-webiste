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

function handleSessionClick(index: number, link: string, title: string, text: string, show: boolean) {
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
      if (!props.isSubscribed && props.isPaied) {
        isdisabled.value = true
        toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب شراء الكورس اولا ', life: 3000 });
        // console.log("non")
      }
      else if (props.isSubscribed && props.isPaied) {
        isdisabled.value = false
        selectedSessionIndex.value = index;
        sendactivetab(0, link, title, text);
        visible.value = false;
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
const handelExam = (isFinished:boolean)=>{
  if( (isFinished || !userStore?.user || (UserSetting.setting?.join_option_status != 2)
      || (props.isPaied == true && props?.isSubscribed == false))){

    toast.add({ severity: 'info', summary: 'تنبيه', detail: ' يجب شراء الكورس اولا ', life: 3000 })
  }else{

  }
 
}
</script>

<template>

  <Accordion v-if="CardDetails.length > 0" value="0" class="course-content-container">
    <AccordionPanel :value="index == 0 ? '0' : index" class="course-content-panel"
      v-for="(lesson, index) in CardDetails" :key="index" :class="{ 'active': activePanels.includes(index) }">
      <AccordionHeader class="course-content-header ">{{ lesson?.title }}</AccordionHeader>
      <AccordionContent class="course-class-body" v-for="(session, thirdindex) in lesson?.sessions">
        <div class="course-body-details" :key="thirdindex"
          :class="[selectedSessionIndex === thirdindex ? 'active' : '', isdisabled == true ? 'disabled' : '']"
          @click="handleSessionClick(thirdindex, session?.link, session?.title, session?.text, session?.web_show_video)">

          <component :is="getIconByType(session?.type)" />
          <div class="session-name">
            <p v-if="!session?.web_show_video">(هذا المحتوى حصرى للتطبيق فقط)</p>
            <p>{{ session?.title }} </p>
            <LockIcon v-if="!session?.web_show_video" />
          </div>

        </div>
        <div class="course-body-details course-exam" v-if="session?.exam"
          @click="GotoExam(session?.exam?.id, session?.exam?.start_time, session?.exam?.end_time, CourseId, session?.exam?.is_finished)">
          <div class="session-name" :class="{
            'disabled': session?.exam?.is_finished || !userStore?.user || (UserSetting.setting?.join_option_status != 2)
              || (isPaid == true && isSubscribed == false)
          }" 
          @click="handelExam(session?.exam?.is_finished)">

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
.empty-content {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.stores-logos-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .stores-logos-link {
    width: 50%;

    .stores-logos-apple {
      width: 88%;
    }
  }

}

.course-body-details {
  position: relative;
  justify-content: space-between;

  .disabled {
    pointer-events: none;
    // opacity: 0.5;
    cursor: not-allowed;

  }

  @media (max-width:768px) {
    flex-direction: column;
  }
}



// course-exam
.session-name {
  // display: flex;
  // align-items: center;
  // gap: 5px;
  // position: relative;
  display: flex;
  justify-content: space-between;
  gap: 21px;
  flex-direction: row-reverse;
  width: 100%;


  @media(max-width:768px) {
    flex-direction: column;
  }
}

.course-body-details {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  box-shadow: 3px 3px 3px 0 #00000038;
  padding: 0.7rem;
  border-radius: 10px;



  &:has(.disabled) {
    cursor: not-allowed !important;
    // opacity: 0.5 !important;
    pointer-events: none !important;
  }


}
</style>