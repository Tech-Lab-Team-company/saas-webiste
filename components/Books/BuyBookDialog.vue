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
  requiresDelivery: boolean;
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
const receiptFile = ref<File | null>(null);
const receiptPreviewUrl = ref("");
const receiptInput = ref<HTMLInputElement | null>(null);
const receiptInputId = useId();
const city = ref("");
const address = ref("");
const latitude = ref("");
const longitude = ref("");
const teacherDistrict = ref("");
const locationDetails = ref("");
const loadingMethods = ref(false);
const bookPaymentMethodsLoaded = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const success = ref(false);
const fieldErrors = ref<Record<string, string>>({});
const locationMessage = ref("");
const locationMessageType = ref<"success" | "error" | null>(null);
const { getLocation, isLoading: locating } = useGeolocation();

const paymentMethods = computed(() => paymentStore.Payment ?? []);
const selectedMethod = computed(() =>
  paymentMethods.value.find((method) => method.id === selectedPaymentMethodId.value),
);
const receiptSize = computed(() => receiptFile.value
  ? `${(receiptFile.value.size / 1024 / 1024).toFixed(2)} MB`
  : "");

const loadPaymentMethods = async () => {
  if (bookPaymentMethodsLoaded.value) return;

  loadingMethods.value = true;
  try {
    const state = await FetchPaymentMethodController.getInstance().FetchPaymentMthod(
      new FetchPaymentMethodsParams(),
    );
    if (state.value.data) {
      paymentStore.setPayment(state.value.data);
      bookPaymentMethodsLoaded.value = true;
    }
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
  fieldErrors.value = {};
  locationMessage.value = "";
  locationMessageType.value = null;
  success.value = false;
  visible.value = true;
  await loadPaymentMethods();
};

const validate = () => {
  const errors: Record<string, string> = {};

  if (props.requiresDelivery) {
    const lat = Number(latitude.value);
    const lng = Number(longitude.value);

    if (city.value.trim().length < 2) {
      errors.city = "أدخل اسم المدينة.";
    }
    if (address.value.trim().length < 5) {
      errors.address = "أدخل عنوانًا واضحًا.";
    }
    if (!latitude.value || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.latitude = "أدخل خط عرض صحيحًا بين -90 و90.";
    }
    if (!longitude.value || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.longitude = "أدخل خط طول صحيحًا بين -180 و180.";
    }
    if (teacherDistrict.value.trim().length < 2) {
      errors.teacherDistrict = "أدخل المنطقة أو الحي.";
    }
    if (locationDetails.value.trim().length < 5) {
      errors.locationDetails = "أضف تفاصيل تساعد على الوصول إليك.";
    }
  }

  if (mode.value === "offline") {
    if (selectedPaymentMethodId.value === null) {
      errors.paymentMethod = "اختر وسيلة الدفع التي استخدمتها.";
    }
    if (transferredAccount.value.trim().length < 6) {
      errors.transferredAccount = "أدخل رقم الحساب أو الهاتف الذي تم التحويل منه.";
    }
    if (!receiptFile.value) {
      errors.receipt = "أرفق صورة إيصال التحويل.";
    }
  }

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const clearReceipt = () => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value);
  receiptFile.value = null;
  receiptPreviewUrl.value = "";
  if (receiptInput.value) receiptInput.value.value = "";
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

onBeforeUnmount(() => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value);
});

const useCurrentLocation = async () => {
  locationMessage.value = "";
  locationMessageType.value = null;
  const { latitude: currentLatitude, longitude: currentLongitude } = await getLocation();

  if (currentLatitude === null || currentLongitude === null) {
    locationMessage.value = "تعذر تحديد موقعك. يمكنك إدخال الإحداثيات يدويًا.";
    locationMessageType.value = "error";
    return;
  }

  latitude.value = currentLatitude.toFixed(6);
  longitude.value = currentLongitude.toFixed(6);
  delete fieldErrors.value.latitude;
  delete fieldErrors.value.longitude;
  locationMessage.value = "تم تحديد موقعك بنجاح.";
  locationMessageType.value = "success";
};

