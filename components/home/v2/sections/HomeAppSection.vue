<script setup lang="ts">
import { gsap } from "gsap";
import type { HomeSiteViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";

defineProps<{
  site: HomeSiteViewModel;
}>();

const appSection = ref<HTMLElement | null>(null);
let appAnimationContext: ReturnType<typeof gsap.context> | null = null;
let appHasEntered = false;

const revealAppSection = () => {
  const section = appSection.value;
  if (!section || appHasEntered) return;

  appHasEntered = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  appAnimationContext = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    timeline
      .from(".home-v2-app .section-tag", {
        autoAlpha: 0,
        x: 22,
        duration: 0.68,
      })
      .from(
        ".home-v2-app h2",
        { autoAlpha: 0, y: 28, duration: 0.95, ease: "power3.out" },
        0.14,
      )
      .from(
        ".home-v2-app__grid > div > p",
        { autoAlpha: 0, y: 18, duration: 0.76 },
        0.38,
      )
      .from(
        ".home-v2-app__actions > *",
        { autoAlpha: 0, y: 12, duration: 0.64, stagger: 0.12 },
        0.56,
      )
      .from(
        ".home-v2-app__phone",
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.965,
          rotation: -1.4,
          duration: 1.08,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
        0.26,
      );

    gsap.to(".home-v2-app__ambient-glow--one", {
      x: 24,
      y: -18,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".home-v2-app__ambient-glow--two", {
      x: -20,
      y: 24,
      duration: 11,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, section);
};

useScrollTriggeredReveal(appSection, revealAppSection, {
  threshold: 0.12,
});

onBeforeUnmount(() => {
  appAnimationContext?.revert();
});
</script>

<template>
  <section
    id="app-status"
    ref="appSection"
    class="section home-v2-app"
    aria-labelledby="home-v2-app-title"
  >
    <div class="home-v2-app__ambient" aria-hidden="true">
      <span class="home-v2-app__ambient-glow home-v2-app__ambient-glow--one" />
      <span class="home-v2-app__ambient-glow home-v2-app__ambient-glow--two" />
    </div>
    <div class="container home-v2-app__grid">
      <div>
        <span class="section-tag">تطبيق المنصة</span>
        <h2 id="home-v2-app-title">
          تابع من الويب،<br /><em>وكمّل من التطبيق.</em>
        </h2>
        <p>
          حمّل تطبيق {{ site.brandName || "المنصة" }} وتابع محتواك من هاتفك
          في أي وقت.
        </p>
        <div class="home-v2-app__actions">
          <a
            v-if="site.app.androidUrl"
            :href="site.app.androidUrl"
            target="_blank"
            rel="noopener"
          >
            تحميل Android
          </a>
          <span v-else class="home-v2-disabled-action" aria-disabled="true">
            تطبيق Android غير متاح
          </span>
          <a
            v-if="site.app.iosUrl"
            :href="site.app.iosUrl"
            target="_blank"
            rel="noopener"
          >
            تحميل iPhone
          </a>
          <span v-else class="home-v2-disabled-action" aria-disabled="true">
            تطبيق iPhone غير متاح
          </span>
        </div>
      </div>

      <figure
        class="home-v2-app__phone"
        :aria-label="`تطبيق ${site.brandName || 'المنصة'}`"
      >
        <div class="home-v2-app__screen">
          <NuxtImg
            :src="site.app.image?.src || '/images/eslam-salama-app-screen.webp'"
            :alt="site.app.image?.alt || `واجهة تطبيق ${site.brandName || 'المنصة'}`"
            width="380"
            height="675"
            loading="lazy"
          />
        </div>
        <figcaption>لقطة حقيقية من التطبيق</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.home-v2-app {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--home-v2-deep);
  color: #fff;
}

.home-v2-app__ambient {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.home-v2-app__ambient-glow {
  position: absolute;
  border: 1px solid rgb(255 255 255 / 7%);
  border-radius: 50%;
  background: radial-gradient(circle, rgb(143 198 255 / 10%), transparent 68%);
  filter: blur(1px);
}

.home-v2-app__ambient-glow--one {
  top: -180px;
  inset-inline-start: -140px;
  width: 430px;
  height: 430px;
}

.home-v2-app__ambient-glow--two {
  right: 34%;
  bottom: -230px;
  width: 520px;
  height: 520px;
}

.home-v2-app__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 380px;
  align-items: center;
  gap: clamp(48px, 8vw, 100px);
}

.home-v2-app .section-tag {
  color: #b6d6ff;
}

.home-v2-app h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.25 var(--home-v2-heading);
}

.home-v2-app h2 em {
  color: #8fc6ff;
  font-style: normal;
}

.home-v2-app p {
  max-width: 650px;
  color: #ffffffc4;
  line-height: 1.9;
}

.home-v2-app__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 24px;
}

