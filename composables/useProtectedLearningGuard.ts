import type { MaybeRefOrGetter } from "vue";
import { hasDeveloperToolsViewportGap } from "~/utils/protectedLearningRoute";

const PROTECTED_COPY_EVENTS = ["copy", "cut", "dragstart"] as const;

export function useProtectedLearningGuard(
  protectionActive: MaybeRefOrGetter<boolean>,
) {
  const config = useCourseProtectionConfig();
  const isDeveloperToolsOpen = ref(false);
  let detectionTimer: ReturnType<typeof setInterval> | null = null;
  let consecutiveClosedChecks = 0;

  const readViewportMetrics = () => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  });

  const emitSecurityEvent = (blocked: boolean) => {
    window.dispatchEvent(
      new CustomEvent("app:protected-content-guard", {
        detail: {
          blocked,
          path: window.location.pathname,
          reason: "developer-tools-viewport",
          occurredAt: new Date().toISOString(),
        },
      }),
    );
  };

  const setDeveloperToolsState = (nextState: boolean) => {
    if (isDeveloperToolsOpen.value === nextState) return;

    if (nextState) {
      document.documentElement.setAttribute(
        "data-protected-content-blocked",
        "true",
      );
      document
        .querySelectorAll<HTMLMediaElement>(
          ".app-route-view--protected video, .app-route-view--protected audio",
        )
        .forEach((media) => media.pause());
    } else {
      document.documentElement.removeAttribute(
        "data-protected-content-blocked",
      );
    }

    isDeveloperToolsOpen.value = nextState;
    if (nextState) {
      clearNuxtData((key) => key.startsWith("course-details:"));
    }
    emitSecurityEvent(nextState);
  };

  const checkDeveloperTools = (immediate = false) => {
    if (!toValue(protectionActive) || !config.developerToolsGuard) {
      consecutiveClosedChecks = 0;
      setDeveloperToolsState(false);
      return;
    }

    const threshold = isDeveloperToolsOpen.value
      ? config.developerToolsCloseThresholdPx
      : config.developerToolsOpenThresholdPx;
    const detected = hasDeveloperToolsViewportGap(
      readViewportMetrics(),
      threshold,
    );

    if (detected) {
      consecutiveClosedChecks = 0;
      setDeveloperToolsState(true);
    } else if (isDeveloperToolsOpen.value && !immediate) {
      consecutiveClosedChecks += 1;
      if (consecutiveClosedChecks >= config.developerToolsClosedChecks) {
        consecutiveClosedChecks = 0;
        setDeveloperToolsState(false);
      }
    } else if (!isDeveloperToolsOpen.value) {
      consecutiveClosedChecks = 0;
    }
  };

  const blockProtectedCopy = (event: Event) => {
    if (!toValue(protectionActive) || !config.blockProtectedCopy) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) checkDeveloperTools(true);
  };
  const handleWindowSignal = () => checkDeveloperTools(true);

  if (import.meta.client) checkDeveloperTools(true);

  onMounted(() => {
    checkDeveloperTools(true);
    window.addEventListener("resize", handleWindowSignal, { passive: true });
    window.addEventListener("focus", handleWindowSignal, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    PROTECTED_COPY_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, blockProtectedCopy, true);
    });
    detectionTimer = window.setInterval(
      checkDeveloperTools,
      config.developerToolsPollIntervalMs,
    );
  });

  watch(
    () => toValue(protectionActive),
    () => checkDeveloperTools(true),
  );

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleWindowSignal);
    window.removeEventListener("focus", handleWindowSignal);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    PROTECTED_COPY_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, blockProtectedCopy, true);
    });
    if (detectionTimer) clearInterval(detectionTimer);
    document.documentElement.removeAttribute("data-protected-content-blocked");
  });

  return {
    isDeveloperToolsOpen: readonly(isDeveloperToolsOpen),
  };
}
