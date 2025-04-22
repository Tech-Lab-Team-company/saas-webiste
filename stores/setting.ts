import { defineStore } from "pinia";
// import type WebsiteSetting from "~/types/setting";
import type WebStatus from "~/types/webStatus";

export const useSettingStore = defineStore("setting", {
    state: () => ({
        setting: null as WebStatus | null
    }),
    actions: {
        setSetting(setting: WebStatus) {
            this.setting = setting
        }
    },
    persist: true,
});