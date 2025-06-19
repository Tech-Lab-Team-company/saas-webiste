<script setup lang="ts">
import AbouusSteps from '~/components/AboutUs/AbouusSteps.vue';
import type AboutUsInterface from '~/types/about_us_interface';
import { baseUrl, DashboradbaseUrl } from "~/constant/baseUrl";
import { SectionTypeEnum } from "~/components/Home/home/enum/section_type_enum";
import CourseCardFour from '~/components/Shared/CourseCardFour.vue';
import {getWebDomain} from "~/constant/webDomain";


const { data: aboutusstatistics } = await useAsyncData("AboutUsSections", async () => {
  const response = await $fetch<{
    data: AboutUsInterface[];
    message: string;
    status: number;
    
  }>(`${baseUrl}/fetch_website_sections`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
    },
    body: {
      type:SectionTypeEnum.AboutStatistics, 
    },
 
  });
  console.log(response.data);


  return response.data[response.data.length - 1];
});


</script>

<template>
    <div class="aboutus-container">
        <div class="aboutus">
          {{ console.log(aboutusstatistics , "aboutusstatistics") }}
            <AboutUsHeader 
            :title="aboutusstatistics?.title"
            :description="aboutusstatistics?.subtitle"
            />
            <div class="about-us-statistics">
                <AboutUsCourseStatistics
                    :sections="aboutusstatistics?.children"
                 />
            </div>
           <AboutUsOurVision/>
           <AbouusSteps />
           <CourseCardFour />
            <!-- <AboutUsOurStudents /> -->
        </div>
    </div>
</template>

<style scoped ></style>