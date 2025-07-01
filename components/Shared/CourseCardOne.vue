<script setup lang="ts">

import type HomeSection from "~/types/home_section_interface";

const containerRef = ref(null)
const props = defineProps<{
  HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

const swiper = useSwiper(containerRef, {
  effect: 'creative',
  // loop: true,
  autoplay: {
    delay: 5000,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
  breakpoints: {
    1200: {

      slidesPerView: 3,
      spaceBetween: '1rem',
    },
    992: {
      slidesPerView: 2,
      spaceBetween: "1rem"
    },
    768: {
      slidesPerView: 2,
      spaceBetween: "0.8rem"
    },
    576: {
      slidesPerView: 1,
      spaceBetween: "0.5rem",

    }
  }
})

watch(
  () => props.HomeSections,
  (newValue) => {
    homesection.value = newValue;
  },
  { immediate: true }
)

</script>

<template>
  <h3 class="slider-heading" style="margin-top: 10px;">{{ homesection?.title || UserSetting.setting?.name }}</h3>
  <div v-if="homesection?.courses?.length >= 2" class="course-style-one">
    <ClientOnly>
      <swiper-container ref="containerRef">
        <swiper-slide v-for="(slide, idx) in homesection?.courses" :key="idx">
          <NuxtLink :to="`/course/${slide?.id}`">
            <div class="card-container">
              <div class="course-image-container">
                <NuxtImg :src="slide?.image?.img || UserSetting.setting?.image.img" :alt="slide?.image?.alt" />
              </div>
              <div class="course-header">
                <p class="course-title">{{ slide?.title }}</p>
                <p class="course-description" v-html="slide?.description"></p>
              </div>
              <!-- <hr class="course-hr" /> -->
              <div class="course-teacher">
                <p class="teacher-name">{{ slide?.teacher?.name || UserSetting?.setting?.name }}</p>
                <img class="teacher-img" :src="slide?.teacher?.image?.img || UserSetting?.setting?.image?.img"
                  :alt="slide?.teacher?.image?.alt || ''">
              </div>
            </div>
          </NuxtLink>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <button class="right-arrow" @click="swiper.next()">
      <IconsArrowRight />
    </button>
    <button class="left-arrow" @click="swiper.prev()">
      <IconsArrowLeft />
    </button>
  </div>
  <SharedSingleCourseCard v-if="homesection?.courses?.length < 2" :HomeSections="homesection" />
  

</template>

<style scoped lang="scss">

</style>
