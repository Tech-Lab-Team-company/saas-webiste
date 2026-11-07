<script setup lang="ts">
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Renders the PDF to canvases inside this page instead of the browser's PDF
// plugin, whose native context menu (Save as / Print) a page cannot block.
const props = defineProps<{
  src: string;
  title?: string;
  page?: number;
}>();

const emit = defineEmits<{
  failed: [];
  loaded: [pageCount: number];
  pageChange: [page: number];
}>();

const MAX_OUTPUT_SCALE = 2;
const RESIZE_DEBOUNCE_MS = 150;

const protectionConfig = useCourseProtectionConfig();
const scroller = ref<HTMLElement | null>(null);
const isLoading = ref(true);
const pageAspects = ref<number[]>([]);

let pdfDocument: PDFDocumentProxy | null = null;
let loadingTask: PDFDocumentLoadingTask | null = null;
let fetchController: AbortController | null = null;
let pageObserver: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let renderedWidth = 0;
let loadId = 0;
let currentPage = 1;
let skipNextScroll = false;
const visiblePages = new Map<number, HTMLElement>();
const renderTasks = new Map<number, RenderTask>();
const renderTokens = new Map<number, number>();

const nextRenderToken = (pageNumber: number) => {
  const token = (renderTokens.get(pageNumber) ?? 0) + 1;
  renderTokens.set(pageNumber, token);
  renderTasks.get(pageNumber)?.cancel();
  renderTasks.delete(pageNumber);
  return token;
};

// Each render draws to a fresh canvas and swaps it in when finished, so a
// re-render never shares a canvas with one that is still being cancelled.
const renderPage = async (pageNumber: number, wrapper: HTMLElement) => {
  const token = nextRenderToken(pageNumber);
  const isStale = () => renderTokens.get(pageNumber) !== token;

  try {
    const page = await pdfDocument!.getPage(pageNumber);
    if (isStale()) return;

    const baseViewport = page.getViewport({ scale: 1 });
    pageAspects.value[pageNumber - 1] = baseViewport.width / baseViewport.height;

    const outputScale = Math.min(window.devicePixelRatio || 1, MAX_OUTPUT_SCALE);
    const viewport = page.getViewport({
      scale: (wrapper.clientWidth / baseViewport.width) * outputScale,
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const task = page.render({ canvas, viewport });
    renderTasks.set(pageNumber, task);
    await task.promise;
    if (!isStale()) wrapper.replaceChildren(canvas);
  } catch (error: any) {
    if (error?.name !== "RenderingCancelledException" && !isStale()) {
      console.warn(`[ProtectedPdf] Failed to render page ${pageNumber}`, error);
    }
  }
};

const releasePage = (pageNumber: number, wrapper: HTMLElement) => {
  nextRenderToken(pageNumber);
  wrapper.replaceChildren();
};

const handlePageIntersections = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const wrapper = entry.target as HTMLElement;
    const pageNumber = Number(wrapper.dataset.page);
    if (entry.isIntersecting) {
      visiblePages.set(pageNumber, wrapper);
      void renderPage(pageNumber, wrapper);
    } else if (visiblePages.delete(pageNumber)) {
      releasePage(pageNumber, wrapper);
    }
  }
};

const scrollToPage = (pageNumber: number) => {
  const wrapper = scroller.value?.querySelector<HTMLElement>(
    `[data-page="${pageNumber}"]`,
  );
  if (!wrapper) return;

  currentPage = pageNumber;
  skipNextScroll = true;
  scroller.value!.scrollTop = wrapper.offsetTop - scroller.value!.offsetTop;
};

const handleScroll = () => {
  if (skipNextScroll) {
    skipNextScroll = false;
    return;
  }

  const element = scroller.value;
  if (!element) return;

  const viewportMiddle = element.scrollTop + element.clientHeight / 2;
  const wrappers = element.querySelectorAll<HTMLElement>("[data-page]");
  let pageNumber = currentPage;
  for (const wrapper of wrappers) {
    if (wrapper.offsetTop - element.offsetTop > viewportMiddle) break;
    pageNumber = Number(wrapper.dataset.page);
  }

  if (pageNumber !== currentPage) {
    currentPage = pageNumber;
    emit("pageChange", pageNumber);
  }
};

