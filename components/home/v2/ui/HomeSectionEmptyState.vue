<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    title: string;
    description: string;
    tone?: "light" | "dark";
    compact?: boolean;
  }>(),
  {
    label: "محتوى غير مضاف",
    tone: "light",
    compact: false,
  },
);
</script>

<template>
  <div
    :class="[
      'home-section-empty',
      `home-section-empty--${tone}`,
      { 'home-section-empty--compact': compact },
    ]"
    role="status"
  >
    <span class="home-section-empty__mark" aria-hidden="true">+</span>
    <span class="home-section-empty__label">{{ label }}</span>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.home-section-empty {
  --empty-border: color-mix(in srgb, var(--home-v2-blue) 34%, transparent);
  --empty-surface: color-mix(in srgb, var(--home-v2-blue-light) 34%, white);
  --empty-title: var(--home-v2-deep);
  --empty-text: var(--home-v2-muted);
  --empty-accent: var(--home-v2-blue);
  display: grid;
  width: 100%;
  min-height: 330px;
  place-items: center;
  align-content: center;
  padding: clamp(38px, 6vw, 68px);
  border: 1px dashed var(--empty-border);
  border-radius: 26px;
  background: linear-gradient(145deg, var(--empty-surface), transparent);
  text-align: center;
}

.home-section-empty--dark {
  --empty-border: rgb(255 255 255 / 34%);
  --empty-surface: rgb(255 255 255 / 8%);
  --empty-title: #fff;
  --empty-text: rgb(255 255 255 / 70%);
  --empty-accent: #f2cc7b;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
}

.home-section-empty--compact {
  min-height: 100%;
  padding: 28px 22px;
  border-radius: inherit;
}

.home-section-empty__mark {
  display: grid;
  width: 64px;
  height: 64px;
  margin-bottom: 21px;
  place-items: center;
  border: 1px dashed color-mix(in srgb, var(--empty-accent) 70%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--empty-accent) 9%, transparent);
  color: var(--empty-accent);
  font: 300 36px/1 var(--home-v2-heading);
}

.home-section-empty__label {
  color: var(--empty-accent);
  font-size: 12px;
  font-weight: 900;
}

.home-section-empty h2 {
  margin: 12px 0 9px;
  color: var(--empty-title);
  font: 900 clamp(28px, 3vw, 42px) / 1.3 var(--home-v2-heading);
}

.home-section-empty p {
  max-width: 570px;
  margin: 0;
  color: var(--empty-text);
  font-size: 15px;
  line-height: 1.9;
  text-wrap: balance;
}

.home-section-empty--compact .home-section-empty__mark {
  width: 54px;
  height: 54px;
  margin-bottom: 16px;
  font-size: 30px;
}

.home-section-empty--compact h2 {
  font-size: clamp(23px, 2.4vw, 31px);
}

.home-section-empty--compact p {
  font-size: 13px;
}

@media (max-width: 560px) {
  .home-section-empty {
    min-height: 290px;
    padding: 34px 22px;
    border-radius: 20px;
  }
}
</style>
