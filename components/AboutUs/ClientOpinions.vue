<script setup lang="ts">
import type ClientOpinion from "~/types/client_opinion";

const props = defineProps<{
  clientOpinions: ClientOpinion[];
}>();
</script>

<template>
  <section class="client-opinions">
    <h2 class="sub-section-title">
      {{ $t("client_opinions") }}
    </h2>
    <p class="text-center">
      {{
        $t(
          "Reliable_reviews_from_our_customers_whose_experiences_are_the_best_proof_of_the_quality_of_what_we_offer",
        )
      }}
    </p>
    <Swiper
      class="mySwiper client-opinions-swiper"
      :slides-per-view="3"
      :space-between="30"
      :modules="[SwiperController, SwiperAutoplay, SwiperNavigation]"
      :loop="true"
      :pagination="{
        clickable: true,
      }"
      :navigation="{
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
      }"
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
      }"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      dir="ltr"
    >
      <SwiperSlide
        class="client-opinion-card"
        v-for="i in clientOpinions"
        :key="i.id"
      >
        <div class="client-opinion-card-img">
          <NuxtImg
            src="quote-down.png"
            alt="quote-down"
            class="client-opinion-card-img"
            format="webp"
          />
        </div>
        <q class="client-opinion-card-text">
          {{ i?.opinion }}
        </q>
        <div class="client-info">
          <NuxtImg
            :src="i?.image"
            :alt="i?.name"
            class="client-opinion-card-img"
            format="webp"
          />
          <div class="client-opinion-card-info">
            <h3 class="client-opinion-card-name">{{ i?.name }}</h3>
            <p class="client-opinion-card-email">{{ i?.email }}</p>
          </div>
        </div>
      </SwiperSlide>
      <div class="arrows">
        <span class="custom-prev">
          <IconsSwiperArrowLeft />
        </span>
        <span class="custom-next">
          <IconsSwiperArrowRight />
        </span>
      </div>
    </Swiper>
  </section>
</template>

<style scoped></style>
