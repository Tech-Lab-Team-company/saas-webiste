<script setup lang="ts">
import type { HomeSiteViewModel } from '~/features/HomePageFeature/models/HomePageViewModel'

const props = defineProps<{
  site: HomeSiteViewModel
}>()

const headerDescription = computed(() => {
  const description = (props.site.description || 'منصة تعليمية منظمة').replace(/\s+/g, ' ').trim()
  const limit = 64

  return description.length > limit
    ? `${description.slice(0, limit).trimEnd()}…`
    : description
})

const navItems = [
  { label: 'الكورسات', to: '/course' },
  { label: 'المدونة', to: '/blogs' },
  { label: 'عن المنصة', to: '/aboutus' },
] as const
</script>

<template>
  <header class="home-v2-header">
    <div class="container home-v2-header__content">
      <NuxtLink to="/" class="home-v2-header__brand" :aria-label="`العودة إلى صفحة ${site.brandName || 'المنصة'}`">
        <span :class="['home-v2-header__logo', { 'home-v2-temporary-asset': !site.logo }]">
          <NuxtImg :src="site.logo?.src || '/images/logo.png'" :alt="site.logo?.alt || site.brandName || ''" width="163" height="52" loading="eager" />
        </span>
        <span>
          <b>{{ site.brandName || 'EduHub' }}</b>
          <small :title="site.description || undefined">{{ headerDescription }}</small>
        </span>
      </NuxtLink>

      <nav class="home-v2-header__nav" aria-label="التنقل الرئيسي">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span class="home-v2-nav-disabled" aria-disabled="true" title="لا توجد صفحة مكتبة في التطبيق حاليًا">
          المذكرات
        </span>
        <a href="#app-status">التطبيق</a>
      </nav>

      <div class="home-v2-header__actions">
        <NuxtLink to="/login" class="home-v2-header__login">دخول الطالب</NuxtLink>
        <NuxtLink to="/Auth/register" class="button">إنشاء حساب <span aria-hidden="true">←</span></NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.home-v2-header {
  position: absolute;
  top: 0;
  inset-inline: 0;
  z-index: 10;
  background: #fbfcfff2;
  border-bottom: 1px solid var(--home-v2-line);
  color: var(--home-v2-ink);
}

.home-v2-header__content,
.home-v2-header__brand,
.home-v2-header__nav,
.home-v2-header__actions {
  display: flex;
  align-items: center;
}

.home-v2-header__content {
  min-height: 86px;
  gap: 28px;
}

.home-v2-header__brand {
  min-width: 190px;
  gap: 10px;
}

.home-v2-header__logo {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--home-v2-line);
}

.home-v2-header__logo :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 7px;
}

.home-v2-header__brand > span:last-child {
  display: grid;
  min-width: 0;
  max-width: 220px;
  gap: 2px;
}

.home-v2-header__brand b {
  font: 900 17px/1 var(--home-v2-heading);
}

.home-v2-header__brand small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--home-v2-muted);
  font-size: 11px;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-header__nav {
  gap: 24px;
  margin-inline: auto;
  font-size: 14px;
  font-weight: 700;
}

.home-v2-header__nav a:hover,
.home-v2-header__login:hover {
  color: var(--home-v2-blue);
}

.home-v2-header__actions {
  gap: 18px;
  white-space: nowrap;
}

.home-v2-header__login {
  font-size: 14px;
  font-weight: 800;
}

@media (max-width: 980px) {
  .home-v2-header__nav {
    display: none;
  }
}

@media (max-width: 590px) {
  .home-v2-header__content {
    min-height: 76px;
    gap: 12px;
  }

  .home-v2-header__brand {
    min-width: 0;
  }

  .home-v2-header__brand small,
  .home-v2-header__login {
    display: none;
  }

  .home-v2-header__actions {
    margin-inline-start: auto;
  }
}
</style>
