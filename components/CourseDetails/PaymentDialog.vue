<script setup lang="ts">
import Dialog from "primevue/dialog";

import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import FetchPaymentMethodsParams from "~/features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import type PaymentMethodModel from "~/features/fetch_payment_methods/Data/models/fetch_payment_method_model";
import FetchPaymentMethodController from "~/features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
import OnlinePaymentParams from "~/features/OnlinePayment/Core/Params/online_payment_params";
import OnlinePaymentController from "~/features/OnlinePayment/presentation/controllers/online_payment_controller";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import { useSiteUrl } from "~/utils/siteUrl";
import { PaymentTypes } from "./Enum/payment_types_enum";

const props = defineProps<{
  courseId: number;
  status: number;
  courseTitle?: string;
  price?: number;
  currency?: string;
  pendingLabel?: string;
}>();
const emit = defineEmits<{
  statusChanged: [status: number];
}>();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const paymentStore = usePaymentStore();
const toast = useToast();
const { buildSiteUrl } = useSiteUrl();
const { promptCourseSubscription } = useCourseAccessPrompt();

const visible = ref(false);
const normalizeStatus = (value: unknown): number => {
  const parsedStatus = Number(value);
  return Number.isFinite(parsedStatus) ? parsedStatus : 0;
};
const status = ref(normalizeStatus(props.status));
const selectedPaymentMethodId = ref<number | null>(null);
const transferredAccount = ref("");
const receiptFile = ref<File | null>(null);
const receiptPreviewUrl = ref("");
const receiptInput = ref<HTMLInputElement | null>(null);
const receiptInputId = useId();
const loadingMethods = ref(false);
const paymentMethodsLoaded = ref(false);
const submitting = ref(false);
const methodsError = ref("");
const errorMessage = ref("");
const fieldErrors = ref<Record<string, string>>({});

const paymentMethods = computed<PaymentMethodModel[]>(() => paymentStore.Payment ?? []);
const selectedMethod = computed(() =>
  paymentMethods.value.find((method) => method.id === selectedPaymentMethodId.value),
);
const isOnlinePayment = computed(
  () => Number(selectedMethod.value?.type) === PaymentTypes.ONLINE,
);
const isOfflinePayment = computed(
  () => Number(selectedMethod.value?.type) === PaymentTypes.OFFLINE,
);
const formattedPrice = computed(() => {
  if (props.price === undefined || props.price === null) return "";
  return `${props.price} ${props.currency ?? ""}`.trim();
});
const receiptSize = computed(() =>
  receiptFile.value
    ? `${(receiptFile.value.size / 1024 / 1024).toFixed(2)} MB`
    : "",
);

watch(
  () => props.status,
  (newValue) => {
    status.value = normalizeStatus(newValue);
  },
);

watch(selectedPaymentMethodId, () => {
  errorMessage.value = "";
  delete fieldErrors.value.paymentMethod;
  delete fieldErrors.value.transferredAccount;
  delete fieldErrors.value.receipt;

  if (!isOfflinePayment.value) {
    transferredAccount.value = "";
    clearReceipt();
  }
});

const clearReceipt = () => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value);
  receiptFile.value = null;
  receiptPreviewUrl.value = "";
  if (receiptInput.value) receiptInput.value.value = "";
};

const resetForm = () => {
  selectedPaymentMethodId.value = null;
  transferredAccount.value = "";
  clearReceipt();
  errorMessage.value = "";
  methodsError.value = "";
  fieldErrors.value = {};
};

const loadPaymentMethods = async () => {
  if (paymentMethodsLoaded.value) return;

  loadingMethods.value = true;
  methodsError.value = "";
  try {
    const state = await FetchPaymentMethodController.getInstance().FetchPaymentMthod(
      new FetchPaymentMethodsParams(),
    );

    if (state.value.data?.length) {
      paymentStore.setPayment(state.value.data);
      paymentMethodsLoaded.value = true;
      return;
    }

    methodsError.value = state.value.error?.title || "لا توجد وسائل دفع متاحة حاليًا.";
  } catch {
    methodsError.value = "تعذر تحميل وسائل الدفع. حاول مرة أخرى.";
  } finally {
    loadingMethods.value = false;
  }
};

const openDialog = async () => {
  resetForm();
  visible.value = true;
  await loadPaymentMethods();
};

