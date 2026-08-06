import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import { useUserStore } from "~/stores/user";
import type { MaybeRefOrGetter } from "vue";

const SAVE_INTERVAL_SECONDS = 15;
const SAVE_INTERVAL_MS = SAVE_INTERVAL_SECONDS * 1000;

const normalizeSeconds = (value: unknown): number => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
};

export const formatWatchTime = (value: unknown): string => {
  const totalSeconds = normalizeSeconds(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};

const readEventNumber = (eventOrValue: CustomEvent<number> | number): number =>
  normalizeSeconds(
    typeof eventOrValue === "number" ? eventOrValue : eventOrValue.detail,
  );

export const useCourseWatchHistory = (
  sessionId: MaybeRefOrGetter<number | null | undefined>,
) => {
  const userStore = useUserStore();
  const fullTime = ref(0);
  const stopTime = ref(0);
  const lastSavedSecond = ref(-1);
  let requestInFlight = false;
  let hasQueuedSave = false;
  let trackingInterval: ReturnType<typeof setInterval> | null = null;

  const saveProgress = async (force = false): Promise<void> => {
    const currentSessionId = Number(toValue(sessionId));
    const duration = normalizeSeconds(fullTime.value);
    const stoppedAt = Math.min(normalizeSeconds(stopTime.value), duration);

    if (
      !Number.isInteger(currentSessionId)
      || currentSessionId <= 0
      || duration <= 0
      || !userStore.user?.apiToken
      || stoppedAt === lastSavedSecond.value
      || (!force && Math.abs(stoppedAt - lastSavedSecond.value) < SAVE_INTERVAL_SECONDS)
    ) {
      return;
    }

    if (requestInFlight) {
      hasQueuedSave = true;
      return;
    }

    requestInFlight = true;
    try {
      await NetworkService.instance.post({
        url: ApiNames.Instance.send_user_watch,
        data: {
          session_id: currentSessionId,
          full_time: formatWatchTime(duration),
          stop_time: formatWatchTime(stoppedAt),
        },
        isAuth: true,
      });
      lastSavedSecond.value = stoppedAt;
    } catch {
      // Playback must continue even if saving history temporarily fails.
    } finally {
      requestInFlight = false;
      if (hasQueuedSave) {
        hasQueuedSave = false;
        void saveProgress(true);
      }
    }
  };

  const updateDuration = (eventOrValue: CustomEvent<number> | number) => {
    fullTime.value = readEventNumber(eventOrValue);
  };

  const updateCurrentTime = (eventOrValue: CustomEvent<number> | number) => {
    stopTime.value = readEventNumber(eventOrValue);
  };

  const handlePausedChange = (eventOrValue: CustomEvent<boolean> | boolean) => {
    const isPaused = typeof eventOrValue === "boolean"
      ? eventOrValue
      : eventOrValue.detail;
    if (isPaused) void saveProgress(true);
  };

  const markPlaybackEnded = () => {
    stopTime.value = fullTime.value;
    void saveProgress(true);
  };

  const stopTracking = () => {
    if (!trackingInterval) return;

    clearInterval(trackingInterval);
    trackingInterval = null;
  };

  const startTracking = () => {
    if (trackingInterval) return;

    trackingInterval = setInterval(() => {
      void saveProgress(true);
    }, SAVE_INTERVAL_MS);
  };

  const saveWatchHistory = () => saveProgress(true);

  const handlePageHide = () => {
    stopTracking();
    void saveWatchHistory();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") void saveProgress(true);
  };

  onMounted(() => {
    startTracking();
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    stopTracking();
    window.removeEventListener("pagehide", handlePageHide);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    void saveWatchHistory();
  });

  return {
    updateDuration,
    updateCurrentTime,
    handlePausedChange,
    markPlaybackEnded,
    saveProgress,
    saveWatchHistory,
    stopTracking,
  };
};
