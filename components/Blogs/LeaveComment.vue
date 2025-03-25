<script setup lang="ts">
import MakeCommentController from "~/features/MakeCommentFeature/presentation/controllers/make_comment_controller";
import MakeCommentParams from "~/features/MakeCommentFeature/Core/Params/make_comment_params";
import FetchCommentsController from "~/features/FetchCommentsFeature/presentation/controllers/fetch_comments_controller";
import FetchCommentParams from "~/features/FetchCommentsFeature/Core/Params/fetch_comment_params";
const props = defineProps<{ blogId: number; slug: string }>();
const name = ref("");
const email = ref("");
const message = ref("");
const makeCommentController = MakeCommentController.getInstance();
const makeComment = async () => {
  try {
    await makeCommentController.makeComment(
      new MakeCommentParams(
        props.blogId,
        name.value,
        email.value,
        message.value,
        null,
      ),
    );

    await FetchCommentsController.getInstance().fetchComments(
      new FetchCommentParams(props.slug),
    );
    name.value = "";
    email.value = "";
    message.value = "";
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <section class="leave-comment">
    <h2 class="leave-comment-title">Leave a Comment</h2>
    <p class="leave-comment-description">
      {{
        $t(
          "Your_email_address_will_not_be_published_Required_fields_are_marked",
        )
      }}
    </p>
    <form
      @submit.prevent="makeComment"
      class="comment-form grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="col-span-1">
        <div class="input-wrapper">
          <label class="input-label" for="name">{{ $t("name") }}</label>
          <input
            class="input"
            placeholder="Enter your name"
            type="text"
            name="name"
            v-model="name"
            id="name"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div class="input-wrapper">
          <label class="input-label" for="email">{{ $t("email") }}</label>
          <input
            class="input"
            placeholder="Enter your email"
            type="email"
            name="email"
            v-model="email"
            id="email"
          />
        </div>
      </div>
      <div class="col-span-2">
        <div class="input-wrapper">
          <label class="input-label" for="message">{{ $t("comment") }}</label>
          <textarea
            class="input"
            placeholder="Enter your message"
            name="message"
            id="message"
            v-model="message"
          ></textarea>
        </div>
      </div>
      <div class="col-span-1">
        <button class="btn primary-button" type="submit">
          {{ $t("leave_comment") }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped></style>
