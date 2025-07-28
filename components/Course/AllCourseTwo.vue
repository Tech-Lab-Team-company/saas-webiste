<script setup lang="ts">
import Arrroww from "~/public/icons/Arrroww.vue";
import Microphone from "~/public/icons/microphone.vue";
import Note from "~/public/icons/note.vue";
import Video1 from "~/public/icons/video1.vue";
import type HomeFirstSection from "~/types/home_first_section";
import type HomeSection from "~/types/home_section_interface";


const containerRef = ref(null)
const props = defineProps<{
  HomeSections: HomeFirstSection[];
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

</script>

<template>
    <div class="single-course-card" style="margin-top: 25px;" 
        v-for="(card, index) in HomeSections" :key="index">
        <NuxtLink :to="`/course/${card?.id}`">
        <div class="course-data">
            <p class="card-title">{{ card?.title }}</p>
            <p class="card-description" v-html="card?.description"></p>
            <div class="course-content-conatiner">
                <p class="data-content" v-if="card.course_videos">
                <p><span>{{ card.course_videos }}</span> <span>فيديو</span></p>
                <video1 />
                </p>
                <p class="data-content" v-if="card.course_docs">
                <p><span>{{ card.course_docs }}</span> <span>ملف ورقي</span></p>
                <Note />
                </p>
                <p class="data-content" v-if="card.course_records">
                <p><span>{{ card.course_records }} </span><span>ملف صوتى</span></p>
                <Microphone />
                </p>
            </div>
            <hr class="card-hr" />
            <div class="card-info">
                <p class="course-price" v-if="card?.course_price && !(card?.is_subscribed)"><span>{{ card?.course_price }} </span> <span>{{ card?.currency }}</span></p>
                <p class="course-price" v-else-if="card?.is_subscribed ">تم شراء الكورس</p>
                <p class="course-price" v-else>مجانى</p>
                <div class="card-teacher">
                    <p class="card-teacher-name">{{ card?.teacher?.name || UserSetting.setting?.name }}</p>
                    <img :src="card?.teacher?.image?.img || UserSetting.setting?.image?.img"
                        :alt="card?.teacher?.image?.alt">
                </div>
            </div>
            <hr class="hr-footer">
            <div class="start-course">
                <Arrroww />
                <p>{{ $t('ابدا الان') }}</p>
            </div>
        </div>

        <div class="card-image-conatiner">
            <img :src="card?.image?.img || UserSetting?.setting?.image?.img" :alt="card?.image?.alt">
        </div>
        </NuxtLink>
    </div>

</template>

<style scoped lang="scss"></style>