<script setup lang="ts">
const navItems = [
  { label: 'الكورسات', to: '/courses' },
  { label: 'المذكرات', to: '/library' },
  { label: 'المدونة', to: '/blog' },
  { label: 'عن مستر إسلام', to: '/about' },
  { label: 'التطبيق', to: '/#app-status' },
] as const
</script>

<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <NuxtLink to="/#top" class="brand" aria-label="إسلام سلامة — الرئيسية">
        <span class="teacher-brand-mark" aria-hidden="true">
          <NuxtImg
            src="/eslam-salama-logo.webp"
            alt=""
            width="46"
            height="46"
            loading="eager"
          />
        </span>

        <span class="brand-copy">
          <b lang="en">Gamma Physics</b>
          <small>إسلام سلامة · مدرس الفيزياء للمرحلة الثانوية</small>
        </span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="التنقل الرئيسي">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="nav-actions">
        <NuxtLink to="/loginhome" class="login-link">دخول الطالب</NuxtLink>
        <NuxtLink to="/register" class="button button-small">
          إنشاء حساب <span aria-hidden="true">←</span>
        </NuxtLink>
      </div>

      <details class="mobile-menu">
        <summary aria-label="فتح القائمة">
          <i />
          <i />
          <i />
        </summary>

        <nav>
          <NuxtLink v-for="item in navItems" :key="`mobile-${item.to}`" :to="item.to">
            {{ item.label }}
          </NuxtLink>
          <NuxtLink to="/loginhome">دخول الطالب</NuxtLink>
          <NuxtLink to="/register">إنشاء حساب</NuxtLink>
        </nav>
      </details>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  background: #fbfcffe6;
  color: var(--ink);
  backdrop-filter: blur(14px);
}

.nav-wrap {
  display: flex;
  height: 92px;
  align-items: center;
  gap: 36px;
  border-bottom: 1px solid var(--line);
}

.brand {
  display: flex;
  min-width: 210px;
  align-items: center;
  gap: 11px;
}

.teacher-brand-mark {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
}

.teacher-brand-mark :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.brand b {
  font: 900 17px/1 var(--heading);
  letter-spacing: 0.04em;
}

.brand small {
  margin-top: 6px;
  color: #465c7a;
  font-size: 12px;
  white-space: nowrap;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-inline: auto;
}

.desktop-nav a,
.login-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: #465c7a;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.2s;
}

.desktop-nav a:hover,
.login-link:hover {
  color: var(--coral);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.mobile-menu {
  display: none;
  position: relative;
}

.mobile-menu summary {
  display: grid;
  width: 44px;
  height: 44px;
  place-content: center;
  gap: 5px;
  border: 1px solid var(--line);
  border-radius: 6px;
  cursor: pointer;
  list-style: none;
}

.mobile-menu summary::-webkit-details-marker {
  display: none;
}

.mobile-menu summary i {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
}

.mobile-menu nav {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  display: flex;
  width: min(290px, calc(100vw - 30px));
  flex-direction: column;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 20px 45px -26px #0206177d;
}

.mobile-menu nav a {
  padding: 11px 13px;
  border-radius: 6px;
  font-weight: 700;
}

.mobile-menu nav a:hover {
  background: #eef4ff;
}

:global(html[data-theme='dark']) .site-header {
  background: #081126e8;
}

:global(html[data-theme='dark']) .brand small,
:global(html[data-theme='dark']) .desktop-nav a,
:global(html[data-theme='dark']) .login-link {
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .mobile-menu nav {
  border-color: var(--dark-line);
  background: var(--dark-surface);
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .mobile-menu nav a:hover {
  background: var(--dark-surface-2);
}

@media (max-width: 980px) {
  .desktop-nav,
  .login-link {
    display: none;
  }

  .nav-actions {
    margin-inline-start: auto;
  }
}

@media (max-width: 620px) {
  .nav-wrap {
    height: 76px;
    gap: 14px;
  }

  .brand {
    min-width: 0;
  }

  .brand small {
    display: none;
  }

  .site-header .button-small {
    display: none;
  }

  .mobile-menu {
    display: block;
    margin-inline-start: auto;
  }
}
</style>
