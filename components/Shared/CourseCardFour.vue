<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import { getWebDomain } from "~/constant/webDomain";

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

const isImage = (url) => {
  if (!url) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = url.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
};

// Check if URL is a video
const isVideo = (url) => {
  if (!url) return false;
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
  const extension = url.split('.').pop().toLowerCase();
  return videoExtensions.includes(extension);
};


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
      focus: 'center', // Center the single slide
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

      <h1 class="slider-heading" style="margin-top: 25px;">{{ studentopinionssection?.title }}</h1>
      <p class="slider-paragraph">
        {{ studentopinionssection?.description }}
      </p>

      <Splide :options="splideOptions" class="splide-container">
        <SplideSlide v-for="(card, index) in studentopinionssection?.media" :key="index">

          <a :href="card?.link || '#'" target="_blank">
            <img :src="card.file" :alt="card.alt" class="slider-image" />
          </a>
          <!-- <video autoplay loop muted  v-if="isVideo(card.file)" class="slider-image">
            <source :src="card.file">
          </video> -->
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
  margin-top: 20px;
}

.slider-heading {
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.description-text {
  text-align: center;
}

.dots-icons-one {
  position: absolute;
  top: 88%;
  transform: translateY(-80%);
  left: -4%;
  z-index: -1;
}

.dots-icons-two {
  position: absolute;
  top: 44%;
  transform: translateY(-80%);
  right: 0;
  z-index: -1;
}

@media(max-width:768px) {
  .dots-icons-two {
    right: 0%;
  }
}

.swiper-container-wrapper {
  position: relative;
  width: 90%;
  /* //max-width: 1200px; */
  margin: 0 auto;
  margin-top: 20px;
}

swiper-container {
  width: 100%;
}

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  font-weight: bold;
  width: 380px;
  margin-right: 30px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 12px;
}

.slide-content {
  text-align: center;
  height: 100%;
  border-radius: 15px;
}

.slide-content a {
  //height: 100%;
  border-radius: 15px;
}

.slide-content a .image-conatiner {
  //height: 100%;
  border-radius: 15px;
  //border: 10px solid rgba(128, 128, 128, 0.404);
}

.slide-content a .image-conatiner img {
  object-fit: cover;
  //aspect-ratio: 16/9;
  border-radius: 15px;
  width: 100%;
  //height: 100%;
}

.slide-content h3 {
  margin-bottom: 10px;
  font-size: 24px;
}

.slide-content p {
  font-size: 16px;
  opacity: 0.8;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.control-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-buttons button:hover {
  background-color: #0056b3;
}

/* Custom navigation buttons styling */
.swiper-button-next,
.swiper-button-prev {
  color: #9D9D9D;
  font-size: 30px;
  font-weight: 900;
  margin-top: 20px;
}

@media(max-width:768px) {

  .swiper-button-next,
  .swiper-button-prev {
    display: none;
  }
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 20px;
  font-weight: bold;
}

/* Custom pagination styling */
.swiper-pagination {
  bottom: 10px;
}

:deep(.swiper-pagination-bullet) {
  background-color: #007bff;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background-color: #007bff;
}

.swiper-button-next {
  right: var(--swiper-navigation-sides-offset, 5px) !important;
}

.swiper-button-prev {
  right: var(--swiper-navigation-sides-offset, 5px) !important;
}

@media (max-width:768px) {
  .swiper-button-next {
    right: var(--swiper-navigation-sides-offset, 5px) !important;
  }
}

@media (max-width:768px) {
  .swiper-button-prev {
    right: var(--swiper-navigation-sides-offset, -5px) !important;
  }
}
</style>