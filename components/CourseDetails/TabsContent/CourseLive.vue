<script setup lang="ts">
import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from '~/public/icons/blacknotes.vue';
import clockicon from '~/public/icons/clockicon.vue';
import calendaricon from '~/public/icons/calendaricon.vue';
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
    

    // const lives = ref([
    //     {
    //         title: 'حصه شرح النحو',
    //         date: '9 -5-2025',
    //         time: 'من 2 م  الي  3م',
    //         state:'live',
    //         subject:'لغة عربية'
  
    //     },
    //     {
    //         title: 'حصه شرح النحو',
    //         date: '9 -5-2025',
    //         time: 'من 2 م  الي  3م',
    //         state:'not live',
    //         subject:'لغة عربية'
         
    //     },
    //     {
    //         title: 'حصه شرح النحو',
    //         date: '9 -5-2025',
    //         time: 'من 2 م  الي  3م',
    //         state:'not live',
    //         subject:'لغة عربية'
    
    //     },
    //     {
    //         title: 'حصه شرح النحو',
    //         date: '9 -5-2025',
    //         time: 'من 2 م  الي  3م',
    //         state:'not live',
    //         subject:'لغة عربية'
    
    //     },
    // ])
</script>

<template>
    <div class="course-live-container" v-for="(live,index) in CardDetails" :key="(index)"
    :class="live.state === 'not live' ? 'not-live' : ''">


        <div  class="live-rate">
            <a :href="live.link" target="_blank">
            <div class="btns">
                <button>{{ $t('انضم الان') }}</button>
            </div>
            </a>
        </div>

  
        <div class="live-container">
       
        <div class="course-live-content" >
            <div class="live-title">
                <p>{{ live.title }}</p>
            </div>

            <div class="live-date-container">
           
                <div class="live-title live-date"  v-if="live.stage_type === 1">
                    <p>{{ live.date }} </p>
                    <calendaricon class="live-icon" />
                </div>
                <div class="live-title live-date"  v-if="live.stage_type === 2">
                    <p>{{ live.time }} </p>
                    <clockicon class="live-icon" />
                </div>
                <p class="live-title live-date">{{ live.title }}</p>

             
            </div>

        </div>
        <img class="live-img" v-if="live.state== 'live'" src="../../../public/images/liveicon.png" />
    </div>


     
    </div>
</template>

<style scoped lang="scss">
.course-live-container {
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

.course-live-container.not-live {
    border-color: #edf0f4;
    background: #fafbfc;
    color: #7b8494;
}

.live-rate { flex: 0 0 auto; }

.btns button {
    min-height: 42px;
    padding: 9px 20px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
    color: #fff;
    font-weight: 700;
}

.live-container {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 13px;
    margin: 0;
}

.course-live-content {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.live-title {
    color: #172033;
    font-size: 16px;
    font-weight: 800;
    text-align: start;
}

.live-date-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px 14px;
    margin: 0;
}

.live-title.live-date {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #717b8c;
    font-size: 11px;
    font-weight: 500;
}

.live-icon { width: 13px; }
.live-img { flex: 0 0 auto; width: 46px; }

@media (max-width: 640px) {
    .course-live-container {
        flex-direction: column-reverse;
        align-items: stretch;
        gap: 14px;
        padding: 14px;
    }

    .live-container,
    .live-rate,
    .live-rate a,
    .btns,
    .btns button { width: 100%; }
}

.course-live-container .btns button {
    min-height: 42px;
    padding: 9px 20px;
    border-radius: 11px;
    background: var(--primary-color, #1d4ed8);
}

.course-live-container .course-live-content .live-title {
    justify-content: flex-start;
    color: #172033;
    font-size: 16px;
    text-align: start;
}

.course-live-container .course-live-content .live-title.live-date {
    color: #717b8c;
    font-size: 11px;
}

.course-live-container .course-live-content .live-date-container {
    justify-content: flex-start;
    margin: 0;
}
</style>
