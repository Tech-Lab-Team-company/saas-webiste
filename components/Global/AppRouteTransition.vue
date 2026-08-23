<script setup lang="ts">
import { gsap } from "gsap";

const nuxtApp = useNuxtApp();
const transitionRoot = ref<HTMLElement | null>(null);
const transitionStatus = ref<HTMLElement | null>(null);
const transitionProgress = ref<HTMLElement | null>(null);
const transitionRibbons = ref<HTMLElement[]>([]);
const isVisible = ref(false);

let transitionStartedAt = 0;
let finishTimer: ReturnType<typeof setTimeout> | null = null;
let prefersReducedMotion = false;

const MINIMUM_VISIBLE_DURATION = 420;

const collectRibbon = (element: Element | ComponentPublicInstance | null) => {
  if (!(element instanceof HTMLElement)) return;
  transitionRibbons.value.push(element);
};

const resetFinishTimer = () => {
  if (!finishTimer) return;
  clearTimeout(finishTimer);
  finishTimer = null;
};

const revealTransition = async () => {
  if (prefersReducedMotion) return;

  resetFinishTimer();
  transitionStartedAt = performance.now();
  isVisible.value = true;
  await nextTick();

  const root = transitionRoot.value;
  const status = transitionStatus.value;
  const progress = transitionProgress.value;
  const ribbons = transitionRibbons.value;
  if (!root || !status || !progress) return;

  gsap.killTweensOf([root, status, progress, ...ribbons]);
  gsap.set(root, { autoAlpha: 1 });
  gsap.fromTo(
    ribbons,
    { xPercent: 125, rotate: -10, autoAlpha: 0 },
    {
      xPercent: -135,
      rotate: -10,
      autoAlpha: 0.72,
      duration: 0.95,
      stagger: 0.08,
      ease: "power3.inOut",
    },
  );
  gsap.fromTo(
    status,
    { y: -18, scale: 0.92, autoAlpha: 0 },
    {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.42,
      ease: "back.out(1.7)",
    },
  );
  gsap.fromTo(
    progress,
    { scaleX: 0 },
    { scaleX: 0.76, duration: 0.8, ease: "power3.out" },
  );
};

const hideTransition = () => {
  if (prefersReducedMotion || !isVisible.value) return;

  const elapsed = performance.now() - transitionStartedAt;
  const remainingDuration = Math.max(0, MINIMUM_VISIBLE_DURATION - elapsed);

  resetFinishTimer();
  finishTimer = setTimeout(() => {
    const root = transitionRoot.value;
    const status = transitionStatus.value;
    const progress = transitionProgress.value;
    if (!root || !status || !progress) {
      isVisible.value = false;
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        isVisible.value = false;
        gsap.set([root, status, progress], { clearProps: "all" });
      },
    });

    timeline
      .to(progress, { scaleX: 1, duration: 0.2, ease: "power2.out" })
      .to(
        status,
        { y: -10, scale: 0.96, autoAlpha: 0, duration: 0.24, ease: "power2.in" },
        "+=0.06",
      )
      .to(root, { autoAlpha: 0, duration: 0.18, ease: "power1.out" }, "<");

    const routeView = document.querySelector<HTMLElement>(".app-route-view");
    if (routeView) {
      gsap.fromTo(
        routeView,
        { y: 22, autoAlpha: 0, filter: "blur(8px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.58,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility,filter",
        },
      );
    }
  }, remainingDuration);
};

let removePageStartHook: (() => void) | undefined;
let removePageFinishHook: (() => void) | undefined;
let removePageErrorHook: (() => void) | undefined;

onMounted(() => {
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  removePageStartHook = nuxtApp.hook("page:start", revealTransition);
  removePageFinishHook = nuxtApp.hook("page:finish", hideTransition);
  removePageErrorHook = nuxtApp.hook("vue:error", hideTransition);
});

onBeforeUnmount(() => {
  resetFinishTimer();
  removePageStartHook?.();
  removePageFinishHook?.();
  removePageErrorHook?.();
  gsap.killTweensOf([
    transitionRoot.value,
    transitionStatus.value,
    transitionProgress.value,
    ...transitionRibbons.value,
  ]);
});
</script>

