<script setup lang="ts">
import AbouusSteps from '~/components/AboutUs/AbouusSteps.vue';
import { baseUrl } from "~/constant/baseUrl";
import type AboutUsInterface from '~/types/about_us_interface';

const { data: AboutUsSections } = await useAsyncData("AboutUsSections", async () => {
  const response = await $fetch<{
    data: AboutUsInterface;
    message: string;
    status: number;
  }>(`${baseUrl}/data`, {
    method: "GET",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"abouelezz.com",
    },
 
  });
  console.log(response);

  return response.data;
});


</script>

<template>
    <div class="aboutus-container">
        <div class="aboutus">
            <AboutUsHeader />
            <div class="about-us-statistics">
                <AboutUsCourseStatistics
                    :AboutusStatistics="AboutUsSections?.statistics"  
                 />
            </div>
            <AboutUsOurVision
                :AboutusVision="AboutUsSections?.vision"        
            />
            <AbouusSteps 
                :AboutusSteps="AboutUsSections?.stages" 
            />
            <AboutUsOurStudents />
        </div>
    </div>
</template>

<style scoped ></style>