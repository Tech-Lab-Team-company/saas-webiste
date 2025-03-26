<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import arabic from "@/assets/images/arabic.png";
import arabic_two from "@/assets/images/arabic_two.png";
import arabic_three from "@/assets/images/arabic_three.png";

import user from "@/public/icons/user.vue";

//  data 
const cards = [
  {
    id: 1,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
    img: arabic,
    icon: user,
    name: "احمد حوام",
  },
  {
    id: 2,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    text: "انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
    img: arabic_two,
    icon: user,
    name: "احمد حوام",
  },
  {
    id: 3,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    text: " انطلق في رحلة ممتعة لتعلّم اللغة العربية، من الأساسيات إلى الاحتراف، من خلال دروس تفاعلية وتمارين شيّقة",
    img: arabic_three,
    icon: user,
    name: "احمد حوام",
  },
];
</script>

<template>
    <div class="card-course-one">
        <div class="slider-wrapper" dir="rtl">
          <!-- swiper title -->
          <h3 class="slider-heading">مراجعه اللغه العربيه</h3>
      
          <swiper
            :slides-per-view="3"
            :space-between="20"
            :navigation="true"
            :loop="true"
            :modules="[Navigation]"
            class="swiper-container"
          >
            <swiper-slide v-for="(card, index) in cards" :key="index">
              <div class="card">
                <img :src="card.img" alt="Card image" class="course-image" />
                <div class="card-body">
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
            </swiper-slide>
          </swiper>
        </div>
    </div>
</template>

<style scoped>

</style>

<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>
