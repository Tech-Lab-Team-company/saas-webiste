<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeAboutTeacherViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  about: HomeSectionState<HomeAboutTeacherViewModel>;
}>();

const aboutSection = ref<HTMLElement | null>(null);
const aboutContent = ref<HTMLElement | null>(null);
const aboutHasEntered = ref(false);
let aboutAnimationContext: ReturnType<typeof gsap.context> | null = null;

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

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateHighlights = async (delay = 0) => {
  await nextTick();

  const content = aboutContent.value;
  if (!content || !aboutHasEntered.value || shouldReduceMotion()) return;

  const items = Array.from(content.querySelectorAll("li"));
  gsap.killTweensOf(items);
  gsap.fromTo(
    items,
    { autoAlpha: 0, x: 38, y: 8 },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.58,
      delay,
      stagger: 0.13,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
    },
  );
};

const revealAboutSection = () => {
  const section = aboutSection.value;
  if (!section || aboutHasEntered.value) return;

  aboutHasEntered.value = true;
  if (shouldReduceMotion()) return;

  aboutAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".home-v2-about-teacher__quote", {
        autoAlpha: 0,
        clipPath: "inset(8% 8% 92% 8% round 16px)",
        scale: 0.96,
        duration: 1,
        ease: "expo.inOut",
      })
      .from(
        ".home-v2-about-teacher__corner",
        { scale: 0, rotation: -18, duration: 0.65, ease: "back.out(1.8)" },
        0.48,
      )
      .from(
        ".home-v2-about-teacher__quote-mark",
        { autoAlpha: 0, y: -20, scale: 0.7, duration: 0.55 },
        0.55,
      )
      .from(
        ".home-v2-about-teacher__quote > p",
        { autoAlpha: 0, y: 30, duration: 0.72 },
        0.62,
      )
      .from(
        ".home-v2-about-teacher__experience",
        { autoAlpha: 0, y: 22, duration: 0.62 },
        0.76,
      )
      .from(
        ".home-v2-about-teacher__content .section-tag",
        { autoAlpha: 0, x: 30, duration: 0.52 },
        0.28,
      )
      .from(
        ".home-v2-about-teacher__content h2",
        { autoAlpha: 0, y: 38, duration: 0.78, ease: "expo.out" },
        0.4,
      )
      .from(
        ".home-v2-about-teacher__content > p",
        { autoAlpha: 0, y: 22, duration: 0.58 },
        0.57,
      )
      .from(
        ".home-v2-about-teacher__content > a",
        { autoAlpha: 0, y: 16, duration: 0.52 },
        1.08,
      );
  }, section);

  void animateHighlights(0.72);
};

watch(
  () => props.about.data.highlights.join("\u0000"),
  () => void animateHighlights(),
  { flush: "post" },
);

useScrollTriggeredReveal(aboutSection, revealAboutSection, {
  threshold: 0.16,
});

onBeforeUnmount(() => {
  aboutAnimationContext?.revert();
  if (aboutSection.value) {
    gsap.killTweensOf(aboutSection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    id="about"
    ref="aboutSection"
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

      <div ref="aboutContent" class="home-v2-about-teacher__content">
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
  isolation: isolate;
  display: flex;
  min-height: clamp(560px, 62vw, 735px);
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: clamp(72px, 7vw, 108px) clamp(42px, 5vw, 76px) clamp(70px, 6vw, 94px);
  background: color-mix(in srgb, var(--home-v2-blue-light) 82%, #dceaff);
  box-shadow: 0 28px 70px -54px color-mix(in srgb, var(--home-v2-deep) 42%, transparent);
  transition: box-shadow 0.55s ease, transform 0.55s ease;
}

.home-v2-about-teacher__quote:hover {
  box-shadow: 0 38px 86px -48px color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
  transform: translateY(-4px);
}

.home-v2-about-teacher__quote-mark {
  position: absolute;
  z-index: 2;
  top: 38px;
  inset-inline-start: 52px;
  color: var(--home-v2-blue);
  opacity: 0.42;
  font: 900 94px/1 Georgia, serif;
  transition: color 0.55s ease, opacity 0.55s ease;
}

.home-v2-about-teacher__quote > p {
  position: relative;
  z-index: 1;
  max-width: 540px;
  margin: auto 0;
  color: var(--home-v2-deep);
  font: 900 clamp(32px, 3.35vw, 52px) / 1.48 var(--home-v2-heading);
  transition: color 0.55s ease;
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
  transition: color 0.55s ease;
}

.home-v2-about-teacher__experience small {
  color: var(--home-v2-muted);
  font-size: 12px;
  line-height: 1.45;
  transition: color 0.55s ease;
}

.home-v2-about-teacher__corner {
  position: absolute;
  z-index: 0;
  inset-inline-end: -30px;
  bottom: -30px;
  width: 142px;
  height: 142px;
  border: 14px solid var(--home-v2-blue);
  background: transparent;
  pointer-events: none;
  transform-origin: bottom left;
  transition: width 0.78s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.78s cubic-bezier(0.22, 1, 0.36, 1),
    border-width 0.5s ease, background-color 0.5s ease;
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__corner {
  width: calc(100% + 60px);
  height: calc(100% + 60px);
  border-width: 0;
  background: var(--home-v2-blue);
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__quote-mark {
  color: #fff;
  opacity: 0.34;
}

.home-v2-about-teacher__quote:hover > p {
  color: #fff;
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__experience strong {
  color: #fff;
}

.home-v2-about-teacher__quote:hover .home-v2-about-teacher__experience small {
  color: #ffffffc7;
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
  transition: color 0.22s ease, padding-inline-start 0.22s ease;
}

.home-v2-about-teacher li:hover {
  padding-inline-start: 42px;
  color: var(--home-v2-blue);
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
  .home-v2-about-teacher a,
  .home-v2-about-teacher__quote,
  .home-v2-about-teacher__corner,
  .home-v2-about-teacher__quote-mark,
  .home-v2-about-teacher__quote > p,
  .home-v2-about-teacher__experience strong,
  .home-v2-about-teacher__experience small,
  .home-v2-about-teacher li {
    transition: none;
  }

  .home-v2-about-teacher__quote:hover {
    transform: none;
  }
}
</style>
