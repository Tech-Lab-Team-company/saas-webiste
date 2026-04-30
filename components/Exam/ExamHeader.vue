<script setup lang="ts">
import ExamDetailsModel from "~/features/FetchExams/Data/models/exam_details_model";
import blacknotes from "../../public/icons/blacknotes.vue";

const props = defineProps({
  CourseDataHeader: {
    type: ExamDetailsModel,
    default: null,
  },
});
const ExamDetails = ref<ExamDetailsModel | null>(props.CourseDataHeader);
const router = useRouter();
const EndExam = () => {
  router.push(`/course/${router.currentRoute.value.params.id}`);
};
</script>

<template>
  <div class="exam-header">
    <!-- <div class="exam-btn" @click="EndExam">
            <button>انهاء الامتحان</button>
        </div> -->
    <div class="flex items-center q-no gap-4">
      {{ CourseDataHeader?.number_of_questions }}
      <p>{{ $t("number_of_questions") }}</p>
    </div>
    <div class="exam-header-container">
      <div class="exam-header-text">
        <p class="exam-title">
          {{ `${props?.CourseDataHeader?.title || " "}` }}
        </p>
        <blacknotes />
      </div>
      <hr class="exam-title-hr" />
      <!-- {{ CourseDataHeader.number_of_questions }} -->
    </div>
  </div>
</template>

<style scoped>
.q-no {
  width: 120px;
  gap: 5px;
}
</style>
