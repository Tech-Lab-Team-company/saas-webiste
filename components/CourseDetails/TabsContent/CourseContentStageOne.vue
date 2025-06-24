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

const props = defineProps({
    CourseData: {
        type: Object as () => SessionsModel | null,
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
    emit('coursechanged', { activetabvalue: activetabvalue, link: link, title: title, description: description });
}

const userStore = useUserStore()
const activeIndices = ref<number[]>([]);

const selectedSessionIndex = ref<number | null>(null);
const toast = useToast();

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
    <div class="course-body-details" :key="index" v-for="(session, index) in CourseData" :class="[
        (!userStore.user && CardDetails?.isPaid) ? 'disabled' : '',
        (props.CourseStatus !== 2 && CardDetails?.isPaid) ? 'disabled' : '',]" 
        @click="handleSessionClick(Number(index), session?.link, session?.title, session?.text)">
        <component :is="getIconByExt(session?.link)" />
        <p>{{ session?.title }} </p>
    </div>
</template>

<style scoped lang="scss">
.course-body-details{
       margin-left: auto;
    margin-right: auto;
    background: white;
    display: flex;
    justify-content: space-between;
    padding: 6px;
    color: black;
    width: 70%;
    cursor: pointer;
    border-radius: 10px;
    margin-top: 1rem;
    padding: 0.7rem;
    box-shadow: 3px 3px 3px 2px #00000038;
    

}  
</style>
