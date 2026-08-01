<script setup lang="ts">
import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import MainDialog from "./base/persention/Dialogs/MainDialogs/MainDialog.vue";
import FetchPaymentMethodsParams from "./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
// import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";
import { getWebDomain } from "~/constant/webDomain";
import Error from "./error.vue";
import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";

const router = useRouter();
const route = useRoute();
const isHomeV2 = computed(() => route.path === "/home-v2");
const UserStore = useUserStore();
const {
  data: webStatus,
  pending,
  error,
} = await useAsyncData("webStatus", async () => {
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
  // console.log(error.value, "error");

  // console.log("WebStatus:", getWebDomain());

  const DefaultPrimaryColor = "#28366c";
  const DefaultSecondColor = "#3a3e7e";

  const PrimaryColor = response?.data?.primary_color || DefaultPrimaryColor;
  const SecondColor = response?.data?.secondary_color || DefaultSecondColor;
  const style = document.createElement("style");
  style.innerHTML = `:root { --primary-color: ${PrimaryColor}; --secondary-color: ${SecondColor}; }`;
  document.head.appendChild(style);
  return response.data;
});


const SettingStore = useSettingStore();
const changeFavicon = (iconPath) => {
  useHead({
    link: [{ rel: "icon", type: "image/x-icon", href: iconPath }],
  });
};
changeFavicon(`${webStatus.value?.image?.img || ''}`);

useSeoMeta({
  title: webStatus.value?.meta_title || webStatus.value?.name,
  description: webStatus.value?.meta_description || webStatus.value?.description,
  keywords: webStatus.value?.meta_keywords || undefined,
  ogTitle: webStatus.value?.meta_title || webStatus.value?.name,
  ogDescription: webStatus.value?.meta_description || webStatus.value?.description,
  ogImage: webStatus.value?.cover?.img || webStatus.value?.image?.img,
});

const PaymentStore = usePaymentStore();
const FetchPaymentMethod = async () => {
  const paymentMethod = new FetchPaymentMethodsParams(1);
  const fetchPaymentMethodController =
    FetchPaymentMethodController.getInstance();
  const state = await fetchPaymentMethodController.FetchPaymentMthod(
    paymentMethod
  );
  if (state.value.data) {
    PaymentStore.setPayment(state.value.data);
  }
};

onMounted(() => {
  // if (UserStore?.user) {

  FetchPaymentMethod();
  // }
});

const UserSettingStore = useSettingStore();
UserSettingStore.setSetting(webStatus.value!);
</script>

<template>
  <div class="coming-soon" v-if="isEduhubDomain">
    <!-- Animated background -->
    <div class="bg-circles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <!-- Main content -->
    <div class="container">
      <img
        src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/logo.png"
        alt="EduHUB Logo"
        class="logo"
      />
      <h1>Coming Soon</h1>
      <p>The Future of E-Learning is Here</p>
    </div>
    <a href="tel:+201119342223" class="whatsapp">
      <img
        src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/whatsapp.png"
        alt="whatsapp"
      />
    </a>
  </div>

  <div v-else>
    <NuxtLayout>
      <MobileNav v-if="!isHomeV2" />
      <ChatBotButton v-if="!isHomeV2" class="chat-bot-button" />
      <SpeedDialToast v-if="!isHomeV2" class="social-icons" />
      <Toast />
      <NuxtPage v-if="!error" />
      <Error v-if="error" />
      <MainDialog v-if="!pending && !isHomeV2" />
      <!-- <LoaderDialog v-if="!pending" /> -->
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.chat-bot-button {
  position: absolute;

  @media (max-width: 768px) {
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
