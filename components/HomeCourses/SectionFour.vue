<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type HomeSection from '~/types/home_section_interface';
import { NuxtImg } from '#components';
import Panel from 'primevue/panel';

import type HomeFirstSection from '~/types/home_first_section';
import { SectionTypeEnum } from "../Home/home/enum/section_type_enum";
import { getWebDomain } from "~/constant/webDomain";
import { baseUrl } from '~/constant/baseUrl';

const { data: studentopinionssection } = await useAsyncData("studentopinionssection", async () => {
    const response = await $fetch<{
        data: HomeFirstSection[];
        message: string;
        status: number;
    }>(`${baseUrl}/fetch_home_website_section`, {
        method: "POST",
        headers: {
            "Accept-Language": "ar",
            "web-domain": getWebDomain(),
        },
        body: {
            type: SectionTypeEnum.StudentOpinions,
        },
    });

    return response.data[response.data.length - 1];
});
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
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                nextEl: null,
                prevEl: null,
            }
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 25,
        },
        1200: {
            slidesPerView: 5,
            spaceBetween: 30,
        }
    }
})

const userSetting = useSettingStore();

</script>

<template>
    <div class="swiper-wrapper-container" v-if="studentopinionssection?.media.length > 1">
        <!-- <Panel class="swiper-panel" :header="nll"  > -->
            <h2 class="section-one-title">{{ studentopinionssection?.title || userSetting?.setting?.name }}</h2>
            <ClientOnly>
                <swiper-container ref="containerRef" dir="rtl">
                    <swiper-slide v-for="(card, index) in studentopinionssection?.media" :key="index"
                        class="custom-slide">
                        <div class="section-one-conatiner">
                            <a :href="card?.link || '#'" target="_blank">
                                <img :src="card.file" :alt="card.alt" class="slider-image" />
                            </a>
                        </div>
                    </swiper-slide>
                </swiper-container>

                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-pagination"></div>

            </ClientOnly>
        <!-- </Panel> -->
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

    .swiper-panel{
        margin-top: 20px;
        box-shadow: 3px 2px 10px 2px rgba(0, 0, 0, 0.2117647059);
        border: none;
        border-radius: 15px;
        
    }


    .section-one-title {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 8px 8px 6px #000000b3;
        font-size: 40px;
        // margin-block: 25px;
    }

    a {
        border-radius: 20px;
        padding: 10px;
        transition: all 0.2s linear;
        transform: scale(1);
        display: block;
        width: 100%;

        img {
            aspect-ratio: 16/12;
        }

        // border: 5px solid rgba(128, 128, 128, 0.534);
        // box-shadow: 5px 1px 10px -1px rgba(0, 0, 0, 0.231372549);

        &:hover {
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

    display: none !important;

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