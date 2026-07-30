<script setup lang="ts">
const faqs = [
  {
    question: 'الموقع مناسب لأنهي صفوف؟',
    answer: 'المنصة مخصصة لطلاب أولى وثانية وثالثة ثانوي، وكل صف له مساره المستقل.',
  },
  {
    question: 'إيه المحتوى المتاح حاليًا؟',
    answer: 'المتاح حاليًا كورس تأسيسي مجاني وكورس الشهر الأول لثالثة ثانوي، ويضم 18 فيديو و5 ملفات ورقية.',
  },
  {
    question: 'أقدر أذاكر من الموبايل؟',
    answer: 'نعم، تقدر تستخدم الموقع أو تحمّل التطبيق من روابط Android وiPhone.',
  },
  {
    question: 'إنشاء الحساب شغال؟',
    answer: 'في العرض الحالي تقدر تجرّب الخطوات وتدخل مساحة الطالب بدون حفظ أو إرسال أي بيانات.',
  },
  {
    question: 'فين المذكرات؟',
    answer: 'صفحة المذكرات تعرض منتجات مستقلة لكل صف؛ تقدر تختار نسخة مطبوعة أو تشاهد تجربة القراءة الرقمية داخل التطبيق.',
  },
] as const
</script>

<template>
  <section id="faq" class="section faq-section">
    <div class="container faq-grid">
      <div class="faq-title" data-motion-reveal="up">
        <span class="section-tag">عندك سؤال؟</span>
        <h2>
          الإجابة<br />
          <em>ببساطة.</em>
        </h2>
        <p>اختار صفك الأول، وهتلاقي الكورسات والمذكرات المناسبة ليك من غير خلط.</p>
        <a href="https://wa.me/201507659697" target="_blank" rel="noreferrer">اسألنا على واتساب ←</a>
      </div>

      <div class="faq-list" data-motion-reveal="side" data-motion-order="1">
        <details v-for="(faq, index) in faqs" :key="faq.question" :open="index === 0">
          <summary>
            {{ faq.question }} <span aria-hidden="true">+</span>
          </summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  background: #fff;
}

.faq-grid {
  display: grid;
  grid-template-columns: 0.65fr 1.35fr;
  gap: 120px;
}

.faq-title h2 {
  margin: 14px 0 0;
  font: 900 clamp(38px, 4.1vw, 58px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
}

.faq-title h2 em {
  color: var(--coral);
  font-style: normal;
}

.faq-title p {
  color: var(--muted-copy);
  font-size: 16px;
  line-height: 1.8;
}

.faq-title > a {
  display: inline-block;
  margin-top: 12px;
  color: var(--coral);
  font-weight: 800;
}

.faq-list details {
  padding: 0;
  border-bottom: 1px solid var(--line);
}

.faq-list summary {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 0;
  cursor: pointer;
  font: 800 17px var(--heading);
  list-style: none;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary span {
  color: var(--coral);
  font-size: 22px;
  transition: transform 0.24s ease;
}

.faq-list details[open] summary span {
  transform: rotate(45deg) scale(1.05);
}

.faq-list details p {
  max-width: 700px;
  margin: 0;
  padding: 0 0 26px;
  color: var(--muted-copy);
  font-size: 16px;
  line-height: 1.9;
}

:global(html[data-theme='dark']) .faq-section {
  background: var(--dark-bg);
}

:global(html[data-theme='dark']) .faq-list details {
  border-color: var(--dark-line);
}

@media (max-width: 900px) {
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }
}

@media (max-width: 620px) {
  .faq-title h2 {
    font-size: 38px;
  }
}
</style>
