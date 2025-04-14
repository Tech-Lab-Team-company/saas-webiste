<script setup lang="ts">
    const route = useRoute();
    console.log(route.path);

    definePageMeta({
        layout: 'auth' 
    });
  

</script>

<template>
    <RegisterEducationData/>
</template>

<style scoped lang="scss">

</style>