  <script setup lang="ts">

</script>

<template>
  <div class="no-listing">
    <NuxtImg
        src="/no-chat.png"
        alt="no-listing"
        class="no-listing-img"
        format="webp"
    />
    <p class="no-listing-title">{{ $t("sorry_you_dont_have_any_chat") }}</p>
    <p class="no-listing-description">
      {{
        $t(
            "sorry_you_dont_have_any_listing_right_now_go_and_add_a_new_listing_to_see_how_people_will_react_about",
        )
      }}
    </p>

  </div>

</template>

<style scoped>

</style>