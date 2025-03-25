import type WebsiteSetting from "~/types/setting";

export const useSettingStore = defineStore("setting", {
    state: () => ({
        setting: null as WebsiteSetting | null
    }),
    actions: {
        setSetting(setting: WebsiteSetting) {
            this.setting = setting
        }
    },
    persist: true,
});