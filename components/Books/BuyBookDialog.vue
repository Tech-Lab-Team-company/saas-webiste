<script setup lang="ts">
import Dialog from "primevue/dialog";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import FetchPaymentMethodsParams from "~/features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "~/features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
import BookOnlinePaymentParams from "~/features/OnlinePayment/Core/Params/book_online_payment_params";
import OnlinePaymentController from "~/features/OnlinePayment/presentation/controllers/online_payment_controller";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import { useSiteUrl } from "~/utils/siteUrl";
import { DataSuccess } from "~/base/core/networkStructure/Resources/dataState/data_state";
import AddFavoriteController from "~/features/Favorite/presentation/controllers/add_favorite_controller";
import AddFavoriteParams from "~/features/Favorite/Core/Params/add_favorite_params";
import { FavoriteEnum } from "~/features/Favorite/Core/enums/favorite_params";

const props = defineProps<{
  bookId: number;
  title: string;
  price: number;
  currency: string;
  optionLabel: string;
  requiresDelivery: boolean;
  isFavorite: boolean;
  triggerLabel?: string;
}>();

const emit = defineEmits<{ purchased: [] }>();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const paymentStore = usePaymentStore();
const toast = useToast();
const { buildSiteUrl } = useSiteUrl();

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
const fieldErrors = ref<Record<string, string>>({});
const locationMessage = ref("");
const locationMessageType = ref<"success" | "error" | null>(null);
const favoriteController = AddFavoriteController.getInstance();
const isFavorite = ref(props.isFavorite);
const isFavoritePending = ref(false);
const { getLocation, isLoading: locating } = useGeolocation();

watch(
  () => props.isFavorite,
  (value) => {
    isFavorite.value = value;
  },
);

const paymentMethods = computed(() => paymentStore.Payment ?? []);
const selectedMethod = computed(() =>
  paymentMethods.value.find((method) => method.id === selectedPaymentMethodId.value),
);
const isOnlinePayment = computed(() => Number(selectedMethod.value?.type) === 1);
const isOfflinePayment = computed(() => Number(selectedMethod.value?.type) === 2);
const receiptSize = computed(() => receiptFile.value
  ? `${(receiptFile.value.size / 1024 / 1024).toFixed(2)} MB`
  : "");

