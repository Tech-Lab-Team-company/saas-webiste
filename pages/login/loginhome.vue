<script setup lang="ts">
import LoginData from '~/components/Login/LoginData.vue';
definePageMeta({
    layout: 'login',
    middleware: ["student-guest"],
});

</script>

<template>
    <div>
        <LoginData />
    </div>
</template>

<style scoped>

</style>
