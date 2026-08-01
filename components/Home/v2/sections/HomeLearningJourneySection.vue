<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeLearningJourneyViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  journey: HomeSectionState<HomeLearningJourneyViewModel>;
}>();

const journeySection = ref<HTMLElement | null>(null);
const journeySteps = ref<HTMLElement | null>(null);
const journeyHasEntered = ref(false);
let journeyAnimationContext: ReturnType<typeof gsap.context> | null = null;

const titleParts = computed(() => {
  const title = props.journey.data.title.trim();
  const words = title.split(/\s+/);
  const accent = words.pop() || "";

  return {
    main: words.join(" "),
    accent,
  };
});

const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateJourneySteps = async (delay = 0) => {
  await nextTick();

  const steps = journeySteps.value;
  if (!steps || !journeyHasEntered.value || shouldReduceMotion()) return;

  const articles = Array.from(steps.querySelectorAll("article"));
  const indexes = Array.from(
    steps.querySelectorAll(".home-v2-learning-journey__index"),
  );
  const checks = Array.from(
    steps.querySelectorAll(".home-v2-learning-journey__check"),
  );
  const rail = steps.querySelector(
    ".home-v2-learning-journey__rail-value",
  );

  gsap.killTweensOf([rail, ...articles, ...indexes, ...checks]);

  const timeline = gsap.timeline({ delay });
  if (rail) {
    timeline.fromTo(
      rail,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.25, ease: "power2.inOut" },
    );
  }

  timeline
    .fromTo(
      articles,
      { autoAlpha: 0, x: -46, y: 16 },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.68,
        stagger: 0.16,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      },
      0.08,
    )
    .fromTo(
      indexes,
      { autoAlpha: 0, scale: 0.55, rotation: -12 },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.52,
        stagger: 0.16,
        ease: "back.out(1.8)",
        clearProps: "opacity,visibility,transform",
      },
      0.18,
    )
    .fromTo(
      checks,
      { autoAlpha: 0, scale: 0, rotation: -90 },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.58,
        stagger: 0.16,
        ease: "back.out(2.1)",
        clearProps: "opacity,visibility,transform",
      },
      0.34,
    );
};

const revealJourneySection = () => {
  const section = journeySection.value;
  if (!section || journeyHasEntered.value) return;

  journeyHasEntered.value = true;
  if (shouldReduceMotion()) return;

  journeyAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".home-v2-learning-journey .section-tag", {
        autoAlpha: 0,
        x: 34,
        duration: 0.58,
      })
      .from(
        ".home-v2-learning-journey__title-line",
        {
          autoAlpha: 0,
          yPercent: 105,
          duration: 0.82,
          stagger: 0.13,
          ease: "expo.out",
        },
        0.14,
      )
      .from(
        ".home-v2-learning-journey__intro > p",
        { autoAlpha: 0, y: 24, duration: 0.62 },
        0.45,
      )
      .from(
        ".home-v2-learning-journey__link",
        { autoAlpha: 0, y: 18, scale: 0.96, duration: 0.58 },
        0.58,
      );
  }, section);

  void animateJourneySteps(0.38);
};

watch(
  () => props.journey.data.items.map((item) => item.id).join(","),
  () => void animateJourneySteps(),
  { flush: "post" },
);

useScrollTriggeredReveal(journeySection, revealJourneySection, {
  threshold: 0.16,
});

onBeforeUnmount(() => {
  journeyAnimationContext?.revert();
  if (journeySection.value) {
    gsap.killTweensOf(journeySection.value.querySelectorAll("*"));
  }
});
</script>

<template>
  <section
    ref="journeySection"
    class="section home-v2-learning-journey"
    aria-labelledby="home-v2-learning-journey-title"
  >
    <div class="container home-v2-learning-journey__grid">
      <div class="home-v2-learning-journey__intro">
        <span class="section-tag">{{ journey.data.eyebrow }}</span>
        <h2 id="home-v2-learning-journey-title">
          <span class="home-v2-learning-journey__title-line">
            {{ titleParts.main }}
          </span>
          <em class="home-v2-learning-journey__title-line">
            {{ titleParts.accent }}
          </em>
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

      <div ref="journeySteps" class="home-v2-learning-journey__steps">
        <span class="home-v2-learning-journey__rail" aria-hidden="true">
          <span class="home-v2-learning-journey__rail-value" />
        </span>
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
  --journey-background: color-mix(in srgb, var(--home-v2-deep) 48%, #031449);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* min-height: 720px; */
  background: var(--journey-background);
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

.home-v2-learning-journey__title-line {
  display: block;
  width: fit-content;
  max-width: 100%;
  transform-origin: right center;
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
  color: var(--journey-background);
  transform: translateY(-2px);
}

.home-v2-learning-journey__steps {
  position: relative;
  border-top: 1px solid #ffffff24;
}

.home-v2-learning-journey__rail {
  position: absolute;
  z-index: 0;
  top: 75px;
  inset-inline-end: 13px;
  bottom: 75px;
  width: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: #ffffff1c;
  pointer-events: none;
}

.home-v2-learning-journey__rail-value {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(var(--journey-gold), var(--journey-accent));
  box-shadow: 0 0 12px color-mix(in srgb, var(--journey-accent) 65%, transparent);
  transform-origin: top center;
}

.home-v2-learning-journey__steps article {
  position: relative;
  z-index: 1;
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
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--journey-accent) 70%, white);
  border-radius: 50%;
  background: var(--journey-background);
  color: var(--journey-accent);
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--journey-background) 82%, transparent);
  transition: color 0.25s ease, background-color 0.25s ease,
    transform 0.25s ease;
}

.home-v2-learning-journey__steps article:hover .home-v2-learning-journey__check {
  background: var(--journey-accent);
  color: #fff;
  transform: scale(1.08);
}

.home-v2-learning-journey h3,
.home-v2-learning-journey p {
  margin: 0;
}

.home-v2-learning-journey h3 {
  font: 900 clamp(23px, 2vw, 31px) var(--home-v2-heading);
  transition: color 0.22s ease, transform 0.22s ease;
}

.home-v2-learning-journey__steps article:hover h3 {
  color: var(--journey-gold);
  transform: translateX(-4px);
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

  .home-v2-learning-journey__rail {
    top: 52px;
    inset-inline-end: 9px;
    bottom: 52px;
  }

  .home-v2-learning-journey__check {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-learning-journey__link,
  .home-v2-learning-journey__steps article,
  .home-v2-learning-journey__check,
  .home-v2-learning-journey h3 {
    transition: none;
  }
}
</style>
