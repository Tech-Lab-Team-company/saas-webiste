<script setup lang="ts">
import ShowListingDetailsController from "~/features/ListingFeature/Presentation/controllers/show_listing_details_controller";
import ShowListingDetailsParams from "~/features/ListingFeature/Core/Params/show_listing_details_params";

import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import AddRateParams from "~/features/AddRateFeature/Core/Params/add_rate_params";
import AddRateController from "~/features/AddRateFeature/presentation/controllers/add_rate_controller";
const props = defineProps<{
  id: string;
}>();
if (!props.id) {
  throw new Error("id is required");
}

const visible = ref<boolean>(false);

const email = ref("");
const name = ref("");
const note = ref("");
const phone = ref("");
const images = ref<string[]>([]);
const route = useRoute();
const rateMoney = ref(1);
const rateLocation = ref(1);
const rateCleanLines = ref(1);
const rateService = ref(1);

const addRateController = AddRateController.getInstance();
const addRate = async () => {
  try {
    await addRateController.addRate(
      new AddRateParams(
        props.id,
        rateMoney.value,
        rateLocation.value,
        rateCleanLines.value,
        rateService.value,
        note.value,
        images.value
      )
    );
    ShowListingDetailsController.getInstance().showListingDetails(
      new ShowListingDetailsParams(useRoute().params.slug! as string)
    );
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleImages = async (files: File[]) => {
  images.value = (await convertToBase64(files)) as string[];
};
</script>

<template>
  <button type="button" class="primary-button" @click="visible = true">
    <IconsAddRate />
    {{ $t("add_rate") }}
  </button>

  <Dialog
    class="add-rating-dialog"
    v-model:visible="visible"
    :header="$t('add_rate')"
    modal
  >
    <p>
      We are happy to share your opinion and evaluation with us and it will help
      us to improve the level of service for your comfort and provide a better
      level
    </p>
    <form @submit.prevent="addRate">
      <p>{{ $t("value_for_money") }}</p>
      <div class="rates">
        <div class="rate">
          <input
            type="radio"
            class="hidden"
            name="rate"
            v-model="rateMoney"
            :value="1"
            id="1"
          />
          <label for="1">
            <span class="star-count">
              <IconsRedStar v-for="i in 1" :key="i" />
            </span>
            {{ $t("Poor") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rate"
            class="hidden"
            v-model="rateMoney"
            :value="2"
            id="2"
          />
          <label for="2">
            <span class="star-count">
              <IconsRedStar v-for="i in 2" :key="i" />
            </span>
            {{ $t("Fair") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rate"
            class="hidden"
            v-model="rateMoney"
            :value="3"
            id="3"
          />
          <label for="3">
            <span class="star-count">
              <IconsRedStar v-for="i in 3" :key="i" />
            </span>
            {{ $t("Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rate"
            class="hidden"
            v-model="rateMoney"
            :value="4"
            id="4"
          />
          <label for="4">
            <span class="star-count">
              <IconsRedStar v-for="i in 4" :key="i" />
            </span>
            {{ $t("Very_Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rate"
            class="hidden"
            v-model="rateMoney"
            :value="5"
            id="5"
          />
          <label for="5">
            <span class="star-count">
              <IconsRedStar v-for="i in 5" :key="i" />
            </span>
            {{ $t("Excellent") }}
          </label>
        </div>
      </div>
      <p>{{ $t("rateLocation") }}</p>
      <div class="rates">
        <div class="rate">
          <input
            type="radio"
            class="hidden"
            name="rateLocation"
            v-model="rateLocation"
            :value="1"
            id="rateLocation-1"
          />
          <label for="rateLocation-1">
            <span class="star-count">
              <IconsRedStar v-for="i in 1" :key="i" />
            </span>
            {{ $t("Poor") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateLocation"
            class="hidden"
            v-model="rateLocation"
            :value="2"
            id="rateLocation-2"
          />
          <label for="rateLocation-2">
            <span class="star-count">
              <IconsRedStar v-for="i in 2" :key="i" />
            </span>
            {{ $t("Fair") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateLocation"
            class="hidden"
            v-model="rateLocation"
            :value="3"
            id="rateLocation-3"
          />
          <label for="rateLocation-3">
            <span class="star-count">
              <IconsRedStar v-for="i in 3" :key="i" />
            </span>
            {{ $t("Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateLocation"
            class="hidden"
            v-model="rateLocation"
            :value="4"
            id="rateLocation-4"
          />
          <label for="rateLocation-4">
            <span class="star-count">
              <IconsRedStar v-for="i in 4" :key="i" />
            </span>
            {{ $t("Very_Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateLocation"
            class="hidden"
            v-model="rateLocation"
            :value="5"
            id="rateLocation-5"
          />
          <label for="rateLocation-5">
            <span class="star-count">
              <IconsRedStar v-for="i in 5" :key="i" />
            </span>
            {{ $t("Excellent") }}
          </label>
        </div>
      </div>
      <p>{{ $t("rateCleanLines") }}</p>
      <div class="rates">
        <div class="rate">
          <input
            type="radio"
            class="hidden"
            name="rateCleanLines"
            v-model="rateCleanLines"
            :value="1"
            id="rateCleanLines1"
          />
          <label for="rateCleanLines1">
            <span class="star-count">
              <IconsRedStar v-for="i in 1" :key="i" />
            </span>
            {{ $t("Poor") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateCleanLines"
            class="hidden"
            v-model="rateCleanLines"
            :value="2"
            id="rateCleanLines2"
          />
          <label for="rateCleanLines2">
            <span class="star-count">
              <IconsRedStar v-for="i in 2" :key="i" />
            </span>
            {{ $t("Fair") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateCleanLines"
            class="hidden"
            v-model="rateCleanLines"
            :value="3"
            id="rateCleanLines3"
          />
          <label for="rateCleanLines3">
            <span class="star-count">
              <IconsRedStar v-for="i in 3" :key="i" />
            </span>
            {{ $t("Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateCleanLines"
            class="hidden"
            v-model="rateCleanLines"
            :value="4"
            id="rateCleanLines4"
          />
          <label for="rateCleanLines4">
            <span class="star-count">
              <IconsRedStar v-for="i in 4" :key="i" />
            </span>
            {{ $t("Very_Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateCleanLines"
            class="hidden"
            v-model="rateCleanLines"
            :value="5"
            id="rateCleanLines5"
          />
          <label for="rateCleanLines5">
            <span class="star-count">
              <IconsRedStar v-for="i in 5" :key="i" />
            </span>
            {{ $t("Excellent") }}
          </label>
        </div>
      </div>
      <p>{{ $t("rateService") }}</p>
      <div class="rates">
        <div class="rate">
          <input
            type="radio"
            class="hidden"
            name="rateService"
            v-model="rateService"
            :value="1"
            id="rateService1"
          />
          <label for="rateService1">
            <span class="star-count">
              <IconsRedStar v-for="i in 1" :key="i" />
            </span>
            {{ $t("Poor") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateService"
            class="hidden"
            v-model="rateService"
            :value="2"
            id="rateService2"
          />
          <label for="rateService2">
            <span class="star-count">
              <IconsRedStar v-for="i in 2" :key="i" />
            </span>
            {{ $t("Fair") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateService"
            class="hidden"
            v-model="rateService"
            :value="3"
            id="rateService3"
          />
          <label for="rateService3">
            <span class="star-count">
              <IconsRedStar v-for="i in 3" :key="i" />
            </span>
            {{ $t("Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateService"
            class="hidden"
            v-model="rateService"
            :value="4"
            id="rateService4"
          />
          <label for="rateService4">
            <span class="star-count">
              <IconsRedStar v-for="i in 4" :key="i" />
            </span>
            {{ $t("Very_Good") }}
          </label>
        </div>
        <div class="rate">
          <input
            type="radio"
            name="rateService"
            class="hidden"
            v-model="rateService"
            :value="5"
            id="rateService5"
          />
          <label for="rateService5">
            <span class="star-count">
              <IconsRedStar v-for="i in 5" :key="i" />
            </span>
            {{ $t("Excellent") }}
          </label>
        </div>
      </div>

      <div class="input-wrapper">
        <label class="input-label" for="note">{{ $t("note") }}</label>
        <textarea
          class="input"
          v-model="note"
          placeholder="Enter your password"
          id="note"
        />
      </div>
      <ListingGallary @update:images="handleImages" />
      <button type="submit" class="primary-button-2">
        {{ $t("Rate_now") }}
      </button>
    </form>
  </Dialog>
</template>

<style scoped></style>
