<script setup lang="ts">
import { storeToRefs } from "pinia";
import "~/assets/css/home-v2.css";
import HomeFooterSection from "~/components/home/v2/sections/HomeFooterSection.vue";
import HomeHeaderSection from "~/components/home/v2/sections/HomeHeaderSection.vue";
import { mapHomeSite } from "~/features/HomePageFeature/mappers/homePageMapper";

defineProps<{
  eyebrow: string;
  title: string;
  description: string;
}>();

const route = useRoute();
const settingsStore = useSettingStore();
const { setting } = storeToRefs(settingsStore);
const site = computed(() => mapHomeSite(setting.value));

const navigation = [
  { label: "سياسة الخصوصية", to: "/privacy" },
  { label: "الشروط والأحكام", to: "/terms" },
  { label: "الأسئلة الشائعة", to: "/fqs" },
];
</script>

<template>
  <div
    class="home-v2 information-page"
    dir="rtl"
    :style="{
      '--home-v2-blue': site.colors.primary || '#28366c',
      '--home-v2-deep': site.colors.secondary || '#3a3e7e',
      '--home-v2-blue-light': `color-mix(in srgb, ${site.colors.primary || '#28366c'} 14%, white)`,
    }"
  >
    <HomeHeaderSection :site="site" />

    <main class="information-page__main">
      <header class="information-page__hero">
        <div class="container information-page__hero-content">
          <nav aria-label="مسار التنقل">
            <NuxtLink to="/home-v2">الرئيسية</NuxtLink>
            <span aria-hidden="true">/</span>
            <b>{{ title }}</b>
          </nav>
          <span class="information-page__eyebrow">{{ eyebrow }}</span>
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </div>
      </header>

      <section class="information-page__body">
        <div class="container information-page__grid">
          <aside class="information-page__navigation" aria-label="صفحات المعلومات">
            <small>مركز المعلومات</small>
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              :class="{ 'is-active': route.path === item.to }"
            >
              {{ item.label }}
              <span aria-hidden="true">←</span>
            </NuxtLink>
          </aside>

          <article class="information-page__panel">
            <slot />
          </article>
        </div>
      </section>
    </main>

    <HomeFooterSection :site="site" />
  </div>
</template>

<style scoped>
.information-page {
  min-height: 100vh;
  background: var(--home-v2-paper);
}

.information-page__main {
  min-height: 70vh;
  padding-top: 86px;
}

.information-page__hero {
  position: relative;
  overflow: hidden;
  padding: clamp(58px, 8vw, 96px) 0;
  color: #fff;
  background:
    radial-gradient(circle at 14% 15%, color-mix(in srgb, var(--home-v2-blue) 55%, transparent), transparent 34%),
    linear-gradient(135deg, var(--home-v2-deep), color-mix(in srgb, var(--home-v2-deep) 70%, #081b3a));
}

.information-page__hero::after {
  position: absolute;
  inset: auto -90px -170px auto;
  width: 360px;
  height: 360px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
  box-shadow: 0 0 0 55px rgb(255 255 255 / 3%), 0 0 0 110px rgb(255 255 255 / 2%);
  content: "";
}

.information-page__hero-content {
  position: relative;
  z-index: 1;
}

.information-page__hero nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 24px;
  color: rgb(255 255 255 / 68%);
  font-size: 11px;
}

.information-page__hero nav a {
  color: #fff;
  font-weight: 800;
}

.information-page__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in srgb, var(--home-v2-coral) 65%, white);
  font-size: 11px;
  font-weight: 900;
}

.information-page__eyebrow::before {
  width: 28px;
  height: 2px;
  background: currentcolor;
  content: "";
}

.information-page__hero h1 {
  max-width: 800px;
  margin: 9px 0 12px;
  color: #fff;
  font: 900 clamp(36px, 5vw, 62px) / 1.25 var(--home-v2-heading);
}

.information-page__hero p {
  max-width: 720px;
  margin: 0;
  color: rgb(255 255 255 / 76%);
  font-size: clamp(14px, 1.6vw, 17px);
  line-height: 1.9;
}

.information-page__body {
  padding: clamp(42px, 7vw, 86px) 0 clamp(70px, 9vw, 120px);
  background: var(--home-v2-cream);
}

.information-page__grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}

.information-page__navigation {
  position: sticky;
  top: 112px;
  display: grid;
  overflow: hidden;
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
}

.information-page__navigation small {
  padding: 18px 20px 10px;
  color: var(--home-v2-muted);
  font-size: 10px;
  font-weight: 900;
}

.information-page__navigation a {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 20px;
  border-top: 1px solid var(--home-v2-line);
  color: var(--home-v2-muted);
  font-size: 12px;
  font-weight: 800;
  transition: background-color .2s ease, color .2s ease;
}

.information-page__navigation a:hover,
.information-page__navigation a.is-active {
  background: color-mix(in srgb, var(--home-v2-blue) 10%, var(--home-v2-surface));
  color: var(--home-v2-blue);
}

.information-page__panel {
  min-width: 0;
  padding: clamp(24px, 5vw, 58px);
  border: 1px solid var(--home-v2-line);
  background: var(--home-v2-surface);
  box-shadow: 0 24px 60px -48px var(--home-v2-shadow);
}

@media (max-width: 800px) {
  .information-page__grid {
    grid-template-columns: 1fr;
  }

  .information-page__navigation {
    position: static;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .information-page__navigation small {
    display: none;
  }

  .information-page__navigation a {
    justify-content: center;
    padding: 10px;
    border-top: 0;
    border-inline-start: 1px solid var(--home-v2-line);
    text-align: center;
  }

  .information-page__navigation a:last-child {
    border-inline-start: 0;
  }

  .information-page__navigation a span {
    display: none;
  }
}

@media (max-width: 520px) {
  .information-page__main {
    padding-top: 82px;
  }

  .information-page__navigation {
    grid-template-columns: 1fr;
  }

  .information-page__navigation a {
    min-height: 44px;
    border-top: 1px solid var(--home-v2-line);
    border-inline-start: 0;
  }

  .information-page__navigation a:first-of-type {
    border-top: 0;
  }
}
</style>
