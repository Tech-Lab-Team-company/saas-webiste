<script setup lang="ts">
import { Player, Video, Youtube, DefaultUi, DefaultControls } from "@vime/vue-next";
import "@vime/core/themes/default.css";

interface BookMediaDialogItem {
  key: string;
  url: string;
  label: string;
  sessionId: number | null;
  type: number | null;
}

const props = defineProps<{
  item: BookMediaDialogItem;
}>();

const emit = defineEmits<{
  close: [];
}>();

const history = useBookWatchHistory({ sessionId: () => props.item.sessionId });
const youtubeId = computed(() => {
  try {
    const url = new URL(props.item.url);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1) || null;
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || url.pathname.match(/\/embed\/([^/?]+)/)?.[1] || null;
    }
  } catch {
    return null;
  }
  return null;
});
const extension = computed(() => {
  try {
    return new URL(props.item.url).pathname.split(".").pop()?.toLowerCase() || "";
  } catch {
    return "";
  }
});
const mediaKind = computed<"youtube" | "video" | "audio" | "embed">(() => {
  if (youtubeId.value) return "youtube";
  if (["mp3", "wav", "ogg", "m4a", "aac"].includes(extension.value)) return "audio";
  if (props.item.type === 4 || ["mp4", "webm", "mov", "m4v"].includes(extension.value)) return "video";
  return "embed";
});

const close = () => {
  history.saveAll();
  emit("close");
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
};
const onAudioMetadata = (event: Event) => {
  history.updateDuration((event.currentTarget as HTMLMediaElement).duration);
};
const onAudioTimeUpdate = (event: Event) => {
  history.updateCurrentTime((event.currentTarget as HTMLMediaElement).currentTime);
};

onMounted(() => {
  document.body.classList.add("book-dialog-open");
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.body.classList.remove("book-dialog-open");
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div class="book-media-dialog" role="dialog" aria-modal="true" :aria-label="item.label">
      <button class="book-media-dialog__backdrop" type="button" aria-label="إغلاق" @click="close"></button>
      <section class="book-media-dialog__panel">
        <header>
          <div>
            <small>محتوى الكتاب</small>
            <strong>{{ item.label }}</strong>
          </div>
          <div>
            <a :href="item.url" target="_blank" rel="noreferrer" title="فتح في نافذة جديدة">
              <i class="pi pi-external-link" aria-hidden="true"></i>
            </a>
            <button type="button" title="إغلاق" @click="close">
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </div>
        </header>

        <div class="book-media-dialog__content">
          <Player
            v-if="mediaKind === 'youtube'"
            theme="dark"
            playsinline
            @vmDurationChange="history.updateDuration"
            @vmCurrentTimeChange="history.updateCurrentTime"
            @vmPausedChange="history.handlePausedChange"
            @vmPlaybackEnded="history.markPlaybackEnded"
          >
            <Youtube :video-id="youtubeId!" />
            <DefaultUi />
          </Player>

          <Player
            v-else-if="mediaKind === 'video'"
            theme="dark"
            playsinline
            @vmDurationChange="history.updateDuration"
            @vmCurrentTimeChange="history.updateCurrentTime"
            @vmPausedChange="history.handlePausedChange"
            @vmPlaybackEnded="history.markPlaybackEnded"
          >
            <Video><source :data-src="item.url" type="video/mp4" /></Video>
            <DefaultUi no-controls><DefaultControls /></DefaultUi>
          </Player>

          <audio
            v-else-if="mediaKind === 'audio'"
            :src="item.url"
            controls
            @loadedmetadata="onAudioMetadata"
            @timeupdate="onAudioTimeUpdate"
            @pause="history.saveSession(true)"
            @ended="history.markPlaybackEnded"
          ></audio>

          <iframe v-else :src="item.url" :title="item.label"></iframe>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.book-media-dialog {
  position: fixed;
  z-index: 5000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 18px;
}

.book-media-dialog__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: rgb(4 9 20 / 78%);
  cursor: default;
  backdrop-filter: blur(8px);
}

.book-media-dialog__panel {
  position: relative;
  width: min(1040px, 100%);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 22px;
  background: #0b101b;
  box-shadow: 0 35px 100px rgb(0 0 0 / 50%);
}

.book-media-dialog__panel > header {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 13px 18px;
  color: #fff;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.book-media-dialog__panel header small,
.book-media-dialog__panel header strong {
  display: block;
}

.book-media-dialog__panel header small {
  color: #98a4b8;
  font-size: 10px;
}

.book-media-dialog__panel header strong {
  margin-top: 3px;
}

.book-media-dialog__panel header > div:last-child {
  display: flex;
  gap: 8px;
}

.book-media-dialog__panel header a,
.book-media-dialog__panel header button {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  color: #fff;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 10px;
  background: rgb(255 255 255 / 8%);
  cursor: pointer;
}

.book-media-dialog__content {
  display: grid;
  min-height: min(66vh, 650px);
  place-items: center;
  background: #000;
}

.book-media-dialog__content :deep(vm-player),
.book-media-dialog__content :deep(.vm-player),
.book-media-dialog__content iframe,
.book-media-dialog__content audio {
  width: 100%;
}

.book-media-dialog__content :deep(vm-player),
.book-media-dialog__content :deep(.vm-player),
.book-media-dialog__content iframe {
  height: min(66vh, 650px);
  border: 0;
}

.book-media-dialog__content audio {
  max-width: 760px;
  margin: 60px;
}

@media (max-width: 640px) {
  .book-media-dialog {
    padding: 8px;
  }

  .book-media-dialog__panel {
    border-radius: 16px;
  }

  .book-media-dialog__content,
  .book-media-dialog__content :deep(vm-player),
  .book-media-dialog__content :deep(.vm-player),
  .book-media-dialog__content iframe {
    min-height: 56vh;
    height: 56vh;
  }
}
</style>
