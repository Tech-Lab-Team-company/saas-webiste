<script setup lang="ts">
import type Blog from "~/types/blog";
const {locale} = useI18n();

const props = defineProps<{ blog: Blog }>();
</script>

<template>
  <div class="blog-card">
    <div class="blog-img">
      <NuxtImg
        :src="blog?.image"
        :alt="blog?.title"
        class="blog-img"
        format="webp"
      />
    </div>
    <NuxtLink :to="`/blogs/${blog?.slug}`" class="blog-info">
      <div class="flex items-start gap-4">
        <span class="line"></span>
        <div class="info-wrapper">
          <div class="flex items-center gap-4">
            <h2 class="blog-category">{{ blog.category?.name }}</h2>
            <span class="dot"></span>
            <span class="date">
              {{ blog?.date }}
            </span>
          </div>
          <h3 class="blog-title">
            {{ blog?.title }}
          </h3>
          <p class="blog-description">
            {{ blog?.description }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped></style>
