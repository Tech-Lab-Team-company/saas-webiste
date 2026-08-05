<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeCtaViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import type { HomeSectionState } from "~/features/HomePageFeature/types/homePage.types";

const props = defineProps<{
  cta: HomeSectionState<HomeCtaViewModel>;
}>();

const ctaSection = ref<HTMLElement | null>(null);
let ctaAnimationContext: ReturnType<typeof gsap.context> | null = null;
let ctaHasEntered = false;

const revealCtaSection = () => {
  const section = ctaSection.value;
  if (!section || ctaHasEntered) return;

  ctaHasEntered = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ctaAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(".home-v2-cta__panel", {
        autoAlpha: 0,
        y: 44,
        scale: 0.975,
        duration: 0.84,
        ease: "power3.out",
      })
      .from(
        ".home-v2-cta__pulse",
        { autoAlpha: 0, scale: 0.3, duration: 0.58, ease: "back.out(1.35)" },
        0.22,
      )
      .from(
        ".home-v2-cta__panel > span:not(.home-v2-cta__pulse)",
        { autoAlpha: 0, y: 14, duration: 0.42 },
        0.3,
      )
      .from(
        ".home-v2-cta h2",
        { autoAlpha: 0, y: 30, duration: 0.68, ease: "power3.out" },
        0.4,
      )
      .from(
        ".home-v2-cta__panel > p",
        { autoAlpha: 0, y: 18, duration: 0.52 },
        0.56,
      )
      .from(
        ".home-v2-cta__actions > *",
        { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.45, stagger: 0.08 },
        0.68,
      );

    gsap.to(".home-v2-cta__pulse", {
      scale: 1.08,
      opacity: 0.78,
      duration: 2.7,
      delay: 1.15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, section);
};

useScrollTriggeredReveal(ctaSection, revealCtaSection, {
  threshold: 0.12,
});

onBeforeUnmount(() => {
  ctaAnimationContext?.revert();
});
</script>

<template>
  <section
    ref="ctaSection"
    class="home-v2-cta"
    aria-labelledby="home-v2-cta-title"
  >
    <div class="container">
      <div class="home-v2-cta__panel">
        <span class="home-v2-cta__pulse" aria-hidden="true" />
        <span>{{ props.cta.data.eyebrow }}</span>
        <h2 id="home-v2-cta-title">{{ props.cta.data.title }}</h2>
        <p>{{ props.cta.data.description }}</p>
        <div class="home-v2-cta__actions">
          <a class="button" href="#courses">استكشف المسارات <span aria-hidden="true">←</span></a>
          <NuxtLink to="/Auth/register">أنشئ حسابك</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-cta {
  padding: 0 0 96px;
  background: var(--home-v2-cream);
}

.home-v2-cta__panel {
  position: relative;
  overflow: hidden;
  padding: clamp(48px, 8vw, 80px) 30px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    var(--home-v2-blue),
    color-mix(in srgb, var(--home-v2-blue) 82%, var(--home-v2-deep))
  );
  color: #fff;
  text-align: center;
}

.home-v2-cta__panel > :not(.home-v2-cta__pulse) {
  position: relative;
  z-index: 1;
}

.home-v2-cta__pulse {
  position: absolute;
  z-index: 0;
  top: -105px;
  left: -105px;
  width: 255px;
  height: 255px;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 50%;
  background: rgb(255 255 255 / 9%);
  box-shadow: 0 0 0 28px rgb(255 255 255 / 4%),
    0 0 65px rgb(255 255 255 / 10%);
  pointer-events: none;
  transform-origin: center;
}

.home-v2-cta__pulse::before,
.home-v2-cta__pulse::after {
  position: absolute;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: inherit;
  content: "";
}

.home-v2-cta__pulse::before {
  inset: 22%;
}

.home-v2-cta__pulse::after {
  inset: 40%;
  background: rgb(255 255 255 / 12%);
}

.home-v2-cta__panel > span:not(.home-v2-cta__pulse) {
  color: #d9ebff;
  font-size: 12px;
  font-weight: 900;
}

.home-v2-cta h2 {
  margin: 12px 0;
  font: 900 clamp(40px, 5vw, 66px) / 1.18 var(--home-v2-heading);
}

.home-v2-cta h2 em {
  color: #ffdb8b;
  font-style: normal;
}

.home-v2-cta p {
  max-width: 650px;
  margin: 0 auto;
  color: #ffffffd6;
  line-height: 1.9;
}

.home-v2-cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 25px;
}

.home-v2-cta .button {
  background: #fff;
  color: var(--home-v2-deep);
}

.home-v2-cta .button:hover {
  background: #edf5ff;
}

.home-v2-cta__actions > a:last-child {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid #ffffffa6;
  font-weight: 800;
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-cta__pulse {
    opacity: 0.78;
  }
}
</style>
