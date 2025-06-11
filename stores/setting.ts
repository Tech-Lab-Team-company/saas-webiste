import { defineStore } from "pinia";
// import type WebsiteSetting from "~/types/setting";
import type WebStatus from "~/types/webStatus";

export const useSettingStore = defineStore("setting", () => {
   const setting = ref<WebStatus | null>(null);

    function setSetting(data: WebStatus) {
        setting.value = data;
    }
    return {
        setting,
        setSetting,
    };
}, { persist: true });