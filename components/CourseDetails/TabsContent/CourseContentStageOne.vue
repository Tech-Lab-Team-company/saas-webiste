<script setup lang="ts">

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import coursenotesicon from '~/public/icons/coursenotesicon.vue';
import microphoneicon from '~/public/icons/microphoneicon.vue';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import { useUserStore } from "~/stores/user";
import type LessonsModel from '~/features/FetchCourseDetails/Data/models/lessons_model';
import type SessionsModel from '~/features/FetchCourseDetails/Data/models/sessions_model';
import { ContentTypeEnum } from "~/components/CourseDetails/Enum/content_type_enum";
import LockIcon from '~/public/icons/LockIcon.vue';

const props = defineProps({
  CourseData: {
    type: Object as () => SessionsModel | null,
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
const CourseId = ref(props.courseId);

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

const userStore = useUserStore()
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);
const toast = useToast();
const isdisabled = ref(false)

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
        // console.log("non")
      }
      else if (props.isSubscribed && props.isPaied) {
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
const visible = ref(false)
const UserSetting = useUserStore();

const router = useRouter();
const ExamTime = ref()
const GotoExam = (examId:number , StartTime:string , EndTime:string , CourseId:number , IsFinished:boolean)=>{
    const start = new Date(StartTime).getTime();
    const end = new Date(EndTime).getTime();
    ExamTime.value = Math.floor((end - start) / 1000 / 60);
    if(!IsFinished && ExamTime.value > 0){
      router.push(`/course/${CourseId}/timer?id=${examId}&time=${StartTime}`)
    }
}
</script>

<template>

  <div v-if="CourseData?.length > 0" :key="index" v-for="(session, index) in CourseData">

    <div class="course-body-details"
      :class="[selectedSessionIndex === thirdindex ? 'active' : '', isdisabled == true ? 'disabled' : '']"
      @click="handleSessionClick(Number(index), session?.link, session?.title, session?.text, session?.web_show_video)">
      <component :is="getIconByType(session?.type)" />
      <div class="session-name">
        <p v-if="!session?.web_show_video">(هذا المحتوى حصرى للتطبيق فقط)</p>
        <p>{{ session?.title }} </p>
        <LockIcon v-if="!session?.web_show_video" />
      </div>


          <!-- <div class="course-body-details course-exam" v-if="session?.exam"
          @click="GotoExam(session?.exam?.id, session?.exam?.start_time, session?.exam?.end_time, CourseId, session?.exam?.is_finished)">
          <div class="session-name" :class="{
            'disabled': session?.exam?.is_finished || !userStore?.user || (UserSetting.setting?.join_option_status != 2)
              || (isPaid == true && isSubscribed == false)
          }">
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
        </div> -->
      <!-- {{ console.log(session.exam , "session.exam") }}
      <div class="course-body-details course-exam" v-if="session?.exam"
        @click="GotoExam(session?.exam?.id, session?.exam?.start_time, session?.exam?.end_time, CourseId, session?.exam?.is_finished)">
        <div class="session-name">
          <p>{{ session?.exam?.title }} </p>
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
      </div> -->
    </div>

  </div>

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
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;

}

.session-name {
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  justify-content: space-between;
}

.course-body-details {
  margin-left: auto;
  margin-right: auto;
  background: white;
  display: flex;
  justify-content: space-between;
  color: black;
  width: 70%;
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 0.7rem;
  box-shadow: 3px 3px 3px 2px #00000038;


}
</style>
