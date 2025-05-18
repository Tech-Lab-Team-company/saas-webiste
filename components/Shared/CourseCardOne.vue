<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";



const { data: HomeSections } = await useAsyncData("HomeSections", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"abouelezz.com",
    },
    body: {
      type: SectionTypeEnum.Course,
    },
  });


   const filteredData = response.data.filter(section => section.style === 1);
   console.log(filteredData , "filteredDataOne");
    return filteredData.length > 0 ? filteredData[filteredData.length -1] : null;

});


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

      <h3 class="slider-heading">{{HomeSections?.title}}</h3>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(course, index) in HomeSections?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-wrapper">
              {{ console.log(course?.image?.img , "image") }}
              <img :src="course.image.img" :alt="course.image.alt" class="course-image" />
              <div class="card-overlay-content">
                <p class="card-number">{{ course.course_price }} جنيه</p>
              </div>
            </div>
            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ course.title }}</h5>
              <div class="card-text" v-html="course.description"></div>
              <div class="card-footer">
                <span class="card-icon flex">
                   <img :src="course.teacher.image.img" :alt="course.teacher.image.alt">
                </span>
                <span class="card-name">{{ course.teacher.name }}</span>
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
<!-- 
<div class="card-course-one">
  <div class="slider-wrapper">
    <h3 class="slider-heading">مراجعة اللغة العربية</h3>

    <Splide :options="splideOptions" class="splide-container">
      <SplideSlide v-for="(card, index) in cards" :key="index">
        <NuxtLink :to="`/course/${card.id}`" class="card">
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
        </NuxtLink>
      </SplideSlide>
    </Splide>
  </div>
</div> -->