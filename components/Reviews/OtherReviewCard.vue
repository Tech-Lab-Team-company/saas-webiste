<script setup lang="ts">
import OtherReviewModel from "~/features/FetchReviewsFeature/Data/models/other_review_model";
import ReportReviewsController from "~/features/ReportReviewFeature/presentation/controllers/report_review_controller";
import ReportReviewParams from "~/features/ReportReviewFeature/Core/Params/report_review_params";

const props = defineProps<{
    reviews: OtherReviewModel[] | [];
}>();

const reportReviewsController = ReportReviewsController.getInstance();

const reportReview = (id: number) => {
  reportReviewsController.reportReview(new ReportReviewParams(id));
};
</script>

<template>
  <div class="review-card" v-for="(review, index) in reviews" :key="index">
    <div class="img">
      <NuxtImg
        :src="review.clientImage"
        alt="review image"
        class="review-img"
        format="webp"
      />
    </div>
    <div class="review-info">
      <div class="flex gap-2 items-center">
        <h6 class="review-name">{{ review.clientName }}</h6>
        <p class="review-date">{{ review.createdAt }}</p>
      </div>
      <GlobalRate :rateCount="4" />
      <span class="review-name">
        {{ $t("review_on") }}
        <NuxtLink :to="`/listing/${review.listing?.slug}`">{{
          review.listing?.name
        }}</NuxtLink>
      </span>
      <p class="review-description">
        {{ review.comment }}
      </p>
      <div class="images" >
        <div class="img" v-for="image in review?.images" :key="image?.id">
          <NuxtImg
              :src="image?.image"
              alt="review image"
              class="review-img"
              format="webp"
          />
        </div>
      </div>

      <div class="actions">
        <button type="button" @click="reportReview(review.id)" class="primary-button" aria-label="delete">
          {{ $t("report") }}
        </button>
        <!--        <button class="secondary-button" aria-label="edit">-->
        <!--          {{ $t("edit") }}-->
        <!--        </button>-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
