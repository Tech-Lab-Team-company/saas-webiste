<script setup lang="ts">
import type Category from "~/types/categories";

const props = defineProps<{ popularCategories: Category[] }>();
</script>

<template>
  <section class="categories-section">
    <h2 class="main-section-title">
      {{ $t("categories") }}
    </h2>
    <h4 class="sub-section-title">
      {{ $t("Explore_our_Popular_Categories") }}
    </h4>
    <div class="container mx-auto px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        <div
          class="col-span-1"
          v-for="popularCategory in popularCategories.slice(0, 5)"
          :key="popularCategory.id"
        >
          <HomeCategoriesCategoryCard :popularCategory="popularCategory" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
