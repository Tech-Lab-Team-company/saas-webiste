<script setup lang="ts">
import type { HomeLearningJourneyViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  journey: HomeSectionState<HomeLearningJourneyViewModel>;
}>();

const titleParts = computed(() => {
  const title = props.journey.data.title.trim();
  const words = title.split(/\s+/);
  const accent = words.pop() || "";

  return {
    main: words.join(" "),
    accent,
  };
});
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
          {{ titleParts.main }}<br />
          <em>{{ titleParts.accent }}</em>
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
          <b class="home-v2-learning-journey__index">{{ String(index + 1).padStart(2, "0") }}</b>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <span class="home-v2-learning-journey__check" aria-hidden="true">✓</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-learning-journey {
  --journey-accent: #1682ff;
  --journey-gold: #ffc84a;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* min-height: 720px; */
  background: color-mix(in srgb, var(--home-v2-deep) 48%, #031449);
  color: #fff;
}

.home-v2-learning-journey::after {
  position: absolute;
  z-index: -1;
  inset-inline-end: -18px;
  bottom: -45px;
  color: #ffffff08;
  content: "PHYSICS";
  font: 900 clamp(100px, 14vw, 220px) / 0.8 var(--home-v2-heading);
  letter-spacing: -0.08em;
  pointer-events: none;
}

.home-v2-learning-journey__grid {
  display: grid;
  min-height: 650px;
  grid-template-columns: minmax(360px, 0.78fr) minmax(0, 1.32fr);
  align-items: center;
  gap: clamp(70px, 9vw, 150px);
}

.home-v2-learning-journey .section-tag {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--journey-gold);
}

.home-v2-learning-journey .section-tag::after {
  width: 36px;
  height: 2px;
  background: var(--journey-accent);
  content: "";
}

.home-v2-learning-journey h2 {
  max-width: 560px;
  margin: 27px 0 22px;
  font: 900 clamp(48px, 5vw, 76px) / 1.05 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-learning-journey h2 em {
  color: var(--journey-accent);
  font-style: normal;
}

.home-v2-learning-journey__intro > p {
  max-width: 570px;
  margin: 0;
  color: #ffffffb8;
  font-size: 17px;
  line-height: 2;
}

.home-v2-learning-journey__link {
  display: inline-flex;
  min-width: 255px;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-top: 40px;
  padding: 12px 24px;
  background: var(--journey-accent);
  color: #fff;
  font-weight: 800;
  transition: gap 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.home-v2-learning-journey__link:hover {
  gap: 34px;
  background: #fff;
  transform: translateY(-2px);
}

.home-v2-learning-journey__steps {
  border-top: 1px solid #ffffff24;
}

.home-v2-learning-journey__steps article {
  display: grid;
  min-height: 150px;
  grid-template-columns: 54px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 28px;
  padding: 28px 0;
  border-bottom: 1px solid #ffffff24;
  transition: padding-inline 0.22s ease, border-color 0.22s ease;
}

.home-v2-learning-journey__steps article:hover {
  padding-inline: 10px;
  border-color: #ffffff66;
}

.home-v2-learning-journey__index {
  align-self: start;
  padding-top: 4px;
  color: var(--journey-gold);
  font: 900 12px var(--home-v2-heading);
}

.home-v2-learning-journey__check {
  color: var(--journey-accent);
  font-size: 20px;
  font-weight: 900;
}

.home-v2-learning-journey h3,
.home-v2-learning-journey p {
  margin: 0;
}

.home-v2-learning-journey h3 {
  font: 900 clamp(23px, 2vw, 31px) var(--home-v2-heading);
}

.home-v2-learning-journey__steps p {
  margin-top: 12px;
  color: #ffffffa8;
  font-size: 16px;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .home-v2-learning-journey {
    min-height: 0;
  }

  .home-v2-learning-journey__grid {
    grid-template-columns: 1fr;
    gap: 65px;
  }

  .home-v2-learning-journey__intro {
    max-width: 650px;
  }
}

@media (max-width: 560px) {
  .home-v2-learning-journey__steps article {
    min-height: 0;
    grid-template-columns: 38px minmax(0, 1fr) 20px;
    gap: 14px;
    padding: 24px 0;
  }

  .home-v2-learning-journey__link {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-learning-journey__link,
  .home-v2-learning-journey__steps article {
    transition: none;
  }
}
</style>
