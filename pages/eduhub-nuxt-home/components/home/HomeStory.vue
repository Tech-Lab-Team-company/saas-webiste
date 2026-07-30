<script setup lang="ts">
const highlights = [
  'شرح مبسّط للمفاهيم والقوانين',
  'تطبيق واختبارات بصورة دورية',
  'متابعة منظمة للطالب',
] as const
</script>

<template>
  <section id="about" class="section story">
    <div class="container story-grid">
      <div class="story-visual" data-motion-reveal="scale">
        <div class="quote-mark" aria-hidden="true">“</div>
        <p>الفيزياء مش قوانين للحفظ؛ الفهم يبدأ من معنى القانون وطريقة استخدامه في المسألة.</p>
        <div class="metric">
          <strong>20+</strong>
          <span>سنة خبرة في<br />تدريس الفيزياء</span>
        </div>
      </div>

      <div class="story-copy" data-motion-reveal="side" data-motion-order="1">
        <span class="section-tag">عن مستر إسلام</span>
        <h2>خبرة تتجاوز <em>20 سنة.</em></h2>
        <p>
          إسلام سلامة مدرس فيزياء للمرحلة الثانوية، ويقدّم محتوى أولى وثانية وثالثة ثانوي
          تحت اسم Gamma Physics.
        </p>

        <ul>
          <li v-for="highlight in highlights" :key="highlight">{{ highlight }}</li>
        </ul>

        <NuxtLink to="/about" class="story-link">تعرف على مستر إسلام ←</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  background: var(--cream);
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 100px;
}

.story-visual {
  position: relative;
  display: flex;
  min-height: 480px;
  flex-direction: column;
  justify-content: center;
  padding: 80px 58px;
  background: var(--mint);
}

.story-visual::after {
  position: absolute;
  bottom: -26px;
  left: -26px;
  width: 95px;
  height: 95px;
  border: 12px solid var(--coral);
  content: '';
}

.quote-mark {
  position: absolute;
  top: 30px;
  right: 48px;
  color: var(--teal);
  opacity: 0.5;
  font: 900 90px/1 Georgia;
}

.story-visual > p {
  max-width: 410px;
  margin: 0;
  font: 800 clamp(28px, 3vw, 41px) / 1.55 var(--heading);
}

.metric {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 55px;
}

.metric strong {
  color: var(--coral);
  font: 900 43px var(--heading);
}

.metric span {
  color: #5f777b;
  font-size: 12px;
  line-height: 1.5;
}

.story-copy h2 {
  margin: 14px 0 0;
  font: 900 clamp(38px, 4.1vw, 58px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
}

.story-copy h2 em {
  color: var(--coral);
  font-style: normal;
}

.story-copy > p {
  color: var(--muted-copy);
  font-size: 16px;
  line-height: 2;
}

.story-copy ul {
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.story-copy li {
  position: relative;
  padding: 14px 30px 14px 0;
  border-bottom: 1px solid var(--line);
  font-weight: 700;
}

.story-copy li::before {
  position: absolute;
  right: 0;
  color: var(--coral);
  content: '✓';
}

.story-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-top: 24px;
  color: var(--coral);
  font-weight: 800;
}

:global(html[data-theme='dark']) .story {
  background: #050b1c;
}

:global(html[data-theme='dark']) .story-visual {
  background: var(--dark-surface-3);
}

:global(html[data-theme='dark']) .metric span {
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .story-copy li {
  border-color: var(--dark-line);
}

@media (max-width: 900px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 70px;
  }
}

@media (max-width: 620px) {
  .story-grid {
    gap: 50px;
  }

  .story-visual {
    min-height: 400px;
    padding: 64px 28px;
  }

  .story-visual::after {
    width: 70px;
    height: 70px;
    border-width: 9px;
  }

  .story-copy h2 {
    font-size: 38px;
  }
}
</style>
