<script setup lang="ts">

import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import MainDialog from "./base/persention/Dialogs/MainDialogs/MainDialog.vue";
import FetchPaymentMethodsParams from "./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
// import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";
import { getWebDomain } from "~/constant/webDomain";

const UserStore = useUserStore();
const { data: webStatus, pending } = await useAsyncData("webStatus", async () => {
  const response = await $fetch<{
    data: WebStatus;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_web_status`, {
    method: "GET",
    headers: {
      "web-domain": getWebDomain(),
    },
  });

  const DefaultPrimaryColor = '#061147'
  const DefaultSecondColor = 'var(--secondary-color)'

  const PrimaryColor = response?.data?.primary_color || DefaultPrimaryColor;
  const SecondColor = response?.data?.secondary_color || DefaultSecondColor;
  const style = document.createElement("style");
  style.innerHTML = `:root { --primary-color: ${PrimaryColor }; --secondary-color: ${SecondColor }; }`;
  document.head.appendChild(style);



  return response.data;
});
const SettingStore = useSettingStore()
const changeFavicon = (iconPath) => {
  useHead({
    link: [
      { rel: 'icon', type: 'image/x-icon', href: iconPath }
    ]
  })
}
changeFavicon(`${SettingStore?.setting?.image?.img}`)

// const { data: PaymentMethod } = await useAsyncData("paymentmethod", async () => {
//   const response = await $fetch<{
//     data: {};
//     message: string;
//     status: number;
//   }>(`${baseUrl}/fetch_payment_methods`, {
//     method: "POST",
//     headers: {
//       "web-domain": getWebDomain(),
//     },
//     body:{
//       type:1
//     }
//   });
//   return response.data;
// });
const PaymentStore = usePaymentStore()
const FetchPaymentMethod = async () => {
  const paymentMethod = new FetchPaymentMethodsParams(1);
  const fetchPaymentMethodController = FetchPaymentMethodController.getInstance();
  const state = await fetchPaymentMethodController.FetchPaymentMthod(paymentMethod);
  if (state.value.data) {
    PaymentStore.setPayment(state.value.data);
  }
}

onMounted(
  () => {
    // if (UserStore?.user) {

      FetchPaymentMethod();
    // }
  }
)
onMounted(() => {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });
});


const UserSettingStore = useSettingStore();
UserSettingStore.setSetting(webStatus.value!);



</script>

<template>
  <div>
    <NuxtLayout>

      <MobileNav />
      <ChatBotButton class="chat-bot-button" />
      <SpeedDialToast class="social-icons" />
      <Toast />
      <NuxtPage />
      <MainDialog v-if="!pending" />
      <!-- <LoaderDialog  v-if="!pending"/> -->
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.chat-bot-button {
  position: absolute;

  @media (max-width:768px) {
    display: none;
  }
}

.social-icons {
  top: 94%;
  left: 4%;
  z-index: 1000;
  position: fixed;
  cursor: pointer;
}
</style>
