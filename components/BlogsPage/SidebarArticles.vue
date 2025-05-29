<script setup lang="ts">
import type LatestArticles from "~/types/latestarticles";
import { baseUrl } from "~/constant/baseUrl";
import pic from "@/assets/images/pic.png";

const { data: latestarticles } = await useAsyncData("latestarticles", async () => {
  try {
    const response = await $fetch<{
      data: LatestArticles[];
      message: string;
      status: number;
    }>("https://saas.crazyidea.online/api/dashboard/fetch_latest_blogs", {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain": "abouelezz.com",
      },
    });

    console.log(response);
    return response.data;
  } catch (err) {
    console.error("فشل في جلب التدوينة:", err);
    return null;
  }
});

</script>

<template>
  <!-- sidebar -->
  <div class="sidebar-articles" dir="rtl" v-if="latestarticles && latestarticles.length">
    <h2 class="sidebar-title">آخر المقالات</h2>
    <NuxtLink
      :to="`/blogs/${article.slug}`"
      class="sidebar-page-articles-card"
      v-for="(article, index) in latestarticles.slice(0, 4)"
      :key="index"
    >
      <div class="sidebar-page-articles-card-img">
        <img
            :src="article.attachments?.[0]?.file || ''"
            :alt="article.attachments?.[0]?.alt || 'Default alt'"
            class="course-image"
          />
      </div>
      <div class="sidebar-page-articles-card-info">
        <p class="sidebar-date">{{ article.date }}</p>
        <h3 class="sidebar-text">{{ article.description }}</h3>
      </div>
    </NuxtLink>
  </div>
  <!-- end sidebar -->
</template>
<style scoped>


/* sidebar-articles style */
.sidebar-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebar-page-articles-card {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}
.sidebar-page-articles-card-img{
  width: 30%;
}
.sidebar-page-articles-card-img img {
  min-width: 100%;
  height: 80%;
  border-radius: 5px;
}
.sidebar-date {
  font-family: "regular";
  font-weight: 400;
  font-size: 15px;
  text-align: right;
  color: #8c8896;
}
.sidebar-text {
  font-family: "medium";
  font-weight: 400;
  font-size: 14px;
  text-align: right;
  color: #000000;
}
/* end sidebar-articles style */
</style>