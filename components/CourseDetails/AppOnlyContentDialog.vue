<script setup lang="ts">
import Dialog from "primevue/dialog";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const settingsStore = useSettingStore();

const cleanStoreLink = (value?: string | null) => {
  const link = value?.trim();
  return link && link !== "-" ? link : null;
};

const appStoreUrl = computed(() =>
  cleanStoreLink(settingsStore.setting?.app_store),
);
const playStoreUrl = computed(() =>
  cleanStoreLink(settingsStore.setting?.play_store),
);
const hasStoreLink = computed(() => Boolean(appStoreUrl.value || playStoreUrl.value));
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    dismissable-mask
    :draggable="false"
    class="app-only-dialog"
    :style="{ width: 'min(25rem, calc(100vw - 1.5rem))' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <span class="app-only-dialog__header">
        <i class="pi pi-mobile" aria-hidden="true" />
        تطبيق المنصة
      </span>
    </template>
    <div class="app-only-dialog__content" dir="rtl">
      <span class="app-only-dialog__icon" aria-hidden="true">
        <i class="pi pi-mobile" />
      </span>
      <h2>هذا المحتوى متاح على الموبايل فقط</h2>
      <p>
        لمشاهدة هذا المحتوى، حمّل تطبيق المنصة على موبايلك من الرابط المناسب
        لجهازك.
      </p>

      <div v-if="hasStoreLink" class="app-only-dialog__stores">
        <span class="app-only-dialog__stores-label">اختر متجر جهازك</span>
        <a
          v-if="appStoreUrl"
          class="app-only-dialog__store app-only-dialog__store--apple"
          :href="appStoreUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تحميل التطبيق من App Store"
        >
          <NuxtImg
            src="/images/Download_on_the_App_Store_Badge.svg.webp"
            alt="تحميل التطبيق من App Store"
          />
        </a>
        <a
          v-if="playStoreUrl"
          class="app-only-dialog__store app-only-dialog__store--google"
          :href="playStoreUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تحميل التطبيق من Google Play"
        >
          <NuxtImg
            src="/images/en_badge_web_generic.png"
            alt="تحميل التطبيق من Google Play"
          />
        </a>
      </div>
      <p v-else class="app-only-dialog__unavailable">
        روابط تحميل التطبيق غير متاحة حاليًا.
      </p>
    </div>
  </Dialog>
</template>

<style scoped>
:global(.app-only-dialog.p-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--primary-color, #237a57) 13%, #dce4df);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 24px 70px rgb(17 34 26 / 24%);
}

:global(.app-only-dialog .p-dialog-header) {
  min-height: 52px;
  padding: 15px 18px 8px;
  border-bottom: 1px solid #edf1ee;
}

:global(.app-only-dialog .p-dialog-close-button) {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #627269;
}

:global(.app-only-dialog .p-dialog-content) {
  padding: 0 24px 24px;
}

.app-only-dialog__header {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #53635a;
  font: 800 11px "Cairo", sans-serif;
}

.app-only-dialog__header i {
  color: var(--primary-color, #237a57);
  font-size: 12px;
}

.app-only-dialog__content {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 22px 0 0;
  text-align: center;
}

.app-only-dialog__icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  margin-bottom: 12px;
  border: 1px solid color-mix(in srgb, var(--primary-color, #237a57) 16%, transparent);
  border-radius: 15px;
  background: color-mix(in srgb, var(--primary-color, #237a57) 9%, white);
  color: var(--primary-color, #237a57);
  font-size: 21px;
}

.app-only-dialog__content h2 {
  margin: 0;
  color: #14231b;
  font: 900 19px / 1.55 "Cairo", sans-serif;
}

.app-only-dialog__content > p {
  max-width: 330px;
  margin: 7px 0 17px;
  color: #68766e;
  font: 600 12.5px / 1.85 "Cairo", sans-serif;
}

.app-only-dialog__stores {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e8eeea;
  border-radius: 14px;
  background: #f8faf9;
}

.app-only-dialog__stores-label {
  grid-column: 1 / -1;
  margin-bottom: 2px;
  color: #68766e;
  font: 800 10px "Cairo", sans-serif;
}

.app-only-dialog__store {
  position: relative;
  display: grid;
  height: 48px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  outline-offset: 2px;
  transition: filter 160ms ease, transform 160ms ease;
}

.app-only-dialog__store:hover,
.app-only-dialog__store:focus-visible {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.app-only-dialog__store--apple img {
  display: block;
  width: 154px;
  height: 46px;
  object-fit: contain;
}

.app-only-dialog__store--google img {
  display: block;
  width: 180px;
  max-width: none;
  height: auto;
  object-fit: contain;
}

.app-only-dialog__unavailable {
  margin-bottom: 0 !important;
  color: #9b514b !important;
}

@media (max-width: 390px) {
  :global(.app-only-dialog .p-dialog-content) {
    padding: 0 16px 18px;
  }

  .app-only-dialog__content {
    padding-top: 18px;
  }

  .app-only-dialog__content h2 {
    font-size: 17px;
  }

  .app-only-dialog__stores {
    grid-template-columns: 1fr;
  }

  .app-only-dialog__stores-label {
    grid-column: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-only-dialog__store {
    transition: none;
  }
}
</style>
