<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import Arrrow from "@/public/icons/Arrrow.vue";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";

// const { data: HomeSections } = await useAsyncData("SecondHomeSections", async () => {
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

//   // const filteredData = response.data.filter(section => section.style === 2);
//   // return filteredData.length > 0 ? filteredData[filteredData.length -1] : null;

//   const filteredSections = response.data.filter(section => section.style === 2);
  
//   if (filteredSections.length > 0) {
//     // Then filter courses within those sections that also have style 1
//     const sectionWithFilteredCourses = {
//       ...filteredSections[filteredSections.length - 1],
//       courses: filteredSections[filteredSections.length - 1].courses
//     };
//     console.log(sectionWithFilteredCourses, "filteredDataOne");
//     return sectionWithFilteredCourses;
//   }
  
  
//   return null;

// });

const props = defineProps<{
  HomeSections: {};
}>();

const homesection = ref(props.HomeSections)

watch(
  ()=>props.HomeSections,
  (newValue) => {
    homesection.value = newValue; 
  },
  { immediate: true }
)

const splideOptions = {
  type: "loop",
  perPage: 3,
  perMove: 1,
  gap: "1.5rem",
  pagination: false,
  arrows: true,
  drag: true,
  breakpoints: {
    1200: {
      perPage: 3,
      gap: "1.5rem"
    },
    992: {
      perPage: 2,
      gap: "1rem"
    },
    768: {
      perPage: 2,
      gap: "0.8rem"
    },
    576: {
      perPage: 1,
      gap: "0.5rem",
      arrows: true,
      drag: true
    }
  }
};
</script>

<template>
  <div class="card-course-two">
    <div class="slider-wrapper">
      <h1 class="slider-heading">{{ homesection?.title }}</h1>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(course, index) in homesection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card" :style="{ backgroundImage: `url(${course.image.img})` }">
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
.card-course-two {
  background-color: #FFFCF9;
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 2rem 1rem;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.slider-heading {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 800;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "bold";
}

.splide-container {
  width: 88%;
  height: 100%;
  padding: 0 3rem 30px;
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  width: 100%;
  margin: 0 auto;
}

.card:hover {
  transform: translateY(-4px);
}

.card::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 1;
  transition: height 0.3s ease;
}

.card:hover::before {
  height: 70%;
}

.card-body {
  position: relative;
  z-index: 2;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  transform: translateY(50px);
  transition: transform 0.3s ease;
}

.card:hover .card-body {
  transform: translateY(0);
}

.card-body::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
  transition: height 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 700;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #ffffff;
  margin: 0;
  font-family: "bold";
}

.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular";
}

.card-text {
  color: #dde1e6;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  border-bottom: 1px solid #dde1e6;
  font-family: "regular";
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 5px 1px;
}

.teacher-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  margin: 0px 10px;
}

.card-extra-content {
  border-top: 1px solid #dde1e6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
}

.card-extra-content p {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  cursor: pointer;
  padding: 0 10px;
}

.card-extra-content svg {
  cursor: pointer;
  margin: 0px 10px;
  padding-top: 4px;
}

/* Splide arrows customization */
:deep(.splide__arrow) {
  background: #032855;
  opacity: 1;
  width: 3rem;
  height: 3rem;
}

:deep(.splide__arrow svg) {
  fill: white;
  width: 1.5rem;
  height: 1.5rem;
}

:deep(.splide__arrow--prev) {
  left: 0;
}

:deep(.splide__arrow--next) {
  right: 0;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .slider-heading {
    font-size: 32px;
  }
  
  .card {
    height: 300px;
  }
}

@media (max-width: 992px) {
  .slider-heading {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .card-text {
    font-size: 15px;
  }
  
  :deep(.splide__arrow) {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 768px) {
  .slider-heading {
    font-size: 24px;
  }
  
  .splide-container {
    padding: 0 2.5rem 25px;
  }
  
  .card {
    height: 280px;
  }
  
  .card-number {
    width: 90px;
    font-size: 13px;
  }
  
  :deep(.splide__arrow) {
    width: 2.2rem;
    height: 2.2rem;
  }
}

@media (max-width: 576px) {
  .slider-heading {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .splide-container {
    padding: 0 2rem 20px;
  }
  
  .card {
    height: 260px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .card-text,
  .card-name,
  .card-extra-content p {
    font-size: 14px;
  }
  
  .card-number {
    width: 80px;
    font-size: 12px;
    padding: 3px 4px;
  }
  
  .teacher-image {
    width: 25px;
    height: 25px;
  }
  
  :deep(.splide__arrow) {
    width: 2rem;
    height: 2rem;
  }
  
  :deep(.splide__arrow svg) {
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>