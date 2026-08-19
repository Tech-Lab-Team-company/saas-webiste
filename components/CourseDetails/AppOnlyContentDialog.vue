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
    class="app-only-dialog"
    :style="{ width: 'min(28rem, calc(100vw - 2rem))' }"
    @update:visible="emit('update:visible', $event)"
  >
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
        <a
          v-if="appStoreUrl"
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
.app-only-dialog__content {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 8px 8px 14px;
  text-align: center;
}

.app-only-dialog__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  margin-bottom: 14px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--primary-color, #237a57) 12%, white);
  color: var(--primary-color, #237a57);
  font-size: 25px;
}

.app-only-dialog__content h2 {
  margin: 0;
  color: #14231b;
  font: 900 20px / 1.6 "Cairo", sans-serif;
}

.app-only-dialog__content > p {
  max-width: 360px;
  margin: 8px 0 20px;
  color: #68766e;
  font: 600 14px / 1.9 "Cairo", sans-serif;
}

.app-only-dialog__stores {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.app-only-dialog__stores a {
  display: flex;
  width: min(170px, calc(50% - 5px));
  min-width: 135px;
  align-items: center;
  justify-content: center;
}

.app-only-dialog__stores img {
  display: block;
  width: 100%;
  max-height: 51px;
  object-fit: contain;
}

.app-only-dialog__unavailable {
  margin-bottom: 0 !important;
  color: #9b514b !important;
}
</style>
