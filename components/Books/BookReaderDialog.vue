<script setup lang="ts">
const props = defineProps<{
  url: string;
  bookId: number;
  title: string;
  totalPages?: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const page = ref(1);
const pageInput = ref("1");
const history = useBookWatchHistory({ bookId: () => props.bookId });
const maximumPage = computed(() => Math.max(1, Number(props.totalPages) || 1));
const hasKnownPageCount = computed(() => Number(props.totalPages) > 0);
const readerUrl = computed(() => {
  const source = props.url.split("#")[0];
  return `${source}#page=${page.value}&toolbar=0&navpanes=0&view=FitH`;
});

const setPage = (value: number) => {
  const nextPage = hasKnownPageCount.value
    ? Math.min(maximumPage.value, Math.max(1, Math.trunc(value)))
    : Math.max(1, Math.trunc(value));
  if (!Number.isFinite(nextPage)) return;

  page.value = nextPage;
  pageInput.value = String(nextPage);
  history.updatePage(nextPage);
};

const applyPageInput = () => setPage(Number(pageInput.value));
const close = () => {
  history.saveAll();
  emit("close");
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
  if (event.key === "ArrowRight") setPage(page.value - 1);
  if (event.key === "ArrowLeft") setPage(page.value + 1);
};

onMounted(() => {
  document.body.classList.add("book-dialog-open");
  window.addEventListener("keydown", handleKeydown);
  history.updatePage(page.value);
});

onBeforeUnmount(() => {
  document.body.classList.remove("book-dialog-open");
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div class="book-reader" role="dialog" aria-modal="true" :aria-label="`قراءة ${title}`">
      <header class="book-reader__header">
        <div>
          <small>قارئ الكتاب</small>
          <strong>{{ title }}</strong>
        </div>

        <div class="book-reader__pagination" aria-label="التنقل بين الصفحات">
          <button type="button" :disabled="page <= 1" @click="setPage(page - 1)">
            <i class="pi pi-chevron-right" aria-hidden="true"></i>
            السابق
          </button>
          <label>
            <span>صفحة</span>
            <input
              v-model="pageInput"
              type="number"
              min="1"
              :max="hasKnownPageCount ? maximumPage : undefined"
              inputmode="numeric"
              @change="applyPageInput"
              @keyup.enter="applyPageInput"
            />
            <span v-if="hasKnownPageCount">من {{ maximumPage }}</span>
          </label>
          <button
            type="button"
            :disabled="hasKnownPageCount && page >= maximumPage"
            @click="setPage(page + 1)"
          >
            التالي
            <i class="pi pi-chevron-left" aria-hidden="true"></i>
          </button>
        </div>

        <div class="book-reader__actions">
          <a :href="url" target="_blank" rel="noreferrer" title="فتح في نافذة جديدة">
            <i class="pi pi-external-link" aria-hidden="true"></i>
          </a>
          <button type="button" title="إغلاق القارئ" @click="close">
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <main class="book-reader__content">
        <iframe :key="readerUrl" :src="readerUrl" :title="title"></iframe>
      </main>
    </div>
  </Teleport>
</template>

<style scoped>
.book-reader {
  position: fixed;
  z-index: 5000;
  inset: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  color: var(--app-text, #081b3a);
  background: var(--app-bg, #eef1f6);
}

.book-reader__header {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(100px, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 78px;
  padding: 12px clamp(14px, 3vw, 34px);
  border-bottom: 1px solid var(--app-line, #dfe5ee);
  background: var(--app-surface, #fff);
  box-shadow: 0 8px 30px rgb(8 27 58 / 8%);
}

.book-reader__header > div:first-child {
  min-width: 0;
}

.book-reader__header small,
.book-reader__header strong {
  display: block;
}

.book-reader__header small {
  color: var(--app-muted, #65738a);
  font-size: 11px;
}

.book-reader__header strong {
  overflow: hidden;
  margin-top: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-reader__pagination,
.book-reader__pagination label,
.book-reader__pagination button,
.book-reader__actions {
  display: flex;
  align-items: center;
}

.book-reader__pagination {
  gap: 8px;
}

.book-reader__pagination label {
  gap: 7px;
  color: var(--app-muted, #65738a);
  font-size: 12px;
}

.book-reader__pagination input {
  width: 62px;
  height: 40px;
  border: 1px solid var(--app-line, #dfe5ee);
  border-radius: 10px;
  background: var(--app-bg-muted, #f4f6fa);
  color: var(--app-text, #081b3a);
  text-align: center;
  font-weight: 800;
}

.book-reader__pagination button {
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 0 14px;
  color: #fff;
  border: 0;
  border-radius: 10px;
  background: var(--app-brand-primary, #28366c);
  cursor: pointer;
}

.book-reader__pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.book-reader__actions {
  justify-content: flex-end;
  gap: 8px;
}

.book-reader__actions a,
.book-reader__actions button {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--app-text, #081b3a);
  border: 1px solid var(--app-line, #dfe5ee);
  border-radius: 11px;
  background: var(--app-bg-muted, #f4f6fa);
  cursor: pointer;
}

.book-reader__content {
  min-height: 0;
  padding: 14px;
}

.book-reader__content iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 20px 60px rgb(8 27 58 / 13%);
}

@media (max-width: 760px) {
  .book-reader__header {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
  }

  .book-reader__header > div:first-child {
    display: none;
  }

  .book-reader__pagination {
    justify-content: flex-start;
  }

  .book-reader__pagination button {
    width: 40px;
    padding: 0;
    font-size: 0;
  }

  .book-reader__pagination button i {
    font-size: 13px;
  }

  .book-reader__pagination label > span:last-child {
    display: none;
  }

  .book-reader__content {
    padding: 7px;
  }
}
</style>

<style>
body.book-dialog-open {
  overflow: hidden;
}
</style>
