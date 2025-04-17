<script setup lang="ts">
import StagesTitle from './StagesTitle.vue'
import { register } from 'swiper/element/bundle'
import 'swiper/css'
import banner from '../../Global/banner.vue'
import type Terms from "~/types/terms";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';

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
      "web-domain":"abouelezz.com",
    },
    body:{
        type:4

    }

  });
//   console.log(response);

  return response.data;
});

</script>

<template>
    <div class="stage-container">
        <div class="stages student-stages">
            
            <StagesTitle 
                :maintitle="`اوائل الطلبه`"  
                :title="homefirstsection[0]?.title"
                :subtitle="homefirstsection[0]?.subtitle"
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
            <swiper-slide v-for="item in 8" >
                <img :src="homefirstsection[0]?.media[0].file" :alt="homefirstsection[0]?.media[0].alt">
            </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>


</template>

<style scoped lang="scss">


</style>