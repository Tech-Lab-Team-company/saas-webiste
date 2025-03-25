<script setup lang="ts">
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import FetchListingController from "~/features/FetchListingFeature/presentation/controllers/fetch_listings_controller";
import FetchListingParams from "~/features/FetchListingFeature/Core/Params/fetch_listings_params";

import Popover from 'primevue/popover';
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
const props = defineProps<{
  listing: ListingModel | null;
}>();

const fetchData = async () => {
  await FetchListingController.getInstance().fetchListing(
    new FetchListingParams(2, "", 1, 100),
  );
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
    </div>
    <!--    :to="`/listing/${listing?.id}`" -->

    <div  class="listing-info">
      <div class="listing-header">
        <div class="status pending">
          <IconsPending />
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
                <NuxtLink :to="`/dashboard/edit-listing/${listing?.id}`" >
                  <span>{{ $t("edit") }}</span>
                  <NuxtImg src="/setting.png" alt="profile settings" format="webp" />
                </NuxtLink>
              </li>
              <li class="dropdown-item">
                <NuxtLink :to="`/listing/${listing?.slug}`">
                  <span>{{ $t("show_details") }}</span>
                  <IconsMyListing />
                </NuxtLink>
              </li>
              <li class="dropdown-item">
                <NuxtLink to="/dashboard/add-listing" >
                  <span>{{ $t("add_listing") }}</span>
                  <NuxtImg src="/add.png" alt="add listing settings" format="webp" />
                </NuxtLink>
              </li>
              <ListingInactiveDialog  @updateDialog="fetchData" :listingId="listing?.id!" />
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
