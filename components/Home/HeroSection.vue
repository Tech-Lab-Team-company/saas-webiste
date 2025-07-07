<script setup lang="ts">
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import type Header from "~/types/header";
import FetchCitiesController from "~/features/FetchCitiesFeature/presentation/controllers/fetch_cities_controller";
import CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import FetchCitiesParams from "~/features/FetchCitiesFeature/Core/Params/fetch_cities_params";

const search = ref<string>("");
const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;

const searchListing = async () => {
  try {
    if (search.value) {
      filterListingParamsBuilder.setKeyword(search.value);
      filterListingParamsBuilder.setCityId(city.value?.id!);
      await navigateTo(`/listing`);
    }
  } catch (e) {
    // console.log(e);
  }
};

const props =defineProps<{
  header: Header
}>()


// console.log(props.header)

const cities = ref<CityModel[]>([]);
const city  = ref<CityModel>();
const fetchCitiesController = FetchCitiesController.getInstance();

const fetchCities = async () => {
  cities.value = (
    await fetchCitiesController.fetchCities(
      new FetchCitiesParams(1, 1, 10),
    )
  ).value.data!;
};

onMounted(async () => {
  await fetchCities();
})

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: "/public/hero-background.png",
    }
  ]
})
</script>

<template>
  <section class="hero-section">
    <Swiper
      class="mySwiper hero-swiper"
      :slides-per-view="1"
      :space-between="50"
      :pagination="{ clickable: true }"
      :modules="[SwiperPagination, SwiperAutoplay]"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
    >
      <SwiperSlide v-for="image in header.images" :key="image.id">
        <div class="slide">
          <NuxtImg
            :src="image.image"
            :alt="image.alt"
            class="slide-img w-full"
            format="webp"
          />
          <div class="overlay"></div>
        </div>
      </SwiperSlide>
      <!--      <SwiperSlide>-->
      <!--        <div class="slide">-->
      <!--          <NuxtImg-->
      <!--            src="/hero-image-3.png"-->
      <!--            alt="login swiper image"-->
      <!--            class="slide-img w-full"-->
      <!--            format="webp"-->
      <!--          />-->
      <!--          <div class="overlay"></div>-->
      <!--        </div>-->
      <!--      </SwiperSlide>-->
    </Swiper>
    <div class="container info-container mx-auto px-8">
      <div class="info">
        <h1 class="website-main-title">
          {{ header.title }}
        </h1>
        <p class="website-sub-title" v-html="header.description">

        </p>
<!--        <div class="search-bar"></div>-->
        <form @submit.prevent="searchListing" class="form-search-home" >
          <div class="input-wrapper">
            <!-- <label class="input-label" for="time_zone">
              {{ $t("countries") }}
            </label> -->
            <Select
              v-model="city"
              :options="cities"
              optionLabel="title"
              :placeholder="$t('Select_a_region')"
            >
            <template #dropdownicon>
              <IconsLocationPin />
            </template>
          </Select>
          </div>
          <div class="website-input-search">
            <IconsAddress />
            <input
              type="text"
              :placeholder="$t('search')"
              class="search-input"
              aria-label="search"
              name="search"
            v-model="search"
          />
          <button class="primary-button" aria-label="search">
            {{ $t("search") }}
          </button>
          </div>
        </form>
      </div>
    </div>
    <div class="hero-bg">
      <NuxtImg src="/hero-background.png" alt="hero-background" format="webp" />
    </div>
  </section>
</template>

<style scoped></style>
