<script setup lang="ts">
// import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from '~/public/icons/blacknotes.vue';
import clockicon from '~/public/icons/clockicon.vue';
import calendaricon from '~/public/icons/calendaricon.vue';
// import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import type ExamsModel from '~/features/FetchCourseDetails/Data/models/exam_model';

const route = useRoute()
const course_id = ref<string>(<string>route.params.id)

const props = defineProps({
  CourseData: {
    type: Object as () => ExamsModel | null,
    default: null
  },
    CourseStatus:{
    type: Number,
  },
    isPaid:{
    type: Boolean,
  },
    isSubscribed:{
    type: Boolean,
  },
});

const CardDetails = ref(props.CourseData);

watch(() => props.CourseData, (newValue) => {
  CardDetails.value = newValue;
}, {immediate: true});

const router = useRouter();
// console.log(router.currentRoute.value.params.id)

const userStore = useUserStore()

const isDisabled = computed(() => {
  return !userStore.user || ( props.isPaid &&!(props.isSubscribed));
});
const { locale } = useI18n();
const currentTime = new Date(); 



</script>

<template>

  <div class="course-exam-container" v-for="(exam , index) in CardDetails" :key="index">

    <!-- <Nuxt-link  v-if="!(exam?.is_finished)" :to="`/course/${router.currentRoute.value.params.id}/${exam.id}`">  -->
    {{ console.log(exam ,"exammmm") }}
   <a
   v-if="!(exam?.is_finished)"
  :href="isDisabled || exam?.is_finished ? null : `/course/${course_id}/timer?id=${exam.id}&time=${exam.start_time}`"
  @click.prevent="(isDisabled || exam?.is_finished) && $event.preventDefault()"
>
  <div class="btns">
    <button
      v-if="(new Date(exam.end_time).getTime() - currentTime.getTime()) < 0"
      disabled
      class="disabled"
    >
      {{ $t('انتهى الوقت') }}
    </button>

    <button
      v-else
      :disabled="isDisabled"
      :class="[
        props.isPaid && !props.isSubscribed ? 'disabled' : '',
        userStore.user ? '' : 'disabled',
      ]"
    >
      {{ $t('ابدأ الامتحان') }}
    </button>
  </div>
</a>
    <div v-else-if="exam?.is_finished" class="exam-rate">
      <p class="rating" v-if="exam.degree_type == 2" :class="exam.mark < 6 ? 'failed' : ''"> {{ exam.mark }} / {{ exam.exam_mark }}</p>
      <p class="rating" v-if="exam.degree_type == 1" :class="(exam.mark / exam.exam_mark)* 100 < 50 ? 'failed' : ''"> {{ ((exam.mark / exam.exam_mark)* 100).toFixed(2) }} %</p>
    </div>


    <div class="course-exam-content">
      <div class="exam-title">
        <p>({{ exam?.subject.title }})</p>
        <span>{{ exam.title }}</span>
        <blacknotes/>
      </div>

      <div class="exam-date-container">
        <div class="exam-title exam-date">
          <p>{{ exam.date }} </p>
          <calendaricon class="exam-icon"/>
        </div>
        <div class="exam-title exam-date">
          <p>{{ String(exam.start_time).slice(11, 20) }} </p>
          <clockicon class="exam-icon"/>
        </div>
      </div>

    </div>


  </div>
</template>

<style scoped>
.disabled{
  opacity: 0.8;
  cursor: not-allowed;
}
</style>