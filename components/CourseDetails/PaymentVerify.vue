<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { PaymentVerifyEnum } from "~/features/VerifyPayment/Core/Enum/payment_verify_enum";
import VerifyPaymentParams from "~/features/VerifyPayment/Core/Params/verify_payment_params";
import VerifyPaymentController from "~/features/VerifyPayment/presentation/controllers/verify_payment_controller";

type OnlinePaymentContext = {
  source?: "book" | "course";
  bookId?: number;
  courseId?: number;
  title?: string;
  optionLabel?: string;
  returnUrl?: string;
};

const route = useRoute();
const router = useRouter();
const paymentStatus = ref<number | null>(null);
const verifying = ref(true);
const errorMessage = ref("");
const paymentContext = ref<OnlinePaymentContext>({});

const isBookPayment = computed(() =>
  route.query.source === "book" || paymentContext.value.source === "book",
);
const resultTitle = computed(() => {
  if (verifying.value) return "جاري التحقق من عملية الدفع";
  if (errorMessage.value) return "تعذر التحقق من عملية الدفع";
  if (paymentStatus.value === PaymentVerifyEnum.SUCCESS) {
    return isBookPayment.value ? "تم شراء الكتاب بنجاح" : "تم شراء الكورس بنجاح";
  }
  if (paymentStatus.value === PaymentVerifyEnum.FAILED) return "عملية الدفع غير مكتملة";
  return "عملية الدفع قيد المراجعة";
});
const resultDescription = computed(() => {
  if (verifying.value) return "انتظر لحظات بينما نتأكد من نتيجة الدفع من بوابة Fawaterk.";
  if (errorMessage.value) return errorMessage.value;
  if (paymentStatus.value === PaymentVerifyEnum.SUCCESS) {
    return isBookPayment.value
      ? "تم تأكيد الدفع، وستجد الكتاب متاحًا على حسابك بعد تحديث بيانات الطلب."
      : "تم تأكيد الدفع، وأصبح اشتراك الكورس مرتبطًا بحسابك.";
  }
  if (paymentStatus.value === PaymentVerifyEnum.FAILED) {
    return "لم تؤكد بوابة الدفع العملية. لم يتم اعتماد الطلب ويمكنك المحاولة مرة أخرى.";
  }
  return "وصلت عملية الدفع وجارٍ اعتمادها. يمكنك إعادة التحقق بعد قليل.";
});
const returnLabel = computed(() => isBookPayment.value ? "العودة إلى الكتاب" : "العودة إلى الكورس");

const readPaymentContext = () => {
  try {
    const rawContext = window.localStorage.getItem("onlinePaymentContext");
    paymentContext.value = rawContext ? JSON.parse(rawContext) : {};
  } catch {
    paymentContext.value = {};
  }
};

const normalizedReturnUrl = () => {
  const storedReturnUrl = String(paymentContext.value.returnUrl || "");
  if (storedReturnUrl.startsWith("/") && !storedReturnUrl.startsWith("//")) {
    return storedReturnUrl;
  }

  if (isBookPayment.value) {
    const bookId = Number(route.query.bookId || paymentContext.value.bookId);
    return Number.isFinite(bookId) && bookId > 0 ? `/books/${bookId}` : "/books";
  }

  const courseId = Number(paymentContext.value.courseId);
  return Number.isFinite(courseId) && courseId > 0 ? `/course/${courseId}` : "/course";
};

const verifyPayment = async () => {
  verifying.value = true;
  errorMessage.value = "";

  const paymentMethodId = Number(route.params.id);
  const returnedPaymentId = Array.isArray(route.query.payment_id)
    ? route.query.payment_id[0]
    : route.query.payment_id || route.query.paymentId;
  const paymentId = Number(
    returnedPaymentId || window.localStorage.getItem("onlinePaymentId"),
  );

  if (!Number.isFinite(paymentMethodId) || paymentMethodId <= 0) {
    errorMessage.value = "رقم وسيلة الدفع غير صحيح.";
    verifying.value = false;
    return;
  }
  if (!Number.isFinite(paymentId) || paymentId <= 0) {
    errorMessage.value = "لم نتمكن من العثور على رقم جلسة الدفع.";
    verifying.value = false;
    return;
  }

  try {
    const params = new VerifyPaymentParams(paymentMethodId, paymentId);
    const state = await VerifyPaymentController.getInstance().CreateVerifyPayment(params, router);

    if (!state.value.data) {
      throw new Error(state.value.error?.title || "لم تصل نتيجة صالحة من خدمة الدفع.");
    }

    paymentStatus.value = Number(state.value.data.status);
    if (
      paymentStatus.value === PaymentVerifyEnum.SUCCESS
      || paymentStatus.value === PaymentVerifyEnum.FAILED
    ) {
      window.localStorage.removeItem("onlinePaymentId");
      window.localStorage.removeItem("onlinePaymentContext");
    }
  } catch (error: any) {
    errorMessage.value = error?.message || "حدث خطأ أثناء التحقق من عملية الدفع.";
  } finally {
    verifying.value = false;
  }
};

const returnToProduct = () => router.replace(normalizedReturnUrl());

onMounted(() => {
  readPaymentContext();
  verifyPayment();
});
</script>

