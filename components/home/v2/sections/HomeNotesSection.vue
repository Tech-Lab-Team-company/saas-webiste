<template>
  <section id="notes" class="section home-v2-notes" aria-labelledby="home-v2-notes-title">
    <div class="container">
      <div class="home-v2-notes__heading">
        <div>
          <span class="section-tag">مكتبة مستقلة</span>
          <h2 id="home-v2-notes-title">اختار مذكرتك<br />على حسب <em>احتياجك.</em></h2>
        </div>
        <p>سيظهر هنا محتوى المكتبة عندما تتوفر واجهة بيانات ومسار فعليان لها في التطبيق.</p>
      </div>

      <article class="home-v2-notes__feature">
        <div class="home-v2-notes__cover" aria-hidden="true">
          <span>NOTES</span>
          <strong>مكتبة EduHub</strong>
          <small>محتوى قيد الربط</small>
        </div>
        <div class="home-v2-notes__copy">
          <span>قسم جاهز للربط</span>
          <h3>المذكرات ستظهر هنا بعد اعتماد مصدر بياناتها.</h3>
          <p>
            لا توجد حاليًا صفحة أو API للمكتبة في التطبيق، لذلك لا تعرض المعاينة أي منتج أو سعر
            غير حقيقي.
          </p>
          <span class="home-v2-disabled-action" aria-disabled="true">رابط المذكرات غير متاح حاليًا</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-v2-notes {
  background: #eef4ff;
}

.home-v2-notes__heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 60px;
  margin-bottom: 38px;
}

.home-v2-notes h2 {
  margin: 12px 0 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.2 var(--home-v2-heading);
}

.home-v2-notes h2 em {
  color: var(--home-v2-coral);
  font-style: normal;
}

.home-v2-notes__heading > p {
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

.home-v2-notes__feature {
  display: grid;
  min-height: 370px;
  grid-template-columns: minmax(250px, 0.72fr) minmax(0, 1.28fr);
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 30px 80px -62px #06114799;
}

.home-v2-notes__cover {
  display: grid;
  align-content: end;
  gap: 12px;
  padding: 34px;
  background:
    linear-gradient(135deg, transparent 49%, #ffffff16 50%),
    var(--home-v2-deep);
  color: #fff;
}

.home-v2-notes__cover span {
  color: #90c6ff;
  font: 900 12px var(--home-v2-heading);
  letter-spacing: 0.12em;
}

.home-v2-notes__cover strong {
  font: 900 clamp(27px, 3vw, 40px) / 1.25 var(--home-v2-heading);
}

.home-v2-notes__cover small {
  color: #ffffffb8;
}

.home-v2-notes__copy {
  display: grid;
  align-content: center;
  gap: 16px;
  padding: clamp(28px, 5vw, 65px);
}

.home-v2-notes__copy > span:first-child {
  color: var(--home-v2-blue);
  font-size: 12px;
  font-weight: 900;
}

.home-v2-notes h3 {
  max-width: 650px;
  margin: 0;
  font: 900 clamp(27px, 3.4vw, 42px) / 1.35 var(--home-v2-heading);
}

.home-v2-notes__copy p {
  max-width: 680px;
  margin: 0;
  color: var(--home-v2-muted);
  line-height: 1.9;
}

@media (max-width: 760px) {
  .home-v2-notes__heading,
  .home-v2-notes__feature {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-v2-notes__cover {
    min-height: 230px;
  }
}
</style>
