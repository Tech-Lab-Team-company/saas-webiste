<script setup lang="ts">

    // import Accordion from 'primevue/accordion';
    // import AccordionPanel from 'primevue/accordionpanel';
    // import AccordionHeader from 'primevue/accordionheader';
    // import AccordionContent from 'primevue/accordioncontent';

    import Accordion from 'primevue/accordion';
    import AccordionPanel from 'primevue/accordionpanel';
    import AccordionHeader from 'primevue/accordionheader';
    import AccordionContent from 'primevue/accordioncontent';
    import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
    import coursenotesicon from '~/public/icons/coursenotesicon.vue';
    import microphoneicon from '~/public/icons/microphoneicon.vue';
    import bookicon from '~/public/icons/bookicon.vue';
   

    import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
    const props = defineProps({
    CourseData: {
        type: Object as () => CourseDetailsModel | null,
        default: null
    }
    });

    const CardDetails = ref(props.CourseData);

    watch(() => props.CourseData, (newValue) => {
        CardDetails.value = newValue;
    }, { immediate: true });
        



    const contents = ref([
        {
                icon:CourseVideoIcon,
                content:`شرح ل`,
            },
            {
                icon:coursenotesicon,
                content:'مقدمه ل',
            },
            {
                icon:microphoneicon,
                content:'شرح مسجل ل',
            },
            {
                icon:bookicon,
                content:'إمتحان على',
            },
        ])


    const router = useRouter();
    const  activePanels = ref<number[]>([]); 
    const activetab = ref(1)

    const emit = defineEmits(['coursechanged']);

    const sendactivetab = (activetabvalue: number)=>{
        activetab.value = activetabvalue;
        emit('coursechanged', activetabvalue);
        
        if(activetabvalue == 3){
        }
    
    }

  


</script>

<template>



    <Accordion value="0" class="course-content-container">
        <AccordionPanel 
            :class="{ 'active': activePanels.includes(index) }"
            :value="index" 
            class="course-content-panel" 
            v-for="(unit ,index) in CardDetails?.units" 
            :key="index" 
            >
            <AccordionHeader class="course-content-header " >{{ unit.title }}</AccordionHeader>
            <AccordionContent class="course-content-body" >
                    <Accordion value="0" class="course-class-container"  v-for="(lesson ,secondindex) in unit.lessons" :key="secondindex">
                        <AccordionPanel 
                            :class="{ 'active': activePanels.includes(secondindex) }"
                            :value="secondindex" 
                            class="course-class-panel" 
                            >
                            <AccordionHeader class="course-class-header" >  {{ lesson.title}}</AccordionHeader>
                            <hr class="course-class-hr" />
                            <AccordionContent class="course-class-body"  >
          
                                <div class="course-body-details " v-for="(content , index) in contents" :key="index"  @click=" sendactivetab(index)" >
                                    <component :is="content.icon" />
                                    <!-- {{ console.log(lesson?.sessions?.title) }} -->
                                    <p>{{ content.content}}  </p>
                                </div>                
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </template>


<style lang="scss"></style>
