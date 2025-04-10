<script setup lang="ts">
import CentersIcons from '~/public/icons/CentersIcons.vue';
import LikeIcon from '~/public/icons/LikeIcon.vue';
import ProfileIcon from '~/public/icons/ProfileIcon.vue';
import StatisticsIcon from '~/public/icons/statisticsIcon.vue';


</script>

<template>
    <div class="course-statistics-container">
     


        <div class="course-statistics">
            <div class="statistics">
                <p>4.9</p>
                <p>إجمالي التقييمات</p> 
            </div>
            <LikeIcon class="statistics-icon" />
        </div>
        <div class="course-statistics">
            <div class="statistics">
                <p>+30</p>
                <p>سناتر تعليمية</p>
            </div>
            <CentersIcons class="statistics-icon" />
        </div>
        <div class="course-statistics">
            <div class="statistics">
                <p>+70</p>
                <p>مدرس لدينا</p>
            </div>
            <ProfileIcon class="statistics-icon"  />
        </div>

        <div class="course-statistics">
            <div class="statistics">
                <p>2025</p>
                <p>انطلاقنا</p>
            </div>
            <StatisticsIcon class="statistics-icon" />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>