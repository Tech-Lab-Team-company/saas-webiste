<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import PhoneIcon from '~/public/icons/PhoneIcon.vue'; 
import WhatsApp from "@/components/Icons/WhatsApp.vue";

const toast = useToast();
const router = useRouter();
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
</script>

<template>
  <SpeedDial :model="items" direction="right" style=" top: calc(95% - 2rem); left: 1rem ;z-index:999 ;position:fixed" >
    <template #icon>
        <i class="pi pi-cloud"></i>
    </template>
</SpeedDial >

</template>

<style scoped>

</style>


