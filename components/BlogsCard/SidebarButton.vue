<script setup lang="ts">
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";

interface HashtagLink {
  id: number;
  title: string;
}

const normalizeHashtags = (value: unknown): HashtagLink[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const source = item as Record<string, unknown>;
    const id = Number(source.id);
    const title = typeof source.title === "string" ? source.title.trim() : "";
    return Number.isInteger(id) && id > 0 && title ? [{ id, title }] : [];
  });
};

const webDomain = getWebDomain();
const api = new HomePageApi(webDomain);
const { data: hashtags } = await useAsyncData(
  `legacy-sidebar-hashtags:${webDomain}`,
  async () => normalizeHashtags(await api.fetchHashtags()),
  { default: () => [] },
);
</script>

<template>
  <!-- sidebar -->
  <div class="sidebar-buttons" dir="rtl">
    <div class="sidebar-page-articles-buttons pt-lg">
      <h2 class="sidebar-title">{{ $t('encyclopedia') }}</h2>
      <div v-if="hashtags.length" class="grid grid-cols-3 gap-md pt-md">
        <NuxtLink
          v-for="item in hashtags"
          :key="item.id"
          :to="`/blogs/hashtag/${item.id}`"
          class="sidebar-button"
        >
          {{ item.title }}
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
  width: fit-content;
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
