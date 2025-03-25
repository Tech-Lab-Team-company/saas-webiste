<script setup lang="ts">
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import EditRateController from "~/features/EditRateFeature/presentation/controllers/edit_rate_controller";
import EditRateParams from "~/features/EditRateFeature/Core/Params/edit_rate_params";
import type ReviewModel from "~/features/ListingFeature/Data/models/review_model";
import type MyReviewModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import FetchMyReviewParams from "~/features/FetchReviewsFeature/Core/Params/fetch_my_reviews_params";
import FetchMyReviewsController from "~/features/FetchReviewsFeature/presentation/controllers/fetch_my_reviews_controller";
import ShowListingDetailsController from "~/features/ListingFeature/Presentation/controllers/show_listing_details_controller";
import ShowListingDetailsParams from "~/features/ListingFeature/Core/Params/show_listing_details_params";

const visible = ref<boolean>(false);
const props = defineProps<{ review: ReviewModel | MyReviewModel }>();
const note = ref(props.review.comment ? props.review.comment : "");
const images = ref<string[]>(
  props.review?.images?.map((image: any) => image.image)
);

const route = useRoute();
const rateMoney = ref(props.review.rateMoney ? props.review.rateMoney : 1);
const rateLocation = ref(
  props.review.rateLocation ? props.review.rateLocation : 1
);
const rateCleanLines = ref(
  props.review.rateCleanLines ? props.review.rateCleanLines : 1
);
const rateService = ref(
  props.review.rateService ? props.review.rateService : 1
);
const editRateController = EditRateController.getInstance();
const addRate = async () => {
  try {
    await editRateController.editRate(
      new EditRateParams(
        props.review.id,
        props.review.listing.id,
        rateMoney.value,
        rateLocation.value,
        rateCleanLines.value,
        rateService.value,
        note.value,
        images.value.filter((image: string) =>
          image.startsWith("data:image/webp;base64")
        )
      )
    );
    if (!route.params.slug) {
      await FetchMyReviewsController.getInstance().fetchMyReviews(
        new FetchMyReviewParams(1, 100)
      );
    } else {
      ShowListingDetailsController.getInstance().showListingDetails(
        new ShowListingDetailsParams(route.params.slug.toString()!)
      );
    }
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleImages = async (files: File[]) => {
  images.value = [];
  images.value = (await convertToBase64(files)) as string[];
  // console.log(images.value)
};

const getRatingLabel = (value: number): string => {
  switch (value) {
    case 1:
      return "Poor";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Very_Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
};
</script>

<template>
  <button type="button" @click="visible = true">
    {{ $t("edit_rate") }}
  </button>

  <Dialog
    class="add-rating-dialog"
    v-model:visible="visible"
    :header="$t('edit_rate')"
    modal
  >
    <p>
      We are happy to share your opinion and evaluation with us and it will help
      us to improve the level of service for your comfort and provide a better
      level
    </p>
    <form @submit.prevent="addRate">
      <!-- Value for Money Rating -->
      <p>{{ $t("value_for_money") }}</p>
      <div class="rates">
        <div class="rate" v-for="i in 5" :key="`rateMoney-${i}`">
          <input
            type="radio"
            class="hidden"
            name="rateMoney"
            v-model="rateMoney"
            :value="i"
            :id="`rateMoney-${i}`"
          />
          <label :for="`rateMoney-${i}`">
            <span class="star-count">
              <IconsRedStar v-for="star in i" :key="star" />
            </span>
            {{ $t(getRatingLabel(i)) }}
          </label>
        </div>
      </div>

      <!-- Location Rating -->
      <p>{{ $t("rateLocation") }}</p>
      <div class="rates">
        <div class="rate" v-for="i in 5" :key="`rateLocation-${i}`">
          <input
            type="radio"
            class="hidden"
            name="rateLocation"
            v-model="rateLocation"
            :value="i"
            :id="`rateLocation-${i}`"
          />
          <label :for="`rateLocation-${i}`">
            <span class="star-count">
              <IconsRedStar v-for="star in i" :key="star" />
            </span>
            {{ $t(getRatingLabel(i)) }}
          </label>
        </div>
      </div>

      <!-- Cleanliness Rating -->
      <p>{{ $t("rateCleanLines") }}</p>
      <div class="rates">
        <div class="rate" v-for="i in 5" :key="`rateCleanLines-${i}`">
          <input
            type="radio"
            class="hidden"
            name="rateCleanLines"
            v-model="rateCleanLines"
            :value="i"
            :id="`rateCleanLines-${i}`"
          />
          <label :for="`rateCleanLines-${i}`">
            <span class="star-count">
              <IconsRedStar v-for="star in i" :key="star" />
            </span>
            {{ $t(getRatingLabel(i)) }}
          </label>
        </div>
      </div>

      <!-- Service Rating -->
      <p>{{ $t("rateService") }}</p>
      <div class="rates">
        <div class="rate" v-for="i in 5" :key="`rateService-${i}`">
          <input
            type="radio"
            class="hidden"
            name="rateService"
            v-model="rateService"
            :value="i"
            :id="`rateService-${i}`"
          />
          <label :for="`rateService-${i}`">
            <span class="star-count">
              <IconsRedStar v-for="star in i" :key="star" />
            </span>
            {{ $t(getRatingLabel(i)) }}
          </label>
        </div>
      </div>

      <!-- Note Input -->
      <div class="input-wrapper">
        <label class="input-label" for="note">{{ $t("note") }}</label>
        <textarea
          class="input"
          v-model="note"
          :placeholder="$t('enter_your_note')"
          id="note"
        />
      </div>

      <!-- Image Upload -->
      <ListingGallary
        :initialImages="review.images"
        @update:images="handleImages"
        :type="2"
      />

      <!-- Submit Button -->
      <button type="submit" class="primary-button-2">
        {{ $t("edit_rate") }}
      </button>
    </form>
  </Dialog>
</template>

<style scoped></style>
