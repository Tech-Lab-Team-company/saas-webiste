<script setup lang="ts">


import type Blog from "~/types/blog";

const props = defineProps<{ blog: Blog }>();

const { locale } = useI18n();
</script>

<template>
  <NuxtLink :to="`/blogs/${blog.slug}`" class="blog-card">
    <div class="blog-img">
      <NuxtImg :src="blog?.image" :alt="blog?.title" class="blog-img" format="webp" />
      <div class="date">{{ blog?.date }}</div>
    </div>
    <div class="blog-info">
      <h6 class="blog-title">
        {{ blog?.title }}
      </h6>
      <p class="blog-description">
        {{ blog?.description }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
