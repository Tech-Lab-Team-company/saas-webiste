<script setup lang="ts">
import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from '~/public/icons/blacknotes.vue';
import clockicon from '~/public/icons/clockicon.vue';
import calendaricon from '~/public/icons/calendaricon.vue';
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
    <div class="course-exam-container" v-for="(exam , index) in CardDetails?.Exams" :key="index">


       <div v-if="!exam.isFinished" class="exam-rate">
           <p class="rating" :class="exam.mark < 6 ? 'failed' : ''"> {{ exam.mark }} / {{ exam.exam_mark }}</p>
           <p class="details">اعرض تفاصيل الامتحان</p>
        </div>

        <div class="btns" v-else="" >
            <button>ابدأ الامتحان</button>
        </div>


        <div class="course-exam-content">
            <div class="exam-title">
                <p>({{ exam?.subject.title }})</p>
                <span>{{ exam.title }}</span>
                <blacknotes />
            </div>

              <div class="exam-date-container">
                <div class="exam-title exam-date">
                    <p>{{ exam.date }} </p>
                    <calendaricon class="exam-icon" />
                </div>
                <div class="exam-title exam-date">
                    <p>{{ String(exam.start_time).slice(11, 20) }} </p>
                    <clockicon class="exam-icon" />
                </div>
            </div>

        </div> 

     
    </div>
</template>

<style scoped ></style>