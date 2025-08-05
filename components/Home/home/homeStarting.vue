<script setup lang="ts">
import BackgoundCircle from '~/public/icons/BackgoundCircle.vue';
import { ref, onMounted } from 'vue';
// import EducationStages from './EducationStages.vue';
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
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "bullets",
    dynamicBullets: true,
  },

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

  @media(min-width: 768px) {
    display: none !important;
  }
}

.sub-title {
  @media(min-width: 768px) {
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

  @media(max-width: 768px) {
    display: none !important;
  }
}
</style>