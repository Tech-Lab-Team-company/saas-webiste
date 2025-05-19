<script setup lang="ts">
import type BlogsImage from "~/types/blogsimage";
import { baseUrl } from "~/constant/baseUrl";

const { data: blogdetails } = await useAsyncData("blogsimage", async () => {
  try {
    const response = await $fetch<{
      data: BlogsImage;
      message: string;
      status: number;
    }>("https://edu.techlabeg.com/api/website/fetch_blogs", {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain": "abouelezz.com",
      },
      body: { slug: useRoute().params.slug },
    });

    console.log(response , "blogs cardss");
    return response.data;
  } catch (err) {
    console.error("فشل في جلب التدوينة:", err);
    return null;
  }
});

</script>


<template>
  <div class="blogs-page-image" v-if="blogdetails">
    <div class="image">
      <div class="blogs-page-image-cards">
        <div
        class="blogs-page-image-card"
        v-for="(card, index) in blogdetails.attachments"
        :key="index"
        >
        <!-- {{ console.log(card , "blogs cards") }} -->
        <img
            :src="blogdetails.attachments?.[0]?.file || ''"
            :alt="blogdetails.attachments?.[0]?.alt || 'Default alt'"
            class="course-image"
          />
        </div>
        <div class="des">
          <div class="blogs-page-des">
            <p
              class="blogs-page-descc"
              v-for="(card, index) in blogdetails.attachments"
              :key="index"
            >
              {{ blogdetails.subtitle|| "No Description" }}
            </p>
            <p
              class="blogs-page-desc"
              v-for="(card, index) in blogdetails.attachments"
              :key="index"
            >
              {{ blogdetails.description || "No Description" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.blogs-page-image {
  border-radius: 10px;
  background: #f6f6f6;
  margin: 5px 10px;
}

/* .blogs-page-image-card {
  display: flex;
  justify-content: center;
  align-items: center;
} */
.blogs-page-image-card img {
  width: 92%;
  height: 500px;
}
.blogs-page-descc{
  font-family: "bold";
  font-weight: 500;
  font-size: 21px;
  text-align: right;
  color: #000000;
}
.blogs-page-desc{
  font-family: "regular";
  font-weight: 500;
  font-size: 19px;
  text-align: right;
  color: #6F777B;
}
.des {
  display: flex;
  margin: 0 15px;
  padding-top: 45px;
}
</style>
