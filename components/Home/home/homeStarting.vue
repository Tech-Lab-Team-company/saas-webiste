<script setup lang="ts">
import BackgoundCircle from '~/public/icons/BackgoundCircle.vue';
import { ref, onMounted } from 'vue';
import EducationStages from './EducationStages.vue';
import Students from './Students.vue';
import { baseUrl } from '~/constant/baseUrl';
import type { SwiperHome } from '~/types/swiperhome';
import { register } from 'swiper/element/bundle';
import { getWebDomain } from "~/constant/webDomain"; // For web components

const containerRef = ref(null);
const swiper_position = ref('next');
const _swiper = useSwiper(containerRef, {
  effect: "fade",
  loop: true,
  autoplay: {
    delay: 500,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
    reverseDirection: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "bullets",
    dynamicBullets: true,
  },
  speed: 1000,
  allowTouchMove: true,
});

// Register Swiper web components
onMounted(() => {
  register();
});

// Fetch slider data
const { data: sliders, pending, error } = await useAsyncData('sliders', async () => {
  try {
    const response = await $fetch<{
      data: SwiperHome[];
      message: string;
      status: number;
    }>(`${baseUrl}/fetch_sliders`, {
      method: 'POST',
      headers: {
        'Accept-Language': 'ar',
        'web-domain': getWebDomain(),
      },
      body: {
        type: 3,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch sliders:', err);
    return [];
  }
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

const toggleSubtitle = (slideId: number) => {
  if (expandedSlides.value.has(slideId)) {
    expandedSlides.value.delete(slideId);
  } else {
    expandedSlides.value.add(slideId);
  }
};

// Check if subtitle is expanded
const isExpanded = (slideId: number) => {
  return expandedSlides.value.has(slideId);
};

// Truncate text to specified length
const truncateText = (text: string, maxLength: number = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Check if text needs truncation
const needsTruncation = (text: string, maxLength: number = 100) => {
  return text && text.length > maxLength;
};
const expandedSlides = ref<Set<number>>(new Set());
</script>


<template>
  <div class="main-container">
    <ClientOnly>
      <div v-if="pending" class="loading">{{ $t('جاري التحميل...') }}</div>
      <div v-else-if="error" class="error">{{ $t('فشل في تحميل السلايدر.') }}</div>
      <swiper-container class="header-home-section"  :loop="true"
                ref="containerRef"
                :slides-per-view="1"
                :space-between="50"
                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false
                }"
                :speed="1000"
                :free-mode-momentum="false"
                >
        <swiper-slide v-for="slide in sliders" :key="slide.id">
          <!-- isImage(slide?.media?.img) -->
          <div v-if="slide?.style == 1" class="container">
            <div class="image-container">
              <BackgoundCircle class="background" />
              <img v-if="isImage(slide?.media?.img)" class="row-img" :src="slide?.media?.img" />
              <div v-else class="video video-image-section">
                <div class="layer"></div>
                <video autoplay muted loop>
                  <source :src="slide.media.img" type="video/mp4">
                </video>
              </div>
            </div>

            <div class="details">
              <div class="title">
                <p class="main-title">{{ slide.title }}</p>
                <div class="subtitle-container">
                  <p class="sub-title" :class="{ 'expanded': isExpanded(slide.id) }">
                    {{ isExpanded(slide.id) ? slide.subtitle : truncateText(slide.subtitle) }}
                  </p>
                  <p class=" sub-title-expanded">
                    {{ slide.subtitle }}
                  </p>
                  <button v-if="needsTruncation(slide.subtitle)" @click="toggleSubtitle(slide.id)"
                    class="show-more-btn">
                    {{ isExpanded(slide.id) ? $t('عرض أقل') : $t('عرض المزيد') }}
                  </button>
                </div>
              </div>
            </div>
          </div>



          <div v-else class="vid-container">
            <div class="video" v-if="isVideo(slide?.media?.img)">
              <div class="layer"></div>
              <video autoplay muted loop>
                <source :src="slide.media.img" type="video/mp4">
              </video>
            </div>
            <img v-else class=" video" :src="slide?.media?.img" />
            <div class="vid-details">
              <div class="vid-title">
                <p class="title">{{ slide.text }}</p>
                <p class="vid-main-title">{{ slide.title }}</p>
                <div class="subtitle-container">
                  <p class="vid-sub-title" :class="{ 'expanded': isExpanded(slide.id) }">
                    {{ isExpanded(slide.id) ? slide.subtitle : truncateText(slide.subtitle) }}
                  </p>
                  <p class=" sub-title-expanded">
                    {{ slide.subtitle }}
                  </p>
                  <button v-if="needsTruncation(slide.subtitle)" @click="toggleSubtitle(slide.id)"
                    class="show-more-btn vid-show-more">
                    {{ isExpanded(slide.id) ? $t('عرض أقل') : $t('عرض المزيد') }}
                  </button>
                </div>
              </div>
              <!-- <button class="btn btn-primary">{{ $t('ابــــدأ الآن') }}</button> -->
            </div>
          </div>



        </swiper-slide>
      </swiper-container>
    </ClientOnly>


  </div>
  <EducationStages />
  <Students />

</template>


<style scoped lang="scss">
.video-image-section {
  position: absolute;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  video {
    border-radius: 10px;
  }
}

.row-img {
  width: 60%;
  height: 50%;
}

.row-video {
  position: absolute;
  border-radius: 15px;
}

.show-more-btn {
  background: none !important;
  color: black !important;
  text-decoration: underline !important;
  width: fit-content !important;

  @media(min-width:768px) {
    display: none !important;
  }
}

.sub-title {
  @media(min-width:768px) {
    display: none !important;
  }


}

.sub-title-expanded {
  text-align: end;
  color: #565e68;
  // width: 550px;
  font-size: 20px;
  margin-top: 10px;
  line-height: 1.6;

  @media(max-width:768px) {
    display: none !important;
  }
}
</style>