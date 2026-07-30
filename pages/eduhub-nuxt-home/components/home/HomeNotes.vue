<script setup lang="ts">
const noteFeatures = [
  'مستقلة عن الكورسات',
  'نسخة رقمية داخل التطبيق',
  'نسخة مطبوعة وتوصيل',
] as const
</script>

<template>
  <section id="notes" class="home-notes-section">
    <div class="container">
      <div class="home-editorial-heading" data-motion-reveal="up">
        <div>
          <span>مكتبة مستقلة</span>
          <h2>
            اختار مذكرتك.<br />
            على حسب <em>احتياجك.</em>
          </h2>
        </div>
        <p>كل مذكرة منتج مستقل عن الكورسات؛ شوف محتواها، اختار مطبوعة أو رقمية، وخد فقط اللي محتاجه.</p>
      </div>

      <article class="home-notes-feature" data-motion-reveal="scale" data-motion-order="1">
        <div class="home-notes-cover">
          <span>GAMMA NOTES 03</span>
          <strong>المذكرة الشاملة في الفيزياء</strong>
          <small>الصف الثالث الثانوي · 320 صفحة</small>
          <i>320<b>ج.م مطبوعة</b></i>
        </div>

        <div class="home-notes-copy">
          <span>مذكرة مستقلة · الصف الثالث الثانوي</span>
          <h3>شرح ومراجعة فيزياء الثانوية العامة</h3>
          <p>
            مرجع مستقل للعام الكامل يجمع شرح القوانين، أمثلة محلولة، أفكار الربط وملخصات
            المراجعة النهائية. تقدر تختارها وحدها بدون الاشتراك في أي كورس.
          </p>

          <ul>
            <li v-for="(feature, index) in noteFeatures" :key="feature">
              <b>{{ String(index + 1).padStart(2, '0') }}</b>
              {{ feature }}
            </li>
          </ul>

          <div>
            <NuxtLink to="/library/physics-secondary-3-complete-notes" class="home-notes-primary">
              تفاصيل المذكرة <span aria-hidden="true">←</span>
            </NuxtLink>
            <NuxtLink to="/library" class="home-notes-secondary">كل المذكرات</NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-notes-section {
  overflow: hidden;
  padding: 100px 0;
  background: #eef4ff;
}

.home-editorial-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.65fr);
  align-items: end;
  gap: clamp(38px, 7vw, 96px);
  margin-bottom: 38px;
}

.home-editorial-heading > div:first-child > span {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0867d4;
  font-size: 12px;
  font-weight: 900;
}

.home-editorial-heading > div:first-child > span::before {
  width: 29px;
  height: 2px;
  background: #ef7a63;
  content: '';
}

.home-editorial-heading h2 {
  margin: 11px 0 0;
  color: #081b3a;
  font: 900 clamp(39px, 4.2vw, 58px) / 1.24 var(--heading);
  letter-spacing: -0.035em;
}

.home-editorial-heading h2 em {
  color: #ef7a63;
  font-style: normal;
}

.home-editorial-heading > p {
  margin: 0;
  color: #4f617c;
  font-size: 16px;
  line-height: 1.9;
}

.home-notes-feature {
  display: grid;
  min-height: 510px;
  grid-template-columns: minmax(300px, 0.72fr) minmax(0, 1.28fr);
  overflow: hidden;
  border: 1px solid #0611471f;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 30px 80px -62px #06114799;
}

.home-notes-cover {
  position: relative;
  display: flex;
  min-height: 510px;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding: 34px;
  background: #061147;
  color: #fff;
}

.home-notes-cover::before,
.home-notes-cover::after {
  position: absolute;
  border: 1px solid #fff3;
  border-radius: 50%;
  content: '';
}

.home-notes-cover::before {
  top: -128px;
  left: -92px;
  width: 290px;
  height: 290px;
}

.home-notes-cover::after {
  top: -79px;
  left: -42px;
  width: 190px;
  height: 190px;
}

.home-notes-cover > * {
  position: relative;
  z-index: 1;
}

.home-notes-cover > span {
  margin-bottom: auto;
  font: 800 11px var(--heading);
  letter-spacing: 0.15em;
}

