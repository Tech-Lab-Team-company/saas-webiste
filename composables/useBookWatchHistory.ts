import type { MaybeRefOrGetter } from "vue";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import { useUserStore } from "~/stores/user";

const SAVE_INTERVAL_SECONDS = 15;
const SAVE_INTERVAL_MS = SAVE_INTERVAL_SECONDS * 1000;

const normalizePositiveInteger = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const normalizeSeconds = (value: unknown): number => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
};

export const formatBookWatchTime = (value: unknown): string => {
  const totalSeconds = normalizeSeconds(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};

export const useBookWatchHistory = (options: {
  bookId?: MaybeRefOrGetter<number | null | undefined>;
  sessionId?: MaybeRefOrGetter<number | null | undefined>;
}) => {
  const userStore = useUserStore();
  const currentPage = ref(1);
  const fullTime = ref(0);
  const stopTime = ref(0);
  const lastSavedPage = ref(0);
  const lastSavedSecond = ref(-1);
  let pageRequestInFlight = false;
  let sessionRequestInFlight = false;
  let queuedPageSave = false;
  let queuedSessionSave = false;
  let trackingInterval: ReturnType<typeof setInterval> | null = null;

  const canSave = () => Boolean(userStore.user?.apiToken);

  const savePage = async (force = false): Promise<void> => {
    const bookId = normalizePositiveInteger(
      options.bookId === undefined ? null : toValue(options.bookId),
    );
    const page = normalizePositiveInteger(currentPage.value);

    if (!bookId || !page || !canSave() || (!force && page === lastSavedPage.value)) {
      return;
    }

    if (pageRequestInFlight) {
      queuedPageSave = true;
      return;
    }

    pageRequestInFlight = true;
    try {
      await NetworkService.instance.post({
        url: ApiNames.Instance.send_book_session_watch,
        data: { book_id: bookId, page },
        isAuth: true,
      });
      lastSavedPage.value = page;
    } catch {
      // Reading must stay available if progress saving temporarily fails.
    } finally {
      pageRequestInFlight = false;
      if (queuedPageSave) {
        queuedPageSave = false;
        void savePage(true);
      }
    }
  };

  const saveSession = async (force = false): Promise<void> => {
    const sessionId = normalizePositiveInteger(
      options.sessionId === undefined ? null : toValue(options.sessionId),
    );
    const duration = normalizeSeconds(fullTime.value);
    const stoppedAt = duration
      ? Math.min(normalizeSeconds(stopTime.value), duration)
      : normalizeSeconds(stopTime.value);

    if (
      !sessionId ||
      !canSave() ||
      duration <= 0 ||
      stoppedAt === lastSavedSecond.value ||
      (!force && Math.abs(stoppedAt - lastSavedSecond.value) < SAVE_INTERVAL_SECONDS)
    ) {
      return;
    }

    if (sessionRequestInFlight) {
      queuedSessionSave = true;
      return;
    }

    sessionRequestInFlight = true;
    try {
      await NetworkService.instance.post({
        url: ApiNames.Instance.send_book_session_watch,
        data: {
          session_id: sessionId,
          full_time: formatBookWatchTime(duration),
          stop_time: formatBookWatchTime(stoppedAt),
        },
        isAuth: true,
      });
      lastSavedSecond.value = stoppedAt;
    } catch {
      // Playback must continue if progress saving temporarily fails.
    } finally {
      sessionRequestInFlight = false;
      if (queuedSessionSave) {
        queuedSessionSave = false;
        void saveSession(true);
      }
    }
  };

  const updatePage = (value: unknown) => {
    const page = normalizePositiveInteger(value);
    if (!page) return;
    currentPage.value = page;
    void savePage(true);
  };

  const updateDuration = (value: CustomEvent<number> | number) => {
    fullTime.value = normalizeSeconds(
      typeof value === "number" ? value : value.detail,
    );
  };

  const updateCurrentTime = (value: CustomEvent<number> | number) => {
    stopTime.value = normalizeSeconds(
      typeof value === "number" ? value : value.detail,
    );
  };

  const handlePausedChange = (value: CustomEvent<boolean> | boolean) => {
    const isPaused = typeof value === "boolean" ? value : value.detail;
    if (isPaused) void saveSession(true);
  };

  const markPlaybackEnded = () => {
    stopTime.value = fullTime.value;
    void saveSession(true);
  };

  const stopTracking = () => {
    if (!trackingInterval) return;
    clearInterval(trackingInterval);
    trackingInterval = null;
  };

  const saveAll = () => {
    void savePage(true);
    void saveSession(true);
  };

  const handlePageHide = () => {
    stopTracking();
    saveAll();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") saveAll();
  };

  onMounted(() => {
    trackingInterval = setInterval(() => {
      void saveSession(true);
    }, SAVE_INTERVAL_MS);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    stopTracking();
    window.removeEventListener("pagehide", handlePageHide);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    saveAll();
  });

  return {
    currentPage,
    updatePage,
    updateDuration,
    updateCurrentTime,
    handlePausedChange,
    markPlaybackEnded,
    savePage,
    saveSession,
    saveAll,
  };
};
