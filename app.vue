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

  // console.log("WebStatus:", getWebDomain());

  const DefaultPrimaryColor = '#061147'
  const DefaultSecondColor = 'var(--secondary-color)'

  const PrimaryColor = response?.data?.primary_color || DefaultPrimaryColor;
  const SecondColor = response?.data?.secondary_color || DefaultSecondColor;
  const style = document.createElement("style");
  style.innerHTML = `:root { --primary-color: ${PrimaryColor }; --secondary-color: ${SecondColor }; }`;
  document.head.appendChild(style);



  return response.data;
});


const  isEduhubDomain = computed(
    () => getWebDomain() === "eduhubco.com" || getWebDomain() === "www.eduhub.com"
)

console.log("isEduhubDomain:", isEduhubDomain.value);
console.log("getWebDomain", getWebDomain())


const SettingStore = useSettingStore()
const changeFavicon = (iconPath) => {
  useHead({
    link: [
      { rel: 'icon', type: 'image/x-icon', href: iconPath }
    ]
  })
}
changeFavicon(`${SettingStore?.setting?.image?.img}`)

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
      <img src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/logo.png" alt="EduHUB Logo" class="logo">
      <h1>Coming Soon</h1>
      <p>The Future of E-Learning is Here</p>
    </div>
    <a href="tel:+201119342223" class="whatsapp">
      <img src="https://strategyeducation.techlabeg.com/storage/uploads/eduhub/whatsapp.png" alt="whatsapp">
    </a>
  </div>


  <div v-else>
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

.coming-soon {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #000000, #1A1A1A);
  font-family: 'Poppins', sans-serif;
  color: #fff;
  overflow: hidden;
  position: relative;
}
/* Animated glowing circles background */
.bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}
.bg-circles span {
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 50%;
  animation: move 20s linear infinite;
  bottom: -150px;
}
.bg-circles span:nth-child(1) {
  left: 25%;
  width: 60px; height: 60px;
  animation-duration: 15s;
}
.bg-circles span:nth-child(2) {
  left: 10%;
  width: 100px; height: 100px;
  animation-duration: 20s;
}
.bg-circles span:nth-child(3) {
  left: 70%;
  width: 80px; height: 80px;
  animation-duration: 18s;
}
.bg-circles span:nth-child(4) {
  left: 50%;
  width: 120px; height: 120px;
  animation-duration: 25s;
}
@keyframes move {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-800px) rotate(360deg); opacity: 0; }
}
/* Main content */
.container {
  text-align: center;
  z-index: 1;
  position: relative;
  animation: fadeIn 2s ease-in-out;
}
.logo {
  width: 400px;
  height: auto;
  margin-bottom: 5px;
  animation: float 4s ease-in-out infinite;
}
h1 {
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  background: linear-gradient(90deg, #D4AF37, #FFFFFF, #D4AF37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 3s ease-in-out infinite alternate;
  letter-spacing: 4px;
  margin-bottom: 10px;
}
p {
  font-size: 1.2rem;
  color: #D4AF37;
  margin-top: 5px;
  opacity: 0.85;
  animation: fadeIn 3s ease-in-out;
}
.whatsapp {
  display: block;
  position: fixed;
  bottom: 15px;
  left: 15px;
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
@keyframes glow {
  from { text-shadow: 0 0 10px rgba(212,175,55,0.7); }
  to { text-shadow: 0 0 25px rgba(255,255,255,0.9); }
}
</style>
