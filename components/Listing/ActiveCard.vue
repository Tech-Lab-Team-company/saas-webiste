<script setup lang="ts">
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import AddToBookmarkParams from "~/features/ListingFeature/Core/Params/add_to_bookmark_params";
import AddToBookmarkController from "~/features/ListingFeature/Presentation/controllers/add_to_bookmark_controller";
import FetchListingController from "~/features/FetchListingFeature/presentation/controllers/fetch_listings_controller";
import FetchListingParams from "~/features/FetchListingFeature/Core/Params/fetch_listings_params";

const props = defineProps<{
  listing: ListingModel | null;
}>();

const addToBookmarkController = AddToBookmarkController.getInstance();

const addToBookmark = async (id: number) => {
  try {
    await addToBookmarkController.addToBookmark(new AddToBookmarkParams(id));
    // Toggle the bookmark status after the API call succeeds
    props.listing.isFav = !props.listing.isFav;
  } catch (error) {
    console.error("Failed to update bookmark:", error);
  }
};

const fetchData = async () => {
  await FetchListingController.getInstance().fetchListing(
      new FetchListingParams(1, "", 1, 100)
  )
};
</script>

<template>
  <div class="listing-card">
    <div class="listing-img">
      <NuxtImg
        :src="listing?.image"
        :alt="listing?.name"
        class="place-img"
        format="webp"
      />
      <div class="overlay"></div>
      <div
        class="fav"
        @click="addToBookmark(listing?.id)"
        v-if="!listing?.isFav"
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
<!--    :to="`/listing/${listing?.id}`" -->
    <div  class="listing-info">
      <div class="listing-header">
        <div class="status active">
          <IconsEye />
          <span>{{ $t("views") }} :</span>
          <span>{{ listing?.views }}</span>
        </div>
        <div class="actions">
          <div class="dropdown">
            <span class="dropdown-trigger"><IconsDots /> </span>
          </div>
          <div class="dropdown-content">
            <ul>
              <li class="dropdown-item">
                <NuxtLink :to="`/dashboard/edit-listing/${listing?.id}`">
                  <span>{{ $t("edit") }}</span>
                  <IconsProfile />
                </NuxtLink>
              </li>
              <li class="dropdown-item">
                <NuxtLink :to="`/listing/${listing?.slug}`">
                  <span>{{ $t("show_details") }}</span>
                  <IconsMyListing />
                </NuxtLink>
              </li>
              <li class="dropdown-item">
                <NuxtLink to="/dashboard/add-listing">
                  <span>{{ $t("add_listing") }}</span>
                  <iconsAddListing />
                </NuxtLink>
              </li>
              <ListingInactiveDialog @updateDialog="fetchData" :listingId="listing?.id!" />
            </ul>
          </div>
        </div>
      </div>
      <h6 class="listing-title">
        {{ listing?.name }}
      </h6>
      <p class="listing-description" v-html="listing?.description"></p>
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
        <span>
          {{ listing?.address }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
