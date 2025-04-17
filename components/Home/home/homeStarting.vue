<script setup lang="ts">
import BackgoundCircle from '~/public/icons/BackgoundCircle.vue';
import { ref, onUpdated } from 'vue';
import EducationStages from './EducationStages.vue';
import Students from './Students.vue';
import { baseUrl } from '~/constant/baseUrl';
import type { SwiperHome } from '~/types/swiperhome';  // استيراد النوع

const containerRef = ref(null);
const swiper_position = ref('next');

// Swiper control
const swiper = useSwiper(containerRef);

// Fetch slider data
const { data: sliders, pending, error } = await useAsyncData('sliders', async () => {
  try {
    const response = await $fetch<{
      data: SwiperHome[];  // استخدام النوع هنا
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_sliders`, {
      method: 'POST',
      headers: {
        'Accept-Language': 'ar',
        'web-domain': 'abouelezz.com',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch sliders:', err);
    return [];
  }
});

// Log containerRef updates for debugging
onUpdated(() => {
  console.log('containerRef.value:', containerRef.value);
});
</script>


<template>
    <div class="main-container">
      <ClientOnly>
        <!-- Loading state -->
        <div v-if="pending" class="loading">جاري التحميل...</div>
        <!-- Error state -->
        <div v-else-if="error" class="error">فشل في تحميل السلايدر.</div>
        <!-- Slider -->
        <swiper-container v-else ref="containerRef">
          <swiper-slide v-for="slide in sliders" :key="slide.id">
            <div v-if="slide.media.img" class="container">
              <div class="image-container">
                <BackgoundCircle class="background" />
                <img :src="slide.media.img" :alt="slide.media.alt" />
              </div>
              <div class="details">
                <div class="title">
                  <p class="main-title">{{ slide.title }}</p>
                  <p class="sub-title">{{ slide.subtitle }}</p>
                </div>
                <button class="btn btn-primary">ابــــدأ الآن</button>
              </div>
            </div>
            <div v-else class="vid-container">
              <div class="video">
                <div class="layer"></div>
                <video autoplay muted :src="slide.media.img"></video>
              </div>
              <div class="vid-details">
                <div class="vid-title">
                  <p class="title">{{ slide.text }}</p>
                  <p class="vid-main-title">{{ slide.title }}</p>
                  <p class="vid-sub-title">{{ slide.subtitle }}</p>
                </div>
                <button class="btn btn-primary">ابــــدأ الآن</button>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
        <!-- Navigation buttons -->
        <div v-if="!pending && !error" class="home-buttons">
          <button class="prev-btn" @click="swiper.prev(); swiper_position = 'prev';" :class="{ active: swiper_position === 'prev' }"></button>
          <button class="next-btn" @click="swiper.next(); swiper_position = 'next';" :class="{ active: swiper_position === 'next' }"></button>
        </div>
      </ClientOnly>
      <EducationStages />
      <Students />
    </div>
  </template>
  



