<script setup lang="ts">

import Accordion from 'primevue/accordion';
    import AccordionPanel from 'primevue/accordionpanel';
    import AccordionHeader from 'primevue/accordionheader';
    import AccordionContent from 'primevue/accordioncontent';

import clockicon from '~/public/icons/clockicon.vue';
import AddMedia from '~/components/helper/AddMedia.vue';
import Image from 'primevue/image';
import SubmitHomeWorkParams from '~/features/HomeWorkSubmit/Core/Params/submit_homework_params';
import SubmitHomeworkController from '~/features/HomeWorkSubmit/presentation/controllers/submit_homework_controller';
import  AttachmentModel from '~/features/FetchCourseDetails/Data/models/attachment_model';

const props = defineProps({
  CourseData: {
    type: Object as () => [] | null,
    default: null
  }
});

const CardDetails = ref(props.CourseData);

watch(() => props.CourseData, (newValue) => {
    CardDetails.value = newValue;
}, { immediate: true });
    

   const activeIndices = ref<number[]>([]);
    const  activePanels = ref<number[]>([]);
    const  SecondactivePanels = ref<number[]>([]); 
    const  thirdactivePanels = ref<number[]>([]); 
    const activetab = ref(1)


    const image = ref<File | null>(null)

    const updateFiles = async (files: File[]) => {
    //    image.value = files.map((file) => new File(image.value,""))
        image.value = files[0]
    };

  
    const notes = ref('');

    const SubmitHomeWork = async (HomeworkId:number)=>{
        const submithomeworkParams = new SubmitHomeWorkParams(HomeworkId,notes.value ,image.value);
        const submitHomeworkController = SubmitHomeworkController.getInstance();
        const state = await submitHomeworkController.SubmitHomeWork(submithomeworkParams)
    }

    onMounted(
        ()=>{
            console.log("welcome")
        }
    )

    const text = ref('text')
</script>


  
<template>
    <div class="homework-card">
        <Accordion value="0" >
            <template #collapseicon>
                <p class="collapse-text">{{ $t('اعرض تفاصيل الواجب') }}</p>
            </template>
            <template #expandicon>
                <p class="collapse-text">{{ $t('اعرض تفاصيل الواجب') }}</p>
            </template>
            <AccordionPanel expandIcon="title" class="panels" :value="index" v-for="(homework , index) in CardDetails" :key="index">
                <AccordionHeader class="panel-header">
     
                    <div class="panel-header-container">

                        <p class="homework-title">{{ homework?.title }}</p>
                        
                        <div class="homework-content">
                            <div class="homework-date">
                                <p>{{ homework?.start_time }}</p>
                                <clockicon class="clock-icon" />
                            </div>
                            <p>{{ homework?.description }}</p>
                        </div>
                    </div>

                </AccordionHeader>
                <AccordionContent>
                    <div class="homework-attachments">
                        <Image v-for="image in homework?.attachments" :src="image.file" :alt="image.alt" width="250" preview />

                    </div>
                    <div class="homework-content-container">
                        <p class="homework-content-title">{{ homework?.title  }}</p>
                        <p class="homework-content-subtitle">{{ homework?.text  }}</p>
                    </div>
                    <div class="homework-hr">
                        <hr class="homework-right-hr"/>
                        <hr class="homework-left-hr"/>
                    </div>
                    <div class="homework-upload">
                        <p class="homework-upload-title">{{ $t('ارفق صوره الاجابه') }}</p>
                        <AddMedia 
                            class="add-media"
                            :index="index"
                            @update:images="updateFiles"
                        />
                        <input type="text" class="notes-input" placeholder="ملاحظات" v-model="notes">
                    </div>
                    <div class="btn-container">
                        <button class="submit-image" @click="SubmitHomeWork(homework?.id)">{{ $t('ارفق الصوره') }}</button>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>


        


<style scoped lang="scss">
.collapse-text{
    text-decoration: underline;
}
</style>


        

