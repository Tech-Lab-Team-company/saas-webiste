<script setup lang="ts">
import type BasicInformationModel from "~/features/ListingFeature/Data/models/basic_information_model";
import wordSlice from "~/base/persention/utils/word_slice";
const route = useRoute();

const props = defineProps<{
  basicInformation: BasicInformationModel;
  address: string;
  friendlyAddress: string;
  reviewsCount: number;
}>();

// https://lottiefiles.com/animations/liquid-blobby-loader-9qh1sEzaDJ
</script>

<template>
  <div class="dashboard-banner">
    <div class="container mx-auto px-8">
      <div class="breadcrumb">
        <NuxtLink to="/">
          {{ $t("home") }}
        </NuxtLink>
        <span>
          <!--          :class="[dir == 'rtl' ? 'ar' : '']"-->
          <svg
            width="13"
            height="11"
            viewBox="0 0 13 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.792969 11L6.29297 5.5L0.792969 0H7.20697L12.707 5.5L7.20697 11H0.792969Z"
              fill="#E80306"
            />
          </svg>
        </span>
        <h2>
          {{ $t("listing_details") }}
        </h2>
      </div>
      <div class="list-info">
        <div class="list-title">
          <h1>{{ basicInformation?.title }}</h1>
          <IconsDot />
          <span> {{ basicInformation.category.title}}</span>
        </div>
        <div class="rate flex items-center gap-1">
          <GlobalRate :rateCount="basicInformation?.rateCount?.toFixed()" />
          <span>({{ reviewsCount }} {{ $t("rate") }})</span>
        </div>
        <p class="list-description" v-html="wordSlice(basicInformation?.description, 100)"></p>
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
            {{ address }}
          </span>
        </div>
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
            {{ friendlyAddress }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
