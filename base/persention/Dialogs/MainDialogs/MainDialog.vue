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
    <div class="dialog-container">
      <button
        type="button"
        class="dialog-dismiss"
        aria-label="إغلاق الرسالة"
        @click="close"
      >
        ×
      </button>
      <span class="dialog-icon-shell" aria-hidden="true">
        <img src="" alt="" class="dialog-icon" />
      </span>
      <div class="dialog-copy">
        <h4 id="base-dialog-title" class="dialog-title" dir="auto"></h4>
        <p id="base-dialog-message" class="dialog-message" dir="auto"></p>
      </div>
      <div class="dialog-actions">
        <small class="dialog-auto-close-note">سيتم إغلاق الرسالة تلقائيًا</small>
        <button type="button" class="dialog-close-btn" @click="close">حسنًا</button>
      </div>
      <span class="dialog-countdown" aria-hidden="true"><i /></span>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  --dialog-accent: #1d9b68;
  --dialog-accent-strong: #087b50;
  --dialog-accent-soft: rgba(29, 155, 104, 0.11);
  width: min(470px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 0 !important;
  overflow: visible;
  border: 0;
  border-radius: 24px;
  background: transparent;
  color: var(--app-text, #152238);
}

.dialog[data-variant="error"] {
  --dialog-accent: #ef5260;
  --dialog-accent-strong: #c52c40;
  --dialog-accent-soft: rgba(239, 82, 96, 0.11);
}

.dialog[open] {
  animation: base-dialog-enter 0.34s cubic-bezier(0.2, 0.82, 0.25, 1) both;
}

.dialog::backdrop {
  background: rgba(5, 10, 22, 0.64);
  backdrop-filter: blur(7px) saturate(0.82);
  animation: base-dialog-backdrop 0.25s ease both;
}

.dialog-container {
  position: relative;
  display: grid !important;
  overflow: hidden;
  place-items: center;
  padding: 30px 30px 24px;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 22%, #dfe5ec) !important;
  border-radius: 24px;
  background:
    radial-gradient(circle at 50% -14%, var(--dialog-accent-soft), transparent 40%),
    var(--app-surface, #fff) !important;
  box-shadow:
    0 38px 100px rgba(4, 10, 24, 0.32),
    0 14px 35px rgba(4, 10, 24, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.92) !important;
  text-align: center;
}

.dialog-container::before {
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--dialog-accent), transparent);
  content: "";
}

.dialog-dismiss {
  position: absolute;
  z-index: 2;
  top: 14px;
  inset-inline-end: 14px;
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--app-line, #e2e7ed);
  border-radius: 50%;
  background: color-mix(in srgb, var(--app-surface, #fff) 88%, transparent);
  color: var(--app-muted, #687386);
  font: 400 23px/1 Arial, sans-serif;
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

.dialog-icon-shell {
  display: grid;
  width: 112px;
  height: 112px;
  margin-top: 2px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 18%, transparent);
  border-radius: 32px;
  background: var(--dialog-accent-soft);
  box-shadow:
    0 14px 30px color-mix(in srgb, var(--dialog-accent) 16%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.dialog-icon {
  display: block;
  width: 90px;
  height: 90px;
  object-fit: contain;
  filter: drop-shadow(0 8px 8px rgba(7, 14, 28, 0.12));
}

.dialog-copy {
  display: grid;
  width: 100%;
  gap: 9px;
  margin-top: 20px;
}

.dialog-title {
  margin: 0 !important;
  color: var(--app-text, #17243a) !important;
  font-size: clamp(19px, 2.5vw, 23px);
  font-weight: 900 !important;
  line-height: 1.45;
}

.dialog-message {
  width: 100%;
  margin: 0 !important;
  overflow-wrap: anywhere;
  color: var(--app-muted, #667287) !important;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.8;
  unicode-bidi: plaintext;
}

.dialog-actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--app-line, #e7eaf0);
}

.dialog-auto-close-note {
  color: var(--app-muted, #7a8494);
  font-size: 11px;
  font-weight: 700;
}

.dialog-close-btn {
  min-width: 112px;
  min-height: 44px;
  margin: 0 !important;
  padding: 8px 20px !important;
  border: 1px solid color-mix(in srgb, var(--dialog-accent) 88%, #fff) !important;
  border-radius: 12px !important;
  background: var(--dialog-accent) !important;
  box-shadow: 0 9px 20px color-mix(in srgb, var(--dialog-accent) 24%, transparent);
  color: #fff !important;
  font-family: inherit;
  font-size: 14px !important;
  font-weight: 900 !important;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.dialog-close-btn:hover,
.dialog-close-btn:focus-visible {
  box-shadow: 0 12px 25px color-mix(in srgb, var(--dialog-accent) 34%, transparent);
  outline: none;
  transform: translateY(-2px);
}

.dialog-countdown {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4px;
  overflow: hidden;
  background: var(--dialog-accent-soft);
}

.dialog-countdown i {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--dialog-accent-strong), var(--dialog-accent));
  transform-origin: left center;
}

.dialog.is-counting .dialog-countdown i {
  animation: base-dialog-countdown var(--dialog-auto-close-duration, 6500ms) linear forwards;
}

:global(html[data-theme="dark"]) .dialog-container {
  border-color: color-mix(in srgb, var(--dialog-accent) 28%, #26334a) !important;
  background:
    radial-gradient(circle at 50% -14%, var(--dialog-accent-soft), transparent 42%),
    #111a2a !important;
  box-shadow:
    0 40px 110px rgba(0, 0, 0, 0.62),
    0 16px 38px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
}

:global(html[data-theme="dark"]) .dialog-dismiss {
  border-color: #2a374c;
  background: #182337;
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

@media (max-width: 520px) {
  .dialog-container { padding: 26px 20px 20px; border-radius: 20px; }
  .dialog-icon-shell { width: 94px; height: 94px; border-radius: 27px; }
  .dialog-icon { width: 76px; height: 76px; }
  .dialog-actions { align-items: stretch; flex-direction: column-reverse; gap: 10px; }
  .dialog-close-btn { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .dialog[open],
  .dialog::backdrop,
  .dialog-countdown i {
    animation: none !important;
  }
}
</style>
