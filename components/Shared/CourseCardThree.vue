<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import book from "@/assets/images/book.png";

import microphone from "@/public/icons/microphone.vue";
import user from "@/public/icons/user.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";





import type HomeFirstSection from "~/types/home_first_section";

const props = defineProps({
  HomeThirdSection: {
    type: Object as () => HomeFirstSection | null,
    default: null
}
});

const HomethirdSection = ref(props.HomeThirdSection);

watch(() => props.HomeThirdSection, (newValue) => {
  HomethirdSection.value = newValue;
}, { immediate: true });



const cards = [
  {
    id: 1,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    img: book,
    text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
  },
  {
    id: 2,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    img: book,
    text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
  },
  {
    id: 3,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    img: book,
    text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
  },
];
const splideOptions = {
  type: "loop", 
  // autoplay: true,
  // interval: 3000,
  // speed: 1000,
  perPage: 3, 
  perMove: 1, 
  gap: "5px",
  pagination: false,
  arrows: true,
  drag: false, 
};
</script>

<template>
  <div class="card-course-three">
    <div class="slider-wrapper" >
      <h3 class="slider-heading"> {{ HomethirdSection?.title }} </h3>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(course, index) in HomethirdSection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-container">
              <img :src="course.image.img" :alt="course.image.alt" class="course-image" />
              <p class="overlay-text">{{ course.course_price }} جنيه</p>
            </div>

            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ course.title }}</h5>
              <div class="card-content">
                <p class="card-text1">
                  <video1 />
                  {{ course.course_videos }} فيديو
                </p>
                <p class="card-text1">
                  <note />
                  {{ course.course_docs }} ملف ورقي
                </p>
                <p class="card-text1">
                  <microphone />
                  {{ course.course_records }} ملف صوتى
                </p>
              </div>
              <div class="card-footer">
                <!-- {{ console.log(course.description) }}  -->
                  <!-- {{ course.description }} -->
                <div class="card-text" v-html="course?.description" ></div>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<style scoped>

.card-course-three .card{
  background-color: #F1F1F1;
}




.card {
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(10px);  
}

</style>
<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>
