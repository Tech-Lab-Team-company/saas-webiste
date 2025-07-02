<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css/skyblue"; // Using skyblue theme for better visibility
import { ref, onMounted } from 'vue';
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from '~/types/home_first_section';
import StagesTitle from '../Home/home/StagesTitle.vue'
import { getWebDomain } from "~/constant/webDomain";

const containerRef = ref(null)

const swiper = useSwiper(containerRef, {
  effect: 'creative',
  // loop: true,
  autoplay: {
    delay: 5000,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
  breakpoints: {
    1200: {
      slidesPerView: 3,
      spaceBetween: '1rem',
    },
    992: {
      slidesPerView: 2,
      spaceBetween: "1rem"
    },
    768: {
      slidesPerView: 2,
      spaceBetween: "0.8rem"
    },
    576: {
      slidesPerView: 1,
      spaceBetween: "0.5rem",
    }
  }
})

onMounted(() => {
  console.log(swiper.instance)
})

const { data: Blogs } = await useAsyncData("BlogsHome", async () => {
  const response = await $fetch<{
    data: HomeFirstSection[];
    message: string;
    status: number;
  }>(`${baseUrl}/fetch_blogs`, {
    method: "POST",
    headers: {
      "Accept-Language": "ar",
      "web-domain": getWebDomain(),
    },
  });
  return response.data;
});

// Ensure slider is properly initialized after mount
const splideRef = ref();

onMounted(() => {
  if (splideRef.value && splideRef.value.splide) {
    splideRef.value.splide.refresh();
  }
});

const UserSetting = useSettingStore();
</script>

<template>
  <div class="main-blog-container">
    <div class="Blog" dir="rtl" v-if="Blogs?.length > 0">
      <div class="slider-wrapper pt-md">
        <div class="stage-container">
          <div class="stages student-stages">
            <StagesTitle :maintitle="`المدونه`" :title="Blogs?.title" :subtitle="Blogs?.subtitle" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="blogs-main-section" v-if="Blogs?.length > 0">
    <ClientOnly>
      <swiper-container ref="containerRef" class="swiper-with-padding">
        <swiper-slide v-for="(blog, idx) in Blogs" :key="idx" class="slide-with-margin">
          <NuxtLink :to="`/blogs/${blog.slug}`" class="card">
            <img :src="blog.attachments[0].file" style="object-fit: cover;" alt="Card image" class="course-image" />
            <div class="card-body">
              <div class="card-header">
                <hr />
                <div class="flex">
                  <h5 class="card-title" v-html="blog.title"></h5>
                  <div class="card-date">
                    <p>{{ blog.date }}</p>
                  </div>
                </div>
              </div>
              <p class="card-text" v-html="blog.description"></p>
              <div class="card-footer">
                <p v-html="blog.subtitle"></p>
              </div>
            </div>
          </NuxtLink>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <button class="right-arrow" @click="swiper.next()" >
      <IconsArrowRight />
    </button>
    <button class="left-arrow" @click="swiper.prev()">
      <IconsArrowLeft />
    </button>
  </div>
</template>

<style scoped lang="scss">
// Fix for swiper container to show card shadows/borders
.swiper-with-padding {
  padding: 20px 10px 30px 10px; // Add padding to show shadows
  overflow: visible; // Allow shadows to be visible
}

.slide-with-margin {
  margin-bottom: 20px; // Add margin to prevent shadow clipping
}

.blogs-main-section {
  padding-bottom: 40px; // Add extra padding to the main section
  overflow: visible; // Ensure visibility of overflowing elements
}

.card {
  position: relative;
  transition: transform 0.3s ease-in-out;
  margin: 10px; // Add margin around cards
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100% - 20px); // Adjust height to account for margins
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  width: calc(100% - 20px); // Adjust width to account for margins
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); // Enhanced shadow on hover
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-direction: row-reverse;
}

.card-header .flex {
  width: 350px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}

.card-header hr {
  width: 10%;
  height: 3px;
  border-radius: 4px;
  background: #ff931e;
  border: none;
}

.slider-heading {
  margin-top: 25px;
  width: 227px;
  height: 25px;
  gap: 10px;
  padding-right: 10px;
  padding-left: 10px;
  background: linear-gradient(360deg,
      rgba(255, 185, 73, 0.5) -102%,
      #ffffff 48%);
  font-family: "medium";
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #ffb949;
}

.slider-heading1 {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 2px;
  line-height: 200%;
  letter-spacing: 0%;
  vertical-align: middle;
  font-family: "medium";
  font-weight: 700;
}

.card-date {
  width: 40%;
}

.card-date p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a3adbb;
  direction: ltr;
  font-weight: 400;
  font-size: 14px;
  text-transform: capitalize;
  font-family: "regular";
}

.card-date p::after {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 8px;
  background: #a3adbb;
  border-radius: 50%;
}

.slider-text {
  font-weight: 400;
  font-size: 18px;
  vertical-align: middle;
  color: #737e8a;
  font-family: "regular";
  margin-bottom: 10px;
  font-family: "regular";
}

/* splide style */
.splide-container {
  width: 86%;
  height: 100%;
  padding-bottom: 30px;
}

@media (max-width: 768px) {
  .splide-container {
    width: 90%;
  }
}

.splide-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: 700;
  width: 60%;
  font-size: 1rem;
  text-align: right;
  margin: 0;
  font-family: "bold", serif;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 1em);
  line-height: var(--line-height);
  --line-height: 1.5;
}

.card-text {
  font-weight: 700;
  font-size: 0.8rem;
  color: #000000;
  font-family: "medium", serif;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--line-height);
  --line-height: 1.5;
  text-align: right;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-direction: row-reverse;
}

.card-footer p {
  font-weight: 400;
  font-size: 14px;
  font-family: "regular";
  margin-top: 2px;
  color: #656B78;
  line-height: 170%;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
}

/* splide buttons */
.splide__arrow--prev {
  right: -30px;
}

.splide__arrow--next {
  right: -30px;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ccc;
}

// Additional responsive adjustments
@media (max-width: 768px) {
  .swiper-with-padding {
    padding: 15px 5px 25px 5px;
  }
  
  .card {
    margin: 8px;
    width: calc(100% - 16px);
  }
}
</style>