<script setup lang="ts">
interface AppError {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

const props = defineProps<{
  error?: AppError;
}>();

const statusCode = computed(() => Number(props.error?.statusCode) || 500);

const errorContent = computed(() => {
  if (statusCode.value === 404) {
    return {
      eyebrow: "الصفحة غير موجودة",
      title: "يبدو أنك وصلت إلى طريق مغلق",
      description:
        "الصفحة التي تبحث عنها ربما نُقلت أو تغيّر رابطها. يمكنك العودة إلى الرئيسية ومتابعة التعلّم.",
      status: "خطأ 404",
      note: "تحقق من الرابط أو ابدأ من الصفحة الرئيسية.",
    };
  }

  if (statusCode.value === 503) {
    return {
      eyebrow: "تحديثات جارية",
      title: "نُجري بعض التحسينات الآن",
      description:
        "نعمل على تحسين تجربتك، وسنعود خلال وقت قصير. جرّب تحديث الصفحة بعد قليل.",
      status: "صيانة مؤقتة",
      note: "بياناتك وحسابك محفوظان بأمان.",
    };
  }

  return {
    eyebrow: "حدث خطأ غير متوقع",
    title: "تعذّر تحميل الصفحة",
    description:
      "واجهنا مشكلة مؤقتة أثناء فتح هذه الصفحة. أعد المحاولة، أو عُد إلى الرئيسية إذا استمرت المشكلة.",
    status: `خطأ ${statusCode.value}`,
    note: "يمكنك المحاولة مرة أخرى دون فقدان بيانات حسابك.",
  };
});

const goHome = () => clearError({ redirect: "/" });

const reloadPage = () => {
  if (import.meta.client) window.location.reload();
};

useHead(() => ({
  title: `${errorContent.value.eyebrow} | المنصة`,
  meta: [{ name: "robots", content: "noindex, nofollow" }],
}));
</script>

<template>
  <main class="error-page" dir="rtl">
    <span class="error-page__glow error-page__glow--one" aria-hidden="true" />
    <span class="error-page__glow error-page__glow--two" aria-hidden="true" />
    <span class="error-page__grid" aria-hidden="true" />

    <section class="error-card" aria-labelledby="error-title">
      <div class="error-card__content">
        <div class="error-card__brand" aria-label="المنصة التعليمية">
          <span class="error-card__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m3 9 9-5 9 5-9 5-9-5Z" />
              <path d="M7 12v4.2c2.9 2.4 7.1 2.4 10 0V12" />
              <path d="M21 9v6" />
            </svg>
          </span>
          <span>
            <small>مساحتك التعليمية</small>
            <strong>المنصة</strong>
          </span>
        </div>

        <span class="error-card__status">
          <i aria-hidden="true" />
          {{ errorContent.status }}
        </span>

        <p class="error-card__eyebrow">{{ errorContent.eyebrow }}</p>
        <h1 id="error-title">{{ errorContent.title }}</h1>
        <p class="error-card__description">{{ errorContent.description }}</p>

        <div class="error-card__actions">
          <button
            class="error-card__button error-card__button--primary"
            type="button"
            @click="goHome"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 11 9-8 9 8" />
              <path d="M5 10v10h14V10M9 20v-6h6v6" />
            </svg>
            العودة للرئيسية
          </button>
          <button
            class="error-card__button error-card__button--secondary"
            type="button"
            @click="reloadPage"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 6v5h-5" />
              <path d="M18.5 15a7.5 7.5 0 1 1-.6-7.6L20 11" />
            </svg>
            إعادة المحاولة
          </button>
        </div>

        <p class="error-card__note">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          {{ errorContent.note }}
        </p>
      </div>

      <div class="error-card__visual" aria-hidden="true">
        <span class="error-card__code">{{ statusCode }}</span>
        <div class="error-card__illustration">
          <svg class="error-card__animation" viewBox="0 0 440 340" fill="none">
            <circle cx="220" cy="170" r="128" fill="rgb(82 110 199 / 9%)" />
            <path
              d="M92 273h256"
              stroke="currentColor"
              stroke-width="8"
              stroke-linecap="round"
              opacity=".12"
            />
            <rect
              x="122"
              y="91"
              width="196"
              height="148"
              rx="22"
              fill="#fff"
              stroke="currentColor"
              stroke-width="5"
              opacity=".96"
            />
            <path
              d="M152 132h136M152 163h92"
              stroke="currentColor"
              stroke-width="10"
              stroke-linecap="round"
              opacity=".2"
            />
            <path
              d="m181 237 39-67 39 67"
              fill="var(--error-primary)"
              opacity=".92"
            />
            <path
              d="M165 237h110"
              stroke="var(--error-secondary)"
              stroke-width="13"
              stroke-linecap="round"
            />
            <path d="m220 181 10 18h-20l10-18Z" fill="#fff" />
            <circle
              cx="127"
              cy="80"
              r="18"
              fill="var(--error-secondary)"
              opacity=".22"
            />
            <path
              d="m321 77 7 19 19 7-19 7-7 19-7-19-19-7 19-7 7-19Z"
              fill="var(--error-secondary)"
              opacity=".75"
            />
          </svg>
        </div>
        <span class="error-card__float error-card__float--spark">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"
            />
          </svg>
        </span>
        <span class="error-card__float error-card__float--dots">
          <i /><i /><i />
        </span>
      </div>
    </section>

