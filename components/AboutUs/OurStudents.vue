<script setup lang="ts">
import person1 from "@/public/images/person1.png";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import QuoteIcone from "~/public/icons/quoteIcone.vue";
import { baseUrl } from "~/constant/baseUrl";
import type { StudentsOpinionInterface } from "~/types/student_opinions";

const { data: StudentOpinons } = await useAsyncData("StudentOpinons", async () => {
  const response = await $fetch<{
    data: StudentsOpinionInterface[];
    message: string;
    status: number;
  }>(`${baseUrl}/data`, {
    method: "GET",
    headers: {
      "Accept-Language": "ar",
      "web-domain":"abouelezz.com",
    },
 
  });
  return response.data;
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



// const cards = [
//   {
//     id: 1,
//     name: "احمد حوام السيد",
//     img: person1,
//     stage: "طالب جامعى",
//     Openion: "منصه رائعه ومفيدة جدا وبتساعدنا علي التدريب من خلال تجرلتنا لامتحانات فعليه",
//   },

// ];






</script>

<template>
    <div class="aboutus-student-container">
      <div class="aboutus-steps-container">
            <div class="aboutus-steps-header">
                <h3>اراء الطلبه في منصتنا</h3>
                <hr class="abotus-hr">
            </div>
        </div>
        <div class="card-course-three">
            <div class="slider-wrapper" >
            <Splide :options="splideOptions" class="splide-container">
                <SplideSlide v-for="(opinion, index) in StudentOpinons" :key="index" >
                    <QuoteIcone class="quote-icon" />
                <div class="card">
                    <div class="card-head">
                        <div class="card-head-info">
                            <p>{{ opinion.name }}</p>
                            <p>{{ opinion.type }}</p>
                        </div>
                        <img :src="opinion.img" alt="person">
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