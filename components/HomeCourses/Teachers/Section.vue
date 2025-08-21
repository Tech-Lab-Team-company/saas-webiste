<script setup lang="ts">
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import FetchGeneralTeachersParams from '~/features/FetchGeneralTeachers/Core/Params/fetch_genral_teachers_params';
import type GeneralTeachersModel from '~/features/FetchGeneralTeachers/Data/models/general_teachers_model';
import FetchGeneralTeachersController from '~/features/FetchGeneralTeachers/presentation/controllers/fetch_general_teachers_controller';


const containerRef = ref(null)
const slides = ref(Array.from({ length: 10 }))

const swiper = useSwiper(containerRef, {
    modules: [Autoplay, Pagination, Navigation, EffectFade],
    slidesPerView: 6,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        reverseDirection: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 5,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 8,
            spaceBetween: 25,
        },
        1200: {
            slidesPerView: 6,
            spaceBetween: 30,
        }
    }
})


const Teachers = ref<GeneralTeachersModel[]>()
const GetTeachers = async () => {
    const fetchGeneralTeacherParams = new FetchGeneralTeachersParams();
    const fetchGeneralTeachersController = FetchGeneralTeachersController.getInstance();
    const state = await fetchGeneralTeachersController.fetchGeneralTeachers(fetchGeneralTeacherParams);

    if (state.value.data) {
        Teachers.value = state.value.data
    }

}

onMounted(() => {
    GetTeachers();
})

const UserSetting = useSettingStore();
</script>

<template>
    <div class="teacher-section">
        <p class="teacher-section-title ">Teachers</p>
        <ClientOnly>
            <swiper-container :autoplay="{
                delay: 500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                // stopOnLastSlide: false
            }" :speed="2000" ref="containerRef" dir="rtl">
                <swiper-slide v-for="(teacher , inedx) in Teachers" :key="inedx">
                    <div class="teacher-card">
                        <NuxtImg class="teacher-image" :src="teacher?.image " />
                        <div class="teacher-info">
                            <p class="teacher-name">{{ teacher?.name }}</p>
                            <p class="teacher-subject">{{ teacher?.mini_description }}</p>
                        </div>
                    </div>
                </swiper-slide>
            </swiper-container>
        </ClientOnly>
    </div>
</template>