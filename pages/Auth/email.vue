<script setup lang="ts">
    const route = useRoute();
    console.log(route.path);

    definePageMeta({
        layout: 'auth' 
    });
  

</script>

<template>
<RegisterEmail/>
</template>

<style scoped lang="scss">

</style>