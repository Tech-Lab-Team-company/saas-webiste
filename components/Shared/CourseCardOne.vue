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
    number: "1500 جنيه",
  },
  {
    id: 2,
    title: "كورس مراجعة النحو مادة اللغة العربية",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية من الأساسيات إلى الاحتراف.",
    img: arabic_two,
    icon: user,
    name: "أحمد حوام",
    number: "1500 جنيه",
  },
  {
    id: 3,
    title: "كورس مراجعة النحو مادة اللغة العربية",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية من الأساسيات إلى الاحتراف.",
    img: arabic_three,
    icon: user,
    name: "أحمد حوام",
    number: "1500 جنيه",
  },
];
const splideOptions = {
  type: "loop",
  perPage: 3,
  perMove: 1,
  gap: "5px",
  pagination: false,
  arrows: true,
  drag: false,
};
</script>

<template>
  <div class="card-course-one">
    <div class="slider-wrapper">
      <h3 class="slider-heading">مراجعة اللغة العربية</h3>

      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(card, index) in cards" :key="index">
          <div class="card">
            <div class="image-wrapper">
              <img :src="card.img" alt="Card image" class="course-image" />
              <div class="card-overlay-content">
                <p class="card-number">{{ card.number }}</p>
              </div>
            </div>
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

<style scoped>
.card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}


.card-overlay-content {
  position: absolute;
  bottom: 0px;
  left: -150px;
  background: #fff;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px 15px;
  z-index: 3;
  transition: left 0.4s ease, opacity 0.4s ease;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  height: 50px;
}
.card:hover .card-overlay-content {
  left: 0px;
  opacity: 1;
  pointer-events: auto;
  
}
.card-number {
  background: #032855;
  color: #fff;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 400;
  font-family: "regular";
  text-align: center;
  width: 120px;
  height: 30px;
}


</style>
