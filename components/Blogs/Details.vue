<script setup lang="ts">
import type Blog from "~/types/blog";

const props = defineProps<{ blog: Blog }>();
const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);
</script>

<template>
  <section class="blogs">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-2 lg:col-span-3">
        <div class="col-span-1">
          <h1 class="title">
            {{ blog?.title }}
          </h1>
        </div>
        <div class="mt-4">
          <BlogsStatics
            :author="blog?.author"
            :date="blog?.date"
            :comments="blog?.comments?.length"
          />
        </div>
        <div class="mt-4">
          <div class="blog-img">
            <NuxtImg
              :src="blog?.image"
              :alt="blog?.title"
              class="blog-img"
              format="webp"
            />
          </div>
        </div>
        <div class="mt-4">
          <p>
            {{ blog?.description }}
          </p>
        </div>
        <BlogsTags :tags="blog?.tags" />
        <div class="social mt-4">
          <span>{{ $t("follow_us") }} :</span>
          <a v-if="setting?.facebook" :href="setting?.facebook" target="_blank">
            <IconsFaceGray />
          </a>
          <a
            v-if="setting?.instagram"
            :href="setting?.instagram"
            target="_blank"
          >
            <IconsInstaGray />
          </a>
          <a v-if="setting?.twitter" :href="setting?.twitter" target="_blank">
            <IconsTwitterGray />
          </a>
          <a v-if="setting?.youtube" :href="setting?.youtube" target="_blank">
            <IconsYoutubeGray />
          </a>
        </div>
        <div class="suggestions mt-4">
          <BlogsNextPreviousBlog />
        </div>
      </div>
      <div class="col-span-1">
        <BlogsCategories />
        <BlogsRecentPosts />
        <BlogsTags />
      </div>
    </div>
    <BlogsComments :blogId="blog.id" />
    <BlogsLeaveComment :blogId="blog.id" :slug="blog.slug" />
  </section>
</template>

<style scoped></style>
