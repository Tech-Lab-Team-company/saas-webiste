<script setup lang="ts">

const props = defineProps({
    title:{
        type: String
    },
    image:{
        type: String
    }
})
</script>

<template>
    <div class="home-subjects-card">
        <!-- <icons-address class="subject-icon" /> -->
        <NuxtImg :src="image" class="subject-image" alt="subject image" />
        <p class="course-name">{{ title }}</p>
    </div>
</template>