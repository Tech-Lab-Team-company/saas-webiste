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
    

    const lives = ref([
        {
            title: 'حصه شرح النحو',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'live',
            subject:'لغة عربية'
  
        },
        {
            title: 'حصه شرح النحو',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'not live',
            subject:'لغة عربية'
         
        },
        {
            title: 'حصه شرح النحو',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'not live',
            subject:'لغة عربية'
    
        },
        {
            title: 'حصه شرح النحو',
            date: '9 -5-2025',
            time: 'من 2 م  الي  3م',
            state:'not live',
            subject:'لغة عربية'
    
        },
    ])
</script>

<template>
    <div class="course-live-container" v-for="live in lives" :key="live.title"
    :class="live.state === 'not live' ? 'not-live' : ''">


        <div v-if="live.state === 'live'" class="live-rate">
            <div class="btns">
                <button>انضم الان</button>
            </div>
        </div>

  
        <div class="live-container">
       
        <div class="course-live-content" >
            <div class="live-title">
                <p>{{ live.title }}</p>
            </div>

            <div class="live-date-container">
           
                <div class="live-title live-date"  v-if="live.state === 'not live'">
                    <p>{{ live.date }} </p>
                    <calendaricon class="live-icon" />
                </div>
                <div class="live-title live-date"  v-if="live.state === 'not live'">
                    <p>{{ live.time }} </p>
                    <clockicon class="live-icon" />
                </div>
                <p class="live-title live-date">{{ live.subject }}</p>

             
            </div>

        </div>
        <img class="live-img" v-if="live.state== 'live'" src="../../../public/images/liveicon.png" />
    </div>


     
    </div>
</template>

<style scoped></style>