<script setup lang="ts">
import { resolveStudentIdentity } from "~/utils/studentIdentity";

const userStore = useUserStore();
const studentIdentity = computed(() => resolveStudentIdentity(userStore.user));
const yearLabel = computed(() => {
  const info = userStore.user?.userInfo;
  return (
    info?.year_title ||
    info?.stage_title ||
    info?.university_title ||
    "مستواك الدراسي"
  );
});
</script>

<template>
  <div class="prfile-home profile-dashboard profilecourse-dashboard">
    <ProfileSidebar class="profile-dashboard-sidebar" />

    <div class="profile-dashboard-workspace">
      <header class="profile-dashboard-topbar profilecourse-topbar">
        <nav class="profilecourse-breadcrumb" aria-label="مسار الصفحة">
          <NuxtLink :to="{ name: 'student-dashboard' }">
            <i class="pi pi-home" aria-hidden="true" />
            الرئيسية
          </NuxtLink>
          <i class="pi pi-chevron-left" aria-hidden="true" />
          <strong>مشترياتي</strong>
        </nav>

        <NuxtLink class="profilecourse-topbar-action" :to="{ name: 'profilecourse' }">
          <i class="pi pi-plus" aria-hidden="true" />
          استكشف المحتوى
        </NuxtLink>
      </header>

      <main
        id="profilecourse-content"
        class="profile-dashboard-main profilecourse-main"
      >
        <header class="profilecourse-intro">
          <div class="profilecourse-intro__copy">
            <span>
              <i class="pi pi-folder-open" aria-hidden="true" />
              مكتبة {{ studentIdentity.firstName || "الطالب" }}
            </span>
            <h1 id="profilecourse-title">مشترياتي</h1>
            <p>كل محتواك في مكان واحد · {{ yearLabel }}</p>
          </div>

          <nav
            class="profilecourse-shortcuts"
            aria-label="وصول سريع للمحتوى"
          >
            <NuxtLink :to="{ name: 'profilecourse' }">
              <i class="pi pi-play-circle" aria-hidden="true" />
              الكورسات
            </NuxtLink>
            <!-- <NuxtLink to="/books">
              <i class="pi pi-book" aria-hidden="true" />
              الكتب
            </NuxtLink>
            <NuxtLink to="/questions">
              <i class="pi pi-file-edit" aria-hidden="true" />
              التدريبات
            </NuxtLink> -->
          </nav>
        </header>

        <section
          id="purchases-library"
          class="purchases-container profile-purchases-library"
          aria-label="مكتبة المشتريات"
        >
          <ProfileMyPurchasesLibrary />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profilecourse-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--profile-muted);
  font-size: 11px;
}

.profilecourse-breadcrumb > a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--profile-muted);
  text-decoration: none;
  transition: color 180ms ease;
}

.profilecourse-breadcrumb > a:hover,
.profilecourse-breadcrumb > a:focus-visible {
  color: var(--profile-secondary);
  outline: 0;
}

.profilecourse-breadcrumb > i {
  font-size: 7px;
  opacity: 0.55;
}

.profilecourse-breadcrumb > strong {
  color: var(--profile-ink);
  font-size: 12px;
}

.profilecourse-topbar-action {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: 10px;
  background: var(--profile-action);
  color: var(--profile-on-action);
  font-size: 9px;
  font-weight: 900;
  text-decoration: none;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.profilecourse-topbar-action:hover,
.profilecourse-topbar-action:focus-visible {
  box-shadow: 0 8px 20px
    color-mix(in srgb, var(--profile-secondary) 18%, transparent);
  outline: 0;
  transform: translateY(-1px);
}

.profilecourse-main {
  width: min(1240px, calc(100% - 48px));
  padding: 22px 0 64px;
}

.profilecourse-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 14px;
  padding: 18px 20px;
  border: 1px solid var(--profile-border);
  border-radius: 17px;
  background: var(--profile-surface);
  box-shadow: 0 10px 28px
    color-mix(in srgb, var(--profile-primary) 5%, transparent);
}

.profilecourse-intro__copy {
  min-width: 0;
}

.profilecourse-intro__copy > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--profile-secondary);
  font-size: 9px;
  font-weight: 900;
}

.profilecourse-intro h1 {
  margin: 3px 0 0;
  color: var(--profile-ink);
  font-size: clamp(24px, 3vw, 31px);
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1.35;
}

.profilecourse-intro p {
  margin: 1px 0 0;
  color: var(--profile-muted);
  font-size: 9px;
}

.profilecourse-shortcuts {
  display: flex;
  align-items: center;
  gap: 7px;
}

.profilecourse-shortcuts > a {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border: 1px solid var(--profile-border);
  border-radius: 10px;
  background: var(--profile-surface-raised);
  color: var(--profile-ink);
  font-size: 9px;
  font-weight: 850;
  text-decoration: none;
  transition: border-color 180ms ease, color 180ms ease,
    background-color 180ms ease;
}

.profilecourse-shortcuts > a > i {
  color: var(--profile-secondary);
  font-size: 13px;
}

.profilecourse-shortcuts > a:hover,
.profilecourse-shortcuts > a:focus-visible {
  border-color: color-mix(
    in srgb,
    var(--profile-secondary) 38%,
    var(--profile-border)
  );
  outline: 0;
  background: var(--profile-secondary-soft);
  color: var(--profile-secondary);
}

.profile-purchases-library {
  min-width: 0;
}

@media (max-width: 820px) {
  .profilecourse-main {
    width: min(100% - 28px, 1240px);
    padding-top: 16px;
  }

  .profilecourse-intro {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .profilecourse-shortcuts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .profilecourse-shortcuts > a {
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .profilecourse-topbar-action {
    min-height: 34px;
    padding-inline: 10px;
  }

  .profilecourse-topbar-action i {
    display: none;
  }

  .profilecourse-intro {
    padding: 14px;
  }

  .profilecourse-shortcuts > a {
    min-height: 42px;
    flex-direction: column;
    gap: 3px;
    padding: 6px 4px;
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profilecourse-topbar-action,
  .profilecourse-shortcuts > a {
    transition: none;
  }
}
</style>
