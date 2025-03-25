<script setup lang="ts"></script>

<template>
  <section class="no-listing-search">
    <div class="no-listing-search">
      <NuxtImg
        src="/no-search-listing.png"
        alt="no-listing"
        class="no-listing-image"
        format="webp"
      />
    </div>
    <div class="no-listing-content">
      <h2 class="no-listing-title">
        {{ $t("Sorry_there_are_no_results_of_your_research") }}!
      </h2>
      <p class="no-listing-subtitle">
        {{
          $t(
            "Try_spelling_checks_or_using_generic_terms_and_here_are_a_similar_listing_like_your_search",
          )
        }}
      </p>
    </div>
  </section>
</template>

<style scoped></style>
