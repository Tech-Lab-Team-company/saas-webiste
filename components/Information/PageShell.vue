<script setup lang="ts">
import { storeToRefs } from "pinia";
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
    <main class="information-page__main">
      <header class="information-page__hero">
        <div class="container information-page__hero-content">
          <nav aria-label="مسار التنقل">
            <NuxtLink to="/">الرئيسية</NuxtLink>
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

  </div>
</template>
