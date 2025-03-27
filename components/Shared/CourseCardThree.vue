<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import arabic from "@/assets/images/arabic.png";
import arabic_two from "@/assets/images/arabic_two.png";
import arabic_three from "@/assets/images/arabic_three.png";
import microphone from "@/public/icons/microphone.vue";
import user from "@/public/icons/user.vue";
import note from "@/public/icons/note.vue";
import video from "@/public/icons/video.vue";

//  data
const cards = [
  {
    id: 1,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    img: arabic,
    icon: user,
    
    name: "احمد حوام",
  },
  {
    id: 2,
    title: "كورس مراجعه النحو مادة اللغه العربيه",
    img: arabic_two,
    icon: user,
    name: "احمد حوام",
  },
  {
    id: 3,
    title: "كورس مراجعه النحو مادة اللغه العربيه",

    img: arabic_three,
    icon: user,
    name: "احمد حوام",
  },
];
</script>

<template>
  <div class="card-course-three">
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
            <div class="image-container">
              <img :src="card.img" alt="Card image" class="course-image" />
              <p class="overlay-text">1500 جنيه</p>
            </div>
            
            <div class="card-body">
              <h5 class="card-title">{{ card.title }}</h5>
              <div class="card-content">
                <p class="card-text">
      <microphone /> 20 فيديو
    </p>
              <p class="card-text">
                <note />
                20 ملف ورقي</p>
              <p class="card-text">
                <microphone />
                20 ملف ورقي</p>

              </div>
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
.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
}
.image-container {
  position: relative;
  width: 100%;
  padding: 0;
}

.course-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.overlay-text {
  position: absolute;
  top: 15%;
  left: 15%;
  transform: translate(-50%, -50%);
  padding: 6px 15px;
  border-radius: 8px;
  background: #ffffff;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  color: #032855;
  font-weight: 500;
  font-size: 14px;

}
.card-content{
  display: flex;
}

.card-text{
  display: flex;
  align-items: center;
  gap: 2px;
  color: #032855;
  padding: 0 ;

}        
</style>
<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>
