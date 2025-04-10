
<script setup lang="ts">

</script>

<template>
    <div class="prfile-home">
       
            <ProfileHome />
            <ProfileSidebar />
      
    </div>

</template>

<style scoped lang="scss">

.prfile-home{
    margin-top: 50px;
    width: 100%;
    text-align: right;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6 , 1fr) ;
    // 64% 35%
}

</style>