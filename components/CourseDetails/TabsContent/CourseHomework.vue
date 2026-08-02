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
.homework-card {
    width: 100%;
    margin: 20px 0 0;
}

.panels {
    overflow: hidden;
    margin-bottom: 12px;
    border: 1px solid #e5e9f0;
    border-radius: 14px;
    background: #fff;
}

.panel-header {
    min-height: 68px;
    padding: 14px 18px;
    border: 0;
    border-radius: 0;
    background: #fff;
    color: #172033;
}

.panel-header-container {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 7px;
}

.homework-title,
.homework-content-title,
.homework-upload-title {
    color: #172033;
    font-weight: 800;
    text-align: start;
}

.homework-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 10px 18px;
    color: #707a8b;
    font-size: 12px;
}

.homework-date {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.clock-icon { width: 14px; }

.panels :deep(.p-accordioncontent-content) {
    padding: 18px;
    border-top: 1px solid #edf0f4;
}

.collapse-text {
    color: var(--primary-color, #1d4ed8);
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
}

.homework-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow: hidden;
}

.homework-attachments :deep(img) {
    width: 150px;
    height: 105px;
    border-radius: 10px;
    object-fit: cover;
}

.homework-content-container {
    display: grid;
    gap: 8px;
    padding: 16px 0;
    text-align: start;
}

.homework-content-subtitle {
    padding-bottom: 14px;
    border-bottom: 1px solid #edf0f4;
    color: #687386;
    line-height: 1.8;
}

.homework-hr { display: none; }

.homework-upload {
    display: grid;
    gap: 10px;
    padding: 0;
}

.add-media { display: flex; flex-direction: column; }

.notes-input {
    width: 100%;
    padding: 11px 13px;
    border: 1px solid #dfe4ec;
    border-radius: 11px;
    background: #fbfcfe;
    color: #172033;
    text-align: start;
}

.notes-input:focus {
    border-color: var(--primary-color, #1d4ed8);
    outline: 3px solid color-mix(in srgb, var(--primary-color, #1d4ed8) 10%, transparent);
}

.btn-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
}

.submit-image {
    min-width: 180px;
    min-height: 44px;
    padding: 10px 18px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
}

@media (max-width: 640px) {
    .panel-header,
    .panels :deep(.p-accordioncontent-content) { padding: 13px; }
    .submit-image { width: 100%; }
}

.homework-card .panels .panel-header {
    min-height: 68px;
    padding: 14px 18px;
    border: 0;
    border-radius: 0;
    background: #fff;
    color: #172033;
}

.homework-card .panels .panel-header .panel-header-container {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.homework-card .panels .panel-header .panel-header-container .homework-title {
    color: #172033;
    font-weight: 800;
    text-align: start;
}

.homework-card .panels .panel-header .panel-header-container .homework-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px 18px;
}

.homework-card .panels .homework-content-container,
.homework-card .panels .homework-upload {
    width: 100%;
    padding: 16px 0;
    text-align: start;
}

.homework-card .panels .btn-container .submit-image {
    min-width: 180px;
    width: auto;
    padding: 10px 18px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
}

@media (max-width: 640px) {
    .homework-card .panels .panel-header { padding: 13px; }
    .homework-card .panels .btn-container .submit-image { width: 100%; }
}
</style>


        
