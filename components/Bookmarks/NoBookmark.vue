<script setup lang="ts"></script>

<template>
  <div class="no-bookmark">
    <NuxtImg
      src="/no-bookmark.png"
      alt="no-bookmark"
      class="no-bookmark-img"
      format="webp"
    />
    <p class="no-bookmark-title">
      {{ $t("Sorry_you_dont_have_any_bookmark") }}
    </p>
    <p class="no-bookmark-description">
      {{
        $t(
          "sorry_you_dont_have_any_bookmark_right_now_go_and_add_a_new_bookmark_to_see_how_people_will_react_about",
        )
      }}
    </p>
<!--    <NuxtLink to="/dashboard/add-bookmark" class="primary-button-2">-->
<!--      {{ $t("add_bookmark") }}-->
<!--    </NuxtLink>-->
  </div>
</template>

<style scoped></style>
