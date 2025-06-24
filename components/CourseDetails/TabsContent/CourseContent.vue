<script setup lang="ts">
import { ContentTypeEnum } from '~/components/CourseDetails/Enum/content_type_enum';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

// import Accordion from 'primevue/accordion';
// import AccordionPanel from 'primevue/accordionpanel';
// import AccordionHeader from 'primevue/accordionheader';
// import AccordionContent from 'primevue/accordioncontent';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import coursenotesicon from '~/public/icons/coursenotesicon.vue';
import microphoneicon from '~/public/icons/microphoneicon.vue';
// import bookicon from '~/public/icons/bookicon.vue';


// import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import {useUserStore} from "~/stores/user";
import CourseContentStageTwo from './CourseContentStageTwo.vue';

const props = defineProps({
  CourseData: {
    type: Object as () => UnitsModel | null,
    default: null
  },
  CourseStatus:{
    type: Number,

  }
});

const CardDetails = ref(props.CourseData);

watch(() => props.CourseData, (newValue) => {
  CardDetails.value = newValue;
}, {immediate: true});

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
  emit('coursechanged', {activetabvalue: activetabvalue, link: link, title: title, description: description});
}

const userStore = useUserStore()
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);
const toast = useToast();

function handleSessionClick(index: number, link: string, title: string, text: string) {
  if (!userStore.user){
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول', life: 3000 });
    // return;
  }
  else{

    selectedSessionIndex.value = index;
    sendactivetab(0, link, title, text);
  }
}
</script>

<template>


  <Accordion value="0" class="course-content-container" >
    <AccordionPanel
        :value="index == 0 ? '0' : index"
        class="course-content-panel"
        v-for="(unit ,index) in CardDetails"
        :key="index"
        :class="{ 'active': activePanels.includes(index) }"
    >
   
      <AccordionHeader class="course-content-header ">{{ unit?.title }}</AccordionHeader>
      <AccordionContent class="course-content-body">
        <Accordion value="0" class="course-class-container" v-model:activeIndex="activeIndices"
                   v-for="(lesson ,secondindex) in unit?.lessons" :key="secondindex">
          <AccordionPanel
              :class="{ 'active': SecondactivePanels.includes(secondindex) }"
              :value="secondindex"
              class="course-class-panel"
          >
            <AccordionHeader class="course-class-header"> {{ lesson?.title }}</AccordionHeader>

            <hr class="course-class-hr"/>
            <AccordionContent class="course-class-body">
              <div class="course-body-details" :key="thirdindex" v-for="(session ,thirdindex) in lesson?.sessions"
                   :class="[
                     (!userStore.user && CardDetails?.isPaid) ? 'disabled' : '', 
                    (props.CourseStatus !== 2 && CardDetails?.isPaid) ? 'disabled' : '',
                      selectedSessionIndex === thirdindex ? 'active' : ''
                    ]"
                   @click="handleSessionClick(thirdindex, session?.link, session?.title, session?.text)">
                <p>{{ session?.title }} </p>
                <component :is="getIconByType(session?.type)"/>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>



</template>


<style scoped lang="scss">
.course-class-container .course-class-panel .course-class-body .course-body-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  box-shadow: 3px 3px 3px 0 #00000038;
  padding: 0.7rem;
  border-radius: 10px;
  width: 100%;
}
</style>
