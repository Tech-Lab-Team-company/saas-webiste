<script setup lang="ts">
import Dialog from "primevue/dialog";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import FetchPaymentMethodsParams from "~/features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "~/features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";

const props = defineProps<{
  bookId: number;
  title: string;
  price: number;
  currency: string;
  optionLabel: string;
}>();

const emit = defineEmits<{ purchased: [] }>();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const paymentStore = usePaymentStore();
const toast = useToast();

const visible = ref(false);
const mode = ref<"join" | "offline">("offline");
const selectedPaymentMethodId = ref<number | null>(null);
const transferredAccount = ref("");
const loadingMethods = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const success = ref(false);

const paymentMethods = computed(() => paymentStore.Payment ?? []);
const selectedMethod = computed(() =>
  paymentMethods.value.find((method) => method.id === selectedPaymentMethodId.value),
);

const loadPaymentMethods = async () => {
  if (paymentMethods.value.length) return;

  loadingMethods.value = true;
  try {
    const state = await FetchPaymentMethodController.getInstance().FetchPaymentMthod(
      new FetchPaymentMethodsParams(1),
    );
    if (state.value.data) paymentStore.setPayment(state.value.data);
  } finally {
    loadingMethods.value = false;
  }
};

const open = async () => {
  if (!userStore.user) {
    toast.add({
      severity: "info",
      summary: "سجّل دخولك أولًا",
      detail: "يلزم تسجيل الدخول لإتمام شراء الكتاب.",
      life: 3500,
    });
    await router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }

  errorMessage.value = "";
  success.value = false;
  visible.value = true;
  await loadPaymentMethods();
};

const validate = () => {
  if (mode.value === "join") return true;
  if (selectedPaymentMethodId.value === null) {
    errorMessage.value = "اختر وسيلة الدفع التي استخدمتها.";
    return false;
  }
  if (transferredAccount.value.trim().length < 6) {
    errorMessage.value = "أدخل رقم الحساب أو الهاتف الذي تم التحويل منه.";
    return false;
  }
  return true;
};

