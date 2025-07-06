<script setup lang="ts">
const UserSetting = useSettingStore();

const items = [
    {
        label: 'Add',
        icon: 'pi pi-phone',
        command: () => {
            window.location.href = `tel:${UserSetting.setting?.phone}`
        }

    },
    {
        label: 'Update',
        icon: 'pi pi-whatsapp',
        command: () => {
            window.location.href = `https://wa.me/${UserSetting.setting?.whatsapp}`
        }

    },
];

const SppedDialStyle = computed(() => {
    if (window.innerWidth <= 768) {
        
        return { top: 'calc(82% - 2rem)', left: '1.2rem', 'z-index': '999', position: 'fixed' };
    }
    return { top: 'calc(94% - 2rem)', left: '1rem', 'z-index': '9999', position: 'fixed' };
});
</script>

<template>
    <SpeedDial :model="items" direction="right"
        :style="SppedDialStyle">
        <template #icon>
            <i class="pi pi-cloud"></i>
        </template>
    </SpeedDial>

</template>

<style scoped>

</style>
