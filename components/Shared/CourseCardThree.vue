<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import microphone from "@/public/icons/microphone.vue";
import note from "@/public/icons/note.vue";
import video1 from "~/public/icons/video1.vue";
import { baseUrl } from "~/constant/baseUrl";
import type HomeFirstSection from "~/types/home_first_section";
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import AllCourseTwo from "../Course/AllCourseTwo.vue";
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import SplideCore from "@splidejs/splide";

const props = defineProps<{
  HomeSections: {};
}>();

const homesection = ref(props.HomeSections);
const { locale } = useI18n();

watch(
  () => props.HomeSections,
  (newValue) => {
    homesection.value = newValue;
  },
  { immediate: true }
);

const splideOptions = {
  type: "slide",
  rewind: false,
  perPage: 3,
  perMove: 1,
  gap: "1rem",
  pagination: false,
  arrows: true,
  drag: true,
  dragMinThreshold: {
    mouse: 10,
    touch: 10,
  },
  flickPower: 100,
  flickMaxPages: 1,
  observeResize: true,
  classes: {
    arrows: 'splide__arrows slider-arrows',
    arrow: 'splide__arrow slider-arrow',
    prev: 'splide__arrow--prev slider-prev',
    next: 'splide__arrow--next slider-next',
  },
  breakpoints: {
    1200: { perPage: 3, gap: "1rem" },
    992: { perPage: 2, gap: "0.8rem" },
    768: { perPage: 2, gap: "0.6rem" },
    576: {
      perPage: 1,
      gap: "0.5rem",
      padding: { left: "2.5rem", right: "2.5rem" },
    },
    400: {
      perPage: 1,
      gap: "0.4rem",
      padding: { left: "2rem", right: "2rem" },
    },
  },
};

let splideInstance: SplideCore | null = null;

const refreshSlider = () => {
  splideInstance?.refresh?.();
};

onMounted(async () => {
  await nextTick();
  const el = document.querySelector(".splide-container") as HTMLElement;
  if (el) {
    splideInstance = new SplideCore(el, splideOptions);
    splideInstance.mount();
  }
  window.addEventListener("resize", refreshSlider);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", refreshSlider);
  splideInstance?.destroy?.();
});
const UserSetting = useSettingStore();
</script>

<template>
  <div class="card-course-three courses-card">
    <div class="slider-wrapper">
      <h3 class="slider-heading">{{ homesection?.title }}</h3>
      <Splide :options="splideOptions" class="splide-container" v-if="homesection?.courses?.length >= 2">
        <SplideSlide v-for="(course, index) in homesection?.courses" :key="index">
          <NuxtLink :to="`/course/${course.id}`" class="card">
            <div class="image-container">
              <img :src="course.image.img" :alt="course.image.alt" class="course-image" />
              <p class="overlay-text" v-if="course.course_price > 0">{{ course.course_price }} {{ course?.currency }}</p>
              <p class="overlay-text" v-else>{{ $t('مجانى') }}</p>
            </div>

            <div class="card-body" dir="rtl">
              <h5 class="card-title">{{ course.title }}</h5>
              <div class="card-content">
                <p class="card-text1" v-if="course.course_videos">
                  <video1 />
                  {{ course.course_videos }} فيديو
                </p>
                <p class="card-text1" v-if="course.course_docs">
                  <note />
                  {{ course.course_docs }} ملف ورقي
                </p>
                <p class="card-text1" v-if="course.course_records">
                  <microphone />
                  {{ course.course_records }} ملف صوتى
                </p>
              </div>
              <div class="card-footer">
                <div class="card-text" v-html="course?.description"></div>
              </div>
            </div>
          </NuxtLink>
        </SplideSlide>
      </Splide>
    </div>
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
  margin-top: 20px;
}

.slider-heading {
  font-size: 35px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
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
  // justify-content: space-between;
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
.image-container img {
height: 100%;
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
  @media(max-width:768px){
    gap: 5px;
  }
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
    margin-bottom: 15px;
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
    font-size: 24px;
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
    margin-bottom: 10px;
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


.card-footer {
  .card-icon {
    .teacher-image {
      max-width: 50px;
    }
  }

}

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
  max-height: 290px;
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
  // justify-content: flex-end;
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

  * {
    font-size: 1rem;
  }

  // margin: 10px 0;
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