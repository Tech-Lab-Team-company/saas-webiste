<script setup lang="ts">
import { PaymentVerifyEnum } from "~/features/VerifyPayment/Core/Enum/payment_verify_enum";
import VerifyPaymentParams from "~/features/VerifyPayment/Core/Params/verify_payment_params";
import VerifyPaymentController from "~/features/VerifyPayment/presentation/controllers/verify_payment_controller";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const route = useRoute();
const router = useRouter();
const Id = route.params.id;
const PayemtnId = window.localStorage.getItem("onlinePaymentId");
const PaymentStatus = ref(0);
const VerifyPayment = async () => {
  const verifyPaymentParams = new VerifyPaymentParams(Id, PayemtnId);
  const verifyPaymentController = VerifyPaymentController.getInstance();
  const state = await verifyPaymentController.CreateVerifyPayment(
    verifyPaymentParams,
    router
  );
  if (state.value.data) {
    PaymentStatus.value = state.value.data.status;
  }
};

onMounted(() => {
  VerifyPayment();
});

</script>
<template>
  <div class="payment-verify-container">
    <div v-if="PaymentStatus == PaymentVerifyEnum.SUCCESS">
      <DotLottieVue
        autoplay
        loop
        class="image"
        src="/lottie/payment_success.json"
      />
    </div>
    <div v-if="PaymentStatus == PaymentVerifyEnum.FAILED">
      <DotLottieVue
        autoplay
        loop
        class="image"
        src="/lottie/Payment_Failed.json"
      />
    </div>
  </div>
</template>
