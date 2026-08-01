<script setup lang="ts">
import type { HomeAboutTeacherViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  about: HomeSectionState<HomeAboutTeacherViewModel>;
}>();

const titleParts = computed(() => {
  const title = props.about.data.title;
  const match = title.match(/\d+/);

  if (!match || match.index === undefined) {
    return { before: title, value: null, after: "" };
  }

  return {
    before: title.slice(0, match.index),
    value: match[0],
    after: title.slice(match.index + match[0].length),
  };
});

const experienceYears = computed(() => titleParts.value.value || "20");
</script>

<template>
  <section
    id="about"
    class="section home-v2-about-teacher"
    aria-labelledby="home-v2-about-teacher-title"
  >
    <div class="container home-v2-about-teacher__grid">
      <div class="home-v2-about-teacher__quote">
        <span class="home-v2-about-teacher__quote-mark" aria-hidden="true">“</span>
        <p>{{ about.data.quote }}</p>
        <div class="home-v2-about-teacher__experience">
          <strong dir="ltr">+{{ experienceYears }}</strong>
          <small>سنة خبرة في<br />مجال التدريس</small>
        </div>
        <span class="home-v2-about-teacher__corner" aria-hidden="true"></span>
      </div>

      <div class="home-v2-about-teacher__content">
        <span class="section-tag">{{ about.data.eyebrow }}</span>
        <h2 id="home-v2-about-teacher-title">
          {{ titleParts.before }}<em v-if="titleParts.value">{{ titleParts.value }}</em>{{ titleParts.after }}
        </h2>
        <p>{{ about.data.description }}</p>
        <ul>
          <li v-for="highlight in about.data.highlights" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
        <NuxtLink :to="about.data.link">
          {{ about.data.linkLabel }}
          <span aria-hidden="true">←</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-about-teacher {
  overflow: hidden;
  background: #f3f6fc;
}

.home-v2-about-teacher__grid {
  display: grid;
  grid-template-columns: minmax(420px, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(64px, 8vw, 118px);
  padding-block: 30px;
}

.home-v2-about-teacher__quote {
  position: relative;
  display: flex;
  min-height: clamp(560px, 62vw, 735px);
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(72px, 7vw, 108px) clamp(42px, 5vw, 76px) clamp(70px, 6vw, 94px);
  background: color-mix(in srgb, var(--home-v2-blue-light) 82%, #dceaff);
}

.home-v2-about-teacher__quote-mark {
  position: absolute;
  top: 38px;
  inset-inline-start: 52px;
  color: var(--home-v2-blue);
  opacity: 0.42;
  font: 900 94px/1 Georgia, serif;
}

.home-v2-about-teacher__quote > p {
  position: relative;
  z-index: 1;
  max-width: 540px;
  margin: auto 0;
  color: var(--home-v2-deep);
  font: 900 clamp(32px, 3.35vw, 52px) / 1.48 var(--home-v2-heading);
}

.home-v2-about-teacher__experience {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  gap: 16px;
}

.home-v2-about-teacher__experience strong {
  color: var(--home-v2-blue);
  font: 900 clamp(42px, 4vw, 58px) / 0.85 var(--home-v2-heading);
}

.home-v2-about-teacher__experience small {
  color: var(--home-v2-muted);
  font-size: 12px;
  line-height: 1.45;
}

.home-v2-about-teacher__corner {
  position: absolute;
  inset-inline-end: -30px;
  bottom: -30px;
  width: 142px;
  height: 142px;
  border: 14px solid var(--home-v2-blue);
  pointer-events: none;
}

.home-v2-about-teacher__content {
  max-width: 650px;
}

.home-v2-about-teacher__content .section-tag {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--home-v2-deep);
}

.home-v2-about-teacher__content .section-tag::after {
  width: 36px;
  height: 2px;
  background: var(--home-v2-blue);
  content: "";
}

.home-v2-about-teacher h2 {
  margin: 24px 0 20px;
  color: var(--home-v2-deep);
  font: 900 clamp(42px, 4.6vw, 67px) / 1.16 var(--home-v2-heading);
  letter-spacing: -0.035em;
}

.home-v2-about-teacher h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-about-teacher__content > p {
  max-width: 610px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 17px;
  line-height: 2.05;
}

.home-v2-about-teacher ul {
  display: grid;
  margin: 38px 0 34px;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--home-v2-muted) 22%, transparent);
  list-style: none;
}

.home-v2-about-teacher li {
  position: relative;
  padding: 17px 34px 17px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--home-v2-muted) 22%, transparent);
  color: var(--home-v2-deep);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.65;
}

.home-v2-about-teacher li::before {
  position: absolute;
  top: 17px;
  inset-inline-start: 4px;
  color: var(--home-v2-blue);
  content: "✓";
  font-size: 20px;
  font-weight: 900;
}

.home-v2-about-teacher a {
  display: inline-flex;
  gap: 12px;
  padding-bottom: 7px;
  border-bottom: 1px solid color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
  color: var(--home-v2-blue);
  font-weight: 800;
  transition: gap 0.2s ease, border-color 0.2s ease;
}

.home-v2-about-teacher a:hover {
  gap: 14px;
  border-color: var(--home-v2-blue);
}

@media (max-width: 760px) {
  .home-v2-about-teacher__grid {
    grid-template-columns: 1fr;
    gap: 70px;
  }

  .home-v2-about-teacher__quote {
    min-height: 520px;
  }

  .home-v2-about-teacher__corner {
    inset-inline-end: -18px;
    bottom: -24px;
    width: 100px;
    height: 100px;
    border-width: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-about-teacher a {
    transition: none;
  }
}
</style>
