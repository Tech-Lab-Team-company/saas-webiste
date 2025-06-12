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
import bookicon from '~/public/icons/bookicon.vue';


import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';

const props = defineProps({
  CourseData: {
    type: Object as () => UnitsModel | null,
    default: null
  }
});

const CardDetails = ref(props.CourseData);

watch(() => props.CourseData, (newValue) => {
  CardDetails.value = newValue;
}, {immediate: true});


const contents = ref([
  {
    icon: CourseVideoIcon,
    content: `شرح ل`,
  },
  {
    icon: coursenotesicon,
    content: 'مقدمه ل',
  },
  {
    icon: microphoneicon,
    content: 'شرح مسجل ل',
  },
  {
    icon: bookicon,
    content: 'إمتحان على',
  },
])


const router = useRouter();
const activePanels = ref<number[]>([]);
const SecondactivePanels = ref<number[]>([]);
const thirdactivePanels = ref<number[]>([]);
const activetab = ref(1)

const emit = defineEmits(['coursechanged']);

const sendactivetab = (activetabvalue: number, link: string, title: string, description: string) => {
  activetab.value = activetabvalue;
  // if (activetabvalue == 0) {

    emit('coursechanged', {activetabvalue: activetabvalue, link: link, title: title, description: description});
  // } else {
  //
  //   emit('coursechanged', {activetabvalue: activetabvalue});
  // }

}


const activeIndices = ref<number[]>([]);


</script>

<template>


  <Accordion value="0" class="course-content-container">

    <AccordionPanel
        :value="index"
        class="course-content-panel"
        v-for="(unit ,index) in CardDetails"
        :key="index"
        :class="{ 'active': activePanels.includes(index) }"
    >
      <AccordionHeader class="course-content-header ">{{ unit?.title }}</AccordionHeader>
      <AccordionContent class="course-content-body">
        <Accordion value="0" class="course-class-container" v-model:activeIndex="activeIndices"
                   v-for="(lesson ,secondindex) in unit.lessons" :key="secondindex">
          <AccordionPanel
              :class="{ 'active': SecondactivePanels.includes(secondindex) }"
              :value="secondindex"
              class="course-class-panel"
          >
            <AccordionHeader class="course-class-header"> {{ lesson.title }}</AccordionHeader>

            <hr class="course-class-hr"/>
            <AccordionContent class="course-class-body">
              <div class="course-body-details" :key="thirdindex" v-for="(session ,thirdindex) in lesson?.sessions"
                   @click=" sendactivetab(0 ,session.link ,session.title ,session.text)">
                <component :is="contents[0]?.icon"/>
                <p>{{ contents[0]?.content }} {{ session.title }} </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

