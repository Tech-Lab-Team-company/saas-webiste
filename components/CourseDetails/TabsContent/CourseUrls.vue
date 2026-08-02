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

<style scoped lang="scss">
.course-url-container {
    display: flex;
    width: 100%;
    margin: 12px 0 0;
    padding: 16px 18px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border: 1px solid #e5e9f0;
    border-radius: 14px;
    background: #fff;
}

.course-url-content {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    text-align: start;
}

.url-title {
    color: #172033;
    font-size: 16px;
    font-weight: 800;
    text-align: start;
}

.url-description {
    width: auto;
    color: #707a8b;
    font-size: 13px;
    line-height: 1.7;
    text-align: start;
}

.btns { flex: 0 0 auto; }

.btns button {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
    color: #fff;
    font-weight: 700;
}

.btns button :deep(svg) { width: 17px; height: 17px; }

@media (max-width: 640px) {
    .course-url-container {
        flex-direction: column-reverse;
        align-items: stretch;
        gap: 14px;
        padding: 14px;
    }

    .btns,
    .btns a,
    .btns button { width: 100%; }
    .btns button { justify-content: center; }
}

.course-url-container .btns button {
    min-height: 42px;
    padding: 9px 18px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
}

.course-url-container .course-url-content {
    align-items: flex-start;
    text-align: start;
}

.course-url-container .course-url-content .url-title,
.course-url-container .course-url-content .url-description {
    width: auto;
    text-align: start;
}
</style>
