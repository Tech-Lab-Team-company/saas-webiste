<script setup lang="ts">
const blocker = ref<HTMLElement | null>(null);
let previousBodyOverflow = "";

onMounted(() => {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  void nextTick(() => blocker.value?.focus());
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <section
    ref="blocker"
    class="developer-tools-blocker"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="developer-tools-title"
    aria-describedby="developer-tools-description"
    tabindex="-1"
    dir="rtl"
    @keydown.stop.prevent
  >
    <div class="developer-tools-blocker__card">
      <span class="developer-tools-blocker__icon" aria-hidden="true">
        <i class="pi pi-shield" />
      </span>
      <span class="developer-tools-blocker__label">حماية المحتوى والامتحانات</span>
      <h1 id="developer-tools-title">أغلق أدوات المطور للمتابعة</h1>
      <p id="developer-tools-description">
        تم إخفاء محتوى الكورس والامتحان بالكامل لحماية الأسئلة ومنع الغش.
        أغلق نافذة Inspect أو Developer Tools، وسيعود المحتوى تلقائيًا.
      </p>
      <div class="developer-tools-blocker__status" role="status" aria-live="assertive">
        <span aria-hidden="true" />
        في انتظار إغلاق أدوات المطور
      </div>
      <small>لا يمكن إغلاق هذه الرسالة يدويًا.</small>
    </div>
  </section>
</template>

<style scoped>
.developer-tools-blocker {
  position: fixed;
  z-index: 2147483647;
  inset: 0;
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: 24px;
  overflow: auto;
  background:
    radial-gradient(circle at 50% 20%, rgb(78 104 182 / 24%), transparent 34rem),
    rgb(6 13 29 / 98%);
  outline: none;
}

.developer-tools-blocker__card {
  width: min(520px, 100%);
  padding: clamp(30px, 5vw, 48px);
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 26px;
  background: rgb(15 27 53 / 96%);
  box-shadow: 0 36px 100px rgb(0 0 0 / 52%);
  color: #fff;
  text-align: center;
}

.developer-tools-blocker__icon {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  margin: 0 auto 18px;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 50%;
  background: rgb(255 255 255 / 9%);
  color: #9fc2ff;
  font-size: 32px;
  box-shadow: 0 0 0 10px rgb(159 194 255 / 5%);
}

.developer-tools-blocker__label {
  color: #9fc2ff;
  font-size: 13px;
  font-weight: 900;
}

.developer-tools-blocker h1 {
  margin: 10px 0 12px;
  font: 900 clamp(25px, 5vw, 34px) / 1.5 "Cairo", sans-serif;
}

.developer-tools-blocker p {
  margin: 0;
  color: rgb(255 255 255 / 72%);
  font: 600 15px / 2 "Cairo", sans-serif;
}

.developer-tools-blocker__status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 25px;
  padding: 10px 14px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 999px;
  background: rgb(255 255 255 / 6%);
  color: #dfe9ff;
  font-size: 13px;
  font-weight: 800;
}

.developer-tools-blocker__status span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff785b;
  box-shadow: 0 0 0 5px rgb(255 120 91 / 12%);
  animation: security-status-pulse 1.4s ease-in-out infinite;
}

.developer-tools-blocker small {
  display: block;
  margin-top: 16px;
  color: rgb(255 255 255 / 45%);
  font-size: 11px;
}

@keyframes security-status-pulse {
  50% {
    opacity: 0.45;
    transform: scale(0.8);
  }
}

@media (max-width: 560px) {
  .developer-tools-blocker {
    padding: 14px;
  }

  .developer-tools-blocker__card {
    padding: 28px 20px;
    border-radius: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .developer-tools-blocker__status span {
    animation: none;
  }
}
</style>
