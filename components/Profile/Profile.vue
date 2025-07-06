<script setup lang="ts">

</script>

<template>
    <div class="prfile-home">
        <ProfileHome class="profile-home" />
        <ProfileSidebar />
    </div>
</template>

<style scoped lang="scss">
.prfile-home {
    margin-top: 50px;
    width: 100%;
    text-align: right;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column-reverse;
        gap: 0;
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>