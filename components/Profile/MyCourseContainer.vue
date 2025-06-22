
<script setup lang="ts">

</script>

<template>
    <div class="prfile-home">
        <ProfileMyCourseCard class="courses-container aa" />
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

    @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
        margin:0;
        padding: 0;
        display: flex;
        flex-direction: column-reverse;
    }

    .courses-container{
        grid-column: span 5;
        padding: 20px;
        border-radius: 20px;
        background-color: #f6f6f6;

        @media (max-width: 768px) {
            width: 100%;
        }
    }
    // 64% 35%
}

</style>