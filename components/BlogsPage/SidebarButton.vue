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
        "web-domain":"abouelezz.com",
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
  <!-- sidebar -->
  <div class="sidebar-buttons" dir="rtl">
    <div class="sidebar-page-articles-buttons pt-lg">
      <h2 class="sidebar-title">الموسوعة</h2>
      <div class="grid grid-cols-3 gap-md pt-md">
        <NuxtLink
          v-for="(item, index) in sidebarhashtag"
          :key="'btn-' + index"
          :to="`/blogs/hashtag/${item.id}`" 
        >
          <button class="sidebar-button">
            {{ item.title }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
  <!-- end sidebar -->
</template>

<style scoped>
/* sidebar-button style */
.sidebar-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebar-page-articles-buttons {
  margin-top: 20px;
}
.sidebar-page-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sidebar-button {
  width: 100px;
  height: 45px;
  border-radius: 5px;
  padding: 10px;
  gap: 10px;
  background: #ffffff;
  font-family: "regular";
  font-weight: 400;
  font-size: 19px;
  text-align: center;
  color: #605b6c;
}
/* end sidebar-button style */
</style>
