<script setup lang="ts">
import BottomDashedIcon from '~/public/icons/BottomDashedIcon.vue';
import SquareIcon from '~/public/icons/squareIcon.vue';
import TopDashedArrow from '~/public/icons/TopDashedArrow.vue';
import { ref, onMounted } from 'vue';
import { DashboradbaseUrl ,baseUrl } from "~/constant/baseUrl";
import type AboutUsInterface from '~/types/about_us_interface';
import { SectionTypeEnum } from "~/components/Home/home/enum/section_type_enum";
import {getWebDomain} from "~/constant/webDomain";

const stepsContainer = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.3 }
  );

  if (stepsContainer.value) {
    observer.observe(stepsContainer.value);
  }

  return () => {
    if (stepsContainer.value) {
      observer.unobserve(stepsContainer.value);
    }
  };
});



const { data: aboutusSteps } = await useAsyncData("AboutSteps", async () => {
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
      type:SectionTypeEnum.AboutSteps, 
    },
 
  });
  return response?.data[response.data.length - 1];
  
});



</script>

<template>
    <div class="aboutus-steps-container">
        <div class="aboutus-steps-header">
            <h3>{{ aboutusSteps?.title }}</h3>
            <hr class="abotus-hr">
        </div>

        <div class="aboutus-setps" ref="stepsContainer" :class="{ 'animate': isVisible }">
          
            <div class="left-stpes">
        
                <div class="aboutus-circle-steps aboutus-circle-steps-start">
                  
                    <h4>{{ aboutusSteps?.children?.[0]?.title }}</h4>
                    <p>{{ aboutusSteps?.children?.[0]?.subtitle}}</p>
                </div>
            </div>
            <div class="aboutus-arrows">
                <TopDashedArrow class="aboutus-arrow"/>
                <BottomDashedIcon class="aboutus-arrow" />
            </div>
            <div class="right-steps">
      
                <div class="aboutus-circle-steps">
                  <h4>{{ aboutusSteps?.children?.[1]?.title }}</h4>                    
                  <p>{{ aboutusSteps?.children?.[1]?.subtitle}}</p>
                </div>
      
                <div class="aboutus-circle-steps aboutus-circle-steps-test ">
                  <h4>{{ aboutusSteps?.children?.[2]?.title}}</h4>
                  <p>{{ aboutusSteps?.children?.[2]?.subtitle}}</p>

                </div>
            </div>

            <SquareIcon class="first-square" />
            <SquareIcon class="second-square" />
            <SquareIcon class="third-square" />
        </div>
    </div>
</template>

<style scoped></style>