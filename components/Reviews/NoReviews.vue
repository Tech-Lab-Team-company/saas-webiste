<script setup lang="ts">

</script>

<template>
  <div class="no-reviews">
    <NuxtImg
        src="/no-reviews.png"
        alt="no-reviews"
        class="no-reviews-img"
        format="webp"
    />
    <p class="no-reviews-title">{{ $t("Sorry_you_dont_have_any_reviews") }}</p>
    <p class="no-reviews-description">
      {{
        $t(
            "sorry_you_dont_have_any_reviews_right_now_go_and_add_a_new_reviews_to_see_how_people_will_react_about",
        )
      }}
    </p>

  </div>

</template>

<style scoped>

</style>