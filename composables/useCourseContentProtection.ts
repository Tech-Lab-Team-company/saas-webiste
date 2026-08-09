import type { Ref } from "vue";

const BLOCKED_SHORTCUT_KEYS = new Set(["i", "j", "c"]);
const BLOCKED_DOCUMENT_KEYS = new Set(["u", "s"]);

export function useCourseContentProtection(mediaActive: Ref<boolean>) {
  const config = useCourseProtectionConfig();
  const isCaptureShielded = ref(false);
  const protectionNotice = ref("");
  let noticeTimer: ReturnType<typeof setTimeout> | null = null;
  let focusTimer: ReturnType<typeof setTimeout> | null = null;

  const showNotice = (message: string) => {
    protectionNotice.value = message;
    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => {
      protectionNotice.value = "";
    }, config.noticeDurationMs);
  };

  const blockEvent = (event: Event, message = "هذا الإجراء غير متاح داخل محتوى الكورس") => {
    event.preventDefault();
    event.stopPropagation();
    showNotice(message);
  };

  const handleContextMenu = (event: MouseEvent) => {
    if (!config.blockContextMenu) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest(".course-details-page")) blockEvent(event);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const commandKey = event.ctrlKey || event.metaKey;
    const isDeveloperShortcut =
      event.key === "F12" ||
      (commandKey && event.shiftKey && BLOCKED_SHORTCUT_KEYS.has(key));
    const isDocumentShortcut = commandKey && BLOCKED_DOCUMENT_KEYS.has(key);

    const isPrintShortcut = commandKey && key === "p";

    if (
      (config.blockInspectShortcuts && isDeveloperShortcut) ||
      (config.blockDocumentShortcuts && isDocumentShortcut) ||
      (config.blockPrint && isPrintShortcut)
    ) {
      blockEvent(event);
      return;
    }

    if (config.captureShield && event.key === "PrintScreen" && mediaActive.value) {
      isCaptureShielded.value = true;
      showNotice("تم إخفاء المحتوى المحمي مؤقتًا");
      window.setTimeout(() => {
        if (document.hasFocus()) isCaptureShielded.value = false;
      }, 1200);
    }
  };

  const handleDragStart = (event: DragEvent) => {
    if (!config.blockMediaDrag) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest(".course-viewer")) blockEvent(event);
  };

  const handleWindowBlur = () => {
    if (config.captureShield && config.shieldOnWindowBlur && mediaActive.value) {
      isCaptureShielded.value = true;
    }
  };

  const handleWindowFocus = () => {
    if (focusTimer) clearTimeout(focusTimer);
    focusTimer = setTimeout(() => {
      isCaptureShielded.value = false;
    }, config.focusRestoreDelayMs);
  };

  const handleVisibilityChange = () => {
    if (!config.captureShield || !mediaActive.value) return;
    isCaptureShielded.value = document.hidden;
  };

  const handleBeforePrint = () => {
    if (config.captureShield && config.blockPrint && mediaActive.value) {
      isCaptureShielded.value = true;
    }
  };

  const handleAfterPrint = () => {
    isCaptureShielded.value = false;
  };

  onMounted(() => {
    if (!config.enabled) return;
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeydown, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
  });

  onBeforeUnmount(() => {
    if (!config.enabled) return;
    document.removeEventListener("contextmenu", handleContextMenu, true);
    document.removeEventListener("keydown", handleKeydown, true);
    document.removeEventListener("dragstart", handleDragStart, true);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("focus", handleWindowFocus);
    window.removeEventListener("beforeprint", handleBeforePrint);
    window.removeEventListener("afterprint", handleAfterPrint);
    if (noticeTimer) clearTimeout(noticeTimer);
    if (focusTimer) clearTimeout(focusTimer);
  });

  return {
    protectionEnabled: config.enabled,
    isCaptureShielded: readonly(isCaptureShielded),
    protectionNotice: readonly(protectionNotice),
  };
}
