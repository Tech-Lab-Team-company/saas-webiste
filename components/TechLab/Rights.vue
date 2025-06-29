<script setup lang="ts">

</script>

<template>
    <div class="rights-container">
        <p>© جميع الحقوق محفوظة لشركة Techlab Business Services 2025</p>
        <p>تم بواسطة Tech lab coding with expert</p>
    </div>
</template>

<style scoped lang="scss">
.rights-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    width: 100%;

    @media (max-width:768px) {
        flex-direction: column;
        justify-content: center;
    }

    p {
        @media (max-width:1000px) {
            text-align: center;
        }

        width: 100%;
        direction: rtl;

        &:last-child {
            text-align: right;

            @media (max-width:1000px) {
                text-align: center;
            }
        }
    }
}
</style>