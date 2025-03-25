<script setup lang="ts">
import Skeleton from "primevue/skeleton";
</script>

<template>
<!--  <div class="loader-details">-->
<!--    <Skeleton width="100%" height="200px" />-->

<!--    <div class="container mx-auto px-8 mt-4">-->
<!--      <Skeleton width="80%" height="120px"  />-->
<!--      <Skeleton width="20%" height="20px" class="mt-2" />-->
<!--      <Skeleton width="15%" height="20px" class="mt-2"  /><Skeleton width="20%" height="20px" class="mt-2" />-->
<!--      <Skeleton width="15%" height="20px" class="mt-2"  /><Skeleton width="20%" height="20px" class="mt-2" />-->
<!--      <Skeleton width="15%" height="20px" class="mt-2"  /><Skeleton width="20%" height="20px" class="mt-2" />-->
<!--      <Skeleton width="15%" height="20px" class="mt-2"  />-->

<!--    </div>-->
<!--  </div>-->
  <div class="listing-card">
    <div class="listing-img">
      <Skeleton width="100%" height="200px" />
    </div>
    <div class="listing-info w-full">
      <div class="listing-header">
        <Skeleton width="20%" height="40px" />
      </div>
      <Skeleton width="50%" height="20px" />
      <Skeleton width="80%" height="20px" />
      <Skeleton width="80%" height="20px" />
    </div>
  </div>
</template>

<style scoped></style>
