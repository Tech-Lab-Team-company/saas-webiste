<script setup lang="ts">
import "@splidejs/vue-splide/css";
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

    }
  }
})

// onMounted(() => {
//   console.log(swiper.instance)
// })


const props = defineProps<{
  HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)

watch(
  () => props.HomeSections,
  (newValue) => {
    homesection.value = newValue;
  },
  { immediate: true }
)



const UserSetting = useSettingStore();
</script>

<template>
  <div class="course-style-two-container">

    <h3 class="slider-heading" style="margin-top: 25px;">{{ homesection?.title || UserSetting.setting?.name }}</h3>
    
    <div v-if="homesection?.courses?.length >= 2" class="course-style-one course-style-two">
      <ClientOnly>
        <swiper-container ref="containerRef">
          <swiper-slide v-for="(slide, idx) in homesection?.courses" :key="idx">
            <NuxtLink :to="`/course/${slide?.id}`">
              <div class="card-container"
                :style="{ backgroundImage: `url(${slide?.image?.img || UserSetting.setting?.image.img})`, backgroundSize: 'cover' ,backgroundPosition: 'center center' }">
                <div class="course-details">
                  <div class="course-header">
                    <div class="course-title-container">
                      <p class="course-price"><span>{{ slide?.course_price }}</span> <span>{{ slide?.currency }}</span>
                      </p>
                      <p class="course-title">{{ slide?.title }}</p>
                    </div>
                    <p class="course-description" v-html="slide?.description"></p>
                  </div>
                  <div class="course-teacher">
                    <p class="teacher-name">{{ slide?.teacher?.name || UserSetting?.setting?.name }}</p>
                    <img class="teacher-img" :src="slide?.teacher?.image?.img || UserSetting?.setting?.image?.img"
                      :alt="slide?.teacher?.image?.alt || ''">
                  </div>
                </div>
              </div>
            </NuxtLink>
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
  </div>


  <SharedSingleCourseCard v-if="homesection?.courses?.length < 2" :HomeSections="homesection" />
</template>

<style scoped lang="scss">
.card-course-twoo {
  width: 100%;
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
  width: 98%;
  height: 95%;
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
  background: var(--secondary-color);
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
  height: 80px;

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
}

.card-text1 {
  color: #737e8a;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  font-family: "regular";
  display: flex;
  gap: 5px;

}

.card-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>