<script setup lang="ts">
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import { PaymentProductType } from "~/components/CourseDetails/Enum/payment_product_type_enum";
import PaymentDialog from "~/components/CourseDetails/PaymentDialog.vue";
import type QuestionBankModel from "~/features/QuestionBank/Data/models/question_banks_model";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";

const props = defineProps<{
  bank: QuestionBankModel;
}>();
const emit = defineEmits<{
  statusChanged: [bankId: number, status: number];
}>();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const settingsStore = useSettingStore();
const toast = useToast();
const activating = ref(false);
const joining = ref(false);

const normalizeStatus = (value: unknown): number => {
  const numericStatus = Number(value);
  if (Number.isFinite(numericStatus)) return numericStatus;

  const status = String(value ?? "").trim().toLowerCase();
  if (["pending", "waiting", "under_review"].includes(status)) return 1;
  if (["active", "approved", "paid", "subscribed"].includes(status)) return 2;
  if (["rejected", "declined"].includes(status)) return 4;
  return 0;
};

const subscriptionRecord = computed<Record<string, unknown>>(() =>
  props.bank.subscription && typeof props.bank.subscription === "object"
    ? props.bank.subscription as Record<string, unknown>
    : {},
);
const initialStatus = () => {
  if (props.bank.isSubscribed) return 2;
  return normalizeStatus(
    props.bank.subscriptionStatus
      ?? subscriptionRecord.value.status
      ?? subscriptionRecord.value.order_status
      ?? subscriptionRecord.value.allow_status,
  );
};
const status = ref(initialStatus());

watch(
  () => [
    props.bank.id,
    props.bank.isSubscribed,
    props.bank.subscriptionStatus,
    props.bank.subscription,
  ],
  () => {
    status.value = initialStatus();
  },
  { deep: true },
);

const contentRoute = computed(() => `/question-bank/${props.bank.id}`);
const isOwned = computed(
  () => props.bank.isSubscribed || status.value === 2,
);
const canRequestJoin = computed(
  () =>
    props.bank.monthPrice > 0
    && props.bank.isActive
    && !isOwned.value
    && status.value === 0
    && Number(settingsStore.setting?.join_option_status) === 1,
);

const ensureSuccessfulResponse = (response: any, fallbackMessage: string) => {
  const httpStatus = Number(response?.status);
  const apiStatus = response?.data?.status;
  const apiSuccess = response?.data?.success;
  const failed =
    !Number.isFinite(httpStatus)
    || httpStatus < 200
    || httpStatus >= 300
    || apiStatus === false
    || apiStatus === 0
    || apiSuccess === false
    || apiSuccess === 0;

  if (failed) {
    throw new Error(
      response?.data?.message || fallbackMessage,
    );
  }
};

const redirectToLogin = async (message: string) => {
  toast.add({
    severity: "info",
    summary: "سجّل دخولك أولًا",
    detail: message,
    life: 3500,
  });
  await router.push({
    path: "/loginhome",
    query: { redirect: route.fullPath },
  });
};

const startFreeBank = async () => {
  if (activating.value) return;

  if (!userStore.user?.apiToken) {
    await redirectToLogin("يلزم تسجيل الدخول لإضافة بنك الأسئلة إلى حسابك.");
    return;
  }

  activating.value = true;
  try {
    const response = await NetworkService.instance.post({
      url: ApiNames.Instance.buy_product,
      isAuth: true,
      data: {
        question_bank_id: props.bank.id,
        subscription_type: 5,
      },
    });
    ensureSuccessfulResponse(response, "تعذر تفعيل بنك الأسئلة المجاني.");
    status.value = 2;
    emit("statusChanged", props.bank.id, 2);
    toast.add({
      severity: "success",
      summary: "بنك الأسئلة جاهز",
      detail: "تمت إضافته إلى مشترياتك ويمكنك بدء التدريب الآن.",
      life: 3500,
    });
    await router.push(contentRoute.value);
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "تعذر بدء التدريب",
      detail:
        error?.response?.data?.message
        || error?.message
        || "حاول مرة أخرى بعد قليل.",
      life: 4500,
    });
  } finally {
    activating.value = false;
  }
};

