import type { Ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";

type ScrollTriggeredRevealOptions = {
  threshold?: number;
};

export const useScrollTriggeredReveal = (
  target: Ref<HTMLElement | null>,
  reveal: () => void,
  options: ScrollTriggeredRevealOptions = {},
) => {
  let observer: IntersectionObserver | null = null;
  let userHasScrolled = false;
  let targetIsVisible = false;
  let hasRevealed = false;

  const stopTracking = () => {
    observer?.disconnect();
    observer = null;
    window.removeEventListener("scroll", handleFirstScroll);
  };

  const tryReveal = () => {
    if (hasRevealed || !userHasScrolled || !targetIsVisible) return;

    hasRevealed = true;
    stopTracking();
    reveal();
  };

  const handleFirstScroll = () => {
    userHasScrolled = true;
    tryReveal();
  };

  onMounted(() => {
    window.addEventListener("scroll", handleFirstScroll, { passive: true });

    if (!("IntersectionObserver" in window)) {
      targetIsVisible = true;
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        targetIsVisible = Boolean(entry?.isIntersecting);
        tryReveal();
      },
      { threshold: options.threshold ?? 0.16 },
    );

    if (target.value) observer.observe(target.value);
  });

  onBeforeUnmount(stopTracking);
};