<template>
  <div
    v-show="isVisible"
    ref="transitionRoot"
    class="app-route-transition"
    aria-hidden="true"
  >
    <span
      v-for="index in 3"
      :key="index"
      :ref="collectRibbon"
      :class="`app-route-transition__ribbon app-route-transition__ribbon--${index}`"
    />

    <div ref="transitionStatus" class="app-route-transition__status">
      <span class="app-route-transition__mark">
        <i />
        <i />
        <i />
      </span>
      <span class="app-route-transition__copy">
        <strong>لحظة واحدة</strong>
        <small>نجهّز لك الصفحة التالية</small>
      </span>
    </div>

    <span class="app-route-transition__track">
      <span ref="transitionProgress" class="app-route-transition__progress" />
    </span>
  </div>
</template>

<style scoped>
.app-route-transition {
  position: fixed;
  z-index: 9998;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.app-route-transition::before {
  position: absolute;
  inset: 0;
  background: rgb(5 12 28 / 9%);
  backdrop-filter: blur(1.5px);
  content: "";
}

.app-route-transition__ribbon {
  position: absolute;
  top: -32vh;
  right: 20vw;
  width: clamp(180px, 28vw, 430px);
  height: 165vh;
  border-radius: 999px;
  filter: blur(2px);
  transform-origin: center;
}

.app-route-transition__ribbon--1 {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--app-brand-primary) 82%, #77b7ff),
    color-mix(in srgb, var(--app-brand-secondary) 72%, #7668ff)
  );
}

.app-route-transition__ribbon--2 {
  right: 42vw;
  width: clamp(130px, 21vw, 330px);
  background: linear-gradient(180deg, rgb(255 255 255 / 54%), rgb(113 169 255 / 28%));
}

.app-route-transition__ribbon--3 {
  right: 66vw;
  width: clamp(100px, 15vw, 240px);
  background: color-mix(in srgb, var(--app-brand-primary) 45%, #fff);
}

.app-route-transition__status {
  position: absolute;
  top: 24px;
  left: 50%;
  display: flex;
  min-width: min(340px, calc(100vw - 32px));
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 16px;
  background: rgb(8 17 37 / 92%);
  box-shadow: 0 18px 50px rgb(3 9 24 / 25%);
  color: #fff;
  backdrop-filter: blur(16px);
  transform: translateX(-50%);
}

.app-route-transition__mark {
  display: flex;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 12px;
  background: color-mix(in srgb, var(--app-brand-primary) 60%, #1a3f72);
}

.app-route-transition__mark i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  animation: app-route-dot 0.8s ease-in-out infinite alternate;
}

.app-route-transition__mark i:nth-child(2) {
  animation-delay: 0.14s;
}

.app-route-transition__mark i:nth-child(3) {
  animation-delay: 0.28s;
}

.app-route-transition__copy {
  display: grid;
  gap: 1px;
  text-align: start;
}

.app-route-transition__copy strong {
  font-size: 14px;
  font-weight: 800;
}

.app-route-transition__copy small {
  color: rgb(255 255 255 / 66%);
  font-size: 12px;
}

.app-route-transition__track {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  overflow: hidden;
  background: color-mix(in srgb, var(--app-brand-primary) 15%, transparent);
}

.app-route-transition__progress {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--app-brand-secondary),
    #8ec8ff,
    var(--app-brand-primary)
  );
  box-shadow: 0 0 18px color-mix(in srgb, var(--app-brand-primary) 70%, #fff);
  transform-origin: right center;
}

@keyframes app-route-dot {
  to {
    opacity: 0.35;
    transform: translateY(-4px) scale(0.8);
  }
}

@media (max-width: 640px) {
  .app-route-transition__status {
    top: 14px;
    min-width: calc(100vw - 28px);
  }

  .app-route-transition__ribbon {
    width: 42vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-route-transition {
    display: none !important;
  }

  .app-route-transition__mark i {
    animation: none;
  }
}
</style>
