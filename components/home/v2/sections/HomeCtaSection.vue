<template>
  <section class="home-v2-cta" aria-labelledby="home-v2-cta-title">
    <div class="container">
      <div class="home-v2-cta__panel">
        <span>جاهز تبدأ؟</span>
        <h2 id="home-v2-cta-title">اختار مسارك،<br /><em>وابدأ بخطوة واضحة.</em></h2>
        <p>الصفحة الجديدة ما زالت في وضع المعاينة، بينما يظل مسار التسجيل والكورسات الحالي متاحًا.</p>
        <div>
          <a class="button" href="#courses">استكشف المسارات <span aria-hidden="true">←</span></a>
          <NuxtLink to="/Auth/register">أنشئ حسابك</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-v2-cta {
  padding: 0 0 96px;
  background: var(--home-v2-cream);
}

.home-v2-cta__panel {
  position: relative;
  overflow: hidden;
  padding: clamp(48px, 8vw, 80px) 30px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 100% 0, #ffffff22 0 16%, transparent 16.4%),
    var(--home-v2-blue);
  color: #fff;
  text-align: center;
}

.home-v2-cta__panel > span {
  color: #d9ebff;
  font-size: 12px;
  font-weight: 900;
}

.home-v2-cta h2 {
  margin: 12px 0;
  font: 900 clamp(40px, 5vw, 66px) / 1.18 var(--home-v2-heading);
}

.home-v2-cta h2 em {
  color: #ffdb8b;
  font-style: normal;
}

.home-v2-cta p {
  max-width: 650px;
  margin: 0 auto;
  color: #ffffffd6;
  line-height: 1.9;
}

.home-v2-cta__panel > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 25px;
}

.home-v2-cta .button {
  background: #fff;
  color: var(--home-v2-deep);
}

.home-v2-cta .button:hover {
  background: #edf5ff;
}

.home-v2-cta__panel > div > a:last-child {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid #ffffffa6;
  font-weight: 800;
}
</style>
