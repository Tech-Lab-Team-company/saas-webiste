<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";

// const { data: HomeSections } = await useAsyncData("FirstHomeSections", async () => {
//   const response = await $fetch<{
//     data: HomeFirstSection[];
//     message: string;
//     status: number;
//   }>(`${baseUrl}/fetch_home_website_section`, {
//     method: "POST",
//     headers: {
//       "Accept-Language": "ar",
//       "web-domain":"abouelezz.com",
//     },
//     body: {
//       type: SectionTypeEnum.Course,
//     },
//   });


//   const filteredSections = response.data.filter(section => section.style === 1);
  
//   // const allCourses = filteredSections.flatMap(section => section.courses);
  
//   // console.log(allCourses, "All Courses");
  

//   return filteredSections;
  

// });

const props = defineProps<{
  HomeSections: {};
}>();

const homesection = ref(props.HomeSections)


const splideOptions = {
  type: "loop",
  perPage: 3,
  perMove: 1,
  gap: "1rem",
  pagination: false,
  arrows: true,
  drag: true,
  breakpoints: {
    1200: {
      perPage: 3,
      gap: "1rem",
    },
    992: {
      perPage: 2,
      gap: "0.8rem",
    },
    768: {
      perPage: 2,
      gap: "0.6rem",
    },
    576: {
      perPage: 1,
      gap: "0.5rem",
      arrows: true, // Keep arrows visible on mobile
      drag: true,
    }
  }
};

watch(
  ()=>props.HomeSections,
  (newValue) => {
    homesection.value = newValue; 
  },
  { immediate: true }
)
</script>

<template>
  <div class="card-course-one">
    <div class="slider-wrapper">
      {{ console.log(HomeSections, "HomeSections") }}
      <h3 class="slider-heading">{{homesection?.title}}</h3>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(course, index) in homesection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-wrapper">
              <img :src="course.image.img" :alt="course.image.alt" class="course-image" />
              <!-- <img src="../../assets/images/img1.png" alt=""> -->
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
.card-course-one {
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.slider-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.slider-heading {
  text-align: right;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #032855;
}

.splide-container {
  width: 88%;
  padding: 0 2.5rem; /* Add padding for arrows */
}

/* Custom arrow styling */
:deep(.splide__arrow) {
  background: #032855;
  opacity: 1;
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.splide__arrow svg) {
  fill: white;
  width: 1.2rem;
  height: 1.2rem;
}

:deep(.splide__arrow--prev) {
  left: -1rem;
}

:deep(.splide__arrow--next) {
  right: -1rem;
}

.card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 0 0.5rem;
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  min-height: 200px;
}

.course-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay-content {
  position: absolute;
  bottom: 0;
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
  left: 0;
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

.card-body {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #032855;
}

.card-text {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.card-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 0.5rem;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-name {
  font-size: 0.875rem;
  color: #032855;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .slider-heading {
    font-size: 1.3rem;
  }
}

@media (max-width: 992px) {
  .slider-heading {
    font-size: 1.2rem;
  }
  .card-title {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .slider-heading {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  .card {
    margin: 0 0.25rem;
  }
  :deep(.splide__arrow) {
    width: 2rem;
    height: 2rem;
  }
  :deep(.splide__arrow svg) {
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 576px) {
  .slider-heading {
    font-size: 1rem;
  }
  .card-overlay-content {
    min-width: 120px;
    height: 40px;
  }
  .card-number {
    width: 100px;
    height: 25px;
    font-size: 12px;
  }
  .splide-container {
    padding: 0 2rem; /* Adjust padding for mobile */
  }
  :deep(.splide__arrow) {
    width: 1.8rem;
    height: 1.8rem;
  }
  :deep(.splide__arrow--prev) {
    left: -0.5rem;
  }
  :deep(.splide__arrow--next) {
    right: -0.5rem;
  }
}

  .splide__slide{

    padding-bottom: 28px;
      display: flex;
    justify-content: center;
  }
@media (max-width:500px) {
  
  .splide__slide{
    width: calc(100% + 0rem);
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    align-items: center;
    display: flex;
    padding-bottom: 28px;
  
  }
}
</style>