.home-v2-app__actions a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  padding: 0 2px 6px;
  border-bottom: 1px solid #ffffff8c;
  color: #fff;
  font-weight: 800;
  transition: color 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;
}

.home-v2-app__actions a:hover {
  border-color: var(--home-v2-coral);
  color: color-mix(in srgb, var(--home-v2-coral) 72%, white);
  transform: translateY(-3px);
}

.home-v2-app__actions a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--home-v2-coral) 65%, transparent);
  outline-offset: 5px;
}

.home-v2-app .home-v2-disabled-action {
  border-bottom: 1px solid #ffffff8c;
  color: #fff;
}

.home-v2-app__phone {
  position: relative;
  width: min(100%, 350px);
  margin: 0;
  justify-self: center;
  padding: 8px 8px 0;
  border: 2px solid rgb(255 255 255 / 82%);
  border-radius: 42px 42px 56px 56px;
  background: linear-gradient(180deg, #fff, #f3f6ff);
  box-shadow: 27px 30px 0 rgb(1 7 34 / 34%),
    0 42px 80px -34px rgb(0 0 0 / 80%),
    inset 0 0 0 1px rgb(20 40 94 / 8%);
  isolation: isolate;
  transform: rotate(-1.4deg);
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-app__phone::before {
  position: absolute;
  z-index: 3;
  inset: 8px 8px 60px;
  border: 1px solid rgb(255 255 255 / 62%);
  border-radius: 33px 33px 10px 10px;
  box-shadow: inset 0 0 0 1px rgb(2 11 42 / 20%);
  content: "";
  pointer-events: none;
}

.home-v2-app__screen {
  position: relative;
  overflow: hidden;
  border-radius: 33px 33px 10px 10px;
  background: #020b2a;
}

.home-v2-app__screen::after {
  position: absolute;
  z-index: 2;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 36%,
    rgb(255 255 255 / 18%) 49%,
    transparent 62%
  );
  content: "";
  pointer-events: none;
  transform: translateX(125%);
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-v2-app__phone :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.45s ease;
}

.home-v2-app__phone figcaption {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  padding: 10px 14px 8px;
  color: var(--home-v2-deep);
  font: 900 13px/1.4 var(--home-v2-heading);
  text-align: center;
}

.home-v2-app__phone:hover {
  border-color: #fff;
  box-shadow: 31px 36px 0 rgb(1 7 34 / 29%),
    0 50px 92px -36px rgb(0 0 0 / 90%),
    inset 0 0 0 1px rgb(20 40 94 / 8%);
  transform: translateY(-10px) rotate(-0.6deg);
}

.home-v2-app__phone:hover .home-v2-app__screen::after {
  transform: translateX(-125%);
}

.home-v2-app__phone:hover :deep(img) {
  filter: saturate(1.04) contrast(1.02);
  transform: scale(1.02);
}

@media (max-width: 760px) {
  .home-v2-app__grid {
    grid-template-columns: 1fr;
  }

  .home-v2-app__phone {
    width: min(100%, 330px);
    margin-top: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-app__actions a,
  .home-v2-app__phone,
  .home-v2-app__screen::after,
  .home-v2-app__phone :deep(img) {
    transition: none;
  }

  .home-v2-app__ambient {
    display: none;
  }
}
</style>