const handleResize = () => {
  const width = scroller.value?.clientWidth ?? 0;
  if (!width || width === renderedWidth) return;
  renderedWidth = width;

  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    visiblePages.forEach((wrapper, pageNumber) => void renderPage(pageNumber, wrapper));
  }, RESIZE_DEBOUNCE_MS);
};

const teardown = () => {
  fetchController?.abort();
  fetchController = null;
  pageObserver?.disconnect();
  pageObserver = null;
  renderTasks.forEach((task) => task.cancel());
  renderTasks.clear();
  renderTokens.clear();
  visiblePages.clear();
  void loadingTask?.destroy();
  loadingTask = null;
  pdfDocument = null;
};

const load = async () => {
  const currentLoad = ++loadId;
  teardown();
  isLoading.value = true;
  pageAspects.value = [];

  try {
    fetchController = new AbortController();
    const response = await fetch(props.src, {
      credentials: "omit",
      signal: fetchController.signal,
      ...(protectionConfig.pdfNoReferrer
        ? { referrerPolicy: "no-referrer" as const }
        : {}),
    });
    if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
    const data = new Uint8Array(await response.arrayBuffer());
    if (currentLoad !== loadId) return;

    const pdfjs = await import("pdfjs-dist");
    if (currentLoad !== loadId) return;

    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    const assetsUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}`;
    loadingTask = pdfjs.getDocument({
      data,
      cMapUrl: `${assetsUrl}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${assetsUrl}/standard_fonts/`,
      wasmUrl: `${assetsUrl}/wasm/`,
      iccUrl: `${assetsUrl}/iccs/`,
    });
    const loadedDocument = await loadingTask.promise;
    if (currentLoad !== loadId) return;
    pdfDocument = loadedDocument;

    const firstPage = await loadedDocument.getPage(1);
    if (currentLoad !== loadId) return;
    const { width, height } = firstPage.getViewport({ scale: 1 });
    pageAspects.value = Array.from(
      { length: loadedDocument.numPages },
      () => width / height,
    );
    isLoading.value = false;

    await nextTick();
    if (currentLoad !== loadId || !scroller.value) return;

    renderedWidth = scroller.value.clientWidth;
    pageObserver = new IntersectionObserver(handlePageIntersections, {
      root: scroller.value,
      rootMargin: "100% 0px",
    });
    scroller.value
      .querySelectorAll("[data-page]")
      .forEach((wrapper) => pageObserver!.observe(wrapper));

    emit("loaded", loadedDocument.numPages);
    currentPage = 1;
    if (props.page && props.page > 1) scrollToPage(props.page);
  } catch (error: any) {
    if (currentLoad !== loadId) return;
    console.warn("[ProtectedPdf] Failed to load PDF", error);
    emit("failed");
  }
};

watch(() => props.src, load);
watch(
  () => props.page,
  (pageNumber) => {
    if (pageNumber && pageNumber !== currentPage) scrollToPage(pageNumber);
  },
);

onMounted(() => {
  void load();
  resizeObserver = new ResizeObserver(handleResize);
  if (scroller.value) resizeObserver.observe(scroller.value);
});

onBeforeUnmount(() => {
  loadId += 1;
  teardown();
  resizeObserver?.disconnect();
  if (resizeTimer) clearTimeout(resizeTimer);
});
</script>

<template>
  <div
    ref="scroller"
    class="protected-pdf"
    dir="ltr"
    role="document"
    :aria-label="title"
    :aria-busy="isLoading"
    @scroll.passive="handleScroll"
  >
    <div v-if="isLoading" class="protected-pdf__loading">جاري تحميل الملف...</div>
    <div
      v-for="(aspect, index) in pageAspects"
      :key="index"
      class="protected-pdf__page"
      :data-page="index + 1"
      :style="{ aspectRatio: aspect }"
    ></div>
  </div>
</template>

<style scoped>
.protected-pdf {
  width: 100%;
  height: min(70vh, 680px);
  overflow: auto;
  border-radius: 14px;
  background: #1f2937;
  user-select: none;
}

.protected-pdf__loading {
  display: grid;
  height: 100%;
  place-items: center;
  color: #fff;
}

.protected-pdf__page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 10px;
  background: #fff;
}

.protected-pdf__page :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
