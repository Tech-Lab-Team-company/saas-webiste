<script setup lang="ts">
import Skeleton from "primevue/skeleton";
</script>

<template>
  <div class="users">
    <div class="user" v-for="i in 4">
      <div class="user-img">
        <Skeleton shape="circle" size="3rem" class="mr-2"></Skeleton>
      </div>
      <div class="content">
        <Skeleton width="10rem" class="mb-2"></Skeleton>
        <Skeleton width="5rem" class="mb-2"></Skeleton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
