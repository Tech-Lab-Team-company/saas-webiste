<script setup lang="ts">
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'

defineProps<{
  site: HomeSiteViewModel
}>()
</script>

<template>
  <footer class="home-v2-footer">
    <div class="container home-v2-footer__grid">
      <div>
        <NuxtLink to="/" class="home-v2-footer__brand">
          <span class="home-v2-footer__logo home-v2-temporary-asset" aria-hidden="true">
            <NuxtImg src="/images/logo.png" alt="" width="163" height="52" loading="lazy" />
          </span>
          <span><b>EduHub</b><small>معاينة الصفحة الرئيسية الجديدة</small></span>
        </NuxtLink>
        <p>واجهة V2 معزولة للتطوير. ستُربط معلومات التواصل والتطبيق والشبكات الاجتماعية بإعدادات الموقع لاحقًا.</p>
      </div>

      <nav aria-label="روابط المنصة">
        <b>استكشف</b>
        <NuxtLink to="/course">الكورسات</NuxtLink>
        <NuxtLink to="/blogs">المدونة</NuxtLink>
        <NuxtLink to="/aboutus">عن المنصة</NuxtLink>
        <span class="home-v2-nav-disabled" aria-disabled="true">المذكرات غير متاحة حاليًا</span>
      </nav>

      <nav aria-label="روابط الطالب">
        <b>مساحة الطالب</b>
        <NuxtLink to="/login">تسجيل الدخول</NuxtLink>
        <NuxtLink to="/Auth/register">إنشاء حساب</NuxtLink>
        <span class="home-v2-nav-disabled" aria-disabled="true">روابط التطبيق قيد الربط</span>
      </nav>
    </div>

    <div class="container home-v2-footer__bottom">
      <span>© {{ new Date().getFullYear() }} EduHub. جميع الحقوق محفوظة.</span>
      <nav aria-label="السياسات القانونية">
        <NuxtLink to="/privacy">سياسة الخصوصية</NuxtLink>
        <NuxtLink to="/terms">الشروط والأحكام</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.home-v2-footer {
  padding-top: 68px;
  background: #102e36;
  color: #fff;
}

.home-v2-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(36px, 8vw, 100px);
  padding-bottom: 52px;
}

.home-v2-footer__brand {
  display: flex;
  align-items: center;
  gap: 11px;
}

.home-v2-footer__logo {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
}

.home-v2-footer__logo :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 7px;
}

.home-v2-footer__brand > span:last-child {
  display: grid;
  gap: 2px;
}

.home-v2-footer__brand b,
.home-v2-footer__grid nav > b {
  font: 900 17px var(--home-v2-heading);
}

.home-v2-footer__brand small,
.home-v2-footer p,
.home-v2-footer__grid nav a,
.home-v2-footer__grid nav span {
  color: #ffffffbf;
}

.home-v2-footer p {
  max-width: 490px;
  margin: 20px 0 0;
  line-height: 1.9;
}

.home-v2-footer__grid nav {
  display: grid;
  align-content: start;
  gap: 12px;
}

.home-v2-footer__grid nav > b {
  margin-bottom: 7px;
  color: #fff;
}

.home-v2-footer__grid nav a:hover {
  color: #8fc6ff;
}

.home-v2-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #ffffff24;
  color: #ffffffa8;
  font-size: 13px;
}

.home-v2-footer__bottom nav {
  display: flex;
  gap: 18px;
}

@media (max-width: 760px) {
  .home-v2-footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
