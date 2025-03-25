<script setup lang="ts">
import getLastSegment from "~/base/persention/utils/get_path_from_route";

const route = useRoute();

console.log(route.path);

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="breadcrumb-wrapper flex justify-between items-center">
    <div class="breadcrumb">
      <NuxtLink to="/">
        {{ $t("home") }}
      </NuxtLink>
      <span class="arrow">
        <!--             :class="[dir == 'rtl' ? 'ar' : '']"-->
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
      <span class="active">
        {{ getLastSegment(route.path) }}
      </span>
    </div>
    <h1 class="breadcrumb-title" v-if="props.title">{{ props.title }}</h1>
  </div>
</template>

<style scoped></style>
