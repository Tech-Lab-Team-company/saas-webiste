<script setup lang="ts">
import homeStarting from './components/Home/home/homestarting.vue'
import CourseCard from "~/components/Shared/CourseCard.vue";


</script>

<template>
  <div>
    <NuxtLayout>
      <homeStarting />
      <!-- <NuxtPage /> -->
      <CourseCard />
    </NuxtLayout>
  </div>
</template>


<style></style>