const requestJoin = async () => {
  if (joining.value || !canRequestJoin.value) return;

  if (!userStore.user?.apiToken) {
    await redirectToLogin("يلزم تسجيل الدخول لإرسال طلب الانضمام.");
    return;
  }

  joining.value = true;
  try {
    const bankId = Number(props.bank.id);
    if (!Number.isInteger(bankId) || bankId <= 0) {
      throw new Error("معرّف بنك الأسئلة غير صالح. أعد تحميل الصفحة وحاول مرة أخرى.");
    }

    const response = await NetworkService.instance.post({
      url: ApiNames.Instance.buy_product,
      isAuth: true,
      data: {
        question_bank_id: bankId,
        subscription_type: 5,
      },
    });
    ensureSuccessfulResponse(response, "تعذر إرسال طلب الانضمام.");

    status.value = 1;
    emit("statusChanged", props.bank.id, 1);
    DialogSelector.instance.successDialog.openDialog({
      dialogName: "dialog",
      titleContent: "تم إرسال طلب الانضمام بنجاح",
      imageElement: successImage,
      messageContent:
        response?.data?.message
        || "سنراجع طلبك، وسيظهر بنك الأسئلة في مشترياتك فور اعتماد الطلب.",
      autoCloseMs: 6500,
    });
  } catch (error: any) {
    DialogSelector.instance.errorDialog.openDialog({
      dialogName: "dialog",
      titleContent: "لم يتم إرسال طلب الانضمام",
      imageElement: errorImage,
      messageContent:
        error?.response?.data?.message
        || error?.message
        || "تعذر إرسال الطلب الآن. حاول مرة أخرى.",
      autoCloseMs: 6500,
    });
  } finally {
    joining.value = false;
  }
};

const updateStatus = (nextStatus: number) => {
  status.value = nextStatus;
  emit("statusChanged", props.bank.id, nextStatus);
};
</script>

<template>
  <NuxtLink v-if="isOwned" class="question-bank-action question-bank-action--owned" :to="contentRoute">
    كمّل تدريبك
    <i class="pi pi-arrow-left" aria-hidden="true" />
  </NuxtLink>

  <button
    v-else-if="bank.monthPrice <= 0 && bank.isActive"
    type="button"
    class="question-bank-action"
    :disabled="activating"
    @click="startFreeBank"
  >
    <i :class="activating ? 'pi pi-spin pi-spinner' : 'pi pi-play'" aria-hidden="true" />
    {{ activating ? "جاري تجهيز البنك..." : "ابدأ التدريب مجانًا" }}
  </button>

  <div v-else-if="bank.isActive" class="question-bank-actions">
    <PaymentDialog
      :question-bank-id="bank.id"
      :product-type="PaymentProductType.QUESTION_BANK"
      :status="status"
      :product-title="bank.title"
      :price="bank.monthPrice"
      :currency="bank.currency"
      pending-label="طلب الانضمام قيد المراجعة"
      class="question-bank-payment"
      @status-changed="updateStatus"
    />

    <button
      v-if="canRequestJoin"
      type="button"
      class="question-bank-action question-bank-action--join"
      :disabled="joining"
      @click="requestJoin"
    >
      <i :class="joining ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'" aria-hidden="true" />
      {{ joining ? "جاري إرسال الطلب..." : "طلب الانضمام" }}
    </button>
  </div>

  <span v-else class="question-bank-action question-bank-action--disabled">
    غير متاح حاليًا
  </span>
</template>

<style scoped>
.question-bank-action {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 17px;
  border: 1px solid var(--home-v2-blue, var(--app-accent));
  border-radius: 10px;
  background: var(--home-v2-blue, var(--app-accent));
  color: #fff;
  font: 900 13px/1.4 var(--home-v2-heading, inherit);
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow 180ms ease, filter 180ms ease, transform 180ms ease;
}

.question-bank-action:hover:not(:disabled),
.question-bank-action:focus-visible {
  box-shadow: 0 12px 26px -16px var(--home-v2-blue, var(--app-accent));
  filter: brightness(1.04);
  outline: 0;
  transform: translateY(-1px);
}

.question-bank-action:disabled {
  cursor: wait;
  opacity: 0.72;
}

.question-bank-action--owned {
  border-color: #138a4b;
  background: #138a4b;
}

.question-bank-actions {
  display: grid;
  min-width: min(100%, 190px);
  gap: 8px;
}

.question-bank-action--join {
  border-color: color-mix(in srgb, var(--home-v2-blue, var(--app-accent)) 55%, transparent);
  background: transparent;
  color: var(--home-v2-blue, var(--app-accent));
}

.question-bank-action--join:hover:not(:disabled),
.question-bank-action--join:focus-visible {
  background: color-mix(in srgb, var(--home-v2-blue, var(--app-accent)) 8%, transparent);
}

.question-bank-action--disabled {
  border-color: transparent;
  background: var(--home-v2-cream, var(--app-bg-muted));
  color: var(--home-v2-muted, var(--app-muted));
  cursor: not-allowed;
}

.question-bank-payment {
  min-width: min(100%, 190px);
}

.question-bank-payment :deep(.course-payment__trigger) {
  min-height: 44px;
  padding-inline: 17px;
  font-size: 13px;
}

@media (max-width: 640px) {
  .question-bank-action,
  .question-bank-actions,
  .question-bank-payment {
    width: 100%;
  }
}
</style>
