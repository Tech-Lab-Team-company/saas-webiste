<script setup lang="ts">
import CentersIcons from '~/public/icons/CentersIcons.vue';
import LikeIcon from '~/public/icons/LikeIcon.vue';
import ProfileIcon from '~/public/icons/ProfileIcon.vue';
import StatisticsIcon from '~/public/icons/statisticsIcon.vue';
import type StatisticsInterface from '~/types/statistics_interface';

const props = defineProps({
AboutusStatistics: {
    type: Object as () => StatisticsInterface | null,
    default: null
}
});

const Aboutusstatistics = ref(props.AboutusStatistics);

watch(() => props.AboutusStatistics, (newValue) => {
    Aboutusstatistics.value = newValue;
}, { immediate: true });


</script>

<template>
    <div class="course-statistics-container">
    
        <div class="course-statistics">
            <div class="statistics">
                <p>{{ Aboutusstatistics?.total_rateing }}</p>
                <p>إجمالي التقييمات</p> 
            </div>
            <LikeIcon class="statistics-icon" />
        </div>
        <div class="course-statistics">
            <div class="statistics">
                <p>{{ Aboutusstatistics?.centers_number }}</p>
                <p>سناتر تعليمية</p>
            </div>
            <CentersIcons class="statistics-icon" />
        </div>
        <div class="course-statistics">
            <div class="statistics">
                <p>{{ Aboutusstatistics?.teacher_number }}</p>
                <p>مدرس لدينا</p>
            </div>
            <ProfileIcon class="statistics-icon"  />
        </div>

        <div class="course-statistics">
            <div class="statistics">
                <p>{{ Aboutusstatistics?.strat_year }}</p>
                <p>انطلاقنا</p>
            </div>
            <StatisticsIcon class="statistics-icon" />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>