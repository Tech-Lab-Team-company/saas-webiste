<script setup lang="ts">



import { baseUrl } from "~/constant/baseUrl";
import type WebStatus from "./types/webStatus";
import { useSettingStore } from "./stores/setting";

const { data: webstatus } = await useAsyncData("webstatus", async () => {
  const response = await $fetch<{
    data: WebStatus;
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_web_status`, {
    method: "GET",
    headers: {
      "web-domain":"abouelezz.com",
    },

      
  });

  const UserSettingStore = useSettingStore();
  UserSettingStore.setSetting(response.data);
  console.log(response.data);

  return response.data;
});

onMounted(()=>{
  
})



</script>

<template>
  <div>
    <NuxtLayout>


 

      <!-- <Profile /> -->
      <!-- <Exam /> -->
      <!-- <CourseDetailsCourseExams /> -->


      <!-- <Exam /> -->
      <!-- <CourseDetailsCourseExams /> -->

      <!-- <CourseDetails /> -->
      <!-- <homeStarting /> -->
      <!-- <NuxtPage /> -->
      <!-- <CourseCard /> -->

      <!-- <homeStarting /> -->
      <NuxtPage />
      <!-- <MainDialog /> -->
    </NuxtLayout>
  </div>
</template>

<style></style>
