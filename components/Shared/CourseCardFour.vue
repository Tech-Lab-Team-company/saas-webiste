<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import img2 from "@/assets/images/img2.png";
import img3 from "@/assets/images/img3.png";
import img4 from "@/assets/images/img4.png";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import {getWebDomain} from "~/constant/webDomain";

const { data: studentopinionssection } = await useAsyncData("studentopinionssection", async () => {
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
    body: {
      type: SectionTypeEnum.StudentOpinions,
    },
  });

  return response.data[response.data.length - 1];
});


const cards = [
  {
    img: img4,
  },
  {
    img: img2,
  },
  {
    img: img3,
  },
  {
    img: img4,
  },
  {
    img: img4,
  },
];

const splideOptions = {
  perPage: 5,
  perMove: 1,
  gap: "10px",
  pagination: false,
  arrows: false,
  breakpoints: {
    1200: {
      perPage: 4,
    },
    900: {
      perPage: 3,
    },
    600: {
      perPage: 2,
    },
    480: {
      perPage: 1,
    },
  },
  autoplay: true,
  interval: 3000,
  pauseOnHover: false,
  pauseOnFocus: false,
  resetProgress: false,
  speed: 1000,
  drag: true,
  cloneStatus: true,
  drag: false,
};
</script>
<template>
  <div class="card-course-four">
    <div class="slider-wrapper flex" dir="ltr">
     
      <h1 class="slider-heading">{{ studentopinionssection?.title }}</h1>
      <p class="slider-paragraph">
        {{ studentopinionssection?.description }}
      </p>

      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(card, index) in studentopinionssection?.media" :key="index">
          <img :src="card.file" :alt="card.alt" class="slider-image" />
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>
<style>


.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slider-heading {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 5px;
  font-weight: 800;
  vertical-align: middle;
  font-family: "bold";
}

.slider-paragraph {
  font-weight: 400;
  font-size: 20px;
  vertical-align: middle;
  color: #737e8a;
  font-family: "regular";
  margin-bottom: 10px;
  text-align: center;
}

.splide-container {
  width: 86%;
  height: 100%;
  padding-bottom: 30px;
}

.splide-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-image {
  width: 300px;
  height: 212px;
}

/* splide buttons */
.splide__arrow--prev {
  left: -60px;
}

.splide__arrow--next {
  right: -20px;
}
</style>
