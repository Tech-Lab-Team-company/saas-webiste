<script setup lang="ts">
import type AboutUs from "~/types/about_us";

const props = defineProps<{ aboutUs: AboutUs }>();

const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);
</script>

<template>
  <div class="future">
    <h2 class="main-section-title">
      {{ $t("about_us") }}
    </h2>
    <h3 class="sub-section-title">
      {{ $t("together_we_are_shaping_a_promising_future") }}
    </h3>
    <Swiper
      class="mySwiper about-us-swiper"
      :slides-per-view="5"
      :pagination="{ clickable: true }"
      :modules="[SwiperEffectCoverflow]"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :effect="'coverflow'"
      :coverflow-effect="{
        rotate: 0,
        stretch: 1,
        depth: 100,
        modifier: 1,
        scale: 0.9,
        slideShadows: true,
      }"
      :loop="true"
      :breakpoints="{
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 5,
        },
      }"
    >
      <SwiperSlide v-for="item in aboutUs?.images" :key="item.id">
        <div class="slide">
          <NuxtImg
            :src="item.image"
            alt="about"
            class="slide-img w-full"
            format="webp"
          />
          <div class="overlay"></div>
        </div>
      </SwiperSlide>
    </Swiper>
    <div
      class="social"
      v-if="setting?.facebook || setting?.instagram || setting?.twitter"
    >
      <span>{{ $t("follow_us") }} :</span>
      <a v-if="setting?.facebook" :href="setting?.facebook" target="_blank">
        <IconsFaceGray />
      </a>
      <a v-if="setting?.instagram" :href="setting?.instagram" target="_blank">
        <IconsInstaGray />
      </a>
      <a v-if="setting?.twitter" :href="setting?.twitter" target="_blank">
        <IconsTwitterGray />
      </a>
    </div>
  </div>
</template>

<style scoped></style>
