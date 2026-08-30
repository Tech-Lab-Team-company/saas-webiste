<script setup lang="ts">
const nuxtApp = useNuxtApp();
const router = useRouter();
const settingStore = useSettingStore();

const isVisible = ref(false);
const isLeaving = ref(false);
const logoLoadFailed = ref(false);

const loaderLogo = computed(() =>
  logoLoadFailed.value
    ? "/favicon.ico"
    : settingStore.setting?.image?.img?.trim() || "/favicon.ico",
);

const SHOW_DELAY = 160;
const MINIMUM_VISIBLE_DURATION = 320;
const LEAVE_DURATION = 180;

let transitionStartedAt = 0;
let transitionId = 0;
let isNavigating = false;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let finishTimer: ReturnType<typeof setTimeout> | null = null;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimer = (timer: ReturnType<typeof setTimeout> | null) => {
  if (timer) clearTimeout(timer);
};

const clearTimers = () => {
  clearTimer(showTimer);
  clearTimer(finishTimer);
  clearTimer(leaveTimer);
  showTimer = null;
  finishTimer = null;
  leaveTimer = null;
};

const revealTransition = () => {
  // Router and Nuxt hooks can report the same navigation. Only start it once.
  if (isNavigating) return;

  isNavigating = true;
  const currentTransition = ++transitionId;

  clearTimers();
  isLeaving.value = false;

  showTimer = setTimeout(() => {
    if (currentTransition !== transitionId || !isNavigating) return;

    transitionStartedAt = performance.now();
    isVisible.value = true;
    showTimer = null;
  }, SHOW_DELAY);
};

const hideTransition = () => {
  isNavigating = false;

  clearTimer(showTimer);
  showTimer = null;

  // Fast navigations finish before the delayed loader is ever shown.
  if (!isVisible.value) return;

  const currentTransition = transitionId;
  const visibleFor = performance.now() - transitionStartedAt;
  const remainingDuration = Math.max(
    0,
    MINIMUM_VISIBLE_DURATION - visibleFor,
  );

  clearTimer(finishTimer);
  finishTimer = setTimeout(() => {
    if (currentTransition !== transitionId) return;

    isLeaving.value = true;
    finishTimer = null;

    leaveTimer = setTimeout(() => {
      if (currentTransition !== transitionId) return;

      isVisible.value = false;
      isLeaving.value = false;
      leaveTimer = null;
    }, LEAVE_DURATION);
  }, remainingDuration);
};

let removePageStartHook: (() => void) | undefined;
let removePageFinishHook: (() => void) | undefined;
let removePageErrorHook: (() => void) | undefined;
let removeRouterBeforeHook: (() => void) | undefined;
let removeRouterAfterHook: (() => void) | undefined;
let removeRouterErrorHook: (() => void) | undefined;

onMounted(() => {
  removePageStartHook = nuxtApp.hook("page:start", revealTransition);
  removePageFinishHook = nuxtApp.hook("page:finish", hideTransition);
  removePageErrorHook = nuxtApp.hook("vue:error", hideTransition);

  // Course filters and pagination only update the query and already expose
  // local loading states. Treating those updates as page navigation leaves the
  // overlay waiting for a page:finish hook that Nuxt does not emit.
  removeRouterBeforeHook = router.beforeEach((to, from) => {
    if (to.path !== from.path) revealTransition();
  });

  removeRouterAfterHook = router.afterEach((_to, _from, failure) => {
    if (failure) hideTransition();
  });
  removeRouterErrorHook = router.onError(hideTransition);
});

onBeforeUnmount(() => {
  transitionId++;
  isNavigating = false;
  clearTimers();

  removePageStartHook?.();
  removePageFinishHook?.();
  removePageErrorHook?.();
  removeRouterBeforeHook?.();
  removeRouterAfterHook?.();
  removeRouterErrorHook?.();
});
</script>

