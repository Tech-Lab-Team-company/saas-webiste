<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const dialogRef = ref<HTMLDialogElement | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const clearAutoClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  dialogRef.value?.classList.remove('is-counting')
}

const close = () => {
  clearAutoClose()
  dialogRef.value?.close()
}

const show = () => {
  dialogRef.value?.showModal()
}

const startAutoClose = (event: Event) => {
  clearAutoClose()
  const duration = Number((event as CustomEvent<{ autoCloseMs?: number }>).detail?.autoCloseMs)
  if (!Number.isFinite(duration) || duration <= 0 || !dialogRef.value) return

  dialogRef.value.style.setProperty('--dialog-auto-close-duration', `${duration}ms`)
  // Force the countdown animation to restart when dialogs open consecutively.
  void dialogRef.value.offsetWidth
  dialogRef.value.classList.add('is-counting')
  closeTimer = setTimeout(close, duration)
}

onBeforeUnmount(clearAutoClose)

defineExpose({
  show,
  close
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="dialog"
    aria-labelledby="base-dialog-title"
    aria-describedby="base-dialog-message"
    @click.self="close"
    @cancel.prevent="close"
    @close="clearAutoClose"
    @base-dialog-opened="startAutoClose"
  >
    <div class="dialog-container" dir="rtl">
      <button
        type="button"
        class="dialog-dismiss"
        aria-label="إغلاق الرسالة"
        @click="close"
      >
        ×
      </button>

      <div class="dialog-visual" aria-hidden="true">
        <span class="dialog-visual-ring"></span>
        <span class="dialog-icon-shell">
          <img src="" alt="" class="dialog-icon" />
        </span>
      </div>

      <div class="dialog-status" aria-hidden="true">
        <span class="dialog-status-dot"></span>
        <span class="dialog-status-success">تمت العملية بنجاح</span>
        <span class="dialog-status-error">تعذر إتمام العملية</span>
      </div>

      <div class="dialog-copy">
        <h4 id="base-dialog-title" class="dialog-title" dir="auto"></h4>
        <p id="base-dialog-message" class="dialog-message" dir="auto"></p>
      </div>

      <div class="dialog-actions">
        <button type="button" class="dialog-close-btn" @click="close">
          <span class="dialog-close-success">تم، شكرًا</span>
          <span class="dialog-close-error">إغلاق الرسالة</span>
          <span class="dialog-close-btn-icon dialog-close-success" aria-hidden="true">✓</span>
          <span class="dialog-close-btn-icon dialog-close-error" aria-hidden="true">×</span>
        </button>
        <small class="dialog-auto-close-note">
          <span class="dialog-auto-close-icon" aria-hidden="true"></span>
          ستُغلق هذه الرسالة تلقائيًا خلال لحظات
        </small>
      </div>

      <span class="dialog-countdown" aria-hidden="true"><i /></span>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  --dialog-accent: var(--primary-color, #1d9b68);
  --dialog-accent-strong: color-mix(in srgb, var(--dialog-accent) 82%, #062e24);
  --dialog-accent-soft: color-mix(in srgb, var(--dialog-accent) 11%, transparent);
  --dialog-accent-faint: color-mix(in srgb, var(--dialog-accent) 5%, transparent);
  width: min(430px, calc(100vw - 28px));
  max-width: none;
  max-height: calc(100dvh - 28px);
  margin: auto;
  padding: 0 !important;
  overflow: visible;
  border: 0;
  border-radius: 22px;
  background: transparent;
  color: var(--app-text, #152238);
}

.dialog[data-variant="error"] {
  --dialog-accent: #ef5260;
  --dialog-accent-strong: #bd2438;
}

.dialog[open] {
  animation: base-dialog-enter 0.34s cubic-bezier(0.2, 0.82, 0.25, 1) both;
}

.dialog::backdrop {
  background: rgb(6 13 28 / 68%);
  backdrop-filter: blur(5px) saturate(0.8);
  animation: base-dialog-backdrop 0.25s ease both;
}

.dialog-container {
  position: relative;
  display: flex !important;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  padding: 28px 28px 22px;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 18%, var(--app-line, #dfe5ec)) !important;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 0%, var(--dialog-accent-soft), transparent 36%),
    linear-gradient(180deg, var(--dialog-accent-faint), transparent 38%),
    var(--app-surface, #fff) !important;
  box-shadow:
    0 30px 80px rgb(4 10 24 / 32%),
    0 8px 24px rgb(4 10 24 / 16%),
    inset 0 1px 0 rgb(255 255 255 / 90%) !important;
  text-align: center;
}

.dialog-container::before {
  position: absolute;
  top: 0;
  right: 22%;
  left: 22%;
  height: 3px;
  border-radius: 0 0 999px 999px;
  background: linear-gradient(90deg, var(--dialog-accent), var(--secondary-color, var(--dialog-accent)));
  box-shadow: 0 3px 14px color-mix(in srgb, var(--dialog-accent) 32%, transparent);
  content: "";
}

.dialog-dismiss {
  position: absolute;
  z-index: 2;
  top: 16px;
  inset-inline-end: 16px;
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--app-line, #e2e7ed) 82%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--app-surface, #fff) 92%, transparent);
  color: var(--app-muted, #687386);
  font: 300 22px/1 Arial, sans-serif;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.dialog-dismiss:hover,
.dialog-dismiss:focus-visible {
  border-color: color-mix(in srgb, var(--dialog-accent) 45%, transparent);
  color: var(--dialog-accent-strong);
  outline: none;
  transform: rotate(6deg);
}

.dialog-visual {
  position: relative;
  display: grid;
  width: 94px;
  height: 94px;
  margin-top: 1px;
  place-items: center;
}

.dialog-visual-ring {
  position: absolute;
  inset: 2px;
  border: 1px dashed color-mix(in srgb, var(--dialog-accent) 30%, transparent);
  border-radius: 50%;
  animation: base-dialog-ring 16s linear infinite;
}

.dialog-icon-shell {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 20%, transparent);
  border-radius: 24px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--dialog-accent) 13%, #fff),
    var(--app-surface, #fff)
  );
  box-shadow:
    0 12px 28px color-mix(in srgb, var(--dialog-accent) 15%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 80%);
}

.dialog-icon {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 6px 8px rgb(7 14 28 / 10%));
}

.dialog-status {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 5px 11px;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 17%, transparent);
  border-radius: 999px;
  background: var(--dialog-accent-soft);
  color: var(--dialog-accent-strong);
  font-size: 11px;
  font-weight: 800;
}

.dialog-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--dialog-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--dialog-accent) 14%, transparent);
}

.dialog-status-error,
.dialog[data-variant="error"] .dialog-status-success {
  display: none;
}

.dialog[data-variant="error"] .dialog-status-error {
  display: inline;
}

.dialog-copy {
  display: grid;
  width: 100%;
  gap: 7px;
  margin-top: 14px;
}

.dialog-title {
  margin: 0 !important;
  color: var(--app-text, #17243a) !important;
  font-size: clamp(20px, 2.5vw, 23px);
  font-weight: 900 !important;
  line-height: 1.45;
  unicode-bidi: plaintext;
}

.dialog-message {
  width: min(100%, 340px);
  margin: 0 auto !important;
  overflow-wrap: anywhere;
  color: var(--app-muted, #667287) !important;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.75;
  unicode-bidi: plaintext;
}

.dialog-message:empty {
  display: none;
}

.dialog-actions {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
}

.dialog-close-btn {
  display: inline-flex;
  width: 100%;
  min-height: 48px;
  margin: 0 !important;
  padding: 9px 18px !important;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 88%, #fff) !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, var(--dialog-accent), var(--dialog-accent-strong)) !important;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--dialog-accent) 24%, transparent);
  color: #fff !important;
  font-family: inherit;
  font-size: 14px !important;
  font-weight: 900 !important;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.dialog-close-btn-icon {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  background: rgb(255 255 255 / 15%);
  font-size: 12px;
}

.dialog-close-error,
.dialog[data-variant="error"] .dialog-close-success {
  display: none;
}

.dialog[data-variant="error"] .dialog-close-error.dialog-close-btn-icon {
  display: grid;
}

.dialog[data-variant="error"] .dialog-close-error:not(.dialog-close-btn-icon) {
  display: inline;
}

.dialog-close-btn:hover,
.dialog-close-btn:focus-visible {
  box-shadow: 0 13px 28px color-mix(in srgb, var(--dialog-accent) 34%, transparent);
  outline: none;
  transform: translateY(-2px);
}

.dialog-auto-close-note {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--app-muted, #7a8494);
  font-size: 11px;
  font-weight: 600;
}

.dialog-auto-close-icon {
  position: relative;
  width: 13px;
  height: 13px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
}

.dialog-auto-close-icon::before {
  position: absolute;
  top: 2px;
  left: 5px;
  width: 1.5px;
  height: 4px;
  border-radius: 2px;
  background: currentColor;
  content: "";
  transform: rotate(-35deg);
  transform-origin: bottom center;
}

.dialog-countdown {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  overflow: hidden;
  background: var(--dialog-accent-soft);
}

.dialog-countdown i {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--dialog-accent), var(--secondary-color, var(--dialog-accent)));
  transform-origin: left center;
}

.dialog.is-counting .dialog-countdown i {
  animation: base-dialog-countdown var(--dialog-auto-close-duration, 6500ms) linear forwards;
}

:global(html[data-theme="dark"]) .dialog-container {
  border-color: color-mix(in srgb, var(--dialog-accent) 28%, #26334a) !important;
  background:
    radial-gradient(circle at 50% 0%, var(--dialog-accent-soft), transparent 38%),
    linear-gradient(180deg, var(--dialog-accent-faint), transparent 38%),
    #111a2a !important;
  box-shadow:
    0 40px 110px rgb(0 0 0 / 62%),
    0 16px 38px rgb(0 0 0 / 38%),
    inset 0 1px 0 rgb(255 255 255 / 5%) !important;
}

:global(html[data-theme="dark"]) .dialog-dismiss {
  border-color: #2a374c;
  background: #182337;
}

:global(html[data-theme="dark"]) .dialog-icon-shell {
  background: linear-gradient(145deg, color-mix(in srgb, var(--dialog-accent) 18%, #111a2a), #152035);
  box-shadow:
    0 12px 28px rgb(0 0 0 / 28%),
    inset 0 1px 0 rgb(255 255 255 / 5%);
}

@keyframes base-dialog-enter {
  from { opacity: 0; transform: translateY(22px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes base-dialog-backdrop {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes base-dialog-countdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

@keyframes base-dialog-ring {
  to { transform: rotate(360deg); }
}

@media (max-width: 520px) {
  .dialog-container {
    padding: 24px 18px 19px;
    border-radius: 19px;
  }

  .dialog-dismiss {
    top: 12px;
    inset-inline-end: 12px;
  }

  .dialog-visual { width: 84px; height: 84px; }
  .dialog-icon-shell { width: 68px; height: 68px; border-radius: 21px; }
  .dialog-icon { width: 56px; height: 56px; }
  .dialog-status { margin-top: 10px; }
  .dialog-copy { margin-top: 12px; }
  .dialog-actions { margin-top: 19px; }
}

@media (prefers-reduced-motion: reduce) {
  .dialog[open],
  .dialog::backdrop,
  .dialog-visual-ring,
  .dialog-countdown i {
    animation: none !important;
  }
}
</style>