<template>
  <main
    :class="[
      'payment-verify-page',
      { 'payment-verify-page--book': isBookPayment },
    ]"
  >
    <article class="payment-verify-card" aria-live="polite">
      <span class="payment-verify-card__eyebrow">
        <i :class="['pi', isBookPayment ? 'pi-book' : 'pi-graduation-cap']" aria-hidden="true" />
        {{ isBookPayment ? "دفع الكتاب" : "دفع الكورس" }}
      </span>

      <div class="payment-verify-card__visual">
        <span v-if="verifying" class="payment-verify-card__loader pi pi-spin pi-spinner" aria-hidden="true" />
        <DotLottieVue
          v-else-if="paymentStatus === PaymentVerifyEnum.SUCCESS"
          autoplay
          class="payment-verify-card__animation"
          src="/lottie/payment_success.json"
        />
        <DotLottieVue
          v-else-if="paymentStatus === PaymentVerifyEnum.FAILED || errorMessage"
          autoplay
          class="payment-verify-card__animation"
          src="/lottie/Payment_Failed.json"
        />
        <span v-else class="payment-verify-card__pending pi pi-clock" aria-hidden="true" />
      </div>

      <h1>{{ resultTitle }}</h1>
      <p>{{ resultDescription }}</p>
      <small v-if="paymentContext.title" class="payment-verify-card__product">
        {{ paymentContext.title }}
        <template v-if="paymentContext.optionLabel"> — {{ paymentContext.optionLabel }}</template>
      </small>

      <div class="payment-verify-card__actions">
        <button
          v-if="!verifying && (errorMessage || paymentStatus === PaymentVerifyEnum.PENDING)"
          type="button"
          class="payment-verify-card__retry"
          @click="verifyPayment"
        >
          <span class="pi pi-refresh" aria-hidden="true" />
          إعادة التحقق
        </button>
        <button type="button" class="payment-verify-card__return" :disabled="verifying" @click="returnToProduct">
          {{ returnLabel }}
          <span class="pi pi-arrow-left" aria-hidden="true" />
        </button>
      </div>
    </article>
  </main>
</template>

<style scoped>
.payment-verify-page {
  --payment-verify-accent: var(--home-v2-blue, var(--app-accent, #28366c));
  display: grid;
  min-height: 100vh;
  padding: 110px 18px 48px;
  place-items: center;
  background:
    radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--payment-verify-accent) 13%, transparent), transparent 34%),
    var(--home-v2-paper, var(--app-bg, #f7f9fc));
  color: var(--home-v2-ink, var(--app-text, #172033));
}

.payment-verify-page--book {
  --payment-verify-accent: var(--home-v2-deep, var(--app-accent-secondary, #3a3e7e));
}

.payment-verify-card {
  display: grid;
  width: min(100%, 560px);
  padding: clamp(26px, 5vw, 44px);
  justify-items: center;
  border: 1px solid var(--home-v2-line, var(--app-line, #dde2ea));
  border-radius: 20px;
  background: var(--home-v2-surface, var(--app-surface, #fff));
  box-shadow: 0 28px 70px color-mix(in srgb, var(--payment-verify-accent) 16%, transparent);
  text-align: center;
}

.payment-verify-card__eyebrow {
  display: inline-flex;
  min-height: 34px;
  padding: 0 12px;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--payment-verify-accent) 10%, transparent);
  color: var(--payment-verify-accent);
  font-size: 12px;
  font-weight: 900;
}

.payment-verify-card__visual {
  display: grid;
  width: 150px;
  height: 150px;
  margin: 18px 0 4px;
  place-items: center;
}

.payment-verify-card__animation {
  width: 150px;
  height: 150px;
}

.payment-verify-card__loader,
.payment-verify-card__pending {
  display: grid;
  width: 82px;
  height: 82px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--payment-verify-accent) 11%, transparent);
  color: var(--payment-verify-accent);
  font-size: 34px;
}

.payment-verify-card h1 {
  margin: 0;
  color: var(--home-v2-ink, var(--app-text, #172033));
  font: 900 clamp(24px, 5vw, 32px)/1.4 var(--home-v2-heading, inherit);
}

.payment-verify-card > p {
  max-width: 430px;
  margin: 10px 0 0;
  color: var(--home-v2-muted, var(--app-muted, #6e788a));
  font-size: 14px;
  line-height: 1.8;
}

.payment-verify-card__product {
  margin-top: 14px;
  padding: 9px 12px;
  border: 1px solid var(--home-v2-line, var(--app-line, #dde2ea));
  border-radius: 9px;
  color: var(--home-v2-muted, var(--app-muted, #6e788a));
  font-weight: 800;
}

.payment-verify-card__actions {
  display: grid;
  width: 100%;
  margin-top: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.payment-verify-card__actions button {
  display: inline-flex;
  min-height: 48px;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid var(--payment-verify-accent);
  border-radius: 9px;
  font: inherit;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.payment-verify-card__return {
  grid-column: -2 / -1;
  background: var(--payment-verify-accent);
  color: #fff;
}

.payment-verify-card__retry {
  background: transparent;
  color: var(--payment-verify-accent);
}

.payment-verify-card__actions button:disabled {
  opacity: .55;
  cursor: wait;
}

@media (max-width: 520px) {
  .payment-verify-page {
    padding-top: 86px;
  }

  .payment-verify-card {
    border-radius: 14px;
  }

  .payment-verify-card__actions {
    grid-template-columns: 1fr;
  }

  .payment-verify-card__return {
    grid-column: auto;
  }
}
</style>
