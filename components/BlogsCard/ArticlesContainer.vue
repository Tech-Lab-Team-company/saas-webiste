<script setup lang="ts">

import type  SidebarHashtag  from "~/types/sidebarhashtag";

import { baseUrl } from "~/constant/baseUrl";
// Fetch blog data
const { data: sidebarhashtag } = await useAsyncData("sidebarhashtag", async () => {
  try {
    const response = await $fetch<{
      data: SidebarHashtag[];
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_hashtags`, {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain":"hrarabians.com",
      },
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return [];
  }
});

</script>

<template>
  <div class="blogs-page-articles">
    <div class="container">
      <div class="grid-container">
        <BlogsCardBlogsHeader 
        />
        <BlogsPageSidebar 
        :hashtags="sidebarhashtag"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  margin: 5px 40px;
}
</style>
