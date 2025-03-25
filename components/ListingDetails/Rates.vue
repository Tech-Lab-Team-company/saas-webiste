<script setup lang="ts">
import type ReviewModel from "~/features/ListingFeature/Data/models/review_model";
import { formatDate } from "~/base/persention/utils/get_date";
import VoteReviewsController from "~/features/VoteReviewFeature/presentation/controllers/report_review_controller";
import VoteReviewParams from "~/features/VoteReviewFeature/Core/Params/vote_review_params";
import ReportReviewsController from "~/features/ReportReviewFeature/presentation/controllers/report_review_controller";
import ReportReviewParams from "~/features/ReportReviewFeature/Core/Params/report_review_params";
import DeleteReviewsController from "~/features/DeleteReviewFeature/presentation/controllers/delete_review_controller";
import DeleteReviewParams from "~/features/DeleteReviewFeature/Core/Params/delete_review_params";
import ShowListingDetailsController from "~/features/ListingFeature/Presentation/controllers/show_listing_details_controller";
import ShowListingDetailsParams from "~/features/ListingFeature/Core/Params/show_listing_details_params";
import Galleria from "primevue/galleria";

const voteReviewsController = VoteReviewsController.getInstance();

const voteReview = async (id: number, type: number) => {
  await voteReviewsController.voteReview(new VoteReviewParams(id, type));
  ShowListingDetailsController.getInstance().showListingDetails(
    new ShowListingDetailsParams(useRoute().params.slug! as string),
  );
};

const props = defineProps<{
  reviews: ReviewModel[];
  myReviews: ReviewModel[];
}>();

const reportReviewsController = ReportReviewsController.getInstance();

const reportReview = async (id: number) => {
  await reportReviewsController.reportReview(new ReportReviewParams(id));
};

const deleteReviewsController = DeleteReviewsController.getInstance();

const deleteReview = async (id: number) => {
  await deleteReviewsController.deleteReview(new DeleteReviewParams(id));
  ShowListingDetailsController.getInstance().showListingDetails(
    new ShowListingDetailsParams(useRoute().params.slug! as string),
  );
};

const activeIndex = ref(0);
const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 5,
  },
  {
    breakpoint: "768px",
    numVisible: 3,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
]);
const MyRateDisplayCustom = ref(false);

const imageClick = (index: number) => {
  activeIndex.value = index;
  MyRateDisplayCustom.value = true;
};

const RatesDisplayCustom = ref(false);

const imageClickRates = (index: number) => {
  activeIndex.value = index;
  RatesDisplayCustom.value = true;
};

const displayedCount = ref(3);

const showMore = () => {
  if (displayedCount.value >= props.reviews.length) {
    return;
  }
  displayedCount.value += 3; // Show 3 more reviews
};
</script>

