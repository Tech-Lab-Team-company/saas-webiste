<script setup lang="ts">
import Arrroww from "~/public/icons/Arrroww.vue";
import Microphone from "~/public/icons/microphone.vue";
import Note from "~/public/icons/note.vue";
import Video1 from "~/public/icons/video1.vue";
import type HomeSection from "~/types/home_section_interface";


const containerRef = ref(null)
const props = defineProps<{
    HomeSections: HomeSection;
}>();

const homesection = ref(props.HomeSections)
const UserSetting = useSettingStore();

</script>

<template>
    <div class="single-course-card" style="padding-bottom: 40px;" v-if="homesection?.courses?.length < 2"
        v-for="(card, index) in homesection?.courses" :key="index">
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
                <p class="course-price"><span>{{ card?.course_price }} </span> <span>{{ card?.currency }}</span></p>
                <div class="card-teacher">
                    <p class="card-teacher-name">{{ card?.teacher?.name || UserSetting.setting?.name }}</p>
                    <img :src="card?.teacher?.image?.img || UserSetting.setting?.image?.img"
                        :alt="card?.teacher?.image?.alt">
                </div>
            </div>
            <hr class="hr-footer">
            <div class="start-course">
                <Arrroww class="arrroww-icon"/>
                <p>{{ $t('start_now') }}</p>
            </div>
        </div>

        <div class="card-image-conatiner">
            <img :src="card?.image?.img" :alt="card?.image?.alt">
        </div>
        </NuxtLink>
    </div>

</template>

<style scoped lang="scss"></style>