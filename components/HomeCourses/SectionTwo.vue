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
    slidesPerView: 3,
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
        120: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 20
        },
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
                    <div class="section-two-conatiner">
                        <NuxtLink :to="`/course/${slide?.id}`">
                            <div class="section-two-image">
                                <div class="course-price">
                                    <p v-if="slide?.course_price != 0">{{ slide?.course_price }}{{
                                        userSetting?.setting?.currency || ` جنيه ` }}</p>
                                    <p v-if="slide?.course_price == 0">{{ `مجانى` }}</p>
                                </div>
                                <NuxtImg width="100%" height="300"
                                    :src="slide?.image?.img || UserSetting.setting?.image.img"
                                    :alt="slide?.image?.alt" />
                            </div>
                            <div class="overlay"></div>
                            <div class="section-two-info-container">

                                <div class="section-two-info">
                                    <p class="title-text">{{ slide?.title }}</p>
                                    <p v-html="slide?.description" class="description-text"></p>
                                </div>
                                <hr class="section-two-hr">
                                <div class="teacher-info">
                                    <img :src="slide?.teacher?.image?.img || UserSetting?.setting?.image?.img"
                                        :alt="slide?.teacher?.image?.alt">
                                    <p>{{ slide?.teacher?.name || UserSetting?.setting?.name }}</p>
                                </div>
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
    // max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    background-color: rgba(250, 235, 215, 0.363);
    padding-left: 100px;
    padding-right: 100px;
    padding-bottom: 50px;
    padding-top: 30px;

    a {
        border-radius: 15px;


    }

    .section-one-title {
        text-align: center;
        // margin-top: 10px;
        // margin-bottom: 20px;
        text-shadow: 8px 8px 6px #000000b3;
        font-size: 40px;
        margin-block: 20px;
    }

    .section-two-image {
        position: relative;
        border-radius: 25px;
        box-shadow: 4px 4px 8px #00000040;

        .course-price {
            position: absolute;
            left: 20px;
            top: 5px;
            color: white;
            font-size: 18px;
            font-weight: 700;
            background-color: #FFB949;
            padding: 2px 15px;
            border-radius: 15px;

            p {}
        }

        img {
            border-radius: 15px;
            width: 100%;

        }

        // .overlay{
        //     border-radius: 15px;
        //     position: absolute;
        //     top: 50%;
        //     left: 0;
        //     width: 100%;
        //     height: 50%;
        //     background-color: #00000038;
        // }
    }

    .section-two-conatiner {
        position: relative;
        transition: all 0.3s linear;

        &:hover {
            box-shadow: 5px 1px 10px -1px rgba(0, 0, 0, 0.562);
            border-radius: 15px;
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

        &:hover {
            .overlay {
                top: 0;
                height: 100%;
                border-radius: 15px;
            }

            .section-two-info-container {
                top: 0;
                height: 100%;

                .section-two-info {
                    overflow: hidden;

                    .description-text {
                        max-height: 200px;
                    }
                }
            }

        }

        .overlay {
            transition: all 0.3s linear;

            border-radius: 15px;
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 50%;
            background-color: #0000009a;
        }


        .section-two-info-container {
            position: absolute;
            top: 50%;
            right: 0;
            padding: 6px;
            color: white;
            transition: all 0.3s linear;



            .section-two-info {
                overflow: hidden;

                .title-text {
                    font-size: 20px;
                    font-weight: 700;
                    max-height: 30px;
                    overflow: hidden;
                }

                .description-text {
                    max-height: 50px;
                }
            }

            .section-two-hr {
                width: 100%;
                border: 0;
                height: 1px;
                background-color: white;
                margin-top: 10px;
            }

            .teacher-info {
                z-index: 1000;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;

                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
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
}

.swiper-button-prev {
    left: 10px;
}

.swiper-button-next {
    right: 10px;
}

.swiper-pagination {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
}
</style>