.home-notes-cover > strong {
  max-width: 320px;
  font: 900 clamp(28px, 3vw, 42px) / 1.3 var(--heading);
}

.home-notes-cover > small {
  margin-top: 10px;
  color: #ffffffc7;
  font-size: 13px;
}

.home-notes-cover > i {
  position: absolute;
  z-index: 2;
  bottom: 28px;
  left: 26px;
  display: grid;
  width: 82px;
  height: 82px;
  place-content: center;
  border-radius: 50%;
  background: #ef7a63;
  color: #fff;
  font: 900 28px/1 var(--heading);
  text-align: center;
}

.home-notes-cover > i b {
  display: block;
  margin-top: 5px;
  font-size: 10px;
}

.home-notes-copy {
  align-self: center;
  padding: clamp(42px, 6vw, 76px);
}

.home-notes-copy > span {
  color: #0867d4;
  font-size: 12px;
  font-weight: 900;
}

.home-notes-copy h3 {
  margin: 9px 0 13px;
  color: #081b3a;
  font: 900 clamp(29px, 3.3vw, 43px) / 1.35 var(--heading);
}

.home-notes-copy > p {
  max-width: 650px;
  margin: 0;
  color: #4f617c;
  font-size: 16px;
  line-height: 1.9;
}

.home-notes-copy ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 28px 0;
  padding: 0;
  border-block: 1px solid #dce5f3;
  list-style: none;
}

.home-notes-copy li {
  display: flex;
  min-height: 88px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 17px;
  color: #243a5c;
  font-size: 13px;
  font-weight: 800;
}

.home-notes-copy li + li {
  border-inline-start: 1px solid #dce5f3;
}

.home-notes-copy li b {
  color: #ef7a63;
  font-size: 11px;
}

.home-notes-copy > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 21px;
}

.home-notes-primary,
.home-notes-secondary {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 900;
}

.home-notes-primary {
  min-height: 52px;
  gap: 25px;
  padding: 0 20px;
  background: #0867d4;
  color: #fff;
}

.home-notes-secondary {
  min-height: 44px;
  border-bottom: 1px solid #061147;
  color: #061147;
}

:global(html[data-theme='dark']) .home-notes-section {
  background: var(--dark-bg);
}

:global(html[data-theme='dark']) .home-editorial-heading h2,
:global(html[data-theme='dark']) .home-notes-copy h3 {
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .home-editorial-heading > p,
:global(html[data-theme='dark']) .home-notes-copy > p {
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .home-notes-feature {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

:global(html[data-theme='dark']) .home-notes-copy ul,
:global(html[data-theme='dark']) .home-notes-copy li + li {
  border-color: var(--dark-line);
}

:global(html[data-theme='dark']) .home-notes-copy li,
:global(html[data-theme='dark']) .home-notes-secondary {
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .home-notes-secondary {
  border-color: var(--dark-text);
}

@media (max-width: 900px) {
  .home-notes-section {
    padding: 78px 0;
  }

  .home-notes-feature {
    grid-template-columns: minmax(270px, 0.8fr) 1.2fr;
  }

  .home-notes-copy {
    padding: 38px 30px;
  }

  .home-notes-copy ul {
    grid-template-columns: 1fr;
  }

  .home-notes-copy li {
    min-height: 64px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .home-notes-copy li + li {
    border-top: 1px solid #dce5f3;
    border-inline-start: 0;
  }
}

@media (max-width: 680px) {
  .home-editorial-heading {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .home-editorial-heading h2 {
    font-size: 38px;
  }

  .home-notes-feature {
    grid-template-columns: 1fr;
  }

  .home-notes-cover {
    min-height: 390px;
    padding: 25px;
  }

  .home-notes-cover > i {
    bottom: 22px;
    left: 20px;
    width: 72px;
    height: 72px;
    font-size: 24px;
  }

  .home-notes-copy {
    padding: 32px 22px 36px;
  }

  .home-notes-copy h3 {
    font-size: 29px;
  }

  .home-notes-copy > p {
    font-size: 15px;
  }

  .home-notes-copy > div {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .home-notes-primary,
  .home-notes-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