    <p class="error-page__footer">
      إذا استمرت المشكلة، انتظر قليلًا ثم أعد المحاولة.
    </p>
  </main>
</template>

<style scoped>
:global(html),
:global(body),
:global(#__nuxt) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
}

:global(*) {
  box-sizing: border-box;
}

.error-page {
  --error-primary: var(--app-brand-primary, #243b7a);
  --error-secondary: var(--app-brand-secondary, #526ed3);
  --error-ink: var(--app-text, #0b1739);
  --error-muted: var(--app-muted, #60708d);
  --error-line: var(--app-line, rgb(18 42 91 / 12%));
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100dvh;
  place-content: center;
  overflow: hidden;
  padding: clamp(24px, 5vw, 64px);
  background:
    radial-gradient(circle at 12% 18%, rgb(92 126 224 / 14%), transparent 27rem),
    radial-gradient(circle at 90% 86%, rgb(42 64 137 / 11%), transparent 25rem),
    linear-gradient(145deg, #f9fbff 0%, #f4f7fd 52%, #eef3fb 100%);
  color: var(--error-ink);
  font-family: "Zain", "Tajawal", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.error-page__grid {
  position: absolute;
  z-index: -2;
  inset: 0;
  background-image:
    linear-gradient(rgb(17 42 92 / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(17 42 92 / 3%) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at center, #000, transparent 78%);
  pointer-events: none;
}

.error-page__glow {
  position: absolute;
  z-index: -1;
  width: clamp(180px, 25vw, 360px);
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.5;
  pointer-events: none;
}

.error-page__glow--one {
  top: -13%;
  inset-inline-end: -7%;
  border: 1px solid rgb(70 101 191 / 12%);
  box-shadow:
    0 0 0 42px rgb(70 101 191 / 4%),
    0 0 0 84px rgb(70 101 191 / 3%);
}

.error-page__glow--two {
  bottom: -19%;
  inset-inline-start: -8%;
  background: rgb(87 115 202 / 9%);
  box-shadow: 0 0 0 64px rgb(87 115 202 / 4%);
}

.error-card {
  display: grid;
  width: min(1080px, calc(100vw - 48px));
  min-height: min(640px, calc(100dvh - 130px));
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 84%);
  border-radius: clamp(24px, 3vw, 38px);
  background: rgb(255 255 255 / 86%);
  box-shadow:
    0 34px 90px -48px rgb(11 30 78 / 45%),
    0 1px 0 #fff inset;
  backdrop-filter: blur(18px);
}

.error-card__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(34px, 5vw, 76px);
}

.error-card__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: clamp(34px, 6vh, 62px);
}

.error-card__brand-mark {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  background: linear-gradient(145deg, var(--error-primary), var(--error-secondary));
  box-shadow: 0 12px 24px -12px rgb(36 59 122 / 65%);
  color: #fff;
}

.error-card__brand-mark svg {
  width: 27px;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.error-card__brand > span:last-child {
  display: grid;
  gap: 1px;
}

.error-card__brand small {
  color: var(--error-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.error-card__brand strong {
  color: var(--error-ink);
  font-size: 20px;
  line-height: 1.2;
}

.error-card__status {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 9px;
  margin-bottom: 16px;
  padding-inline: 13px;
  border: 1px solid color-mix(in srgb, var(--error-secondary) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--error-secondary) 8%, #fff);
  color: var(--error-primary);
  font-size: 13px;
  font-weight: 800;
}

.error-card__status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4f70db;
  box-shadow: 0 0 0 5px rgb(79 112 219 / 12%);
}

.error-card__eyebrow {
  margin: 0 0 6px;
  color: var(--error-secondary);
  font-size: clamp(14px, 1.5vw, 17px);
  font-weight: 800;
}

.error-card h1 {
  max-width: 580px;
  margin: 0;
  color: var(--error-ink);
  font-size: clamp(36px, 4.2vw, 58px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.12;
}

.error-card__description {
  max-width: 570px;
  margin: 20px 0 0;
  color: var(--error-muted);
  font-size: clamp(17px, 1.8vw, 20px);
  font-weight: 500;
  line-height: 1.75;
}

.error-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.error-card__button {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 15px;
  font: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.error-card__button svg {
  width: 20px;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.error-card__button--primary {
  background: linear-gradient(135deg, var(--error-primary), var(--error-secondary));
  box-shadow: 0 15px 30px -16px rgb(36 59 122 / 78%);
  color: #fff;
}

.error-card__button--secondary {
  border-color: var(--error-line);
  background: #fff;
  color: var(--error-ink);
}

.error-card__button:hover {
  transform: translateY(-2px);
}

.error-card__button--primary:hover {
  box-shadow: 0 18px 34px -14px rgb(36 59 122 / 82%);
}

.error-card__button--secondary:hover {
  border-color: color-mix(in srgb, var(--error-secondary) 28%, transparent);
  background: #f7f9ff;
}

.error-card__button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--error-secondary) 30%, transparent);
  outline-offset: 3px;
}

.error-card__note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 25px 0 0;
  color: var(--error-muted);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.error-card__note svg {
  flex: 0 0 auto;
  width: 18px;
  stroke: var(--error-secondary);
  stroke-linecap: round;
  stroke-width: 1.8;
}

.error-card__visual {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100%;
  place-items: center;
  overflow: hidden;
  border-inline-start: 1px solid rgb(70 101 191 / 8%);
  background:
    radial-gradient(circle at 50% 45%, rgb(255 255 255 / 96%) 0 20%, transparent 55%),
    linear-gradient(155deg, rgb(222 231 255 / 68%), rgb(238 243 255 / 85%));
}

.error-card__visual::before,
.error-card__visual::after {
  position: absolute;
  z-index: -1;
  border: 1px solid rgb(74 103 187 / 10%);
  border-radius: 50%;
  content: "";
}

.error-card__visual::before {
  width: 430px;
  height: 430px;
}

.error-card__visual::after {
  width: 330px;
  height: 330px;
  box-shadow: 0 0 0 42px rgb(78 108 196 / 3%);
}

.error-card__illustration {
  position: relative;
  z-index: 2;
  width: min(100%, 500px);
  padding: 18px;
}

.error-card__animation {
  display: block;
  width: 100%;
  min-height: 360px;
}

.error-card__code {
  position: absolute;
  top: 9%;
  inset-inline-start: 50%;
  color: rgb(52 76 149 / 7%);
  font-family: Arial, sans-serif;
  font-size: clamp(112px, 13vw, 190px);
  font-weight: 900;
  line-height: 1;
  transform: translateX(50%);
  user-select: none;
}

.error-card__float {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 80%);
  background: rgb(255 255 255 / 78%);
  box-shadow: 0 15px 35px -20px rgb(26 55 129 / 55%);
  backdrop-filter: blur(10px);
}

.error-card__float--spark {
  top: 19%;
  inset-inline-end: 8%;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  color: #526ed3;
  animation: error-float 4.5s ease-in-out infinite;
}

.error-card__float--spark svg {
  width: 24px;
  stroke: currentcolor;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.error-card__float--dots {
  right: 8%;
  bottom: 19%;
  grid-auto-flow: column;
  gap: 5px;
  padding: 12px 14px;
  border-radius: 999px;
  animation: error-float 5s 0.8s ease-in-out infinite;
}

.error-card__float--dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #526ed3;
}

.error-card__float--dots i:nth-child(2) {
  opacity: 0.55;
}

.error-card__float--dots i:nth-child(3) {
  opacity: 0.25;
}

.error-page__footer {
  margin: 22px 0 0;
  color: var(--error-muted);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

@keyframes error-float {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }

  50% {
    transform: translateY(-9px) rotate(2deg);
  }
}

@media (max-width: 880px) {
  .error-page {
    place-content: start center;
  }

  .error-card {
    width: min(680px, calc(100vw - 32px));
    min-height: 0;
    grid-template-columns: 1fr;
  }

  .error-card__content {
    order: 2;
    align-items: center;
    padding: 38px clamp(24px, 7vw, 56px) 42px;
    text-align: center;
  }

  .error-card__brand {
    align-self: flex-start;
    margin-bottom: 28px;
    text-align: start;
  }

  .error-card__visual {
    min-height: 300px;
    border-inline-start: 0;
    border-bottom: 1px solid rgb(70 101 191 / 8%);
  }

  .error-card__illustration {
    width: min(80%, 390px);
    padding: 0;
  }

  .error-card__animation {
    min-height: 290px;
  }

  .error-card__code {
    top: 7%;
    font-size: 120px;
  }
}

@media (max-width: 520px) {
  .error-page {
    padding: 16px;
  }

  .error-card {
    width: 100%;
    border-radius: 25px;
  }

  .error-card__visual {
    min-height: 240px;
  }

  .error-card__illustration {
    width: min(88%, 330px);
  }

  .error-card__animation {
    min-height: 230px;
  }

  .error-card__float--spark {
    top: 13%;
    width: 42px;
    height: 42px;
  }

  .error-card__float--dots {
    bottom: 10%;
  }

  .error-card__content {
    padding: 28px 21px 32px;
  }

  .error-card__brand {
    margin-bottom: 25px;
  }

  .error-card__brand-mark {
    width: 43px;
    height: 43px;
    border-radius: 13px;
  }

  .error-card h1 {
    font-size: clamp(32px, 10vw, 43px);
  }

  .error-card__description {
    margin-top: 15px;
    font-size: 16px;
    line-height: 1.65;
  }

  .error-card__actions {
    display: grid;
    width: 100%;
    margin-top: 26px;
  }

  .error-card__button {
    width: 100%;
  }

  .error-card__note {
    align-items: flex-start;
    text-align: start;
  }

  .error-page__footer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .error-card__float {
    animation: none;
  }

  .error-card__button {
    transition: none;
  }
}
</style>
