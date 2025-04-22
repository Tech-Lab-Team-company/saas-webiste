<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";
import Arrrow from "@/public/icons/Arrrow.vue";


// const cards = [
//   {
//     title: "كورس المحاسبة الإدارية",
//     text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
//     img: english,
//     icon: user,
//     number: "1500 جنيه",
//     name: "أحمد حوام",
//   },
//   {
//     title: "كورس المحاسبة الإدارية",
//     text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
//     img: english,
//     icon: user,
//     number: "1500 جنيه",
//     name: "أحمد حوام",
//   },
//   {
//     title: "كورس المحاسبة الإدارية",
//     text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
//     img: english,
//     icon: user,
//     number: "1500 جنيه",
//     name: "أحمد حوام",
//   },
// ];


const splideOptions = {
  type: "loop", 
  perPage: 3, 
  perMove: 1, 
  gap: "5px",
  pagination: false,
  arrows: true,
  drag: false, 
};




import type HomeFirstSection from "~/types/home_first_section";

const props = defineProps({
  HomeSecondSection: {
    type: Object as () => HomeFirstSection | null,
    default: null
}
});

const HomesecondSection = ref(props.HomeSecondSection);

watch(() => props.HomeSecondSection, (newValue) => {
  HomesecondSection.value = newValue;
}, { immediate: true });



</script>
<template>
  <div class="card-course-two">
    <div class="slider-wrapper flex" >
    <h1 class="slider-heading">{{HomesecondSection?.title  }}</h1>

    <Splide :options="splideOptions" class="splide-container">
      <SplideSlide v-for="(course, index) in HomesecondSection?.courses" :key="index">
        <NuxtLink :to="`/course/${course.id}`" class="card"  :style="{ backgroundImage: `url(${course.image.img})` }" >
          <div class="card-body" dir="rtl">
            <div class="card-header">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-number">{{ course.course_price }} جنيه</p>
            </div>
            <div class="card-text" v-html="course.description"></div>
            <div class="card-footer">
              <span class="card-icon">
                <img :src="course.teacher.image.img" :alt="course.teacher.image.alt" class="teacher-image" />
              </span>
              <span class="card-name">{{ course.teacher.name }}</span>
            </div>
            <div class="card-extra-content">
              <Arrrow/>
              <p>ابدا الان</p>
              </div>
          </div>
        </NuxtLink>
      </SplideSlide>
    </Splide>
  </div>
  </div>
  
</template>


<style scoped>

.card-course-two{
  background-color: #FFFCF9;
}
.card-course-two .card{
  background-position: center;
}

</style>