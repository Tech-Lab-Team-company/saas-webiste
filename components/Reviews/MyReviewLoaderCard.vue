<script setup lang="ts">
import Skeleton from "primevue/skeleton";
</script>

<template>
  <div class="borer border-gray-500 p-4 flex gap-4 ">
    <div class="">
      <Skeleton shape="circle" size="5rem"></Skeleton>
    </div>
    <div class="flex flex-col gap-2 w-1/2">
      <Skeleton width="20%" height="10px" />
      <Skeleton width="20%" height="0px" />
      <Skeleton width="100%" height="20px" />
      <Skeleton width="100%" height="20px" />
    </div>
  </div>
</template>

<style scoped></style>
