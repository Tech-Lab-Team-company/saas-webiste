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

const scrollProgress = ref(0)
const isScrolled = ref(false)
let progressFrame: number | null = null
let pageResizeObserver: ResizeObserver | null = null

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  const nextProgress = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0

  scrollProgress.value = Math.min(100, Math.max(0, nextProgress))
  isScrolled.value = window.scrollY > 18
}

const queueScrollProgressUpdate = () => {
  if (progressFrame !== null) return

  progressFrame = window.requestAnimationFrame(() => {
    updateScrollProgress()
    progressFrame = null
  })
}

onMounted(() => {
  updateScrollProgress()
  window.addEventListener('scroll', queueScrollProgressUpdate, { passive: true })
  window.addEventListener('resize', queueScrollProgressUpdate, { passive: true })

  pageResizeObserver = new ResizeObserver(queueScrollProgressUpdate)
  pageResizeObserver.observe(document.body)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueScrollProgressUpdate)
  window.removeEventListener('resize', queueScrollProgressUpdate)
  pageResizeObserver?.disconnect()

  if (progressFrame !== null) {
    window.cancelAnimationFrame(progressFrame)
  }
})
</script>

<template>
  <header :class="['home-v2-header', { 'home-v2-header--scrolled': isScrolled }]">
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
    <span
      class="home-v2-header__progress-track"
      role="progressbar"
      aria-label="Home page reading progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(scrollProgress)"
    >
      <span
        class="home-v2-header__progress-value"
        :style="{ transform: `scaleX(${scrollProgress / 100})` }"
      />
    </span>
  </header>
</template>

<style scoped>
.home-v2-header {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
  background: rgb(251 252 255 / 92%);
  border-bottom: 1px solid var(--home-v2-line);
  box-shadow: 0 4px 20px rgb(10 24 70 / 5%);
  backdrop-filter: blur(14px);
  color: var(--home-v2-ink);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.home-v2-header--scrolled {
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 12px 38px rgb(8 27 58 / 12%);
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
  gap: clamp(16px, 2vw, 30px);
  transition: min-height 0.25s ease;
}

.home-v2-header--scrolled .home-v2-header__content {
  min-height: 72px;
}

.home-v2-header__brand {
  min-width: 210px;
  gap: 12px;
}

.home-v2-header__logo {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  overflow: hidden;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--home-v2-blue) 22%, transparent),
    0 8px 22px rgb(8 27 58 / 14%);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.home-v2-header__brand:hover .home-v2-header__logo {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue) 18%, transparent),
    0 10px 24px rgb(8 27 58 / 18%);
  transform: translateY(-1px);
}

.home-v2-header__logo :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.home-v2-header__progress-track {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 6px;
  overflow: hidden;
  background: color-mix(in srgb, var(--home-v2-blue) 12%, transparent);
  pointer-events: none;
}

.home-v2-header__progress-value {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px 0 0 999px;
  background: var(--home-v2-blue);
  box-shadow: 0 0 12px color-mix(in srgb, var(--home-v2-blue) 55%, transparent);
  transform-origin: right center;
  will-change: transform;
}

.home-v2-header__brand > span:last-child {
  display: grid;
  min-width: 0;
  max-width: 220px;
  gap: 5px;
}

.home-v2-header__brand b {
  overflow: hidden;
  color: var(--home-v2-ink);
  font: 900 17px/1.15 var(--home-v2-heading);
  letter-spacing: -0.015em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-v2-header__brand small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--home-v2-muted);
  font-size: 10.5px;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-v2-header__nav {
  gap: 3px;
  margin-inline: auto;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 9%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--home-v2-blue) 4%, white);
  font-size: 14px;
  font-weight: 700;
}

.home-v2-header__nav a,
.home-v2-header__nav .home-v2-nav-disabled {
  position: relative;
  padding: 8px 13px;
  border-radius: 999px;
  line-height: 1.2;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.home-v2-header__nav a:hover,
.home-v2-header__login:hover {
  color: var(--home-v2-blue);
}

.home-v2-header__nav a:hover,
.home-v2-header__nav a.router-link-active {
  background: #fff;
  box-shadow: 0 3px 12px rgb(8 27 58 / 8%);
}

.home-v2-header__actions {
  gap: 14px;
  white-space: nowrap;
}

.home-v2-header__login {
  position: relative;
  padding: 8px 2px;
  font-size: 14px;
  font-weight: 800;
  transition: color 0.2s ease;
}

.home-v2-header__login::after {
  position: absolute;
  right: 0;
  bottom: 3px;
  left: 0;
  height: 2px;
  border-radius: 99px;
  background: var(--home-v2-blue);
  content: '';
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.home-v2-header__login:hover::after {
  transform: scaleX(1);
}

.home-v2-header .button {
  min-height: 46px;
  padding-inline: 20px;
  border: 1px solid color-mix(in srgb, var(--home-v2-blue) 78%, white);
  border-radius: 12px;
  box-shadow: 0 9px 22px color-mix(in srgb, var(--home-v2-blue) 22%, transparent);
}

.home-v2-header .button span {
  transition: transform 0.2s ease;
}

.home-v2-header .button:hover span {
  transform: translateX(-3px);
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

  .home-v2-header__brand > span:last-child {
    max-width: 130px;
  }

  .home-v2-header__brand b {
    font-size: 15px;
  }

  .home-v2-header__brand small,
  .home-v2-header__login {
    display: none;
  }

  .home-v2-header__actions {
    margin-inline-start: auto;
  }

  .home-v2-header .button {
    min-height: 42px;
    padding-inline: 14px;
    border-radius: 10px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-v2-header,
  .home-v2-header__content,
  .home-v2-header__logo,
  .home-v2-header__nav a,
  .home-v2-header__login::after,
  .home-v2-header .button span {
    transition: none;
  }
}
</style>
