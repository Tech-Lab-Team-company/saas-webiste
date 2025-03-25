<script setup lang="ts">
import type Category from "~/types/categories";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import Service from "~/components/Icons/Service.vue";
import NightLife from "~/components/Icons/Nightlife.vue";
import Resturant from "~/components/Icons/Resturant.vue";
import Shop from "~/components/Icons/Shop.vue";

const props = defineProps<{ popularCategory: Category }>();

const { getLocation } = useGeolocation();

// console.log(getLocation());

const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;
const setCategory = async (id: number) => {
  try {
    // console.log("id", id);
    const categoriesIds = [];
    categoriesIds.push(id);
    // console.log("getLocation", await getLocation());
    const { latitude: lat, longitude: lng } = await getLocation();
    // console.log("lat", lat);
    // console.log("lng", lng);
    filterListingParamsBuilder.setCategoryID(categoriesIds);
    filterListingParamsBuilder.setLat(lat);
    filterListingParamsBuilder.setLng(lng);
    navigateTo("/listing");
  } catch (error) {
    console.error("Error getting location:", error);
  }
};

const icon = computed(() => {
  switch (props.popularCategory.type) {
    case 3:
      return Service;
    case 4:
      return NightLife;
    case 1:
      return Resturant;
    case 2:
      return Shop;
  }
});
console.log("Category type:", props.popularCategory.type);
</script>

<template>
  <div class="category-card" @click="setCategory(popularCategory.id)">
    <div class="category-img">
      <!--      <component :is="icon" />-->
      <NuxtImg
        :src="popularCategory.image"
        :alt="popularCategory.name"
        format="webp"
      />
    </div>
    <h6 class="category-title">{{ popularCategory.name }}</h6>
    <p class="category-count">{{ popularCategory.place_count }} place</p>
  </div>
</template>

<style scoped></style>
