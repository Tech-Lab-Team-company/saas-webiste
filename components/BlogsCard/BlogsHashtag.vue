<script setup lang="ts">
import type  BlogsCard  from "~/types/blogscard";
import { baseUrl } from "~/constant/baseUrl";

// Fetch blog data
const { data: blogscard } = await useAsyncData("blogscard", async () => {
  try {
    const response = await $fetch<{
      data: BlogsCard[];
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_blogs`, {
      method: "POST",
      headers: {
        "Accept-Language": "ar",
        "web-domain":"abouelezz.com",
      },
      body: { hashtag: useRoute().params.hashtagId },
    });
    console.log(response , "Resopnseeee");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return [];
  }
});
</script>
<template>
  <div class="blogs-page-articles-cards" dir="rtl">
    <div class="Blog">
      <div class="cards-container">
        <NuxtLink
          v-for="(card, index) in blogscard"
          :key="index"
          :to="`/blogs/${card.slug}`"
          class="card"
        >
        {{ console.log(blogscard , "blogs cards") }}
        <img
            :src="card.attachments?.[0]?.file || ''"
            :alt="card.attachments?.[0]?.alt || 'Default alt'"
            class="course-image"
          />
          <div class="card-body">
            <div class="card-header">
              <hr />
              <h5 class="card-title">{{ card.title || 'No Title' }}</h5>
              <div class="card-date">
                <p>{{ card.date }}</p>
              </div>
            </div>
            <p class="card-text">{{ card.description || 'No Description' }}</p>
            <div class="card-footer">
              <p>{{ card.subtitle || 'No Subtitle'  }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  width: 95%;
}

.cards-container {
  /* display: grid;
  grid-template-columns: repeat(2, 1fr); */
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  gap: 60px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  transition: transform 0.3s ease-in-out;
  width: 40%;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
.card:hover {
  transform: translateY(10px);
}

.card img {
  width: 100%;
  height: 230px;
  /* object-fit: cover; */
  border: 1px solid #ccc;
}

.card-body {
  padding: 20px;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-header hr {
  width: 41px;
  height: 3px;
  border-radius: 4px;
  background: #ff931e;
  border: none;
}

.card-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 30px;
  text-align: right;
  margin: 0;
  font-family: "bold";
}

.card-date p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a3adbb;
  direction: ltr;
  font-weight: 400;
  font-size: 14px;
  font-family: "regular";
}

.card-date p::after {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 8px;
  background: #a3adbb;
  border-radius: 50%;
}

.card-text {
  font-weight: 700;
  font-size: 18px;
  color: #000000;
  font-family: "medium";
  margin-top: 8px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-footer p {
  font-weight: 400;
  font-size: 14px;
  font-family: "regular";
  margin-top: 2px;
  color: #656b78;
  line-height: 170%;
}

.course-image {
  /* width: 100%; */
  /* height: 100%; */
  /* object-fit: cover; */
  /* border: 1px solid #ccc; */
}
</style>
<!-- // const cards = [
//   {
//     title: "رحلة نحو المعرفة والتفوق",
//   },
// ];

// const cards_one = [
//   {
//     add: " اضيف بواسطه",
//     name: "احمد حوام",
//     icon: frame,
//   },
//   {
//     add_one: "التاريخ",
//     date: "2025-12-1",
//     icon1: clock,
//   },
// ]; -->