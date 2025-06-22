<script setup lang="ts">

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


function getExtFromUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
  return match ? match[1].toLowerCase() : '';
}

const iconMap: Record<string, any> = {
  youtube: CourseVideoIcon,
  mp3: microphoneicon,
  pdf: coursenotesicon,
  mp4: CourseVideoIcon,
  // add more as needed
};

function getIconByExt(link: string) {
  const ext = getExtFromUrl(link);
  return iconMap[ext] || CourseVideoIcon; // fallback icon
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

function handleSessionClick(index: number, link: string, title: string, text: string) {
  if (!userStore.user) return;
  selectedSessionIndex.value = index;
  sendactivetab(0, link, title, text);
}
</script>

<template>


  <Accordion value="0" class="course-content-container">
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
                <component :is="getIconByExt(session?.link)"/>
                <p>{{ session?.title }} </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

