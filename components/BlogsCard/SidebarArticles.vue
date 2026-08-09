<script setup lang="ts">
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import { mapBlogsPage } from "~/features/HomePageFeature/mappers/homePageMapper";

const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: cards } = await useAsyncData(
  `legacy-sidebar-blogs:${webDomain}`,
  async () => mapBlogsPage(await api.fetchBlogs()).slice(0, 4),
  { default: () => [] },
);

const formatDate = (date: string | null) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};
</script>

<template>
     <!-- sidebar -->
     <div class="sidebar-articles" dir="rtl">
      
          <h2 class="sidebar-title">{{ $t('آخر المقالات') }}</h2>
          <NuxtLink
            class="sidebar-page-articles-card"
            v-for="card in cards"
            :key="card.id"
            :to="card.route"
          >
            <div v-if="card.image" class="sidebar-page-articles-card-img">
              <img :src="card.image.src" :alt="card.image.alt" />
            </div>
            <div class="sidebar-page-articles-card-info">
              <p v-if="card.date" class="sidebar-date">{{ formatDate(card.date) }}</p>
              <h3 class="sidebar-text">{{ card.title }}</h3>
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

.sidebar-page-articles-card-img img {
  width: 400px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
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
  font-size: 16px;
  text-align: right;
  color: #000000;
}
/* end sidebar-articles style */
</style>
