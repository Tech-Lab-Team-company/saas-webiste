<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import microphone from "@/public/icons/microphone.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";


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

</script>

<template>
  <div class="card-course-three">
    <div class="slider-wrapper">
      {{ console.log(homesection, "homesection3") }}
      <h3 class="slider-heading">{{ homesection?.title }}</h3>
      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(course, index) in homesection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-container">
              <img :src="course.image.img" :alt="course.image.alt" class="course-image" />
              <p class="overlay-text">{{ course.course_price }} جنيه</p>
            </div>

            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ course.title }}</h5>
              <div class="card-content">
                <p class="card-text1">
                  <video1 />
                  {{ course.course_videos }} فيديو
                </p>
                <p class="card-text1">
                  <note />
                  {{ course.course_docs }} ملف ورقي
                </p>
                <p class="card-text1">
                  <microphone />
                  {{ course.course_records }} ملف صوتى
                </p>
              </div>
              <div class="card-footer">
                <div class="card-text" v-html="course?.description"></div>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<style scoped>
.card-course-three {
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
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
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  margin: 0 auto;
  background-color: #F1F1F1;
}

.card:hover {
  transform: translateY(-10px);
}

.image-container {
  position: relative;
  width: 100%;
  padding: 6px;
}

.course-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  background-color: white;
  border-radius: 10px;
}

.overlay-text {
  position: absolute;
  top: 15%;
  left: 20%;
  transform: translate(-50%, -50%);
  padding: 6px 15px;
  border-radius: 8px;
  background: #ffffff;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  color: #032855;
  font-weight: 800;
  font-size: 14px;
  font-family: "regular";
}

.card-body {
  padding: 20px;
      /* background-color: gray;
    border-radius: 10px; */
}

.card-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: right;
  margin: 0;
  font-family: "bold";
}

.card-content {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  flex-wrap: wrap;
  gap: 10px;
}

.card-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: #656b78;
  font-family: "regular";
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-text1 {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  display: flex;
  gap: 5px;
  align-items: center;
  font-family: "regular";
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  
  .course-image {
    height: 200px;
  }
}

@media (max-width: 992px) {
  .slider-heading {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .card-title {
    font-size: 18px;
    line-height: 26px;
  }
  
  .card-text,
  .card-text1 {
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
  
  .card-body {
    padding: 15px;
  }
  
  .course-image {
    height: 180px;
  }
  
  .overlay-text {
    font-size: 13px;
    width: 90px;
    padding: 5px 10px;
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
  
  .card-title {
    font-size: 16px;
    line-height: 24px;
  }
  
  .card-text,
  .card-text1 {
    font-size: 14px;
  }
  
  .course-image {
    height: 160px;
  }
  
  .overlay-text {
    font-size: 12px;
    width: 80px;
    padding: 4px 8px;
  }
  
  .card-content {
    flex-direction: column;
    gap: 8px;
    margin: 10px 0;
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