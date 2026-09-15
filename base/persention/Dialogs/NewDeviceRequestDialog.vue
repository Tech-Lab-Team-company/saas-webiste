<script setup lang="ts">
import { ref } from 'vue'
import NewDeviceRequestParams from '~/features/LoginFeature/Core/Params/new_device_request_params'
import NewDeviceRequestController from '~/features/LoginFeature/presentation/controllers/new_device_request_controller'


const dialogRef = ref<HTMLDialogElement | null>(null)

const name = ref('')
const phone = ref('')
const comment = ref('')

const isLoading = ref(false)

const controller =
  NewDeviceRequestController.getInstance()

const resetForm = () => {
  name.value = ''
  phone.value = ''
  comment.value = ''
}

const open = () => {
  resetForm()

  if (!dialogRef.value) {
    return
  }

  if (dialogRef.value.open) {
    dialogRef.value.close()
  }

  dialogRef.value.showModal()
}

const close = () => {
  if (isLoading.value) {
    return
  }

  dialogRef.value?.close()
}

const submit = async () => {
  if (isLoading.value) {
    return
  }

  const trimmedName = name.value.trim()
  const trimmedPhone = phone.value.trim()
  const trimmedComment = comment.value.trim()

  if (!trimmedName || !trimmedPhone) {
    return
  }

  isLoading.value = true

  try {
    const params =
      new NewDeviceRequestParams(
        trimmedName,
        trimmedPhone,
        trimmedComment,
      )

    const success =
      await controller.requestNewDevice(params)

    if (success) {
      dialogRef.value?.close()
    }
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="new-device-request-dialog"
    @click.self="close"
    @cancel.prevent="close"
  >
    <div
      class="request-dialog-container"
      dir="rtl"
    >
      <button
        type="button"
        class="dialog-dismiss"
        aria-label="إغلاق"
        @click="close"
      >
        ×
      </button>

      <div class="request-dialog-header">
        <div class="request-icon">
          +
        </div>

        <h2 class="request-title">
          طلب تسجيل جهاز جديد
        </h2>

        <p class="request-message">
          برجاء إدخال البيانات لإرسال طلب تسجيل الجهاز.
        </p>
      </div>

      <div class="request-form">

        <div class="form-group">
          <label for="new-device-name">
            الاسم
          </label>

          <input
            id="new-device-name"
            v-model="name"
            type="text"
            placeholder="أدخل الاسم"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="new-device-phone">
            رقم الهاتف
          </label>

          <input
            id="new-device-phone"
            v-model="phone"
            type="tel"
            placeholder="أدخل رقم الهاتف"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="new-device-comment">
            التعليق
          </label>

          <textarea
            id="new-device-comment"
            v-model="comment"
            rows="4"
            placeholder="اكتب تعليقك"
            :disabled="isLoading"
          />
        </div>

      </div>

      <div class="request-actions">

        <button
          type="button"
          class="cancel-button"
          :disabled="isLoading"
          @click="close"
        >
          إلغاء
        </button>

        <button
          type="button"
          class="submit-button"
          :disabled="
            isLoading ||
            !name.trim() ||
            !phone.trim()
          "
          @click="submit"
        >
          {{
            isLoading
              ? 'جاري الإرسال...'
              : 'إرسال طلب جهاز'
          }}
        </button>

      </div>
    </div>
  </dialog>
</template>

<style scoped>
.new-device-request-dialog {
  position: fixed;
  inset: 0;

  width: min(430px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100dvh - 32px);

  margin: auto;
  padding: 0;

  border: 0;
  border-radius: 18px;

  background: transparent;
  color: var(--app-text, #152238);
}

.new-device-request-dialog::backdrop {
  background: rgb(6 13 28 / 58%);
  backdrop-filter: blur(3px);
}

.request-dialog-container {
  position: relative;

  width: 100%;

  padding: 30px 26px 24px;

  border: 1px solid
    var(--app-line, #dfe5ec);

  border-radius: 18px;

  background:
    var(--app-surface, #fff);

  box-shadow:
    0 24px 64px rgb(4 10 24 / 24%);
}

.dialog-dismiss {
  position: absolute;

  top: 14px;
  inset-inline-end: 14px;

  display: grid;

  width: 32px;
  height: 32px;

  padding: 0;

  place-items: center;

  border: 1px solid
    color-mix(
      in srgb,
      var(--app-line, #e2e7ed) 82%,
      transparent
    );

  border-radius: 50%;

  background:
    var(--app-surface-raised, #f7f9fb);

  color:
    var(--app-muted, #687386);

  font: 300 22px/1 Arial, sans-serif;

  cursor: pointer;
}

.request-dialog-header {
  display: grid;

  justify-items: center;

  margin-bottom: 22px;

  text-align: center;
}

.request-icon {
  display: grid;

  width: 58px;
  height: 58px;

  margin-bottom: 14px;

  place-items: center;

  border-radius: 50%;

  background: rgb(29 155 104 / 10%);

  color: #1d9b68;

  font-size: 30px;
  font-weight: 400;
}

.request-title {
  margin: 0 0 8px;

  color:
    var(--app-text, #17243a);

  font-size: 21px;

  font-weight: 900;
}

.request-message {
  width: min(100%, 330px);

  margin: 0;

  color:
    var(--app-muted, #667287);

  font-size: 13px;

  line-height: 1.7;
}

.request-form {
  display: grid;

  gap: 15px;
}

.form-group {
  display: grid;

  gap: 7px;
}

.form-group label {
  color:
    var(--app-text, #17243a);

  font-size: 13px;

  font-weight: 800;
}

.form-group input,
.form-group textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 11px 13px;

  border: 1px solid
    var(--app-line, #dfe5ec);

  border-radius: 10px;

  background:
    var(--app-surface-raised, #f7f9fb);

  color:
    var(--app-text, #152238);

  font-family: inherit;

  font-size: 13px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group textarea {
  min-height: 95px;

  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #1d9b68;

  box-shadow:
    0 0 0 3px rgb(29 155 104 / 10%);
}

.request-actions {
  display: grid;

  grid-template-columns: 1fr 1.4fr;

  gap: 10px;

  margin-top: 22px;
}

.request-actions button {
  min-height: 45px;

  padding: 9px 16px;

  border-radius: 11px;

  font-family: inherit;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}

.cancel-button {
  border: 1px solid
    var(--app-line, #dfe5ec);

  background: transparent;

  color:
    var(--app-muted, #687386);
}

.submit-button {
  border: 0;

  background: #1d9b68;

  color: #fff;
}

.request-actions button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

:global(html[data-theme='dark'])
.request-dialog-container {
  border-color: #26334a;

  background:
    var(--app-surface, #111a2a);

  box-shadow:
    0 28px 72px rgb(0 0 0 / 48%);
}

:global(html[data-theme='dark'])
.form-group input,
:global(html[data-theme='dark'])
.form-group textarea {
  border-color: #2a374c;

  background: #182337;
}

@media (max-width: 520px) {
  .request-dialog-container {
    padding: 28px 20px 22px;
  }
}
</style>