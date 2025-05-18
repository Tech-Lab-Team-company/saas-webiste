<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import english from "@/assets/images/english.png";
import user from "@/public/icons/user.vue";
import Arrrow from "@/public/icons/Arrrow.vue";



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


   const filteredData = response.data.filter(section => section.style === 2);
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
  <div class="card-course-two">
    <div class="slider-wrapper flex" >
    <h1 class="slider-heading">{{HomeSections?.title  }}</h1>
      {{ console.log(HomeSections, "HomeSections22222222222") }}

    <Splide :options="splideOptions" class="splide-container">
      <SplideSlide v-for="(course, index) in HomeSections?.courses" :key="index">
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