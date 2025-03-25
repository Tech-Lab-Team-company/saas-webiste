<script setup lang="ts">
import type OurVision from "~/types/our_vision";

const props = defineProps<{ ourVision: OurVision[] }>();
</script>

<template>
  <section class="our-vision">
    <h2 class="sub-section-title">
      {{ $t("The_Heart_Behind") }} <span class="rakwa">Rakwa</span>
    </h2>
    <p class="text-center">
      {{ $t("Driven_by_your_needs_inspired_by_your_trust") }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <div class="our-vision-card" v-for="item in ourVision" :key="item.id">
        <div class="icon">
          <NuxtImg
            :src="item?.image"
            alt="icon"
            class="our-vision-card-icon"
            format="webp"
          />
        </div>
        <h3 class="our-vision-card-title">{{ item?.title }}</h3>
        <p>
          {{ item?.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
