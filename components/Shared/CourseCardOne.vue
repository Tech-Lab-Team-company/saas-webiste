Course Card One 

<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import AllCourseTwo from "../Course/AllCourseTwo.vue";
import type HomeSection from "~/types/home_section_interface";



const props = defineProps<{
  HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

const splideOptions = {
  type: "slide", // Explicitly set to slide mode
  rewind: false, // Disable rewind to prevent snapping back
  perPage: 3,
  perMove: 1,
  gap: "1rem",
  pagination: false,
  arrows: true,
  drag: true,
  dragMinThreshold: {
    mouse: 10,
    touch: 10
  },
  flickPower: 100, // Increase flick power for better mobile response
  flickMaxPages: 1, // Limit flick pages
  classes: {
    arrows: 'splide__arrows slider-arrows',
    arrow: 'splide__arrow slider-arrow',
    prev: 'splide__arrow--prev slider-prev',
    next: 'splide__arrow--next slider-next',
  },
  breakpoints: {
    1200: {
      perPage: 3,
      gap: "1rem",
    },
    992: {
      perPage: 2,
      gap: "0.8rem",
      // arrows: true,
      drag: true,
    },
    768: {
      perPage: 2,
      gap: "0.6rem",
      // arrows: true,
      drag: true,
    },
    576: {
      perPage: 1,
      gap: "0.5rem",
      // arrows: true,
      drag: true,
      padding: { left: '2.5rem', right: '2.5rem' } // Add padding for arrows
    }
  }
};

watch(
  () => props.HomeSections,
  (newValue) => {
    homesection.value = newValue;
  },
  { immediate: true }
)

const { locale } = useI18n();

</script>

<template>

  <div class="card-course-one">
    <div class="slider-wrapper">

      <h3 class="slider-heading">{{ homesection?.title || UserSetting.setting?.name }}</h3>
      <Splide :options="splideOptions" class="splide-container" v-if="homesection?.courses?.length >= 2">
        <SplideSlide v-for="(course, index) in homesection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-wrapper">
              <img :src="course?.image?.img" :alt="course?.image?.alt" class="course-image" />
              <!-- <img src="../../assets/images/img1.png" alt=""> -->
              <div class="card-overlay-content">
                <p class="card-number" v-if="course?.course_price > 0">{{ course?.course_price }} {{ course?.currency }}
                </p>
                <p class="card-number" v-else>{{ $t('مجانى') }}</p>
              </div>
            </div>
            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ course?.title }}</h5>
              <div class="card-text" v-html="course?.description"></div>
              <div class="card-footer">
                <span class="card-icon flex">
                  <img :src="course.teacher?.image?.img || UserSetting.setting?.image?.img"
                    :alt="course?.teacher?.image?.alt">
                </span>
                <span class="card-name">{{ course?.teacher?.name || UserSetting.setting?.name }}</span>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </Splide>

      <div class="btns">

      </div>
    </div>
  </div>

  <div class="card-course-twoo" v-if="homesection?.courses?.length < 2">
    <div>
      <div class="cards-grid">
        <NuxtLink v-for="card in homesection?.courses" :key="card?.id" :to="`/course/${card?.id}`" class="card">
          <div class="card-inner" dir="rtl">
            <div class="image-container">

              <img :src="card?.image?.img || ''" alt="course image" class="card-image" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <h5 class="card-title">{{ card?.title }}</h5>
              </div>

              <p class="card-text" v-html="card?.description"></p>

              <div class="card-content">
                <p class="card-text1" v-if="card?.course_videos">
                  <video1 />
                  {{ card?.course_videos }}
                  {{ $t('فيديو') }}
                </p>
                <p class="card-text1" v-if="card?.course_docs">
                  <note />
                  {{ card?.course_docs }}
                  {{ $t('ملف ورقي') }}
                </p>
                <p class="card-text1" v-if="card?.course_records">
                  <microphone />
                  {{ card?.course_records }}
                  {{ $t('ملف صوتى') }}
                </p>
              </div>

              <div class="card-footer">
                <span class="card-icon">
                  <img :src="card?.teacher?.image?.img || UserSetting.setting?.image?.img"
                    :alt="card?.teacher?.image?.alt" class="teacher-image" />
                  <span class="card-name">{{ card?.teacher?.name || UserSetting.setting?.name }}</span>
                </span>
                <p class="card-number">{{ card?.course_price }} {{ card?.currency }}</p>
              </div>

              <div class="card-extra-content">
                <Arrroww />
                <p>{{ $t('ابدا الان') }}</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
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
  margin-top: 20px;


}

