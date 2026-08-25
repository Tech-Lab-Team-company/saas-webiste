<script setup lang="ts">
import ScanCodeParams from "~/features/ScanCode/Core/Params/scan_code_params";
import ScanCodeController from "~/features/ScanCode/presentation/controllers/scan_code_controller";

const visible = ref(false);
const code = ref("");
const errorMessage = ref("");
const submitting = ref(false);
const showHint = ref(true);
const codeInput = ref<HTMLInputElement | null>(null);
const controller = ScanCodeController.getInstance();
let hintTimer: ReturnType<typeof setTimeout> | null = null;

const hideHint = () => {
  showHint.value = false;
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = null;
};

const openDialog = () => {
  hideHint();
  errorMessage.value = "";
  visible.value = true;
};

const focusCodeInput = () => {
  requestAnimationFrame(() => codeInput.value?.focus());
};

const submitCode = async () => {
  const normalizedCode = code.value.trim();
  if (!normalizedCode) {
    errorMessage.value = "اكتب الكود أولًا";
    codeInput.value?.focus();
    return;
  }

  errorMessage.value = "";
  submitting.value = true;
  try {
    const succeeded = await controller.scanCode(
      new ScanCodeParams(normalizedCode),
    );
    if (succeeded) {
      visible.value = false;
      code.value = "";
      await refreshNuxtData();
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  hintTimer = setTimeout(hideHint, 5000);
});

onBeforeUnmount(() => {
  if (hintTimer) clearTimeout(hintTimer);
});
</script>

<template>
  <div class="scan_qr">
    <button
      type="button"
      class="card_qr"
      aria-label="إدخال كود الكورس"
      aria-haspopup="dialog"
      :aria-expanded="visible"
      @click="openDialog"
    >
      <span
        class="card_qr__hint"
        :class="{ 'card_qr__hint--visible': showHint }"
        aria-hidden="true"
      >
        <strong>معاك كود؟</strong>
        <small>اضغط هنا لتفعيل المحتوى</small>
      </span>
      <span class="image" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7h-4a6 6 0 0 0-6 6v4M31 7h4a6 6 0 0 1 6 6v4M41 31v4a6 6 0 0 1-6 6h-4M17 41h-4a6 6 0 0 1-6-6v-4" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" />
          <rect x="14" y="14" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="2.4" />
          <rect x="26" y="14" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="2.4" />
          <rect x="14" y="26" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="2.4" />
          <path d="M27 27h3v3h4v4h-7v-7Z" fill="currentColor" />
        </svg>
      </span>
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      dismissable-mask
      :draggable="false"
      :close-on-escape="!submitting"
      :closable="!submitting"
      :style="{ width: 'min(29rem, calc(100vw - 24px))' }"
      class="qr-code-dialog"
      aria-labelledby="qr-code-title"
      dir="rtl"
      @show="focusCodeInput"
    >
      <template #header>
        <div class="qr-code-dialog__header">
          <span class="qr-code-dialog__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2.2" />
              <rect x="19" y="4" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2.2" />
              <rect x="4" y="19" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2.2" />
              <path d="M19 19h4v4h5v5h-9v-9Z" fill="currentColor" />
            </svg>
          </span>
          <span class="qr-code-dialog__heading">
            <strong id="qr-code-title">فعّل كود المحتوى</strong>
            <small>أدخل الكود لإضافته مباشرة إلى حسابك</small>
          </span>
        </div>
      </template>

      <form class="qr-code-form" novalidate @submit.prevent="submitCode">
        <!-- 
        <div class="qr-code-guide">
          <span class="pi pi-sparkles" aria-hidden="true" />
          <p>
            استخدم الكود الموجود على الكارت أو الذي استلمته من المنصة.
          </p>
        </div> -->

        <label class="qr-code-field" for="course-code">
          <span>كود التفعيل</span>
          <span class="qr-code-input">
            <span class="qr-code-input__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M8 8h3v3H8zM14 8h3v3h-3zM8 14h3v3H8z" fill="currentColor" />
                <path d="M14 14h1.5v1.5H17V17h-3v-3Z" fill="currentColor" />
              </svg>
            </span>
            <input
              id="course-code"
              ref="codeInput"
              v-model="code"
              type="text"
              inputmode="text"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="مثال: ABCD-1234"
              :aria-invalid="Boolean(errorMessage)"
              :aria-describedby="errorMessage ? 'course-code-error' : 'course-code-help'"
              :disabled="submitting"
              @input="errorMessage = ''"
            />
          </span>
        </label>
        <small v-if="errorMessage" id="course-code-error" class="qr-code-error" role="alert">
          {{ errorMessage }}
        </small>
        <small v-else id="course-code-help" class="qr-code-help">
          راجع الحروف والأرقام قبل التفعيل.
        </small>
        <button class="btn_save_qr" type="submit" :disabled="submitting">
          <i v-if="submitting" class="pi pi-spin pi-spinner" aria-hidden="true" />
          <span v-else class="pi pi-check-circle" aria-hidden="true" />
          <span>{{ submitting ? "جاري التحقق..." : "تفعيل الكود" }}</span>
        </button>
        <p class="qr-code-privacy">
          <span class="pi pi-shield" aria-hidden="true" />
          سيتم ربط المحتوى بهذا الحساب بعد التحقق من الكود.
        </p>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.scan_qr { display:contents; }
.card_qr { position:fixed; z-index:9998; right:max(16px, env(safe-area-inset-right)); bottom:max(24px, env(safe-area-inset-bottom)); display:grid; width:60px; height:60px; padding:0; place-items:center; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 68%, white); border-radius:50%; background:linear-gradient(145deg, var(--app-accent, #28366c), color-mix(in srgb, var(--app-accent-secondary, #3a3e7e) 82%, #071020)); box-shadow:0 14px 34px color-mix(in srgb, var(--app-accent, #28366c) 34%, transparent); color:var(--app-accent, #28366c); cursor:pointer; isolation:isolate; transition:transform .2s ease, box-shadow .2s ease; }
.card_qr::before { position:absolute; z-index:-1; inset:-6px; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 32%, transparent); border-radius:inherit; content:""; animation:qr-button-pulse 2.6s ease-out infinite; }
.card_qr:hover,.card_qr:focus-visible { outline:3px solid color-mix(in srgb, var(--app-accent, #28366c) 24%, transparent); outline-offset:3px; box-shadow:0 18px 42px color-mix(in srgb, var(--app-accent, #28366c) 42%, transparent); transform:translateY(-3px) scale(1.03); }
.card_qr__hint { position:absolute; inset-inline-end:calc(100% + 13px); display:grid; width:max-content; max-width:min(210px,calc(100vw - 100px)); gap:1px; padding:9px 12px; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 18%, var(--app-line, #d9e1ed)); border-radius:11px; background:color-mix(in srgb, var(--app-surface-raised, #fff) 96%, transparent); box-shadow:0 12px 30px color-mix(in srgb, var(--app-accent, #28366c) 16%, transparent); color:var(--app-text, #081b3a); direction:rtl; opacity:0; pointer-events:none; text-align:start; transform:translateX(7px) scale(.97); transform-origin:right center; transition:opacity .22s ease, transform .28s cubic-bezier(.22,1,.36,1); }
.card_qr__hint::after { position:absolute; top:50%; right:-5px; width:9px; height:9px; border-top:1px solid color-mix(in srgb, var(--app-accent, #28366c) 18%, var(--app-line, #d9e1ed)); border-right:1px solid color-mix(in srgb, var(--app-accent, #28366c) 18%, var(--app-line, #d9e1ed)); background:var(--app-surface-raised, #fff); content:""; transform:translateY(-50%) rotate(45deg); }
.card_qr__hint strong { color:var(--app-accent, #28366c); font-size:12px; font-weight:900; line-height:1.45; }
.card_qr__hint small { color:var(--app-muted, #4f617c); font-size:10px; font-weight:700; line-height:1.45; white-space:nowrap; }
.card_qr__hint--visible,.card_qr:hover .card_qr__hint,.card_qr:focus-visible .card_qr__hint { opacity:1; transform:translateX(0) scale(1); }
.image { display:grid; width:42px; height:42px; place-items:center; border-radius:50%; background:var(--app-surface-raised, #fff); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--app-accent, #28366c) 12%, transparent); }
.image svg { width:31px; height:31px; }
:global(.qr-code-dialog.p-dialog) { overflow:hidden; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 18%, var(--app-line, #d8dee8)); border-radius:20px; background:var(--app-surface, #fff); box-shadow:0 28px 80px -26px var(--app-shadow, rgb(8 18 38 / 42%)); color:var(--app-text, #081b3a); }
:global(.qr-code-dialog .p-dialog-header) { min-height:78px; padding:20px 22px; border-bottom:1px solid var(--app-line, #e3e7ee); background:radial-gradient(circle at 10% 0, color-mix(in srgb, var(--app-accent, #28366c) 13%, transparent), transparent 42%),var(--app-surface, #fff); color:var(--app-text, #081b3a); font-family:inherit; }
:global(.qr-code-dialog .p-dialog-header-actions) { margin-inline-start:auto; margin-inline-end:10px; }
:global(.qr-code-dialog .p-dialog-close-button) { width:36px; height:36px; border:1px solid var(--app-line, #dce2ea); border-radius:11px; background:var(--app-surface-raised, #fff); color:var(--app-muted, #61728d); }
:global(.qr-code-dialog .p-dialog-close-button:hover) { border-color:color-mix(in srgb, var(--app-accent, #28366c) 34%, var(--app-line, #dce2ea)); background:color-mix(in srgb, var(--app-accent, #28366c) 8%, var(--app-surface-raised, #fff)); color:var(--app-accent, #28366c); }
:global(.qr-code-dialog .p-dialog-content) { padding:22px; background:var(--app-surface, #fff); color:var(--app-text, #081b3a); }
.qr-code-dialog__header { display:flex; min-width:0; align-items:center; gap:12px; text-align:start; }
.qr-code-dialog__icon { display:grid; width:46px; height:46px; flex:0 0 46px; place-items:center; border-radius:14px; background:color-mix(in srgb, var(--app-accent, #28366c) 12%, var(--app-surface-raised, #fff)); color:var(--app-accent, #28366c); }
.qr-code-dialog__icon svg { width:27px; height:27px; }
.qr-code-dialog__heading { display:grid; min-width:0; gap:3px; }
.qr-code-dialog__heading strong { color:var(--app-text, #081b3a); font-size:18px; font-weight:900; line-height:1.35; }
.qr-code-dialog__heading small { overflow:hidden; color:var(--app-muted, #4f617c); font-size:12px; text-overflow:ellipsis; white-space:nowrap; }
.qr-code-form { display:grid; }
.qr-code-guide { display:flex; align-items:flex-start; gap:9px; margin-bottom:20px; padding:12px 14px; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 16%, var(--app-line, #dce2ea)); border-radius:12px; background:color-mix(in srgb, var(--app-accent, #28366c) 7%, var(--app-bg-muted, #f2f6fc)); color:var(--app-muted, #4f617c); }
.qr-code-guide > span { margin-top:3px; color:var(--app-accent, #28366c); font-size:14px; }
.qr-code-guide p { margin:0; font-size:12px; font-weight:600; line-height:1.8; }
.qr-code-field { display:grid; gap:8px; color:var(--app-text, #081b3a); font-size:13px; font-weight:800; text-align:start; }
.qr-code-input { position:relative; display:block; }
.qr-code-input__icon { position:absolute; z-index:1; top:50%; inset-inline-start:13px; display:grid; width:24px; height:24px; place-items:center; color:var(--app-accent, #28366c); pointer-events:none; transform:translateY(-50%); }
.qr-code-input__icon svg { width:22px; height:22px; }
.qr-code-field input { width:100%; min-width:0; height:50px; padding:10px 48px 10px 13px; border:1px solid var(--app-line, #c8d3e1); border-radius:11px; background:var(--app-surface-raised, #fff); color:var(--app-text, #25354d); font:700 14px inherit; letter-spacing:.04em; direction:ltr; outline:0; text-align:left; transition:border-color .2s ease, box-shadow .2s ease, background-color .2s ease; }
.qr-code-field input::placeholder { color:color-mix(in srgb, var(--app-muted, #4f617c) 68%, transparent); font-weight:500; letter-spacing:0; }
.qr-code-field input:focus { border-color:var(--app-accent, #28366c); box-shadow:0 0 0 4px color-mix(in srgb, var(--app-accent, #28366c) 14%, transparent); }
.qr-code-field input[aria-invalid="true"] { border-color:#dc4a4a; box-shadow:0 0 0 4px rgb(220 74 74 / 10%); }
.qr-code-error,.qr-code-help { margin:7px 2px 0; font-size:11px; text-align:start; }
.qr-code-error { color:#d14343; }
.qr-code-help { color:var(--app-muted, #4f617c); }
.btn_save_qr { display:inline-flex; width:100%; min-height:48px; margin-top:22px; align-items:center; justify-content:center; gap:9px; border:1px solid color-mix(in srgb, var(--app-accent, #28366c) 72%, white); border-radius:11px; background:linear-gradient(135deg, var(--app-accent, #28366c), color-mix(in srgb, var(--app-accent-secondary, #3a3e7e) 84%, var(--app-accent, #28366c))); box-shadow:0 12px 26px color-mix(in srgb, var(--app-accent, #28366c) 24%, transparent); color:#fff; font:800 14px inherit; cursor:pointer; transition:filter .2s ease, transform .2s ease, box-shadow .2s ease; }
.btn_save_qr:hover:not(:disabled),.btn_save_qr:focus-visible { filter:brightness(1.06); outline:3px solid color-mix(in srgb, var(--app-accent, #28366c) 22%, transparent); outline-offset:2px; box-shadow:0 15px 32px color-mix(in srgb, var(--app-accent, #28366c) 32%, transparent); transform:translateY(-1px); }
.btn_save_qr:disabled { opacity:.68; cursor:wait; }
.qr-code-privacy { display:flex; align-items:center; justify-content:center; gap:6px; margin:13px 0 0; color:var(--app-muted, #4f617c); font-size:10px; line-height:1.6; text-align:center; }
.qr-code-privacy span { color:var(--app-accent, #28366c); }
@keyframes qr-button-pulse { 0% { opacity:.72; transform:scale(.94); } 70%,100% { opacity:0; transform:scale(1.22); } }
@media (max-width:820px) { .card_qr { right:max(14px, env(safe-area-inset-right)); bottom:max(88px, calc(env(safe-area-inset-bottom) + 74px)); } }
@media (max-width:600px) { .card_qr__hint { inset-inline-end:calc(100% + 10px); max-width:calc(100vw - 92px); padding:8px 10px; } .card_qr__hint small { font-size:9px; white-space:normal; } }
@media (max-width:420px) { :global(.qr-code-dialog .p-dialog-header) { min-height:70px; padding:16px; } :global(.qr-code-dialog .p-dialog-content) { padding:18px 16px; } .qr-code-dialog__icon { width:40px; height:40px; flex-basis:40px; border-radius:12px; } .qr-code-dialog__heading strong { font-size:16px; } .qr-code-dialog__heading small { max-width:220px; font-size:10px; } .qr-code-guide { margin-bottom:16px; padding:10px 12px; } }
@media (prefers-reduced-motion:reduce) { .card_qr,.card_qr__hint,.btn_save_qr { transition:none; } .card_qr::before { animation:none; } }
</style>
