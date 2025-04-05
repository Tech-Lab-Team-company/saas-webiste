<script setup lang="ts">
import homeStarting from './components/Home/home/homestarting.vue'
import CourseCard from "~/components/Shared/CourseCard.vue";
import CourseDetails from "~/components/CourseDetails/CourseDetails.vue";


</script>

<template>
  <div>
    <NuxtLayout>
      <CourseDetails />
      <!-- <homeStarting /> -->
      <!-- <NuxtPage /> -->
      <CourseCard />
    </NuxtLayout>
  </div>
</template>


<style></style>