<template>
  <Transition name="app-route-loader">
    <div
      v-if="isVisible"
      class="app-route-transition"
      :class="{ 'app-route-transition--leaving': isLeaving }"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل الصفحة"
    >
      <span class="app-route-transition__track" aria-hidden="true">
        <span class="app-route-transition__progress" />
      </span>

      <div class="app-route-transition__status">
        <span class="app-route-transition__spinner" aria-hidden="true">
          <span class="app-route-transition__spinner-ring" />
          <img
            :src="loaderLogo"
            class="app-route-transition__logo"
            alt=""
            @error="logoLoadFailed = true"
          />
        </span>

        <span class="app-route-transition__copy">
          <strong>لحظة واحدة من فضلك</strong>
          <small>نجهّز لك الصفحة التالية</small>
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.app-route-transition {
  --route-loader-primary: var(
    --app-accent,
    var(--app-brand-primary, var(--primary-color, #28366c))
  );
  --route-loader-secondary: var(
    --app-accent-secondary,
    var(--app-brand-secondary, var(--secondary-color, #3a3e7e))
  );

  position: fixed;
  z-index: 99999;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow: hidden;
  background: color-mix(in srgb, var(--app-bg, #fbfcff) 90%, transparent);
  backdrop-filter: blur(6px);
  color: var(--app-text, #081b3a);
  cursor: wait;
}

.app-route-transition__track {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  overflow: hidden;
  background: color-mix(
    in srgb,
    var(--route-loader-primary) 12%,
    transparent
  );
}

.app-route-transition__progress {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--route-loader-secondary),
    var(--route-loader-primary)
  );
  transform: scaleX(0.08);
  transform-origin: right center;
  animation: app-route-progress 6s cubic-bezier(0.1, 0.65, 0.25, 1) forwards;
}

.app-route-transition__status {
  display: flex;
  width: min(300px, calc(100vw - 40px));
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--app-line, rgb(8 27 58 / 14%));
  border-radius: 16px;
  background: color-mix(in srgb, var(--app-surface, #fff) 96%, transparent);
  box-shadow: 0 18px 48px color-mix(
    in srgb,
    var(--app-shadow, rgb(6 17 71 / 24%)) 35%,
    transparent
  );
  text-align: start;
  animation: app-route-status-in 220ms ease-out both;
}

.app-route-transition__spinner {
  position: relative;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--app-surface, #fff);
  box-shadow: 0 5px 14px color-mix(
    in srgb,
    var(--app-shadow, rgb(6 17 71 / 24%)) 24%,
    transparent
  );
}

.app-route-transition__spinner-ring {
  position: absolute;
  inset: -3px;
  border: 3px solid color-mix(
    in srgb,
    var(--route-loader-primary) 16%,
    transparent
  );
  border-top-color: var(--route-loader-primary);
  border-left-color: var(--route-loader-secondary);
  border-radius: 50%;
  animation: app-route-spin 760ms linear infinite;
}

.app-route-transition__logo {
  position: relative;
  z-index: 1;
  object-fit: cover;
  width: 100%;
  /* height: 34px; */
  border-radius: 50%;
  object-fit: contain;
  background: var(--app-surface, #fff);
}

.app-route-transition__copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.app-route-transition__copy strong {
  color: var(--app-text, #081b3a);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.55;
}

.app-route-transition__copy small {
  color: var(--app-muted, #4f617c);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.6;
}

.app-route-transition--leaving .app-route-transition__progress {
  animation: none;
  transform: scaleX(1);
  transition: transform 160ms ease-out;
}

.app-route-transition--leaving .app-route-transition__status {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.app-route-loader-enter-active,
.app-route-loader-leave-active {
  transition: opacity 160ms ease;
}

.app-route-loader-enter-from,
.app-route-loader-leave-to {
  opacity: 0;
}

@keyframes app-route-progress {
  0% {
    transform: scaleX(0.08);
  }

  45% {
    transform: scaleX(0.55);
  }

  100% {
    transform: scaleX(0.88);
  }
}

@keyframes app-route-status-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes app-route-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (max-width: 480px) {
  .app-route-transition {
    padding: 16px;
  }

  .app-route-transition__status {
    width: min(280px, calc(100vw - 32px));
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
  }

  .app-route-transition__spinner {
    width: 30px;
    height: 30px;
    flex-basis: 30px;
  }

  .app-route-transition__logo {
    width: 21px;
    height: 21px;
  }

  .app-route-transition__copy strong {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-route-transition,
  .app-route-transition *,
  .app-route-transition *::before,
  .app-route-transition *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}

@media (forced-colors: active) {
  .app-route-transition__spinner-ring {
    border-color: CanvasText;
    border-bottom-color: transparent;
  }
}
</style>
