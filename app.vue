<script setup lang="ts">

// import homeStarting from './components/Home/home/homestarting.vue'
// import CourseCard from "~/components/Shared/CourseCard.vue";
// import CourseDetails from "~/components/CourseDetails/CourseDetails.vue";
 
// import Profile from "~/components/Profile/Profile.vue";


import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";
import MainDialog from "./base/persention/Dialogs/MainDialogs/MainDialog.vue";
import LoaderDialog from "./base/persention/Dialogs/LoaderDialogs/LoaderDialog.vue";

const { data: webstatus } = await useAsyncData("webstatus", async () => {
  const response = await $fetch<{
    data: WebStatus;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_web_status`, {
    method: "GET",
    headers: {
      "web-domain":"hrarabians.com",
    },

    });

  const UserSettingStore = useSettingStore();
  UserSettingStore.setSetting(response.data);
  return response.data;
});

// onMounted(() => {
//   cons
// })


</script>

<template>
  <div>
    <NuxtLayout>
    
      <NuxtPage />
      <MainDialog />
      <LoaderDialog />
    </NuxtLayout>
  </div>
</template>

<style></style>
