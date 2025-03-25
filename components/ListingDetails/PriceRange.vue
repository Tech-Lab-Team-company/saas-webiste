<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";
import AddToBookmarkController from "~/features/ListingFeature/Presentation/controllers/add_to_bookmark_controller";
import AddToBookmarkParams from "~/features/ListingFeature/Core/Params/add_to_bookmark_params";
import AddClaimDialog from "~/components/ListingDetails/AddClaimDialog.vue";
import ShowListingDetailsController from "~/features/ListingFeature/Presentation/controllers/show_listing_details_controller";
import ShowListingDetailsParams from "~/features/ListingFeature/Core/Params/show_listing_details_params";
import { ProjectStatusEnum } from "~/features/ListingFeature/Core/Enum/project_status_enum";

const props = defineProps<{ listing: ListingDetailsModel }>();

const listingDate = ref<ListingDetailsModel>(props.listing);
watch(
  () => props.listing,
  (newValue) => {
    if (newValue) {
      // console.log(newValue)

      listingDate.value = newValue;
    }
  },
  { deep: true }
);

const user = useUserStore();

const addToBookmarkController = AddToBookmarkController.getInstance();

const addToBookmark = async () => {
  try {
    await addToBookmarkController.addToBookmark(
      new AddToBookmarkParams(listingDate.value?.BasicInformation?.id)
    );
    await ShowListingDetailsController.getInstance().showListingDetails(
      new ShowListingDetailsParams(useRoute().params.slug! as string)
    );
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <section class="price-range">
    <div class="prices-range">
      <div class="start">{{ listingDate?.BasicInformation?.minPrice }} USD</div>
      <span class="icon">
        <IconsPriceRange />
      </span>
      <div class="end">{{ listingDate?.BasicInformation?.maxPrice }} USD</div>
    </div>
    <div class="opening-hours">
      <div
        class="opening-hours-title"
        v-if="listingDate?.openingHours.length > 0"
      >
        <div class="flex gap-2 items-center">
          <span>
            <IconsClock />
          </span>
          <h3>{{ $t("opening_hours") }}</h3>
        </div>
        <div class="flex gap-2 items-center">
          <!--          {{ listingDate?.BasicInformation?.status }}-->
          <span v-if="listingDate?.BasicInformation?.status"
            >{{ $t("online") }}:</span
          >
          <IconsActive />
        </div>
      </div>
      <div class="available" v-if="listingDate?.openingHours.length > 0">
        <Accordion value="0">
          <AccordionPanel
            v-for="day in listingDate?.openingHours"
            :value="day.id"
            :key="day.id"
          >
            <AccordionHeader>
              <span class="day-title"> {{ day.day.title }} </span>
            </AccordionHeader>
            <AccordionContent>
              <div class="time">
                {{ day.openingHour.openingTime }} -
                {{ day.openingHour.closingTime }}
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
    <div
      class="no-verified"
      v-if="
        listing.BasicInformation.claimStatus == null &&
        listing.BasicInformation.status !== ProjectStatusEnum.Pending
      "
    >
      {{ $t("not_verified_claim_this_listing_now") }}
      <AddClaimDialog :id="listing.BasicInformation.id" />
    </div>
    <div class="request-sent" v-if="listing.BasicInformation.claimStatus == 0">
      <span>
        <IconsClockYellow />
      </span>
      {{ $t("claim_request_sent") }}
    </div>
    <div class="verified" v-if="listing.BasicInformation.claimStatus == 1">
      <span>
        <IconsVerify />
      </span>
      {{ $t("verified") }}
    </div>
    <div class="no-verified" v-if="listing.BasicInformation.claimStatus == 2">
      {{ $t("rejected") }} <AddClaimDialog :id="listing.BasicInformation.id" />
    </div>
    <div class="user">
      <div class="user-avatar">
        <NuxtImg
          :src="listingDate?.BasicInformation.owner?.image"
          alt="user"
          format="webp"
        />
      </div>
      <div class="user-info">
        <div class="verified-type">owner</div>
        <div class="user-name">
          {{ listingDate?.BasicInformation.owner?.name }}
        </div>
      </div>
    </div>
    <div class="contact">
      <div class="wrapper">
        <IconsEmail />
        <span>{{ listingDate?.BasicInformation.owner?.email }}</span>
      </div>
      <div class="wrapper">
        <IconsPhone />
        <span>{{ listingDate?.BasicInformation.owner?.phone }}</span>
      </div>
    </div>
    <div class="action">
      <button
        v-if="listing.BasicInformation.status !== ProjectStatusEnum.Pending"
        type="button"
        @click="addToBookmark"
        :class="['heart', listingDate?.BasicInformation.isFav ? 'active' : '']"
      >
        <IconsHeart />
      </button>
      <ListingDetailsSentMessageDialog
        :id="listingDate?.BasicInformation.owner?.id"
        v-if="
          user.isAuth &&
          user.user?.id != listingDate?.BasicInformation.owner?.id &&
          listingDate?.BasicInformation.status !== ProjectStatusEnum.Pending
        "
      />
      <NuxtLink to="/auth/login" class="secondary-button" v-if="!user.isAuth">
        {{ $t("login") }}
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped></style>
