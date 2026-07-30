<script setup lang="ts">
const faqs = [
  { question: 'كيف أبدأ؟', answer: 'اختار القسم أو الكورس المناسب من صفحة الكورسات الحالية.' },
  { question: 'هل أقدر أتابع من الموبايل؟', answer: 'سيتم ربط روابط التطبيق المعتمدة من إعدادات الموقع لاحقًا.' },
  { question: 'أين المذكرات؟', answer: 'لا توجد حاليًا صفحة مكتبة أو API معتمد لها في التطبيق.' },
] as const
</script>

<template>
  <section class="section home-v2-faq" aria-labelledby="home-v2-faq-title">
    <div class="container home-v2-faq__grid">
      <div>
        <span class="section-tag">عندك سؤال؟</span>
        <h2 id="home-v2-faq-title">الإجابة<br /><em>ببساطة.</em></h2>
        <p>محتوى الأسئلة الحالية مؤقت، وسيُراجع عند اعتماد بيانات V2 النهائية.</p>
      </div>
      <div class="home-v2-faq__list">
        <details v-for="(faq, index) in faqs" :key="faq.question" :open="index === 0">
          <summary>{{ faq.question }} <span aria-hidden="true">+</span></summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-faq {
  background: #fff;
}

.home-v2-faq__grid {
  display: grid;
  grid-template-columns: 0.65fr 1.35fr;
  gap: clamp(48px, 8vw, 120px);
}

.home-v2-faq h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-faq h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-faq__grid > div:first-child > p {
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-faq details {
  border-bottom: 1px solid var(--home-v2-line);
}

.home-v2-faq summary {
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 0;
  cursor: pointer;
  font: 800 17px var(--home-v2-heading);
  list-style: none;
}

.home-v2-faq summary::-webkit-details-marker {
  display: none;
}

.home-v2-faq summary span {
  color: var(--home-v2-blue);
  font-size: 22px;
}

.home-v2-faq details[open] summary span {
  transform: rotate(45deg);
}

.home-v2-faq details p {
  max-width: 680px;
  margin: 0;
  padding-bottom: 22px;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

@media (max-width: 760px) {
  .home-v2-faq__grid {
    grid-template-columns: 1fr;
  }
}
</style>
