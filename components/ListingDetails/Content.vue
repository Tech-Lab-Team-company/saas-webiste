<script setup lang="ts">
import ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

const props = defineProps<{ listing: ListingDetailsModel }>();
</script>

<template>
  <div class="container mx-auto px-8">
    <div class="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-2">
        <ListingDetailsGallery
          :images="listing.images"
          :video="listing.social.video!"
        />
        <ListingDetailsInfo :listing="listing" />
        <listingDetailsReviews
          :myReviews="listing.myReview!"
          :rate="listing.BasicInformation.rateCount"
          :reviewsCount="listing.reviewsCount"
          :status="listing.BasicInformation.status!"
          :id="listing.BasicInformation.id"
        />
        <ListingDetailsRates
          :reviews="listing.reviews"
          :myReviews="listing.myReview!"
        />
        <ListingDetailsGoogleRates
          :googleMapId="listing.location.googleMapId"
        />
        <div
          class="grid mb-4 most-visited-section grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            class="col-span-1"
            v-for="item in listing.similarListings"
            :key="listing.id"
          >
            <ListingListCard :listing="item" />
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <ListingDetailsPriceRange :listing="listing" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
