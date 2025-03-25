<script setup lang="ts">
import type ReviewModel from "~/features/ListingFeature/Data/models/review_model";
import { useNuxtApp } from "#app";
const { $googleMaps } = useNuxtApp();

const props = defineProps<{ googleMapId: string }>();

const reviews = ref([]);
const getPlaceDetails = async (placeId: string) => {
  try {
    const google = await $googleMaps.load(); // Load Google Maps API from the plugin

    const service = new google.maps.places.PlacesService(
      document.createElement("div"), // Dummy element required by PlacesService
    );

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId,
          fields: ["name", "formatted_address", "rating", "reviews"], // Specify fields
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(`Failed to fetch place details: ${status}`);
          }
        },
      );
    });
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};

const openGoogleReview = () => {
  if (props.googleMapId) {
    // Open directly in Google Maps
    const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${props.googleMapId}`;
    window.open(googleMapsUrl, '_blank');
  }
};

watch(
  () => props.googleMapId,
  async () => {
    try {
      if (!props.googleMapId) {
        console.warn('No Google Maps Place ID provided');
        reviews.value = { rating: 0, reviews: [] };
        return;
      }
      const placeDetails = await getPlaceDetails(props.googleMapId);
      reviews.value = placeDetails;
    } catch (error) {
      console.error('Error fetching Google Place details:', error);
      reviews.value = { rating: 0, reviews: [] };
    }
  },
  { immediate: true }
);
</script>

<template>
  <section class="google-rate-wrapper">
    <div class="google-review-static">
      <div class="google-statics">
        <NuxtImg
            src="/google.png"
            alt="Google"
            class="client-opinion-card-img"
            format="webp"
        />
        <div class="numbers">
          <span class="rate">
            {{reviews.rating??5 }}
            <IconsStarGold />
          </span>
        </div>
      </div>
        <button type="button" class="add-review" @click="openGoogleReview">
          {{ $t("add_review") }}
        </button>
    </div>
    <div class="rates" v-for="rate in reviews.reviews" :key="rate.id">
      <div class="flex gap-2">
        <div class="client-img">
          <img
            :src="rate.profile_photo_url"
            :alt="rate.author_name"
            class="client-opinion-card-img"
          />
        </div>
        <div>
          <h4 class="user-name">{{ rate.author_name }}</h4>
          <div class="rate-count flex gap-2">
            <GlobalRate :rateCount="rate.rating" />
            <span class="rate-date"> {{ rate.relative_time_description }} </span>
          </div>
        </div>
      </div>
      <div class="rate-content">
        <p class="rate-text">
          {{ rate.text }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
