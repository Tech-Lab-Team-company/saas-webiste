<script setup lang="ts">
import person1 from "@/public/images/person1.png";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import QuoteIcone from "~/public/icons/quoteIcone.vue";
import { baseUrl,DashboradbaseUrl } from "~/constant/baseUrl";
import type { StudentsOpinionInterface } from "~/types/student_opinions";

import type AboutUsInterface from '~/types/about_us_interface';
import { SectionTypeEnum } from "~/components/Home/home/enum/section_type_enum";


const { data: aboutusOpinions } = await useAsyncData("AboutOpinions", async () => {
  const response = await $fetch<{
    data: AboutUsInterface[];
    message: string;
    status: number;
  }>(`${DashboradbaseUrl}/fetch_website_sections`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"abouelezz.com",
    },
    body: {
      type:SectionTypeEnum.Opinions, 
    },
 
  });
  console.log(response.data);


  return response?.data[0];
});

const splideOptions = {
  type: "loop", 
  perPage: 3, 
  perMove: 1, 
  gap: "20px",
  pagination: false,
  arrows: true,
  drag: false, 
};

</script>

<template>
    <div class="aboutus-student-container">
      <div class="aboutus-steps-container">
            <div class="aboutus-steps-header">
                <h3>{{ aboutusOpinions?.title }}</h3>
                <hr class="abotus-hr">
            </div>
        </div>
        <div class="card-course-three">
            <div class="slider-wrapper" >
            <Splide :options="splideOptions" class="splide-container">
                <SplideSlide v-for="(opinion, index) in aboutusOpinions?.children" :key="index" >
                    <QuoteIcone class="quote-icon" />
                <div class="card">
                    <div class="card-head">
                        <div class="card-head-info">
                            <p>{{ opinion.title }}</p>
                            <p>{{ opinion.subtitle }}</p>
                        </div>
                        <img :src="opinion.icon" alt="person">
                    </div>
                    <div class="card-body" dir="rtl">
                        <p>{{ opinion.description }}</p>
                    </div>
                </div>
                </SplideSlide>
            </Splide>
            </div>
        </div>
    </div>
     
</template>

<style scoped>
.card {
    height: auto;
}
</style>