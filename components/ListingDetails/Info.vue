<script setup lang="ts">
import { useNuxtApp } from "#app";
import ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";
const { $googleMaps } = useNuxtApp();

const initMap = async () => {
  try {
    const google = await $googleMaps.load();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: {
          lat: Number(props.listing.location?.lat),
          lng: Number(props.listing.location?.lng),
        },
        zoom: 14,
      }
    );
    // console.log(Number(props.listing.location.lat));
    // console.log(props.listing.location.lng);

    const marker = new google.maps.Marker({
      position: {
        lat: Number(props.listing.location?.lat),
        lng: Number(props.listing.location?.lng),
      },
      map,
      icon: {
        url: "/marker.png",
        scaledSize: new google.maps.Size(50, 50), // Resize the icon
      },
    });

    // marker.addListener("dragend", (event: Event) => {
    //   location.value.latitude = event.latLng.lat();
    //   location.value.longitude = event.latLng.lng();
    //   console.log(location.value.latitude, location.value.longitude);
    //
    //
    //   // fetchAddress(location.value.latitude, location.value.longitude);
    // });
  } catch (error) {
    console.error("Error loading Google Maps:", error);
  }
};

const props = defineProps<{
  listing: ListingDetailsModel;
}>();

onMounted(() => {
  initMap();
});

watch(
  () => props.listing,
  () => {
    initMap();
  }
);
</script>

<template>
  <section class="listing-info">
    <div class="listing-description">
      <h3>{{ $t("description") }}</h3>
      <p v-html="listing.BasicInformation?.description"></p>
    </div>
    <div class="listing-categories">
      <h3>{{ $t("categories") }}</h3>
      <div class="flex flex-wrap gap-2">

      <div
        class="categories"
        v-for="category in listing.BasicInformation?.category"
      >
        <span> {{ category?.title }} </span>
      </div>
      </div>
    </div>
    <div
      class="listing-categories"
    >
      <h3>{{ $t("sub_categories") }}</h3>
      <div class="flex flex-wrap gap-2">

        <div class="categories"    
           v-for="subCategory in listing.BasicInformation?.subCategory">
          <span> {{ subCategory?.title }} </span>
        </div>
      </div>
    </div>
    <div class="listing-service-type">
      <h3>{{ $t("service_type") }}</h3>
      <div class="type">
        <IconsTickCircle />
        {{ listing.BasicInformation?.type?.name }}
      </div>
    </div>
    <div class="listing-features" v-if="listing.BasicInformation?.keywords">
      <h3>{{ $t("keywords") }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="feature">
          <IconsCheck />
          {{ listing.BasicInformation?.keywords }}
        </div>
      </div>
    </div>
    <div
      class="listing-social-links"
      v-if="
        listing?.social.facebook ||
        listing?.social.instagram ||
        listing?.social.twitter ||
        listing?.social.youtube ||
        listing?.social.linkedin ||
        listing?.social.whatsapp ||
        listing?.social.website ||
        listing?.social.phone ||
        listing?.social.mail
      "
    >
      <h3>{{ $t("social_links") }}</h3>
      <div class="flex items-center gap-4">
        <a
          v-if="listing?.social?.facebook"
          :href="listing?.social?.facebook"
          target="blank"
          class="social-link"
        >
          <IconsFacebook />
        </a>
        <a
          v-if="listing?.social?.instagram"
          :href="listing?.social?.instagram"
          target="blank"
          class="social-link"
        >
          <IconsInstagram />
        </a>
        <a
          v-if="listing?.social?.twitter"
          :href="listing?.social?.twitter"
          target="blank"
          class="social-link"
        >
          <IconsTwitter />
        </a>
        <a
          v-if="listing?.social?.youtube"
          :href="listing?.social?.youtube"
          target="blank"
          class="social-link"
        >
          <IconsYoutube />
        </a>
        <a
          v-if="listing?.social?.linkedin"
          :href="listing?.social?.linkedin"
          target="blank"
          class="social-link"
        >
          <IconsLinkedin />
        </a>
        <a
          v-if="listing?.social?.whatsapp"
          :href="listing?.social?.whatsapp"
          target="blank"
          class="social-link"
        >
          <IconsWhatsApp />
        </a>
        
      </div>
    </div>
    <div  class="listing-social-links">
      <div class="flex items-center gap-4">
        <a
          v-if="listing?.social?.website"
          :href="listing?.social?.website"
          target="blank"
          class="social-link"
        >
          <IconsWebsite />
        </a>
        <a
          v-if="listing?.social?.phone"
          :href="`tel:+1${listing?.social?.phone}`"
          target="blank"
          class="social-link"
        >
          <IconsPhone />
        </a>
        <a
          v-if="listing?.social?.mail"
          :href="`mailto:${listing?.social?.mail}`"
          target="blank"
          class="social-link"
        >
          <IconsEmail />
        </a>
      </div>

      </
    <div class="listing-location">
      <h3>{{ $t("location") }}</h3>
      <p class="location">{{ listing?.location?.address }}</p>
      <p class="location">{{ listing?.location?.friendlyAddress }}</p>
      <div id="map" class="rounded-xl" style="width: 100%; height: 290px"></div>
    </div>
  </section>
</template>

<style scoped></style>
