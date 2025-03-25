<script setup lang="ts">
import type Blog from "~/types/blog";
import { BASE_URL } from "~/base/persention/utils/constant";

const { data: blogs } = await useAsyncData("recent-blog", async () => {
  const response = await $fetch<{
    data: Blog[];
    message: string;
    status: number;
  }>(`${BASE_URL}/home_blogs`, {
    method: "POST",
    body: { limit: 3 },
  });
  return response.data; // Extract only the `data` part
});
</script>

<template>
  <section class="blogs-recent-posts">
    <h2 class="recent-posts-title">
      {{ $t("Recent_Posts") }}
    </h2>
    <ul class="recent-posts-list">
      <li class="recent-posts-item" v-for="blog in blogs">
        <NuxtLink :to="`/blogs/${blog?.slug}`" class="recent-posts-item">
          <div class="post-img">
            <NuxtImg :src="blog?.image" alt="recent post" format="webp" />
          </div>
          <div class="post-info">
            <p class="post-date">{{ blog?.date }}</p>
            <h3 class="post-title">
              {{ blog?.title }}
            </h3>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
