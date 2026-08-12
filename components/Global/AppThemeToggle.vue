<script setup lang="ts">
withDefaults(
  defineProps<{
    isDark: boolean;
    iconOnly?: boolean;
    inline?: boolean;
  }>(),
  {
    iconOnly: false,
    inline: false,
  },
);
defineEmits<{ toggle: [] }>();
</script>

<template>
  <button
    type="button"
    class="app-theme-toggle"
    :class="{
      'app-theme-toggle--dark': isDark,
      'app-theme-toggle--icon-only': iconOnly,
      'app-theme-toggle--inline': inline,
    }"
    :aria-label="isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'"
    :title="isDark ? 'الوضع الفاتح' : 'الوضع الداكن'"
    :aria-pressed="isDark"
    @click="$emit('toggle')"
  >
    <span class="app-theme-toggle__icon" aria-hidden="true">
      <svg v-if="isDark" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none">
        <path
          d="M20.5 15.25A8.5 8.5 0 0 1 8.75 3.5 8.5 8.5 0 1 0 20.5 15.25Z"
        />
      </svg>
    </span>
    <span :class="['app-theme-toggle__label', { 'sr-only': iconOnly }]">
      {{ isDark ? "الوضع الفاتح" : "الوضع الداكن" }}
    </span>
  </button>
</template>

<style scoped>
.app-theme-toggle {
  position: fixed;
  z-index: 2200;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: max(20px, env(safe-area-inset-left));
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  gap: 10px;
  padding: 6px 15px 6px 7px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--app-surface) 88%, transparent);
  box-shadow: 0 18px 45px -22px var(--app-shadow);
  color: var(--app-text);
  backdrop-filter: blur(18px) saturate(140%);
  cursor: pointer;
  font: 800 11px Cairo, Tahoma, Arial, sans-serif;
  transition: border-color 0.25s ease, background-color 0.25s ease,
    color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.app-theme-toggle:hover {
  box-shadow: 0 22px 52px -23px var(--app-shadow);
  transform: translateY(-3px);
}

.app-theme-toggle--inline {
  position: relative;
  z-index: auto;
  inset: auto;
  box-shadow: none;
}

.app-theme-toggle--icon-only {
  width: 42px;
  min-height: 42px;
  justify-content: center;
  padding: 3px;
  border-radius: 11px;
}

.app-theme-toggle--inline:hover {
  box-shadow: 0 8px 20px -14px var(--app-shadow);
  transform: translateY(-1px);
}

.app-theme-toggle__icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--app-accent);
  color: #fff;
  transition: background-color 0.25s ease, color 0.25s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  animation: rotateThemeIcon 2s linear infinite;
}

.app-theme-toggle--inline .app-theme-toggle__icon {
  width: 34px;
  height: 34px;
  flex-basis: 34px;
  animation: rotateThemeIcon 2s linear infinite;
}

.app-theme-toggle--inline:hover .app-theme-toggle__icon {
  transform: rotate(12deg);
}

.app-theme-toggle--inline.app-theme-toggle--dark:hover
  .app-theme-toggle__icon {
  transform: rotate(102deg);
}

.app-theme-toggle--dark .app-theme-toggle__icon {
  background: #ffd166;
  color: #332408;
  transform: rotate(90deg);
}

.app-theme-toggle svg {
  width: 19px;
  height: 19px;
  stroke: currentcolor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 620px) {
  .app-theme-toggle {
    width: 50px;
    padding: 6px;
  }

  .app-theme-toggle--icon-only {
    width: 42px;
    padding: 3px;
  }

  .app-theme-toggle__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}

@keyframes rotateThemeIcon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-theme-toggle__icon,
  .app-theme-toggle--inline .app-theme-toggle__icon {
    animation: none;
  }
}
</style>
