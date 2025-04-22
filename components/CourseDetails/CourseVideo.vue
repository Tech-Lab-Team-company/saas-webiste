<script setup lang="ts">

// import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
    const props = defineProps({
        // CourseData: {
        //     type: Object as () => CourseDetailsModel | null,
        //     default: null
        // },
        CourseVideoLink:{
            type: Object as () => {
                videoLink:string,
                title:string,
                description:string
            } | null,
            default: ''
        }
    });

    // const CardDetails = ref(props.CourseData);
    const CourseVideoLink = ref(props.CourseVideoLink);

    // watch(() => props.CourseData, (newValue) => {
    //     CardDetails.value = newValue;
    // }, { immediate: true });

    watch(() => props.CourseVideoLink, (newValue) => {
        CourseVideoLink.value = newValue;
    }, { immediate: true });



</script>


<template>
    <div class="course-video-container">
        <!-- <video :src="CardDetails?.sessions[0].link"></video> -->
        <!-- <img src="../../public/images/vides.png" alt="video"> -->
         <!-- <video :src="CourseVideoLink"></video> -->
         <video controls class="course-video" width="100%" height="80%">
            <source :src="CourseVideoLink?.videoLink" type="video/mp4">
            <source :src="CourseVideoLink?.videoLink" type="video/webm">
        </video>
        <!-- <TwicVideo :src="CourseVideoLink?.videoLink" /> -->

      
    </div>
    <div class="course-video-text">
        <!-- <p class="course-video-text-title">{{ CardDetails?.units[0].lessons[0].sessions[0].title }}</p> -->
        <p class="course-video-text-title">شرح {{CourseVideoLink?.title  }}</p> 
        <hr />
        <!-- <p class="course-video-text-description">{{ CardDetails?.units[0].lessons[0].sessions[0].text }}</p> -->
        <!-- <p class="course-video-text-description">هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، -->
            <!-- هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية،</p> -->
        <p class="course-video-text-description">{{ CourseVideoLink?.description }}</p>
        </div>

</template>

<style scoped ></style>





