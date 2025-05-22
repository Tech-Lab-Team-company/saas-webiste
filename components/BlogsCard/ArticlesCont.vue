<script setup lang="ts">
import { BlogsCardBlogsHashtag, BlogsPageBlogsImage } from "#components";
import pic from "@/assets/images/pic.png";





</script>

<template>
  <div class="blogs-page-articles">
    <div class="container">
      <div class="grid-container">
        <BlogsCardBlogsHashtag />
        <BlogsPageSidebar />

      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 20px;
  margin: 5px 40px;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    margin: 5px 0;
  }
  
}
</style>
