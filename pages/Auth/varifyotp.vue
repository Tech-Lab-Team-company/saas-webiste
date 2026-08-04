<script setup lang="ts">
    const route = useRoute();
    // console.log(route.path);

    definePageMeta({
        name: 'verify-account-otp',
        layout: 'auth' 
    });
  

</script>

<template>
    <RegisterEmailCode/>
</template>

<style scoped lang="scss">

</style>
