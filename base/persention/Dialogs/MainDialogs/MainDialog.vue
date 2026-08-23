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
        <img src="" alt="" class="dialog-icon" />
      </div>

      <div class="dialog-copy">
        <h4 id="base-dialog-title" class="dialog-title" dir="auto"></h4>
        <p id="base-dialog-message" class="dialog-message" dir="auto"></p>
      </div>

      <div class="dialog-actions">
        <button type="button" class="dialog-close-btn" @click="close">
          <span class="dialog-close-success">تم، شكرًا</span>
          <span class="dialog-close-error">إغلاق الرسالة</span>
        </button>
      </div>

      <span class="dialog-countdown" aria-hidden="true"><i /></span>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  --dialog-accent: var(--primary-color, #1d9b68);
  --dialog-accent-strong: color-mix(in srgb, var(--dialog-accent) 84%, #071526);
  --dialog-accent-soft: color-mix(in srgb, var(--dialog-accent) 10%, transparent);
  position: fixed;
  inset: 0;
  width: min(390px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 0 !important;
  overflow: hidden;
  border: 0;
  border-radius: 18px;
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
  background: rgb(6 13 28 / 58%);
  backdrop-filter: blur(3px);
  animation: base-dialog-backdrop 0.25s ease both;
}

.dialog-container {
  position: relative;
  display: grid !important;
  width: 100%;
  overflow: hidden;
  justify-items: center;
  align-items: center;
  padding: 32px 28px 26px;
  border: 1px solid var(--app-line, #dfe5ec) !important;
  border-radius: 18px;
  background: var(--app-surface, #fff) !important;
  box-shadow: 0 24px 64px rgb(4 10 24 / 24%) !important;
  text-align: center;
}

.dialog-dismiss {
  position: absolute;
  z-index: 2;
  top: 14px;
  inset-inline-end: 14px;
  display: grid;
  width: 32px;
  height: 32px;
  padding: 0;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--app-line, #e2e7ed) 82%, transparent);
  border-radius: 50%;
  background: var(--app-surface-raised, #f7f9fb);
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
  transform: none;
}

.dialog-visual {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border-radius: 50%;
  background: var(--dialog-accent-soft);
}

.dialog-visual[hidden] {
  display: none;
}

.dialog-icon {
  display: block;
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.dialog-copy {
  display: grid;
  width: 100%;
  justify-items: center;
  gap: 8px;
  margin-top: 18px;
}

.dialog-title {
  margin: 0 !important;
  color: var(--app-text, #17243a) !important;
  font-size: clamp(19px, 2.5vw, 22px);
  font-weight: 900 !important;
  line-height: 1.45;
  unicode-bidi: plaintext;
}

.dialog-message {
  width: min(100%, 310px);
  margin: 0 auto !important;
  overflow-wrap: anywhere;
  color: var(--app-muted, #667287) !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.7;
  unicode-bidi: plaintext;
}

.dialog-message:empty {
  display: none;
}

.dialog-actions {
  display: grid;
  width: 100%;
  justify-items: center;
  margin-top: 20px;
}

.dialog-close-btn {
  display: inline-flex;
  width: 100%;
  min-height: 46px;
  margin: 0 !important;
  padding: 9px 18px !important;
  align-items: center;
  justify-content: center;
  border: 0 !important;
  border-radius: 11px !important;
  background: var(--dialog-accent) !important;
  box-shadow: none;
  color: #fff !important;
  font-family: inherit;
  font-size: 13px !important;
  font-weight: 900 !important;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.dialog-close-error,
.dialog[data-variant="error"] .dialog-close-success {
  display: none;
}

.dialog[data-variant="error"] .dialog-close-error {
  display: inline;
}

.dialog-close-btn:hover,
.dialog-close-btn:focus-visible {
  filter: brightness(0.94);
  outline: none;
  transform: translateY(-1px);
}

.dialog-countdown {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  overflow: hidden;
  background: var(--dialog-accent-soft);
}

.dialog-countdown i {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--dialog-accent);
  transform-origin: left center;
}

.dialog.is-counting .dialog-countdown i {
  animation: base-dialog-countdown var(--dialog-auto-close-duration, 6500ms) linear forwards;
}

:global(html[data-theme="dark"]) .dialog-container {
  border-color: #26334a !important;
  background: var(--app-surface, #111a2a) !important;
  box-shadow: 0 28px 72px rgb(0 0 0 / 48%) !important;
}

:global(html[data-theme="dark"]) .dialog-dismiss {
  border-color: #2a374c;
  background: #182337;
}

@keyframes base-dialog-enter {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
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

@media (max-width: 520px) {
  .dialog-container {
    padding: 28px 20px 22px;
    border-radius: 16px;
  }

  .dialog-dismiss {
    top: 12px;
    inset-inline-end: 12px;
  }

  .dialog-visual { width: 66px; height: 66px; }
  .dialog-icon { width: 52px; height: 52px; }
  .dialog-copy { margin-top: 16px; }
  .dialog-actions { margin-top: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .dialog[open],
  .dialog::backdrop,
  .dialog-countdown i {
    animation: none !important;
  }
}
</style>
