<script setup lang="ts">
import StagesTitle from './StagesTitle.vue'
import { register } from 'swiper/element/bundle'
import 'swiper/css'

const containerRef = ref(null)

// Register Swiper web component
// onMounted(() => {
//   register()
// })
</script>

<template>
    <div class="stage-container">
        <div class="stages student-stages">
            <StagesTitle 
                :maintitle="`اوائل الطلبه`"  
                :title="`احجز مكانك بين المتفوقين`"
                :subtitle="`هنا نحتفل بإنجازات الطلاب المتفوقين الذين أثبتوا جدارتهم واجتهادهم  شاهد صور الأوائل ، واستلهم نجاحك القادم…`"
                />
        </div>
    </div>
    
    <div class="gallery-container">
        <ClientOnly>
            <swiper-container 
                ref="containerRef"
                class="gallery-track"
                :slides-per-view="4"
                :space-between="50"
                :loop="true"
                :autoplay="{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false
                }"
                :speed="1000"
                :free-mode="true"
                :free-mode-momentum="false"

            >
                <swiper-slide>
                    <img src="../../../public/images/person1.png" alt="student 1">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person2.png" alt="student 2">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person3.jpg" alt="student 3">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person4.jpg" alt="student 4">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person1.png" alt="student 1">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person2.png" alt="student 2">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person3.jpg" alt="student 3">
                </swiper-slide>
                <swiper-slide>
                    <img src="../../../public/images/person4.jpg" alt="student 4">
                </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">

</style>