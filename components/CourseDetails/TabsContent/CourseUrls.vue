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
    

</script>

<template>
    {{ console.log(CardDetails , "CardDetails data") }}
    <div class="course-url-container" v-for="(url , index) in CardDetails" :key="index">

        <div class="btns" >
             <a :href="url?.link" target="_blank">
            <button>
                <discoverbtnIcon />
                استكشف الان
            </button>
            </a>
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