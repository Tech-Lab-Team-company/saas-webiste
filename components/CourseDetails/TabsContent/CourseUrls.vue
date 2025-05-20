<script setup lang="ts">
import discoverbtnIcon from '~/public/icons/discoverbtnIcon.vue';
import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
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
    


    // const urls = ref([
    //     {
    //         title: 'امتحان علي اساسيات النحو (لغه عربيه)',
    //         description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

    //     },
    //     {
    //         title: 'امتحان علي اساسيات النحو (لغه عربيه)',
    //         description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

    //     },
    //     {
    //         title: 'امتحان علي اساسيات النحو (لغه عربيه)',
    //         description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

    //     },
    //     {
    //         title: 'امتحان علي اساسيات النحو (لغه عربيه)',
    //         description: 'اضغط للوصول لصفحتك التعليميه  واحصل علي المعرفه التي تريدها',

    //     },
 
    // ])
</script>

<template>
    {{ console.log(CardDetails , "CardDetails data") }}
    <div class="course-url-container" v-for="(url , index) in CardDetails" :key="index">

        <div class="btns" >
            <!-- anchor -->
             <a :src="url?.link" ></a>
            <button>
                <discoverbtnIcon />
                استكشف الان
            </button>
            
        </div>


        <div class="course-url-content">
            <div class="url-title">
                <p>{{ url?.title }}</p>
            </div>
            <p class="url-description">{{ url?.subtitle }}</p>
        </div>
    </div>

</template>

<style scoped></style>