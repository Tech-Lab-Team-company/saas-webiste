<script setup lang="ts">
    import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
    import Dashedicon from '~/public/icons/dashedicon.vue';
import PaymentDialog from './PaymentDialog.vue';



const props = defineProps({
  CourseData: {
    type: Object as () => CourseDetailsModel | null,
    default: null
  },
  status:{
    type:Number,
    default:0
  }
});

const CardDetails = ref(props.CourseData);
const status = ref(props.status);

watch(() => props.CourseData, (newValue) => {
    CardDetails.value = newValue;
}, { immediate: true });
watch(() => props.status, (newValue) => {
    status.value = newValue;
}, { immediate: true });
    
</script>

<template>
    <div class="card-container">
        <div class="card-text">

            <div class="card-text-title">
                <p class="card-text-subject-title">{{ CardDetails?.Subject.title }}</p>
                <p class="card-text-main-title">{{ CardDetails?.title }}</p>
                <!-- <Dashedicon class="icon" /> -->
            </div>

            <div class="card-text-description">
                <p v-html="CardDetails?.description"></p>
                 <!-- <p>اكتشف جمال اللغة العربية وتعلّم قواعدها بسهولة في هذا الكورس، ستتعلم أساسيات النحو والصرف، تحسين مهارات الكتابة، وتطوير الفهم والقراءة بطلاقة. من الأساسيات إلى الاحتراف، نأخذك في رحلة تعليمية شيّقة تساعدك على التعبير بثقة وإتقان.</p> -->
            </div>

            <hr />
            <div class="card-text-footer">
                <p class="salary">{{ CardDetails?.CoursePrice }} <span>{{ $t('جنيه') }}</span>  </p>
                <div class="card-profile">
                    <p>{{ CardDetails?.Teacher.name }}</p>
                    <img :src="CardDetails?.Teacher.image.img" >
                    <!-- :alt="props.CourseData.Teacher.image.alt" -->
                </div>
            </div>


            <PaymentDialog 
            :status="status"
            />

        </div>

        <!-- <div class="card-video">
            <video src="../../public/Videos/courseVideo.mp4"></video>
        </div> -->
        <div class="card-video">
            <img :src="CardDetails?.Image.img" :alt="CardDetails?.Image.image">
        </div>
   
    </div>
</template>

<style scoped lang="scss" >

.icon{
    position: absolute;
}

.card-container{
    @media (max-width:768px) {
        flex-direction: column;
    }

    .card-video{
        @media (max-width:768px) {
           width: 100%;
        }
    }
}
</style>