const submit = async () => {
  errorMessage.value = "";
  if (!validate()) return;

  submitting.value = true;
  try {
    const deliveryData = props.requiresDelivery
      ? {
          city: city.value.trim(),
          address: address.value.trim(),
          lat: Number(latitude.value),
          lng: Number(longitude.value),
          teacher_district: teacherDistrict.value.trim(),
          location_details: locationDetails.value.trim(),
        }
      : {};
    const payload = {
      book_id: props.bookId,
      subscription_type: mode.value === "join" ? 5 : 1,
      ...deliveryData,
      ...(mode.value === "offline"
        ? {
            payment_method_id: selectedPaymentMethodId.value,
            transferred_account: transferredAccount.value.trim(),
            receipt: receiptFile.value,
          }
        : {}),
    };

    const request = {
      url: ApiNames.Instance.buy_product,
      data: payload,
      isAuth: true,
    };
    if (mode.value === "offline") {
      await NetworkService.instance.postFormData(request);
    } else {
      await NetworkService.instance.post(request);
    }

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

      <section
        v-if="requiresDelivery"
        class="buy-book-dialog__section"
        aria-labelledby="customer-address-title"
      >
        <div class="buy-book-dialog__section-title">
          <span class="buy-book-dialog__step" aria-hidden="true">١</span>
          <div>
            <b id="customer-address-title">بيانات العنوان</b>
            <small>أدخل بياناتك بدقة لإتمام الطلب</small>
          </div>
        </div>

        <div class="buy-book-dialog__fields">
          <label class="buy-book-dialog__field">
            <span>المدينة <em>*</em></span>
            <input
              v-model="city"
              type="text"
              name="city"
              autocomplete="address-level2"
              placeholder="مثال: القاهرة"
              :class="{ invalid: fieldErrors.city }"
              @input="delete fieldErrors.city"
            />
            <small v-if="fieldErrors.city" class="buy-book-dialog__field-error">{{ fieldErrors.city }}</small>
          </label>

          <label class="buy-book-dialog__field">
            <span>العنوان <em>*</em></span>
            <input
              v-model="address"
              type="text"
              name="address"
              autocomplete="street-address"
              placeholder="الشارع، رقم المبنى"
              :class="{ invalid: fieldErrors.address }"
              @input="delete fieldErrors.address"
            />
            <small v-if="fieldErrors.address" class="buy-book-dialog__field-error">{{ fieldErrors.address }}</small>
          </label>
        </div>
      </section>

      <section
        v-if="requiresDelivery"
        class="buy-book-dialog__section buy-book-dialog__delivery"
        aria-labelledby="delivery-details-title"
      >
        <div class="buy-book-dialog__section-title buy-book-dialog__section-title--action">
          <span class="buy-book-dialog__step" aria-hidden="true">٢</span>
          <div>
            <b id="delivery-details-title">تفاصيل التوصيل</b>
            <small>مطلوبة لأن النسخة ورقية</small>
          </div>
          <button type="button" class="buy-book-dialog__location-button" :disabled="locating" @click="useCurrentLocation">
            <span aria-hidden="true">⌖</span>
            {{ locating ? "جاري التحديد..." : "استخدم موقعي" }}
          </button>
        </div>

        <p
          v-if="locationMessage"
          :class="['buy-book-dialog__location-message', { success: locationMessageType === 'success' }]"
          role="status"
        >
          {{ locationMessage }}
        </p>

        <div class="buy-book-dialog__fields">
          <label class="buy-book-dialog__field">
            <span>خط العرض (lat) <em>*</em></span>
            <input
              v-model="latitude"
              type="number"
              name="lat"
              inputmode="decimal"
              min="-90"
              max="90"
              step="any"
              dir="ltr"
              placeholder="30.044420"
              :class="{ invalid: fieldErrors.latitude }"
              @input="delete fieldErrors.latitude"
            />
            <small v-if="fieldErrors.latitude" class="buy-book-dialog__field-error">{{ fieldErrors.latitude }}</small>
          </label>

          <label class="buy-book-dialog__field">
            <span>خط الطول (lng) <em>*</em></span>
            <input
              v-model="longitude"
              type="number"
              name="lng"
              inputmode="decimal"
              min="-180"
              max="180"
              step="any"
              dir="ltr"
              placeholder="31.235712"
              :class="{ invalid: fieldErrors.longitude }"
              @input="delete fieldErrors.longitude"
            />
            <small v-if="fieldErrors.longitude" class="buy-book-dialog__field-error">{{ fieldErrors.longitude }}</small>
          </label>

          <label class="buy-book-dialog__field buy-book-dialog__field--full">
            <span>المنطقة أو الحي <em>*</em></span>
            <input
              v-model="teacherDistrict"
              type="text"
              name="teacher_district"
              autocomplete="address-level3"
              placeholder="مثال: مدينة نصر - الحي السابع"
              :class="{ invalid: fieldErrors.teacherDistrict }"
              @input="delete fieldErrors.teacherDistrict"
            />
            <small v-if="fieldErrors.teacherDistrict" class="buy-book-dialog__field-error">{{ fieldErrors.teacherDistrict }}</small>
          </label>

          <label class="buy-book-dialog__field buy-book-dialog__field--full">
            <span>تفاصيل إضافية للموقع <em>*</em></span>
            <textarea
              v-model="locationDetails"
              name="location_details"
              rows="3"
              placeholder="علامة مميزة، رقم الشقة أو الدور، وأفضل وقت للتوصيل"
              :class="{ invalid: fieldErrors.locationDetails }"
              @input="delete fieldErrors.locationDetails"
            ></textarea>
            <small v-if="fieldErrors.locationDetails" class="buy-book-dialog__field-error">{{ fieldErrors.locationDetails }}</small>
          </label>
        </div>
      </section>

      <fieldset class="buy-book-dialog__modes">
        <legend>
          <span v-if="requiresDelivery" class="buy-book-dialog__step" aria-hidden="true">٣</span>
          كيف تريد إتمام الطلب؟
        </legend>
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
            <input
              v-model="selectedPaymentMethodId"
              type="radio"
              :value="method.id"
              @change="delete fieldErrors.paymentMethod"
            />
            <img v-if="method.image" :src="method.image" alt="" />
            <span>
              <b>{{ method.title }}</b>
              <small>{{ method.account_number || method.currency }}</small>
            </span>
          </label>
        </div>
        <p v-if="fieldErrors.paymentMethod" class="buy-book-dialog__field-error">{{ fieldErrors.paymentMethod }}</p>

        <label class="buy-book-dialog__field buy-book-dialog__field--full">
          <span>رقم الحساب أو الهاتف المحوّل منه</span>
          <input
            v-model="transferredAccount"
            type="text"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="مثال: 01000000000"
            :class="{ invalid: fieldErrors.transferredAccount }"
            @input="delete fieldErrors.transferredAccount"
          />
          <small v-if="fieldErrors.transferredAccount" class="buy-book-dialog__field-error">{{ fieldErrors.transferredAccount }}</small>
          <small v-if="selectedMethod?.account_number">
            التحويل إلى: {{ selectedMethod.account_number }}
          </small>
        </label>

        <div class="buy-book-dialog__field buy-book-dialog__field--full">
          <span>صورة إيصال التحويل <em>*</em></span>
          <input
            :id="receiptInputId"
            ref="receiptInput"
            class="buy-book-dialog__receipt-input"
            type="file"
            name="receipt"
            accept="image/jpeg,image/png,image/webp"
            @change="selectReceipt"
          />

          <label
            v-if="!receiptPreviewUrl"
            :for="receiptInputId"
            :class="['buy-book-dialog__receipt-picker', { invalid: fieldErrors.receipt }]"
          >
            <span class="buy-book-dialog__receipt-icon" aria-hidden="true">↥</span>
            <b>اضغط لرفع صورة الإيصال</b>
            <small>JPG أو PNG أو WebP — بحد أقصى 5MB</small>
          </label>

          <div v-else class="buy-book-dialog__receipt-preview">
            <img :src="receiptPreviewUrl" alt="معاينة إيصال التحويل" />
            <div>
              <b>{{ receiptFile?.name }}</b>
              <small>{{ receiptSize }}</small>
            </div>
            <label :for="receiptInputId">تغيير</label>
            <button type="button" aria-label="حذف صورة الإيصال" @click="clearReceipt">حذف</button>
          </div>
          <small v-if="fieldErrors.receipt" class="buy-book-dialog__field-error">{{ fieldErrors.receipt }}</small>
        </div>
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
:deep(.p-dialog-content) { max-height: min(78vh, 760px); }
.buy-book-dialog__summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 10px; background: var(--home-v2-cream, var(--app-bg-muted, #f7f5ef)); }
.buy-book-dialog__summary div { display: grid; gap: 4px; }
.buy-book-dialog__summary small, .buy-book-dialog__section-title small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); }
.buy-book-dialog__summary b { color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font-size: 20px; }
.buy-book-dialog__modes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; padding: 0; border: 0; }
.buy-book-dialog__modes legend { grid-column: 1 / -1; margin-bottom: 6px; font-weight: 900; }
.buy-book-dialog__modes legend .buy-book-dialog__step { display: inline-grid; margin-inline-end: 6px; vertical-align: middle; }
.buy-book-dialog__modes label, .buy-book-dialog__methods label { display: flex; align-items: center; gap: 10px; padding: 13px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 9px; background: var(--home-v2-surface, var(--app-surface, #fff)); cursor: pointer; }
.buy-book-dialog__modes label.active, .buy-book-dialog__methods label.active { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__modes span, .buy-book-dialog__methods span { display: grid; gap: 2px; }
.buy-book-dialog__modes small, .buy-book-dialog__methods small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 11px; }
.buy-book-dialog__section { display: grid; gap: 14px; padding: 16px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 10px; }
.buy-book-dialog__delivery { background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 4%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__section-title { display: flex; align-items: center; gap: 10px; }
.buy-book-dialog__section-title > div { display: grid; gap: 2px; }
.buy-book-dialog__section-title--action { flex-wrap: wrap; }
.buy-book-dialog__step { display: grid; width: 28px; height: 28px; flex: 0 0 28px; place-items: center; border-radius: 50%; background: var(--home-v2-blue, var(--app-accent, var(--primary-color))); color: #fff; font-size: 12px; font-style: normal; }
.buy-book-dialog__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
.buy-book-dialog__field { display: grid; align-content: start; gap: 7px; min-width: 0; font-weight: 800; }
.buy-book-dialog__field--full { grid-column: 1 / -1; }
.buy-book-dialog__field > span { font-size: 13px; }
.buy-book-dialog__field em { color: #dc4a4a; font-style: normal; }
.buy-book-dialog__field input, .buy-book-dialog__field textarea { width: 100%; min-height: 48px; padding: 11px 14px; border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4)); border-radius: 8px; background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff)); color: var(--home-v2-ink, var(--app-text, #172033)); font: inherit; font-weight: 500; outline: none; }
.buy-book-dialog__field textarea { min-height: 88px; resize: vertical; line-height: 1.7; }
.buy-book-dialog__field input:focus, .buy-book-dialog__field textarea:focus { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent); }
.buy-book-dialog__field input.invalid, .buy-book-dialog__field textarea.invalid { border-color: #dc4a4a; }
.buy-book-dialog__field-error { margin: 0; color: #c43e3e; font-size: 11px; font-weight: 700; }
.buy-book-dialog__field .buy-book-dialog__receipt-input { position: absolute; width: 1px; height: 1px; padding: 0; opacity: 0; overflow: hidden; pointer-events: none; }
.buy-book-dialog__receipt-picker { display: grid; min-height: 130px; padding: 18px; place-items: center; align-content: center; gap: 5px; border: 1.5px dashed var(--home-v2-line, var(--app-line, #cfd3dc)); border-radius: 10px; background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 3%, var(--home-v2-surface, var(--app-surface, #fff))); text-align: center; cursor: pointer; transition: border-color .2s ease, background .2s ease; }
.buy-book-dialog__receipt-picker:hover { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 7%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__receipt-picker.invalid { border-color: #dc4a4a; }
.buy-book-dialog__receipt-picker small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-weight: 500; }
.buy-book-dialog__receipt-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent); color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font-size: 21px; }
.buy-book-dialog__receipt-preview { display: grid; grid-template-columns: 70px minmax(0, 1fr) auto auto; min-height: 86px; padding: 8px; align-items: center; gap: 10px; border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4)); border-radius: 10px; background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff)); }
.buy-book-dialog__receipt-preview img { width: 70px; height: 70px; border-radius: 7px; object-fit: cover; }
.buy-book-dialog__receipt-preview > div { display: grid; min-width: 0; gap: 3px; }
.buy-book-dialog__receipt-preview b { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.buy-book-dialog__receipt-preview small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-weight: 500; }
.buy-book-dialog__receipt-preview label, .buy-book-dialog__receipt-preview button { padding: 7px 9px; border: 0; border-radius: 6px; background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 10%, transparent); color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font: inherit; font-size: 11px; font-weight: 800; cursor: pointer; }
.buy-book-dialog__receipt-preview button { background: color-mix(in srgb, #dc4a4a 10%, transparent); color: #bd3d3d; }
.buy-book-dialog__location-button { display: inline-flex; min-height: 38px; margin-inline-start: auto; padding: 0 12px; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--home-v2-blue, var(--app-accent, var(--primary-color))); border-radius: 7px; background: transparent; color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font-family: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
.buy-book-dialog__location-button:disabled { opacity: .55; cursor: wait; }
.buy-book-dialog__location-message { margin: 0; padding: 8px 10px; border-radius: 7px; background: color-mix(in srgb, #dc4a4a 10%, transparent); color: #b63c3c; font-size: 11px; }
.buy-book-dialog__location-message.success { background: color-mix(in srgb, #32a762 11%, transparent); color: #27824d; }
.buy-book-dialog__methods { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.buy-book-dialog__methods img { width: 38px; height: 38px; border-radius: 7px; object-fit: contain; }
.buy-book-dialog__field small:not(.buy-book-dialog__field-error), .buy-book-dialog__hint, .buy-book-dialog__privacy { margin: 0; color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 11px; }
.buy-book-dialog__error { margin: 0; padding: 10px 12px; border: 1px solid color-mix(in srgb, #dc4a4a 35%, transparent); border-radius: 7px; background: color-mix(in srgb, #dc4a4a 12%, var(--app-surface, #fff)); color: color-mix(in srgb, #dc4a4a 70%, var(--app-text, #172033)); font-size: 13px; }
.buy-book-dialog__submit:disabled { opacity: .55; cursor: wait; }
.buy-book-dialog__privacy { text-align: center; }
.buy-book-dialog__success { display: grid; place-items: center; gap: 10px; padding: 24px 5px 8px; text-align: center; }
.buy-book-dialog__success > span { display: grid; width: 58px; height: 58px; place-items: center; border-radius: 50%; background: color-mix(in srgb, #32a762 15%, var(--app-surface, #fff)); color: color-mix(in srgb, #32a762 78%, var(--app-text, #172033)); font-size: 28px; font-weight: 900; }
.buy-book-dialog__success h3, .buy-book-dialog__success p { margin: 0; }
.buy-book-dialog__success p { max-width: 410px; color: var(--home-v2-muted, var(--app-muted, #747b8b)); line-height: 1.8; }
.buy-book-dialog__success button { width: 160px; margin-top: 10px; }
@media (max-width: 560px) {
  .buy-book-dialog__modes, .buy-book-dialog__methods, .buy-book-dialog__fields { grid-template-columns: 1fr; }
  .buy-book-dialog__field--full { grid-column: auto; }
  .buy-book-dialog__location-button { width: 100%; margin-top: 4px; margin-inline-start: 38px; }
  .buy-book-dialog__receipt-preview { grid-template-columns: 58px minmax(0, 1fr) auto; }
  .buy-book-dialog__receipt-preview img { width: 58px; height: 58px; }
  .buy-book-dialog__receipt-preview button { grid-column: 3; }
}
</style>
