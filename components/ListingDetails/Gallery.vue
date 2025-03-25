<script setup lang="ts">
import ImageModel from "~/features/ListingFeature/Data/models/image_model";

import Galleria from "primevue/galleria";

import Dialog from "primevue/dialog";

const props = defineProps<{ images: ImageModel[]; video: string }>();
const hoveredImage = ref<string | null>(null);

const activeIndex = ref(0);
const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 5,
  },
  {
    breakpoint: "768px",
    numVisible: 3,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
]);
const displayCustom = ref(false);

const imageClick = (index: number) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
</script>

<template>
  <div class="img-gallery">
    <div
      :class="[
        'img',
        image === images[images.length > 6 ? 5 : images.length - 1]
          ? 'last-img'
          : '',
      ]"
      v-for="(image, index) in images.slice(0, 6)"
    >
      <NuxtImg
        alt="listing image"
        :src="image.image"
        @click="imageClick(index)"
        :class="[
          image === images[0] && !hoveredImage ? 'main-img' : '',
          { 'main-img': image === hoveredImage },
        ]"
        format="webp"
        loading="lazy"
        @mouseover="hoveredImage = image.image"
        @mouseleave="hoveredImage = null"
      />
      <span
        class="gallery-icon"
        v-if="image === images[images.length > 6 ? 5 : images.length - 1]"
      >
        <IconsGallery />
        <span v-if="images.length > 6">more ({{ images.length - 6 }})</span>
      </span>
    </div>
<!--    <div class="video" v-if="video">-->
<!--      <iframe-->
<!--          :src="`https://www.youtube.com/embed/${video}`"-->
<!--          frameborder="0"-->
<!--          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"-->
<!--          allowfullscreen>-->
<!--      </iframe>  -->
<!--    </div>-->
  </div>
  <Galleria
    v-model:activeIndex="activeIndex"
    v-model:visible="displayCustom"
    :value="images"
    :responsiveOptions="responsiveOptions"
    :numVisible="7"
    containerStyle="width: 70%; margin: auto auto;"
    :circular="true"
    :fullScreen="true"
    :showItemNavigators="true"
    :showThumbnails="false"
  >
    <template #item="slotProps">
      <img
        :src="slotProps.item.image"
        :alt="slotProps.item.alt"
        style="max-width: 100%; display: block"
      />
    </template>
    <template #thumbnail="slotProps">
      <img
        :src="slotProps.item.image"
        :alt="slotProps.item.alt"
        style="display: block"
      />
    </template>
  </Galleria>
</template>

<style scoped></style>
