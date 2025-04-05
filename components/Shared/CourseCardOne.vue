<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

import arabic from "@/assets/images/arabic.png";
import arabic_two from "@/assets/images/arabic_two.png";
import arabic_three from "@/assets/images/arabic_three.png";
import user from "@/public/icons/user.vue";

const cards = [
  {
    id: 1,
    title: "كورس مراجعة النحو مادة اللغة العربية",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية من الأساسيات إلى الاحتراف.",
    img: arabic,
    icon: user,
    name: "أحمد حوام",
  },
  {
    id: 2,
    title: "كورس مراجعة النحو مادة اللغة العربية",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية من الأساسيات إلى الاحتراف.",
    img: arabic_two,
    icon: user,
    name: "أحمد حوام",
  },
  {
    id: 3,
    title: "كورس مراجعة النحو مادة اللغة العربية",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية من الأساسيات إلى الاحتراف.",
    img: arabic_three,
    icon: user,
    name: "أحمد حوام",
  },
];
const splideOptions = {
  type: "loop",
  // autoplay: true,
  // interval: 3000,
  // speed: 1000,
  perPage: 3, 
  perMove: 1,
  gap: "20px",
  pagination: false,
  arrows: true, 
  drag: false, 
};
</script>

<template>
  <div class="card-course-one" >
    <div class="slider-wrapper">
      <h3 class="slider-heading">مراجعة اللغة العربية</h3>

      <Splide :options="splideOptions" class="splide-container" >
        <SplideSlide v-for="(card, index) in cards" :key="index">
          <div class="card">
            <img :src="card.img" alt="Card image" class="course-image" />
            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-text">{{ card.text }}</p>
              <div class="card-footer">
                <span class="card-icon flex">
                  <component :is="card.icon" />
                </span>
                <span class="card-name">{{ card.name }}</span>
              </div>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>
