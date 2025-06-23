<script setup lang="ts">

// import homeStarting from './components/Home/home/homestarting.vue'
// import CourseCard from "~/components/Shared/CourseCard.vue";
// import CourseDetails from "~/components/CourseDetails/CourseDetails.vue";
 
// import Profile from "~/components/Profile/Profile.vue";


import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import MainDialog from "./base/persention/Dialogs/MainDialogs/MainDialog.vue";
import FetchPaymentMethodsParams from "./features/fetch_payment_methods/Core/Params/fetch_payment_methods_params";
import FetchPaymentMethodController from "./features/fetch_payment_methods/presentation/controllers/fetch_payment_method_controller";
// import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";
import {getWebDomain} from "~/constant/webDomain";

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
  return response.data;
});


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

const FetchPaymentMethod = async () => {
  const paymentMethod = new FetchPaymentMethodsParams(1);
  const fetchPaymentMethodController = FetchPaymentMethodController.getInstance();
  const state = await fetchPaymentMethodController.FetchPaymentMthod(paymentMethod);
}

onMounted(
  ()=>{
    FetchPaymentMethod();
  }
)


const UserSettingStore = useSettingStore();
UserSettingStore.setSetting(webStatus.value!);

// You can use pending state to show loading if needed

// onMounted(() => {
//   cons
// })


</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <MainDialog v-if="!pending" />
      <!--  <LoaderDialog  v-if="!pending"/> -->
    </NuxtLayout>
  </div>
</template>

<style></style>