const toggleFavorite = async () => {
  if (isFavoritePending.value) return;

  const bookId = Number(props.bookId);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "تعذر تحديد الكتاب لإضافته إلى المفضلة.",
      life: 3000,
    });
    return;
  }

  const wasFavorite = isFavorite.value;
  isFavoritePending.value = true;

  try {
    const stateRef = await favoriteController.addFavorite(
      new AddFavoriteParams(FavoriteEnum.BOOK, bookId),
    );

    if (!(stateRef.value instanceof DataSuccess)) {
      throw new Error(
        stateRef.value.error?.title ?? "تعذر تحديث المفضلة.",
      );
    }

    isFavorite.value = !wasFavorite;
    toast.add({
      severity: "success",
      summary: wasFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      detail: wasFavorite
        ? "تمت إزالة الكتاب من قائمة المفضلة."
        : "تمت إضافة الكتاب إلى قائمة المفضلة بنجاح.",
      life: 3000,
    });
  } catch (error: unknown) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail:
        error instanceof Error
          ? error.message
          : "تعذر تحديث المفضلة. حاول مرة أخرى.",
      life: 3000,
    });
  } finally {
    isFavoritePending.value = false;
  }
};

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
    await router.push({ path: "/loginhome", query: { redirect: route.fullPath } });
    return;
  }

  errorMessage.value = "";
  fieldErrors.value = {};
  locationMessage.value = "";
  locationMessageType.value = null;
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
    if (selectedMethod.value && !isOnlinePayment.value && !isOfflinePayment.value) {
      errors.paymentMethod = "وسيلة الدفع المختارة غير مدعومة حاليًا.";
    }
    if (isOfflinePayment.value && transferredAccount.value.trim().length < 6) {
      errors.transferredAccount = "أدخل رقم الحساب أو الهاتف الذي تم التحويل منه.";
    }
    if (isOfflinePayment.value && !receiptFile.value) {
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

const apiResponseMessage = (response: any) =>
  response?.data?.message || response?.data?.data?.message;

const translateBuyProductError = (message: string): string => {
  const normalizedMessage = message.trim().toLowerCase();
  if (normalizedMessage.includes("transferred account is required")) {
    return "يرجى إدخال رقم الحساب أو الهاتف الذي تم التحويل منه.";
  }
  if (normalizedMessage.includes("receipt is required")) {
    return "يرجى إرفاق صورة إيصال التحويل.";
  }
  if (normalizedMessage.includes("payment method") && normalizedMessage.includes("required")) {
    return "يرجى اختيار وسيلة الدفع.";
  }
  return message;
};

const ensureSuccessfulBuyProductResponse = (response: any) => {
  const httpStatus = Number(response?.status);
  const apiStatus = response?.data?.status;
  const apiSuccess = response?.data?.success;
  const normalizedApiStatus = String(apiStatus ?? "").toLowerCase();
  const normalizedApiSuccess = String(apiSuccess ?? "").toLowerCase();
  const hasFailedApiStatus =
    apiStatus === false
    || apiStatus === 0
    || ["0", "false", "error", "failed", "fail"].includes(normalizedApiStatus)
    || apiSuccess === false
    || apiSuccess === 0
    || ["0", "false", "error", "failed", "fail"].includes(normalizedApiSuccess);

  if (
    !response
    || !Number.isFinite(httpStatus)
    || httpStatus < 200
    || httpStatus >= 300
    || hasFailedApiStatus
  ) {
    throw new Error(apiResponseMessage(response) || "تعذر إتمام طلب شراء الكتاب.");
  }
};

const showSuccessfulPurchaseDialog = async (response: any) => {
  const titleContent = props.requiresDelivery
    ? "تم إرسال طلب شراء وتوصيل الكتاب بنجاح"
    : mode.value === "join"
      ? "تم إرسال طلب الانضمام بنجاح"
      : "تم إرسال طلب شراء الكتاب بنجاح";
  const messageContent = String(
    apiResponseMessage(response)
      || (props.requiresDelivery
        ? "سنراجع الطلب وبيانات التوصيل، وسيتم تحديث حالته على حسابك."
        : "سنراجع الطلب، وستظهر حالته على حسابك فور اعتماده."),
  );

  visible.value = false;
  await nextTick();
  DialogSelector.instance.successDialog.openDialog({
    dialogName: "dialog",
    titleContent,
    imageElement: successImage,
    messageContent,
    autoCloseMs: 6500,
  });
};

const errorMessageFromRequest = (error: any): string => {
  const response = error?.response;
  const responseMessage = apiResponseMessage(response);
  const validationErrors = response?.data?.errors;

  if (responseMessage) return translateBuyProductError(String(responseMessage));

  if (validationErrors && typeof validationErrors === "object") {
    const message = Object.values(validationErrors).flat().filter(Boolean).join(" ");
    if (message) return translateBuyProductError(message);
  }

  if (!response && (error?.code === "ERR_NETWORK" || error?.request)) {
    return "تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مرة أخرى.";
  }

  const status = Number(response?.status);
  if (status === 401) return "انتهت جلسة تسجيل الدخول. سجّل الدخول ثم أعد المحاولة.";
  if (status === 403) return "لا يمكنك إرسال هذا الطلب حاليًا.";
  if (status === 404) return "خدمة شراء الكتاب غير متاحة حاليًا.";
  if (status === 422) return "بعض بيانات الطلب غير صحيحة. راجعها ثم حاول مرة أخرى.";
  if (status === 429) return "تم إرسال محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.";
  if (status >= 500) return "حدث خطأ بالخادم أثناء إرسال الطلب. حاول مرة أخرى لاحقًا.";

  return error?.message || "تعذر إرسال طلب الشراء. راجع البيانات وحاول مرة أخرى.";
};

const showPurchaseErrorDialog = async (messageContent: string) => {
  visible.value = false;
  await nextTick();
  DialogSelector.instance.errorDialog.openDialog({
    dialogName: "dialog",
    titleContent: "لم يتم إرسال طلب شراء الكتاب",
    imageElement: errorImage,
    messageContent,
    autoCloseMs: 6500,
  });
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

const buildDeliveryData = () => props.requiresDelivery
  ? {
      city: city.value.trim(),
      address: address.value.trim(),
      lat: Number(latitude.value),
      lng: Number(longitude.value),
      teacher_district: teacherDistrict.value.trim(),
      location_details: locationDetails.value.trim(),
    }
  : null;

const submitOnlinePayment = async (deliveryData: ReturnType<typeof buildDeliveryData>) => {
  if (!selectedMethod.value) return;

  const callbackUrl = buildSiteUrl(
    `/paymentverify/${selectedMethod.value.id}?source=book&bookId=${props.bookId}`,
  );
  const params = new BookOnlinePaymentParams(
    props.bookId,
    selectedMethod.value.id,
    callbackUrl,
    deliveryData,
  );
  const state = await OnlinePaymentController.getInstance().CreateOnlinePayment(params, router);
  const paymentId = Number(state.value.data?.id);
  const gatewayUrl = state.value.data?.url;

  if (!Number.isFinite(paymentId) || paymentId <= 0 || !gatewayUrl) {
    throw new Error(
      state.value.error?.title || "تعذر إنشاء جلسة الدفع الآمن. حاول مرة أخرى.",
    );
  }

  window.localStorage.setItem("onlinePaymentId", String(paymentId));
  window.localStorage.setItem("onlinePaymentContext", JSON.stringify({
    source: "book",
    bookId: props.bookId,
    title: props.title,
    optionLabel: props.optionLabel,
    returnUrl: route.fullPath,
  }));
  visible.value = false;
  window.location.assign(gatewayUrl);
};

const submit = async () => {
  errorMessage.value = "";
  if (!validate()) return;

  submitting.value = true;
  try {
    const deliveryData = buildDeliveryData();

    if (mode.value === "offline" && isOnlinePayment.value) {
      await submitOnlinePayment(deliveryData);
      return;
    }

    const payload = {
      book_id: props.bookId,
      subscription_type: mode.value === "join" ? 5 : 1,
      ...(deliveryData ?? {}),
      ...(mode.value === "offline"
        ? {
            payment_method_id: selectedPaymentMethodId.value,
            ...(isOfflinePayment.value
              ? {
                  transferred_account: transferredAccount.value.trim(),
                  receipt: receiptFile.value,
                }
              : {}),
          }
        : {}),
    };

    const request = {
      url: ApiNames.Instance.buy_product,
      data: payload,
      isAuth: true,
    };
    let response;
    if (mode.value === "offline" && isOfflinePayment.value) {
      response = await NetworkService.instance.postFormData(request);
    } else {
      response = await NetworkService.instance.post(request);
    }

    ensureSuccessfulBuyProductResponse(response);

    emit("purchased");
    await showSuccessfulPurchaseDialog(response);
  } catch (error: any) {
    errorMessage.value = errorMessageFromRequest(error);
    await showPurchaseErrorDialog(errorMessage.value);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <button type="button" class="buy-book-trigger" @click="open">
    {{ triggerLabel || "شراء هذه النسخة" }}
    <span aria-hidden="true">←</span>
  </button>

             <button
                  type="button"
                  class="favorite-action"
                  :class="{ 'favorite-action--active': isFavorite }"
                  :disabled="isFavoritePending"
                  :aria-pressed="isFavorite"
                  :aria-label="isFavorite ? 'أزل الكتاب من المفضلة' : 'أضف الكتاب إلى المفضلة'"
                  @click="toggleFavorite"
                >
                  <span class="favorite-action__heart" aria-hidden="true">
                    <i :class="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
                  </span>
                  <span class="favorite-action__label">
                    {{ isFavorite ? "إزالة من المفضلة" : "أضف إلى المفضلة" }}
                  </span>
                  <i
                    v-if="isFavoritePending"
                    class="pi pi-spin pi-spinner favorite-action__spinner"
                    aria-hidden="true"
                  ></i>
                </button>

  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :draggable="false"
    :style="{ width: 'min(680px, calc(100vw - 24px))' }"
    class="buy-book-dialog"
    dir="rtl"
  >
    <template #header>
      <div class="buy-book-dialog__header">
        <span class="buy-book-dialog__header-icon pi pi-book" aria-hidden="true" />
        <span>
          <strong>إتمام شراء الكتاب</strong>
          <small>{{ title }}</small>
        </span>
      </div>
    </template>

    <form class="buy-book-dialog__form" @submit.prevent="submit">
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
          <span><b>الدفع الآن</b><small>اختر الدفع الإلكتروني أو التحويل</small></span>
        </label>
        <label :class="{ active: mode === 'join' }">
          <input v-model="mode" type="radio" value="join" />
          <span><b>طلب انضمام</b><small>أرسل طلبًا بدون بيانات دفع</small></span>
        </label>
      </fieldset>

      <template v-if="mode === 'offline'">
        <div class="buy-book-dialog__section-title">
          <b>وسيلة الدفع</b>
          <small>اختر وسيلة الدفع المناسبة لك</small>
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
            />
            <span class="buy-book-dialog__method-visual">
              <img v-if="method.image" :src="method.image" alt="" />
              <i
                v-else
                :class="['pi', Number(method.type) === 1 ? 'pi-credit-card' : 'pi-wallet']"
                aria-hidden="true"
              />
            </span>
            <span class="buy-book-dialog__method-copy">
              <b>{{ method.title }}</b>
              <small v-if="Number(method.type) === 1">دفع إلكتروني آمن</small>
              <small v-else>{{ method.account_number || "تحويل فوري مع إرفاق الإيصال" }}</small>
            </span>
            <span class="buy-book-dialog__method-check pi pi-check" aria-hidden="true" />
          </label>
        </div>
        <p v-if="fieldErrors.paymentMethod" class="buy-book-dialog__field-error">{{ fieldErrors.paymentMethod }}</p>

        <div v-if="isOnlinePayment" class="buy-book-dialog__gateway-note" role="status">
          <span class="pi pi-shield" aria-hidden="true" />
          <div>
            <b>دفع آمن عبر Fawaterk</b>
            <small>سيتم تحويلك إلى بوابة الدفع لإتمام العملية، ولا تحتاج إلى رفع إيصال.</small>
          </div>
        </div>

        <label v-if="isOfflinePayment" class="buy-book-dialog__field buy-book-dialog__field--full">
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

        <div v-if="isOfflinePayment" class="buy-book-dialog__field buy-book-dialog__field--full">
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
        {{
          submitting
            ? mode === "offline" && isOnlinePayment ? "جاري فتح بوابة الدفع..." : "جاري إرسال الطلب..."
            : mode === "join"
              ? "إرسال طلب الانضمام"
              : isOnlinePayment
                ? "المتابعة إلى الدفع"
                : "تأكيد بيانات التحويل"
        }}
      </button>
      <p class="buy-book-dialog__privacy">بياناتك محمية وتُستخدم فقط للتحقق من عملية الشراء.</p>
    </form>
  </Dialog>
</template>

<style scoped>
:global(.buy-book-dialog.p-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--home-v2-deep, #3a3e7e) 20%, var(--app-line, #dfe3eb));
  border-radius: 18px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 28px 80px rgb(8 20 48 / 26%);
}
:global(.buy-book-dialog .p-dialog-header) { padding: 20px 22px 16px; border-bottom: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); }
:global(.buy-book-dialog .p-dialog-content) { padding: 20px 22px 24px; background: var(--home-v2-surface, var(--app-surface, #fff)); }
.buy-book-trigger,
.buy-book-dialog__submit {
  display: inline-flex;
  min-height: 54px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 0;
  border-radius: 8px;
  background: var(--home-v2-blue, var(--app-accent, var(--primary-color)));
  color: var(--book-details-action-text, #fff);
  font: 800 16px var(--home-v2-heading, inherit);
  cursor: pointer;
}
.buy-book-trigger span { transition: transform .2s ease; }
.buy-book-trigger:hover span { transform: translateX(-4px); }
:global(html[data-theme="dark"]) .buy-book-dialog__submit {
  color: #07101f;
}
.buy-book-dialog__header { display: flex; align-items: center; gap: 12px; }
.buy-book-dialog__header > span:last-child { display: grid; gap: 3px; }
.buy-book-dialog__header strong { color: var(--home-v2-ink, var(--app-text, #172033)); font-size: 19px; line-height: 1.45; font-weight: 900; }
.buy-book-dialog__header small { color: var(--home-v2-muted, var(--app-muted, #70778a)); font-size: 13px; line-height: 1.6; }
.buy-book-dialog__header-icon { display: grid; width: 46px; height: 46px; flex: 0 0 46px; place-items: center; border-radius: 12px; background: color-mix(in srgb, var(--home-v2-deep, #3a3e7e) 12%, transparent); color: var(--home-v2-deep, var(--app-accent-secondary, #3a3e7e)); font-size: 20px; }
.buy-book-dialog__form { display: grid; gap: 20px; }
:deep(.p-dialog-content) { max-height: min(78vh, 760px); }
.buy-book-dialog__summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 12px; background: var(--home-v2-cream, var(--app-bg-muted, #f7f5ef)); }
.buy-book-dialog__summary div { display: grid; gap: 4px; }
.buy-book-dialog__summary small, .buy-book-dialog__section-title small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 13px; line-height: 1.6; }
.buy-book-dialog__summary strong { font-size: 15px; line-height: 1.6; }
.buy-book-dialog__summary b { color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); font-size: 22px; }
.buy-book-dialog__modes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0; padding: 0; border: 0; }
.buy-book-dialog__modes legend { grid-column: 1 / -1; margin-bottom: 6px; font-size: 16px; font-weight: 900; }
.buy-book-dialog__modes legend .buy-book-dialog__step { display: inline-grid; margin-inline-end: 6px; vertical-align: middle; }
.buy-book-dialog__modes label, .buy-book-dialog__methods label { display: flex; align-items: center; gap: 12px; padding: 15px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 11px; background: var(--home-v2-surface, var(--app-surface, #fff)); cursor: pointer; }
.buy-book-dialog__modes label.active, .buy-book-dialog__methods label.active { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__modes span, .buy-book-dialog__methods span { display: grid; gap: 2px; }
.buy-book-dialog__modes b, .buy-book-dialog__methods b { font-size: 15px; }
.buy-book-dialog__modes small, .buy-book-dialog__methods small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 12px; line-height: 1.5; }
.buy-book-dialog__section { display: grid; gap: 14px; padding: 16px; border: 1px solid var(--home-v2-line, var(--app-line, #e2e4ea)); border-radius: 10px; }
.buy-book-dialog__delivery { background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 4%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__section-title { display: flex; align-items: center; gap: 10px; }
.buy-book-dialog__section-title > div { display: grid; gap: 2px; }
.buy-book-dialog__section-title b { font-size: 16px; }
.buy-book-dialog__section-title--action { flex-wrap: wrap; }
.buy-book-dialog__step { display: grid; width: 32px; height: 32px; flex: 0 0 32px; place-items: center; border-radius: 50%; background: var(--home-v2-blue, var(--app-accent, var(--primary-color))); color: #fff; font-size: 14px; font-style: normal; }
.buy-book-dialog__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
.buy-book-dialog__field { display: grid; align-content: start; gap: 7px; min-width: 0; font-weight: 800; }
.buy-book-dialog__field--full { grid-column: 1 / -1; }
.buy-book-dialog__field > span { font-size: 14px; }
.buy-book-dialog__field em { color: #dc4a4a; font-style: normal; }
.buy-book-dialog__field input, .buy-book-dialog__field textarea { width: 100%; min-height: 48px; padding: 11px 14px; border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4)); border-radius: 8px; background: var(--home-v2-surface-raised, var(--app-surface-raised, #fff)); color: var(--home-v2-ink, var(--app-text, #172033)); font: inherit; font-weight: 500; outline: none; }
.buy-book-dialog__field textarea { min-height: 88px; resize: vertical; line-height: 1.7; }
.buy-book-dialog__field input:focus, .buy-book-dialog__field textarea:focus { border-color: var(--home-v2-blue, var(--app-accent, var(--primary-color))); box-shadow: 0 0 0 3px color-mix(in srgb, var(--home-v2-blue, var(--app-accent, #28366c)) 12%, transparent); }
.buy-book-dialog__field input.invalid, .buy-book-dialog__field textarea.invalid { border-color: #dc4a4a; }
.buy-book-dialog__field-error { margin: 0; color: #c43e3e; font-size: 12px; font-weight: 700; }
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
.buy-book-dialog__methods label { position: relative; min-height: 88px; padding: 14px; overflow: hidden; transition: border-color .2s ease, background .2s ease, transform .2s ease; }
.buy-book-dialog__methods label:hover { transform: translateY(-1px); }
.buy-book-dialog__methods label > input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.buy-book-dialog__method-visual { display: grid; width: 48px; height: 48px; flex: 0 0 48px; place-items: center; border-radius: 10px; background: color-mix(in srgb, var(--home-v2-deep, #3a3e7e) 9%, transparent); color: var(--home-v2-deep, var(--app-accent-secondary, #3a3e7e)); font-size: 20px; }
.buy-book-dialog__method-visual img { width: 34px; height: 34px; border-radius: 6px; object-fit: contain; }
.buy-book-dialog__method-copy { min-width: 0; flex: 1; }
.buy-book-dialog__method-check { display: grid; width: 22px; height: 22px; flex: 0 0 22px; place-items: center; border: 1px solid var(--home-v2-line, var(--app-line, #d9dce4)); border-radius: 50%; color: transparent; font-size: 10px; }
.buy-book-dialog__methods label.active .buy-book-dialog__method-check { border-color: var(--home-v2-deep, #3a3e7e); background: var(--home-v2-deep, #3a3e7e); color: #fff; }
.buy-book-dialog__gateway-note { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid color-mix(in srgb, #32a762 35%, var(--home-v2-line, var(--app-line, #d9dce4))); border-radius: 9px; background: color-mix(in srgb, #32a762 9%, var(--home-v2-surface, var(--app-surface, #fff))); }
.buy-book-dialog__gateway-note > span { display: grid; width: 38px; height: 38px; flex: 0 0 38px; place-items: center; border-radius: 50%; background: color-mix(in srgb, #32a762 16%, transparent); color: #27824d; font-size: 17px; }
.buy-book-dialog__gateway-note > div { display: grid; gap: 3px; }
.buy-book-dialog__gateway-note b { color: var(--home-v2-ink, var(--app-text, #172033)); font-size: 15px; }
.buy-book-dialog__gateway-note small { color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 13px; line-height: 1.7; }
.buy-book-dialog__field small:not(.buy-book-dialog__field-error), .buy-book-dialog__hint, .buy-book-dialog__privacy { margin: 0; color: var(--home-v2-muted, var(--app-muted, #747b8b)); font-size: 12px; line-height: 1.6; }
.buy-book-dialog__error { margin: 0; padding: 10px 12px; border: 1px solid color-mix(in srgb, #dc4a4a 35%, transparent); border-radius: 7px; background: color-mix(in srgb, #dc4a4a 12%, var(--app-surface, #fff)); color: color-mix(in srgb, #dc4a4a 70%, var(--app-text, #172033)); font-size: 13px; }
.buy-book-dialog__submit:disabled { opacity: .55; cursor: wait; }
.buy-book-dialog__privacy { text-align: center; }
@media (max-width: 560px) {
  .buy-book-dialog__modes, .buy-book-dialog__methods, .buy-book-dialog__fields { grid-template-columns: 1fr; }
  .buy-book-dialog__field--full { grid-column: auto; }
  .buy-book-dialog__location-button { width: 100%; margin-top: 4px; margin-inline-start: 38px; }
  .buy-book-dialog__receipt-preview { grid-template-columns: 58px minmax(0, 1fr) auto; }
  .buy-book-dialog__receipt-preview img { width: 58px; height: 58px; }
  .buy-book-dialog__receipt-preview button { grid-column: 3; }
}
</style>
