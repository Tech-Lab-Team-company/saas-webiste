<script setup lang="ts">
defineProps<{
  takingLong?: boolean;
  canRetry?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div
    class="video-loading-state"
    dir="rtl"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <div class="video-loading-state__icon" aria-hidden="true">
      <span class="video-loading-state__ring"></span>
      <span class="video-loading-state__play"></span>
    </div>

    <div class="video-loading-state__copy">
      <strong>{{ takingLong ? 'الفيديو يحتاج وقتًا إضافيًا' : 'جاري تجهيز الفيديو' }}</strong>
      <p v-if="takingLong">
        استغرق الاتصال بالمشغل وقتًا أطول من المعتاد. تحقق من الإنترنت ثم أعد المحاولة.
      </p>
      <p v-else>
        نجهّز مشغل الفيديو ونتحقق من صلاحية العرض. سيبدأ خلال لحظات.
      </p>
    </div>

    <button
      v-if="takingLong && canRetry"
      class="video-loading-state__retry"
      type="button"
      @click.stop="emit('retry')"
    >
      <i class="pi pi-refresh" aria-hidden="true"></i>
      إعادة تحميل الفيديو
    </button>

    <span v-else class="video-loading-state__wait">
      <span aria-hidden="true"></span>
      يرجى الانتظار
    </span>
  </div>
</template>

<style scoped>
.video-loading-state {
  position: absolute;
  inset: 0;
  z-index: 220;
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: clamp(22px, 5vw, 44px);
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--secondary-color, #2878e8) 24%, transparent), transparent 38%),
    linear-gradient(145deg, #07152a 0%, #0a1d38 55%, #071326 100%);
  color: #fff;
  text-align: center;
}

.video-loading-state::before {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    120deg,
    transparent 30%,
    rgb(255 255 255 / 5%) 48%,
    transparent 66%
  );
  content: '';
  transform: translateX(-100%);
  animation: video-loading-shimmer 2.4s ease-in-out infinite;
}

.video-loading-state__icon {
  position: relative;
  display: grid;
  width: 76px;
  height: 76px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 50%;
  background: rgb(255 255 255 / 9%);
  box-shadow: 0 14px 40px rgb(0 0 0 / 30%);
}

.video-loading-state__ring {
  position: absolute;
  inset: -5px;
  border: 3px solid rgb(255 255 255 / 14%);
  border-top-color: var(--secondary-color, #2878e8);
  border-right-color: var(--primary-color, #237a57);
  border-radius: 50%;
  animation: video-loading-spin 1s linear infinite;
}

.video-loading-state__play {
  width: 0;
  height: 0;
  margin-inline-start: 5px;
  border-block: 11px solid transparent;
  border-inline-start: 17px solid #fff;
}

.video-loading-state__copy {
  position: relative;
  max-width: 520px;
}

.video-loading-state__copy strong {
  display: block;
  margin-bottom: 7px;
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 800;
}

.video-loading-state__copy p {
  margin: 0;
  color: rgb(255 255 255 / 74%);
  font-size: clamp(13px, 1.6vw, 15px);
  line-height: 1.8;
}

.video-loading-state__wait,
.video-loading-state__retry {
  position: relative;
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.video-loading-state__wait {
  padding: 8px 15px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 7%);
  color: rgb(255 255 255 / 74%);
}

.video-loading-state__wait span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--secondary-color, #2878e8);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--secondary-color, #2878e8) 20%, transparent);
  animation: video-loading-pulse 1.3s ease-in-out infinite;
}

.video-loading-state__retry {
  padding: 9px 18px;
  border: 1px solid color-mix(in srgb, var(--secondary-color, #2878e8) 58%, #fff);
  background: var(--secondary-color, #2878e8);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--secondary-color, #2878e8) 32%, transparent);
  color: #fff;
  cursor: pointer;
  transition: transform 180ms ease, filter 180ms ease;
}

.video-loading-state__retry:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.video-loading-state__retry:focus-visible {
  outline: 3px solid rgb(255 255 255 / 65%);
  outline-offset: 3px;
}

@keyframes video-loading-spin {
  to { transform: rotate(360deg); }
}

@keyframes video-loading-pulse {
  50% { opacity: 0.45; transform: scale(0.82); }
}

@keyframes video-loading-shimmer {
  55%, 100% { transform: translateX(100%); }
}

@media (max-width: 640px) {
  .video-loading-state {
    min-height: 190px;
    gap: 12px;
    padding: 18px;
  }

  .video-loading-state__icon {
    width: 58px;
    height: 58px;
  }

  .video-loading-state__ring {
    inset: -4px;
    border-width: 2px;
  }

  .video-loading-state__play {
    border-block-width: 8px;
    border-inline-start-width: 13px;
  }

  .video-loading-state__copy p {
    max-width: 310px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-loading-state::before,
  .video-loading-state__ring,
  .video-loading-state__wait span {
    animation: none;
  }
}
</style>
