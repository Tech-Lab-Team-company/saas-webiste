<script setup lang="ts">
import type BlogsDetails from "~/types/blogsdetails";
import { baseUrl } from "~/constant/baseUrl";

const { data: blogdetails } = await useAsyncData("blogsdetails", async () => {
  try {
    const response = await $fetch<{
      data: BlogsDetails;
      message: string;
      status: number;
    }>("https://saas.crazyidea.online/api/website/show_blog", {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain": "hrarabians.com",
      },
      body: { slug: useRoute().params.slug },
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
  <!-- sidebarone -->
  <div class="sidebarone-buttons" dir="rtl" v-if="blogdetails?.hashtags?.length">
    <div class="sidebarone-page-articles-buttons pt-lg">
      <h2 class="sidebarone-title">الموسوعة</h2>
      <div class="sidebarone-page-buttons gap-md pt-md">
        <Nuxt-link 
        v-for="tag in blogdetails.hashtags"
        :key="'btn-' + tag.id"
        class="sidebarone-button"
        :to="`/blogs/hashtag/${tag.id}`" 
        >
        
          <button
          >
          {{ tag.title }}
        </button>
      </Nuxt-link>
      </div>
    </div>
  </div>
  <!-- end sidebarone -->
</template>


<style scoped>
/* sidebarone-button style */
.sidebarone-title {
  font-family: "regular";
  font-weight: 500;
  font-size: 25px;
  text-align: right;
  color: #000000;
}

.sidebarone-page-articles-buttons {
  margin:5px 10px;
}
.sidebarone-page-buttons {
  display: flex;
  flex-wrap: wrap;
}
.sidebarone-button {
  width: 160px;
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
/* end sidebarone-button style */
</style>
