<template>
  <section id="about" class="section home-v2-story" aria-labelledby="home-v2-story-title">
    <div class="container home-v2-story__grid">
      <div class="home-v2-story__visual">
        <span aria-hidden="true">“</span>
        <p>التعلّم الفعّال يبدأ من فهم الفكرة وطريقة استخدامها، وليس من الحفظ وحده.</p>
        <div><strong>EduHub</strong><small>منصة تعليمية منظمة</small></div>
      </div>
      <div>
        <span class="section-tag">عن المنصة</span>
        <h2 id="home-v2-story-title">تجربة تعليمية <em>أوضح.</em></h2>
        <p>
          هذا القسم يحافظ على مكان محتوى التعريف بالمدرس أو المنصة، إلى أن يتم اعتماد البيانات
          والنصوص الفعلية.
        </p>
        <ul>
          <li>محتوى مرتب حسب احتياج الطالب</li>
          <li>تطبيق ومراجعة بخطوات واضحة</li>
          <li>متابعة مستمرة لمسار التعلّم</li>
        </ul>
        <NuxtLink to="/aboutus">تعرّف على المنصة <span aria-hidden="true">←</span></NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-story {
  background: var(--home-v2-cream);
}

.home-v2-story__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(48px, 8vw, 100px);
}

.home-v2-story__visual {
  position: relative;
  display: grid;
  min-height: 410px;
  align-content: center;
  gap: 28px;
  padding: clamp(36px, 6vw, 68px);
  background: var(--home-v2-blue-light);
}

.home-v2-story__visual > span {
  position: absolute;
  top: 22px;
  inset-inline-end: 42px;
  color: var(--home-v2-blue);
  opacity: 0.35;
  font: 900 90px/1 Georgia, serif;
}

.home-v2-story__visual > p {
  max-width: 430px;
  margin: 0;
  font: 800 clamp(27px, 3vw, 40px) / 1.5 var(--home-v2-heading);
}

.home-v2-story__visual > div {
  display: grid;
  gap: 4px;
}

.home-v2-story__visual strong {
  color: var(--home-v2-blue);
  font: 900 30px var(--home-v2-heading);
}

.home-v2-story__visual small {
  color: var(--home-v2-muted);
}

.home-v2-story h2 {
  margin: 13px 0;
  font: 900 clamp(37px, 4.1vw, 58px) / 1.18 var(--home-v2-heading);
}

.home-v2-story h2 em {
  color: var(--home-v2-blue);
  font-style: normal;
}

.home-v2-story__grid > div:last-child > p {
  color: var(--home-v2-muted);
  line-height: 2;
}

.home-v2-story ul {
  display: grid;
  gap: 10px;
  margin: 25px 0;
  padding: 0;
  list-style: none;
}

.home-v2-story li {
  padding-inline-start: 22px;
  color: var(--home-v2-muted);
}

.home-v2-story li::before {
  position: absolute;
  margin-inline-start: -20px;
  color: var(--home-v2-blue);
  content: '✓';
  font-weight: 900;
}

.home-v2-story a {
  color: var(--home-v2-blue);
  font-weight: 800;
}

@media (max-width: 760px) {
  .home-v2-story__grid {
    grid-template-columns: 1fr;
  }
}
</style>