const submit = async () => {
  errorMessage.value = "";
  if (!validate()) return;

  submitting.value = true;
  try {
    const payload = mode.value === "join"
      ? { book_id: props.bookId, subscription_type: 5 }
      : {
          book_id: props.bookId,
          subscription_type: 1,
          payment_method_id: selectedPaymentMethodId.value,
          transferred_account: transferredAccount.value.trim(),
        };

    await NetworkService.instance.post({
      url: ApiNames.Instance.buy_product,
      data: payload,
      isAuth: true,
    });

    success.value = true;
    emit("purchased");
  } catch (error: any) {
    const responseMessage = error?.response?.data?.message;
    const validationErrors = error?.response?.data?.errors;
    errorMessage.value = responseMessage
      || (validationErrors && typeof validationErrors === "object"
        ? Object.values(validationErrors).flat().join(" ")
        : "تعذر إرسال طلب الشراء. راجع البيانات وحاول مرة أخرى.");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <button type="button" class="buy-book-trigger" @click="open">
    شراء هذه النسخة
    <span aria-hidden="true">←</span>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :draggable="false"
    :style="{ width: 'min(620px, 94vw)' }"
    class="buy-book-dialog"
    dir="rtl"
  >
    <template #header>
      <div class="buy-book-dialog__header">
        <span>إتمام شراء الكتاب</span>
        <small>{{ title }}</small>
      </div>
    </template>

    <div v-if="success" class="buy-book-dialog__success" role="status">
      <span aria-hidden="true">✓</span>
      <h3>تم إرسال طلبك بنجاح</h3>
      <p>سنراجع الطلب، وستظهر حالة الاشتراك على حسابك فور اعتماده.</p>
      <button type="button" @click="visible = false">تم</button>
    </div>

    <form v-else class="buy-book-dialog__form" @submit.prevent="submit">
      <div class="buy-book-dialog__summary">
        <div>
          <small>النسخة المختارة</small>
          <strong>{{ optionLabel }}</strong>
        </div>
        <b>{{ price }} {{ currency }}</b>
      </div>

      <fieldset class="buy-book-dialog__modes">
        <legend>كيف تريد إتمام الطلب؟</legend>
        <label :class="{ active: mode === 'offline' }">
          <input v-model="mode" type="radio" value="offline" />
          <span><b>دفعت بتحويل</b><small>أرسل بيانات التحويل للمراجعة</small></span>
        </label>
        <label :class="{ active: mode === 'join' }">
          <input v-model="mode" type="radio" value="join" />
          <span><b>طلب انضمام</b><small>أرسل طلبًا بدون بيانات دفع</small></span>
        </label>
      </fieldset>

      <template v-if="mode === 'offline'">
        <div class="buy-book-dialog__section-title">
          <b>وسيلة الدفع</b>
          <small>اختر الوسيلة التي حوّلت إليها</small>
        </div>
        <p v-if="loadingMethods" class="buy-book-dialog__hint">جاري تحميل وسائل الدفع...</p>
        <p v-else-if="!paymentMethods.length" class="buy-book-dialog__error">
          لا توجد وسائل دفع متاحة حاليًا.
        </p>
        <div v-else class="buy-book-dialog__methods">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            :class="{ active: selectedPaymentMethodId === method.id }"
          >
            <input v-model="selectedPaymentMethodId" type="radio" :value="method.id" />
            <img v-if="method.image" :src="method.image" alt="" />
            <span>
              <b>{{ method.title }}</b>
              <small>{{ method.account_number || method.currency }}</small>
            </span>
          </label>
        </div>

        <label class="buy-book-dialog__account">
          <span>رقم الحساب أو الهاتف المحوّل منه</span>
          <input
            v-model="transferredAccount"
            type="text"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="مثال: 01000000000"
          />
          <small v-if="selectedMethod?.account_number">
            التحويل إلى: {{ selectedMethod.account_number }}
          </small>
        </label>
      </template>

      <p v-if="errorMessage" class="buy-book-dialog__error" role="alert">{{ errorMessage }}</p>

      <button
        type="submit"
        class="buy-book-dialog__submit"
        :disabled="submitting || (mode === 'offline' && (loadingMethods || !paymentMethods.length))"
      >
        {{ submitting ? "جاري إرسال الطلب..." : mode === "join" ? "إرسال طلب الانضمام" : "تأكيد بيانات التحويل" }}
      </button>
      <p class="buy-book-dialog__privacy">بياناتك محمية وتُستخدم فقط للتحقق من عملية الشراء.</p>
    </form>
  </Dialog>
</template>

<style scoped>
.buy-book-trigger,
.buy-book-dialog__submit,
.buy-book-dialog__success button {
  display: inline-flex;
  min-height: 48px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 0;
  border-radius: 8px;
  background: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  color: var(--book-details-action-text, #fff);
  font: 800 14px var(--home-v2-heading, inherit);
  cursor: pointer;
}
.buy-book-trigger span { transition: transform .2s ease; }
.buy-book-trigger:hover span { transform: translateX(-4px); }
:global(html[data-theme="dark"]) .buy-book-dialog__submit,
:global(html[data-theme="dark"]) .buy-book-dialog__success button {
  color: #07101f;
}
.buy-book-dialog__header { display: grid; gap: 3px; }
.buy-book-dialog__header span { color: var(--home-v2-ink, var(--app-text, #172033)); font-weight: 900; }
.buy-book-dialog__header small { color: var(--home-v2-muted, var(--app-muted, #70778a)); font-size: 12px; }
.buy-book-dialog__form { display: grid; gap: 20px; }
.buy-book-dialog__summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 10px; background: var(--home-v2-cream, var(--app-bg-muted, #f7f5ef)); }
.buy-book-dialog__summary div { display: grid; gap: 4px; }
.buy-book-dialog__summary small, .buy-book-dialog__section-title small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); }
.buy-book-dialog__summary b { color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font-size: 20px; }
.buy-book-dialog__modes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; padding: 0; border: 0; }
.buy-book-dialog__modes legend { grid-column: 1 / -1; margin-bottom: 6px; font-weight: 900; }
.buy-book-dialog__modes label, .buy-book-dialog__methods label { display: flex; align-items: center; gap: 10px; padding: 13px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 9px; background: var(--home-v2-surface, var(--app-surface, #fff)); cursor: pointer; }
.buy-book-dialog__modes label.active, .buy-book-dialog__methods label.active { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__modes span, .buy-book-dialog__methods span { display: grid; gap: 2px; }
.buy-book-dialog__modes small, .buy-book-dialog__methods small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 11px; }
.buy-book-dialog__section-title { display: grid; gap: 2px; }
.buy-book-dialog__methods { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.buy-book-dialog__methods img { width: 38px; height: 38px; border-radius: 7px; object-fit: contain; }
.buy-book-dialog__account { display: grid; gap: 7px; font-weight: 800; }
.buy-book-dialog__account input { min-height: 48px; padding: 0 14px; border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4)); border-radius: 8px; background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff)); color: var(--home-v2-ink, var(--app-text, #172033)); outline: none; direction: ltr; text-align: right; }
.buy-book-dialog__account input:focus { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent); }
.buy-book-dialog__account small, .buy-book-dialog__hint, .buy-book-dialog__privacy { margin: 0; color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 11px; }
.buy-book-dialog__error { margin: 0; padding: 10px 12px; border: 1px solid color-mix(in srgb, #dc4a4a 35%, transparent); border-radius: 7px; background: color-mix(in srgb, #dc4a4a 12%, var(--app-surface, #fff)); color: color-mix(in srgb, #dc4a4a 70%, var(--app-text, #172033)); font-size: 13px; }
.buy-book-dialog__submit:disabled { opacity: .55; cursor: wait; }
.buy-book-dialog__privacy { text-align: center; }
.buy-book-dialog__success { display: grid; place-items: center; gap: 10px; padding: 24px 5px 8px; text-align: center; }
.buy-book-dialog__success > span { display: grid; width: 58px; height: 58px; place-items: center; border-radius: 50%; background: color-mix(in srgb, #32a762 15%, var(--app-surface, #fff)); color: color-mix(in srgb, #32a762 78%, var(--app-text, #172033)); font-size: 28px; font-weight: 900; }
.buy-book-dialog__success h3, .buy-book-dialog__success p { margin: 0; }
.buy-book-dialog__success p { max-width: 410px; color: var(--home-v2-muted, var(--app-muted, #747b8b)); line-height: 1.8; }
.buy-book-dialog__success button { width: 160px; margin-top: 10px; }
@media (max-width: 560px) {
  .buy-book-dialog__modes, .buy-book-dialog__methods { grid-template-columns: 1fr; }
}
</style>
