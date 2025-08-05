<script setup lang="ts">
import StagesTitle from './StagesTitle.vue'
import { register } from 'swiper/element/bundle'
import 'swiper/css'
import banner from '../../Global/banner.vue'
import type Terms from "~/types/terms";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import { SectionTypeEnum } from './enum/section_type_enum';
import {getWebDomain} from "~/constant/webDomain";

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
      "web-domain": getWebDomain(),
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
                :title="homefirstsection?.description"
                :subtitle="homefirstsection?.subtitle"
                />
        </div>
    </div>
    
    <div class="gallery-container">
        <ClientOnly >
            <swiper-container 
                :loop="true"
                ref="containerRef"
                class="gallery-track"
                :space-between="50"
                :autoplay="{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false
                }"
                :speed="7000"
                :free-mode="true"
                :free-mode-momentum="false"
                :breakpoints="{
                    320: {
                        slidesPerView: 1,
                    },
                    480: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    1280: {
                        slidesPerView: 5,
                    },
                    1536: {
                        slidesPerView: 6,
                    },
                }"

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