<script setup lang="ts">
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'

const props = defineProps<{
  site: HomeSiteViewModel
}>()

const whatsappUrl = computed(() => {
  const value = props.site.socials.whatsapp
  if (!value || value.startsWith('http')) return value
  return `https://wa.me/${value.replace(/\D/g, '').replace(/^0/, '20')}`
})
</script>

<template>
  <footer class="home-v2-footer">
    <div class="container home-v2-footer__grid">
      <div>
        <NuxtLink to="/" class="home-v2-footer__brand">
          <span :class="['home-v2-footer__logo', { 'home-v2-temporary-asset': !site.logo }]">
            <NuxtImg :src="site.logo?.src || '/images/logo.png'" :alt="site.logo?.alt || site.brandName || ''" width="163" height="52" loading="lazy" />
          </span>
          <span><b>{{ site.brandName || 'EduHub' }}</b><small>{{ site.description || 'منصة تعليمية منظمة' }}</small></span>
        </NuxtLink>
        <p>{{ site.description || 'منصة تعليمية منظمة تساعد الطلاب على التعلّم بخطوات واضحة.' }}</p>
        <div class="home-v2-footer__contacts">
          <a v-if="site.phone" :href="`tel:${site.phone}`">{{ site.phone }}</a>
          <a v-if="site.email" :href="`mailto:${site.email}`">{{ site.email }}</a>
          <span v-if="site.address">{{ site.address }}</span>
        </div>
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
        <a v-if="site.app.androidUrl" :href="site.app.androidUrl" target="_blank" rel="noopener">تطبيق Android</a>
        <a v-if="site.app.iosUrl" :href="site.app.iosUrl" target="_blank" rel="noopener">تطبيق iPhone</a>
        <a v-if="site.socials.youtube" :href="site.socials.youtube" target="_blank" rel="noopener">YouTube</a>
        <a v-if="site.socials.facebook" :href="site.socials.facebook" target="_blank" rel="noopener">Facebook</a>
        <a v-if="site.socials.instagram" :href="site.socials.instagram" target="_blank" rel="noopener">Instagram</a>
        <a v-if="whatsappUrl" :href="whatsappUrl" target="_blank" rel="noopener">WhatsApp</a>
      </nav>
    </div>

    <div class="container home-v2-footer__bottom">
      <span>© {{ new Date().getFullYear() }} {{ site.brandName || 'EduHub' }}. جميع الحقوق محفوظة.</span>
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
  background: var(--home-v2-deep);
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

.home-v2-footer__contacts {
  display: grid;
  gap: 5px;
  margin-top: 12px;
  color: #ffffffbf;
  font-size: 13px;
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
