<script setup lang="ts">
const { theme, toggleTheme } = useColorTheme()

const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    aria-label="تبديل مظهر الموقع"
    :aria-pressed="isDark"
    title="تبديل مظهر الموقع"
    @click="toggleTheme"
  >
    <span v-if="!isDark" class="theme-toggle-sun" aria-hidden="true">☀</span>
    <span v-else class="theme-toggle-moon" aria-hidden="true">☾</span>
    <span class="theme-toggle-label">المظهر</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  z-index: 1000;
  bottom: max(18px, env(safe-area-inset-bottom));
  left: max(18px, env(safe-area-inset-left));
  display: inline-flex;
  min-width: 54px;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 15px;
  border: 1px solid #081b3a29;
  border-radius: 999px;
  background: #fbfcfff0;
  color: #081b3a;
  box-shadow: 0 14px 35px -18px #0206178c;
  backdrop-filter: blur(16px);
  cursor: pointer;
  font: 800 10px var(--heading);
  transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
}

.theme-toggle:hover {
  transform: translateY(-2px);
}

.theme-toggle-sun,
.theme-toggle-moon {
  width: 19px;
  font-size: 18px;
  line-height: 1;
}

:global(html[data-theme='dark']) .theme-toggle {
  border-color: var(--dark-line);
  background: #111d21f0;
  color: var(--dark-text);
  box-shadow: 0 14px 38px -16px #000000d9;
}

@media (max-width: 620px) {
  .theme-toggle {
    width: 46px;
    min-width: 46px;
    padding: 0;
  }

  .theme-toggle-label {
    display: none;
  }
}
</style>
