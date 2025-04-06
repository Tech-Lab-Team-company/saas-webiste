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


    const content = ref([
        {
            title: 'الوحدة الاولى',
            content: [
                {
                    className: 'الحصة الاولى',     
                    classcontent: [
                        {
                            icon:CourseVideoIcon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:coursenotesicon,
                            content:'مقدمه في النحو والبلاغه',
                        },
                        {
                            icon:microphoneicon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:bookicon,
                            content:'إمتحان علي اساسيات النحو',
                        },
                    ]
                },
                {
                    className: 'الحصة الثانية',     
                    classcontent: [
                    {
                            icon:CourseVideoIcon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:coursenotesicon,
                            content:'مقدمه في النحو والبلاغه',
                        },
                        {
                            icon:microphoneicon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:bookicon,
                            content:'إمتحان علي اساسيات النحو',
                        },
                    ]
                },
            ]
        },
        {
            title: 'الوحدة الثانية',
            content:  [
                {
                    className: 'الحصة الاولى',     
                    classcontent: [
                    {
                            icon:CourseVideoIcon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:coursenotesicon,
                            content:'مقدمه في النحو والبلاغه',
                        },
                        {
                            icon:microphoneicon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:bookicon,
                            content:'إمتحان علي اساسيات النحو',
                        },
                    ]
                }
            ]
        },
        {
            title: 'الوحدة الثالثة',
            content:  [
                {
                    className: 'الحصة الاولى',     
                    classcontent: [
                    {
                            icon:CourseVideoIcon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:coursenotesicon,
                            content:'مقدمه في النحو والبلاغه',
                        },
                        {
                            icon:microphoneicon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:bookicon,
                            content:'إمتحان علي اساسيات النحو',
                        },
                    ]
                }
            ]
        },
        {
            title: 'الوحدة الرابعة',
            content:  [
                {
                    className: 'الحصة الاولى',     
                    classcontent: [
                    {
                            icon:CourseVideoIcon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:coursenotesicon,
                            content:'مقدمه في النحو والبلاغه',
                        },
                        {
                            icon:microphoneicon,
                            content:'شرح اساسيات النحو',
                        },
                        {
                            icon:bookicon,
                            content:'إمتحان علي اساسيات النحو',
                        },
                    ]
                }
            ]
        }
        
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
            v-for="(item ,index) in content" 
            :key="item.title" 
            >
            <AccordionHeader class="course-content-header" >{{ item.title }}</AccordionHeader>
            <AccordionContent class="course-content-body" >
                    <Accordion value="0" class="course-class-container"  v-for="classname in item.content">
                        <AccordionPanel 
                            :class="{ 'active': activePanels.includes(index) }"
                            :value="index" 
                            class="course-class-panel" 
                            >
                           
                            <AccordionHeader class="course-class-header" >  {{ classname.className}}</AccordionHeader>
                            <hr class="course-class-hr" />
                            <AccordionContent class="course-class-body"  >
                                
                                <div class="course-body-details " v-for="(classes , index) in classname.classcontent" :key="index"  @click=" sendactivetab(index)" >
                                    <component :is="classes.icon" />
                                    <p>{{ classes.content}}</p>
                                </div>
                                
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>

            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>


<style scoped lang="scss">

.course-content-container{
    .course-content-panel{       
        &.p-accordionpanel-active{
            .course-content-header{
                border: none;
                background-color: #FFB949;
                color: white;
                border-radius: 5px;
            }
        }
    }
}

.hr{
    
}


</style>
