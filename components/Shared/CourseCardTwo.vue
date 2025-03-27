<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";

// بيانات الكروت
const cards = [
  {
    title: "كورس المحاسبه الاداريه",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "احمد حوام",
  },
  {
    title: "كورس المحاسبه الاداريه",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number:  "1500 جنيه",
    name: "احمد حوام",
  },
  {
    title: "كورس المحاسبه الاداريه",
    text: "تعلم كيفية اتخاذ القرارات المالية الذكية وتحليل البيانات لتحسين أداء الأعمال",
    img: english,
    icon: user,
    number: "1500 جنيه",
    name: "احمد حوام",
  },
];
</script>

<template>
  <div class="slider-wrapper flex" dir="rtl">
    <h1 class="slider-heading">
      مراجعه اللغه الانجليزيه</h1>
    <!-- H1 فوق السلايدر -->

    <swiper
      :slides-per-view="3"
      :space-between="20"
      :navigation="true"
      :loop="true"
      :modules="[Navigation]"
      class="swiper-container"
    >
      <swiper-slide v-for="(card, index) in cards" :key="index">
        <div class="card" :style="{ backgroundImage: `url(${card.img})` }">
          <div class="card-body">
            <div class="card-header">
              <h5 class="card-title">{{ card.title }}</h5>
              <P class="card-number">{{ card.number }}</P>

            </div>
            <p class="card-text">{{ card.text }}</p>
            <div class="card-footer ">
                    <span class="card-icon ">
                      <component :is="card.icon" />
                    </span>
                    <span class="card-name">{{ card.name }}</span>
                  </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>


<style scoped>
/* تنسيق العنوان الرئيسي */
.slider-heading {
  font-size: 36px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
}

/* تنسيق السلايدر */
.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.swiper-container {
  width: 80%;
  height: 100%;
  padding-bottom: 30px;
}

/* تنسيق الكروت */
.card {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 300px; /* ارتفاع ثابت للكارت */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  width: 85%;
}


.card::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: #000000B2;
}

/* تنسيق النص داخل الكرت */
.card-body {
  position: relative;
  padding: 10px;
  color: white;
  z-index: 2;
  height: 50%;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.card-title {
  font-family: Zain;
font-weight: 700;
font-size: 22px;
line-height: 100%;
letter-spacing: 0%;
text-align: right;
color: #FFFFFF;
  margin: 0;
}
.card-number {
  background: #FFB949;
    width: 100px;
    border-radius: 20px;
    text-align: center;
    padding: 4px 5px;
    font-weight: 500;
    font-size: 14px;


}
.card-text {
color: #DDE1E6;
font-weight: 400;
font-size: 15px;

text-align: right;

  /* margin: 6px 0; */
  border-bottom: 1px solid #DDE1E6;
  padding:.5rem
}

/* زر */
.btn {
  display: inline-block;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}

.btn:hover {
  background: #0056b3;
}

/* تخصيص أزرار Swiper */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #007bff;
  font-size: 20px;
  transition: color 0.3s ease-in-out;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  color: #0056b3;
}

/* ضبط تخطيط السلايد */
.swiper-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
</style>

<!-- مكتبة Swiper CSS -->
<style>
@import "swiper/css";
@import "swiper/css/navigation";
</style>
