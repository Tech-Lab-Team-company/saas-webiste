<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type HomeSection from '~/types/home_section_interface';
import { NuxtImg } from '#components';

const props = defineProps<{
    HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

const containerRef = ref(null)
const slides = ref(Array.from({ length: 10 }))

const swiper = useSwiper(containerRef, {
    modules: [Autoplay, Pagination, Navigation, EffectFade],
    slidesPerView: 1, // Default for mobile
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 15,
            navigation: {
                nextEl: null,
                prevEl: null,
            }
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
            navigation: {
                nextEl: null,
                prevEl: null,
            }
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 25,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 30,
        }
    }
})

const userSetting = useSettingStore();

</script>

<template>
    <div class="swiper-wrapper-container" v-if="homesection?.courses.length > 1">
        <h2 class="section-one-title">{{ homesection?.title || userSetting?.setting?.name }}</h2>
        <ClientOnly>
            <swiper-container ref="containerRef" dir="rtl">
                <swiper-slide v-for="(slide, idx) in homesection?.courses" :key="idx" class="custom-slide">
                    <div class="section-one-conatiner">
                        <NuxtLink :to="`/course/${slide?.id}`">
                            <div class="section-one-image">
                                <NuxtImg width="100%" height="300"
                                    :src="slide?.image?.img || UserSetting.setting?.image.img"
                                    :alt="slide?.image?.alt" />
                            </div>
                            <div class="section-one-info">
                                <p class="title-text">{{ slide?.title }}</p>
                                <p v-html="slide?.description" class="description-text"></p>
                            </div>
                            <hr class="section-one-hr">
                            <div class="teacher-info">
                                <img :src="slide?.teacher?.image?.img || UserSetting?.setting?.image?.img"
                                    :alt="slide?.teacher?.image?.alt">
                                <p>{{ slide?.teacher?.name || UserSetting?.setting?.name }}</p>
                            </div>
                        </NuxtLink>
                    </div>
                </swiper-slide>
            </swiper-container>

            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>

        </ClientOnly>
    </div>
    <div class="single-card" v-if="homesection?.courses?.length < 2">
        <h2 class="section-one-title">{{ homesection?.title || userSetting?.setting?.name }}</h2>
        <SharedSingleCourseCard :HomeSections="homesection" />
    </div>
</template>

<style scoped lang="scss">
.swiper-wrapper-container {
    position: relative;
    width: 100%;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 10px;

    .section-one-title {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 8px 8px 6px #000000b3;
        font-size: 40px;
        margin-block: 20px;


        // Responsive title sizing
        @media (max-width: 768px) {
            font-size: 1.25rem;
            margin-top: 15px;
        }
    }

    .section-one-conatiner {
        width: 100%;
        margin-top: 20px;
        display: flex;
        border-radius: 15px;
        padding: 5px;
        background-color: white;
        margin-bottom: 20px;

        swiper-container {
            width: 100%;
        }

        a {
            border-radius: 20px;
            padding: 10px;
            box-shadow: 5px 1px 10px -1px rgba(0, 0, 0, 0.231372549);
            transition: all 0.2s linear;
            transform: scale(1);
            display: block;
            width: 100%;

            &:hover {
                box-shadow: 5px 1px 10px -1px rgba(0, 0, 0, 0.562);
                animation: movement 1s infinite;
            }

            @keyframes movement {
                0% {
                    transform: translateY(0);
                }

                50% {
                    transform: translateY(10px);
                }

                100% {
                    transform: translateY(0);
                }
            }

            .section-one-image {
                object-fit: cover;

                img {
                    height: 200px !important;
                    object-fit: cover;
                    border-radius: 15px;
                    width: 100%;

                    // Responsive image height
                    @media (max-width: 768px) {
                        height: 150px !important;
                    }

                    @media (max-width: 480px) {
                        height: 120px !important;
                    }
                }
            }

            .section-one-info {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 10px;
                overflow: hidden;

                .title-text {
                    font-weight: 600;
                    font-size: 20px;
                    min-height: 55px;
                    display: flex;
                    align-items: center;

                    // Responsive title sizing
                    @media (max-width: 768px) {
                        font-size: 18px;
                        min-height: 45px;
                    }

                    @media (max-width: 480px) {
                        font-size: 16px;
                        min-height: 40px;
                    }
                }

                .description-text {
                    max-height: 150px;
                    color: #707070;
                    overflow: hidden;

                    // Responsive description
                    @media (max-width: 768px) {
                        max-height: 100px;
                        font-size: 14px;
                    }

                    @media (max-width: 480px) {
                        max-height: 80px;
                        font-size: 13px;
                    }
                }
            }

            .section-one-hr {
                width: 100%;
                border: 0;
                height: 1px;
                background-color: #707070c0;
                margin-top: 10px;
            }

            .teacher-info {
                display: flex;
                align-items: center;
                justify-content: start;
                gap: 10px;
                margin-top: 10px;

                p {
                    font-weight: 600;
                    font-size: 14px;

                    @media (max-width: 480px) {
                        font-size: 13px;
                    }
                }

                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;

                    @media (max-width: 480px) {
                        width: 40px;
                        height: 40px;
                    }
                }
            }
        }
    }
}

.single-card {
    margin-top: 10px;
    padding: 0 10px;

    h2 {

        text-align: center;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 8px 8px 6px #000000b3;
        font-size: 40px;
        margin-block: 20px;

        @media (max-width: 768px) {
            font-size: 1.25rem;
        }
    }
}

.swiper-button-prev,
.swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    color: white;
    z-index: 10;


    @media (max-width: 640px) {
        display: none !important;
    }
}

.swiper-button-prev {
    left: 10px;

    @media (min-width: 641px) {
        left: -20px;
    }

    @media (max-width: 640px) {
        display: none;
    }
}

.swiper-button-next {
    right: 10px;

    @media (min-width: 641px) {
        right: -20px;
    }

    @media (max-width: 640px) {
        display: none;
    }
}

.swiper-pagination {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;

    // Make pagination more visible on mobile
    @media (max-width: 640px) {
        bottom: -30px;
    }
}

// Custom slide spacing for better mobile experience
.custom-slide {
    padding: 0 5px;

    @media (max-width: 640px) {
        padding: 0 10px;
    }
}
</style>