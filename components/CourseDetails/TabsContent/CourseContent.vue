<script setup lang="ts">
import { ContentTypeEnum } from '~/components/CourseDetails/Enum/content_type_enum';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import coursenotesicon from '~/public/icons/coursenotesicon.vue';
import microphoneicon from '~/public/icons/microphoneicon.vue';
import type UnitsModel from '~/features/FetchCourseDetails/Data/models/units_model';
import {useUserStore} from "~/stores/user";
import LockIcon from '~/public/icons/LockIcon.vue';
const props = defineProps({
  CourseData: {
    type: Object as () => UnitsModel | null,
    default: null
  },
  CourseStatus:{
    type: Number,
  },
  isSubscribed:{
    type: Boolean,
  },
  isPaied:{
    type: Boolean,
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
const isdisabled = ref(false)

function handleSessionClick(index: number, link: string, title: string, text: string,show:boolean) {
  if (!userStore.user){
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'يجب تسجيل الدخول', life: 3000 });
    // return;
  }
  else {
    if(show === false){
        if((UserSetting.setting?.app_store && UserSetting.setting?.app_store != '-') && (UserSetting.setting?.play_store && UserSetting.setting?.play_store != '-')) {
            visible.value=true;
        }
    }

    else if(show === true){
      console.log(props.isSubscribed , "props.isSubscribed")
      console.log(props.isPaid , "props.isPaid")
      if(!props.isSubscribed && props.isPaied){
          isdisabled.value = true
          console.log("non")
        }
        else if(props.isSubscribed && props.isPaied){
          isdisabled.value = false
          selectedSessionIndex.value = index;
          sendactivetab(0, link, title, text);
          visible.value=false;   
        }
        else if((!props.isPaied)){
          isdisabled.value = false
          selectedSessionIndex.value = index;
          sendactivetab(0, link, title, text);
          visible.value=false;   
        }
    }
  }
}


const visible = ref(false);
const UserSetting = useUserStore();
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
              <div class="course-body-details" 
              :key="thirdindex" 
              v-for="(session ,thirdindex) in lesson?.sessions"
                    :class="[ selectedSessionIndex === thirdindex ? 'active' : '', isdisabled == true ? 'disabled' : '']"
                   @click="handleSessionClick(thirdindex, session?.link, session?.title, session?.text ,session?.web_show_video);">
                <div class="session-name">
                  <LockIcon v-if="!session?.web_show_video" />
                  <p>{{ session?.title }} </p>
                  <p  v-if="!session?.web_show_video" >(هذا المحتوى حصرى للتطبيق فقط)</p>
                </div>
                    <div class="card flex justify-center" v-if="!(session?.web_show_video)">
                       
                    
                    </div>  

                <component :is="getIconByType(session?.type)"/>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
    <Dialog v-model:visible="visible" modal :dismissableMask="true" :style="{ width: '25rem' }">
        <div class="stores-logos-container">
            <a v-if="UserSetting.setting?.app_store && UserSetting.setting?.app_store != '-'" class="stores-logos-link" target="_blank" :href="UserSetting.setting?.app_store">
            <NuxtImg class="stores-logos stores-logos-apple" src="/images/Download_on_the_App_Store_Badge.svg.webp" />
            
            </a>
            <a v-if="UserSetting.setting?.play_store && UserSetting.setting?.play_store != '-'" class="stores-logos-link" target="_blank" :href="UserSetting.setting?.play_store">
            <NuxtImg class="stores-logos" src="/images/en_badge_web_generic.png" />
            </a>
        </div>
</Dialog>



</template>


<style scoped lang="scss">

.stores-logos-container{
  display:flex;
  align-items:center;
  justify-content: center;
  .stores-logos-link{
    width:50%;

    .stores-logos-apple{
      width:88%;
    }
  }

}
.course-body-details{
  position:relative;
}
.disabled{
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;

}

.session-name{
    display:flex;
    align-items:center;
    gap:5px;
    position: relative;
  }
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


