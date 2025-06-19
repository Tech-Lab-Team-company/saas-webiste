<script setup lang="ts">
import BackgoundCircle from '~/public/icons/BackgoundCircle.vue';
import { ref, onMounted } from 'vue';
import EducationStages from './EducationStages.vue';
import Students from './Students.vue';
import { baseUrl } from '~/constant/baseUrl';
import type { SwiperHome } from '~/types/swiperhome';
import { register } from 'swiper/element/bundle';
import {getWebDomain} from "~/constant/webDomain"; // For web components

const containerRef = ref<HTMLElement | null>(null);
const swiper_position = ref('next');



const _swiper = useSwiper(containerRef, {
  effect: "fade",
  loop: true,
  autoplay: {
    delay: 2000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "bullets",
    dynamicBullets: true,
  },
});

// Register Swiper web components
onMounted(() => {
  register();
});

// Fetch slider data
const { data: sliders, pending, error } = await useAsyncData('sliders', async () => {
  try {
    const response = await $fetch<{
      data: SwiperHome[];
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_sliders`, {
      method: 'POST',
      headers: {
        'Accept-Language': 'ar',
        'web-domain': getWebDomain,
      },
      body: {
        type: 3,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch sliders:', err);
    return [];
  }
});



    const isImage = (url) => {
        if (!url) return false;
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const extension = url.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
        };

        // Check if URL is a video
        const isVideo = (url) => {
        if (!url) return false;
        const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
        const extension = url.split('.').pop().toLowerCase();
        return videoExtensions.includes(extension);
        };
</script>


<template>
    <div class="main-container">
      <ClientOnly>
        <!-- Loading state -->
        <div v-if="pending" class="loading">{{ $t('جاري التحميل...') }}</div>
        <!-- Error state -->
        <div v-else-if="error" class="error">{{ $t('فشل في تحميل السلايدر.') }}</div>
        <!-- Slider -->
        <swiper-container class="header-home-section" v-else ref="containerRef">
          <swiper-slide v-for="slide in sliders" :key="slide.id">
            <div v-if="isImage(slide?.media?.img)" class="container">
              <div class="image-container">
                <BackgoundCircle class="background" />
                <!-- <img :src="slide.media.img" :alt="slide.media.alt" /> -->
                <img  v-if="isImage(slide?.media?.img)"  class="row-img" :src="slide?.media?.img"/>
                <!-- <video v-else-if="isVideo(slide?.media?.img)" class="row-video"  autoplay>
                    <source :src="slide?.media?.img" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <img  v-else="isImage(slide?.media?.img)"  class="row-img" :src="slide?.media?.img"/> -->
              </div>
              <div class="details">
                <div class="title">
                  <p class="main-title">{{ slide.title }}</p>
                  <p class="sub-title">{{ slide.subtitle }}</p>
                </div>
                <!-- <button class="btn btn-primary">ابــــدأ الآن</button> -->
              </div>
            </div>
            <div v-else class="vid-container">
              <div class="video">
                <div class="layer"></div>
                <video autoplay muted loop >
                  <source :src="slide.media.img" type="video/mp4">
                </video>
              </div>
              <div class="vid-details">
                <div class="vid-title">
                  <p class="title">{{ slide.text }}</p>
                  <p class="vid-main-title">{{ slide.title }}</p>
                  <p class="vid-sub-title">{{ slide.subtitle }}</p>
                </div>
                <!-- <button class="btn btn-primary">{{ $t('ابــــدأ الآن') }}</button> -->
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>



    </div>
    <EducationStages />
    <Students />

  </template>


<style scoped>
.row-video{
  position: absolute;
  border-radius: 15px;
}

</style>