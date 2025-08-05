<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { baseUrl } from "~/constant/baseUrl";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import { getWebDomain } from "~/constant/webDomain";
import type HomeFirstSection from "~/types/home_first_section";
import SquareIcon from '~/public/icons/squareIcon.vue';

const { data: GraduationParty } = await useAsyncData("GraduationParty", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
    },
    body: {
      type: SectionTypeEnum.GraduationParty,
    },
  });

  return response.data;
});

const swiperRef = ref(null)
let swiperInstance = null

// Swiper event handlers
const onSwiper = (swiper) => {
  swiperInstance = swiper
  console.log('Swiper initialized:', swiper)
}

const onSlideChange = (swiper) => {
  console.log('Slide changed to:', swiper.activeIndex)
}

// Control functions
const startAutoplay = () => {
  if (swiperInstance && swiperInstance.autoplay) {
    swiperInstance.autoplay.start()
  }
}

const stopAutoplay = () => {
  if (swiperInstance && swiperInstance.autoplay) {
    swiperInstance.autoplay.stop()
  }
}

const nextSlide = () => {
  if (swiperInstance) {
    swiperInstance.slideNext()
  }
}

const prevSlide = () => {
  if (swiperInstance) {
    swiperInstance.slidePrev()
  }
}

onMounted(() => {
  // Additional setup if needed
  console.log('Component mounted')
})
</script>

<template>
  <div class="swiper-container-wrapper" v-for="(section, index) in GraduationParty" :key="index">
    <h3 class="slider-heading">{{ section?.title }}</h3>
    <p class="description-text">{{ section?.description }}</p>
    <swiper-container 
      :ref="`swiperRef`" 
      :slides-per-view="3" 
      :space-between="3" 
      :loop="true" 
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: false,
      }" 
      :modules="[Autoplay, Pagination, Navigation, EffectFade]" 
      :navigation="{
        nextEl: `.swiper-button-next-${index}`,
        prevEl: `.swiper-button-prev-${index}`,
      }" 
      :pagination="{
        el: `.swiper-pagination-${index}`,
        clickable: true,
        dynamicBullets: true,
      }" 
      :breakpoints="{
        120: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }" 
      @swiper="onSwiper" 
      @slideChange="onSlideChange">
      <swiper-slide v-for="(image, slideIndex) in section.media" :key="slideIndex">
        <div class="slide-content">
          <a :href="`/course?year_id=${image.year_id}&division_id=${image.division_id}`">
            <div class="image-conatiner">
              <img :src="image?.file" :alt="image.alt" />
            </div>
          </a>
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- Custom Navigation Buttons with unique classes -->
    <div :class="`swiper-button-prev swiper-button-prev-${index}`"></div>
    <div :class="`swiper-button-next swiper-button-next-${index}`"></div>

    <!-- Custom Pagination with unique class -->
    <div :class="`swiper-pagination swiper-pagination-${index}`"></div>

    <SquareIcon class="dots-icons-one" />
    <SquareIcon class="dots-icons-two" />

  </div>
</template>

<style scoped>
.description-text {
  text-align: center;
}

.dots-icons-one {
  position: absolute;
  top: 88%;
  transform: translateY(-80%);
  left: -4%;
  z-index: -1;
}

.dots-icons-two {
  position: absolute;
  top: 44%;
  transform: translateY(-80%);
  right: 0;
  z-index: -1;
}

@media(max-width:768px) {
  .dots-icons-two {
    right: 0%;
  }
}

.swiper-container-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

swiper-container {
  width: 100%;
}

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  font-weight: bold;
  width: 380px;
  margin-right: 30px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 12px;
}

.slide-content {
  text-align: center;
  height: 100%;
  border-radius: 15px;
}

.slide-content a {
  //height: 100%;
  border-radius: 15px;
}

.slide-content a .image-conatiner {
  //height: 100%;
  border-radius: 15px;
  //border: 10px solid rgba(128, 128, 128, 0.404);
}

.slide-content a .image-conatiner img {
  object-fit: cover;
  //aspect-ratio: 16/9;
  border-radius: 15px;
  width: 100%;
  //height: 100%;
}

.slide-content h3 {
  margin-bottom: 10px;
  font-size: 24px;
}

.slide-content p {
  font-size: 16px;
  opacity: 0.8;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.control-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-buttons button:hover {
  background-color: #0056b3;
}

/* Custom navigation buttons styling */
.swiper-button-next,
.swiper-button-prev {
  color: #9D9D9D;
  font-size: 30px;
  font-weight: 900;
  margin-top: 20px;
}

@media(max-width:768px) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none;
  }
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 20px;
  font-weight: bold;
}

/* Custom pagination styling */
.swiper-pagination {
  bottom: 10px;
}

:deep(.swiper-pagination-bullet) {
  background-color: #007bff;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background-color: #007bff;
}

.swiper-button-next {
  right: var(--swiper-navigation-sides-offset, 5px) !important;
}

.swiper-button-prev {
  right: var(--swiper-navigation-sides-offset, 5px) !important;
}

@media (max-width:768px) {
  .swiper-button-next {
    right: var(--swiper-navigation-sides-offset, 5px) !important;
  }
}

@media (max-width:768px) {
  .swiper-button-prev {
    right: var(--swiper-navigation-sides-offset, -5px) !important;
  }
}
</style>