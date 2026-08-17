<script setup lang="ts">
import type ExamDetailsModel from "~/features/FetchExams/Data/models/exam_details_model";

const props = defineProps<{
  courseDataHeader: ExamDetailsModel;
}>();

const route = useRoute();
const courseUrl = computed(() => {
  const courseId = props.courseDataHeader.courseId || route.params.id;
  return courseId ? `/course/${courseId}` : "/profileexams";
});
const questionsCount = computed(() =>
  props.courseDataHeader.questions?.length ||
  props.courseDataHeader.number_of_questions ||
  0,
);
</script>

<template>
  <header class="exam-header">
    <div class="exam-header__content">
      <NuxtLink :to="courseUrl" class="exam-header__back">
        <i class="pi pi-arrow-right" aria-hidden="true"></i>
        العودة إلى الكورس
      </NuxtLink>

      <p class="exam-header__eyebrow">اختبار الكورس</p>
      <h1>{{ props.courseDataHeader.title }}</h1>

      <div class="exam-header__meta">
        <span v-if="props.courseDataHeader.subject?.title">
          <i class="pi pi-book" aria-hidden="true"></i>
          {{ props.courseDataHeader.subject.title }}
        </span>
        <span>
          <i class="pi pi-list-check" aria-hidden="true"></i>
          {{ questionsCount }} سؤال
        </span>
        <span>
          <i class="pi pi-star" aria-hidden="true"></i>
          {{ props.courseDataHeader.examMark }} درجة
        </span>
      </div>
    </div>

    <div class="exam-header__illustration" aria-hidden="true">
      <i class="pi pi-file-edit"></i>
    </div>
  </header>
</template>

<style scoped lang="scss">
.exam-header {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  align-items: center;
  gap: 28px;
  overflow: hidden;
  padding: clamp(24px, 4vw, 42px);
  color: #fff;
  border-radius: 26px;
  background:
    radial-gradient(circle at 12% 0%, rgb(255 255 255 / 18%), transparent 14rem),
    linear-gradient(
      135deg,
      var(--home-v2-blue, var(--primary-color, #28366c)),
      var(--home-v2-deep, var(--secondary-color, #3a3e7e))
    );
  box-shadow: 0 24px 70px color-mix(in srgb, var(--home-v2-blue, #28366c) 24%, transparent);

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    inset: auto -70px -100px auto;
    width: 270px;
    aspect-ratio: 1;
    border: 1px solid rgb(255 255 255 / 18%);
    border-radius: 50%;
  }
}

.exam-header__content {
  min-width: 0;

  h1 {
    max-width: 720px;
    margin: 8px 0 22px;
    color: inherit;
    font-size: clamp(26px, 4vw, 43px);
    line-height: 1.35;
  }
}

.exam-header__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-bottom: 18px;
  padding: 9px 13px;
  color: #fff;
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 999px;
  background: rgb(255 255 255 / 10%);
  text-decoration: none;
  transition: background-color 180ms ease, transform 180ms ease;

  &:hover {
    background: rgb(255 255 255 / 18%);
    transform: translateX(3px);
  }
}

.exam-header__eyebrow {
  margin: 0;
  color: #ffd1c4;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.exam-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 13px;
    color: rgb(255 255 255 / 90%);
    border: 1px solid rgb(255 255 255 / 17%);
    border-radius: 11px;
    background: rgb(8 20 56 / 18%);
    font-size: 14px;
  }
}

.exam-header__illustration {
  display: grid;
  place-items: center;
  width: 128px;
  aspect-ratio: 1;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 32px;
  background: rgb(255 255 255 / 12%);
  transform: rotate(-4deg);

  i {
    font-size: 58px;
  }
}

@media (max-width: 700px) {
  .exam-header {
    grid-template-columns: 1fr;
    padding: 22px 18px;
    border-radius: 20px;
  }

  .exam-header__illustration {
    display: none;
  }

  .exam-header__content h1 {
    margin-bottom: 18px;
    font-size: 25px;
  }

  .exam-header__meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    span:first-child {
      grid-column: 1 / -1;
    }
  }
}
</style>
