<script setup>
import { BlogsPageBlogsImage } from "#components";
import pic from "@/assets/images/pic.png";

</script>

<template>
  <div class="blogs-page-articles">
    <div class="container">
      <div class="grid-container">
        <BlogsCardBlogsHeader />
        <BlogsCardSidebar />
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
</style>
