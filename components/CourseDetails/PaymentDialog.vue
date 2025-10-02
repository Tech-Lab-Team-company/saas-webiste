<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import AddMedia from "../helper/AddMedia.vue";

import MediaInterfaceParams from "~/features/CoursesFilter/Core/Params/media_interface_params";
import CoursesPaymentParams from "~/features/CoursePayment/Core/Params/courses_payment_params";
import CoursesPaymentController from "~/features/CoursePayment/presentation/controllers/courses_payment_controller";
import { PaymentTypes } from "./Enum/payment_types_enum";
import OnlinePaymentController from "~/features/OnlinePayment/presentation/controllers/online_payment_controller";
import OnlinePaymentParams from "~/features/OnlinePayment/Core/Params/online_payment_params";
import { getWebDomain } from "~/constant/webDomain";
import Loder from "../Loader/Loder.vue";

// 🔹 Props
const props = defineProps<{ status: number }>();

// 🔹 State
const visible = ref(false);
const status = ref(props.status);
const paymentMethod = ref();
const phoneNumber = ref<string>();
const receiptFile = ref<File | null>(null);
const selectedPaymentRequiresExtraInfo = ref<boolean>(false);

// 🔹 Stores
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const settingStore = useSettingStore();
const paymentStore = usePaymentStore();

// 🔹 Watchers
watch(
  () => props.status,
  (newValue) => (status.value = newValue)
);

watch(
  () => paymentMethod.value,
  (newValue) => {
    const method = paymentStore.Payment?.find((item) => item.id === newValue);
    selectedPaymentRequiresExtraInfo.value = method?.type === 1;
  }
);

// 🔹 Methods
const updateFiles = async (files: File[]) => {
  receiptFile.value = files[0];
};

const addPayment = async () => {
  const params = new CoursesPaymentParams({
    CourseId: Number(router.currentRoute.value.params.id),
    PaymentMethod: paymentMethod.value.id,
    Account: phoneNumber.value,
    Receipt: receiptFile.value,
  });

  const controller = CoursesPaymentController.getInstance();
  const state = await controller.CoursesPayment(params);

  if (state.value.message) {
    status.value = 1;
  }

  visible.value = false;
};

const Loader = ref(false);
const OnlinePayment = async () => {
  visible.value = false;
  Loader.value = true;
  const onlinePaymentParams = new OnlinePaymentParams(
    String(route.params.id),
    paymentMethod.value.id,
    null,
    `https://${getWebDomain()}/paymentverify/${paymentMethod.value.id}`,
    `https://${getWebDomain()}/paymentverify/${paymentMethod.value.id}`,
    `https://${getWebDomain()}/paymentverify/${paymentMethod.value.id}`,
    `https://${getWebDomain()}/paymentverify/${paymentMethod.value.id}`,
    `https://${getWebDomain()}/paymentverify/${paymentMethod.value.id}`
  );
  const onlinePaymentController = OnlinePaymentController.getInstance();
  const state = await onlinePaymentController.CreateOnlinePayment(
    onlinePaymentParams,
    router
  );
  if (state.value.data) {
    Loader.value = false;
    // "_self"
    window.open(state.value.data.url, "_blank");
    window.localStorage.setItem("onlinePaymentId", String(state.value.data.id));
  }
};
onMounted(() => {
  console.log(settingStore?.setting, "setting");
});
</script>

<template>
  <div class="edit-dialog-container">
    <!-- Action Buttons -->
    <div class="btns">
      <!-- <button v-if="settingStore?.setting?.join_option_status == 1">
        طلب الانضمام
      </button> -->

      <button v-if="status === 0 && userStore.user" @click="visible = true">
        شراء الكورس
      </button>

      <button
        v-else-if="status === 1 && userStore.user"
        disabled
        class="btn-disabled"
      >
        فى انتظار قبول الطلب
      </button>

      <button
        v-else-if="status === 4 && userStore.user"
        disabled
        class="btn-disabled"
      >
        تم رفض الطلب
      </button>

      <button v-else-if="!userStore.user" disabled class="btn-disabled">
        يجب تسجيل الدخول
      </button>
    </div>

    <!-- Payment Dialog -->
    <Dialog
      v-model:visible="visible"
      :dismissable-mask="true"
      class="dialog"
      modal
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="payment-method-container">
        <div
          v-for="method in paymentStore.Payment"
          :key="method.id"
          class="payment-method"
        >
          <label class="payment-title" :for="`${method.id}`">
            {{ method.title }}
          </label>
          <input
            :id="`${method.id}`"
            type="radio"
            v-model="paymentMethod"
            :value="method"
            name="payment"
          />
        </div>
      </div>

      <!-- Extra inputs if method requires info -->
      <input
        v-if="
          selectedPaymentRequiresExtraInfo &&
          paymentMethod?.type == PaymentTypes.OFFLINE
        "
        type="tel"
        placeholder="ادخل رقم الهاتف"
        class="input-data"
        v-model="phoneNumber"
      />

      <AddMedia
        v-if="
          selectedPaymentRequiresExtraInfo &&
          paymentMethod?.type == PaymentTypes.OFFLINE
        "
        class="add-media"
        :index="0"
        @update:images="updateFiles"
      />

      <button
        v-if="
          selectedPaymentRequiresExtraInfo &&
          paymentMethod?.type == PaymentTypes.OFFLINE
        "
        @click="addPayment"
        class="btn-buy"
      >
        شراء
      </button>

      <button
        class="btn-buy"
        v-if="paymentMethod?.type == PaymentTypes.ONLINE"
        @click="OnlinePayment"
      >
        شراء
      </button>

      <button
        class="btn-buy"
        v-if="paymentMethod?.type == PaymentTypes.OFFLINE"
      >
        شراء
      </button>
    </Dialog>

    <div class="page-loader" v-if="Loader">
      <Loder />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-loader {
  height: 100vh;
  width: 100%;
  position: fixed;
  background-color: #000000c9;
  top: 0;
  left: 0;
  z-index: 99;
}
.payment-method-container {
  display: flex;
  justify-content: flex-end;
  gap: 35px;

  .payment-method {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .payment-title {
      cursor: pointer;
    }
  }
}

.input-data {
  border: 1px solid #8080802e;
  border-radius: 10px;
  padding: 10px;
  margin-block: 10px;
  text-align: right;

  &:focus {
    outline: none;
  }
}

.dialog {
  .add-media {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 100%;
    height: 100%;
  }

  .btn-buy {
    width: 100%;
    margin: 10px auto 0;
    border-radius: 10px;
    padding: 12px;
    font-size: 20px;
    font-weight: 600;
    color: white;
    background-color: var(--secondary-color);
  }
}

.edit-dialog-container {
  .btns {
    button {
      &.btn-disabled {
        background-color: gainsboro;
      }
    }
  }
}
</style>
