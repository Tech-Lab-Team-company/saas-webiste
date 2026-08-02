<script setup lang="ts">
// import Downarrow from '~/public/icons/downarrow.vue';
import blacknotes from "~/public/icons/blacknotes.vue";
import clockicon from "~/public/icons/clockicon.vue";
import calendaricon from "~/public/icons/calendaricon.vue";
import NumberOfQuestionIcon from "~/public/icons/NumberOfQuestionIcon.vue";
// import CourseDetailsModel from '~/features/FetchCourseDetails/Data/models/course_details_model';
import type ExamsModel from "~/features/FetchCourseDetails/Data/models/exam_model";
import Tooltip from 'primevue/tooltip';


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
const currentTime = new Date();
</script>

<template>
  <div
    class="course-exam-container"
    v-for="(exam, index) in CardDetails"
    :key="index"
  >
    <NuxtLink
      v-if="!exam?.is_finished"
      :to="
        isDisabled || exam?.is_finished
          ? null
          : `/course/${course_id}/timer?id=${exam.id}&time=${exam.start_time}`
      "
      @click.prevent="
        (isDisabled || exam?.is_finished) && $event.preventDefault()
      "
    >
      <div class="btns">
        <button
          v-if="new Date(exam.end_time).getTime() - currentTime.getTime() < 0"
          disabled
          class="disabled"
        >
          {{ $t("انتهى الوقت") }}
        </button>

        <button
          v-else
          :disabled="isDisabled"
          :class="[
            props.isPaid && !props.isSubscribed ? 'disabled' : '',
            userStore.user ? '' : 'disabled',
          ]"
        >
          {{
            exam.mark > 0 && !exam?.is_finished
              ? $t("complate_exam")
              : $t("ابدأ الامتحان")
          }}
        </button>
        <span class="degree" v-if="exam.mark > 0 && !exam?.is_finished">
          {{
            exam.mark > 0 && !exam?.is_finished
              ? `${exam.mark} / ${exam.exam_mark} `
              : ""
          }}
        </span>
      </div>
    </NuxtLink>
    <div
      v-else-if="exam?.is_finished"
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

<style scoped lang="scss">
.course-exam-container {
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

.course-exam-content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.exam-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  color: #172033;
  font-size: 16px;
  font-weight: 800;
  text-align: start;
}

.exam-title :deep(svg) { width: 20px; height: 20px; }

.exam-date-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin: 0;
}

.exam-title.exam-date {
  gap: 5px;
  color: #717b8c;
  font-size: 11px;
  font-weight: 500;
}

.btns button {
  min-height: 42px;
  padding: 9px 20px;
  border-radius: 11px;
  background: var(--primary-color, #1d4ed8);
  color: #fff;
  font-weight: 700;
}

.exam-rate .rating {
  padding: 6px 13px;
  border-radius: 999px;
  background: #e8ffef;
  color: #08851b;
  font-size: 12px;
  font-weight: 700;
}

.exam-rate .rating.failed {
  background: #ffebec;
  color: #be2426;
}

.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.degree {
  display: inline-flex;
  margin-inline-start: 8px;
  padding: 5px 9px;
  border: 1px solid #dfe4ec;
  border-radius: 999px;
  color: #687386;
  font-size: 11px;
}

@media (max-width: 640px) {
  .course-exam-container {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 14px;
    padding: 14px;
  }

  .course-exam-container > a,
  .course-exam-container > a .btns,
  .course-exam-container > a button { width: 100%; }
}

.course-exam-container .btns button {
  min-height: 42px;
  padding: 9px 20px;
  border-radius: 11px;
  background: var(--primary-color, #1d4ed8);
}

.course-exam-container .course-exam-content .exam-title {
  justify-content: flex-start;
  color: #172033;
  font-size: 16px;
  text-align: start;
}

.course-exam-container .course-exam-content .exam-title.exam-date {
  color: #717b8c;
  font-size: 11px;
}

.course-exam-container .course-exam-content .exam-date-container {
  justify-content: flex-start;
  margin: 0;
}
</style>
