const BLOCKED_DEVELOPER_KEYS = new Set(["i", "j", "c"]);
const BLOCKED_DOCUMENT_KEYS = new Set(["u", "s", "p"]);

export function useAppContentProtection() {
  const config = useCourseProtectionConfig();
  const protectionNotice = ref("");
  const protectionNoticeKey = ref(0);
  let noticeTimer: ReturnType<typeof setTimeout> | null = null;

  const showNotice = () => {
    protectionNotice.value = "هذا الإجراء غير متاح داخل المنصة";
    protectionNoticeKey.value += 1;

    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => {
      protectionNotice.value = "";
    }, config.noticeDurationMs);
  };

  const blockEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    showNotice();
  };

  const handleContextMenu = (event: MouseEvent) => {
    if (config.blockContextMenu) blockEvent(event);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const commandKey = event.ctrlKey || event.metaKey;
    const isDeveloperShortcut =
      event.key === "F12" ||
      (commandKey && event.shiftKey && BLOCKED_DEVELOPER_KEYS.has(key));
    const isDocumentShortcut =
      commandKey && BLOCKED_DOCUMENT_KEYS.has(key);

    if (
      (config.blockInspectShortcuts && isDeveloperShortcut) ||
      (config.blockDocumentShortcuts && isDocumentShortcut) ||
      (config.blockPrint && commandKey && key === "p")
    ) {
      blockEvent(event);
    }
  };

  onMounted(() => {
    if (!config.enabled) return;
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeydown, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("contextmenu", handleContextMenu, true);
    document.removeEventListener("keydown", handleKeydown, true);
    if (noticeTimer) clearTimeout(noticeTimer);
  });

  return {
    protectionNotice: readonly(protectionNotice),
    protectionNoticeKey: readonly(protectionNoticeKey),
  };
}
