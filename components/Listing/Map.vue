<script setup lang="ts">
import { useNuxtApp, useRouter } from "#app";
import { onMounted, ref } from "vue";
import type ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";

const { $googleMaps } = useNuxtApp();

const props = defineProps<{
  listings: ListingModel[];
}>();

const router = useRouter();
const location = ref({ latitude: 0, longitude: 0 });

const initMap = async () => {
  const { getLocation } = useGeolocation();
  const { latitude, longitude } = await getLocation();
  location.value = { latitude, longitude };

  const google = await $googleMaps.load();
  if (!google || !google.maps) {
    console.error("Google Maps API failed to load.");
    return;
  }

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: location.value.latitude, lng: location.value.longitude },
      zoom: 8,
    },
  );

  // console.log(location.value.latitude,location.value.longitude)

  // Add a marker for your current location
  const myLocationMarker = new google.maps.Marker({
    position: { lat: location.value.latitude, lng: location.value.longitude },
    map: map,
    title: "My Location",
    icon: {
      url: "/marker.png",
      scaledSize: new google.maps.Size(50, 50), // Resize the icon
    },
  });

  console.log(myLocationMarker);
  const myLocationInfoWindow = new google.maps.InfoWindow({
    content: `
      <div class="listing-search-content">
        <div class="list-search-card">
          <div class="list-search-card-info">
            <h2 class="list-search-card-title">My Location</h2>
            <p class="list-search-card-description">You are here!</p>
            <div class="location flex items-start gap-1">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4648 5.3375C12.6773 1.8725 9.65483 0.3125 6.99983 0.3125C6.99983 0.3125 6.99983 0.3125 6.99233 0.3125C4.34483 0.3125 1.31483 1.865 0.527327 5.33C-0.350173 9.2 2.01983 12.4775 4.16483 14.54C4.95983 15.305 5.97983 15.6875 6.99983 15.6875C8.01983 15.6875 9.03983 15.305 9.82733 14.54C11.9723 12.4775 14.3423 9.2075 13.4648 5.3375ZM6.99983 9.095C5.69483 9.095 4.63733 8.0375 4.63733 6.7325C4.63733 5.4275 5.69483 4.37 6.99983 4.37C8.30483 4.37 9.36233 5.4275 9.36233 6.7325C9.36233 8.0375 8.30483 9.095 6.99983 9.095Z" fill="#E80306"/>
              </svg>
              <span>Lat: ${location.value.latitude}, Lng: ${location.value.longitude}</span>
            </div>
          </div>
        </div>
      </div>
    `,
  });

  myLocationMarker.addListener("click", () => {
    myLocationInfoWindow.open(map, myLocationMarker);
  });

  const validListings = props.listings.filter(
    (listing) => listing.lat && listing.lng,
  );
  // console.log("Valid Listings:", validListings);

  validListings.forEach((listing) => {
    const marker = new google.maps.Marker({
      position: { lat: Number(listing.lat), lng: Number(listing.lng) },
      map: map,
      title: listing.name,
      icon: {
        url: "/marker.png",
        scaledSize: new google.maps.Size(50, 50), // Resize the icon
      },
    });

    // console.log("Marker added:", marker);

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="listing-search-content">
      <div class="list-search-card">
        <div class="list-search-card-img map">
          <img
            src="${listing.image}"
            alt="${listing.name}"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
          <div class="overlay"></div>
          <span class="sponsor">Sponsor</span>
        </div>
        <a href="/listing/${listing.slug}" class="list-search-card-info">
          <p class="list-search-card-type">${listing.category?.title || "Category"}</p>
          <h2 class="list-search-card-title">${listing.name}</h2>
          <div class="rate flex items-center gap-1">
            <span>${listing.rate?.toFixed() || "0"}</span>
            <span>(${listing.reviewsCount || "0"} reviews)</span>
          </div>
          <p class="list-search-card-description">${listing.description || "No description available"}</p>
          <div class="location flex items-start gap-1">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4648 5.3375C12.6773 1.8725 9.65483 0.3125 6.99983 0.3125C6.99983 0.3125 6.99983 0.3125 6.99233 0.3125C4.34483 0.3125 1.31483 1.865 0.527327 5.33C-0.350173 9.2 2.01983 12.4775 4.16483 14.54C4.95983 15.305 5.97983 15.6875 6.99983 15.6875C8.01983 15.6875 9.03983 15.305 9.82733 14.54C11.9723 12.4775 14.3423 9.2075 13.4648 5.3375ZM6.99983 9.095C5.69483 9.095 4.63733 8.0375 4.63733 6.7325C4.63733 5.4275 5.69483 4.37 6.99983 4.37C8.30483 4.37 9.36233 5.4275 9.36233 6.7325C9.36233 8.0375 8.30483 9.095 6.99983 9.095Z" fill="#E80306"/>
            </svg>
            <span>${listing.address || "No address available"}</span>
          </div>
        </a>
      </div>
    </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
};

onMounted(async () => {
  await initMap();
});
</script>

<template>
  <div
    id="map"
    class="rounded-xl"
    style="width: 100%; height: 480px; border: 1px solid black"
  ></div>
</template>

<style scoped></style>
