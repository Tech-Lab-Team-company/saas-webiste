<script setup lang="ts">
import { BASE_URL } from "~/base/persention/utils/constant";
import type Category from "~/types/categories";

const { data: categories } = await useAsyncData("blog-categories", async () => {
  const response = await $fetch<{
    data: Category[];
    message: string;
    status: number;
  }>(`${BASE_URL}/blog_categories`, { method: "POST" });
  return response.data; // Extract only the `data` part
});
</script>

<template>
  <section class="blogs-categories">
    <h2 class="categories-title">
      {{ $t("categories") }}
    </h2>
    <ul class="categories-list">
      <li
        class="category-item"
        v-for="category in categories"
        :key="category.id"
      >
        <span>
          {{ category.name }}
<!--          <span>{{ category?.blogs_count }}</span>-->
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
