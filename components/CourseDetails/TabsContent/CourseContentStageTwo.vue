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
import {ContentTypeEnum} from "~/components/CourseDetails/Enum/content_type_enum";

const props = defineProps({
    CourseData: {
        type: Object as () => LessonsModel | null,
        default: null
    },
    CourseStatus: {
        type: Number,

    }
});

const CardDetails = ref(props.CourseData);

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
const toast = useToast();

const userStore = useUserStore()
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);

function handleSessionClick(index: number, link: string, title: string, text: string) {
    if (!userStore.user){

        toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول', life: 3000 });
    }
    else{

        selectedSessionIndex.value = index;
        sendactivetab(0, link, title, text);
    }
}
</script>

<template>

    <Accordion value="0" class="course-content-container">
        <AccordionPanel :value="index == 0 ? '0' : index" class="course-content-panel" v-for="(lesson, index) in CardDetails" :key="index"
            :class="{ 'active': activePanels.includes(index) }">
            <AccordionHeader class="course-content-header ">{{ lesson?.title }}</AccordionHeader>
            <AccordionContent class="course-class-body">
                <div class="course-body-details" :key="thirdindex" v-for="(session, thirdindex) in lesson?.sessions"
                    :class="[
                        (!userStore.user && CardDetails?.isPaid) ? 'disabled' : '',
                        (props.CourseStatus !== 2 && CardDetails?.isPaid) ? 'disabled' : '',
                        selectedSessionIndex === thirdindex ? 'active' : ''
                    ]" @click="handleSessionClick(thirdindex, session?.link, session?.title, session?.text)">
                    <component :is="getIconByType(session?.type)" />
                    <p>{{ session?.title }} </p>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>


<style scoped>

.course-body-details{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    box-shadow: 3px 3px 3px 0 #00000038;
    padding: 0.7rem;
    border-radius: 10px;
}
</style>