const selectReceipt = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  delete fieldErrors.value.receipt;
  if (!file.type.startsWith("image/")) {
    clearReceipt();
    fieldErrors.value.receipt = "اختر صورة صالحة للإيصال.";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    clearReceipt();
    fieldErrors.value.receipt = "حجم الصورة يجب ألا يتجاوز 5MB.";
    return;
  }

  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value);
  receiptFile.value = file;
  receiptPreviewUrl.value = URL.createObjectURL(file);
};

const validatePayment = () => {
  const errors: Record<string, string> = {};

  if (!selectedMethod.value) {
    errors.paymentMethod = "اختر وسيلة الدفع المناسبة أولًا.";
  }
  if (selectedMethod.value && !isOnlinePayment.value && !isOfflinePayment.value) {
    errors.paymentMethod = "وسيلة الدفع المختارة غير مدعومة حاليًا.";
  }
  if (isOfflinePayment.value && transferredAccount.value.trim().length < 6) {
    errors.transferredAccount = "أدخل رقم الحساب أو الهاتف الذي تم التحويل منه.";
  }
  if (isOfflinePayment.value && !receiptFile.value) {
    errors.receipt = "أرفق صورة إيصال التحويل.";
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const apiResponseMessage = (response: any) =>
  response?.data?.message || response?.data?.data?.message;

const ensureSuccessfulBuyProductResponse = (response: any) => {
  const httpStatus = Number(response?.status);
  const apiStatus = response?.data?.status;
  const apiSuccess = response?.data?.success;
  const failedValues = ["0", "false", "error", "failed", "fail"];
  const hasFailedApiStatus =
    apiStatus === false
    || apiStatus === 0
    || failedValues.includes(String(apiStatus ?? "").toLowerCase())
    || apiSuccess === false
    || apiSuccess === 0
    || failedValues.includes(String(apiSuccess ?? "").toLowerCase());

  if (
    !response
    || !Number.isFinite(httpStatus)
    || httpStatus < 200
    || httpStatus >= 300
    || hasFailedApiStatus
  ) {
    throw new Error(apiResponseMessage(response) || "تعذر إتمام طلب شراء الكورس.");
  }
};

const requestErrorMessage = (error: any): string => {
  const response = error?.response;
  const responseMessage = apiResponseMessage(response);
  const validationErrors = response?.data?.errors;

  if (responseMessage) return String(responseMessage);
  if (validationErrors && typeof validationErrors === "object") {
    const message = Object.values(validationErrors).flat().filter(Boolean).join(" ");
    if (message) return message;
  }
  if (!response && (error?.code === "ERR_NETWORK" || error?.request)) {
    return "تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مرة أخرى.";
  }

  const responseStatus = Number(response?.status);
  if (responseStatus === 401) return "انتهت جلسة تسجيل الدخول. سجّل الدخول ثم أعد المحاولة.";
  if (responseStatus === 403) return "لا يمكنك إرسال طلب الشراء حاليًا.";
  if (responseStatus === 404) return "خدمة شراء الكورس غير متاحة حاليًا.";
  if (responseStatus === 422) return "بعض بيانات الدفع غير صحيحة. راجعها ثم حاول مرة أخرى.";
  if (responseStatus === 429) return "تم إرسال محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.";
  if (responseStatus >= 500) return "حدث خطأ بالخادم أثناء إرسال الطلب. حاول لاحقًا.";

  return error?.message || "تعذر إرسال طلب شراء الكورس. راجع البيانات وحاول مرة أخرى.";
};

const showPurchaseResultDialog = async (
  type: "success" | "error",
  titleContent: string,
  messageContent: string,
) => {
  visible.value = false;
  await nextTick();
  const dialog = type === "success"
    ? DialogSelector.instance.successDialog
    : DialogSelector.instance.errorDialog;

  dialog.openDialog({
    dialogName: "dialog",
    titleContent,
    imageElement: type === "success" ? successImage : errorImage,
    messageContent,
    autoCloseMs: 6500,
  });
};

const submitOfflinePayment = async () => {
  if (!selectedMethod.value) return;

  if (!Number.isInteger(props.courseId) || props.courseId <= 0) {
    throw new Error("معرّف الكورس غير صالح. أعد تحميل الصفحة وحاول مرة أخرى.");
  }

  const response = await NetworkService.instance.postFormData({
    url: ApiNames.Instance.buy_product,
    isAuth: true,
    data: {
      course_id: props.courseId,
      subscription_type: 1,
      payment_method_id: selectedMethod.value.id,
      transferred_account: transferredAccount.value.trim(),
      receipt: receiptFile.value,
    },
  });

  ensureSuccessfulBuyProductResponse(response);
  status.value = 1;
  emit("statusChanged", 1);
  await showPurchaseResultDialog(
    "success",
    "تم إرسال طلب شراء الكورس بنجاح",
    String(
      apiResponseMessage(response)
      || "سنراجع بيانات الدفع، وسيتم تفعيل الكورس على حسابك فور اعتماد الطلب.",
    ),
  );
};

const submitOnlinePayment = async () => {
  if (!selectedMethod.value) return;
  if (!Number.isInteger(props.courseId) || props.courseId <= 0) {
    throw new Error("معرّف الكورس غير صالح. أعد تحميل الصفحة وحاول مرة أخرى.");
  }

  const callbackUrl = buildSiteUrl(
    `/paymentverify/${selectedMethod.value.id}?source=course&courseId=${props.courseId}`,
  );
  const params = new OnlinePaymentParams(
    String(props.courseId),
    String(selectedMethod.value.id),
    null,
    callbackUrl,
    callbackUrl,
    callbackUrl,
    callbackUrl,
    callbackUrl,
  );
  const state = await OnlinePaymentController.getInstance().CreateOnlinePayment(params, router);
  const gatewayUrl = state.value.data?.url;
  const paymentId = Number(state.value.data?.id);

  if (!gatewayUrl || !Number.isFinite(paymentId) || paymentId <= 0) {
    throw new Error(
      state.value.error?.title || "تعذر فتح بوابة الدفع. حاول مرة أخرى.",
    );
  }

  window.localStorage.setItem("onlinePaymentId", String(paymentId));
  window.localStorage.setItem("onlinePaymentContext", JSON.stringify({
    source: "course",
    courseId: props.courseId,
    title: props.courseTitle,
    returnUrl: route.fullPath,
  }));
  window.location.assign(gatewayUrl);
};

const submitPayment = async () => {
  errorMessage.value = "";
  if (!validatePayment()) return;

  submitting.value = true;
  try {
    if (isOnlinePayment.value) {
      await submitOnlinePayment();
    } else if (isOfflinePayment.value) {
      await submitOfflinePayment();
    }
  } catch (error: any) {
    errorMessage.value = requestErrorMessage(error);
    await showPurchaseResultDialog(
      "error",
      "لم يتم إرسال طلب شراء الكورس",
      errorMessage.value,
    );
  } finally {
    submitting.value = false;
  }
};

const fireLoginToast = () => {
  toast.add({
    severity: "info",
    summary: "سجّل دخولك أولًا",
    detail: "يلزم تسجيل الدخول لإتمام شراء الكورس.",
    life: 3500,
  });
  router.push({ path: "/loginhome", query: { redirect: route.fullPath } });
};

const showPendingRequestDetails = () => {
  promptCourseSubscription(status.value);
};

onBeforeUnmount(clearReceipt);
</script>

<template>
  <div class="course-payment">
    <button
      v-if="status === 0 && userStore.user"
      type="button"
      class="course-payment__trigger"
      @click="openDialog"
    >
      <span class="pi pi-shopping-cart" aria-hidden="true" />
      شراء الكورس
    </button>

    <button
      v-else-if="status === 1 && userStore.user"
      type="button"
      class="course-payment__trigger course-payment__trigger--pending"
      aria-haspopup="dialog"
      aria-label="عرض حالة طلب الاشتراك"
      @click="showPendingRequestDetails"
    >
      <span class="pi pi-clock" aria-hidden="true" />
      {{ props.pendingLabel || "في انتظار قبول الطلب" }}
    </button>

    <button
      v-else-if="status === 4 && userStore.user"
      type="button"
      disabled
      class="course-payment__trigger course-payment__trigger--rejected"
    >
      <span class="pi pi-times-circle" aria-hidden="true" />
      تم رفض الطلب
    </button>

    <button
      v-else-if="!userStore.user"
      type="button"
      class="course-payment__trigger"
      @click="fireLoginToast"
    >
      <span class="pi pi-sign-in" aria-hidden="true" />
      شراء الكورس
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      dismissable-mask
      :draggable="false"
      :close-on-escape="!submitting"
      :style="{ width: 'min(680px, calc(100vw - 24px))' }"
      class="course-payment-dialog"
      dir="rtl"
    >
      <template #header>
        <div class="course-payment-dialog__header">
          <span class="course-payment-dialog__header-icon pi pi-shopping-bag" aria-hidden="true" />
          <span>
            <strong>إتمام شراء الكورس</strong>
            <small>{{ courseTitle || "اختر وسيلة الدفع المناسبة لإكمال الاشتراك" }}</small>
          </span>
        </div>
      </template>

      <form class="course-payment-dialog__form" @submit.prevent="submitPayment">
        <div v-if="courseTitle || formattedPrice" class="course-payment-dialog__summary">
          <span class="course-payment-dialog__summary-icon pi pi-graduation-cap" aria-hidden="true" />
          <div>
            <small>الكورس المختار</small>
            <strong>{{ courseTitle || "اشتراك الكورس" }}</strong>
          </div>
          <b v-if="formattedPrice">{{ formattedPrice }}</b>
        </div>

        <section class="course-payment-dialog__section" aria-labelledby="course-payment-methods-title">
          <div class="course-payment-dialog__section-title">
            <span class="course-payment-dialog__step" aria-hidden="true">١</span>
            <div>
              <b id="course-payment-methods-title">اختر وسيلة الدفع</b>
              <small>يمكنك الدفع إلكترونيًا أو تأكيد تحويلك مباشرة</small>
            </div>
          </div>

          <div v-if="loadingMethods" class="course-payment-dialog__loading" role="status">
            <span class="pi pi-spin pi-spinner" aria-hidden="true" />
            جاري تحميل وسائل الدفع...
          </div>

          <div v-else-if="methodsError || !paymentMethods.length" class="course-payment-dialog__empty" role="alert">
            <span class="pi pi-exclamation-circle" aria-hidden="true" />
            <span>{{ methodsError || "لا توجد وسائل دفع متاحة حاليًا." }}</span>
            <button type="button" @click="loadPaymentMethods">إعادة المحاولة</button>
          </div>

          <div v-else class="payment-method-container" role="radiogroup" aria-label="وسائل الدفع المتاحة">
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              class="payment-method"
              :class="{ active: selectedPaymentMethodId === method.id }"
            >
              <input
                v-model="selectedPaymentMethodId"
                type="radio"
                name="course-payment-method"
                :value="method.id"
              />
              <span class="payment-method__visual">
                <img v-if="method.image" :src="method.image" alt="" />
                <span
                  v-else
                  :class="[
                    'pi',
                    Number(method.type) === PaymentTypes.ONLINE ? 'pi-credit-card' : 'pi-wallet',
                  ]"
                  aria-hidden="true"
                />
              </span>
              <span class="payment-method__copy">
                <b>{{ method.title }}</b>
                <small v-if="Number(method.type) === PaymentTypes.ONLINE">دفع إلكتروني آمن</small>
                <small v-else>
                  {{ method.account_number ? `التحويل إلى ${method.account_number}` : "تحويل فوري وإرفاق الإيصال" }}
                </small>
              </span>
              <span class="payment-method__check pi pi-check" aria-hidden="true" />
            </label>
          </div>
          <small v-if="fieldErrors.paymentMethod" class="course-payment-dialog__field-error">
            {{ fieldErrors.paymentMethod }}
          </small>
        </section>

        <Transition name="course-payment-swap" mode="out-in">
          <div v-if="isOnlinePayment" key="online" class="course-payment-dialog__gateway-note" role="status">
            <span class="pi pi-shield" aria-hidden="true" />
            <div>
              <b>دفع آمن عبر Fawaterk</b>
              <small>سيتم تحويلك إلى بوابة الدفع لإتمام العملية. لن تحتاج إلى رفع صورة إيصال.</small>
            </div>
          </div>

          <section
            v-else-if="isOfflinePayment"
            key="offline"
            class="course-payment-dialog__section course-payment-dialog__offline"
            aria-labelledby="course-transfer-details-title"
          >
            <div class="course-payment-dialog__section-title">
              <span class="course-payment-dialog__step" aria-hidden="true">٢</span>
              <div>
                <b id="course-transfer-details-title">بيانات التحويل</b>
                <small>أدخل الرقم المحوّل منه وأرفق صورة الإيصال</small>
              </div>
            </div>

            <label class="course-payment-dialog__field">
              <span>رقم الحساب أو الهاتف المحوّل منه <em>*</em></span>
              <input
                v-model="transferredAccount"
                type="text"
                inputmode="numeric"
                autocomplete="tel"
                placeholder="مثال: 01000000000"
                :class="{ invalid: fieldErrors.transferredAccount }"
                @input="delete fieldErrors.transferredAccount"
              />
              <small v-if="selectedMethod?.account_number" class="course-payment-dialog__destination">
                التحويل إلى: <b>{{ selectedMethod.account_number }}</b>
              </small>
              <small v-if="fieldErrors.transferredAccount" class="course-payment-dialog__field-error">
                {{ fieldErrors.transferredAccount }}
              </small>
            </label>

            <div class="course-payment-dialog__field">
              <span>صورة إيصال التحويل <em>*</em></span>
              <input
                :id="receiptInputId"
                ref="receiptInput"
                class="course-payment-dialog__receipt-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="selectReceipt"
              />

              <label
                v-if="!receiptPreviewUrl"
                :for="receiptInputId"
                :class="['course-payment-dialog__receipt-picker', { invalid: fieldErrors.receipt }]"
              >
                <span class="pi pi-cloud-upload" aria-hidden="true" />
                <b>اضغط لرفع صورة الإيصال</b>
                <small>JPG أو PNG أو WebP — بحد أقصى 5MB</small>
              </label>

              <div v-else class="course-payment-dialog__receipt-preview">
                <img :src="receiptPreviewUrl" alt="معاينة إيصال التحويل" />
                <div>
                  <b>{{ receiptFile?.name }}</b>
                  <small>{{ receiptSize }}</small>
                </div>
                <label :for="receiptInputId">تغيير</label>
                <button type="button" aria-label="حذف صورة الإيصال" @click="clearReceipt">
                  <span class="pi pi-trash" aria-hidden="true" />
                </button>
              </div>
              <small v-if="fieldErrors.receipt" class="course-payment-dialog__field-error">
                {{ fieldErrors.receipt }}
              </small>
            </div>
          </section>

          <div v-else key="hint" class="course-payment-dialog__selection-hint">
            <span class="pi pi-arrow-up" aria-hidden="true" />
            اختر وسيلة الدفع لعرض الخطوة التالية.
          </div>
        </Transition>

        <p v-if="errorMessage" class="course-payment-dialog__error" role="alert">
          <span class="pi pi-exclamation-triangle" aria-hidden="true" />
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="course-payment-dialog__submit"
          :disabled="submitting || loadingMethods || !paymentMethods.length"
        >
          <span v-if="submitting" class="pi pi-spin pi-spinner" aria-hidden="true" />
          <span v-else-if="isOnlinePayment" class="pi pi-lock" aria-hidden="true" />
          <span v-else class="pi pi-check-circle" aria-hidden="true" />
          {{
            submitting
              ? isOnlinePayment
                ? "جاري فتح بوابة الدفع..."
                : "جاري إرسال الطلب..."
              : isOnlinePayment
                ? "المتابعة إلى الدفع الآمن"
                : isOfflinePayment
                  ? "تأكيد بيانات التحويل"
                  : "اختر وسيلة الدفع أولًا"
          }}
        </button>
        <p class="course-payment-dialog__privacy">
          <span class="pi pi-shield" aria-hidden="true" />
          بياناتك محمية وتُستخدم فقط للتحقق من عملية الشراء.
        </p>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.course-payment {
  width: 100%;
}

.course-payment__trigger {
  display: inline-flex;
  width: 100%;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 10px;
  background: var(--home-v2-blue, var(--app-accent, var(--secondary-color)));
  color: #fff;
  font: 850 14px var(--home-v2-heading, inherit);
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}

.course-payment__trigger:hover:not(:disabled) {
  box-shadow: 0 14px 30px -18px var(--home-v2-blue, var(--app-accent, #28366c));
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.course-payment__trigger--rejected {
  cursor: not-allowed;
}

.course-payment__trigger--pending {
  border: 1px solid color-mix(in srgb, #f59e0b 38%, transparent);
  background: color-mix(in srgb, #f59e0b 14%, var(--app-surface, #fff));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 6%, transparent);
  color: #965d00;
  cursor: pointer;
}

.course-payment__trigger--pending:hover {
  border-color: color-mix(in srgb, #f59e0b 58%, transparent);
  box-shadow: 0 12px 25px color-mix(in srgb, #f59e0b 18%, transparent);
  filter: brightness(1.02);
  transform: translateY(-1px);
}

.course-payment__trigger--rejected {
  border: 1px solid color-mix(in srgb, #dc3545 34%, transparent);
  background: color-mix(in srgb, #dc4a4a 12%, var(--app-surface, #fff));
  color: #b83d3d;
}

:global(html[data-theme="dark"]) .course-payment__trigger--pending {
  background: color-mix(in srgb, #f59e0b 17%, #151a24);
  color: #fbbf24;
}

:global(html[data-theme="dark"]) .course-payment__trigger--rejected {
  background: color-mix(in srgb, #dc3545 17%, #151a24);
  color: #ff7b87;
}

:global(.course-payment-dialog.p-dialog) {
  overflow: hidden;
  border: 1px solid var(--home-v2-line, var(--app-line, #e1e4ea));
  border-radius: 20px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 30px 90px -34px rgb(8 17 35 / 55%);
  color: var(--home-v2-ink, var(--app-text, #172033));
}

:global(.course-payment-dialog .p-dialog-header) {
  padding: 20px 22px;
  border-bottom: 1px solid var(--home-v2-line, var(--app-line, #e5e7ec));
  background:
    radial-gradient(circle at 12% 0, color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 11%, transparent), transparent 38%),
    var(--home-v2-surface, var(--app-surface, #fff));
}

:global(.course-payment-dialog .p-dialog-header-actions) {
  margin-inline-start: auto;
  margin-inline-end: 12px;
}

:global(.course-payment-dialog .p-dialog-close-button) {
  border: 1px solid var(--home-v2-line, var(--app-line, #dfe2e8));
  background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff));
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
}

:global(.course-payment-dialog .p-dialog-content) {
  max-height: min(76vh, 760px);
  padding: 22px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  color: var(--home-v2-ink, var(--app-text, #172033));
}

.course-payment-dialog__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  text-align: start;
}

.course-payment-dialog__header-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent);
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  font-size: 18px;
}

.course-payment-dialog__header > span:last-child {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.course-payment-dialog__header strong {
  font-size: 19px;
  line-height: 1.45;
  font-weight: 900;
}

.course-payment-dialog__header small {
  overflow: hidden;
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 13px;
  line-height: 1.6;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-payment-dialog__form {
  display: grid;
  gap: 20px;
}

.course-payment-dialog__summary {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 17px;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea));
  border-radius: 12px;
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 5%, var(--home-v2-surface, var(--app-surface, #fff)));
}

.course-payment-dialog__summary-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 10px;
  background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff));
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  box-shadow: 0 8px 22px -16px rgb(10 24 50 / 50%);
}

.course-payment-dialog__summary div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.course-payment-dialog__summary small {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 13px;
}

.course-payment-dialog__summary strong {
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-payment-dialog__summary > b {
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  font-size: 21px;
  white-space: nowrap;
}

.course-payment-dialog__section {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea));
  border-radius: 12px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
}

.course-payment-dialog__offline {
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 3%, var(--home-v2-surface, var(--app-surface, #fff)));
}

.course-payment-dialog__section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: start;
}

.course-payment-dialog__section-title > div {
  display: grid;
  gap: 2px;
}

.course-payment-dialog__section-title b {
  font-size: 16px;
  font-weight: 900;
}

.course-payment-dialog__section-title small {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 13px;
  line-height: 1.6;
}

.course-payment-dialog__step {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 50%;
  background: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  color: #fff;
  font-size: 14px;
  font-weight: 900;
}

.payment-method-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.payment-method {
  position: relative;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 24px;
  min-height: 88px;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--home-v2-line, var(--app-line, #dfe2e8));
  border-radius: 11px;
  background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff));
  cursor: pointer;
  transition: border-color .22s ease, background-color .22s ease, box-shadow .22s ease, transform .22s ease;
}

.payment-method:hover {
  border-color: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 50%, var(--home-v2-line, #dfe2e8));
  box-shadow: 0 14px 30px -24px rgb(16 37 74 / 55%);
  transform: translateY(-2px);
}

.payment-method.active {
  border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 9%, var(--home-v2-surface, var(--app-surface, #fff)));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 10%, transparent);
}

.payment-method > input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.payment-method:focus-within {
  outline: 3px solid color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 18%, transparent);
  outline-offset: 2px;
}

.payment-method__visual {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea));
  border-radius: 10px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
}

.payment-method__visual img {
  width: 100%;
  height: 100%;
  padding: 5px;
  object-fit: contain;
}

.payment-method__copy {
  display: grid;
  min-width: 0;
  gap: 4px;
  text-align: start;
}

.payment-method__copy b {
  overflow: hidden;
  font-size: 15px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-method__copy small {
  overflow: hidden;
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 12px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-method__check {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--home-v2-line, var(--app-line, #d8dce4));
  border-radius: 50%;
  color: transparent;
  font-size: 11px;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease;
}

.payment-method.active .payment-method__check {
  border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  background: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  color: #fff;
}

.course-payment-dialog__gateway-note {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, #32a762 34%, var(--home-v2-line, var(--app-line, #d9dce4)));
  border-radius: 11px;
  background: color-mix(in srgb, #32a762 8%, var(--home-v2-surface, var(--app-surface, #fff)));
  text-align: start;
}

.course-payment-dialog__gateway-note > span {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, #32a762 16%, transparent);
  color: #27824d;
  font-size: 17px;
}

.course-payment-dialog__gateway-note > div {
  display: grid;
  gap: 3px;
}

.course-payment-dialog__gateway-note b {
  font-size: 15px;
}

.course-payment-dialog__gateway-note small {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 13px;
  line-height: 1.7;
}

.course-payment-dialog__field {
  display: grid;
  gap: 7px;
  min-width: 0;
  text-align: start;
}

.course-payment-dialog__field > span {
  font-size: 14px;
  font-weight: 850;
}

.course-payment-dialog__field em {
  color: #dc4a4a;
  font-style: normal;
}

.course-payment-dialog__field > input:not(.course-payment-dialog__receipt-input) {
  width: 100%;
  min-height: 48px;
  padding: 11px 13px;
  border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4));
  border-radius: 9px;
  background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff));
  color: var(--home-v2-ink, var(--app-text, #172033));
  font: inherit;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.course-payment-dialog__field > input:not(.course-payment-dialog__receipt-input):focus {
  border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent);
}

.course-payment-dialog__field > input.invalid {
  border-color: #dc4a4a;
}

.course-payment-dialog__destination {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 12px;
}

.course-payment-dialog__destination b {
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  direction: ltr;
  unicode-bidi: isolate;
}

.course-payment-dialog__receipt-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.course-payment-dialog__receipt-picker {
  display: grid;
  min-height: 132px;
  align-content: center;
  place-items: center;
  gap: 6px;
  padding: 18px;
  border: 1.5px dashed var(--home-v2-line, var(--app-line, #cfd3dc));
  border-radius: 11px;
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 3%, var(--home-v2-surface, var(--app-surface, #fff)));
  text-align: center;
  cursor: pointer;
  transition: border-color .2s ease, background-color .2s ease;
}

.course-payment-dialog__receipt-picker:hover {
  border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 7%, var(--home-v2-surface, var(--app-surface, #fff)));
}

.course-payment-dialog__receipt-picker.invalid {
  border-color: #dc4a4a;
}

.course-payment-dialog__receipt-picker > span {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent);
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  font-size: 18px;
}

.course-payment-dialog__receipt-picker b {
  font-size: 15px;
}

.course-payment-dialog__receipt-picker small {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 12px;
}

.course-payment-dialog__receipt-preview {
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr) auto auto;
  min-height: 86px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4));
  border-radius: 10px;
  background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff));
}

.course-payment-dialog__receipt-preview img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
}

.course-payment-dialog__receipt-preview > div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.course-payment-dialog__receipt-preview > div b {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-payment-dialog__receipt-preview small {
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 12px;
}

.course-payment-dialog__receipt-preview > label,
.course-payment-dialog__receipt-preview > button {
  padding: 7px 9px;
  border: 0;
  border-radius: 7px;
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 10%, transparent);
  color: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  font: inherit;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}

.course-payment-dialog__receipt-preview > button {
  display: grid;
  width: 32px;
  height: 32px;
  padding: 0;
  place-items: center;
  background: color-mix(in srgb, #dc4a4a 10%, transparent);
  color: #bd3d3d;
}

.course-payment-dialog__selection-hint,
.course-payment-dialog__loading {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed var(--home-v2-line, var(--app-line, #d9dce4));
  border-radius: 10px;
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 13px;
  font-weight: 700;
}

.course-payment-dialog__empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px;
  border: 1px solid color-mix(in srgb, #dc4a4a 25%, var(--app-line, #ddd));
  border-radius: 9px;
  background: color-mix(in srgb, #dc4a4a 8%, var(--app-surface, #fff));
  color: #b63c3c;
  font-size: 13px;
}

.course-payment-dialog__empty button {
  margin-inline-start: auto;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 900;
  text-decoration: underline;
  cursor: pointer;
}

.course-payment-dialog__field-error {
  margin: 0;
  color: #c43e3e;
  font-size: 12px;
  font-weight: 750;
}

.course-payment-dialog__error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 11px 12px;
  border: 1px solid color-mix(in srgb, #dc4a4a 35%, transparent);
  border-radius: 9px;
  background: color-mix(in srgb, #dc4a4a 10%, var(--app-surface, #fff));
  color: #b63c3c;
  font-size: 13px;
  font-weight: 750;
}

.course-payment-dialog__submit,
.course-payment-dialog__success button {
  display: inline-flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 10px;
  background: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  color: #fff;
  font: 900 16px var(--home-v2-heading, inherit);
  cursor: pointer;
  transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
}

.course-payment-dialog__submit:hover:not(:disabled),
.course-payment-dialog__success button:hover {
  box-shadow: 0 16px 32px -20px var(--home-v2-blue, var(--app-accent, #28366c));
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.course-payment-dialog__submit:disabled {
  opacity: .55;
  cursor: wait;
}

.course-payment-dialog__privacy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: -7px 0 0;
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 12px;
  line-height: 1.6;
}

.course-payment-dialog__success {
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 25px 4px 8px;
  text-align: center;
}

.course-payment-dialog__success > span {
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, #32a762 15%, var(--app-surface, #fff));
  color: #27824d;
  font-size: 25px;
  font-weight: 900;
}

.course-payment-dialog__success h3,
.course-payment-dialog__success p {
  margin: 0;
}

.course-payment-dialog__success p {
  max-width: 430px;
  color: var(--home-v2-muted, var(--app-muted, #747b8b));
  font-size: 14px;
  line-height: 1.8;
}

.course-payment-dialog__success button {
  width: 170px;
  margin-top: 8px;
}

.course-payment-swap-enter-active,
.course-payment-swap-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.course-payment-swap-enter-from,
.course-payment-swap-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

:global(html[data-theme="dark"] .course-payment-dialog__submit),
:global(html[data-theme="dark"] .course-payment-dialog__success button) {
  color: #07101f;
}

@media (max-width: 560px) {
  :global(.course-payment-dialog .p-dialog-header) {
    padding: 16px;
  }

  :global(.course-payment-dialog .p-dialog-content) {
    padding: 15px;
  }

  .course-payment-dialog__header-icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .course-payment-dialog__summary {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .course-payment-dialog__summary > b {
    grid-column: 2;
    font-size: 16px;
  }

  .payment-method-container {
    grid-template-columns: 1fr;
  }

  .course-payment-dialog__section {
    padding: 12px;
  }

  .course-payment-dialog__receipt-preview {
    grid-template-columns: 58px minmax(0, 1fr) auto;
  }

  .course-payment-dialog__receipt-preview img {
    width: 58px;
    height: 58px;
  }

  .course-payment-dialog__receipt-preview > button {
    grid-column: 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .course-payment__trigger,
  .payment-method,
  .course-payment-dialog__submit,
  .course-payment-dialog__success button,
  .course-payment-swap-enter-active,
  .course-payment-swap-leave-active {
    transition: none;
  }
}
</style>
