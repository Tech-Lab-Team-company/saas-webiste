import type { Ref } from "vue";
import { onBeforeUnmount, onMounted, watch } from "vue";

type ScrollTriggeredRevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

export const useScrollTriggeredReveal = (
  target: Ref<HTMLElement | null>,
  reveal: () => void,
  options: ScrollTriggeredRevealOptions = {},
) => {
  let observer: IntersectionObserver | null = null;
  let observedTarget: HTMLElement | null = null;
  let stopWatchingTarget: ReturnType<typeof watch> | null = null;
  let hasRevealed = false;
  const threshold = Math.min(1, Math.max(0, options.threshold ?? 0.12));
  const rootMargin = options.rootMargin ?? "0px 0px -8% 0px";

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
    observedTarget = null;
  };

  const revealOnce = () => {
    if (hasRevealed) return;

    hasRevealed = true;
    disconnectObserver();
    reveal();
  };

  const handleIntersection: IntersectionObserverCallback = ([entry]) => {
    if (
      !entry?.isIntersecting ||
      entry.intersectionRatio + Number.EPSILON < threshold
    ) {
      return;
    }

    revealOnce();
  };

  const observeTarget = (nextTarget: HTMLElement | null) => {
    if (hasRevealed || nextTarget === observedTarget) return;

    if (observedTarget) observer?.unobserve(observedTarget);
    observedTarget = nextTarget;

    if (!nextTarget) return;

    if (!("IntersectionObserver" in window)) {
      revealOnce();
      return;
    }

    if (!observer) {
      try {
        observer = new IntersectionObserver(handleIntersection, {
          threshold,
          rootMargin,
        });
      } catch {
        revealOnce();
        return;
      }
    }

    observer.observe(nextTarget);
  };

  onMounted(() => {
    stopWatchingTarget = watch(target, observeTarget, {
      immediate: true,
      flush: "post",
    });
  });

  onBeforeUnmount(() => {
    stopWatchingTarget?.();
    stopWatchingTarget = null;
    disconnectObserver();
  });
};
