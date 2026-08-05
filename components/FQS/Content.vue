<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type Fqs from "~/types/fqs";

const requestUrl = useRequestURL();
const webDomain = ["localhost", "127.0.0.1", "mr-eslamsalama.com"].includes(
  requestUrl.hostname,
)
  ? "mr-eslamsalama.com"
  : requestUrl.hostname;

const { data: fqs, pending, error, refresh } = await useAsyncData(
  `fqs:${webDomain}`,
  async () => {
    const response = await $fetch<{
      data: Fqs[];
      message: string;
      status: boolean | number;
    }>(`${baseUrl}/fetch_faqs`, {
      method: "GET",
      headers: {
        "Accept-Language": "ar",
        "web-domain": webDomain,
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  },
  { default: () => [] },
);
</script>

<template>
  <div class="faq-content">
    <header class="faq-content__heading">
      <span>إجابات واضحة</span>
      <h2>كل ما تحتاج معرفته</h2>
      <p>اختر السؤال لعرض الإجابة، وإذا لم تجد ما تبحث عنه يمكنك التواصل معنا.</p>
    </header>

    <div v-if="pending" class="faq-content__loading" role="status">
      <span v-for="item in 4" :key="item" />
      <p>جاري تحميل الأسئلة...</p>
    </div>

    <div v-else-if="error" class="faq-content__state" role="alert">
      <span aria-hidden="true">?</span>
      <h2>تعذر تحميل الأسئلة</h2>
      <p>يرجى المحاولة مرة أخرى بعد قليل.</p>
      <button type="button" @click="refresh()">إعادة المحاولة</button>
    </div>

    <div v-else-if="fqs.length" class="faq-content__list">
      <details v-for="(item, index) in fqs" :key="item.id" :open="index === 0">
        <summary>
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <b>{{ item.question }}</b>
          <i aria-hidden="true">+</i>
        </summary>
        <div>
          <p>{{ item.answer }}</p>
        </div>
      </details>
    </div>

    <div v-else class="faq-content__state">
      <span aria-hidden="true">?</span>
      <h2>لا توجد أسئلة منشورة حاليًا</h2>
    </div>
  </div>
</template>

<style scoped>
.faq-content__heading {
  margin-bottom: 34px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--home-v2-line);
}

.faq-content__heading > span {
  color: var(--home-v2-coral);
  font-size: 10px;
  font-weight: 900;
}

.faq-content__heading h2 {
  margin: 7px 0;
  color: var(--home-v2-ink);
  font: 900 clamp(25px, 3vw, 36px) / 1.45 var(--home-v2-heading);
}

.faq-content__heading p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 13px;
  line-height: 1.9;
}

.faq-content__list {
  display: grid;
  gap: 12px;
}

.faq-content__list details {
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
}

.faq-content__list details[open] {
  border-color: color-mix(in srgb, var(--home-v2-blue) 35%, var(--home-v2-line));
  background: var(--home-v2-surface-raised);
}

.faq-content__list summary {
  display: grid;
  min-height: 72px;
  grid-template-columns: 38px minmax(0, 1fr) 30px;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  color: var(--home-v2-ink);
  cursor: pointer;
  list-style: none;
}

.faq-content__list summary::-webkit-details-marker { display: none; }

.faq-content__list summary > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  background: color-mix(in srgb, var(--home-v2-blue) 10%, var(--home-v2-surface));
  color: var(--home-v2-blue);
  font-size: 9px;
  font-weight: 900;
}

.faq-content__list summary b {
  font: 800 14px/1.7 var(--home-v2-heading);
}

.faq-content__list summary i {
  color: var(--home-v2-blue);
  font-size: 23px;
  font-style: normal;
  text-align: center;
  transition: transform .2s ease;
}

.faq-content__list details[open] summary i { transform: rotate(45deg); }

.faq-content__list details > div {
  padding: 0 72px 22px 58px;
}

.faq-content__list details p {
  margin: 0;
  color: var(--home-v2-muted);
  font-size: 14px;
  line-height: 2;
}

.faq-content__loading,
.faq-content__state {
  display: grid;
  min-height: 300px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--home-v2-muted);
  text-align: center;
}

.faq-content__loading span {
  width: 100%;
  height: 66px;
  background: linear-gradient(90deg, var(--home-v2-cream), var(--home-v2-surface-raised), var(--home-v2-cream));
  background-size: 200% 100%;
  animation: faq-loading 1.2s linear infinite;
}

.faq-content__state > span {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, var(--home-v2-surface));
  color: var(--home-v2-blue);
  font-weight: 900;
}

.faq-content__state h2,
.faq-content__state p,
.faq-content__loading p { margin: 0; }

.faq-content__state button {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  background: var(--home-v2-blue);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-weight: 900;
}

@keyframes faq-loading { to { background-position: -200% 0; } }

@media (max-width: 560px) {
  .faq-content__list summary {
    grid-template-columns: 30px minmax(0, 1fr) 24px;
    gap: 10px;
    padding: 10px 12px;
  }

  .faq-content__list summary > span {
    width: 28px;
    height: 28px;
  }

  .faq-content__list details > div {
    padding: 0 52px 18px 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-content__loading span { animation: none; }
}
</style>
