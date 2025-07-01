Course Card One

<script setup lang="ts">
import "@splidejs/vue-splide/css";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import AllCourseTwo from "../Course/AllCourseTwo.vue";
import type HomeSection from "~/types/home_section_interface";


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
      // arrows: true,
      // drag: true
    }
  }
})

onMounted(() => {
  console.log(swiper.instance)
})

const props = defineProps<{
  HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

const splideOptions = {
  type: "slide", // Explicitly set to slide mode
  rewind: false, // Disable rewind to prevent snapping back
  perPage: 3,
  perMove: 1,
  gap: "1rem",
  pagination: false,
  arrows: true,
  drag: true,
  dragMinThreshold: {
    mouse: 10,
    touch: 10
  },
  flickPower: 100, // Increase flick power for better mobile response
  flickMaxPages: 1, // Limit flick pages
  classes: {
    arrows: 'splide__arrows slider-arrows',
    arrow: 'splide__arrow slider-arrow',
    prev: 'splide__arrow--prev slider-prev',
    next: 'splide__arrow--next slider-next',
  },
  breakpoints: {
    1200: {
      perPage: 3,
      gap: "1rem",
    },
    992: {
      perPage: 2,
      gap: "0.8rem",
      // arrows: true,
      drag: true,
    },
    768: {
      perPage: 2,
      gap: "0.6rem",
      // arrows: true,
      drag: true,
    },
    576: {
      perPage: 1,
      gap: "0.5rem",
      // arrows: true,
      drag: true,
      padding: { left: '2.5rem', right: '2.5rem' } // Add padding for arrows
    }
  }
};

watch(
  () => props.HomeSections,
  (newValue) => {
    homesection.value = newValue;
  },
  { immediate: true }
)


</script>

<template>
  <h3 class="slider-heading">{{ homesection?.title || UserSetting.setting?.name }}</h3>
  <div v-if="homesection?.courses?.length >= 2" class="course-style-one">
    {{ console.log(homesection?.courses, 'courses') }}
    <ClientOnly>
      <swiper-container ref="containerRef">
        <swiper-slide v-for="(slide, idx) in homesection?.courses" :key="idx">
          <div class="card-container">
            <div class="course-image-container">
              <NuxtImg :src="slide?.image?.img || UserSetting.setting?.image.img" :alt="slide?.image?.alt" />
            </div>
            <div class="course-header">
              <p class="course-title">{{ slide?.title }}</p>
              <p class="course-description" v-html="slide?.description"></p>
            </div>
            <!-- <hr class="course-hr" /> -->
            <div class="course-teacher">
              <p class="teacher-name">{{ slide?.teacher?.name || UserSetting?.setting?.name }}</p>
              <img class="teacher-img" :src="slide?.teacher?.image?.img || UserSetting?.setting?.image?.img" :alt="slide?.teacher?.image?.alt || ''">
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <button class="right-arrow" @click="swiper.next()">
      <IconsArrowRight />
    </button>
    <button class="left-arrow" @click="swiper.prev()">
      <IconsArrowLeft />
    </button>
  </div>


  <div class="card-course-twoo" v-if="homesection?.courses?.length < 2">
    <div>
      <div class="cards-grid">
        <NuxtLink v-for="card in homesection?.courses" :key="card?.id" :to="`/course/${card?.id}`" class="card">
          <div class="card-inner" dir="rtl">
            <div class="image-container">

              <img :src="card?.image?.img || ''" alt="course image" class="card-image" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <h5 class="card-title">{{ card?.title }}</h5>
              </div>

              <p class="card-text" v-html="card?.description"></p>

              <div class="card-content">
                <p class="card-text1" v-if="card?.course_videos">
                  <video1 />
                  {{ card?.course_videos }}
                  {{ $t('فيديو') }}
                </p>
                <p class="card-text1" v-if="card?.course_docs">
                  <note />
                  {{ card?.course_docs }}
                  {{ $t('ملف ورقي') }}
                </p>
                <p class="card-text1" v-if="card?.course_records">
                  <microphone />
                  {{ card?.course_records }}
                  {{ $t('ملف صوتى') }}
                </p>
              </div>

              <div class="card-footer">
                <span class="card-icon">
                  <img :src="card?.teacher?.image?.img || UserSetting.setting?.image?.img"
                    :alt="card?.teacher?.image?.alt" class="teacher-image" />
                  <span class="card-name">{{ card?.teacher?.name || UserSetting.setting?.name }}</span>
                </span>
                <p class="card-number">{{ card?.course_price }} {{ card?.currency }}</p>
              </div>

              <div class="card-extra-content">
                <Arrroww />
                <p>{{ $t('ابدا الان') }}</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">






.card-course-twoo {
  width: 100%;
}

.card {
  width: 100%; // ✅ important for mobile
}

.card {
  display: flex;
  border-radius: 15px;
  background: white;

}

@media(max-width: 768px) {
  .card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

}

.card-inner {
  display: flex;
  // width: 98%;
  // height: 95%;
  // align-items: start;
  flex-direction: row;
}

@media (max-width: 768px) {
  .card-inner {
    flex-direction: column;
  }
}

.image-container {
  position: relative;
  width: 48%;
  // height: 100%;
  max-height: 210px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  border-radius: 12px;
}

@media(max-width: 768px) {
  .image-container {
    width: 100%;
    height: 200px;
  }
}

.card-image {
  width: 100%;
  // height: fit-content;
  min-height: 210px;
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.cards-heading {
  font-size: 25px;
  color: #222;
  margin-bottom: 20px;
  font-weight: 400;
  font-family: "regular", serif;
  text-align: right;
  width: 87%;
}

.cards-grid {
  display: grid;
  gap: 20px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.card {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  // height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: cover;
}

.card-body {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 95%;
  padding: 1rem 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #000;
  margin: 0;
  font-family: "bold", serif;
}

.card-number {
  background: #ffb949;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  padding: 4px 5px;
  font-weight: 500;
  font-size: 14px;
  font-family: "regular", serif;

}

.card-text {
  color: #656b78;
  font-weight: 400;
  font-size: 1rem;
  text-align: right;
  font-family: "regular", serif;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(var(--line-height) * 3em);
  line-height: var(--line-height);
  --line-height: 1.5;
  height: 75px;

  * {
    font-size: 1rem;
  }

  // margin: 10px 0;
}

@media(max-width: 768px) {
  .card-text {
    height: 70px;
  }

}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 5px 1px;
  justify-content: space-between;
}

.card-name {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: white;
  font-family: "bold";
  // margin: 0px 10px;
  color: #000;
  width: 100px;
}

.card-extra-content {
  border-top: 1px solid #dde1e6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  // padding: 2px 5px;
}

.card-extra-content p {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0%;
  text-align: right;
  color: #000000;
  font-family: "bold";
  cursor: pointer;
  margin: 0px 10px;
}

.card-extra-content svg {
  cursor: pointer;
  padding-top: 4px;
  color: #000000;
}

.card-content {
  display: flex;
  gap: 2rem;

  // margin-top: 10px;
  @media (max-width:768px) {
    flex-direction: column;
    gap: 5px;

  }
}

.card-text1 {
  color: #737e8a;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  font-family: "regular";
  display: flex;
  gap: 5px;

  @media (max-width:768px) {
    font-size: 15px;
  }
}

.card-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
