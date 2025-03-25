<script setup lang="ts">
import ListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/add_listing_builder";
import ImagesParams from "~/features/ListingFeature/Core/Params/details_params";
import SocialParams from "~/features/ListingFeature/Core/Params/social_params";
import AddListingController from "~/features/ListingFeature/Presentation/controllers/add_listing_controller";
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import ViewListingDetailsController from "~/features/ListingFeature/Presentation/controllers/view_listing_details_controller";
import ViewListingDetailsParams from "~/features/ListingFeature/Core/Params/view_listing_details_params";
import {UpdateListingApiService} from "~/features/ListingFeature/Data/api_services/update_listing_api_service";
import UpdateListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/update_listing_builder";
import UpdateListingController from "~/features/ListingFeature/Presentation/controllers/update_listing_controller";

const basicInformation = ref<any>(null);
const location = ref<any>(null);
const images = ref<any>(null);
const details = ref<any>(null);
const openingPrice = ref<any>(null);
const router = useRouter();

const handleBasicInformation = (data: any) => {
  basicInformation.value = data;
  // console.log(basicInformation.value);
};

const handleLocation = (data: any) => {
  location.value = data;
};

const handleImages = (data: any) => {
  images.value = data;
};

const handleSocial = (data: any) => {
  details.value = data;
};

const handleOpeningPrice = (data: any) => {
  openingPrice.value = data;
};
const listingBuilder = ListingParamsBuilder.Instance;
const addListingController = AddListingController.getInstance();


const updateListingBuilder = UpdateListingParamsBuilder.Instance;
const updateListingController = UpdateListingController.getInstance()
const addListing = async () => {
  // console.log(basicInformation.value);

  if(useRoute().params.id){
    const editParams = updateListingBuilder.setListingId(
      useRoute().params.id as string
    ).setBasicInformation(
      basicInformation.value
    ).setLocation(
      location.value
    ).setSocials(
        new SocialParams(
            details.value.isContactWidgetEnabled,
            details.value.facebook,
            details.value.instagram,
            details.value.twitter,
            details.value.linkedin,
            details.value.whatsapp,
            details.value.youtube,
            details.value.website,
            details.value.video,
            details.value.mail,
            details.value.phone,
        ),
    ).setOpeningHours(openingPrice.value)
        .build();
    await updateListingController.updateListing(editParams, router);

  }else {
  const convertedImages = await Promise.all(
    images.value?.map((image: File) => convertToBase64(image)) ?? [],
  );
  const params = listingBuilder
    .setBasicInformation(basicInformation.value)
    .setLocation(location.value)
    .setDetails(convertedImages)
    .setSocials(
      new SocialParams(
        details.value.isContactWidgetEnabled,
        details.value.facebook,
        details.value.twitter,
        details.value.instagram,
        details.value.linkedin,
        details.value.youtube,
        details.value.whatsapp,
          details.value.website,
          details.value.video,
          details.value.phone,
          details.value.email,
      ),
    )
    .setOpeningHours(openingPrice.value)
    .build();
  await addListingController.addListing(params, router);
  }

  // console.log(params);
};

// view listing

const viewListingDetailsController = ViewListingDetailsController.getInstance();
const state = ref(viewListingDetailsController.state.value);

const viewListingDetails = async () => {
  await viewListingDetailsController.viewListingDetails(
    new ViewListingDetailsParams(useRoute().params.id as string),
  );
  console.log(viewListingDetailsController.state.value);
};

onMounted(async () => {
  await viewListingDetails();
});

watch(
  () => viewListingDetailsController.state.value,
  (newValue) => {
    state.value = newValue;
  },
  { deep: true },)
</script>

<template>

  <GlobalDataStatues :status="state">
    <template #initial>
      loader
    </template>
    <template #loader>
      loader
    </template>
    <template #success>
        <div class="listing-section">
    <h4 class="listing-section-title">
      {{ $t("basic_information") }}
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ListingBasicInformation
          :basicInformation="state?.data?.BasicInformation!"
        @update:basicInformation="handleBasicInformation"
      />
    </div>
    <h4 class="listing-section-title">{{ $t("location") }}</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ListingLocation :location="state?.data?.location!"  @update:location="handleLocation" />
    </div>
    <h4 class="listing-section-title">{{ $t("Attachments") }}</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-1 md:col-span-2">
        <ListingGallary :initial-images="state?.data?.images!" @update:images="handleImages" />
      </div>
      <ListingDetails :socialMedia="state?.data?.social!" @update:socialMedia="handleSocial" />
    </div>
    <div class="listing-section-title">
      <h4>{{ $t("opening_price") }}</h4>
      <div class="input-wrapper-switch">
        <div class="switch">
          <input type="checkbox" id="opening_price" />
          <label for="opening_price" class="slider"></label>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ListingOpeningPrice :openingHours="state?.data?.openingHours!" @update:openingHours="handleOpeningPrice" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-1 md:col-span-2">
        <button
          class="primary-button-2"
          @click="addListing"
          aria-label="submit"
        >
          {{ $t("add") }}
        </button>
      </div>
    </div>
  </div>
    </template>

  </GlobalDataStatues>
</template>

<style scoped></style>
