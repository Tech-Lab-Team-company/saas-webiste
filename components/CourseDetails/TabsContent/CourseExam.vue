<script setup lang="ts">
// import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from "~/public/icons/blacknotes.vue";
import clockicon from "~/public/icons/clockicon.vue";
import calendaricon from "~/public/icons/calendaricon.vue";
import NumberOfQuestionIcon from "~/public/icons/NumberOfQuestionIcon.vue";
// import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import type ExamsModel from "~/features/FetchCourseDetails/Data/models/exam_model";
import Tooltip from 'primevue/tooltip';
import { allowsMultipleExamAttempts, hasCompletedExamAttempt, isExamAttemptLocked } from '~/utils/examAttempts';


const route = useRoute();
const course_id = ref<string>(<string>route.params.id);

const props = defineProps({
  CourseData: {
    type: Object as () => ExamsModel | null,
    default: null,
  },
  CourseStatus: {
    type: Number,
  },
  isPaid: {
    type: Boolean,
  },
  isSubscribed: {
    type: Boolean,
  },
});

const CardDetails = ref(props.CourseData);

watch(
  () => props.CourseData,
  (newValue) => {
    CardDetails.value = newValue;
  },
  { immediate: true },
);

const router = useRouter();
// console.log(router.currentRoute.value.params.id)

const userStore = useUserStore();

const isDisabled = computed(() => {
  return !userStore.user || (props.isPaid && !props.isSubscribed);
});
const { locale } = useI18n();
const { isOpen, isExpired, isUpcoming } = useExamAvailabilityClock();

const examLink = (exam: any) =>
  isOpen(exam) && !isDisabled.value && !isExamAttemptLocked(exam)
    ? `/course/${course_id.value}/${exam.id}`
    : null;

const unavailableLabel = (exam: any) => {
  if (isExpired(exam)) return 'انتهى موعد الامتحان';
  if (isUpcoming(exam)) return 'لم يبدأ الامتحان بعد';
  return 'الامتحان غير متاح';
};
</script>

<template>
  <div
    class="course-exam-container"
    :class="{
      'course-exam-container--expired': isExpired(exam),
      'course-exam-container--upcoming': isUpcoming(exam),
      'course-exam-container--finished': isExamAttemptLocked(exam),
    }"
    v-for="(exam, index) in CardDetails"
    :key="index"
  >
    <NuxtLink v-if="examLink(exam)" :to="examLink(exam)!">
      <div class="btns">
        <button
          :disabled="isDisabled"
          :class="[
            props.isPaid && !props.isSubscribed ? 'disabled' : '',
            userStore.user ? '' : 'disabled',
          ]"
        >
          {{
            hasCompletedExamAttempt(exam) && allowsMultipleExamAttempts(exam)
              ? 'العودة وتعديل الإجابات'
              : exam.mark > 0
              ? $t("complate_exam")
              : $t("ابدأ الامتحان")
          }}
        </button>
        <span class="degree" v-if="exam.mark > 0">
          {{
            exam.mark > 0
              ? `${exam.mark} / ${exam.exam_mark} `
              : ""
          }}
        </span>
      </div>
    </NuxtLink>
    <div
      v-else-if="!isExamAttemptLocked(exam)"
      class="exam-availability-state"
      role="status"
    >
      <span class="exam-availability-state__icon">
        <i :class="isExpired(exam) ? 'pi pi-calendar-times' : 'pi pi-clock'" aria-hidden="true"></i>
      </span>
      <span>
        <strong>{{ unavailableLabel(exam) }}</strong>
        <small v-if="isExpired(exam)">لا يمكن بدء محاولة جديدة بعد انتهاء الموعد</small>
        <small v-else-if="isUpcoming(exam)">سيتم تفعيل زر البدء تلقائيًا في الموعد المحدد</small>
        <small v-else>سجّل الدخول واشترك في الكورس لبدء الامتحان</small>
      </span>
    </div>
    <div
      v-else-if="isExamAttemptLocked(exam)"
      class="exam-rate"
      v-tooltip.top="{
        value: `<div style='line-height:1.8'>
          <div>✅ ${$t('correct_answers')}: ${exam.correct_answers_count ?? 0}</div>
          <div>❌ ${$t('wrong_answers')}: ${exam.wrong_answers_count ?? 0}</div>
          <div>⬜ ${$t('unanswered_questions')}: ${exam.unanswered_questions_count ?? 0}</div>
        </div>`,
        escape: false
      }"
      style="cursor: pointer"
    >


      <p
        class="rating"
        v-if="exam.degree_type == 2"
        :class="exam.mark < 6 ? 'failed' : ''"
      >
        {{ exam.mark }} / {{ exam.exam_mark }}
      </p>
      <p
        class="rating"
        v-if="exam.degree_type == 1"
        :class="(exam.mark / exam.exam_mark) * 100 < 50 ? 'failed' : ''"
      >
        {{ ((exam.mark / exam.exam_mark) * 100).toFixed(2) }} %
      </p>
    </div>

    <div class="course-exam-content">
      <div class="exam-title">
        <p>({{ exam?.subject.title }})</p>
        <span>{{ exam.title }}</span>
        <blacknotes />
      </div>

      <div class="exam-date-container">
        <div class="exam-title exam-date">
          <!-- <NumberOfQuestionIcon class="icon" /> -->
          <p>{{ exam.number_of_questions }} :</p>
          <span>{{ $t("number_of_questions") }}</span>
        </div>
        <div class="exam-title exam-date">
          <p>{{ exam.date }}</p>
          <calendaricon class="exam-icon" />
        </div>

        <div class="exam-title exam-date">
          <p>{{ String(exam.start_time).slice(11, 20) }}</p>
          <clockicon class="exam-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="~/assets/style/course-details-redesign/course-exam.scss"></style>
