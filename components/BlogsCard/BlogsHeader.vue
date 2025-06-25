<script setup lang="ts">
import type  BlogsCard  from "~/types/blogscard";
import { baseUrl } from "~/constant/baseUrl";
import {getWebDomain} from "~/constant/webDomain";

const router = useRouter();

const { locale } = useI18n()

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
        "web-domain": getWebDomain(),
      },
      body:{
        hashtag_id:router.currentRoute.value.params.hashtagId,
      }
    });
    console.log(response , "ALL BOLGS");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return [];
  }
});
</script>
<template>
  <div class="blogs-page-articles-cards" dir="rtl" >
    <div class="Blog">
      <div class="cards-container" v-if="blogscard?.length < 0">
        <NuxtLink
          v-for="(card, index) in blogscard"
          :key="index"
          :to="`/blogs/${card.slug}`"
          class="card"
        >
        <img
            :src="card.attachments?.[0]?.file || ''"
            :alt="card.attachments?.[0]?.alt || 'Default alt'"
            class="course-image"
          />
          <div class="card-body">
            <div class="card-header">
              <hr />
              <div class="flex card-header-text">
                <h5 class="card-title" v-html="card.title"></h5>
                <div class="card-date">
                  <p>{{ card.date }}</p>
                </div>
              </div>
            </div>
            <p class="card-text" v-html="card.description"></p>
<!--            <div class="card-footer">-->
<!--              <p v-html="card.subtitle"></p>-->
<!--            </div>-->
          </div>
        </NuxtLink>
      </div>
      <div class="error-message-container" v-else>
        <!-- <p class="error-message">{{ $t('لا يوجد محتوى') }}</p> -->
         <NuxtImg src="/images/EmptyData.png" alt="Empty Image"  />
      </div>
    </div>
  </div>

</template>

<style scoped >
.Blog{
  height: 100%;
}
.error-message-container{
  display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.error-message-container .error-message{
  font-size: 36px;
    color: #a9a9a978;
}
.blogs-page-articles-cards {
  border-radius: 18px;
  height: auto;
  padding: 24px;
  background: #f6f6f6;
  margin: 5px 10px;
  width: 95%;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  /* justify-content: center;
  align-items: center;
  align-content: center; */
  /* justify-items: center; */
  gap: 40px;
  width: 85%;
  height: 100%;
  /* margin-left: auto;
  margin-right: auto; */
}

@media(max-width:1000px){
.cards-container {
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: repeat(1, 1fr);
}
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
  /* max-width: 350px; */
  width: 100%;
  
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

.card-header .flex{
  width: 320px;
}

@media(max-width:768px){
  .card-header .flex{
    display: flex;
    flex-direction: column;
    width: 100%;
  }

}
@media(max-width:768px){
  .card-header .flex .card-title{
    width: 100%;
  }

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
  width: 60%;
  font-size: 1rem;
  text-align: right;
  margin: 0;
  font-family: "bold", serif;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 1em);
  line-height: var(--line-height);
  --line-height: 1.5;

}

.card-text {
  font-weight: 700;
  font-size: 0.8rem;
  color: #000000;
  font-family: "medium", serif;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 2em);
  line-height: var(--line-height);
  --line-height: 1.5;
}

.card-date {
  width: 40%;
}

@media(max-width:768px){
.card-date {  
    width: 100%;
  }

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