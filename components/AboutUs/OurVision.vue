<script setup lang="ts">
import Arrow from '@/public/icons/arrow.vue';
import BgCircieIcon from '~/public/icons/BgCircieIcon.vue';
import {DashboradbaseUrl ,baseUrl} from "~/constant/baseUrl";
import type AboutUsInterface from '~/types/about_us_interface';
import { SectionTypeEnum } from "~/components/Home/home/enum/section_type_enum";
import {getWebDomain} from "~/constant/webDomain";


const { data: aboutusVision } = await useAsyncData("AboutUsVision", async () => {
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
      type:SectionTypeEnum.AboutVision, 
    },
 
  });
  // console.log(response.data[response.data.length - 1] , "resesesese");
  return response?.data[response.data.length - 1];
});

const userSetting = useSettingStore();

</script>



<template>
  <div class="aboutus-vision-conatiner">
      <div class="aboutus-vid-container">
        <div class="aboutus-vid" v-if="aboutusVision?.media?.[0]?.file">
           <video
                width="100%"
                height="100%"
                :src="aboutusVision?.media?.[0]?.file"
                frameborder="0"
                allowfullscreen
                loop
                autoplay
       
              ></video>
        </div>
        <div class="aboutus-vid" v-else>
          <img :src="userSetting.setting?.image?.img" alt="">
        </div>
        <BgCircieIcon class="right-circle" />
        <BgCircieIcon class="left-circle"/>
      </div>

      <div class="aboutus-text-container">

        <div class="aboutus-text" v-for="(vision, index) in aboutusVision?.children" :key="index">
          <div class="aboutus-text-header">
            <h3>{{ vision.title }}</h3>
              <Arrow />
          </div>
          <p class="secondary-text">  {{  vision?.subtitle }}</p>
        </div> 
        

      </div>
  </div>
</template>

<style scoped></style>
