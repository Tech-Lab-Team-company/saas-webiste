<script setup lang="ts">
import AddClaimController from "~/features/AddClaimFeature/presentation/controllers/add_claim_controller";
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import AddClaimParams from "~/features/AddClaimFeature/Core/Params/add_claim_params";
import ShowListingDetailsController from "~/features/ListingFeature/Presentation/controllers/show_listing_details_controller";
import ShowListingDetailsParams from "~/features/ListingFeature/Core/Params/show_listing_details_params";

const props = defineProps<{
  id: number;
}>();
const visible = ref<boolean>(false);
const email = ref("");
const name = ref("");
const note = ref("");
const phone = ref("");
const images = ref<string[]>([]);
const route = useRoute();

const addClaimController = AddClaimController.getInstance();
const addClaim = async () => {
  try {
    console.log(props.id, name.value, email.value, phone.value, note.value);
    await addClaimController.addClaim(
      new AddClaimParams(
        props.id,
        name.value,
        email.value,
        phone.value,
        note.value,
        images.value
      )
    );
    ShowListingDetailsController.getInstance().showListingDetails(
      new ShowListingDetailsParams(route.params.slug.toString()!)
    );
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleImages = async (files: File[]) => {
  images.value = await convertToBase64(files);
};
</script>

<template>
  <span class="cursor-pointer" @click="visible = true">
    {{ $t("claim_now") }}
  </span>

  <Dialog
    class="add-rating-dialog"
    v-model:visible="visible"
    :header="$t('add_claim')"
    modal
  >
    <h4>Take control of your listing!</h4>
    <p>
      Customize your listing details, reply to reviews, upload photos and more
      to show customers what makes your business special.
    </p>
    <form @submit.prevent="addClaim">
      <div class="input-wrapper mt-4">
        <label class="input-label" for="name">{{ $t("name") }}</label>
        <input
          class="input"
          placeholder="Enter your name"
          type="text"
          name="name"
          id="name"
          v-model="name"
        />
      </div>

      <div class="input-wrapper">
        <label class="input-label" for="email">{{ $t("email") }}</label>
        <input
          class="input"
          placeholder="Enter your email"
          type="email"
          name="email"
          id="email"
          v-model="email"
        />
      </div>
      <div class="input-wrapper">
        <label class="input-label" for="phone">{{ $t("phone") }}</label>
        <input
          class="input"
          placeholder="Enter your phone"
          type="phone"
          name="phone"
          id="phone"
          v-model="phone"
        />
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
        {{ $t("claim_now") }}
      </button>
    </form>
  </Dialog>
</template>

<style scoped></style>
