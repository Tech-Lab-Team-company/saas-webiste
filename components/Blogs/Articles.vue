<script setup lang="ts">
import type Blog from "~/types/blog";
import debouncing from "~/base/persention/utils/debounce";
import { BASE_URL } from "~/base/persention/utils/constant";

const emit = defineEmits(["search"]);

const word = ref<string>("");

const searchWord = async () => {

  await emit("search", word.value);
};
const searchBlogDebounced = debouncing(searchWord);

const onUserAction = async () => {
  await searchBlogDebounced.debouncedFunction();
};

const props = defineProps<{ blogs: Blog[] | null }>();
</script>

<template>
  <section class="blogs">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-2 lg:col-span-3">
        <div class="flex justify-between items-center">
          <h1 class="title">{{ $t("All_Articles") }}</h1>
          <div class="input-search">
            <div class="search-icon">
              <IconsSearch />
            </div>
            <input
              type="text"
              @keyup="onUserAction"
              placeholder="Search by title"
              v-model="word"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1" v-for="(blog, index) in blogs" :key="index">
            <BlogsBlogCard :blog="blog" />
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <BlogsCategories />
        <BlogsRecentPosts />
        <BlogsTags />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
