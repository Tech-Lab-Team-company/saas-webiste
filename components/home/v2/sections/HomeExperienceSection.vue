<template>
  <section class="section home-v2-experience" aria-labelledby="home-v2-experience-title">
    <div class="container home-v2-experience__grid">
      <div>
        <span class="section-tag">تجربة تعلّم منظمة</span>
        <h2 id="home-v2-experience-title">خطة واضحة من البداية <em>لحد المراجعة.</em></h2>
        <p>أساس التصميم: محتوى منظم، خطوات مفهومة، ومسار واضح للطالب.</p>
        <NuxtLink to="/course" class="home-v2-experience__link">استعرض الكورسات الحالية <span aria-hidden="true">←</span></NuxtLink>
      </div>

      <div class="home-v2-experience__benefits">
        <article><b>01</b><div><h3>شرح مبسّط</h3><p>الفكرة والقانون بخطوات مرتبة وواضحة.</p></div></article>
        <article><b>02</b><div><h3>تطبيق مستمر</h3><p>مسائل متدرجة تساعد على تثبيت الفكرة.</p></div></article>
        <article><b>03</b><div><h3>اختبارات دورية</h3><p>محطات مراجعة تقيس الاستيعاب أثناء التعلّم.</p></div></article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-experience {
  background: var(--home-v2-deep);
  color: #fff;
}

.home-v2-experience__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: clamp(48px, 8vw, 120px);
}

.home-v2-experience .section-tag {
  color: #b6d6ff;
}

.home-v2-experience h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-experience h2 em {
  color: #8fc6ff;
  font-style: normal;
}

.home-v2-experience > div > div > p {
  color: #ffffffc4;
  line-height: 1.9;
}

.home-v2-experience__link {
  display: inline-flex;
  gap: 9px;
  margin-top: 14px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ffffff99;
  font-weight: 800;
}

.home-v2-experience__benefits article {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 18px;
  padding: 22px 0;
  border-bottom: 1px solid #ffffff2b;
}

.home-v2-experience__benefits b {
  color: #ffcf63;
  font: 900 12px var(--home-v2-heading);
}

.home-v2-experience h3,
.home-v2-experience p {
  margin: 0;
}

.home-v2-experience h3 {
  font: 800 23px var(--home-v2-heading);
}

.home-v2-experience__benefits p {
  margin-top: 5px;
  color: #ffffffb8;
}

@media (max-width: 760px) {
  .home-v2-experience__grid {
    grid-template-columns: 1fr;
  }
}
</style>
