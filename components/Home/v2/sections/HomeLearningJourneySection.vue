<script setup lang="ts">
import type { HomeLearningJourneyViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

defineProps<{
  journey: HomeSectionState<HomeLearningJourneyViewModel>;
}>();
</script>

<template>
  <section
    class="section home-v2-learning-journey"
    aria-labelledby="home-v2-learning-journey-title"
  >
    <div class="container home-v2-learning-journey__grid">
      <div class="home-v2-learning-journey__intro">
        <span class="section-tag">{{ journey.data.eyebrow }}</span>
        <h2 id="home-v2-learning-journey-title">
          {{ journey.data.title }}
        </h2>
        <p>{{ journey.data.description }}</p>
        <NuxtLink
          :to="journey.data.link"
          class="home-v2-learning-journey__link"
        >
          {{ journey.data.linkLabel }}
          <span aria-hidden="true">←</span>
        </NuxtLink>
      </div>

      <div class="home-v2-learning-journey__steps">
        <article v-for="(item, index) in journey.data.items" :key="item.id">
          <b>{{ String(index + 1).padStart(2, "0") }}</b>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-learning-journey {
  background: var(--home-v2-deep);
  color: #fff;
}

.home-v2-learning-journey__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: clamp(48px, 8vw, 120px);
}

.home-v2-learning-journey .section-tag {
  color: color-mix(in srgb, var(--home-v2-blue-light) 75%, white);
}

.home-v2-learning-journey h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-learning-journey__intro > p {
  margin: 0;
  color: #ffffffc4;
  line-height: 1.9;
}

.home-v2-learning-journey__link {
  display: inline-flex;
  gap: 9px;
  margin-top: 14px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ffffff99;
  font-weight: 800;
  transition: gap 0.2s ease, border-color 0.2s ease;
}

.home-v2-learning-journey__link:hover {
  gap: 14px;
  border-color: #fff;
}

.home-v2-learning-journey__steps article {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 18px;
  padding: 22px 0;
  border-bottom: 1px solid #ffffff2b;
  transition: padding-inline 0.22s ease, border-color 0.22s ease;
}

.home-v2-learning-journey__steps article:hover {
  padding-inline: 10px;
  border-color: #ffffff66;
}

.home-v2-learning-journey__steps b {
  color: var(--home-v2-coral);
  font: 900 12px var(--home-v2-heading);
}

.home-v2-learning-journey h3,
.home-v2-learning-journey p {
  margin: 0;
}

.home-v2-learning-journey h3 {
  font: 800 23px var(--home-v2-heading);
}

.home-v2-learning-journey__steps p {
  margin-top: 5px;
  color: #ffffffb8;
  line-height: 1.75;
}

@media (max-width: 760px) {
  .home-v2-learning-journey__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-learning-journey__link,
  .home-v2-learning-journey__steps article {
    transition: none;
  }
}
</style>