.slider-heading {
  text-align: right;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #032855;
}

.splide-container {
  width: 88%;
  padding: 0 2.5rem;
  /* Add padding for arrows */
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
  padding-top: 56.25%;
  /* 16:9 Aspect Ratio */
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

.card-footer {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.card-icon {
  width: fit-content;
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
    padding: 0 2rem;
    /* Adjust padding for mobile */
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

.splide__slide {

  padding-bottom: 28px;
  display: flex;
  justify-content: center;
}

@media (max-width:500px) {

  .splide__slide {
    display: flex;
    justify-content: center;
    padding-bottom: 28px;
    box-sizing: border-box;
    width: 100%; // ✅ Ensure proper width
  }
}

.card-footer {
  .card-icon {
    .teacher-image {
      max-width: 50px;
    }
  }

}

.card-course-twoo {
  width: 100%;
}

.card {
  width: 100%; // ✅ important for mobile
}

.card {
  display: flex;
  border-radius: 15px;
  background: white;

}

@media(max-width: 768px) {
  .card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

}

.card-inner {
  display: flex;
  // width: 98%;
  // height: 95%;
  // align-items: start;
  flex-direction: row;
}

@media (max-width: 768px) {
  .card-inner {
    flex-direction: column;
  }
}

.image-container {
  position: relative;
  width: 48%;
  // height: 100%;
  max-height: 210px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  border-radius: 12px;
}

@media(max-width: 768px) {
  .image-container {
    width: 100%;
    height: 200px;
  }
}

.card-image {
  width: 100%;
  // height: fit-content;
  min-height: 210px;
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.cards-heading {
  font-size: 25px;
  color: #222;
  margin-bottom: 20px;
  font-weight: 400;
  font-family: "regular", serif;
  text-align: right;
  width: 87%;
}

.cards-grid {
  display: grid;
  gap: 20px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  // height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
}

.card-body {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 95%;
  padding: 1rem 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #000;
  margin: 0;
  font-family: "bold", serif;
}

.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular", serif;

}

.card-text {
  color: #656b78;
  font-weight: 400;
  font-size: 1rem;
  text-align: right;
  font-family: "regular", serif;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 3em);
  line-height: var(--line-height);
  --line-height: 1.5;
  height: 75px;

  * {
    font-size: 1rem;
  }

  // margin: 10px 0;
}

@media(max-width: 768px) {
  .card-text {
    height: 70px;
  }

}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 5px 1px;
  justify-content: space-between;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  // margin: 0px 10px;
  color: #000;
  width: 100px;
}

.card-extra-content {
  border-top: 1px solid #dde1e6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  // padding: 2px 5px;
}

.card-extra-content p {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: #000000;
  font-family: "bold";
  cursor: pointer;
  margin: 0px 10px;
}

.card-extra-content svg {
  cursor: pointer;
  padding-top: 4px;
  color: #000000;
}

.card-content {
  display: flex;
  gap: 2rem;

  // margin-top: 10px;
  @media (max-width:768px) {
    flex-direction: column;
    gap: 5px;

  }
}

.card-text1 {
  color: #737e8a;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  font-family: "regular";
  display: flex;
  gap: 5px;

  @media (max-width:768px) {
    font-size: 15px;
  }
}

.card-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>