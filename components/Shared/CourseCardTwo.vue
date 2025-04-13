<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";
import Arrrow from "@/public/icons/Arrrow.vue";


const cards = [
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "أحمد حوام",
  },
  {
    title: "كورس المحاسبة الإدارية",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
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
  gap: "5px",
  pagination: false,
  arrows: true,
  drag: false, 
};
</script>
<template>
  <div class="card-course-two">
    <div class="slider-wrapper flex" >
    <h1 class="slider-heading">مراجعة اللغة الإنجليزية</h1>

    <Splide :options="splideOptions" class="splide-container">
      <SplideSlide v-for="(card, index) in cards" :key="index">
        <div class="card" :style="{ backgroundImage: `url(${card.img})` }">
          <div class="card-body" dir="rtl">
            <div class="card-header">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-number">{{ card.number }}</p>
            </div>
            <p class="card-text">{{ card.text }}</p>
            <div class="card-footer">
              <span class="card-icon">
                <component :is="card.icon" />
              </span>
              <span class="card-name">{{ card.name }}</span>
            </div>
            <div class="card-extra-content">
              <Arrrow/>
              <p>ابدا الان</p>
              </div>
          </div>
        </div>
      </SplideSlide>
    </Splide>
  </div>
  </div>
  
</template>



