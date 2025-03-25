<script setup lang="ts">
import type Blog from "~/types/blog";
import {BASE_URL} from "~/base/persention/utils/constant";

const { data: blogs } = await useAsyncData("next-blog", async () => {
  const response = await $fetch<{
    data: Blog[];
    message: string;
    status: number;
  }>(`${BASE_URL}/home_blogs`, {
    method: "POST",
    body: { limit: 2 },
  });
  return response.data; // Extract only the `data` part
});
</script>

<template>
  <NuxtLink :to="`/blogs/${blogs[0]?.slug}`" class="next-previous">
    <div class="next">
      <div class="arrow">
        <IconsArrowLeft />
      </div>
      <div class="info">
        <p>Next</p>
        <span class="title"
          >{{ blogs[0]?.title }}</span
        >
      </div>
    </div>
    <NuxtLink :to="`/blogs/${blogs[1]?.slug}`" class="previous">
      <div class="info">
        <p>Previous</p>
        <span class="title">{{ blogs[1]?.title }}</span>
      </div>
        <div class="arrow">
          <IconsArrowRight />
        </div>
    </NuxtLink>
  </NuxtLink>
</template>

<style scoped></style>
