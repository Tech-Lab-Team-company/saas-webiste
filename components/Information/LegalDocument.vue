<script setup lang="ts">
import { useBaseUrls } from "~/constant/baseUrl";
import { getWebDomain } from "~/constant/webDomain";

interface LegalDocument {
  id: number;
  title: string;
  text: string;
}

const props = defineProps<{
  endpoint: "fetch_privacy" | "fetch_terms";
  cacheKey: string;
  fallbackTitle: string;
}>();

const webDomain = getWebDomain();

const { data: document, pending, error, refresh } = await useAsyncData(
  `${props.cacheKey}:${webDomain}`,
  async () => {
    const response = await $fetch<{
      data: LegalDocument;
      message: string;
      status: boolean | number;
    }>(`${useBaseUrls().baseUrl}/${props.endpoint}`, {
      method: "GET",
      headers: {
        "Accept-Language": "ar",
        "web-domain": webDomain,
      },
    });

    return response.data;
  },
);

const containsHtml = computed(() => /<[a-z][\s\S]*>/i.test(document.value?.text || ""));
const plainParagraphs = computed(() => {
  const text = document.value?.text?.replace(/\s+/g, " ").trim() || "";
  if (!text || containsHtml.value) return [];

  const sentences = text.split(/(?<=[.!؟])\s+/u).filter(Boolean);
  if (sentences.length <= 3) return [text];

  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 3) {
    paragraphs.push(sentences.slice(index, index + 3).join(" "));
  }
  return paragraphs;
});
</script>

<template>
  <div class="legal-document">
    <div v-if="pending" class="information-state information-state--loading" role="status">
      <span /><span /><span /><span />
      <p>جاري تحميل المحتوى...</p>
    </div>

    <div v-else-if="error" class="information-state information-state--error" role="alert">
      <span aria-hidden="true">!</span>
      <h2>تعذر تحميل المحتوى</h2>
      <p>يرجى المحاولة مرة أخرى بعد قليل.</p>
      <button type="button" @click="refresh()">إعادة المحاولة</button>
    </div>

    <template v-else-if="document">
      <header class="legal-document__heading">
        <span>وثيقة رسمية</span>
        <h2>{{ document.title || fallbackTitle }}</h2>
        <p>يرجى قراءة البنود التالية بعناية لمعرفة حقوقك والتزاماتك عند استخدام المنصة.</p>
      </header>

      <div
        v-if="containsHtml"
        class="legal-document__content legal-document__content--html"
        v-html="document.text"
      />
      <div v-else class="legal-document__content">
        <p v-for="(paragraph, index) in plainParagraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </template>

    <div v-else class="information-state">
      <h2>لا يوجد محتوى منشور حاليًا</h2>
    </div>
  </div>
</template>

<style scoped>
.legal-document__heading {
  margin-bottom: 34px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--home-v2-line);
}

.legal-document__heading > span {
  color: var(--home-v2-coral);
  font-size: 10px;
  font-weight: 900;
}

.legal-document__heading h2 {
  margin: 7px 0;
  color: var(--home-v2-ink);
  font: 900 clamp(25px, 3vw, 36px) / 1.45 var(--home-v2-heading);
}

.legal-document__heading p {
  max-width: 720px;
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 13px;
  line-height: 1.9;
}

.legal-document__content {
  color: var(--home-v2-muted);
  font-size: 15px;
  line-height: 2.15;
}

.legal-document__content p {
  margin: 0 0 22px;
}

.legal-document__content--html :deep(h1),
.legal-document__content--html :deep(h2),
.legal-document__content--html :deep(h3),
.legal-document__content--html :deep(h4) {
  margin: 34px 0 10px;
  color: var(--home-v2-ink);
  font-family: var(--home-v2-heading);
  line-height: 1.55;
}

.legal-document__content--html :deep(p) {
  margin: 0 0 20px;
}

.legal-document__content--html :deep(ul),
.legal-document__content--html :deep(ol) {
  display: grid;
  gap: 9px;
  padding-inline-start: 24px;
}

.legal-document__content--html :deep(a) {
  color: var(--home-v2-blue);
  font-weight: 800;
  text-decoration: underline;
}

.information-state {
  display: grid;
  min-height: 320px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--home-v2-muted);
  text-align: center;
}

.information-state h2,
.information-state p {
  margin: 0;
}

.information-state--loading span {
  width: min(100%, 680px);
  height: 14px;
  background: linear-gradient(90deg, var(--home-v2-cream), var(--home-v2-surface-raised), var(--home-v2-cream));
  background-size: 200% 100%;
  animation: information-loading 1.2s linear infinite;
}

.information-state--loading span:nth-child(2) { width: 88%; }
.information-state--loading span:nth-child(3) { width: 72%; }
.information-state--loading span:nth-child(4) { width: 92%; }

.information-state--error > span {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-coral) 14%, var(--home-v2-surface));
  color: var(--home-v2-coral);
  font-weight: 900;
}

.information-state button {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-weight: 900;
}

@keyframes information-loading {
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .information-state--loading span { animation: none; }
}
</style>
