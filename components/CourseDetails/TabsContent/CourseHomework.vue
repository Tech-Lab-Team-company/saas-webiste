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
    

    const homeworks = ref([
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
        {
            title: 'واجب النحو والبلاغه',
            date: '9 -5-2025',
            subject:'لغة عربية',
        },
    ])
</script>

<template>
    <div class="course-homework-container" v-for="homework in homeworks" :key="homework.title">


        <div  class="homework-rate">
           <p class="details">اعرض تفاصيل الامتحان</p>
        </div>

        <div class="course-homework-content">
            <div class="homework-title">
                <p>{{ homework.title }}</p>
            </div>

            <div class="homework-date-container">
                <div class="homework-title homework-date">
                    <p>{{ homework.date }} </p>
                    <calendaricon class="homework-icon" />
                </div>
                <div class="homework-title homework-date">
                    <p>{{ homework.subject }} </p>
                </div>
            </div>

        </div>

     
    </div>
</template>

<style scoped ></style>