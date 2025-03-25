<script setup lang="ts">
import type ReviewModel from "~/features/ListingFeature/Data/models/review_model";
import {ProjectStatusEnum} from "~/features/ListingFeature/Core/Enum/project_status_enum";

const props = defineProps<{
  rate: number;
  myReviews: ReviewModel[];
  reviewsCount: number;
  status: ProjectStatusEnum; // Add the status
  id: string,
}>();

console.log(props.status)
const user = useUserStore();
</script>

<template>
  <section class="listing-reviews">
    <h3>{{ $t("reviews") }}</h3>
    <div class="rating">
      <div class="add-rate" v-if="user.isAuth && !myReviews.length && status != ProjectStatusEnum.Pending ">
        <h4>{{ $t("Add_your_rating") }}</h4>
        <ListingDetailsAddRateDialog v-if="user.isAuth && !myReviews.length && status != ProjectStatusEnum.Pending " :id="id" />
      </div>
      <div class="rates">
        <div class="rate-count">
          <span class="rate-number">{{ rate.toFixed(2) }}</span>
          <GlobalRate :rateCount="rate.toFixed()!" />
          <span class="rate-description">
            {{ $t("We_have") }} {{ reviewsCount }} {{ $t("reviews_from_our_customers") }}
          </span>
        </div>
        <div class="rate-img">
          <NuxtImg src="/listing-rate.png" alt="rate" format="webp" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
