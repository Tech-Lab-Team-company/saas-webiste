<script setup lang="ts">
import type Comment from "~/types/comments";
import { BASE_URL } from "~/base/persention/utils/constant";
import FetchCommentsController from "~/features/FetchCommentsFeature/presentation/controllers/fetch_comments_controller";
import type CommentModel from "~/features/MakeCommentFeature/Data/models/comment_model";

const { data: comments } = await useAsyncData("blogs-comments", async () => {
  const response = await $fetch<{
    data: Comment[] | CommentModel[];
    message: string;
    status: number;
  }>(`${BASE_URL}/fetch_blog_comments`, {
    method: "POST",
    body: { slug: useRoute().params.slug },
  });
  return response.data; // Extract only the `data` part
});
// console.log(comments.value);
const fetchCommentsController = FetchCommentsController.getInstance();

watch(
  () => fetchCommentsController.state.value,
  () => {
    if (fetchCommentsController.isDataSuccess()) {
      comments.value = fetchCommentsController.state.value.data;
    }
  },
);

const props = defineProps<{ blogId: number }>();
</script>

<template>
  <section class="comment-wrapper">
    <h2 class="comment-title">
      {{ $t("comments") }}
    </h2>
    <h3 class="comment-count">
      <span>{{ comments?.length }}</span>
      {{ $t("comments") }}
    </h3>
    <div class="comments" v-for="comment in comments" :key="comment.id">
      <div class="client-img">
        <NuxtImg
          :src="comment.author_image"
          :alt="comment.author"
          class="client-opinion-card-img"
          format="webp"
        />
      </div>
      <div class="comment-content">
        <h4 class="user-name">{{ comment.author }}</h4>

        <p class="comment-text">
          {{ comment.content }}
        </p>
        <div class="replay">
          <IconsReplay />
          <span>Reply</span>
        </div>
        <div class="replays" v-for="reply in comment.replies" :key="reply.id">
          <div class="comments">
            <div class="client-img">
              <NuxtImg
                :src="reply.author_image"
                :alt="reply.author"
                class="client-opinion-card-img"
                format="webp"
              />
            </div>
            <div class="comment-content">
              <h4 class="user-name">{{ reply.author }}</h4>

              <p class="comment-text">
                {{ reply.content }}
              </p>
              <div class="replay">
                <IconsReplay />
                <span>Reply</span>
              </div>
              <div class="replays"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    <GlobalPagination />-->
  </section>
</template>

<style scoped></style>
