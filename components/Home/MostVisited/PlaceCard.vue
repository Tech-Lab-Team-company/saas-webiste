<script setup lang="ts">
import type { Listing } from "~/types/listing";
import AddToBookmarkController from "~/features/ListingFeature/Presentation/controllers/add_to_bookmark_controller";
import AddToBookmarkParams from "~/features/ListingFeature/Core/Params/add_to_bookmark_params";
import wordSlice from "~/base/persention/utils/word_slice";

const prop = defineProps<{
  listing: Listing;
}>();

const addToBookmarkController = AddToBookmarkController.getInstance();

const addToBookmark = async (id: number) => {
  try {
    await addToBookmarkController.addToBookmark(new AddToBookmarkParams(id));
    // Toggle the bookmark status after the API call succeeds
    prop.listing.is_bookmark = !prop.listing.is_bookmark;
  } catch (error) {
    console.error("Failed to update bookmark:", error);
  }
};


</script>

<template>
  <div class="place-card">
    <div class="place-img">
      <NuxtImg
        v-if="listing?.image"
        :src="listing?.image"
        :alt="listing?.title"
        class="place-img"
        format="webp"
        provider="ipx"
        loading="lazy"
      />
      <NuxtImg
        v-else
        src="/logo.png"
        :alt="listing?.title"
        class="place-img"
        format="webp"
        loading="lazy"
      />
      <div class="overlay"></div>
      <span class="sponsor" v-if="listing?.is_sponsored">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.93344 11.6134H7.2601C6.16677 11.6134 5.2801 10.6934 5.2801 9.56005C5.2801 9.28672 5.50677 9.06005 5.7801 9.06005C6.05344 9.06005 6.2801 9.28672 6.2801 9.56005C6.2801 10.1401 6.7201 10.6134 7.2601 10.6134H8.93344C9.36677 10.6134 9.72677 10.2267 9.72677 9.76005C9.72677 9.18005 9.5201 9.06672 9.1801 8.94672L6.49344 8.00005C5.97344 7.82005 5.27344 7.43339 5.27344 6.24005C5.27344 5.21339 6.0801 4.38672 7.06677 4.38672H8.7401C9.83344 4.38672 10.7201 5.30672 10.7201 6.44005C10.7201 6.71339 10.4934 6.94005 10.2201 6.94005C9.94677 6.94005 9.7201 6.71339 9.7201 6.44005C9.7201 5.86005 9.2801 5.38672 8.7401 5.38672H7.06677C6.63344 5.38672 6.27344 5.77339 6.27344 6.24005C6.27344 6.82005 6.4801 6.93339 6.8201 7.05339L9.50677 8.00005C10.0268 8.18005 10.7268 8.56672 10.7268 9.76005C10.7201 10.7801 9.9201 11.6134 8.93344 11.6134Z"
            fill="white"
          />
          <path
            d="M8 12.5C7.72667 12.5 7.5 12.2733 7.5 12V4C7.5 3.72667 7.72667 3.5 8 3.5C8.27333 3.5 8.5 3.72667 8.5 4V12C8.5 12.2733 8.27333 12.5 8 12.5Z"
            fill="white"
          />
          <path
            d="M7.99967 15.1666C4.04634 15.1666 0.833008 11.9533 0.833008 7.99992C0.833008 4.04659 4.04634 0.833252 7.99967 0.833252C11.953 0.833252 15.1663 4.04659 15.1663 7.99992C15.1663 11.9533 11.953 15.1666 7.99967 15.1666ZM7.99967 1.83325C4.59967 1.83325 1.83301 4.59992 1.83301 7.99992C1.83301 11.3999 4.59967 14.1666 7.99967 14.1666C11.3997 14.1666 14.1663 11.3999 14.1663 7.99992C14.1663 4.59992 11.3997 1.83325 7.99967 1.83325Z"
            fill="white"
          />
        </svg>
        <span>{{ $t("sponsor") }}</span>
      </span>
      <div
        class="fav"
        @click="addToBookmark(listing?.id)"
        v-if="!listing?.is_bookmark"
      >
        <svg
          width="29"
          height="25"
          viewBox="0 0 29 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6526 0.165283C18.1442 0.165283 15.899 1.38485 14.4993 3.25577C13.0996 1.38485 10.8545 0.165283 8.34606 0.165283C4.09144 0.165283 0.640625 3.62996 0.640625 7.91229C0.640625 9.56148 0.90394 11.0859 1.36128 12.4995C3.55095 19.4289 10.3001 23.5726 13.6401 24.709C14.1113 24.8753 14.8874 24.8753 15.3586 24.709C18.6985 23.5726 25.4477 19.4289 27.6374 12.4995C28.0947 11.0859 28.358 9.56148 28.358 7.91229C28.358 3.62996 24.9072 0.165283 20.6526 0.165283Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="fav" @click="addToBookmark(listing?.id)" v-else>
        <svg
          width="29"
          height="25"
          viewBox="0 0 29 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6526 0.165527C18.1442 0.165527 15.899 1.38509 14.4993 3.25602C13.0996 1.38509 10.8545 0.165527 8.34606 0.165527C4.09144 0.165527 0.640625 3.6302 0.640625 7.91254C0.640625 9.56172 0.90394 11.0862 1.36128 12.4998C3.55095 19.4291 10.3001 23.5729 13.6401 24.7093C14.1113 24.8756 14.8874 24.8756 15.3586 24.7093C18.6985 23.5729 25.4477 19.4291 27.6374 12.4998C28.0947 11.0862 28.358 9.56172 28.358 7.91254C28.358 3.6302 24.9072 0.165527 20.6526 0.165527Z"
            fill="#EE2527"
          />
        </svg>
      </div>
    </div>
    <NuxtLink class="place-info" :to="`/listing/${listing.slug}`">
      <div class="flex gap-1">
        <p class="place-type" v-for="category in listing?.categories">
          {{ wordSlice(category?.name, 15) }}
        </p>
      </div>
      <h2 class="place-title">
        {{ listing?.title }}
      </h2>
      <div class="rate flex items-center gap-1">
        <GlobalRate :rateCount="listing?.rate?.toFixed()" />
        <span>({{ listing.reviews_count }} {{ $t("rate") }})</span>
      </div>
      <p
        class="place-description"
        v-html="wordSlice(listing?.description, 80)"
      ></p>
      <div class="location flex items-start gap-1">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.4648 5.3375C12.6773 1.8725 9.65483 0.3125 6.99983 0.3125C6.99983 0.3125 6.99983 0.3125 6.99233 0.3125C4.34483 0.3125 1.31483 1.865 0.527327 5.33C-0.350173 9.2 2.01983 12.4775 4.16483 14.54C4.95983 15.305 5.97983 15.6875 6.99983 15.6875C8.01983 15.6875 9.03983 15.305 9.82733 14.54C11.9723 12.4775 14.3423 9.2075 13.4648 5.3375ZM6.99983 9.095C5.69483 9.095 4.63733 8.0375 4.63733 6.7325C4.63733 5.4275 5.69483 4.37 6.99983 4.37C8.30483 4.37 9.36233 5.4275 9.36233 6.7325C9.36233 8.0375 8.30483 9.095 6.99983 9.095Z"
            fill="#E80306"
          />
        </svg>
        <NuxtLink to="/place/1">
          {{ listing?.address }}
        </NuxtLink>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped></style>
