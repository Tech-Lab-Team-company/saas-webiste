<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
// import microphone from "@/public/icons/microphone.vue";
// import note from "@/public/icons/note.vue";
// import video1 from "~/public/icons/video1.vue";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import SquareIcon from "~/public/icons/squareIcon.vue";
import { getWebDomain } from "~/constant/webDomain";


const { data: GraduationParty } = await useAsyncData("GraduationParty", async () => {
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
      type: SectionTypeEnum.GraduationParty,
    },
  });

  
  return response.data;
});


const containerRefs = ref([]) // Array of refs for each swiper
const swipers = ref([])       // Array to store swiper instances

const getSwiperOptions = () => ({
  effect: 'creative',
  perPage: 3, // Show 3 slides at a time
  gap: '2rem',
  loop: true,
  autoplay: { delay: 5000 },
  creativeEffect: {
    prev: { shadow: true, translate: [0, 0, -400] },
    next: { shadow: true, translate: [0, 0, -400] },
  },
  breakpoints: {
    1200: { slidesPerView: 3, spaceBetween: 32 ,perPage: 3, gap: '2rem' },
    992: { slidesPerView: 2, spaceBetween: 16, perPage: 2, gap: '1rem' },
    768: { slidesPerView: 2, spaceBetween: 8 ,perPage: 2, gap: '0.8rem' },
    576: { slidesPerView: 1, spaceBetween: 4 }
  }
});

onMounted(() => {
  GraduationParty.value?.forEach((_, idx) => {
    if (containerRefs.value[idx]) {
      swipers.value[idx] = useSwiper(containerRefs.value[idx], getSwiperOptions())
    }
  })
})

// Methods to control each swiper
const nextSlide = (idx) => {
  swipers.value[idx]?.next()
}
const prevSlide = (idx) => {
  swipers.value[idx]?.prev()
}
</script>

<template>
  <div class="card-course-three" v-for="(section , idnex) in  GraduationParty" :key="idnex">
    <h3 class="slider-heading">{{ section?.title }}</h3>
    <p class="description-text">{{ section?.description }}</p>

    <div class="graduation-party-container">
      

      <Splide :options="getSwiperOptions()">
        <SplideSlide v-for="(image, idx) in section?.media" :key="idx">
          <a target="_blank" :href="image?.link || '#'">
            <div class="image-conatiner">
              <img :src="image?.file" :alt="image.alt" />
            </div>
          </a>
        </SplideSlide>
      </Splide>

    </div>

    
    <SquareIcon class="dots-icons-one" />
    <SquareIcon class="dots-icons-two" />
  </div>
</template>

<style scoped lang="scss">

  .right-arrow {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;

    svg {
      width: 35px;
      height: 35px;
    }
  }

  .left-arrow {
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;

    svg {
      width: 35px;
      height: 35px;
    }
  }
.image-conatiner{

  img{
    border-radius: 20px;
    aspect-ratio: 2/ 1.5 ;
    border: 1px solid #dde1e6;
    width: 100%;
  }

}

.graduation-party-container{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}
.dots-icons-one {
  position: absolute;
  top: 100%;
  transform: translateY(-80%);
  left: 4%;
  z-index: -1;
}

.dots-icons-two {
  position: absolute;
  top: 50%;
  transform: translateY(-80%);
  right: 4%;
  z-index: -1;
}

.description-text {
  margin: 0;
  padding-bottom: 10px;
  color: #909DAD;
  text-align: center;
}

.card-course-three {
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.slider-heading {
  font-size: 35px;
  color: #222;
  text-align: center;
  /* margin-bottom: 20px; */
  font-weight: 800;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "bold";
}

.splide-container {
  width: 88%;
  height: 100%;
  padding: 0 3rem 30px;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  margin: 0 auto;
  background-color: #F1F1F1;
}

.card:hover {
  transform: translateY(-10px);
}

.image-container {
  position: relative;
  width: 100%;
  padding: 6px;
}

.course-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  background-color: white;
  border-radius: 10px;
}

.overlay-text {
  position: absolute;
  top: 15%;
  left: 20%;
  transform: translate(-50%, -50%);
  padding: 6px 15px;
  border-radius: 8px;
  background: #ffffff;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  color: #032855;
  font-weight: 800;
  font-size: 14px;
  font-family: "regular";
}

.card-body {
  padding: 20px;
  /* background-color: gray;
    border-radius: 10px; */
}

.card-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: right;
  margin: 0;
  font-family: "bold";
}

.card-content {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  flex-wrap: wrap;
  gap: 10px;
}

.card-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: #656b78;
  font-family: "regular";
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-text1 {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  display: flex;
  gap: 5px;
  align-items: center;
  font-family: "regular";
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Splide arrows customization */
:deep(.splide__arrow) {
  background: #032855;
  opacity: 1;
  width: 3rem;
  height: 3rem;
}

:deep(.splide__arrow svg) {
  fill: white;
  width: 1.5rem;
  height: 1.5rem;
}

:deep(.splide__arrow--prev) {
  left: 0;
}

:deep(.splide__arrow--next) {
  right: 0;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .slider-heading {
    font-size: 32px;
  }

  .course-image {
    height: 200px;
  }
}

@media (max-width: 992px) {
  .slider-heading {
    font-size: 28px;
    /* margin-bottom: 15px; */
  }

  .card-title {
    font-size: 18px;
    line-height: 26px;
  }

  .card-text,
  .card-text1 {
    font-size: 15px;
  }

  :deep(.splide__arrow) {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 768px) {
  .slider-heading {
    /* font-size: 24px; */
  }

  .splide-container {
    padding: 0 2.5rem 25px;
  }

  .card-body {
    padding: 15px;
  }

  .course-image {
    height: 180px;
  }

  .overlay-text {
    font-size: 13px;
    width: 90px;
    padding: 5px 10px;
  }

  :deep(.splide__arrow) {
    width: 2.2rem;
    height: 2.2rem;
  }
}

@media (max-width: 576px) {
  .slider-heading {
    font-size: 20px;
    /* margin-bottom: 10px; */
  }

  .splide-container {
    padding: 0 2rem 20px;
  }

  .card-title {
    font-size: 16px;
    line-height: 24px;
  }

  .card-text,
  .card-text1 {
    font-size: 14px;
  }

  .course-image {
    height: 160px;
  }

  .overlay-text {
    font-size: 12px;
    width: 80px;
    padding: 4px 8px;
  }

  .card-content {
    flex-direction: column;
    gap: 8px;
    margin: 10px 0;
  }

  :deep(.splide__arrow) {
    width: 2rem;
    height: 2rem;
  }

  :deep(.splide__arrow svg) {
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>