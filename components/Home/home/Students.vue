<script setup lang="ts">
import StagesTitle from './StagesTitle.vue'
import { register } from 'swiper/element/bundle'
import 'swiper/css'
import banner from '../../Global/banner.vue'
import type Terms from "~/types/terms";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import { SectionTypeEnum } from './enum/section_type_enum';

const containerRef = ref(null)


const { data: homefirstsection } = await useAsyncData("homefirstsection", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[]; 
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_home_website_section`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"hrarabians.org",
    },
    body:{
        type:SectionTypeEnum.Media

    }

  });
  return response.data[response.data.length - 1];
});

</script>

<template>
    <div class="stage-container">
        <div class="stages student-stages">
            
            <StagesTitle 
                :maintitle="homefirstsection?.title"  
                :title="homefirstsection?.subtitle"
                :subtitle="homefirstsection?.description"
                />
        </div>
    </div>
    
    <div class="gallery-container  ">
        <ClientOnly >
            <swiper-container 
                ref="containerRef"
                class="gallery-track"
                :slides-per-view="4"
                :space-between="50"
                :loop="true"
                :autoplay="{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false
                }"
                :speed="1000"
                :free-mode="true"
                :free-mode-momentum="false"

            >
            <swiper-slide v-for="image in homefirstsection?.media" >
                <img :src="image.file" :alt="image.alt">
            </swiper-slide>
            <swiper-slide v-for="image in homefirstsection?.media" >
                <img :src="image.file" :alt="image.alt">
            </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>


</template>

<style scoped lang="scss">


</style>