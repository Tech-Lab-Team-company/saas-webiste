import type { MaybeRefOrGetter } from "vue";
import { hasDeveloperToolsViewportGap } from "~/utils/protectedLearningRoute";

const PROTECTED_COPY_EVENTS = ["copy", "cut", "dragstart"] as const;

export function useProtectedLearningGuard(
  protectionActive: MaybeRefOrGetter<boolean>,
) {
  const config = useCourseProtectionConfig();
  const isDeveloperToolsOpen = ref(false);
  const isProtectedWindowInactive = ref(false);
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

  const syncProtectedContentLock = () => {
    const shouldBlock =
      isDeveloperToolsOpen.value || isProtectedWindowInactive.value;

    if (shouldBlock) {
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
  };

  const setDeveloperToolsState = (nextState: boolean) => {
    if (isDeveloperToolsOpen.value === nextState) return;

    isDeveloperToolsOpen.value = nextState;
    syncProtectedContentLock();
    if (nextState) {
      clearNuxtData((key) => key.startsWith("course-details:"));
    }
    emitSecurityEvent(nextState);
  };

  const setProtectedWindowInactive = (nextState: boolean) => {
    if (isProtectedWindowInactive.value === nextState) return;
    isProtectedWindowInactive.value = nextState;
    syncProtectedContentLock();
    if (nextState) {
      clearNuxtData((key) => key.startsWith("course-details:"));
    }
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
    if (!toValue(protectionActive) || !config.blockProtectedWindowBlur) return;
    setProtectedWindowInactive(document.hidden);
    if (!document.hidden) checkDeveloperTools(true);
  };
  const handleWindowBlur = () => {
    if (toValue(protectionActive) && config.blockProtectedWindowBlur) {
      setProtectedWindowInactive(true);
    }
  };
  const handleWindowFocus = () => {
    setProtectedWindowInactive(false);
    checkDeveloperTools(true);
  };
  const handleWindowResize = () => checkDeveloperTools(true);

  if (import.meta.client) checkDeveloperTools(true);

  onMounted(() => {
    checkDeveloperTools(true);
    window.addEventListener("resize", handleWindowResize, { passive: true });
    window.addEventListener("blur", handleWindowBlur, { passive: true });
    window.addEventListener("focus", handleWindowFocus, { passive: true });
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
    (active) => {
      if (!active) setProtectedWindowInactive(false);
      checkDeveloperTools(true);
    },
  );

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleWindowResize);
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("focus", handleWindowFocus);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    PROTECTED_COPY_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, blockProtectedCopy, true);
    });
    if (detectionTimer) clearInterval(detectionTimer);
    document.documentElement.removeAttribute("data-protected-content-blocked");
  });

  return {
    isDeveloperToolsOpen: readonly(isDeveloperToolsOpen),
    isProtectedContentBlocked: computed(
      () => isDeveloperToolsOpen.value || isProtectedWindowInactive.value,
    ),
  };
}
