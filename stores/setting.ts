import { defineStore } from "pinia";
// import type WebsiteSetting from "~/types/setting";
import type WebStatus from "~/types/webStatus";

export const useSettingStore = defineStore("setting", () => {
   const setting = ref<WebStatus | null>(null);

    function setSetting(setting: WebStatus) {
        // console.log(setting, "store ");
        setting.value = setting;
    }
    return {
        setting,
        setSetting,
    };
}, { persist: true });