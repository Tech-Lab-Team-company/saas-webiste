<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import book from "@/assets/images/book.png";

import microphone from "@/public/icons/microphone.vue";
import user from "@/public/icons/user.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";

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
      <h3 class="slider-heading">مراجعه اللغه العربيه</h3>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(card, index) in cards" :key="index">
          <NuxtLink :to="`/course/${card.id}`" class="card">
            <div class="image-container">
              <img :src="card.img" alt="Card image" class="course-image" />
              <p class="overlay-text">1500 جنيه</p>
            </div>

            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ card.title }}</h5>
              <div class="card-content">
                <p class="card-text1">
                  <video1 />
                  20 ملف ورقي
                </p>
                <p class="card-text1">
                  <note />
                  20 ملف ورقي
                </p>
                <p class="card-text1">
                  <microphone />
                  20 ملف ورقي
                </p>
              </div>
              <div class="card-footer">
                <p class="card-text">{{ card.text }}</p>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<style scoped>

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
