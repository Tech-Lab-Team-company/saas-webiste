<script setup lang="ts">
import type Blog from "~/types/blog";

const props = defineProps<{ blogs: Blog[] }>();
</script>

<template>
  <section class="blogs-section">
    <h2 class="main-section-title">
      {{ $t("blogs") }}
    </h2>
    <h4 class="sub-section-title">
      {{ $t("Explore_news") }}
    </h4>
    <div class="container mx-auto px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div class="col-span-1" v-for="blog in blogs" :key="blog.id">
          <HomeBlogsBlogCard :blog="blog" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
