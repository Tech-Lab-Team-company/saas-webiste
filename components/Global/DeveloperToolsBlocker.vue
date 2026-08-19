<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const blocker = ref<HTMLElement | null>(null);

let previousBodyOverflow = "";
let previousHtmlOverflow = "";

onMounted(async () => {
  previousBodyOverflow = document.body.style.overflow;
  previousHtmlOverflow = document.documentElement.style.overflow;

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  await nextTick();

  blocker.value?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
  document.documentElement.style.overflow = previousHtmlOverflow;
});

definePageMeta({
  layout: "course-details",
});
</script>

<template>
  <Teleport to="body">
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
      <div class="developer-tools-blocker__viewport">
        <div class="developer-tools-blocker__card">
          <span
            class="developer-tools-blocker__icon"
            aria-hidden="true"
          >
            <i class="pi pi-shield" />
          </span>

          <span class="developer-tools-blocker__label">
            حماية المحتوى والامتحانات
          </span>

          <h1 id="developer-tools-title">
            أغلق أدوات المطور للمتابعة
          </h1>

          <p id="developer-tools-description">
            تم إخفاء محتوى الكورس والامتحان بالكامل لحماية الأسئلة ومنع الغش.
            أغلق نافذة Inspect أو Developer Tools، وسيعود المحتوى تلقائيًا.
          </p>

          <div
            class="developer-tools-blocker__status"
            role="status"
            aria-live="assertive"
          >
            <span aria-hidden="true" />

            في انتظار إغلاق أدوات المطور
          </div>

          <small>
            لا يمكن إغلاق هذه الرسالة يدويًا.
          </small>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>
.developer-tools-blocker {
  position: fixed;
  inset: 0;
  z-index: 2147483647;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 20%,
      rgb(78 104 182 / 24%),
      transparent 34rem
    ),
    rgb(6 13 29 / 98%);

  outline: none;
}

/*
 * Separate scrolling viewport.
 * This guarantees the whole card can be reached
 * even when DevTools reduces the browser height.
 */
.developer-tools-blocker__viewport {
  width: 100%;
  height: 100%;
  min-height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px 24px;

  overflow-x: hidden;
  overflow-y: auto;

  box-sizing: border-box;
}

.developer-tools-blocker__card {
  width: min(520px, 100%);

  /*
   * Prevent flex from shrinking/cutting the card
   */
  flex: 0 0 auto;

  padding: clamp(30px, 5vw, 48px);

  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 26px;

  background: rgb(15 27 53 / 96%);

  box-shadow:
    0 36px 100px rgb(0 0 0 / 52%);

  color: #fff;
  text-align: center;

  box-sizing: border-box;
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

  box-shadow:
    0 0 0 10px rgb(159 194 255 / 5%);
}

.developer-tools-blocker__label {
  color: #9fc2ff;
  font-size: 13px;
  font-weight: 900;
}

.developer-tools-blocker h1 {
  margin: 10px 0 12px;

  font:
    900 clamp(25px, 5vw, 34px) / 1.5
    "Cairo",
    sans-serif;
}

.developer-tools-blocker p {
  margin: 0;

  color: rgb(255 255 255 / 72%);

  font:
    600 15px / 2
    "Cairo",
    sans-serif;
}

.developer-tools-blocker__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;

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

  flex-shrink: 0;

  border-radius: 50%;

  background: #ff785b;

  box-shadow:
    0 0 0 5px rgb(255 120 91 / 12%);

  animation:
    security-status-pulse 1.4s
    ease-in-out infinite;
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

/*
 * Short viewport — for example when DevTools
 * is docked horizontally.
 */
@media (max-height: 650px) {
  .developer-tools-blocker__viewport {
    align-items: flex-start;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .developer-tools-blocker__card {
    padding: 24px 30px;
  }

  .developer-tools-blocker__icon {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
    font-size: 25px;
  }

  .developer-tools-blocker h1 {
    font-size: 26px;
    line-height: 1.4;
  }

  .developer-tools-blocker p {
    line-height: 1.8;
  }

  .developer-tools-blocker__status {
    margin-top: 18px;
  }
}

@media (max-width: 560px) {
  .developer-tools-blocker__viewport {
    padding: 18px 14px;
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