<template>
  <section class="rate-wrapper">
    <div class="my-rate-wrapper">
      <div
        class="my-rate"
        v-for="myReview in myReviews.slice(0, 1)"
        :key="myReview.id"
      >
        <div class="flex w-full justify-between">
          <div class="flex gap-2">
            <div class="client-img">
              <NuxtImg
                :src="myReview.clientImage ?? ''"
                :alt="myReview.clientName ?? ''"
                class="client-opinion-card-img"
                format="webp"
              />
            </div>
            <div>
              <h4 class="user-name">{{ myReview.clientName }}</h4>
              <div class="rate-count flex gap-2">
                <GlobalRate :rateCount="myReview.rate?.toFixed()" />
                <span class="rate-date">
                  {{ formatDate(myReview.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          <div class="actions">
            <div class="dropdown">
              <span class="dropdown-trigger"><IconsDots /> </span>
            </div>
            <div class="dropdown-content">
              <ul>
                <li class="dropdown-item">
                  <ReviewsEditReview :review="myReview" />
                </li>
                <li class="dropdown-item">
                  <button
                    @click="deleteReview(myReview.id)"
                    type="button"
                    aria-label="downvote"
                    class="vote-btn"
                  >
                    {{ $t("delete") }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p class="rate-text">
          {{ myReview.comment }}
        </p>
        <div class="images">
          <div class="image" v-for="i in myReview.images">
            <NuxtImg
              :src="i.image"
              class="client-opinion-card-img"
              format="webp"
              @click="imageClick(index)"
            />
          </div>
          <Galleria
            v-model:activeIndex="activeIndex"
            v-model:visible="MyRateDisplayCustom"
            :value="myReview.images"
            :responsiveOptions="responsiveOptions"
            :numVisible="7"
            containerStyle="width: 80%; margin: auto auto"
            :circular="true"
            :fullScreen="true"
            :showItemNavigators="true"
            :showThumbnails="false"
          >
            <template #item="slotProps">
              <img
                :src="slotProps.item.image"
                :alt="slotProps.item.alt"
                style="max-width: 100%; display: block"
              />
            </template>
            <template #thumbnail="slotProps">
              <img
                :src="slotProps.item.image"
                :alt="slotProps.item.alt"
                style="display: block"
              />
            </template>
          </Galleria>
        </div>
      </div>
    </div>

    <div class="rates" v-for="rate in reviews.slice(0, displayedCount)" :key="rate.id">
      <div class="flex justify-between w-full">
        <div class="flex gap-2">
          <div class="client-img">
            <NuxtImg
              :src="rate.clientImage"
              :alt="rate.clientName"
              class="client-opinion-card-img"
              format="webp"
            />
          </div>
          <div>
            <h4 class="user-name">{{ rate.clientName }}</h4>
            <div class="rate-count flex gap-2">
              <GlobalRate :rateCount="rate.rate.toFixed()" />
              <span class="rate-date"> {{ formatDate(rate.createdAt) }} </span>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="dropdown">
            <span class="dropdown-trigger"><IconsDots /> </span>
          </div>
          <div class="dropdown-content">
            <ul>
              <li class="dropdown-item">
                <button
                  @click="reportReview(rate.id)"
                  type="button"
                  aria-label="downvote"
                  class="vote-btn"
                >
                  {{ $t("report") }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="rate-content">
        <p class="rate-text">
          {{ rate.comment }}
        </p>
      </div>
      <div class="images">
        <div class="image" v-for="i in rate.images">
          <NuxtImg
            :src="i.image"
            class="client-opinion-card-img"
            format="webp"
            @click="imageClickRates(index)"
          />
        </div>
        <Galleria
          v-model:activeIndex="activeIndex"
          v-model:visible="RatesDisplayCustom"
          :value="rate.images"
          :responsiveOptions="responsiveOptions"
          :numVisible="7"
          containerStyle="width: 80%; margin: auto auto"
          :circular="true"
          :fullScreen="true"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.image"
              :alt="slotProps.item.alt"
              style="max-width: 100%; display: block"
            />
          </template>
          <template #thumbnail="slotProps">
            <img
              :src="slotProps.item.image"
              :alt="slotProps.item.alt"
              style="display: block"
            />
          </template>
        </Galleria>
      </div>
      <div class="votes">
        <div :class="['vote', rate.isUpVoted ? 'voted' : '']">
          <button
            @click="voteReview(rate.id, 1)"
            type="button"
            aria-label="upvote"
            class="vote-btn"
          >
            <IconsUpvote />
          </button>

          <span class="vote-number">
            {{ $t("Upvote") }} ({{ rate?.upVotes ?? 0 }})
          </span>
        </div>
        <div :class="['vote', rate.isDownVoted ? 'voted' : '']">
          <button
            @click="voteReview(rate.id, 0)"
            type="button"
            aria-label="upvote"
            class="vote-btn"
          >
            <IconsDownVote />
          </button>

          <span class="vote-number">
            {{ $t("Downvote") }} ({{ rate?.downVotes ?? 0 }})
          </span>
        </div>
      </div>
    </div>
    <span class="show-more" @click="showMore" v-if="displayedCount < reviews.length">show more</span>
  </section>
</template>

<style scoped></style>
