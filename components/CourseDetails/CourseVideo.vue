<script setup lang="ts">

import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
    const props = defineProps({
    CourseData: {
        type: Object as () => CourseDetailsModel | null,
        default: null
    }
    });

    const CardDetails = ref(props.CourseData);

    watch(() => props.CourseData, (newValue) => {
        CardDetails.value = newValue;
    }, { immediate: true });

</script>


<template>
    <div class="course-video-container">
        <!-- <video :src="CardDetails?.sessions[0].link"></video> -->
        <img src="../../public/images/vides.png" alt="video">
    </div>

    <div class="course-video-text">
        <p class="course-video-text-title">شرح اساسيات النحو</p>
        <hr />
        <p class="course-video-text-description">هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية،
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية،</p>
    </div>

</template>

<style scoped ></style>