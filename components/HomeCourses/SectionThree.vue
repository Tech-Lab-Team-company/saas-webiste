<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type HomeSection from '~/types/home_section_interface';
import { NuxtImg } from '#components';
import CourseVideoIcon from '~/public/icons/CourseVideoIcon.vue';
import Bookicon from '~/public/icons/bookicon.vue';
import Note from '~/public/icons/note.vue';
import Microphone from '~/public/icons/microphone.vue';
import Video1 from '~/public/icons/video1.vue';

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

        <div class="custom-slide">
            <div class="section-one-conatiner" v-for="(slide, idx) in homesection?.courses" :key="idx">
                <NuxtLink :to="`/course/${slide?.id}`" class="card-link">
                    <div class="section-one-image">
                        <NuxtImg width="100%" height="300" :src="slide?.image?.img || UserSetting.setting?.image.img"
                            :alt="slide?.image?.alt" />
                    </div>
                    <div class="course-price">
                        <p v-if="slide?.course_price != 0">{{ slide?.course_price }}{{ userSetting?.setting?.currency ||
                            ` جنيه ` }}</p>
                        <p v-if="slide?.course_price == 0">{{ `مجانى` }}</p>
                    </div>
                    <div class="section-one-info">
                        <p class="title-text">{{ slide?.title }}</p>
                        <p v-html="slide?.description" class="description-text"></p>
                    </div>
                    <hr class="section-one-hr">
                    <div class="course-statistics">
                        <div class="statistics-box" v-if="slide?.course_videos">
                            <Video1 />
                            <span>{{ slide?.course_videos }} فيديو</span>
                        </div>
                        <div class="statistics-box" v-if="slide?.course_docs">
                            <Note />
                            <span>{{ slide?.course_docs }} ملف </span>
                        </div>
                        <div class="statistics-box" v-if="slide?.course_records">
                            <Microphone />
                            <span>{{ slide?.course_records }} ملف صوتى</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>



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
        margin-block: 20px;
        text-shadow: 8px 8px 6px #000000b3;
        font-size: 40px;
    }

    .section-one-conatiner {
        padding: 10px;
        border-radius: 15px;
        background-color: #F1F1F1;
        height: 100%;
        display: flex;
     

        .card-link {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%; // Fill the container height
            text-decoration: none;
            color: inherit;
            border-radius: 20px;
            padding: 10px;
            box-shadow: 5px 1px 10px -1px rgba(0, 0, 0, 0.231372549);
            transition: all 0.2s linear;
            transform: scale(1);
            display: block;
            width: 100%;
            position: relative;

            .course-price {
                position: absolute;
                top: 10px;
                left: 10px;
                color: black;
                background-color: white;
                padding: 5px 15px;
                font-size: 18px;
                font-weight: 600;
                border-radius: 15px;

            }

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
                border-radius: 15px;
                flex-shrink: 0;

                img {
                    border-radius: 15px;
                    object-fit: cover;
                    width: 100%;
                }
            }

            .section-one-info {
                margin-top: 10px;
                flex: 1;
                display: flex;
                flex-direction: column;

                .title-text {
                    font-size: 20px;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .description-text {
                    flex: 1; // Allow description to fill remaining space
                    color: #707070;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 4; // Limit to 4 lines
                    -webkit-box-orient: vertical;
                    line-height: 1.5;
                    min-height: 95px;

                    @media (max-width: 768px) {
                        -webkit-line-clamp: 3; // Limit to 3 lines on tablet
                        font-size: 14px;
                    }

                    @media (max-width: 480px) {
                        -webkit-line-clamp: 2; // Limit to 2 lines on mobile
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
                margin-bottom: 0;
                flex-shrink: 0; // Prevent hr from shrinking
            }

            .course-statistics {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 30px;
                padding-top: 20px;
                flex-shrink: 0; // Prevent statistics from shrinking
                margin-top: auto; // Push to bottom

                .statistics-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
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

// Custom slide styling to ensure equal heights
.custom-slide {
    padding: 0 5px;
    height: auto; // Let swiper handle the height
    direction: rtl;

    @media (max-width: 640px) {
        padding: 0 10px;
    }

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap:20px;

    @media(max-width:768px) {
        grid-template-columns: 1fr 1fr !important;
    }

    @media(max-width:500px) {
        grid-template-columns: 1fr !important;

    }
}


// Ensure all swiper slides have equal height
swiper-container {
    --swiper-slide-height: auto;
}

// Alternative approach: Set a fixed minimum height for cards
.section-one-conatiner {
    min-height: 450px; // Adjust this value based on your content needs

    @media (max-width: 768px) {
        min-height: 400px;
    }

    @media (max-width: 480px) {
        min-height: 350px;
    }
}

.single-card {
    margin-top: 10px;
    padding: 0 10px;

    h2 {
        text-align: center;

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

    @media (max-width: 640px) {
        bottom: -30px;
    }
}
</style>